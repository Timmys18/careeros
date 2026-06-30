export const SHARE_CARD_TYPES = [
  "CAREER_VALUE",
  "UNDERPAID",
  "CAREER_DNA",
  "LOST_MONEY",
  "DREAM_PATH",
  "CAREER_AGE",
  "RESUME_ROAST",
  "SKILL_UNLOCK",
  "CAREER_VELOCITY",
  "FOUNDER_READINESS",
] as const;

export const SHARE_CARD_PROMPT = `Generate share cards from the saved career report JSON. Cards should be visually compelling, safe for public sharing, and never include email, phone, raw resume, or employer-sensitive details.`;
