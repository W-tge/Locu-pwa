"use client";

import { useEffect, type ReactNode } from "react";
import { setAuthTokenProvider } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    setAuthTokenProvider(() => getAuthToken());
    return () => setAuthTokenProvider(null);
  }, []);

  return <>{children}</>;
}
