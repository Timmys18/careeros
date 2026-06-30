"use client";

import { Suspense, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const intent = searchParams.get("intent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(intent === "generate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const copy = useMemo(() => {
    if (intent === "generate") {
      return {
        title: isRegister ? "Save your agent" : "Sign in to generate",
        subtitle: "Your setup is ready. Create an account so CareerOS can save the report, weekly missions, and future progress.",
      };
    }
    return {
      title: isRegister ? "Create account" : "Sign in",
      subtitle: isRegister ? "Start your private AI career agent." : "Welcome back to CareerOS.",
    };
  }, [intent, isRegister]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="mesh-bg min-h-screen px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-violet-300">CareerOS private agent</p>
          <h1 className="font-display text-5xl font-bold leading-tight text-white">
            Keep the report. Keep the memory. Keep improving.
          </h1>
          <div className="mt-8 grid gap-3">
            <AuthProof icon={BrainCircuit} text="Your resume and goals become reusable career memory." />
            <AuthProof icon={CheckCircle2} text="The report turns into weekly missions after generation." />
            <AuthProof icon={ShieldCheck} text="Share cards stay private until you deliberately publish them." />
          </div>
        </section>

        <Card className="w-full">
          <CardHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/12 ring-1 ring-violet-500/20">
              <LockKeyhole className="h-5 w-5 text-violet-200" />
            </div>
            <CardTitle>{copy.title}</CardTitle>
            <p className="text-sm leading-relaxed text-zinc-400">{copy.subtitle}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Working..." : isRegister ? "Create account and continue" : "Sign in and continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <button
              type="button"
              className="mt-4 w-full text-sm text-zinc-400 hover:text-white"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
            <Link href="/demo" className="mt-4 block text-center text-sm text-violet-400 hover:underline">
              View demo report without signing up
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AuthProof({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-zinc-300">
      <Icon className="h-5 w-5 text-violet-300" />
      <span>{text}</span>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="glow-bg min-h-screen" />}>
      <SignInForm />
    </Suspense>
  );
}
