import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShareCardVisual } from "@/components/cards/share-card-visual";

export default async function CardsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const cards = await prisma.shareCard.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="glow-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white">Your Share Cards</h1>
        <p className="mt-2 text-zinc-400">Share only what you choose. Each card has a public link.</p>

        {cards.length === 0 ? (
          <p className="mt-12 text-center text-zinc-500">
            No cards yet. <Link href="/start" className="text-violet-400 hover:underline">Generate a report</Link> first.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link key={card.id} href={`/share/${card.id}`} className="block hover:scale-[1.02] transition-transform">
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
        )}
      </div>
    </div>
  );
}
