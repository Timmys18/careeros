"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mesh-bg flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">404</p>
      <h1 className="font-display mt-4 text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 max-w-sm text-zinc-400">
        This route doesn&apos;t exist — but your career path still does.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to CareerOS</Link>
      </Button>
    </div>
  );
}
