import { http, HttpResponse } from "msw";

import { DATEV_PRODUCTS } from "@/lib/constants";
import {
  advanceJob,
  createJob,
  exportResults,
  jobs,
  mockEmployees,
  mockTokens,
  mockUser,
} from "./data";

export const handlers = [
  http.get("/api/products", () => HttpResponse.json(DATEV_PRODUCTS)),

  http.get("/api/auth/session", () =>
    HttpResponse.json({ user: mockUser }),
  ),

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email && body.password.length >= 4) {
      return HttpResponse.json(
        { user: mockUser },
        {
          headers: {
            "Set-Cookie":
              "datev_session=mock-httpOnly-token; Path=/; HttpOnly; SameSite=Strict",
          },
        },
      );
    }
    return HttpResponse.json(
      { code: "InvalidCredentials", message: "Invalid email or password" },
      { status: 401 },
    );
  }),

  http.post("/api/auth/logout", () =>
    HttpResponse.json(
      { ok: true },
      {
        headers: {
          "Set-Cookie":
            "datev_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
        },
      },
    ),
  ),

  http.get("/api/employees", () => HttpResponse.json(mockEmployees)),

  http.get("/api/employees/:personnelNumber", ({ params, request }) => {
    const pn = String(params.personnelNumber);
    const sandbox = request.headers.get("X-DATEV-Sandbox") === "true";

    if (pn === "NOTFOUND" || (sandbox && pn === "99999")) {
      return HttpResponse.json(
        {
          code: "EmployeeNotFound",
          message: sandbox
            ? "Employee not found in sandbox dataset"
            : "Employee not found",
        },
        { status: 404 },
      );
    }

    const employee = mockEmployees.find((e) => e.personnelNumber === pn);
    if (!employee) {
      return HttpResponse.json(
        { code: "EmployeeNotFound", message: "Employee not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(employee);
  }),

  http.get("/api/hr/documents", () =>
    HttpResponse.json(
      {
        code: "MethodNotAllowed",
        message:
          "hr:documents is upload-only. Listing documents is not supported by the POC API.",
      },
      { status: 405 },
    ),
  ),

  http.post("/api/hr/documents", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return HttpResponse.json(
        { code: "ValidationError", message: "File is required" },
        { status: 400 },
      );
    }
    const job = createJob("hr:document-upload");
    job.result = { fileName: file.name, size: file.size };
    jobs.set(job.id, job);
    return HttpResponse.json({ jobId: job.id }, { status: 202 });
  }),

  http.post("/api/hr/exports", async ({ request }) => {
    const body = (await request.json()) as { type?: string };
    const job = createJob("hr:export");
    exportResults.set(job.id, {
      exportId: job.id,
      format: "json",
      generatedAt: new Date().toISOString(),
      recordCount: 0,
      data: [],
    });
    return HttpResponse.json(
      {
        jobId: job.id,
        note: "hr:exports returns JSON — not a downloadable file",
        exportType: body.type ?? "employees",
      },
      { status: 202 },
    );
  }),

  http.get("/api/hr/exports/:jobId", ({ params }) => {
    const job = jobs.get(String(params.jobId));
    if (!job) {
      return HttpResponse.json(
        { code: "NotFound", message: "Export job not found" },
        { status: 404 },
      );
    }
    advanceJob(job.id);
    const updated = jobs.get(job.id)!;
    if (updated.status !== "completed") {
      return HttpResponse.json({ status: updated.status, progress: updated.progress });
    }
    return HttpResponse.json(updated.result, {
      headers: { "Content-Type": "application/json" },
    });
  }),

  http.get("/api/jobs", () =>
    HttpResponse.json(Array.from(jobs.values()).reverse()),
  ),

  http.get("/api/jobs/:id", ({ params }) => {
    const id = String(params.id);
    let job = jobs.get(id);
    if (!job) {
      return HttpResponse.json(
        { code: "NotFound", message: "Job not found" },
        { status: 404 },
      );
    }
    if (job.status !== "completed" && job.status !== "failed") {
      advanceJob(id);
      job = jobs.get(id)!;
    }
    return HttpResponse.json(job);
  }),

  http.post("/api/jobs", async ({ request }) => {
    const body = (await request.json()) as { type: string };
    const job = createJob(body.type ?? "generic");
    return HttpResponse.json(job, { status: 202 });
  }),

  http.get("/api/tokens", () => HttpResponse.json(mockTokens)),
];
