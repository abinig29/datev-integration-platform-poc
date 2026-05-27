import { createBrowserRouter } from "react-router";

import AppShell from "./app-shell";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import AdminPage from "./routes/admin";
import AuthPage from "./routes/auth";
import { RootRedirect } from "./routes/root-redirect";
import ScreenA from "./routes/screens/screen-a";
import ScreenB from "./routes/screens/screen-b";
import ScreenC from "./routes/screens/screen-c";
import ScreenD from "./routes/screens/screen-d";
import ScreenE from "./routes/screens/screen-e";
import ScreenF from "./routes/screens/screen-f";

function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">The requested page could not be found.</p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <RootRedirect /> },
      { path: "auth", element: <AuthPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: "screens/a", element: <ScreenA /> },
          { path: "screens/b", element: <ScreenB /> },
          { path: "screens/c", element: <ScreenC /> },
          { path: "screens/d", element: <ScreenD /> },
          { path: "screens/e", element: <ScreenE /> },
          { path: "screens/f", element: <ScreenF /> },
          { path: "admin", element: <AdminPage /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
