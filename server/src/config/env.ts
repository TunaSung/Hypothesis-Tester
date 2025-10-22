import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3030),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
});

const parsed = EnvSchema.parse(process.env);

export const env = {
  ...parsed,
  origins: parsed.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
};
export type Env = typeof env;
