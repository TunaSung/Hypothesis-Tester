import OpenAI from "openai";
import "dotenv/config";
import { z } from "zod";

/**
 * 目前只允許四種方法
 */
const SuggestionSchema = z.object({
  method: z.enum(["independent_t", "paired_t", "anova", "correlation"]),
  why: z.string().min(1),
});
type Suggestion = z.infer<typeof SuggestionSchema>;

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * 根據欄位與研究問題，產出「建議的統計方法」
 */
export async function suggestMethod(params: {
  columns: string[];
  question: string;
}): Promise<Suggestion> {
  const { columns, question } = params;

  if (!client) return ruleBasedSuggest(columns, question);

  // system 指令
  const prompt = [
    `You are a statistician.`,
    `Choose exactly one method from: independent_t, paired_t, anova, correlation.`,
    `Return only a JSON object like: {"method":"...", "why":"..."} (no extra text).`,
  ].join(" ");

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `columns: ${JSON.stringify(columns)}\nquestion: ${question}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });
    const text = resp.choices[0]?.message?.content ?? "{}";

    // 解析 + 驗證
    const parsed = SuggestionSchema.safeParse(JSON.parse(text));
    if (parsed.success) return parsed.data;

    // 不合格走 fallback
    return ruleBasedSuggest(columns, question, "malformed_model_output");
  } catch (err) {
    return ruleBasedSuggest(columns, question, "api_error");
  }
}

/**
 * 生成解釋
 */
export async function explainResult(input: any, result: any): Promise<string> {
  if (!client) {
    const pStr = result?.p?.toFixed?.(4) ?? "?";
    return `Summary: p = ${pStr}. If p < 0.05, the difference is statistically significant; if p ≥ 0.05, the evidence is insufficient to reject the null hypothesis.`;
  }

  const userContent = [
    `Explain this statistical result in plain English, concise but accurate.`,
    `Include: which test was used, what the p-value implies, and a short practical implication.`,
    `Input: ${JSON.stringify(input)}`,
    `Result: ${JSON.stringify(result)}`,
  ].join("\n");

  try {
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "You are a careful statistician and clear technical writer.",
        },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
    });
    return (resp.output_text ?? "").trim();
  } catch {
    const pStr = result?.p?.toFixed?.(4) ?? "?";
    return `Summary: p = ${pStr}. If p < 0.05, the difference is statistically significant; if p ≥ 0.05, the evidence is insufficient to reject the null hypothesis.`;
  }
}

/** Fallbacks **/

/**
 * API 失敗或額度用完時用
 */
function ruleBasedSuggest(
  columns: string[],
  question: string,
  reason: string = "no_api_key"
): Suggestion {
  const q = question.toLowerCase();
  // 關鍵字判斷
  if (q.includes("相關") || q.includes("correlat"))
    return { method: "correlation", why: "題意詢問關聯性" };
  if (q.includes("前後") || q.includes("paired") || q.includes("同一受試者"))
    return { method: "paired_t", why: "配對/重複測量設計" };
  if (q.includes("三組") || q.includes("多組") || q.includes("anova"))
    return { method: "anova", why: "三組以上群組比較" };
  return { method: "independent_t", why: `預設二組比較（${reason}）` };
}
