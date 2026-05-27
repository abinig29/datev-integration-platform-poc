import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SessionUser } from "@/types/api";

interface PlatformState {
  sandboxMode: boolean;
  setSandboxMode: (enabled: boolean) => void;
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  isAuthenticated: () => boolean;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      sandboxMode: true,
      setSandboxMode: (enabled) => set({ sandboxMode: enabled }),
      user: null,
      setUser: (user) => set({ user }),
      isAuthenticated: () => get().user !== null,
    }),
    { name: "datev-platform-poc" },
  ),
);
