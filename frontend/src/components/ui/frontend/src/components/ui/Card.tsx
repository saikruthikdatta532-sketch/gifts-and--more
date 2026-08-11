import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = true, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-surface-off-dark border border-black/5 dark:border-white/5 shadow-soft",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
