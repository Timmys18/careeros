import { prisma } from "@/lib/prisma";
import { getEnvInt } from "@/lib/utils";
import { getDailyAiCost, getMonthlyAiCost } from "@/lib/ai/generate-report";

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export async function checkReportRateLimits(opts: {
  userId?: string;
  ip?: string;
  isPro?: boolean;
}): Promise<RateLimitResult> {
  const globalLimit = getEnvInt("MAX_DAILY_REPORTS_GLOBAL", 500);
  const userLimit = getEnvInt("MAX_DAILY_REPORTS_PER_USER", 1);
  const ipLimit = getEnvInt("MAX_DAILY_REPORTS_PER_IP", 3);
  const maxDailyCost = getEnvFloat("MAX_DAILY_AI_COST_USD", 10);
  const maxMonthlyCost = getEnvFloat("MAX_MONTHLY_AI_COST_USD", 100);

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const globalCount = await prisma.careerReport.count({
    where: { createdAt: { gte: start }, status: { in: ["COMPLETED", "PROCESSING"] } },
  });

  if (globalCount >= globalLimit) {
    return {
      allowed: false,
      reason:
        "CareerOS is temporarily limiting free AI report generation. You can still view the demo report or try again later.",
    };
  }

  if (opts.userId) {
    const userCount = await prisma.careerReport.count({
      where: {
        userId: opts.userId,
        createdAt: { gte: start },
        status: { in: ["COMPLETED", "PROCESSING"] },
      },
    });

    const limit = opts.isPro ? 10 : userLimit;
    if (userCount >= limit) {
      return {
        allowed: false,
        reason: opts.isPro
          ? "You've reached your daily report limit. Try again tomorrow."
          : "Free plan includes 1 report per day. Upgrade to Pro for more.",
      };
    }
  }

  if (opts.ip) {
    const ipEvents = await prisma.analyticsEvent.count({
      where: {
        eventName: "report_generation_started",
        createdAt: { gte: start },
        properties: { path: ["ip"], equals: opts.ip },
      },
    });
    if (ipEvents >= ipLimit && !opts.userId) {
      return {
        allowed: false,
        reason:
          "CareerOS is temporarily limiting free AI report generation. You can still view the demo report or try again later.",
      };
    }
  }

  const dailyCost = await getDailyAiCost();
  if (dailyCost >= maxDailyCost) {
    return {
      allowed: false,
      reason:
        "CareerOS is temporarily limiting free AI report generation. You can still view the demo report or try again later.",
    };
  }

  const monthlyCost = await getMonthlyAiCost();
  if (monthlyCost >= maxMonthlyCost) {
    return {
      allowed: false,
      reason:
        "CareerOS is temporarily limiting AI report generation. Please try again later.",
    };
  }

  return { allowed: true };
}

function getEnvFloat(key: string, fallback: number): number {
  const val = process.env[key];
  if (!val) return fallback;
  const parsed = parseFloat(val);
  return Number.isNaN(parsed) ? fallback : parsed;
}
