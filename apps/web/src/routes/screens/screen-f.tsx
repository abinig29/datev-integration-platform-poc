import { PageHeader } from "@/components/layout/page-header";
import { TokenDisplay } from "@/components/platform/token-display";
import { SCREEN_META } from "@/lib/constants";

export default function ScreenF() {
  const meta = SCREEN_META.f;

  return (
    <div className="space-y-8">
      <PageHeader title={meta.title} description={meta.description} />
      <TokenDisplay />
    </div>
  );
}
