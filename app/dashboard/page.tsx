import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarCheck2,
  Gauge,
  RefreshCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareCardVisual } from "@/components/cards/share-card-visual";
import { trackEvent, EVENTS } from "@/lib/analytics";
import type { CareerReportAIOutput } from "@/lib/ai/schemas";
import { formatCurrency, formatRange } from "@/lib/utils";
import {
  buildWeeklyMissions,
  getAgentModeByStatus,
  getCompensationGap,
  getReadinessScore,
} from "@/lib/career-agent";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  await trackEvent(EVENTS.DASHBOARD_VIEWED, { userId: session.user.id });

  const params = await searchParams;
  const latestReport = await prisma.careerReport.findFirst({
    where: { userId: session.user.id, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    include: { shareCards: true, profile: true },
  });

  const latestProfile = latestReport?.profile ?? await prisma.careerProfile.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const isPro = session.user.subscriptionStatus === "PRO";
  const report = latestReport?.fullReport as CareerReportAIOutput | undefined;
  const mode = getAgentModeByStatus(latestProfile?.jobSearchStatus);
  const missions = buildWeeklyMissions(report, mode);
  const readiness = getReadinessScore(report);
  const compensationGap = getCompensationGap(report);

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">CareerOS command center</p>
            <h1 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
              Your career agent is running {mode.title.toLowerCase()}.
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Welcome back{session.user.name ? `, ${session.user.name}` : ""}. The report is the diagnosis;
              this dashboard is the operating rhythm.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {latestReport && (
              <Button asChild variant="secondary">
                <Link href={`/report/${latestReport.id}`}>Open report</Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/start">
                Refresh agent
                <RefreshCcw className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {params.upgraded && (
          <div className="mt-6 rounded-lg border border-green-500/30 bg-green-950/20 p-4 text-green-300">
            Pro unlocked. Full report access is now active.
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={Sparkles}
            label="Mode"
            value={mode.label}
            detail={mode.successMetric}
          />
          <MetricCard
            icon={Gauge}
            label="Role readiness"
            value={report ? `${readiness}%` : "Not scored"}
            detail={report ? "Based on report signal" : "Generate a report first"}
          />
          <MetricCard
            icon={BadgeDollarSign}
            label="Money gap"
            value={
              compensationGap
                ? formatRange(compensationGap.min, compensationGap.max, compensationGap.currency)
                : "Unknown"
            }
            detail="Estimated opportunity"
          />
          <MetricCard
            icon={BriefcaseBusiness}
            label="Subscription"
            value={isPro ? "Pro" : "Free"}
            detail={isPro ? "Full agent access" : "Upgrade for deep analysis"}
          />
        </div>

        {latestReport && report ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <main className="space-y-6">
              <Card className="border-emerald-400/20 bg-emerald-400/[0.04]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-300" />
                    Next best move
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-white">{report.summary.nextBestMove}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <Insight label="Strongest signal" value={report.summary.strongestSignal} />
                    <Insight label="Biggest risk" value={report.summary.biggestRisk} />
                    <Insight label="Agent focus" value={mode.dashboardFocus} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck2 className="h-5 w-5 text-violet-300" />
                    This week's missions
                  </CardTitle>
                  <p className="text-sm text-zinc-400">
                    These are pulled from the report and converted into actions. Do these before regenerating.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {missions.map((mission, index) => (
                      <div key={mission.title} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/12 text-sm font-semibold text-violet-200">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white">{mission.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-zinc-300">{mission.detail}</p>
                            <p className="mt-2 text-xs text-emerald-300">{mission.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {report.next30DaysPlan[0] && (
                <Card>
                  <CardHeader>
                    <CardTitle>30-day sprint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {report.next30DaysPlan.map((week) => (
                        <div key={week.week} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Week {week.week}</p>
                          <p className="mt-2 font-medium text-white">{week.focus}</p>
                          <p className="mt-2 text-sm text-zinc-400">{week.expectedOutcome}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </main>

            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Career value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    {formatRange(report.careerValue.realisticMin, report.careerValue.realisticMax)}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Confidence: {report.careerValue.confidence}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Career DNA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {report.careerDna.primaryType}-{report.careerDna.secondaryType}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">{report.careerDna.bottleneck}</p>
                </CardContent>
              </Card>

              {!isPro && (
                <Card className="border-violet-500/30 bg-violet-950/20">
                  <CardContent className="py-6">
                    <p className="font-medium text-white">Unlock the full agent loop</p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Pro keeps deeper salary analysis, all share cards, LinkedIn rewrite, and regeneration.
                    </p>
                    <Button asChild className="mt-4 w-full">
                      <Link href="/pricing">
                        Upgrade
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </aside>

            <section className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Share cards</h2>
                <Link href="/cards" className="text-sm text-violet-300 hover:text-violet-200">
                  Open all cards
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latestReport.shareCards.slice(0, isPro ? 6 : 3).map((card) => (
                  <Link key={card.id} href={`/share/${card.id}`} className="block transition hover:scale-[1.01]">
                    <ShareCardVisual
                      title={card.title}
                      subtitle={card.subtitle}
                      valueText={card.valueText}
                      bodyText={card.bodyText}
                      theme={card.theme}
                      compact
                    />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <Card className="mt-10 overflow-hidden border-violet-500/20">
            <CardContent className="grid gap-6 py-8 md:grid-cols-[1fr_240px] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-300">No report yet</p>
                <h2 className="font-display mt-3 text-2xl font-bold text-white">Build your first career agent.</h2>
                <p className="mt-3 text-zinc-400">
                  Start with your resume, choose the mode, then CareerOS will generate your diagnosis and first weekly missions.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/start">
                  Start agent setup
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="mb-4 h-5 w-5 text-violet-300" />
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</p>
        <p className="mt-2 text-xl font-semibold text-white">{value}</p>
        <p className="mt-1 text-xs text-zinc-500">{detail}</p>
      </CardContent>
    </Card>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-200">{value}</p>
    </div>
  );
}
