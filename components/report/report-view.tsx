"use client";

import type { CareerReportAIOutput } from "@/lib/ai/schemas";
import { formatRange } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProGate } from "./pro-gate";
import { ShareCardVisual } from "@/components/cards/share-card-visual";
import Link from "next/link";
import { motion } from "framer-motion";

type ReportViewProps = {
  report: CareerReportAIOutput;
  isPro: boolean;
  shareCardIds?: Record<string, string>;
  reportId: string;
};

export function ReportView({ report, isPro, shareCardIds = {}, reportId }: ReportViewProps) {
  const cv = report.careerValue;
  const visibleCards = isPro ? report.shareCards : report.shareCards.slice(0, 3);

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-transparent">
          <CardHeader>
            <p className="text-sm text-violet-400">Your Career Report</p>
            <CardTitle className="text-2xl md:text-3xl">{report.summary.headline}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300">{report.summary.shortAssessment}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Insight label="Strongest signal" value={report.summary.strongestSignal} />
              <Insight label="Biggest risk" value={report.summary.biggestRisk} />
              <Insight label="Next best move" value={report.summary.nextBestMove} />
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <Section title="Career Value">
        <p className="text-4xl font-bold text-white">
          {formatRange(cv.realisticMin, cv.realisticMax, cv.currency)}
          <span className="text-lg font-normal text-zinc-400">/year estimated</span>
        </p>
        <p className="mt-2 text-sm text-zinc-400">Confidence: {cv.confidence}%</p>
        <ProGate locked={!isPro} title="Full salary reasoning">
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {cv.reasoning.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-zinc-500 uppercase">Value drivers</p>
              {cv.valueDrivers.map((d, i) => (
                <p key={i} className="text-sm text-green-400/90">+ {d}</p>
              ))}
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase">Value limiters</p>
              {cv.valueLimiters.map((d, i) => (
                <p key={i} className="text-sm text-rose-400/90">− {d}</p>
              ))}
            </div>
          </div>
        </ProGate>
        <p className="mt-4 text-xs text-zinc-500">{cv.disclaimer}</p>
      </Section>

      <Section title="Career DNA">
        <p className="text-3xl font-bold text-white">
          {report.careerDna.primaryType}-{report.careerDna.secondaryType}
        </p>
        <p className="mt-2 text-zinc-300">{report.careerDna.explanation}</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <Insight label="Superpower" value={report.careerDna.superpower} />
          <Insight label="Bottleneck" value={report.careerDna.bottleneck} />
        </div>
      </Section>

      <Section title="Lost Money">
        <ProGate locked={!isPro} title="Lost money analysis">
          <p className="text-3xl font-bold text-rose-300">
            {formatRange(
              report.lostMoney.estimatedLostAmountMin,
              report.lostMoney.estimatedLostAmountMax,
              report.lostMoney.currency,
            )}
          </p>
          <p className="mt-2 text-zinc-300">{report.lostMoney.explanation}</p>
          <ul className="mt-4 space-y-1 text-sm text-zinc-400">
            {report.lostMoney.assumptions.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </ProGate>
        {!isPro && (
          <p className="text-zinc-500 text-sm">You may have left money on the table. Upgrade to see the full analysis.</p>
        )}
      </Section>

      <Section title="Dream Career Path">
        <ProGate locked={!isPro} title="Full dream path">
          <p className="text-zinc-300 mb-4">Goal: {report.dreamPath.goal}</p>
          {report.dreamPath.routes.map((route, i) => (
            <Card key={i} className="mb-4 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">{route.name}</CardTitle>
                <p className="text-sm text-zinc-400">Probability: {route.probability}%</p>
              </CardHeader>
              <CardContent>
                {route.steps.map((step, j) => (
                  <div key={j} className="mb-3 border-l-2 border-violet-500/50 pl-4">
                    <p className="font-medium text-white">{step.title}</p>
                    <p className="text-sm text-zinc-400">{step.expectedTimeline}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </ProGate>
        {!isPro && report.dreamPath.routes[0] && (
          <p className="text-sm text-zinc-400">
            Preview: {report.dreamPath.routes[0].name} — {report.dreamPath.routes[0].steps[0]?.title}
          </p>
        )}
      </Section>

      <Section title="Resume Roast">
        <p className="text-xl font-medium text-amber-300">&ldquo;{report.resumeRoast.oneLiner}&rdquo;</p>
        <ProGate locked={!isPro} title="Full roast">
          <ul className="mt-4 space-y-2 text-zinc-300">
            {report.resumeRoast.issues.map((issue, i) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-violet-300">{report.resumeRoast.improvedPositioning}</p>
        </ProGate>
      </Section>

      <ProGate locked={!isPro} title="LinkedIn & profile fixes">
        <Section title="LinkedIn / Profile Fixes">
          <Insight label="Headline" value={report.profileFixes.linkedinHeadline} />
          <Insight label="About" value={report.profileFixes.linkedinAbout} />
          <div className="mt-4">
            <p className="text-xs text-zinc-500 uppercase mb-2">Resume bullets</p>
            {report.profileFixes.resumeBullets.map((b, i) => (
              <p key={i} className="text-sm text-zinc-300 mb-2">• {b}</p>
            ))}
          </div>
        </Section>
      </ProGate>

      <ProGate locked={!isPro} title="Skill gaps">
        <Section title="Skill Gaps">
          {report.skillGaps.map((gap, i) => (
            <Card key={i} className="mb-3 border-white/5">
              <CardContent className="pt-4">
                <p className="font-medium text-white">{gap.skill}</p>
                <p className="text-sm text-zinc-400">Impact: {gap.salaryImpact}</p>
                <p className="text-sm text-zinc-300 mt-1">{gap.suggestedAction}</p>
              </CardContent>
            </Card>
          ))}
        </Section>
      </ProGate>

      <ProGate locked={!isPro} title="30-day plan">
        <Section title="Next 30 Days">
          {report.next30DaysPlan.map((week) => (
            <Card key={week.week} className="mb-3 border-white/5">
              <CardHeader>
                <CardTitle className="text-base">Week {week.week}: {week.focus}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-zinc-300 space-y-1">
                  {week.actions.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-zinc-500">{week.expectedOutcome}</p>
              </CardContent>
            </Card>
          ))}
        </Section>
      </ProGate>

      <Section title="Share Cards">
        <p className="text-sm text-zinc-400 mb-4">
          Share only what you choose. Your report is private by default.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card, i) => {
            const cardId = shareCardIds[card.type];
            const inner = (
              <ShareCardVisual
                key={i}
                title={card.title}
                subtitle={card.subtitle}
                valueText={card.valueText}
                bodyText={card.bodyText}
                theme={card.tone}
                compact
              />
            );
            return cardId ? (
              <Link key={i} href={`/share/${cardId}`} className="block hover:scale-[1.02] transition-transform">
                {inner}
              </Link>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
        {!isPro && report.shareCards.length > 3 && (
          <p className="mt-4 text-center text-sm text-zinc-400">
            +{report.shareCards.length - 3} more cards with Pro ·{" "}
            <Link href="/pricing" className="text-violet-400 hover:underline">Upgrade</Link>
          </p>
        )}
      </Section>

      {!isPro && (
        <Card className="border-violet-500/30 bg-violet-950/20 text-center">
          <CardContent className="py-8">
            <p className="text-lg font-medium text-white mb-2">Your market value changed. Your title didn&apos;t.</p>
            <p className="text-zinc-400 mb-4">Unlock the full Career Report with Pro.</p>
            <Link href="/pricing" className="inline-flex h-11 items-center rounded-lg bg-violet-600 px-6 text-sm font-medium text-white hover:bg-violet-500">
              Upgrade to Pro — $29/mo
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="text-xs text-zinc-500 uppercase">{label}</p>
      <p className="mt-1 text-sm text-zinc-200">{value}</p>
    </div>
  );
}
