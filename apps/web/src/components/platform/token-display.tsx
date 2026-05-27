import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api-client";
import type { OpaqueToken } from "@/types/api";

function maskToken(value: string) {
  if (value.length <= 12) return "••••••••••••";
  return `${value.slice(0, 8)}${"•".repeat(16)}${value.slice(-4)}`;
}

export function TokenDisplay() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const { data: tokens, isLoading } = useQuery({
    queryKey: ["tokens"],
    queryFn: () => apiFetch<OpaqueToken[]>("/tokens"),
  });

  return (
    <div className="space-y-4">
      <ConstraintNotice title="Opaque tokens">
        Integration tokens are <strong>opaque strings</strong> — do not parse them as JWTs
        or expose full values in logs. Display masked by default; reveal only on explicit
        user action.
      </ConstraintNotice>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="grid gap-3">
          {tokens?.map((token) => (
            <Card key={token.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-sm">{token.label}</CardTitle>
                <Badge variant="outline">{token.productId}</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <code className="block break-all bg-muted px-2 py-1.5 text-xs">
                  {revealed[token.id] ? token.value : maskToken(token.value)}
                </code>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Expires {new Date(token.expiresAt).toLocaleDateString()}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() =>
                      setRevealed((r) => ({ ...r, [token.id]: !r[token.id] }))
                    }
                  >
                    {revealed[token.id] ? (
                      <>
                        <EyeOff className="size-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-3" /> Reveal
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
