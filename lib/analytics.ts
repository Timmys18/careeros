import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export async function trackEvent(
  eventName: string,
  opts: {
    userId?: string;
    sessionId?: string;
    properties?: Record<string, unknown>;
  } = {},
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        userId: opts.userId,
        sessionId: opts.sessionId,
        properties: (opts.properties ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch {
    // non-blocking
  }
}

export const EVENTS = {
  LANDING_VIEWED: "landing_viewed",
  DEMO_VIEWED: "demo_viewed",
  START_CLICKED: "start_clicked",
  RESUME_UPLOADED: "resume_uploaded",
  RESUME_PASTED: "resume_pasted",
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  REPORT_GENERATION_STARTED: "report_generation_started",
  REPORT_GENERATION_COMPLETED: "report_generation_completed",
  REPORT_GENERATION_FAILED: "report_generation_failed",
  REPORT_VIEWED: "report_viewed",
  CARD_CREATED: "card_created",
  CARD_SHARED: "card_shared",
  PUBLIC_CARD_VIEWED: "public_card_viewed",
  PAYWALL_VIEWED: "paywall_viewed",
  CHECKOUT_STARTED: "checkout_started",
  PRO_UNLOCKED: "pro_unlocked",
  DASHBOARD_VIEWED: "dashboard_viewed",
} as const;
