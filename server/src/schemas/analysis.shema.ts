import { z } from "zod";

// ========== 建議方法（AI）用 ==========
export const suggestSchema = z.object({
  // 驗證 req.body
  body: z.object({
    // datasetId 必須是正整數
    datasetId: z.number().int().positive(),

    // question 必須是長度 >= 5 的字串
    question: z.string().min(5)
  }),

  // 驗證 req.query
  // 使用 passthrough() → 接受任何查詢參數，不檢查、不刪除
  query: z.object({}).passthrough(),

  // 驗證 req.params
  // 同樣允許任何路由參數，不限制
  params: z.object({}).passthrough()
});

// ========== 執行分析 ==========
export const runAnalysisSchema = z.object({
  // 驗證 req.body
  body: z.object({
    // datasetId 必須是正整數
    datasetId: z.number().int().positive(),

    // method 限定只能是這四種統計方法
    method: z.enum(["independent_t","paired_t","anova","correlation"]),

    // args: 額外參數
    // - 不限定內容，允許任何 key-value 組合
    // - ex: { groupKey, valueKey }（t-test）
    // - ex: { xKey, yKey }（correlation）
    args: z
      .object({
        // 依不同方法會用到不同鍵，為簡化先都 optional
        groupKey: z.string().optional(),
        valueKey: z.string().optional(),
        subjectKey: z.string().optional(),
        preKey: z.string().optional(),
        postKey: z.string().optional(),
        xKey: z.string().optional(),
        yKey: z.string().optional(),
        ciLevel: z.number().min(0.8).max(0.999).optional()
      })
      .passthrough()
  }),

  // 保留 query，允許任何參數
  query: z.object({}).passthrough(),

  // 保留 params，允許任何路由參數
  params: z.object({}).passthrough()
});
