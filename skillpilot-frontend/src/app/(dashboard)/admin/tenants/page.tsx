"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Settings, 
  Search, 
  MoreVertical, 
  Activity,
  Globe,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import api from "@/lib/api";

interface Tenant {
  id: number;
  name: string;
  slug: string;
  users_count?: number;
  is_active: boolean;
  plan?: string;
}

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await api.get<Tenant[]>("/admin/tenants");
        setTenants(response.data);
      } catch (err) {
        console.error("Failed to fetch tenants", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenants();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tenants Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Monitor and manage all active workspaces and their subscription health.
          </p>
        </div>
        <Button variant="primary" size="lg" className="gap-2 shadow-primary/30">
          <Plus size={20} />
          Provision New Tenant
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Tenants</p>
              <p className="text-3xl font-extrabold tracking-tight">342</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Now</p>
              <p className="text-3xl font-extrabold tracking-tight">1,284</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Global Coverage</p>
              <p className="text-3xl font-extrabold tracking-tight">12 <small className="text-xs">Regions</small></p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search tenants..." className="pl-10 h-10 border-none bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export CSV</Button>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0"><Settings size={18} /></Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Workspace</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Plan</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Users</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{t.slug}.skillpilot.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                      t.plan === 'Enterprise' ? "bg-purple-500/10 border-purple-500/20 text-purple-500" : (t.plan === 'Pro' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-500" : "bg-slate-100 border-slate-200 text-slate-600")
                    )}>
                      {t.plan || 'Standard'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <Users size={14} className="text-slate-400" />
                      {(t.users_count || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", t.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                      <span className="text-xs font-bold capitalize text-slate-600 dark:text-slate-300">{t.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary">
                      <MoreVertical size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}
