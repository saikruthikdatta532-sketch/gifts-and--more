import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "pink" | "outline" | "muted";
  className?: string;
}

export function Badge({ children, variant = "pink", className }: BadgeProps) {
  const variants = {
    pink: "bg-brand-pink text-brand-black",
    outline: "border border-brand-black/20 dark:border-white/20 text-current",
    muted: "bg-black/5 dark:bg-white/10 text-brand-black/70 dark:text-white/70",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
