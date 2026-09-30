"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  MoreVertical, 
  Building2,
  Layers,
  Star,
  Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Course {
  id: number;
  title: string;
  lessons_count?: number;
  tenant?: { name: string };
  is_published?: boolean;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/admin/courses");
        setCourses(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Global Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Review and manage all course content across the platform.
          </p>
        </div>
      </header>

      <Card className="overflow-hidden border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search courses..." className="pl-10 h-10 border-none bg-slate-50 dark:bg-slate-950" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Course</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Workspace</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Curriculum</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <BookOpen size={20} />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <Building2 size={12} className="text-slate-400" />
                      {c.tenant?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Layers size={14} />
                      {c.lessons_count || 0} Lessons
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                      c.is_published ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-100 border-slate-200 text-slate-500"
                    )}>
                      {c.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
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
