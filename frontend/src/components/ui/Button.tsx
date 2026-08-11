import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink-dark";

  const variants = {
    primary:
      "bg-brand-black text-white hover:bg-black/85 dark:bg-brand-pink dark:text-brand-black dark:hover:bg-brand-pink-dark shadow-soft hover:shadow-soft-lg",
    secondary:
      "bg-brand-pink text-brand-black hover:bg-brand-pink-dark shadow-soft hover:shadow-pink-glow",
    outline:
      "border border-brand-black/20 dark:border-white/20 text-brand-black dark:text-white hover:border-brand-black dark:hover:border-brand-pink hover:bg-brand-black/5 dark:hover:bg-white/5",
    ghost: "text-brand-black dark:text-white hover:bg-brand-black/5 dark:hover:bg-white/10",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
