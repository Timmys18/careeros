import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShareCardVisual } from "@/components/cards/share-card-visual";
import { Button } from "@/components/ui/button";
import { trackEvent, EVENTS } from "@/lib/analytics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = await prisma.shareCard.findUnique({
    where: { id, isPublic: true },
  });
  if (!card) return { title: "CareerOS" };

  return {
    title: `${card.title} | CareerOS`,
    description: card.subtitle ?? card.bodyText ?? "AI Career Report card",
    openGraph: {
      title: card.title,
      description: card.subtitle ?? card.valueText ?? "Made with CareerOS",
      type: "website",
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const card = await prisma.shareCard.findUnique({
    where: { id, isPublic: true },
  });

  if (!card) notFound();

  await prisma.shareCard.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  await trackEvent(EVENTS.PUBLIC_CARD_VIEWED, { properties: { cardId: id } });

  return (
    <div className="glow-bg flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <ShareCardVisual
          title={card.title}
          subtitle={card.subtitle}
          valueText={card.valueText}
          bodyText={card.bodyText}
          theme={card.theme}
          compact
        />
      </div>
      <div className="mt-8 text-center">
        <p className="text-zinc-400 mb-4">Want your own Career Report?</p>
        <Button asChild size="lg">
          <Link href="/start">Get your own CareerOS report</Link>
        </Button>
        <p className="mt-8 text-xs text-zinc-600">Made with CareerOS</p>
      </div>
    </div>
  );
}
