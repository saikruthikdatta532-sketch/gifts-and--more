import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-11 h-6 rounded-full bg-brand-black/10 dark:bg-white/15 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink-dark"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-brand-pink shadow-soft transition-transform duration-300 ${
          theme === "dark" ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
