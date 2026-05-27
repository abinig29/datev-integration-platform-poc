import { Navigate } from "react-router";

import { usePlatformStore } from "@/stores/platform-store";

export function RootRedirect() {
  const user = usePlatformStore((s) => s.user);
  return <Navigate to={user ? "/screens/a" : "/auth"} replace />;
}
