import { z } from "zod";

export const getDatasetQuerySchema = z.object({
  query: z.object({
    id: z.string().transform(Number)
  }).strict(),
  params: z.object({}).strict(),
  body: z.object({}).strict()
});