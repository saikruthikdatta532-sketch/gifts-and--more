interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-16 h-16 rounded-full bg-brand-pink/40 mb-5" />
      <h3 className="font-display text-xl mb-2">{title}</h3>
      {description && (
        <p className="text-brand-black/60 dark:text-white/60 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
