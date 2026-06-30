"use client";

import { motion } from "framer-motion";
import { CARD_THEMES } from "@/lib/cards";
import { cn } from "@/lib/utils";

type ShareCardProps = {
  title: string;
  subtitle?: string | null;
  valueText?: string | null;
  bodyText?: string | null;
  theme?: string;
  className?: string;
  compact?: boolean;
  index?: number;
};

export function ShareCardVisual({
  title,
  subtitle,
  valueText,
  bodyText,
  theme = "default",
  className,
  compact,
  index = 0,
}: ShareCardProps) {
  const t = CARD_THEMES[theme] ?? CARD_THEMES.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6",
        `bg-gradient-to-br ${t.gradient}`,
        compact ? "aspect-[4/5] w-full" : "min-h-[300px]",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08] transition group-hover:ring-white/[0.15]" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.06] blur-2xl transition group-hover:bg-white/[0.1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", t.accent)}>
            {title}
          </p>
          {valueText && (
            <p className="font-display mt-4 text-[2rem] font-bold leading-none tracking-tight text-white sm:text-[2.25rem]">
              {valueText}
            </p>
          )}
          {subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-300/90">{subtitle}</p>
          )}
          {bodyText && (
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-200/95">{bodyText}</p>
          )}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Made with CareerOS
          </p>
          <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
      </div>
    </motion.div>
  );
}
