import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url().optional(),
  APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ENABLE_MOCK_AI: z.string().optional(),
  ENABLE_MOCK_PAYMENTS: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success && process.env.NODE_ENV === "production") {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.success
    ? parsed.data
    : ({
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "dev-only-secret-min-16-chars",
        NODE_ENV: (process.env.NODE_ENV as "development") ?? "development",
      } as Env);
}

export const env = validateEnv();

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

export function getAppUrl(): string {
  return process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}
