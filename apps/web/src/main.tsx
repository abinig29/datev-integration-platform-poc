import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import { router } from "./router";

async function enableMocking() {
  // For a deployed demo (Vercel), we enable MSW when VITE_USE_MOCKS=true.
  // In local development, it's always enabled.
  const shouldMock =
    import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === "true";

  if (!shouldMock) return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

enableMocking().then(() => {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
});
