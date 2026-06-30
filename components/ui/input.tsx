import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-zinc-600 transition focus-visible:border-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
