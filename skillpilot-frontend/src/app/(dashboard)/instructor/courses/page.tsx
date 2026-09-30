"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Eye, 
  Trash2, 
  Users, 
  DollarSign, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Switch } from "@/components/ui/switch";

interface InstructorCourse {
  id: number;
  title: string;
  students_count?: number;
  revenue?: number;
  status: 'published' | 'draft' | 'pending';
  is_active: boolean;
  updated_at: string;
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const deleteCourse = async (id: number) => {
    if (processingId === id) return;
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    setProcessingId(id);
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete course", err);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleCourseStatus = async (id: number, currentStatus: boolean) => {
    if (processingId === id) return;
    
    setProcessingId(id);
    try {
      await api.put(`/courses/${id}`, { is_active: !currentStatus });
      setCourses(courses.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    } catch (err) {
      console.error("Failed to toggle course status", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Create, edit, and monitor the performance of your educational content.
          </p>
        </div>
        <Link href="/instructor/courses/new">
          <Button variant="primary" size="lg" className="gap-2 shadow-primary/30 text-white">
            <Plus size={20} />
            Create New Course
          </Button>
        </Link>
      </header>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search your courses..." className="pl-10 bg-slate-50 border-none focus:ring-1" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-500 font-semibold">All</Button>
          <Button variant="ghost" size="sm" className="text-slate-400">Published</Button>
          <Button variant="ghost" size="sm" className="text-slate-400">Drafts</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          ))
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Plus className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[250px] text-center mt-1">
              Start your instructor journey by creating your first course.
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="p-4 sm:p-6 group hover:border-primary/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border",
                      course.status === 'published' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400"
                    )}>
                      {course.status === 'published' ? <CheckCircle2 size={24} /> : <Edit3 size={24} /> }
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                          course.status === 'published' 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        )}>
                          {course.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Last updated {new Date(course.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 px-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-900 dark:text-white font-bold">
                        <Users size={14} className="text-slate-400" />
                        <span>{course.students_count || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Students</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-900 dark:text-white font-bold">
                        <DollarSign size={14} className="text-slate-400" />
                        <span>{(course.revenue || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Revenue</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1 mr-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                       <Switch 
                        disabled={processingId === course.id}
                        checked={!!course.is_active} 
                        onChange={() => toggleCourseStatus(course.id, !!course.is_active)}
                        className={cn("scale-75", processingId === course.id && "opacity-50")}
                       />
                    </div>
                    <Link href={`/instructor/courses/${course.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={processingId === course.id}
                        className="rounded-xl h-10 w-10 p-0 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Eye size={18} />
                      </Button>
                    </Link>
                    <Link href={`/instructor/courses/${course.id}/edit`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={processingId === course.id}
                        className="rounded-xl h-10 w-10 p-0 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Edit3 size={18} />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={processingId === course.id}
                      className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => deleteCourse(course.id)}
                    >
                      {processingId === course.id ? (
                        <Loader2 size={18} className="animate-spin text-primary" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
