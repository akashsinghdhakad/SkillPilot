"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Edit3, 
  Users, 
  DollarSign, 
  Clock, 
  BookOpen, 
  ChevronRight,
  PlayCircle,
  FileText,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Lesson {
  id: number;
  title: string;
  content_type: 'video' | 'pdf' | 'text';
  duration?: number;
  is_active: boolean;
}

interface Section {
  id: number;
  title: string;
  is_active: boolean;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  is_active: boolean;
  category?: string;
  level?: string;
  sections: Section[];
  students_count?: number;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
        router.push("/instructor/courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Loading course details...</p>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <Link href="/instructor/courses" className="inline-flex items-center text-sm font-bold text-primary hover:gap-1 transition-all">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">
                {course.category?.replace('-', ' ') || 'General'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                {course.level || 'Beginner'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {course.title}
            </h1>
          </div>
        </div>
        <Link href={`/instructor/courses/${id}/edit`}>
          <Button variant="primary" size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20 text-white font-bold">
            <Edit3 size={18} className="mr-2" /> Edit Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: course.students_count || 0, icon: Users, color: "text-blue-500" },
          { label: "Price", value: course.price > 0 ? `$${course.price}` : "Free", icon: DollarSign, color: "text-emerald-500" },
          { label: "Lessons", value: course.sections.reduce((acc, s) => acc + s.lessons.length, 0), icon: BookOpen, color: "text-amber-500" },
          { label: "Status", value: course.status, icon: CheckCircle2, color: course.status === 'published' ? "text-emerald-500" : "text-slate-400" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col items-center justify-center space-y-1 border-slate-100 dark:border-slate-800">
            <stat.icon className={cn("h-5 w-5 mb-1", stat.color)} />
            <span className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="h-8 w-1.5 bg-primary rounded-full" />
              Course Description
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {course.description || "No description provided for this course."}
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="h-8 w-1.5 bg-primary rounded-full" />
                Curriculum Overview
              </h2>
              <span className="text-sm font-bold text-slate-400">
                {course.sections.length} Sections
              </span>
            </div>

            <div className="space-y-4">
              {course.sections.map((section, sidx) => (
                <Card key={section.id} className="overflow-hidden border-slate-100 dark:border-slate-800">
                  <div className={cn(
                    "p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800",
                    !section.is_active && "bg-slate-100/50"
                  )}>
                    <div className="flex items-center gap-3">
                      <h3 className={cn(
                        "font-bold flex items-center gap-3",
                        !section.is_active ? "text-slate-400" : "text-slate-700 dark:text-slate-300"
                      )}>
                        <span className="h-6 w-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black shadow-sm border">
                          {sidx + 1}
                        </span>
                        {section.title}
                      </h3>
                      {!section.is_active && (
                        <span className="text-[8px] font-black uppercase tracking-tighter bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {section.lessons.length} Lessons
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className={cn(
                        "p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group",
                        !lesson.is_active && "opacity-50"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "transition-colors",
                            lesson.is_active ? "text-slate-400 group-hover:text-primary" : "text-slate-300"
                          )}>
                            {lesson.content_type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-semibold",
                              lesson.is_active ? "text-slate-600 dark:text-slate-400" : "text-slate-400 line-through"
                            )}>{lesson.title}</span>
                            {!lesson.is_active && (
                              <span className="text-[8px] font-black uppercase tracking-tighter bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">Hidden from students</span>
                            )}
                          </div>
                        </div>
                        {lesson.duration && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                            <Clock size={12} />
                            {Math.floor(lesson.duration / 60)}m
                          </div>
                        )}
                      </div>
                    ))}
                    {section.lessons.length === 0 && (
                      <div className="p-8 text-center text-xs font-bold text-slate-400 italic">
                        No lessons added to this section yet.
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {course.sections.length === 0 && (
                <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-400">Curriculum is empty. Access the Edit mode to add sections.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Instructor Context</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500">Earnings (est)</span>
                <span className="text-sm font-black text-emerald-500">+$2,410</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500">Avg. Rating</span>
                <span className="text-sm font-black text-amber-500">4.8 ★</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
                You are viewing this course as an instructor. Students will experience a different UI focused on learning progress and video streaming.
              </p>
            </div>
          </Card>

          <div className="p-6 rounded-3xl bg-primary text-white space-y-4 shadow-xl shadow-primary/20">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-lg">Market Student View</h4>
              <p className="text-xs font-medium text-white/80 leading-relaxed">
                Check how students see your course curriculum before publishing.
              </p>
            </div>
            <Button className="w-full bg-white text-primary hover:bg-slate-50 font-bold rounded-xl h-11">
              Preview as Student
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
