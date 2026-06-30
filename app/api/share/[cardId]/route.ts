import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEvent, EVENTS } from "@/lib/analytics";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  const { cardId } = await params;

  const card = await prisma.shareCard.findUnique({
    where: { id: cardId, isPublic: true },
    select: {
      id: true,
      type: true,
      title: true,
      subtitle: true,
      valueText: true,
      bodyText: true,
      theme: true,
      viewCount: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  await prisma.shareCard.update({
    where: { id: cardId },
    data: { viewCount: { increment: 1 } },
  });

  await trackEvent(EVENTS.PUBLIC_CARD_VIEWED, {
    properties: { cardId },
  });

  return NextResponse.json(card);
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ cardId: string }> },
) {
  const { cardId } = await params;

  await prisma.shareCard.update({
    where: { id: cardId },
    data: { shareCount: { increment: 1 } },
  });

  await trackEvent(EVENTS.CARD_SHARED, { properties: { cardId } });

  return NextResponse.json({ ok: true });
}
