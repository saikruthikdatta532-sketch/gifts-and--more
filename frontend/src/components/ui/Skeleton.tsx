import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-black/5 dark:bg-white/10",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
