import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030305]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="font-display font-semibold text-white">CareerOS</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
              Your career has no agent. Now it does. Private by default.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/start" className="hover:text-white transition-colors">Get Report</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-600">Privacy-first by design</span></li>
                <li><span className="text-zinc-600">AI estimates, not guarantees</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-8 text-xs text-zinc-600 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} CareerOS. All rights reserved.</p>
          <p>Salary estimates are informational only.</p>
        </div>
      </div>
    </footer>
  );
}
