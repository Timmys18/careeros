import type { ShareCardType } from "@/app/generated/prisma/client";
import type { CareerReportAIOutput } from "@/lib/ai/schemas";

const CARD_TYPE_MAP: Record<string, ShareCardType> = {
  CAREER_VALUE: "CAREER_VALUE",
  UNDERPAID: "UNDERPAID",
  CAREER_DNA: "CAREER_DNA",
  LOST_MONEY: "LOST_MONEY",
  DREAM_PATH: "DREAM_PATH",
  CAREER_AGE: "CAREER_AGE",
  RESUME_ROAST: "RESUME_ROAST",
  SKILL_UNLOCK: "SKILL_UNLOCK",
  CAREER_VELOCITY: "CAREER_VELOCITY",
  FOUNDER_READINESS: "FOUNDER_READINESS",
};

export function mapShareCardsFromReport(
  report: CareerReportAIOutput,
): Array<{
  type: ShareCardType;
  title: string;
  subtitle: string | null;
  valueText: string | null;
  bodyText: string | null;
  theme: string;
}> {
  return report.shareCards.map((card) => ({
    type: CARD_TYPE_MAP[card.type] ?? "CAREER_VALUE",
    title: card.title,
    subtitle: card.subtitle || null,
    valueText: card.valueText ?? null,
    bodyText: card.bodyText ?? null,
    theme: card.tone,
  }));
}

export const CARD_THEMES: Record<string, { gradient: string; accent: string }> = {
  status: { gradient: "from-violet-950/80 via-indigo-950/60 to-[#0a0814]", accent: "text-violet-300" },
  funny: { gradient: "from-amber-950/70 via-orange-950/50 to-[#0f0a06]", accent: "text-amber-300" },
  serious: { gradient: "from-zinc-900/90 via-slate-900/70 to-[#060608]", accent: "text-zinc-300" },
  fomo: { gradient: "from-rose-950/80 via-red-950/50 to-[#0f0608]", accent: "text-rose-300" },
  identity: { gradient: "from-cyan-950/70 via-teal-950/50 to-[#060f0e]", accent: "text-cyan-300" },
  default: { gradient: "from-violet-950/80 via-indigo-950/60 to-[#0a0814]", accent: "text-violet-300" },
};
