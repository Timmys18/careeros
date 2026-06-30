"use client";

import { useEffect } from "react";
import { DEMO_REPORT, DEMO_PERSONA } from "@/lib/demo-report";
import { ReportView } from "@/components/report/report-view";

export default function DemoPage() {
  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "demo_viewed" }),
    }).catch(() => {});
  }, []);

  return (
    <div className="glow-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 rounded-2xl border border-violet-500/20 bg-violet-950/20 p-6">
          <p className="text-sm text-violet-400">Demo Report</p>
          <h1 className="text-2xl font-bold text-white">{DEMO_PERSONA.name}</h1>
          <p className="text-zinc-400">
            {DEMO_PERSONA.role} · {DEMO_PERSONA.experience} · {DEMO_PERSONA.location}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div><span className="text-zinc-500">Market value</span><p className="text-white">{DEMO_PERSONA.marketValue}</p></div>
            <div><span className="text-zinc-500">Career DNA</span><p className="text-white">{DEMO_PERSONA.careerDna}</p></div>
            <div><span className="text-zinc-500">Lost money</span><p className="text-white">{DEMO_PERSONA.lostMoney}</p></div>
            <div><span className="text-zinc-500">Goal</span><p className="text-white">{DEMO_PERSONA.goal}</p></div>
          </div>
        </div>
        <ReportView report={DEMO_REPORT} isPro={true} reportId="demo" />
      </div>
    </div>
  );
}
