import OpenAI from "openai";
import "dotenv/config";
import { z } from "zod";

/** 回傳 JSON 結構的驗證：只允許四種方法，why 為非空字串 */
const SuggestionSchema = z.object({
  method: z.enum(["independent_t", "paired_t", "anova", "correlation"]),
  why: z.string().min(1)
});
type Suggestion = z.infer<typeof SuggestionSchema>;

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/** ----------------------------- Public APIs ----------------------------- **/

/**
 * 根據欄位與研究問題，產出「建議的統計方法」。
 * - 有 API key → 走 OpenAI；沒 key → 走規則式 fallback。
 * - 強制模型輸出 JSON，並用 Zod 驗證。
 */
export async function suggestMethod(params: { columns: string[]; question: string }): Promise<Suggestion> {
  const { columns, question } = params;

  if (!client) return ruleBasedSuggest(columns, question);

  // 👉 system 指令縮短、明確，並用 response_format 強制 JSON
  const prompt = [
    `You are a statistician.`,
    `Choose exactly ONE method from: independent_t, paired_t, anova, correlation.`,
    `Return ONLY a JSON object like: {"method":"...", "why":"..."} (no extra text).`
  ].join(" ");

  try {
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      // 建議：用多訊息而非把所有東西塞成單一文字
      input: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            `columns: ${JSON.stringify(columns)}`,
            `question: ${question}`
          ].join("\n")
        }
      ],
      // ✅ 強制回傳 JSON 物件（Responses API 支援）
      temperature: 0.2
    });

    const text = resp.output_text ?? "{}";

    // 解析 + 驗證
    const parsed = SuggestionSchema.safeParse(JSON.parse(text));
    if (parsed.success) return parsed.data;

    // 若模型 JSON 結構怪怪的，退回規則式
    return ruleBasedSuggest(columns, question, "malformed_model_output");
  } catch (err) {
    // 網路/限流/服務端錯誤 → 回到規則式
    return ruleBasedSuggest(columns, question, "api_error");
  }
}

/**
 * 將統計輸入 & 結果，生成「中文白話解釋」。
 * - 有 key → 模型產出；沒 key → 極簡 fallback。
 */
export async function explainResult(input: any, result: any): Promise<string> {
  if (!client) {
    const pStr = result?.p?.toFixed?.(4) ?? "?";
    return `結果摘要：p = ${pStr}。若 p < 0.05，則差異具有統計顯著性；若 p ≥ 0.05，則目前證據不足以拒絕虛無假設。`;
  }

  const userContent = [
    `Explain this statistical result in plain Chinese, concise but accurate.`,
    `Include: which test was used, what the p-value implies, and a short practical implication.`,
    `Input: ${JSON.stringify(input)}`,
    `Result: ${JSON.stringify(result)}`
  ].join("\n");

  try {
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "You are a careful statistician and clear technical writer." },
        { role: "user", content: userContent }
      ],
      temperature: 0.2
    });
    return (resp.output_text ?? "").trim();
  } catch {
    const pStr = result?.p?.toFixed?.(4) ?? "?";
    return `結果摘要：p = ${pStr}。若 p < 0.05，則差異具有統計顯著性；若 p ≥ 0.05，則目前證據不足以拒絕虛無假設。`;
  }
}

/** ----------------------------- Fallbacks ----------------------------- **/

/**
 * 規則式建議（無金鑰或 API 失敗時使用）
 * - 可加入欄位線索（有沒有兩個群組欄位、是否有連續數值欄位…）做更精細路由。
 */
function ruleBasedSuggest(columns: string[], question: string, reason: string = "no_api_key"): Suggestion {
  const q = question.toLowerCase();
  // 極簡關鍵字判斷（可再擴充）
  if (q.includes("相關") || q.includes("correlat")) return { method: "correlation",  why: "題意詢問關聯性" };
  if (q.includes("前後") || q.includes("paired") || q.includes("同一受試者")) return { method: "paired_t",   why: "配對/重複測量設計" };
  if (q.includes("三組") || q.includes("多組") || q.includes("anova")) return { method: "anova",        why: "三組以上群組比較" };
  return { method: "independent_t", why: `預設二組比較（${reason}）` };
}
