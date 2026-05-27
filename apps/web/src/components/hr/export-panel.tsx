import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { AsyncJobPanel } from "@/components/jobs/async-job-panel";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type { HrExportResult } from "@/types/api";

export function ExportPanel() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<HrExportResult | null>(null);

  const startExport = useMutation({
    mutationFn: () =>
      apiFetch<{ jobId: string; note: string }>("/hr/exports", {
        method: "POST",
        body: JSON.stringify({ type: "employees" }),
      }),
    onSuccess: (data) => {
      setJobId(data.jobId);
      setJsonResult(null);
      toast.info(data.note);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const fetchResult = useMutation({
    mutationFn: () => apiFetch<HrExportResult>(`/hr/exports/${jobId}`),
    onSuccess: (data) => {
      if ("recordCount" in data) {
        setJsonResult(data);
        toast.success("Export JSON ready — not a file download");
      }
    },
  });

  return (
    <div className="space-y-4">
      <ConstraintNotice title="hr:exports — JSON only" variant="warning">
        Exports complete as <strong>JSON payloads</strong>. The UI must not offer a file
        download button for export results — display or copy JSON instead.
      </ConstraintNotice>

      <div className="flex gap-2">
        <Button
          onClick={() => startExport.mutate()}
          disabled={startExport.isPending}
        >
          Start export job
        </Button>
        {jobId ? (
          <Button
            variant="outline"
            onClick={() => fetchResult.mutate()}
            disabled={fetchResult.isPending}
          >
            Fetch JSON result
          </Button>
        ) : null}
      </div>

      <AsyncJobPanel jobId={jobId} title="Export job" />

      {jsonResult ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Export result ({jsonResult.recordCount} records) —{" "}
            <code>application/json</code>
          </p>
          <pre className="max-h-64 overflow-auto border bg-muted/50 p-4 text-xs">
            {JSON.stringify(jsonResult, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
