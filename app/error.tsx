"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mesh-bg flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Error</p>
      <h1 className="font-display mt-4 text-3xl font-bold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-zinc-400">
        We hit a snag. Your data is safe — try again.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
