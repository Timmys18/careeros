"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShareCardVisual } from "@/components/cards/share-card-visual";
import { ArrowRight, Shield, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useEffect } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function LandingPage() {
  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "landing_viewed" }),
    }).catch(() => {});
  }, []);

  return (
    <div className="mesh-bg overflow-hidden">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pt-24 md:pb-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-3.5 py-1.5 text-xs font-medium text-violet-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              Your career has no agent. Now it does.
            </div>

            <h1 className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              <span className="text-white">Know your true</span>
              <br />
              <span className="text-gradient-accent">career value.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              Upload your resume and get your AI Career Report — market value, Career DNA,
              lost money, and your next best move.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="glow-ring">
                <Link href="/start">
                  Get my Career Report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/demo">See example report</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-zinc-600" />
                Private by default
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-zinc-600" />
                Report in ~30 seconds
              </span>
            </div>
          </motion.div>

          {/* Hero cards stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="animate-float relative z-10">
              <ShareCardVisual
                title="AI estimated my market value"
                valueText="$160k–210k"
                subtitle="Product Manager · 7 years"
                theme="status"
                compact
                className="glow-ring mx-auto max-w-[280px]"
              />
            </div>
            <div className="animate-float-delay absolute -right-2 top-16 z-0 hidden scale-90 opacity-60 sm:block lg:-right-8">
              <ShareCardVisual
                title="My Career DNA"
                valueText="Builder-Operator"
                theme="identity"
                compact
                className="max-w-[220px]"
              />
            </div>
            <div className="animate-float absolute -left-4 bottom-8 z-0 hidden scale-[0.85] opacity-50 sm:block lg:-left-10">
              <ShareCardVisual
                title="Loyalty discount detected"
                valueText="$42k/yr"
                theme="fomo"
                compact
                className="max-w-[200px]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-center text-sm text-zinc-500 sm:px-6">
          {["Market value ranges", "Career DNA profiling", "Lost money analysis", "Viral share cards", "30-day action plan"].map(
            (item) => (
              <span key={item} className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-violet-500/60" />
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Bento preview */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400/80">
            Product preview
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            Bloomberg Terminal for your career
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "AI estimated my market value", value: "$160k–210k/year", sub: "Product Manager, 7 years", theme: "status" },
            { title: "My Career DNA", value: "Builder-Operator", sub: "I turn chaos into systems.", theme: "identity" },
            { title: "Loyalty discount detected", value: "$42k/year", sub: "I may be underpaid by this much.", theme: "fomo" },
            { title: "Money left on the table", value: "$120k–180k", sub: "Estimated over 5 years", theme: "serious" },
            { title: "My 10-year career path", body: "PM → Head of Product → VP → Founder", theme: "status" },
            { title: "CareerOS roasted my resume", body: "This is not a resume. This is a cry for positioning help.", theme: "funny" },
          ].map((card, i) => (
            <ShareCardVisual
              key={card.title}
              index={i}
              title={card.title}
              valueText={card.value}
              subtitle={card.sub}
              bodyText={card.body}
              theme={card.theme}
              compact
            />
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-white">Why CareerOS</h2>
          <p className="mt-3 text-zinc-400">Not another resume builder. A new category.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: TrendingUp, title: "Market value, not guesswork", desc: "AI-estimated ranges with confidence scores — not generic salary sites." },
            { icon: Sparkles, title: "Career DNA", desc: "Understand how you operate: Builder, Operator, Visionary, Founder." },
            { icon: Shield, title: "Private by default", desc: "Share only what you choose. Your report stays yours." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass glass-hover surface-card rounded-2xl p-7"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
                <Icon className="h-5 w-5 text-violet-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-4 pb-28 sm:px-6">
        <div className="surface-card glow-ring relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_70%)]" />
          <h2 className="font-display relative text-3xl font-bold text-white sm:text-4xl">
            You are not stuck.
            <br />
            <span className="text-gradient-accent">You are under-positioned.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-zinc-400">
            Free to start. Pro for the full picture — $29/month.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/start">Get my Career Report</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-zinc-600">
          Salary estimates are AI-generated and informational. CareerOS does not guarantee job offers,
          compensation, or promotions. Private by default. Share only what you choose.
        </p>
      </section>
    </div>
  );
}
