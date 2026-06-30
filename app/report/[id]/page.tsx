import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProUser } from "@/lib/payments";
import { ReportView } from "@/components/report/report-view";
import type { CareerReportAIOutput } from "@/lib/ai/schemas";
import { trackEvent, EVENTS } from "@/lib/analytics";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const report = await prisma.careerReport.findUnique({
    where: { id },
    include: { shareCards: true },
  });

  if (!report || report.status !== "COMPLETED") {
    notFound();
  }

  if (report.userId !== session?.user?.id) {
    notFound();
  }

  await trackEvent(EVENTS.REPORT_VIEWED, {
    userId: session.user.id,
    properties: { reportId: id },
  });

  const fullReport = report.fullReport as CareerReportAIOutput;
  const isPro = isProUser(
    session.user.subscriptionStatus ?? "FREE",
    report.isProUnlocked,
  );

  const shareCardIds: Record<string, string> = {};
  for (const card of report.shareCards) {
    shareCardIds[card.type] = card.id;
  }

  return (
    <div className="glow-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ReportView
          report={fullReport}
          isPro={isPro}
          shareCardIds={shareCardIds}
          reportId={id}
        />
      </div>
    </div>
  );
}
