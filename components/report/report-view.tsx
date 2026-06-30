"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, Gauge, Target } from "lucide-react";
import type { CareerReportAIOutput } from "@/lib/ai/schemas";
import { formatRange } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProGate } from "./pro-gate";
import { ShareCardVisual } from "@/components/cards/share-card-visual";
import { buildWeeklyMissions, getReadinessScore } from "@/lib/career-agent";

type ReportViewProps = {
  report: CareerReportAIOutput;
  isPro: boolean;
  shareCardIds?: Record<string, string>;
  reportId: string;
};

export function ReportView({ report, isPro, shareCardIds = {}, reportId }: ReportViewProps) {
  const cv = report.careerValue;
  const visibleCards = isPro ? report.shareCards : report.shareCards.slice(0, 3);
  const missions = buildWeeklyMissions(report);
  const readiness = getReadinessScore(report);

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-transparent">
          <CardHeader>
            <p className="text-sm text-violet-400">Your Career Report</p>
            <CardTitle className="text-2xl md:text-3xl">{report.summary.headline}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-zinc-300">{report.summary.shortAssessment}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Insight label="Strongest signal" value={report.summary.strongestSignal} />
              <Insight label="Biggest risk" value={report.summary.biggestRisk} />
              <Insight label="Next best move" value={report.summary.nextBestMove} />
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 font-medium text-white">
                  <Target className="h-4 w-4 text-emerald-300" />
                  Agent loop unlocked
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  The report is saved. Your dashboard now turns it into weekly execution.
                </p>
              </div>
              <Button asChild>
                <Link href={`/dashboard?fromReport=${reportId}`}>
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <Gauge className="mb-4 h-5 w-5 text-violet-300" />
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Role readiness</p>
            <p className="mt-2 text-3xl font-bold text-white">{readiness}%</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">First weekly missions</p>
            <div className="mt-4 grid gap-3">
              {missions.map((mission, index) => (
                <div key={mission.title} className="flex gap-3 rounded-xl bg-white/[0.04] p-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-semibold text-violet-100">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{mission.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{mission.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Section title="Career Value">
        <p className="text-4xl font-bold text-white">
          {formatRange(cv.realisticMin, cv.realisticMax, cv.currency)}
          <span className="text-lg font-normal text-zinc-400">/year estimated</span>
        </p>
        <p className="mt-2 text-sm text-zinc-400">Confidence: {cv.confidence}%</p>
        <ProGate locked={!isPro} title="Full salary reasoning">
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {cv.reasoning.map((r, i) => (
              <li key={i}>- {r}</li>
            ))}
          </ul>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-zinc-500">Value drivers</p>
              {cv.valueDrivers.map((d, i) => (
                <p key={i} className="text-sm text-green-400/90">+ {d}</p>
              ))}
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Value limiters</p>
              {cv.valueLimiters.map((d, i) => (
                <p key={i} className="text-sm text-rose-400/90">- {d}</p>
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
              <li key={i}>- {a}</li>
            ))}
          </ul>
        </ProGate>
        {!isPro && (
          <p className="text-sm text-zinc-500">You may have left money on the table. Upgrade to see the full analysis.</p>
        )}
      </Section>

      <Section title="Dream Career Path">
        <ProGate locked={!isPro} title="Full dream path">
          <p className="mb-4 text-zinc-300">Goal: {report.dreamPath.goal}</p>
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
            Preview: {report.dreamPath.routes[0].name} - {report.dreamPath.routes[0].steps[0]?.title}
          </p>
        )}
      </Section>

      <Section title="Resume Roast">
        <p className="text-xl font-medium text-amber-300">&ldquo;{report.resumeRoast.oneLiner}&rdquo;</p>
        <ProGate locked={!isPro} title="Full roast">
          <ul className="mt-4 space-y-2 text-zinc-300">
            {report.resumeRoast.issues.map((issue, i) => (
              <li key={i}>- {issue}</li>
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
            <p className="mb-2 text-xs uppercase text-zinc-500">Resume bullets</p>
            {report.profileFixes.resumeBullets.map((b, i) => (
              <p key={i} className="mb-2 text-sm text-zinc-300">- {b}</p>
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
                <p className="mt-1 text-sm text-zinc-300">{gap.suggestedAction}</p>
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarCheck2 className="h-4 w-4 text-violet-300" />
                  Week {week.week}: {week.focus}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {week.actions.map((a, i) => (
                    <li key={i}>- {a}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-zinc-500">{week.expectedOutcome}</p>
              </CardContent>
            </Card>
          ))}
        </Section>
      </ProGate>

      <Section title="Share Cards">
        <p className="mb-4 text-sm text-zinc-400">
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
              <Link key={i} href={`/share/${cardId}`} className="block transition-transform hover:scale-[1.02]">
                {inner}
              </Link>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
        {!isPro && report.shareCards.length > 3 && (
          <p className="mt-4 text-center text-sm text-zinc-400">
            +{report.shareCards.length - 3} more cards with Pro.{" "}
            <Link href="/pricing" className="text-violet-400 hover:underline">Upgrade</Link>
          </p>
        )}
      </Section>

      {!isPro && (
        <Card className="border-violet-500/30 bg-violet-950/20 text-center">
          <CardContent className="py-8">
            <p className="mb-2 text-lg font-medium text-white">Your market value changed. Your title did not.</p>
            <p className="mb-4 text-zinc-400">Unlock the full Career Report with Pro.</p>
            <Link href="/pricing" className="inline-flex h-11 items-center rounded-lg bg-violet-600 px-6 text-sm font-medium text-white hover:bg-violet-500">
              Upgrade to Pro - $29/mo
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
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-zinc-200">{value}</p>
    </div>
  );
}
