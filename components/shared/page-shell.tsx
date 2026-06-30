import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageShell({ children, className, narrow }: PageShellProps) {
  return (
    <div className={cn("mesh-bg min-h-[calc(100vh-4.25rem)]", className)}>
      <div
        className={cn(
          "mx-auto px-4 py-12 sm:px-6 sm:py-16",
          narrow ? "max-w-2xl" : "max-w-6xl",
        )}
      >
        {children}
      </div>
    </div>
  );
}

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function PageHeader({ eyebrow, title, description, align = "left" }: PageHeaderProps) {
  return (
    <div className={cn("mb-10", align === "center" && "text-center")}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-violet-400/90">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className={cn("mt-3 text-base leading-relaxed text-zinc-400", align === "center" && "mx-auto max-w-xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
