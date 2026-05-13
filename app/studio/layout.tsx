"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { StudioLoading } from "@/components/StudioLoading";

export default function StudioLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <StudioLoading />;
  if (!isAuthenticated) return <StudioLoading />;
  return <>{children}</>;
}
