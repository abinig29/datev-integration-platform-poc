import { PageHeader } from "@/components/layout/page-header";
import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { usePlatformStore } from "@/stores/platform-store";

export default function AdminPage() {
  const sandboxMode = usePlatformStore((s) => s.sandboxMode);
  const setSandboxMode = usePlatformStore((s) => s.setSandboxMode);
  const user = usePlatformStore((s) => s.user);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin"
        description="Platform settings and sandbox configuration"
      />

      <Card>
        <CardHeader>
          <CardTitle>Sandbox mode</CardTitle>
          <CardDescription>
            When enabled, requests send X-DATEV-Sandbox and use sandbox-specific API
            behaviour (e.g. EmployeeNotFound for 99999).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <input
            id="sandbox"
            type="checkbox"
            checked={sandboxMode}
            onChange={(e) => setSandboxMode(e.target.checked)}
            className="size-4"
          />
          <Label htmlFor="sandbox">Enable sandbox environment</Label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>HttpOnly cookie auth (POC assumption)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">User:</span> {user?.name} (
            {user?.email})
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span> {user?.role}
          </p>
        </CardContent>
      </Card>

      <ConstraintNotice title="Auth cookies">
        Production uses <code>HttpOnly</code> session cookies with{" "}
        <code>SameSite=Strict</code>. The browser sends them automatically via{" "}
        <code>credentials: &quot;include&quot;</code> — tokens are not stored in
        localStorage.
      </ConstraintNotice>
    </div>
  );
}
