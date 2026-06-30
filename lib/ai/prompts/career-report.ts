import { SYSTEM_PROMPT, CAREER_REPORT_JSON_SCHEMA } from "./system";
import type { ProfileInput } from "../schemas";

export function buildCareerReportPrompt(profile: ProfileInput): string {
  return `${SYSTEM_PROMPT}

Product context: CareerOS is not a static resume tool. It is a private AI career agent that diagnoses the user, chooses a strategy, and turns the report into weekly execution.

Tone: sharp, premium, confident, direct, slightly provocative. Be honest enough to be useful, but never cruel.

Product requirements:
- Treat the report as the first state of an ongoing career operating system.
- Every analysis section must lead to action, not just insight.
- The 30-day plan must be concrete enough to become dashboard missions.
- The nextBestMove must be specific, time-bound, and tied to the user's stated mode/goal.
- Resume roast should expose weak positioning and then immediately give a stronger positioning angle.
- Compensation analysis must include caveats and never guarantee offers, raises, or outcomes.
- If the resume lacks data, say what proof is missing and how to collect it.

Generate a complete Career Report as JSON matching this schema:
${CAREER_REPORT_JSON_SCHEMA}

Include at least 10 shareCards covering: CAREER_VALUE, UNDERPAID, CAREER_DNA, LOST_MONEY, DREAM_PATH, CAREER_AGE, RESUME_ROAST, SKILL_UNLOCK, CAREER_VELOCITY, FOUNDER_READINESS.

User data:
---
Resume/Profile Text:
${profile.rawResumeText}

${profile.rawLinkedInText ? `LinkedIn Text:\n${profile.rawLinkedInText}\n` : ""}
Current Title: ${profile.currentTitle ?? "Unknown"}
Location: ${profile.location ?? "Unknown"}
Years Experience: ${profile.yearsExperience ?? "Unknown"}
Current Compensation: ${profile.currentCompensationMin && profile.currentCompensationMax ? `$${profile.currentCompensationMin}-$${profile.currentCompensationMax}` : "Not provided"}
Target Compensation: ${profile.targetCompensation ? `$${profile.targetCompensation}` : "Not provided"}
Target Role: ${profile.targetRole ?? "Not specified"}
Dream Role: ${profile.dreamRole ?? "Not specified"}
Career Goal: ${profile.careerGoal ?? "Not specified"}
Industries: ${profile.targetIndustries?.join(", ") ?? "Not specified"}
Job Search Status: ${profile.jobSearchStatus}
Remote Preference: ${profile.remotePreference ?? "Not specified"}
Biggest Frustration: ${profile.biggestFrustration ?? "Not specified"}
---

Return ONLY valid JSON.`;
}
