import { prisma } from "@/lib/prisma";

export async function getUsageSummary(userId?: string) {
  const where = userId ? { userId } : {};
  const [total, cost] = await Promise.all([
    prisma.aiUsageLog.count({ where }),
    prisma.aiUsageLog.aggregate({
      where: { ...where, success: true },
      _sum: { estimatedCostUsd: true, totalTokens: true },
    }),
  ]);
  return {
    totalRequests: total,
    totalTokens: cost._sum.totalTokens ?? 0,
    estimatedCostUsd: cost._sum.estimatedCostUsd ?? 0,
  };
}
