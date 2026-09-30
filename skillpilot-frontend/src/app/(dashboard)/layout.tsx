"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "@/components/shared/Sidebar";
import { UserNav } from "@/components/shared/UserNav";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, hasHydrated]);

  // If not hydrated yet, render nothing to prevent hydration mismatches or premature redirects
  if (!hasHydrated) {
    return null;
  }

  // Once hydrated, if not authenticated, return null (the useEffect above will handle the redirect)
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar />
      
      <main className="pl-72 flex flex-col min-h-screen">
        <UserNav />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
