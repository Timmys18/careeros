"use client";

import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ProGate({
  children,
  locked,
  title = "Pro insight",
  className,
}: {
  children: React.ReactNode;
  locked: boolean;
  title?: string;
  className?: string;
}) {
  if (!locked) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none blur-sm opacity-60">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
        <Card className="mx-4 max-w-sm border-violet-500/30 bg-[#0d0d14]/95">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-8 w-8 text-violet-400" />
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-sm text-zinc-400">
              Unlock the full report with Pro — deeper salary analysis, skill gaps, and your 30-day plan.
            </p>
            <Button asChild>
              <Link href="/pricing">Upgrade to Pro — $29/mo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
