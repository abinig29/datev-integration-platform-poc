import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api-client";
import type { DatevProduct } from "@/types/api";

export function ProductCards() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiFetch<DatevProduct[]>("/products"),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {products?.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle>{product.name}</CardTitle>
              <Badge variant={product.connected ? "default" : "secondary"}>
                {product.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="text-xs text-muted-foreground">{product.id}</code>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
