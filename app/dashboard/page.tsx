import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareCardVisual } from "@/components/cards/share-card-visual";
import { trackEvent, EVENTS } from "@/lib/analytics";
import type { CareerReportAIOutput } from "@/lib/ai/schemas";
import { formatRange } from "@/lib/utils";

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
    include: { shareCards: true },
  });

  const isPro = session.user.subscriptionStatus === "PRO";
  const report = latestReport?.fullReport as CareerReportAIOutput | undefined;

  return (
    <div className="glow-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-400">Welcome back{session.user.name ? `, ${session.user.name}` : ""}</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary">
              <Link href="/cards">My Cards</Link>
            </Button>
            <Button asChild>
              <Link href="/start">New Report</Link>
            </Button>
          </div>
        </div>

        {params.upgraded && (
          <div className="mt-6 rounded-lg border border-green-500/30 bg-green-950/20 p-4 text-green-300">
            Pro unlocked. Full report access is now active.
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-zinc-400">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{isPro ? "Pro" : "Free"}</p>
              {!isPro && (
                <Button asChild className="mt-4" size="sm">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {report && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-zinc-400">Career Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {formatRange(report.careerValue.realisticMin, report.careerValue.realisticMax)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-zinc-400">Career DNA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {report.careerDna.primaryType}-{report.careerDna.secondaryType}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {latestReport && report ? (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Latest Report</h2>
              <Link href={`/report/${latestReport.id}`} className="text-violet-400 hover:underline text-sm">
                View full report →
              </Link>
            </div>

            {report.next30DaysPlan[0] && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Next 30 Days — Week 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-violet-300 font-medium">{report.next30DaysPlan[0].focus}</p>
                  <ul className="mt-2 text-sm text-zinc-300 space-y-1">
                    {report.next30DaysPlan[0].actions.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <h3 className="text-lg font-medium text-white mb-4">Share Cards</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestReport.shareCards.slice(0, isPro ? undefined : 3).map((card) => (
                <Link key={card.id} href={`/share/${card.id}`}>
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
          </div>
        ) : (
          <Card className="mt-12 text-center py-12">
            <CardContent>
              <p className="text-zinc-400 mb-4">No reports yet. Generate your first Career Report.</p>
              <Button asChild>
                <Link href="/start">Get my Career Report</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
