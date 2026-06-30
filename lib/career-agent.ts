import type { CareerReportAIOutput } from "@/lib/ai/schemas";

export type AgentMode = {
  id: string;
  title: string;
  label: string;
  jobSearchStatus:
    | "NOT_LOOKING"
    | "CASUALLY_OPEN"
    | "ACTIVELY_LOOKING"
    | "TRYING_TO_GET_PROMOTED"
    | "CONSIDERING_FOUNDER_PATH";
  goal: string;
  dashboardFocus: string;
  successMetric: string;
};

export const AGENT_MODES: AgentMode[] = [
  {
    id: "promotion",
    title: "Promotion mode",
    label: "Get promoted",
    jobSearchStatus: "TRYING_TO_GET_PROMOTED",
    goal: "Turn current scope into promotion leverage.",
    dashboardFocus: "promotion case",
    successMetric: "manager-ready proof",
  },
  {
    id: "new-role",
    title: "Market move mode",
    label: "Find a better role",
    jobSearchStatus: "ACTIVELY_LOOKING",
    goal: "Build a focused role pipeline and stronger positioning.",
    dashboardFocus: "role pipeline",
    successMetric: "qualified interviews",
  },
  {
    id: "compensation",
    title: "Compensation mode",
    label: "Raise compensation",
    jobSearchStatus: "CASUALLY_OPEN",
    goal: "Use market evidence to close the compensation gap.",
    dashboardFocus: "salary leverage",
    successMetric: "validated market band",
  },
  {
    id: "pivot",
    title: "Career pivot mode",
    label: "Change direction",
    jobSearchStatus: "CASUALLY_OPEN",
    goal: "Translate existing strengths into a credible new lane.",
    dashboardFocus: "pivot proof",
    successMetric: "transferable proof points",
  },
  {
    id: "founder",
    title: "Founder mode",
    label: "Explore founder path",
    jobSearchStatus: "CONSIDERING_FOUNDER_PATH",
    goal: "Pressure-test founder readiness and build market proof.",
    dashboardFocus: "founder readiness",
    successMetric: "validated problem thesis",
  },
];

export function getAgentModeByStatus(status?: string | null) {
  return (
    AGENT_MODES.find((mode) => mode.jobSearchStatus === status) ??
    AGENT_MODES.find((mode) => mode.id === "compensation")!
  );
}

export function getAgentModeById(id?: string | null) {
  return AGENT_MODES.find((mode) => mode.id === id) ?? AGENT_MODES[0];
}

export type AgentMission = {
  title: string;
  detail: string;
  impact: string;
};

export function buildWeeklyMissions(
  report?: CareerReportAIOutput,
  mode: AgentMode = AGENT_MODES[0],
): AgentMission[] {
  const planActions = report?.next30DaysPlan?.[0]?.actions ?? [];
  const fallback = getFallbackMissions(mode);

  return [0, 1, 2].map((index) => {
    const action = planActions[index] ?? fallback[index].detail;
    return {
      title: fallback[index].title,
      detail: action,
      impact: fallback[index].impact,
    };
  });
}

function getFallbackMissions(mode: AgentMode): AgentMission[] {
  if (mode.id === "founder") {
    return [
      {
        title: "Name the wedge",
        detail: "Write the painful problem, buyer, and why you are unusually credible to solve it.",
        impact: "Turns founder energy into a testable thesis.",
      },
      {
        title: "Run five market calls",
        detail: "Book five conversations with target users and capture exact language.",
        impact: "Replaces vague ambition with market signal.",
      },
      {
        title: "Package your operator story",
        detail: "Rewrite your profile around shipped outcomes, not responsibilities.",
        impact: "Makes you credible to co-founders, investors, and early hires.",
      },
    ];
  }

  if (mode.id === "new-role") {
    return [
      {
        title: "Pick the target lane",
        detail: "Choose 12 target roles and mark which ones match your strongest proof.",
        impact: "Stops random applying and creates a focused market test.",
      },
      {
        title: "Rewrite the first screen",
        detail: "Update headline, summary, and top three bullets around quantified outcomes.",
        impact: "Raises recruiter comprehension in the first 15 seconds.",
      },
      {
        title: "Open the warm path",
        detail: "Message five people one level above your target role for calibration calls.",
        impact: "Creates market feedback before you burn applications.",
      },
    ];
  }

  if (mode.id === "pivot") {
    return [
      {
        title: "Translate your proof",
        detail: "Rewrite three achievements using the language of your target function.",
        impact: "Makes your pivot feel intentional, not random.",
      },
      {
        title: "Find bridge roles",
        detail: "Collect ten roles that sit between your current identity and target lane.",
        impact: "Creates a realistic path instead of a cold jump.",
      },
      {
        title: "Build one proof artifact",
        detail: "Create a short case study that shows target-role thinking.",
        impact: "Gives hiring teams evidence when your title does not yet match.",
      },
    ];
  }

  if (mode.id === "compensation") {
    return [
      {
        title: "Build your salary case",
        detail: "List your top five measurable wins and map each to business impact.",
        impact: "Turns compensation into evidence, not a feeling.",
      },
      {
        title: "Benchmark the market",
        detail: "Collect ten comparable roles and write down salary range, level, and scope.",
        impact: "Creates the market proof needed for negotiation.",
      },
      {
        title: "Draft the ask",
        detail: "Write a direct compensation ask with range, timing, and business rationale.",
        impact: "Makes the conversation concrete before emotions enter.",
      },
    ];
  }

  return [
    {
      title: "Write the promotion case",
      detail: "Turn your strongest three outcomes into a one-page manager-ready promotion memo.",
      impact: "Converts hidden scope into visible leverage.",
    },
    {
      title: "Close the title gap",
      detail: "Rewrite your headline and top bullets around the next level, not your current title.",
      impact: "Aligns external positioning with actual operating level.",
    },
    {
      title: "Ask for the path",
      detail: "Book a manager conversation around scope, timing, and the proof needed for promotion.",
      impact: "Moves promotion from hope to managed process.",
    },
  ];
}

export function getReadinessScore(report?: CareerReportAIOutput) {
  if (!report) return 0;

  const valueConfidence = report.careerValue.confidence ?? 0;
  const dreamProbability = report.dreamPath.routes?.[0]?.probability ?? 50;
  const skillPressure = Math.max(0, 100 - (report.skillGaps?.[0]?.importance ?? 5) * 7);

  return Math.round(valueConfidence * 0.45 + dreamProbability * 0.35 + skillPressure * 0.2);
}

export function getCompensationGap(report?: CareerReportAIOutput) {
  if (!report?.lostMoney) return null;
  return {
    min: report.lostMoney.estimatedLostAmountMin,
    max: report.lostMoney.estimatedLostAmountMax,
    currency: report.lostMoney.currency,
  };
}
