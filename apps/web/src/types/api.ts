export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface AsyncJob {
  id: string;
  type: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  result?: unknown;
  error?: string;
}

export interface Employee {
  id: string;
  personnelNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  productId: DatevProductId;
}

export type DatevProductId =
  | "personal"
  | "lodas"
  | "unternehmen-online"
  | "rechnungswesen";

export interface DatevProduct {
  id: DatevProductId;
  name: string;
  description: string;
  connected: boolean;
}

export interface OpaqueToken {
  id: string;
  label: string;
  /** Opaque value — never parse or display in full in production UX */
  value: string;
  productId: DatevProductId;
  expiresAt: string;
}

export interface HrExportResult {
  exportId: string;
  format: "json";
  generatedAt: string;
  recordCount: number;
  data: Record<string, unknown>[];
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorBody,
  ) {
    super(body.message);
    this.name = "ApiError";
  }
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
}
