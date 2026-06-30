"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    desc: "Get started with your career snapshot",
    features: [
      "Basic Career Value",
      "Career DNA",
      "Limited report",
      "3 share cards",
      "Demo access",
    ],
    cta: "Get started",
    href: "/start",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "Full report and all share cards",
    features: [
      "Full report",
      "All share cards",
      "LinkedIn rewrite",
      "Resume bullets",
      "Skill gaps",
      "Next 30 days plan",
      "Deeper salary analysis",
      "Report regeneration",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Executive",
    price: "$149",
    period: "/month",
    desc: "Coming soon — white-glove career strategy",
    features: [
      "Everything in Pro",
      "1:1 career strategy sessions",
      "Executive positioning",
      "Priority support",
    ],
    cta: "Join waitlist",
    highlight: false,
    comingSoon: true,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [waitlist, setWaitlist] = useState(false);

  async function handleCheckout() {
    if (!session) {
      window.location.href = "/auth/signin?callbackUrl=/pricing";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glow-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Pricing</h1>
          <p className="mt-2 text-zinc-400">Your market value changed. Your title didn&apos;t.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlight ? "border-violet-500/50 ring-1 ring-violet-500/30" : ""}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold text-white">
                  {plan.price}
                  {plan.period && <span className="text-base font-normal text-zinc-400">{plan.period}</span>}
                </p>
                <p className="text-sm text-zinc-400">{plan.desc}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.comingSoon ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setWaitlist(true)}
                  >
                    {waitlist ? "You're on the list" : plan.cta}
                  </Button>
                ) : plan.highlight ? (
                  <Button className="w-full" onClick={handleCheckout} disabled={loading}>
                    {loading ? "Processing..." : plan.cta}
                  </Button>
                ) : (
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={plan.href!}>{plan.cta}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-zinc-500 max-w-2xl mx-auto">
          Salary estimates are AI-generated and informational. CareerOS does not guarantee job offers, compensation, or promotions.
        </p>
      </div>
    </div>
  );
}
