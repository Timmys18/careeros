import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateCareerReport, sanitizeProfileInput } from "@/lib/ai/generate-report";
import { mapShareCardsFromReport } from "@/lib/cards";
import { checkReportRateLimits } from "@/lib/rate-limit";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { isProUser } from "@/lib/payments";
import type { ProfileInput } from "@/lib/ai/schemas";
import type { JobSearchStatus } from "@/app/generated/prisma/client";

export async function generateReportForProfile(
  profileId: string,
  userId: string,
  ip?: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const profile = await prisma.careerProfile.findFirst({
    where: { id: profileId, userId },
  });
  if (!profile) throw new Error("Profile not found");

  const isPro = isProUser(user.subscriptionStatus);

  const rateCheck = await checkReportRateLimits({ userId, ip, isPro });
  if (!rateCheck.allowed) {
    throw new Error(rateCheck.reason);
  }

  const profileInput: ProfileInput = sanitizeProfileInput({
    rawResumeText: profile.rawResumeText,
    rawLinkedInText: profile.rawLinkedInText ?? undefined,
    currentTitle: profile.currentTitle ?? undefined,
    currentCompany: profile.currentCompany ?? undefined,
    location: profile.location ?? undefined,
    yearsExperience: profile.yearsExperience ?? undefined,
    currentCompensationMin: profile.currentCompensationMin ?? undefined,
    currentCompensationMax: profile.currentCompensationMax ?? undefined,
    currentCompensationCurrency: profile.currentCompensationCurrency,
    targetCompensation: profile.targetCompensation ?? undefined,
    targetRole: profile.targetRole ?? undefined,
    dreamRole: profile.dreamRole ?? undefined,
    targetIndustries: (profile.targetIndustries as string[]) ?? undefined,
    jobSearchStatus: profile.jobSearchStatus,
    relocationPreference: profile.relocationPreference ?? undefined,
    remotePreference: profile.remotePreference ?? undefined,
    careerGoal: profile.careerGoal ?? undefined,
    biggestFrustration: profile.biggestFrustration ?? undefined,
  });

  const report = await prisma.careerReport.create({
    data: {
      userId,
      profileId,
      status: "PROCESSING",
    },
  });

  await trackEvent(EVENTS.REPORT_GENERATION_STARTED, {
    userId,
    properties: { reportId: report.id, ip },
  });

  try {
    const { output, model } = await generateCareerReport(profileInput, {
      userId,
      reportId: report.id,
    });

    const updated = await prisma.careerReport.update({
      where: { id: report.id },
      data: {
        status: "COMPLETED",
        aiModel: model,
        summary: output.summary,
        careerValue: output.careerValue,
        careerDna: output.careerDna,
        lostMoney: output.lostMoney,
        dreamPath: output.dreamPath,
        resumeRoast: output.resumeRoast,
        profileFixes: output.profileFixes,
        skillGaps: output.skillGaps,
        next30DaysPlan: output.next30DaysPlan,
        fullReport: output,
        isProUnlocked: isPro,
      },
    });

    const cards = mapShareCardsFromReport(output);
    await prisma.shareCard.createMany({
      data: cards.map((card) => ({
        ...card,
        userId,
        reportId: report.id,
      })),
    });

    await trackEvent(EVENTS.REPORT_GENERATION_COMPLETED, {
      userId,
      properties: { reportId: report.id },
    });
    await trackEvent(EVENTS.CARD_CREATED, {
      userId,
      properties: { reportId: report.id, count: cards.length },
    });

    return updated;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    await prisma.careerReport.update({
      where: { id: report.id },
      data: { status: "FAILED", errorMessage: message },
    });
    await trackEvent(EVENTS.REPORT_GENERATION_FAILED, {
      userId,
      properties: { reportId: report.id, error: message },
    });
    throw error;
  }
}

export function profileFromOnboarding(data: Record<string, unknown>, resumeText: string) {
  return {
    rawResumeText: resumeText,
    rawLinkedInText: (data.linkedInText as string) || undefined,
    currentTitle: data.currentTitle as string,
    currentCompany: data.currentCompany as string | undefined,
    location: data.location as string,
    yearsExperience: parseInt(data.yearsExperience as string, 10) || undefined,
    currentCompensationMin: parseInt(data.currentCompMin as string, 10) || undefined,
    currentCompensationMax: parseInt(data.currentCompMax as string, 10) || undefined,
    targetCompensation: parseInt(data.targetComp as string, 10) || undefined,
    targetRole: data.targetRole as string | undefined,
    dreamRole: data.dreamRole as string,
    targetIndustries: (data.industries as string)?.split(",").map((s) => s.trim()).filter(Boolean),
    jobSearchStatus: (data.jobSearchStatus as JobSearchStatus) || "CASUALLY_OPEN",
    relocationPreference: data.relocation as string | undefined,
    remotePreference: data.remotePreference as string | undefined,
    careerGoal: data.careerGoal as string,
    biggestFrustration: data.frustration as string,
  };
}
