import OpenAI from "openai";
import { getEnvBool, getEnvInt } from "@/lib/utils";
import { generateMockReport } from "./mock-report";
import { buildCareerReportPrompt } from "./prompts/career-report";
import {
  careerReportAIOutputSchema,
  type CareerReportAIOutput,
  type ProfileInput,
} from "./schemas";
import { prisma } from "@/lib/prisma";

const COST_PER_1K_INPUT = 0.00015;
const COST_PER_1K_OUTPUT = 0.0006;

export function isMockAiEnabled(): boolean {
  return getEnvBool("ENABLE_MOCK_AI", false) || !process.env.OPENAI_API_KEY;
}

export async function generateCareerReport(
  profile: ProfileInput,
  opts: { userId?: string; reportId?: string } = {},
): Promise<{ output: CareerReportAIOutput; model: string; usage: UsageInfo }> {
  if (isMockAiEnabled()) {
    const output = generateMockReport(profile);
    await logUsage({
      ...opts,
      provider: "mock",
      model: "mock-v1",
      requestType: "career_report",
      inputTokens: estimateTokens(buildCareerReportPrompt(profile)),
      outputTokens: estimateTokens(JSON.stringify(output)),
      success: true,
    });
    return { output, model: "mock-v1", usage: { inputTokens: 0, outputTokens: 0, estimatedCostUsd: 0 } };
  }

  const model = process.env.OPENAI_MODEL_REPORT ?? "gpt-4o-mini";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = buildCareerReportPrompt(profile);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = careerReportAIOutputSchema.parse(JSON.parse(content));
    const inputTokens = response.usage?.prompt_tokens ?? estimateTokens(prompt);
    const outputTokens = response.usage?.completion_tokens ?? estimateTokens(content);
    const estimatedCostUsd =
      (inputTokens / 1000) * COST_PER_1K_INPUT + (outputTokens / 1000) * COST_PER_1K_OUTPUT;

    await logUsage({
      ...opts,
      provider: "openai",
      model,
      requestType: "career_report",
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      estimatedCostUsd,
      success: true,
    });

    return {
      output: parsed,
      model,
      usage: { inputTokens, outputTokens, estimatedCostUsd },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    await logUsage({
      ...opts,
      provider: "openai",
      model,
      requestType: "career_report",
      success: false,
      errorMessage: message,
    });
    throw error;
  }
}

type UsageInfo = {
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
};

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

async function logUsage(data: {
  userId?: string;
  reportId?: string;
  provider: string;
  model: string;
  requestType: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  success: boolean;
  errorMessage?: string;
}) {
  try {
    await prisma.aiUsageLog.create({
      data: {
        userId: data.userId,
        reportId: data.reportId,
        provider: data.provider,
        model: data.model,
        requestType: data.requestType,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        totalTokens: data.totalTokens ?? (data.inputTokens ?? 0) + (data.outputTokens ?? 0),
        estimatedCostUsd: data.estimatedCostUsd,
        success: data.success,
        errorMessage: data.errorMessage,
      },
    });
  } catch {
    // non-blocking
  }
}

export async function getDailyAiCost(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const result = await prisma.aiUsageLog.aggregate({
    where: { createdAt: { gte: start }, success: true },
    _sum: { estimatedCostUsd: true },
  });
  return result._sum.estimatedCostUsd ?? 0;
}

export async function getMonthlyAiCost(): Promise<number> {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const result = await prisma.aiUsageLog.aggregate({
    where: { createdAt: { gte: start }, success: true },
    _sum: { estimatedCostUsd: true },
  });
  return result._sum.estimatedCostUsd ?? 0;
}

export function getInputLimits() {
  return {
    maxResumeChars: getEnvInt("MAX_RESUME_CHARS", 20000),
    maxLinkedInChars: getEnvInt("MAX_LINKEDIN_CHARS", 20000),
    maxOnboardingAnswerChars: getEnvInt("MAX_ONBOARDING_ANSWER_CHARS", 1000),
  };
}

export function sanitizeProfileInput(profile: ProfileInput): ProfileInput {
  const limits = getInputLimits();
  return {
    ...profile,
    rawResumeText: profile.rawResumeText.slice(0, limits.maxResumeChars),
    rawLinkedInText: profile.rawLinkedInText?.slice(0, limits.maxLinkedInChars),
  };
}
