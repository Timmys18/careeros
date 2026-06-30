"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/demo", label: "Demo" },
  { href: "/pricing", label: "Pricing" },
];

const authLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/start", label: "Refresh Agent" },
  { href: "/cards", label: "Cards" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const links = session ? authLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030305]/70 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/25 transition group-hover:bg-violet-500/25">
            <Sparkles className="h-4 w-4 text-violet-300" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            CareerOS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3.5 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              {label}
            </Link>
          ))}
          {!session && (
            <Link
              href="/auth/signin"
              className="rounded-lg px-3.5 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              Sign in
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              {session.user.subscriptionStatus === "PRO" && (
                <span className="hidden rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-violet-300 ring-1 ring-violet-500/30 sm:inline">
                  Pro
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/start">Build Agent</Link>
            </Button>
          )}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.06] bg-[#030305]/95 backdrop-blur-2xl transition-all md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04]"
            >
              {label}
            </Link>
          ))}
          {!session ? (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04]"
              >
                Sign in
              </Link>
              <Button asChild className="mt-2">
                <Link href="/start" onClick={() => setOpen(false)}>
                  Build my career agent
                </Link>
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
