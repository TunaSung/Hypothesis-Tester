import { z } from "zod";

// Suggest
const base = {
  datasetId: z.number().int().positive(),
};
export const suggestSchema = z.object({
  body: z
    .object({
      ...base,
      question: z.string().min(5),
    })
    .strict(),

  query: z.object({}).strict(),

  params: z.object({}).strict(),
});
export type SuggestBody = z.infer<typeof suggestSchema>["body"];

// Analysis
const ci = { ciLevel: z.number().min(0.8).max(0.999).optional() };

const independentArgs = z
  .object({
    groupKey: z.string(),
    valueKey: z.string(),
    ...ci,
  })
  .strict();

const pairedArgs = z
  .object({
    preKey: z.string(),
    postKey: z.string(),
    ...ci,
  })
  .strict();

const anovaArgs = z
  .object({
    groupKey: z.string(),
    valueKey: z.string(),
    ...ci,
  })
  .strict();

const correlationArgs = z
  .object({
    xKey: z.string(),
    yKey: z.string(),
    ...ci,
  })
  .strict();

export const runAnalysisSchema = z.object({
  body: z.discriminatedUnion("method", [
    z.object({
      ...base,
      method: z.literal("independent_t"),
      args: independentArgs,
    }),
    z.object({
      ...base,
      method: z.literal("paired_t"),
      args: pairedArgs,
    }),
    z.object({
      ...base,
      method: z.literal("anova"),
      args: anovaArgs,
    }),
    z.object({
      ...base,
      method: z.literal("correlation"),
      args: correlationArgs,
    }),
  ]),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
export type RunAnalysisBody = z.infer<typeof runAnalysisSchema>["body"];

// History
export const listAnalysesByIdKeysetSchema = z.object({
  body: z.object({}).strict(),
  query: z
    .object({
      limit: z.coerce.number().int().min(1).max(100).default(20),
      after: z.string().optional(),
      before: z.string().optional(),
      datasetId: z.coerce.number().int().optional(),
      method: z.string().trim().optional(),
      includeTotal: z.string().trim().optional(),
      includeStats: z.string().trim().optional(),
    })
    .strict(),
  params: z.object({}).strict(),
});
export type ListAnalysesByIdKeysetQuery = z.infer<typeof listAnalysesByIdKeysetSchema>["query"]