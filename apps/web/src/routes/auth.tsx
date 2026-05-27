import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";
import { usePlatformStore } from "@/stores/platform-store";
import type { SessionUser } from "@/types/api";
import { ApiError } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(4, "At least 4 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const navigate = useNavigate();
  const setUser = usePlatformStore((s) => s.setUser);
  const user = usePlatformStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "operator@example.com", password: "demo" },
    mode: "onSubmit",
  });

  const login = useMutation({
    mutationFn: (data: LoginForm) =>
      apiFetch<{ user: SessionUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: ({ user }) => {
      setUser(user);
      toast.success("Signed in — session cookie set (HttpOnly, SameSite=Strict)");
      navigate("/screens/a");
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError ? err.body.message : "Login failed";
      toast.error(msg);
    },
  });

  if (user) {
    return <Navigate to="/screens/a" replace />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            DATEV Integration Platform POC — any email + password (4+ chars)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => login.mutate(data))}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email ? (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password ? (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="w-full max-w-md">
        <ConstraintNotice title="Cookie-based authentication">
          Login sets an <code>HttpOnly</code> session cookie. JavaScript cannot read
          it; API calls use <code>credentials: &quot;include&quot;</code>. No SaaS auth
          providers — aligned with the locked stack.
        </ConstraintNotice>
      </div>
    </div>
  );
}
