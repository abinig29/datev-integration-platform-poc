import { FlaskConical } from "lucide-react";

import { usePlatformStore } from "@/stores/platform-store";

export function SandboxBanner() {
  const sandboxMode = usePlatformStore((s) => s.sandboxMode);

  if (!sandboxMode) return null;

  return (
    <div className="flex items-center gap-2 border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-800 dark:text-amber-200">
      <FlaskConical className="size-3.5 shrink-0" />
      <span>
        <strong>Sandbox mode</strong> — API calls include{" "}
        <code className="rounded bg-background/50 px-1">X-DATEV-Sandbox: true</code>.
        Employee lookup for personnel number{" "}
        <code className="rounded bg-background/50 px-1">99999</code> returns{" "}
        <code className="rounded bg-background/50 px-1">EmployeeNotFound</code>.
      </span>
    </div>
  );
}
