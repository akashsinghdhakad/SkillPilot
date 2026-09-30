"use client";

import React from "react";
import { Bell, Search, User as UserIcon, Settings } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800 px-8 transition-colors">
      <div className="h-full flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search courses, lessons..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-950 transition-all text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-950" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-100 dark:border-slate-800" />

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                {user?.roles?.[0]?.name || 'Learner'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm overflow-hidden">
              <UserIcon size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
