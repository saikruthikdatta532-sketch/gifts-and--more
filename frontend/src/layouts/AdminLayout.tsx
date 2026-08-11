import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/enquiries", label: "Enquiries" },
  { to: "/admin/revenue", label: "Revenue" },
  { to: "/admin/logs", label: "Activity Logs" },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-black/[0.015] dark:bg-white/[0.02]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark">
        <div className="h-16 flex items-center px-6 border-b border-black/5 dark:border-white/10">
          <span className="font-display text-lg">
            Return<span className="text-brand-pink-dark">Gifts</span>
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-pink text-brand-black"
                    : "text-brand-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-black/5 dark:border-white/10">
          <p className="text-xs text-brand-black/40 dark:text-white/40 truncate">{user?.email}</p>
          <button
            onClick={() => logout().then(() => (window.location.href = "/"))}
            className="text-sm text-brand-pink-dark font-medium mt-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-5 sm:px-8 border-b border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark">
          <span className="font-display text-base md:hidden">Admin</span>
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <NavLink to="/" className="text-sm text-brand-black/60 dark:text-white/60 hover:text-brand-pink-dark">
              View site →
            </NavLink>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto gap-2 px-4 py-3 border-b border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 px-4 py-2 rounded-full text-xs font-medium",
                  isActive
                    ? "bg-brand-pink text-brand-black"
                    : "bg-black/5 dark:bg-white/10 text-brand-black/60 dark:text-white/60"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
