# DATEV Integration Platform — POC Dashboard

Portfolio / proof-of-concept React dashboard aligned with the **DATEV Integration Platform** job scope: React 18, Vite, shadcn/ui, TanStack Query (async jobs), TanStack Table + Virtual (employees), React Hook Form + Zod, Zustand, Recharts, i18next, and cookie-based auth assumptions.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| UI | shadcn/ui, Tailwind CSS, Radix UI |
| Server state | TanStack Query (job polling) |
| Tables | TanStack Table + TanStack Virtual |
| Forms | React Hook Form + Zod |
| Client UI state | Zustand |
| Charts | Recharts |
| i18n | i18next |
| API mocking (dev) | MSW |
| Package manager | pnpm |

## Screens (interim mapping until scope doc)

| Route | Screen | Focus |
|-------|--------|--------|
| `/screens/a` | Screen A | 4 DATEV products overview + chart |
| `/screens/b` | Screen B | Virtualised employees + `EmployeeNotFound` |
| `/screens/c` | Screen C | `hr:documents` upload-only |
| `/screens/d` | Screen D | `hr:exports` JSON (no file download) |
| `/screens/e` | Screen E | Async jobs + TanStack Query polling |
| `/screens/f` | Screen F | Opaque integration tokens |
| `/admin` | Admin | Sandbox toggle, session info |
| `/auth` | Auth | Login (React Hook Form + Zod, HttpOnly cookies) |

**Demo login:** any email + password with 4+ characters (e.g. `operator@example.com` / `demo`).

Platform UX constraints reflected in the UI:

- Async job model
- Opaque tokens
- Sandbox mode
- `EmployeeNotFound` behavior
- `hr:documents` — upload-only
- `hr:exports` — JSON responses, not file downloads

## Getting started

```bash
cd datev-integration-platform-poc
pnpm install
pnpm dev:web
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
datev-integration-platform-poc/
├── apps/web/          # Vite SPA (dashboard)
└── packages/
    ├── config/        # Shared TS config
    └── env/           # Typed env helpers
```

## Scripts

- `pnpm dev` / `pnpm dev:web` — development server
- `pnpm build` — production build
- `pnpm check-types` — TypeScript check

## Next steps

1. Replace interim screen mapping when `scope_datev_integration_platform.md` is available.
2. Point API client at real DATEV POC backend (MSW only runs in dev).
3. Extend i18n (`public/locales/`) and align copy with final scope.

## Deploy to Vercel (demo using mocks)

This UI can be deployed on Vercel while keeping the same behavior by running MSW in production.

1. Set environment variable: `VITE_USE_MOCKS=true`
2. Build: `pnpm build`
3. In Vercel project settings, set Output Directory to: `apps/web/dist`
4. Ensure Vercel uses SPA rewrites (handled by `vercel.json` in this repo).

Built with [Better Fullstack](https://github.com/Marve10s/Better-Fullstack).
