import { DocumentUpload } from "@/components/hr/document-upload";
import { PageHeader } from "@/components/layout/page-header";
import { SCREEN_META } from "@/lib/constants";

export default function ScreenC() {
  const meta = SCREEN_META.c;

  return (
    <div className="space-y-8">
      <PageHeader title={meta.title} description={meta.description} />
      <DocumentUpload />
    </div>
  );
}
