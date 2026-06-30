"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, PageShell } from "@/components/shared/page-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QUESTIONS = [
  { key: "currentTitle", label: "Current role / title", type: "text", required: true },
  { key: "yearsExperience", label: "Years of experience", type: "number", required: true },
  { key: "location", label: "Current location", type: "text", required: true },
  { key: "remotePreference", label: "Target location or remote preference", type: "text", required: true },
  { key: "currentCompMin", label: "Current compensation (min USD)", type: "number", required: false },
  { key: "currentCompMax", label: "Current compensation (max USD)", type: "number", required: false },
  { key: "targetComp", label: "Target compensation (USD)", type: "number", required: false },
  { key: "careerGoal", label: "Main career goal", type: "text", required: true },
  { key: "dreamRole", label: "Dream role in 5–10 years", type: "text", required: true },
  { key: "industries", label: "Target industries (comma-separated)", type: "text", required: false },
  { key: "frustration", label: "Biggest career frustration", type: "text", required: true },
  { key: "relocation", label: "Willingness to relocate", type: "text", required: false },
  {
    key: "jobSearchStatus",
    label: "Current job search status",
    type: "select",
    options: [
      { value: "NOT_LOOKING", label: "Not looking" },
      { value: "CASUALLY_OPEN", label: "Casually open" },
      { value: "ACTIVELY_LOOKING", label: "Actively looking" },
      { value: "TRYING_TO_GET_PROMOTED", label: "Trying to get promoted" },
      { value: "CONSIDERING_FOUNDER_PATH", label: "Considering founder path" },
    ],
    required: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "onboarding_started" }),
    }).catch(() => {});
  }, []);

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  function handleNext() {
    if (q.required && !answers[q.key]?.trim()) {
      setError("This field is required");
      return;
    }
    setError("");
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  }

  async function finishOnboarding() {
    const resume = sessionStorage.getItem("careeros_resume") ?? "";
    const linkedIn = sessionStorage.getItem("careeros_linkedin") ?? "";
    sessionStorage.setItem("careeros_onboarding", JSON.stringify(answers));

    if (status !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/generating");
      return;
    }

    try {
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawResumeText: resume,
          rawLinkedInText: linkedIn || undefined,
          currentTitle: answers.currentTitle,
          location: answers.location,
          yearsExperience: parseInt(answers.yearsExperience, 10) || undefined,
          currentCompensationMin: parseInt(answers.currentCompMin, 10) || undefined,
          currentCompensationMax: parseInt(answers.currentCompMax, 10) || undefined,
          targetCompensation: parseInt(answers.targetComp, 10) || undefined,
          dreamRole: answers.dreamRole,
          targetIndustries: answers.industries?.split(",").map((s) => s.trim()).filter(Boolean),
          jobSearchStatus: answers.jobSearchStatus,
          relocationPreference: answers.relocation,
          remotePreference: answers.remotePreference,
          careerGoal: answers.careerGoal,
          biggestFrustration: answers.frustration,
        }),
      });
      const { profileId, error: err } = await profileRes.json();
      if (err) throw new Error(err);
      sessionStorage.setItem("careeros_profileId", profileId);
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: "onboarding_completed" }),
      });
      router.push("/generating");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    }
  }

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow={`Step 2 of 3 · ${step + 1}/${QUESTIONS.length}`}
        title={q.label}
        description="Quick questions to sharpen your Career Report."
      />

      <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="surface-card rounded-2xl p-6 sm:p-8"
        >
          {q.type === "select" ? (
            <select
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-white outline-none transition focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20"
              value={answers[q.key] ?? ""}
              onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
            >
              <option value="" className="bg-zinc-900">Select...</option>
              {q.options?.map((o) => (
                <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
              ))}
            </select>
          ) : (
            <Input
              type={q.type}
              className="h-12 text-base"
              value={answers[q.key] ?? ""}
              onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="mt-4 text-sm text-rose-400">{error}</p>
      )}

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <Button className="flex-1" size="lg" onClick={handleNext}>
          {step === QUESTIONS.length - 1 ? "Generate report" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </PageShell>
  );
}
