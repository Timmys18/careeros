import { z } from "zod";

export const careerDnaTypeSchema = z.enum([
  "Builder",
  "Operator",
  "Visionary",
  "Founder",
  "Scientist",
  "Seller",
  "Strategist",
  "Craftsperson",
]);

export const careerReportAIOutputSchema = z.object({
  summary: z.object({
    headline: z.string(),
    shortAssessment: z.string(),
    strongestSignal: z.string(),
    biggestRisk: z.string(),
    nextBestMove: z.string(),
  }),
  careerValue: z.object({
    conservativeMin: z.number(),
    conservativeMax: z.number(),
    realisticMin: z.number(),
    realisticMax: z.number(),
    stretchMin: z.number(),
    stretchMax: z.number(),
    currency: z.string(),
    confidence: z.number().min(0).max(100),
    reasoning: z.array(z.string()),
    valueDrivers: z.array(z.string()),
    valueLimiters: z.array(z.string()),
    disclaimer: z.string(),
  }),
  careerDna: z.object({
    primaryType: careerDnaTypeSchema,
    secondaryType: z.string(),
    breakdown: z.record(z.string(), z.number()),
    explanation: z.string(),
    superpower: z.string(),
    bottleneck: z.string(),
  }),
  lostMoney: z.object({
    estimatedLostAmountMin: z.number(),
    estimatedLostAmountMax: z.number(),
    currency: z.string(),
    periodYears: z.number(),
    confidence: z.number().min(0).max(100),
    explanation: z.string(),
    assumptions: z.array(z.string()),
  }),
  dreamPath: z.object({
    goal: z.string(),
    routes: z.array(
      z.object({
        name: z.string(),
        steps: z.array(
          z.object({
            title: z.string(),
            expectedTimeline: z.string(),
            requiredSkills: z.array(z.string()),
            proofPoints: z.array(z.string()),
            risks: z.array(z.string()),
          }),
        ),
        upside: z.string(),
        risk: z.string(),
        probability: z.number().min(0).max(100),
      }),
    ),
  }),
  resumeRoast: z.object({
    roastLevel: z.enum(["light", "medium", "brutal"]),
    oneLiner: z.string(),
    issues: z.array(z.string()),
    improvedPositioning: z.string(),
  }),
  profileFixes: z.object({
    linkedinHeadline: z.string(),
    linkedinAbout: z.string(),
    bioShort: z.string(),
    bioLong: z.string(),
    resumeBullets: z.array(z.string()),
  }),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      importance: z.number().min(1).max(10),
      salaryImpact: z.string(),
      howToProve: z.string(),
      suggestedAction: z.string(),
    }),
  ),
  next30DaysPlan: z.array(
    z.object({
      week: z.number(),
      focus: z.string(),
      actions: z.array(z.string()),
      expectedOutcome: z.string(),
    }),
  ),
  shareCards: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      subtitle: z.string(),
      valueText: z.string().optional(),
      bodyText: z.string().optional(),
      tone: z.enum(["status", "funny", "serious", "fomo", "identity"]),
    }),
  ),
});

export type CareerReportAIOutput = z.infer<typeof careerReportAIOutputSchema>;

export const profileInputSchema = z.object({
  rawResumeText: z.string().min(50),
  rawLinkedInText: z.string().optional(),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  location: z.string().optional(),
  yearsExperience: z.number().optional(),
  currentCompensationMin: z.number().optional(),
  currentCompensationMax: z.number().optional(),
  currentCompensationCurrency: z.string().default("USD"),
  targetCompensation: z.number().optional(),
  targetRole: z.string().optional(),
  dreamRole: z.string().optional(),
  targetIndustries: z.array(z.string()).optional(),
  jobSearchStatus: z.string(),
  relocationPreference: z.string().optional(),
  remotePreference: z.string().optional(),
  careerGoal: z.string().optional(),
  biggestFrustration: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
