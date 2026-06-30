import type { CareerReportAIOutput } from "@/lib/ai/schemas";
import type { ProfileInput } from "@/lib/ai/schemas";

export const DEMO_REPORT_ID = "demo";
export const DEMO_PROFILE: ProfileInput = {
  rawResumeText: `Alex Morgan — Product Manager
Berlin / Remote | 7 years experience

Experience:
- Product Manager at ScaleTech (2021–Present): Led 0→1 mobile product, $2.4M ARR in 18 months. Managed team of 3 engineers, 1 designer.
- Senior PM at DataFlow (2018–2021): Shipped analytics dashboard used by 200+ enterprise clients. Reduced churn 12%.
- Associate PM at StartupLab (2017–2018): First PM hire. Built MVP, acquired first 50 customers.

Skills: Product strategy, user research, roadmap planning, SQL, A/B testing, stakeholder management.

Education: MSc Business Administration, TU Berlin`,
  rawLinkedInText: "Product Manager | Builder-Operator | 0→1 products at scale",
  currentTitle: "Product Manager",
  currentCompany: "ScaleTech",
  location: "Berlin / Remote",
  yearsExperience: 7,
  currentCompensationMin: 135000,
  currentCompensationMax: 135000,
  currentCompensationCurrency: "USD",
  targetCompensation: 200000,
  targetRole: "VP Product",
  dreamRole: "VP Product / Founder",
  targetIndustries: ["SaaS", "AI", "Fintech"],
  jobSearchStatus: "CASUALLY_OPEN",
  remotePreference: "Remote preferred",
  careerGoal: "VP Product or Founder",
  biggestFrustration: "Title hasn't kept up with scope",
};

export const DEMO_REPORT: CareerReportAIOutput = {
  summary: {
    headline: "Alex Morgan: Builder-Operator running hot, under-packaged for VP",
    shortAssessment:
      "7 years of high-signal PM work with clear 0→1 and scale outcomes — but your public positioning reads mid-level while your scope reads senior.",
    strongestSignal: "Repeatable 0→1 delivery with measurable ARR and churn impact.",
    biggestRisk: "Staying in a PM title while doing Head-of-Product scope caps your market band.",
    nextBestMove: "Reposition toward Group PM / Head of Product with a quantified portfolio before targeting VP.",
  },
  careerValue: {
    conservativeMin: 145000,
    conservativeMax: 160000,
    realisticMin: 160000,
    realisticMax: 210000,
    stretchMin: 210000,
    stretchMax: 260000,
    currency: "USD",
    confidence: 78,
    reasoning: [
      "7 years PM experience with 0→1 and scale outcomes maps to senior PM / Group PM band.",
      "Berlin remote market for senior PMs supports $160k–210k for top performers.",
      "Current $135k reads 15–25% below realistic midpoint for your signal.",
    ],
    valueDrivers: [
      "0→1 product with $2.4M ARR proof",
      "Enterprise analytics experience at scale",
      "Cross-functional leadership scope",
    ],
    valueLimiters: [
      "Title still reads 'PM' not 'Senior/Group PM'",
      "LinkedIn headline lacks quantified impact",
      "No visible thought leadership signal",
    ],
    disclaimer:
      "Salary estimates are AI-generated and informational. Not a guarantee of compensation or offers.",
  },
  careerDna: {
    primaryType: "Builder",
    secondaryType: "Operator",
    breakdown: {
      Builder: 88,
      Operator: 82,
      Visionary: 55,
      Founder: 62,
      Scientist: 40,
      Seller: 45,
      Strategist: 70,
      Craftsperson: 50,
    },
    explanation:
      "Classic Builder-Operator: you ship new products AND keep them running at scale.",
    superpower: "Turning zero into revenue with a small, focused team.",
    bottleneck: "External packaging — the market sees PM, you operate as Head of Product.",
  },
  lostMoney: {
    estimatedLostAmountMin: 120000,
    estimatedLostAmountMax: 180000,
    currency: "USD",
    periodYears: 5,
    confidence: 70,
    explanation:
      "You may have left an estimated $120k–180k on the table by staying below market midpoint while your skills appreciated.",
    assumptions: [
      "Based on $135k current vs $185k estimated midpoint",
      "Assumes limited negotiation over 5 years",
      "Excludes equity and benefits",
    ],
  },
  dreamPath: {
    goal: "VP Product / Founder",
    routes: [
      {
        name: "Corporate Path",
        steps: [
          {
            title: "Group PM / Head of Product",
            expectedTimeline: "12–18 months",
            requiredSkills: ["Org-level roadmap", "Hiring", "P&L awareness"],
            proofPoints: ["Lead 2 product lines", "Hire 2 PMs"],
            risks: ["Scope ceiling at current company"],
          },
          {
            title: "VP Product",
            expectedTimeline: "3–5 years",
            requiredSkills: ["Executive communication", "Board-level narrative"],
            proofPoints: ["Own product P&L", "Present to board"],
            risks: ["Competition from external hires"],
          },
        ],
        upside: "Stable comp growth to $250k+ band",
        risk: "Politics may slow timeline",
        probability: 72,
      },
      {
        name: "Founder Path",
        steps: [
          {
            title: "Founder / Co-founder",
            expectedTimeline: "2–4 years",
            requiredSkills: ["Fundraising", "GTM", "Full-stack product"],
            proofPoints: ["MVP with paying customers", "Seed round or profitability"],
            risks: ["Income volatility"],
          },
        ],
        upside: "Uncapped upside, full ownership",
        risk: "High variance",
        probability: 48,
      },
    ],
  },
  resumeRoast: {
    roastLevel: "medium",
    oneLiner: "Your resume is doing less work than you are.",
    issues: [
      "Bullets lead with responsibilities, not outcomes",
      "$2.4M ARR buried in paragraph 2",
      "No headline that signals Group PM / Head of Product trajectory",
      "Skills section is a keyword dump",
    ],
    improvedPositioning:
      "Builder-Operator PM who ships 0→1 products to $2M+ ARR — reposition as senior product leader, not task executor.",
  },
  profileFixes: {
    linkedinHeadline: "Product Manager → Head of Product track | 0→1 to $2.4M ARR | Builder-Operator",
    linkedinAbout:
      "I build products that become businesses.\n\n7 years turning ambiguity into shipped revenue — from first PM hire to leading 0→1 mobile product at $2.4M ARR.\n\nCurrently: exploring Group PM / Head of Product / Founder paths.",
    bioShort: "Builder-Operator PM. 0→1 to $2.4M ARR. Berlin / Remote.",
    bioLong:
      "Product leader with 7 years of 0→1 and scale experience. Known for shipping revenue, not slide decks.",
    resumeBullets: [
      "Led 0→1 mobile product from concept to $2.4M ARR in 18 months, managing cross-functional team of 5",
      "Shipped enterprise analytics dashboard adopted by 200+ clients, reducing churn 12%",
      "First PM hire — built MVP and acquired first 50 customers as founding product lead",
    ],
  },
  skillGaps: [
    {
      skill: "Executive / board communication",
      importance: 9,
      salaryImpact: "Required for VP band ($220k+)",
      howToProve: "Present product strategy to C-suite; get invited to leadership offsites",
      suggestedAction: "Volunteer to lead next quarterly product review with exec team",
    },
    {
      skill: "P&L ownership",
      importance: 8,
      salaryImpact: "Unlocks Head of Product compensation",
      howToProve: "Own revenue metric for a product line end-to-end",
      suggestedAction: "Request explicit P&L accountability for mobile product",
    },
    {
      skill: "Thought leadership",
      importance: 6,
      salaryImpact: "Increases inbound VP opportunities",
      howToProve: "3 LinkedIn posts with 50+ engagements on product topics",
      suggestedAction: "Share one 0→1 lesson per week for 4 weeks",
    },
  ],
  next30DaysPlan: [
    {
      week: 1,
      focus: "Reposition",
      actions: [
        "Rewrite resume headline: 'Senior PM / Head of Product track'",
        "Move $2.4M ARR to bullet #1",
        "Update LinkedIn headline and about section",
      ],
      expectedOutcome: "External profile matches internal scope",
    },
    {
      week: 2,
      focus: "Market validation",
      actions: [
        "Benchmark 10 Group PM / Head of Product roles",
        "5 coffee chats with people 1–2 levels above",
        "Post one product leadership insight",
      ],
      expectedOutcome: "Confirm $160k–210k band and target titles",
    },
    {
      week: 3,
      focus: "Proof portfolio",
      actions: [
        "Write 1-page case study on 0→1 mobile product",
        "Get 2 LinkedIn recommendations from eng/design leads",
        "Identify internal Head of Product scope to claim",
      ],
      expectedOutcome: "Interview-ready narrative",
    },
    {
      week: 4,
      focus: "Activate",
      actions: [
        "Apply to 3 Group PM / Head of Product roles",
        "Have 2 recruiter conversations",
        "Discuss promotion path with current manager",
      ],
      expectedOutcome: "Active pipeline + internal option",
    },
  ],
  shareCards: [
    {
      type: "CAREER_VALUE",
      title: "AI estimated my market value",
      subtitle: "Product Manager, 7 years",
      valueText: "$160k–210k/year",
      tone: "status",
    },
    {
      type: "UNDERPAID",
      title: "Loyalty discount detected",
      subtitle: "I may be underpaid by this much.",
      valueText: "$42k/year",
      tone: "fomo",
    },
    {
      type: "CAREER_DNA",
      title: "My Career DNA",
      subtitle: "I turn chaos into systems.",
      valueText: "Builder-Operator",
      tone: "identity",
    },
    {
      type: "LOST_MONEY",
      title: "Money left on the table",
      subtitle: "Estimated over 5 years",
      valueText: "$120k–180k",
      tone: "serious",
    },
    {
      type: "DREAM_PATH",
      title: "My 10-year career path",
      subtitle: "Alex Morgan",
      bodyText: "PM → Group PM → Head of Product → VP Product → COO/Founder",
      tone: "status",
    },
    {
      type: "CAREER_AGE",
      title: "My career age",
      subtitle: "Real age doesn't matter.",
      bodyText: "Career age: 29 — high potential, under-packaged, ready for acceleration.",
      tone: "funny",
    },
    {
      type: "RESUME_ROAST",
      title: "CareerOS roasted my resume",
      subtitle: "",
      bodyText: "This is not a resume. This is a cry for positioning help.",
      tone: "funny",
    },
    {
      type: "SKILL_UNLOCK",
      title: "Skill unlock",
      subtitle: "Highest ROI gap",
      bodyText: "Executive communication — unlocks the VP band.",
      tone: "serious",
    },
    {
      type: "CAREER_VELOCITY",
      title: "Career velocity",
      subtitle: "Trajectory signal",
      bodyText: "Above average pace — positioning is the bottleneck, not capability.",
      tone: "status",
    },
    {
      type: "FOUNDER_READINESS",
      title: "Founder readiness",
      subtitle: "Builder-Operator score",
      valueText: "68%",
      bodyText: "Strong 0→1 proof. Side project or co-founder search recommended.",
      tone: "identity",
    },
  ],
};

export const DEMO_PERSONA = {
  name: "Alex Morgan",
  role: "Product Manager",
  experience: "7 years",
  location: "Berlin / Remote",
  compensation: "$135k",
  goal: "VP Product / Founder",
  careerDna: "Builder-Operator",
  marketValue: "$160k–210k",
  lostMoney: "$120k–180k",
  dreamPath: "PM → Group PM → Head of Product → VP Product → COO/Founder",
};
