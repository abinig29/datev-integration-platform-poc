import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { JobList } from "@/components/jobs/job-list";
import { AsyncJobPanel } from "@/components/jobs/async-job-panel";
import { ConstraintNotice } from "@/components/layout/constraint-notice";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { SCREEN_META } from "@/lib/constants";
import type { AsyncJob } from "@/types/api";

export default function ScreenE() {
  const meta = SCREEN_META.e;
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createJob = useMutation({
    mutationFn: () =>
      apiFetch<AsyncJob>("/jobs", {
        method: "POST",
        body: JSON.stringify({ type: "platform:sync" }),
      }),
    onSuccess: (job) => {
      setActiveJobId(job.id);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(`Job ${job.id} created — polling until complete`);
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title={meta.title}
        description={meta.description}
        actions={
          <Button onClick={() => createJob.mutate()} disabled={createJob.isPending}>
            Create demo job
          </Button>
        }
      />

      <ConstraintNotice title="Async job model">
        Long-running operations return <code>202 Accepted</code> with a{" "}
        <code>jobId</code>. Poll <code>GET /api/jobs/:id</code> until status is{" "}
        <code>completed</code> or <code>failed</code>. TanStack Query refetches every
        1.5s while the job is active.
      </ConstraintNotice>

      <div className="grid gap-6 lg:grid-cols-2">
        <AsyncJobPanel jobId={activeJobId} />
        <JobList />
      </div>
    </div>
  );
}
