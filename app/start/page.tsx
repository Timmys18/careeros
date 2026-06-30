"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/shared/page-shell";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, ArrowRight, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StartPage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [linkedInText, setLinkedInText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setUploadError("Couldn't read the file. Paste your resume or LinkedIn text below.");
      }
    } catch {
      setUploadError("Couldn't read the file. Paste your resume or LinkedIn text below.");
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (resumeText.trim().length < 50) {
      setUploadError("Please paste at least a short resume or profile summary.");
      return;
    }
    sessionStorage.setItem("careeros_resume", resumeText);
    sessionStorage.setItem("careeros_linkedin", linkedInText);
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "resume_pasted" }),
    }).catch(() => {});
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "start_clicked" }),
    }).catch(() => {});
    router.push("/onboarding");
  }

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow="Step 1 of 3"
        title="Start your Career Report"
        description="Upload your resume or paste your LinkedIn/profile text. Your report is private by default."
      />

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-300/90">
        <Lock className="h-4 w-4 shrink-0" />
        Share cards only when you choose. We never auto-publish.
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
              <p className="text-xs text-zinc-500">PDF, DOCX, or TXT — max 10MB</p>
            </div>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-10 transition hover:border-violet-500/30 hover:bg-violet-500/[0.03]">
            <Upload className="mb-3 h-8 w-8 text-zinc-600" />
            <span className="text-sm text-zinc-400">
              {loading ? "Processing..." : "Drop file or click to browse"}
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
              <h2 className="font-medium text-white">Or paste text</h2>
              <p className="text-xs text-zinc-500">Resume, LinkedIn, or career summary</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Resume / career summary
              </label>
              <Textarea
                className="min-h-[180px] resize-none"
                placeholder="Paste your resume or career summary..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                LinkedIn / profile (optional)
              </label>
              <Textarea
                className="min-h-[100px] resize-none"
                placeholder="Headline, about section, profile text..."
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
          Continue to onboarding
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </PageShell>
  );
}
