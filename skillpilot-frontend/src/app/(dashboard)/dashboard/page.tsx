"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, CheckCircle2, TrendingUp, Clock, GraduationCap, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, trend, color }: StatCardProps) => (
  <Card className="relative overflow-hidden group">
    <div className={cn("absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity", color)}>
      <Icon size={80} />
    </div>
    <div className="flex items-start justify-between">
      <div className="space-y-4">
        <div className={cn("p-3 rounded-2xl w-fit text-white", color)}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  </Card>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<{ id: number; status: string; course: { id: number; title: string; thumbnail?: string } }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/enrollments");
        setEnrollments(res.data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
              Dashboard
            </h1>
            <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              {user.roles?.[0]?.name || 'Student'}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Welcome back, <span className="text-slate-900 dark:text-white font-semibold">{user.name}</span>. Here is what&apos;s happening with your learning journey today.
          </p>
        </div>
        
        {enrollments.length === 0 && !isLoading && (
          <Button onClick={() => router.push("/courses")} className="rounded-full px-6">
            Explore Catalog
          </Button>
        )}
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              label="Active Courses" 
              value={enrollments.filter(e => e.status === 'active').length} 
              icon={BookOpen} 
              color="bg-indigo-500 shadow-indigo-500/20" 
            />
            <StatCard 
              label="Completed" 
              value={enrollments.filter(e => e.status === 'completed').length} 
              icon={CheckCircle2} 
              color="bg-emerald-500 shadow-emerald-500/20" 
            />
            <StatCard 
              label="Total Certificates" 
              value="0" 
              icon={Award} 
              color="bg-amber-500 shadow-amber-500/20" 
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="text-primary" />
                Your Courses
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <Link key={enrollment.id} href={`/courses/${enrollment.course.id}/learn`}>
                      <Card className="hover:shadow-lg transition-all duration-300 group p-0 overflow-hidden border-slate-200 dark:border-slate-800">
                        <div className="h-32 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                          <img 
                            src={enrollment.course.thumbnail || "https://images.unsplash.com/photo-1541462608141-ad5e9dbd637c?q=80&w=800&auto=format&fit=crop"} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            alt={enrollment.course.title}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{enrollment.course.title}</h4>
                          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              Continue Learning
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full border",
                              enrollment.status === 'active' ? "border-indigo-500/20 text-indigo-500" : "border-emerald-500/20 text-emerald-500"
                            )}>
                              {enrollment.status}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="col-span-2 p-12 border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                      <BookOpen size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Start Your Journey</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs text-sm mb-6">
                      You are not enrolled in any courses yet. Explore our catalog to find your next skill.
                    </p>
                    <Button onClick={() => router.push("/courses")}>
                      Browse Catalog
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="text-emerald-500" />
                Marketplace News
              </h2>
              <Card className="p-6 bg-gradient-to-br from-indigo-500 to-primary text-white border-0">
                <h4 className="font-bold mb-2">Build Your Future</h4>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Did you know students with certificates are 3x more likely to be recruited? Keep learning to unlock your potential.
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    +12k
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
