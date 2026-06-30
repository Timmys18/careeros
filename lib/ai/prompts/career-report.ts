import { SYSTEM_PROMPT, CAREER_REPORT_JSON_SCHEMA } from "./system";
import type { ProfileInput } from "../schemas";

export function buildCareerReportPrompt(profile: ProfileInput): string {
  return `${SYSTEM_PROMPT}

Product context: CareerOS helps professionals understand their market value, career DNA, lost money, and next best move. Tone: sharp, premium, confident, slightly provocative.

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
