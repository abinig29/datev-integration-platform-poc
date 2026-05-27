import { ExportPanel } from "@/components/hr/export-panel";
import { PageHeader } from "@/components/layout/page-header";
import { SCREEN_META } from "@/lib/constants";

export default function ScreenD() {
  const meta = SCREEN_META.d;

  return (
    <div className="space-y-8">
      <PageHeader title={meta.title} description={meta.description} />
      <ExportPanel />
    </div>
  );
}
