"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const STEPS = [
  "Building your career agent memory...",
  "Estimating your market value...",
  "Finding the positioning gap...",
  "Turning the report into weekly missions...",
  "Generating private share cards...",
];

export default function GeneratingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function generate() {
      let profileId = sessionStorage.getItem("careeros_profileId");

      if (!profileId) {
        const onboarding = sessionStorage.getItem("careeros_onboarding");
        const resume = sessionStorage.getItem("careeros_resume");
        if (!onboarding || !resume) {
          router.push("/start");
          return;
        }

        const answers = JSON.parse(onboarding);
        const frustration = [answers.frustration, answers.agentBrief]
          .filter(Boolean)
          .join(" Agent honesty brief: ");

        const profileRes = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawResumeText: resume,
            rawLinkedInText: sessionStorage.getItem("careeros_linkedin") || undefined,
            currentTitle: answers.currentTitle,
            location: answers.location,
            yearsExperience: parseInt(answers.yearsExperience, 10) || undefined,
            currentCompensationMin: parseInt(answers.currentCompMin, 10) || undefined,
            currentCompensationMax: parseInt(answers.currentCompMax, 10) || undefined,
            targetCompensation: parseInt(answers.targetComp, 10) || undefined,
            targetRole: answers.targetRole,
            dreamRole: answers.dreamRole || answers.targetRole,
            targetIndustries: answers.industries
              ?.split(",")
              .map((s: string) => s.trim())
              .filter(Boolean),
            jobSearchStatus: answers.jobSearchStatus,
            relocationPreference: answers.relocation,
            remotePreference: answers.remotePreference,
            careerGoal: answers.careerGoal,
            biggestFrustration: frustration,
          }),
        });
        const data = await profileRes.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        profileId = data.profileId;
      }

      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      sessionStorage.removeItem("careeros_profileId");
      router.push(`/report/${data.reportId}`);
    }

    generate();
  }, [router]);

  if (error) {
    return (
      <div className="mesh-bg flex min-h-[70vh] items-center justify-center px-4">
        <div className="surface-card max-w-md rounded-2xl p-8 text-center">
          <p className="text-rose-400">{error}</p>
          <a href="/demo" className="mt-4 inline-block text-sm text-violet-400 hover:underline">
            View demo report instead
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="relative mb-12">
        <div className="absolute inset-0 animate-pulse rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-full w-full rounded-full border border-violet-500/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
          <div className="relative h-3 w-3 rounded-full bg-violet-400 shadow-lg shadow-violet-500/50" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="font-display text-xl font-medium text-white sm:text-2xl"
        >
          {STEPS[stepIndex]}
        </motion.p>
      </AnimatePresence>
      <p className="mt-4 text-sm text-zinc-500">Usually 15-30 seconds</p>
    </div>
  );
}
