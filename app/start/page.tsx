"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  BrainCircuit,
  FileText,
  Lock,
  Radar,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/shared/page-shell";
import { Textarea } from "@/components/ui/textarea";

export default function StartPage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [linkedInText, setLinkedInText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);

  const signalStrength = useMemo(() => {
    const total = resumeText.trim().length + linkedInText.trim().length;
    if (total > 3000) return "Strong";
    if (total > 900) return "Good";
    if (total > 120) return "Light";
    return "Waiting";
  }, [linkedInText, resumeText]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.extractedText) {
        setResumeText(data.extractedText);
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventName: "resume_uploaded" }),
        }).catch(() => {});
      } else {
        setUploadError("Could not read the file. Paste your resume or LinkedIn text below.");
      }
    } catch {
      setUploadError("Could not read the file. Paste your resume or LinkedIn text below.");
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (resumeText.trim().length < 50) {
      setUploadError("Paste at least a short resume, LinkedIn summary, or career history first.");
      return;
    }
    sessionStorage.setItem("careeros_resume", resumeText);
    sessionStorage.setItem("careeros_linkedin", linkedInText);
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "agent_intake_completed",
        properties: { signalStrength },
      }),
    }).catch(() => {});
    router.push("/onboarding");
  }

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main>
          <PageHeader
            eyebrow="Step 1 of 3 - career memory"
            title="Give CareerOS the raw material"
            description="Upload your resume, paste LinkedIn, or write the messy version. The agent will turn it into market value, positioning, weak spots, and weekly moves."
          />

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <TrustPill icon={Lock} title="Private by default" text="Nothing is shared unless you choose." />
            <TrustPill icon={Radar} title="Market lens" text="Compensation, level, and positioning." />
            <TrustPill icon={BrainCircuit} title="Agent memory" text="Report becomes an action system." />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="surface-card rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
                  <Upload className="h-5 w-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="font-medium text-white">Upload resume</h2>
                  <p className="text-xs text-zinc-500">PDF, DOCX, or TXT - max 10MB</p>
                </div>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-10 transition hover:border-violet-500/30 hover:bg-violet-500/[0.03]">
                <Upload className="mb-3 h-8 w-8 text-zinc-600" />
                <span className="text-sm text-zinc-400">
                  {loading ? "Reading file..." : "Drop file or click to browse"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleUpload}
                  className="sr-only"
                  disabled={loading}
                />
              </label>
            </div>

            <div className="surface-card rounded-2xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
                  <FileText className="h-5 w-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="font-medium text-white">Or paste the source text</h2>
                  <p className="text-xs text-zinc-500">Resume, LinkedIn, bio, or raw career notes</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Resume / career summary
                  </label>
                  <Textarea
                    className="min-h-[210px] resize-none"
                    placeholder="Paste your resume, career history, wins, projects, promotions, metrics..."
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      setUploadError("");
                    }}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                    LinkedIn / public profile (optional)
                  </label>
                  <Textarea
                    className="min-h-[110px] resize-none"
                    placeholder="Headline, about section, featured work, profile positioning..."
                    value={linkedInText}
                    onChange={(e) => setLinkedInText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {uploadError && (
              <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-300">
                {uploadError}
              </p>
            )}

            <Button className="w-full" size="lg" onClick={handleContinue} disabled={loading}>
              Continue to agent setup
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </main>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Live intake</p>
            <div className="mt-4 space-y-4">
              <PreviewMetric label="Signal strength" value={signalStrength} />
              <PreviewMetric label="Resume chars" value={resumeText.trim().length.toLocaleString()} />
              <PreviewMetric label="LinkedIn chars" value={linkedInText.trim().length.toLocaleString()} />
            </div>
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <BadgeDollarSign className="h-4 w-4 text-emerald-300" />
                What this unlocks
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Market value range and confidence</li>
                <li>Career DNA and positioning gap</li>
                <li>Resume roast and LinkedIn rewrite</li>
                <li>Weekly missions after the report</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function TrustPill({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
      <Icon className="mb-3 h-4 w-4 text-violet-300" />
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{text}</p>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
