export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex flex-col items-start mb-4">
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-brand-black/50 dark:text-white/50">
        {children}
      </span>
      <span className="mt-1.5 h-[3px] w-10 rounded-full bg-brand-pink" />
    </div>
  );
}
