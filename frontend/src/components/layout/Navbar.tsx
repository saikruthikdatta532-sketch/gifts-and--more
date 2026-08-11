import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { cn } from "@/utils/cn";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/bulk-orders", label: "Bulk Orders" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-display text-lg font-semibold tracking-tight">
          Return<span className="text-brand-pink-dark">Gifts</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-brand-black dark:text-white"
                    : "text-brand-black/55 dark:text-white/55 hover:text-brand-black dark:hover:text-white"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              {user.image && (
                <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
              )}
              <button
                onClick={() => authService.logout().then(() => window.location.reload())}
                className="text-sm text-brand-black/60 dark:text-white/60 hover:text-brand-black dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-sm font-medium px-5 py-2 rounded-full bg-brand-black text-white dark:bg-brand-pink dark:text-brand-black hover:opacity-90 transition-opacity"
            >
              Sign in
            </NavLink>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark px-5 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "py-3 text-sm font-medium border-b border-black/5 dark:border-white/5 last:border-none",
                  isActive ? "text-brand-pink-dark" : "text-brand-black/70 dark:text-white/70"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="mt-3 text-center text-sm font-medium px-5 py-3 rounded-full bg-brand-black text-white dark:bg-brand-pink dark:text-brand-black"
          >
            {user ? "My Account" : "Sign in"}
          </NavLink>
        </nav>
      )}
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {open ? (
        <path
          d="M6 6l12 12M6 18L18 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
