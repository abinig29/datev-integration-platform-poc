import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/layout/page-header";
import { ProductCards } from "@/components/platform/product-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DATEV_PRODUCTS, SCREEN_META } from "@/lib/constants";

const chartData = DATEV_PRODUCTS.map((p) => ({
  name: p.name.split(" ").pop() ?? p.id,
  jobs: p.connected ? Math.floor(Math.random() * 40) + 10 : 0,
}));

export default function ScreenA() {
  const meta = SCREEN_META.a;

  return (
    <div className="space-y-8">
      <PageHeader title={meta.title} description={meta.description} />
      <ProductCards />
      <Card>
        <CardHeader>
          <CardTitle>Jobs by product (sample)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="jobs" fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
