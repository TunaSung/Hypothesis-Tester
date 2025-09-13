import { z } from "zod";

// 定義一個 schema，適用於 Express request 驗證
export const getDatasetQuerySchema = z.object({
  // 驗證 req.query
  query: z.object({
    // id 必須是字串，但透過 transform(Number) 轉換成數字
    // 如果 id 不是數字字串，會轉成 NaN，不會報錯
    id: z.string().transform(Number)
  }),

  // 驗證 req.params
  // 這裡允許任何參數通過，使用 passthrough() 代表不驗證也不刪掉
  params: z.object({}).passthrough(),

  // 驗證 req.body
  // 同樣允許任何 body 通過
  body: z.object({}).passthrough()
});