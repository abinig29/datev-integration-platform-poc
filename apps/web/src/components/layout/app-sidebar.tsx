import {
  FileJson,
  FileUp,
  KeyRound,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";
import { usePlatformStore } from "@/stores/platform-store";

const navItems = [
  { to: "/screens/a", label: "Screen A", icon: LayoutDashboard },
  { to: "/screens/b", label: "Screen B", icon: Users },
  { to: "/screens/c", label: "Screen C", icon: FileUp },
  { to: "/screens/d", label: "Screen D", icon: FileJson },
  { to: "/screens/e", label: "Screen E", icon: ListTodo },
  { to: "/screens/f", label: "Screen F", icon: KeyRound },
  { to: "/admin", label: "Admin", icon: Settings },
] as const;

export function AppSidebar() {
  const navigate = useNavigate();
  const setUser = usePlatformStore((s) => s.setUser);
  const user = usePlatformStore((s) => s.user);

  async function handleLogout() {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
    navigate("/auth");
  }

  return (
    <aside className="flex w-56 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="border-b px-4 py-4">
        <p className="text-xs font-medium text-muted-foreground">DATEV</p>
        <p className="text-sm font-semibold">Integration Platform</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-none px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-3">
        <p className="truncate px-1 text-xs text-muted-foreground">{user?.email}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
