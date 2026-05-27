import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-async-job";

export function JobList() {
  const { data: jobs, isLoading } = useJobs();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : !jobs?.length ? (
          <p className="text-sm text-muted-foreground">No jobs yet.</p>
        ) : (
          <ul className="divide-y text-sm">
            {jobs.map((job) => (
              <li key={job.id} className="flex items-center justify-between py-2">
                <div>
                  <code className="text-xs">{job.id}</code>
                  <p className="text-muted-foreground">{job.type}</p>
                </div>
                <Badge
                  variant={
                    job.status === "completed"
                      ? "default"
                      : job.status === "failed"
                        ? "destructive"
                        : "warning"
                  }
                >
                  {job.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
