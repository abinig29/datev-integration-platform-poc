import type { DatevProduct } from "@/types/api";

export const DATEV_PRODUCTS: DatevProduct[] = [
  {
    id: "personal",
    name: "DATEV Personal",
    description: "HR master data, documents, and exports",
    connected: true,
  },
  {
    id: "lodas",
    name: "DATEV LODAS",
    description: "Payroll and wage accounting",
    connected: true,
  },
  {
    id: "unternehmen-online",
    name: "DATEV Unternehmen online",
    description: "Company online services and submissions",
    connected: false,
  },
  {
    id: "rechnungswesen",
    name: "DATEV Rechnungswesen",
    description: "Financial accounting integration",
    connected: true,
  },
];

export const SCREEN_META = {
  a: {
    title: "Screen A — Overview",
    description: "Cross-product dashboard and integration health",
  },
  b: {
    title: "Screen B — Employees",
    description: "Virtualised employee list with EmployeeNotFound handling",
  },
  c: {
    title: "Screen C — HR Documents",
    description: "Upload-only hr:documents (no listing or download)",
  },
  d: {
    title: "Screen D — HR Exports",
    description: "hr:exports returns JSON payloads, not files",
  },
  e: {
    title: "Screen E — Async Jobs",
    description: "Platform async job model with polling",
  },
  f: {
    title: "Screen F — Tokens",
    description: "Opaque integration tokens (never treat as JWT)",
  },
} as const;

/** Demo personnel number that triggers EmployeeNotFound in sandbox */
export const EMPLOYEE_NOT_FOUND_DEMO_ID = "NOTFOUND";
