import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAsyncJob } from "@/hooks/use-async-job";
import type { JobStatus } from "@/types/api";

function statusVariant(status: JobStatus) {
  switch (status) {
    case "completed":
      return "default" as const;
    case "failed":
      return "destructive" as const;
    case "running":
      return "warning" as const;
    default:
      return "secondary" as const;
  }
}

interface AsyncJobPanelProps {
  jobId: string | null;
  title?: string;
}

export function AsyncJobPanel({ jobId, title = "Async job" }: AsyncJobPanelProps) {
  const { data: job, isFetching, isError, error } = useAsyncJob(jobId);

  if (!jobId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Start an operation to track job status. Jobs are polled every 1.5s while running.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {isFetching ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {isError ? (
          <p className="text-sm text-destructive">
            {(error as Error).message}
          </p>
        ) : job ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <code className="bg-muted px-1.5 py-0.5">{job.id}</code>
              <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
              <span className="text-muted-foreground">{job.type}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="h-2 bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
            {job.status === "completed" && job.result ? (
              <pre className="max-h-40 overflow-auto border bg-muted/50 p-3 text-xs">
                {JSON.stringify(job.result, null, 2)}
              </pre>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Loading job…</p>
        )}
      </CardContent>
    </Card>
  );
}
