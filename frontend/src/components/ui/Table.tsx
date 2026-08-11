import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-surface-off-dark">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-black/[0.03] dark:bg-white/[0.05] text-left text-xs uppercase tracking-wide text-brand-black/50 dark:text-white/50">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-medium whitespace-nowrap">{children}</th>;
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t border-black/5 dark:border-white/5">{children}</tr>;
}
