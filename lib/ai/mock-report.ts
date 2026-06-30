import type { ProfileInput } from "./schemas";
import type { CareerReportAIOutput } from "./schemas";

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateMockReport(profile: ProfileInput): CareerReportAIOutput {
  const seed = hashSeed(profile.rawResumeText + (profile.currentTitle ?? ""));
  const years = profile.yearsExperience ?? 5;
  const currentMid =
    profile.currentCompensationMin && profile.currentCompensationMax
      ? (profile.currentCompensationMin + profile.currentCompensationMax) / 2
      : 90000 + years * 8000 + (seed % 20000);

  const realisticMin = Math.round(currentMid * 1.05);
  const realisticMax = Math.round(currentMid * 1.35);
  const title = profile.currentTitle ?? "Professional";
  const dnaPrimary = ["Builder", "Operator", "Strategist", "Visionary"][seed % 4] as CareerReportAIOutput["careerDna"]["primaryType"];
  const dnaSecondary = ["Operator", "Builder", "Seller", "Founder"][seed % 4];

  const lostMin = Math.round((realisticMin - currentMid) * Math.min(years, 5) * 0.6);
  const lostMax = Math.round((realisticMax - currentMid) * Math.min(years, 7) * 0.8);

  return {
    summary: {
      headline: `${title}: under-positioned, not under-skilled`,
      shortAssessment: `Based on your profile, you read as a ${dnaPrimary}-${dnaSecondary} with ${years}+ years of signal — but your positioning doesn't fully capture your market value.`,
      strongestSignal: `Clear ${dnaPrimary.toLowerCase()} energy with measurable outcomes in your background.`,
      biggestRisk: profile.biggestFrustration ?? "Staying in a role that caps your compensation growth.",
      nextBestMove: profile.targetRole
        ? `Reposition toward ${profile.targetRole} with sharper proof points in the next 30 days.`
        : "Sharpen your headline and quantify 3 key wins before your next career move.",
    },
    careerValue: {
      conservativeMin: Math.round(realisticMin * 0.9),
      conservativeMax: Math.round(realisticMin * 1.05),
      realisticMin,
      realisticMax,
      stretchMin: Math.round(realisticMax * 1.05),
      stretchMax: Math.round(realisticMax * 1.25),
      currency: profile.currentCompensationCurrency ?? "USD",
      confidence: profile.currentCompensationMin ? 72 : 58,
      reasoning: [
        `${years} years experience in ${profile.targetIndustries?.[0] ?? "your field"} supports mid-to-senior positioning.`,
        `Current role as ${title} maps to a competitive but not peak market band.`,
        profile.location ? `${profile.location} market dynamics factored into range.` : "Location not specified — range is broader.",
      ],
      valueDrivers: [
        "Cross-functional delivery track record",
        "Industry-relevant skill stack",
        "Leadership scope in recent roles",
      ],
      valueLimiters: [
        "Resume undersells quantified impact",
        "Public profile lacks positioning clarity",
        "Gap between current title and target trajectory",
      ],
      disclaimer:
        "Salary estimates are AI-generated and informational. Not a guarantee of compensation or offers.",
    },
    careerDna: {
      primaryType: dnaPrimary,
      secondaryType: dnaSecondary,
      breakdown: {
        Builder: dnaPrimary === "Builder" ? 85 : 45,
        Operator: dnaSecondary === "Operator" ? 78 : 40,
        Visionary: 35,
        Founder: 42,
        Scientist: 30,
        Seller: 38,
        Strategist: 55,
        Craftsperson: 48,
      },
      explanation: `You lead with ${dnaPrimary} energy — you create and ship — with a strong ${dnaSecondary} secondary that keeps things running.`,
      superpower: "Turning ambiguity into executable plans with measurable outcomes.",
      bottleneck: "Packaging achievements so the market sees your full scope.",
    },
    lostMoney: {
      estimatedLostAmountMin: Math.max(lostMin, 15000),
      estimatedLostAmountMax: Math.max(lostMax, 35000),
      currency: "USD",
      periodYears: Math.min(years, 5),
      confidence: 65,
      explanation:
        "You may have left money on the table by staying at or below market midpoint while your skills appreciated.",
      assumptions: [
        "Based on self-reported compensation and estimated market range",
        "Assumes limited negotiation or title progression",
        "Does not account for equity or benefits",
      ],
    },
    dreamPath: {
      goal: profile.dreamRole ?? profile.targetRole ?? "Senior leadership",
      routes: [
        {
          name: "Corporate Ladder",
          steps: [
            {
              title: profile.targetRole ?? "Senior IC / Lead",
              expectedTimeline: "12–18 months",
              requiredSkills: ["Strategic ownership", "Stakeholder management"],
              proofPoints: ["Ship 1 flagship initiative", "Own a metric end-to-end"],
              risks: ["Internal politics", "Slow promotion cycles"],
            },
            {
              title: profile.dreamRole ?? "Director / Head of",
              expectedTimeline: "3–5 years",
              requiredSkills: ["Team building", "P&L or budget ownership"],
              proofPoints: ["Led cross-team initiative", "Hired and developed talent"],
              risks: ["Scope ceiling at current company"],
            },
          ],
          upside: "Stable trajectory with compounding credibility",
          risk: "May take longer than market alternatives",
          probability: 68,
        },
        {
          name: "Founder / Operator Path",
          steps: [
            {
              title: "Side project or advisory",
              expectedTimeline: "6–12 months",
              requiredSkills: ["Customer discovery", "Rapid prototyping"],
              proofPoints: ["Launch MVP", "First paying customers"],
              risks: ["Income volatility"],
            },
          ],
          upside: "Uncapped upside and ownership",
          risk: "Higher variance, longer runway needed",
          probability: 42,
        },
      ],
    },
    resumeRoast: {
      roastLevel: "medium",
      oneLiner: "Your resume is doing less work than you are.",
      issues: [
        "Bullets describe tasks, not outcomes",
        "Missing quantified impact in top 3 roles",
        "Headline doesn't signal target trajectory",
        "Skills section reads generic, not differentiated",
      ],
      improvedPositioning: `${title} who delivers measurable business outcomes — reposition around impact, not activity.`,
    },
    profileFixes: {
      linkedinHeadline: `${title} | ${dnaPrimary}-${dnaSecondary} | Building outcomes that move the needle`,
      linkedinAbout: `I help teams turn strategy into shipped results. ${years}+ years turning complex problems into clear wins.\n\nCurrently focused on: ${profile.careerGoal ?? "accelerating my next career move"}.`,
      bioShort: `${dnaPrimary}-${dnaSecondary} ${title.toLowerCase()} with ${years}+ years of high-signal delivery.`,
      bioLong: `Career professional with a ${dnaPrimary.toLowerCase()}-${dnaSecondary.toLowerCase()} profile. Known for shipping outcomes, not just plans.`,
      resumeBullets: [
        `Led [initiative] resulting in [X%] improvement in [metric] across [scope]`,
        `Drove [outcome] by [action], saving [amount/time] for [stakeholders]`,
        `Built and scaled [system/process] used by [N] teams, reducing [pain point] by [X%]`,
      ],
    },
    skillGaps: [
      {
        skill: "Executive communication",
        importance: 8,
        salaryImpact: "High — unlocks senior IC and leadership bands",
        howToProve: "Present strategy doc to leadership; get quoted in company comms",
        suggestedAction: "Volunteer to lead next quarterly business review",
      },
      {
        skill: profile.targetRole?.includes("Product") ? "Product strategy" : "Strategic planning",
        importance: 7,
        salaryImpact: "Medium-high for target role",
        howToProve: "Publish a strategy memo with measurable OKRs",
        suggestedAction: "Own roadmap for one high-visibility initiative",
      },
      {
        skill: "Personal brand / thought leadership",
        importance: 6,
        salaryImpact: "Medium — increases inbound opportunities",
        howToProve: "2–3 LinkedIn posts with engagement on industry topics",
        suggestedAction: "Share one insight per week from your domain expertise",
      },
    ],
    next30DaysPlan: [
      {
        week: 1,
        focus: "Audit & reposition",
        actions: [
          "Rewrite resume headline and top 3 bullets with metrics",
          "Update LinkedIn headline to match target role",
          "List 5 quantified wins from last 2 years",
        ],
        expectedOutcome: "Clear positioning narrative ready to test",
      },
      {
        week: 2,
        focus: "Market signal",
        actions: [
          "Research 10 target companies and role benchmarks",
          "Connect with 5 people in target trajectory",
          "Post one career insight on LinkedIn",
        ],
        expectedOutcome: "External validation of market positioning",
      },
      {
        week: 3,
        focus: "Proof points",
        actions: [
          "Draft case study for biggest win",
          "Request 2 recommendations aligned to target role",
          "Identify 1 skill gap to close this month",
        ],
        expectedOutcome: "Portfolio of proof for conversations",
      },
      {
        week: 4,
        focus: "Activate",
        actions: [
          "Apply or explore 3 aligned opportunities",
          "Schedule 2 informational conversations",
          "Review and adjust positioning based on feedback",
        ],
        expectedOutcome: "Active pipeline with refined positioning",
      },
    ],
    shareCards: buildMockShareCards(title, dnaPrimary, dnaSecondary, realisticMin, realisticMax, lostMin),
  };
}

function buildMockShareCards(
  title: string,
  dnaPrimary: string,
  dnaSecondary: string,
  valMin: number,
  valMax: number,
  underpaid: number,
): CareerReportAIOutput["shareCards"] {
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  return [
    { type: "CAREER_VALUE", title: "AI estimated my market value", subtitle: title, valueText: `${fmt(valMin)}–${fmt(valMax)}/year`, tone: "status" },
    { type: "UNDERPAID", title: "Loyalty discount detected", subtitle: "I may be underpaid by this much.", valueText: `${fmt(underpaid)}/year`, tone: "fomo" },
    { type: "CAREER_DNA", title: "My Career DNA", subtitle: "I turn chaos into systems.", valueText: `${dnaPrimary}-${dnaSecondary}`, tone: "identity" },
    { type: "LOST_MONEY", title: "Money left on the table", subtitle: "Estimated career gap", valueText: `${fmt(underpaid * 3)}–${fmt(underpaid * 5)}`, tone: "serious" },
    { type: "DREAM_PATH", title: "My 10-year career path", subtitle: title, bodyText: `${title} → Senior Lead → Head of → VP`, tone: "status" },
    { type: "CAREER_AGE", title: "My career age", subtitle: "Real age doesn't matter.", bodyText: "Career age: 29 — high potential, under-packaged, ready for acceleration.", tone: "funny" },
    { type: "RESUME_ROAST", title: "CareerOS roasted my resume", subtitle: "", bodyText: "This is not a resume. This is a cry for positioning help.", tone: "funny" },
    { type: "SKILL_UNLOCK", title: "Skill unlock", subtitle: "Highest ROI gap", bodyText: "Executive communication — unlocks the next compensation band.", tone: "serious" },
    { type: "CAREER_VELOCITY", title: "Career velocity", subtitle: "Trajectory signal", bodyText: "Above average pace — positioning is the bottleneck, not capability.", tone: "status" },
    { type: "FOUNDER_READINESS", title: "Founder readiness", subtitle: "Operator score", valueText: "68%", bodyText: "Strong builder-operator profile. Side project recommended before leap.", tone: "identity" },
  ];
}
