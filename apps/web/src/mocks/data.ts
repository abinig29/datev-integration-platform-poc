import type { AsyncJob, Employee, HrExportResult, OpaqueToken, SessionUser } from "@/types/api";

export const mockUser: SessionUser = {
  id: "usr-1",
  email: "operator@example.com",
  name: "POC Operator",
  role: "operator",
};

export const mockEmployees: Employee[] = Array.from({ length: 120 }, (_, i) => ({
  id: `emp-${i + 1}`,
  personnelNumber: String(10000 + i),
  firstName: ["Anna", "Max", "Lisa", "Tom", "Sara"][i % 5],
  lastName: ["Müller", "Schmidt", "Weber", "Fischer", "Becker"][i % 5],
  department: ["HR", "Finance", "IT", "Operations"][i % 4],
  productId: "personal",
}));

export const jobs = new Map<string, AsyncJob>();

export const mockTokens: OpaqueToken[] = [
  {
    id: "tok-1",
    label: "Personal API",
    value: "datev_opq_7f3a9c2e1b8d4f6a0e5c9b2d7f1a4e8c",
    productId: "personal",
    expiresAt: new Date(Date.now() + 86_400_000 * 30).toISOString(),
  },
  {
    id: "tok-2",
    label: "LODAS connector",
    value: "datev_opq_2c8f1a9e4b7d0f3e6a1c5b9d2e7f4a0c",
    productId: "lodas",
    expiresAt: new Date(Date.now() + 86_400_000 * 14).toISOString(),
  },
];

export const exportResults = new Map<string, HrExportResult>();

export function createJob(type: string): AsyncJob {
  const id = `job-${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();
  const job: AsyncJob = {
    id,
    type,
    status: "pending",
    progress: 0,
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(id, job);
  return job;
}

export function advanceJob(id: string): AsyncJob | undefined {
  const job = jobs.get(id);
  if (!job || job.status === "completed" || job.status === "failed") return job;

  const next = { ...job, updatedAt: new Date().toISOString() };

  if (job.status === "pending") {
    next.status = "running";
    next.progress = 25;
  } else if (job.status === "running" && job.progress < 90) {
    next.progress = Math.min(90, job.progress + 35);
  } else {
    next.status = "completed";
    next.progress = 100;
    if (job.type === "hr:export") {
      next.result = {
        exportId: id,
        format: "json",
        generatedAt: new Date().toISOString(),
        recordCount: 42,
        data: [{ personnelNumber: "10001", status: "active" }],
      } satisfies HrExportResult;
    } else if (job.type === "hr:document-upload") {
      next.result = { documentId: `doc-${id}`, status: "accepted" };
    }
  }

  jobs.set(id, next);
  return next;
}
