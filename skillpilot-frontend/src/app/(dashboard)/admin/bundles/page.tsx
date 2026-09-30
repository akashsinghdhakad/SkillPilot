"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Package,
  Layers,
  DollarSign,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  is_active: boolean;
  courses_count: number;
}

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await api.get("/v1/bundles");
        setBundles(response.data);
      } catch (err) {
        console.error("Failed to fetch bundles", err);
        toast.error("Failed to load bundles");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBundles();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Course Bundles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Create and manage course packages to offer better value to your students.
          </p>
        </div>
        <Button className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20">
          <Plus size={20} />
          Create Bundle
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <Card className="overflow-hidden border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="Search bundles..." className="pl-10 h-10 border-none bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Package Name</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Price</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Items</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bundles.map((bundle) => (
                  <tr key={bundle.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{bundle.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{bundle.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                        <DollarSign size={14} />
                        {bundle.price}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Layers size={14} />
                        {bundle.courses_count || 0} Courses
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                        bundle.is_active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-100 border-slate-200 text-slate-500"
                      )}>
                        {bundle.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bundles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 italic">
                      No bundles created yet. Start by grouping courses together!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
