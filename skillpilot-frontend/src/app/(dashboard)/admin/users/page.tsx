"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Shield,
  Building2,
  Mail,
  Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles?: { name: string }[];
  tenant?: { name: string };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Global Users
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Monitor all registered users across the entire platform.
          </p>
        </div>
      </header>

      <Card className="overflow-hidden border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search users..." className="pl-10 h-10 border-none bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">User</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Workspace</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Roles</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Joined</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <Building2 size={12} className="text-slate-400" />
                      {u.tenant?.name || 'Platform Admin'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles?.map(r => (
                        <span key={r.name} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
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
