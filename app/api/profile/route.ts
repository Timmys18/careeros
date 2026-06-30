import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileInputSchema } from "@/lib/ai/schemas";
import type { JobSearchStatus } from "@/app/generated/prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileInputSchema.parse(body);

    const profile = await prisma.careerProfile.create({
      data: {
        userId: session.user.id,
        rawResumeText: parsed.rawResumeText,
        rawLinkedInText: parsed.rawLinkedInText,
        currentTitle: parsed.currentTitle,
        currentCompany: parsed.currentCompany,
        location: parsed.location,
        yearsExperience: parsed.yearsExperience,
        currentCompensationMin: parsed.currentCompensationMin,
        currentCompensationMax: parsed.currentCompensationMax,
        currentCompensationCurrency: parsed.currentCompensationCurrency,
        targetCompensation: parsed.targetCompensation,
        targetRole: parsed.targetRole,
        dreamRole: parsed.dreamRole,
        targetIndustries: parsed.targetIndustries ?? [],
        jobSearchStatus: parsed.jobSearchStatus as JobSearchStatus,
        relocationPreference: parsed.relocationPreference,
        remotePreference: parsed.remotePreference,
        careerGoal: parsed.careerGoal,
        biggestFrustration: parsed.biggestFrustration,
      },
    });

    return NextResponse.json({ profileId: profile.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
