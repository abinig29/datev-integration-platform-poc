import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { AsyncJobPanel } from "@/components/jobs/async-job-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlatformStore } from "@/stores/platform-store";

export function DocumentUpload() {
  const [jobId, setJobId] = useState<string | null>(null);
  const sandboxMode = usePlatformStore((s) => s.sandboxMode);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const headers: HeadersInit = sandboxMode
        ? { "X-DATEV-Sandbox": "true" }
        : {};
      const res = await fetch("/api/hr/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers,
      });
      const data = (await res.json()) as { jobId?: string; message?: string };
      if (!res.ok) throw new Error(data.message ?? "Upload failed");
      return data;
    },
    onSuccess: (data) => {
      setJobId(data.jobId ?? null);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Document upload accepted (async job created)");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-4">
      <ConstraintNotice title="hr:documents — upload only">
        The POC API does not support listing or downloading documents. Only{" "}
        <code>POST /api/hr/documents</code> is available. A GET request returns 405.
      </ConstraintNotice>

      <div className="space-y-3 border p-4">
        <div className="space-y-2">
          <Label htmlFor="document-file">Upload document</Label>
          <Input
            id="document-file"
            type="file"
            accept=".pdf,.xml,.csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
            }}
          />
        </div>
        <Button disabled={upload.isPending} variant="secondary">
          {upload.isPending ? "Uploading…" : "Select file to upload"}
        </Button>
      </div>

      <Button
        variant="outline"
        type="button"
        onClick={async () => {
          const res = await fetch("/api/hr/documents", { credentials: "include" });
          const data = await res.json();
          toast.error(`GET returned ${res.status}: ${(data as { message?: string }).message}`);
        }}
      >
        Try GET /hr/documents (expect 405)
      </Button>

      <AsyncJobPanel jobId={jobId} title="Upload job" />
    </div>
  );
}
