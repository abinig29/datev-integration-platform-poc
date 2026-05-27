import { Navigate, Outlet } from "react-router";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SandboxBanner } from "@/components/layout/sandbox-banner";
import { usePlatformStore } from "@/stores/platform-store";

export function DashboardLayout() {
  const user = usePlatformStore((s) => s.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-svh flex-col">
      <SandboxBanner />
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
