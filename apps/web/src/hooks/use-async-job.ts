import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { AsyncJob } from "@/types/api";

export function useAsyncJob(jobId: string | null) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => apiFetch<AsyncJob>(`/jobs/${jobId}`),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "completed" || status === "failed") return false;
      return 1500;
    },
  });
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => apiFetch<AsyncJob[]>("/jobs"),
    refetchInterval: 3000,
  });
}
