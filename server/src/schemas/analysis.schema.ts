import { z } from "zod";

// suggest
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
// analysis
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
