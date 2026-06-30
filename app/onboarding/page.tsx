"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  Crosshair,
  Flame,
  MapPin,
  Rocket,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, PageShell } from "@/components/shared/page-shell";
import { AGENT_MODES, getAgentModeById } from "@/lib/career-agent";

type Answers = Record<string, string>;

const STEPS = [
  "Mode",
  "Current signal",
  "Money",
  "Target",
  "Bottleneck",
];

const MODE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  promotion: Target,
  "new-role": BriefcaseBusiness,
  compensation: BadgeDollarSign,
  pivot: Compass,
  founder: Rocket,
};

const INITIAL_ANSWERS: Answers = {
  agentMode: "promotion",
  jobSearchStatus: "TRYING_TO_GET_PROMOTED",
  careerGoal: "Turn current scope into promotion leverage.",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [error, setError] = useState("");

  const selectedMode = useMemo(() => getAgentModeById(answers.agentMode), [answers.agentMode]);
  const progress = ((step + 1) / STEPS.length) * 100;

  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "agent_setup_started" }),
    }).catch(() => {});
  }, []);

  function updateAnswer(key: string, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function chooseMode(modeId: string) {
    const mode = getAgentModeById(modeId);
    setAnswers((current) => ({
      ...current,
      agentMode: mode.id,
      jobSearchStatus: mode.jobSearchStatus,
      careerGoal: mode.goal,
      targetRole: current.targetRole || mode.dashboardFocus,
    }));
    setError("");
  }

  function validateCurrentStep() {
    if (step === 1) {
      return Boolean(
        answers.currentTitle?.trim() &&
          answers.yearsExperience?.trim() &&
          answers.location?.trim(),
      );
    }
    if (step === 3) {
      return Boolean(answers.dreamRole?.trim() || answers.targetRole?.trim());
    }
    if (step === 4) {
      return Boolean(answers.frustration?.trim());
    }
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      setError("Give the agent enough signal to make the report specific.");
      return;
    }
    setError("");
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    finishOnboarding();
  }

  async function finishOnboarding() {
    const resume = sessionStorage.getItem("careeros_resume") ?? "";
    const linkedIn = sessionStorage.getItem("careeros_linkedin") ?? "";
    const finalAnswers: Answers = {
      ...answers,
      careerGoal: answers.careerGoal || selectedMode.goal,
      jobSearchStatus: answers.jobSearchStatus || selectedMode.jobSearchStatus,
    };

    sessionStorage.setItem("careeros_onboarding", JSON.stringify(finalAnswers));
    sessionStorage.setItem("careeros_agent_mode", selectedMode.id);

    if (status !== "authenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/generating")}&intent=generate`);
      return;
    }

    try {
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawResumeText: resume,
          rawLinkedInText: linkedIn || undefined,
          currentTitle: finalAnswers.currentTitle,
          location: finalAnswers.location,
          yearsExperience: parseInt(finalAnswers.yearsExperience, 10) || undefined,
          currentCompensationMin: parseInt(finalAnswers.currentCompMin, 10) || undefined,
          currentCompensationMax: parseInt(finalAnswers.currentCompMax, 10) || undefined,
          targetCompensation: parseInt(finalAnswers.targetComp, 10) || undefined,
          targetRole: finalAnswers.targetRole,
          dreamRole: finalAnswers.dreamRole || finalAnswers.targetRole,
          targetIndustries: finalAnswers.industries
            ?.split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
          jobSearchStatus: finalAnswers.jobSearchStatus,
          relocationPreference: finalAnswers.relocation,
          remotePreference: finalAnswers.remotePreference,
          careerGoal: finalAnswers.careerGoal,
          biggestFrustration: finalAnswers.frustration,
        }),
      });
      const { profileId, error: err } = await profileRes.json();
      if (err) throw new Error(err);
      sessionStorage.setItem("careeros_profileId", profileId);
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "agent_setup_completed",
          properties: { mode: selectedMode.id },
        }),
      });
      router.push("/generating");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    }
  }

  return (
    <PageShell className="min-h-[calc(100vh-4.25rem)]">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <PageHeader
            eyebrow={`Agent setup - ${step + 1}/${STEPS.length}`}
            title={step === 0 ? "Choose what your agent is optimizing for" : STEPS[step]}
            description="CareerOS gets sharper when it knows the job you are hiring it to do."
          />

          <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {AGENT_MODES.map((mode) => {
                    const Icon = MODE_ICONS[mode.id] ?? Target;
                    const active = selectedMode.id === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => chooseMode(mode.id)}
                        className={`rounded-2xl border p-5 text-left transition ${
                          active
                            ? "border-violet-400/60 bg-violet-500/15"
                            : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                            <Icon className="h-5 w-5 text-violet-200" />
                          </div>
                          {active && <CheckCircle2 className="h-5 w-5 text-emerald-300" />}
                        </div>
                        <p className="font-display text-lg font-semibold text-white">{mode.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{mode.goal}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <SetupPanel>
                  <Field label="Current role / title">
                    <Input
                      value={answers.currentTitle ?? ""}
                      onChange={(e) => updateAnswer("currentTitle", e.target.value)}
                      placeholder="Senior Product Manager"
                      autoFocus
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Years of experience">
                      <Input
                        type="number"
                        value={answers.yearsExperience ?? ""}
                        onChange={(e) => updateAnswer("yearsExperience", e.target.value)}
                        placeholder="7"
                      />
                    </Field>
                    <Field label="Current location">
                      <Input
                        value={answers.location ?? ""}
                        onChange={(e) => updateAnswer("location", e.target.value)}
                        placeholder="Berlin, remote, NYC..."
                      />
                    </Field>
                  </div>
                  <Field label="Remote / location preference">
                    <Input
                      value={answers.remotePreference ?? ""}
                      onChange={(e) => updateAnswer("remotePreference", e.target.value)}
                      placeholder="Remote US, London only, open to relocation..."
                    />
                  </Field>
                </SetupPanel>
              )}

              {step === 2 && (
                <SetupPanel>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Current min, USD">
                      <Input
                        type="number"
                        value={answers.currentCompMin ?? ""}
                        onChange={(e) => updateAnswer("currentCompMin", e.target.value)}
                        placeholder="120000"
                      />
                    </Field>
                    <Field label="Current max, USD">
                      <Input
                        type="number"
                        value={answers.currentCompMax ?? ""}
                        onChange={(e) => updateAnswer("currentCompMax", e.target.value)}
                        placeholder="140000"
                      />
                    </Field>
                    <Field label="Target, USD">
                      <Input
                        type="number"
                        value={answers.targetComp ?? ""}
                        onChange={(e) => updateAnswer("targetComp", e.target.value)}
                        placeholder="190000"
                      />
                    </Field>
                  </div>
                  <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-sm text-amber-100/90">
                    Compensation is optional, but it unlocks the most useful "lost money" and negotiation analysis.
                  </div>
                </SetupPanel>
              )}

              {step === 3 && (
                <SetupPanel>
                  <Field label="Target role">
                    <Input
                      value={answers.targetRole ?? ""}
                      onChange={(e) => updateAnswer("targetRole", e.target.value)}
                      placeholder="Group PM, Head of Product, AI GTM Lead..."
                    />
                  </Field>
                  <Field label="Dream role in 5-10 years">
                    <Input
                      value={answers.dreamRole ?? ""}
                      onChange={(e) => updateAnswer("dreamRole", e.target.value)}
                      placeholder="VP Product, Founder, CPO..."
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Target industries">
                      <Input
                        value={answers.industries ?? ""}
                        onChange={(e) => updateAnswer("industries", e.target.value)}
                        placeholder="AI, SaaS, fintech"
                      />
                    </Field>
                    <Field label="Relocation">
                      <Input
                        value={answers.relocation ?? ""}
                        onChange={(e) => updateAnswer("relocation", e.target.value)}
                        placeholder="No, open, only Europe..."
                      />
                    </Field>
                  </div>
                </SetupPanel>
              )}

              {step === 4 && (
                <SetupPanel>
                  <Field label="Biggest career frustration">
                    <Textarea
                      className="min-h-[140px]"
                      value={answers.frustration ?? ""}
                      onChange={(e) => updateAnswer("frustration", e.target.value)}
                      placeholder="I am doing next-level work, but my title and compensation have not caught up."
                      autoFocus
                    />
                  </Field>
                  <Field label="What should the agent be brutally honest about?">
                    <Textarea
                      className="min-h-[110px]"
                      value={answers.agentBrief ?? ""}
                      onChange={(e) => updateAnswer("agentBrief", e.target.value)}
                      placeholder="My resume is too generic, I avoid negotiation, I do not know how to position myself..."
                    />
                  </Field>
                </SetupPanel>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button className="flex-1" size="lg" onClick={handleNext}>
              {step === STEPS.length - 1 ? "Build my agent" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="surface-card rounded-2xl p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Agent memory preview</p>
                <p className="text-xs text-zinc-500">What CareerOS will optimize.</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <Signal icon={Crosshair} label="Mode" value={selectedMode.title} />
              <Signal icon={BriefcaseBusiness} label="Current" value={answers.currentTitle || "Not set yet"} />
              <Signal icon={MapPin} label="Market" value={answers.location || "Not set yet"} />
              <Signal icon={BadgeDollarSign} label="Money target" value={answers.targetComp ? `$${answers.targetComp}` : "Optional"} />
              <Signal icon={Flame} label="Bottleneck" value={answers.frustration || "Waiting for signal"} />
            </div>
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">First weekly loop</p>
              <p className="mt-2 text-sm text-zinc-200">
                Your report will become a dashboard with weekly missions, not a dead-end PDF.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function SetupPanel({ children }: { children: React.ReactNode }) {
  return <div className="surface-card space-y-5 rounded-2xl p-6 sm:p-8">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Signal({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-white/[0.03] p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mt-0.5 text-zinc-200">{value}</p>
      </div>
    </div>
  );
}
