"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Sidebar } from "./Sidebar";
import MobileMenu from "./MobileMenu";

const unprotectedRoutes = ["/login", "/register"];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  const pathname = usePathname();
  const router = useRouter();

  const isUnprotected = unprotectedRoutes.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isUnprotected) {
      router.push("/login");
    }
  }, [user, loading, pathname, isUnprotected, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  } 

  if (!user && !isUnprotected) {
    return null;
  }

  // ✅ Proper layout wrapper with flex
  return (
    <div className="lg:flex h-screen bg-background">
      {!isUnprotected && (
        <>
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <Sidebar  />
          </div>
          <div className=" border border-gray-300 lg:hidden px-4 py-2">
            <MobileMenu />
          </div>
        </>
      )}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
