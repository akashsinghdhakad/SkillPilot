"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, Star, Clock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  duration: string;
  instructor: string;
  lessonsCount: number;
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const router = useRouter();

  const [ownedBundles, setOwnedBundles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [coursesRes, enrollmentsRes, bundlesRes] = await Promise.all([
          api.get("/courses"),
          api.get("/enrollments").catch(() => ({ data: [] })),
          api.get("/v1/bundles/owned").catch(() => ({ data: [] }))
        ]);

        // Filter active courses
        const activeCourses = coursesRes.data.filter((c: { status: string; is_active: boolean }) => c.status === 'published' || c.is_active);
        
        setCourses(activeCourses.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          thumbnail: c.thumbnail || "https://images.unsplash.com/photo-1541462608141-ad5e9dbd637c?q=80&w=800&auto=format&fit=crop",
          price: c.price,
          duration: `${Math.floor((c.total_duration || 0) / 60)}h ${ (c.total_duration || 0) % 60}m`,
          instructor: c.instructor?.name || "SkillPilot Expert",
          lessonsCount: c.lessons_count || 0
        })));

        setEnrollments(enrollmentsRes.data.map((e: { course_id: number }) => e.course_id));
        setOwnedBundles(bundlesRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch catalog data", err);
        toast.error("Failed to load courses");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const canUnlock = (courseId: number) => {
    return ownedBundles.some(bundle => 
      bundle.courses?.some((c: any) => c.id === courseId)
    );
  };

  const handleUnlock = async (courseId: number) => {
    try {
      setIsProcessing(courseId);
      await api.post("/enrollments/unlock", { course_id: courseId });
      setEnrollments(prev => [...prev, courseId]);
      toast.success("Course unlocked successfully!");
      router.push(`/courses/${courseId}/learn`);
    } catch (err) {
      toast.error("Failed to unlock course");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      setIsProcessing(courseId);
      await api.post("/enrollments", { course_id: courseId });
      setEnrollments(prev => [...prev, courseId]);
      toast.success("Successfully enrolled!");
      router.push(`/courses/${courseId}/learn`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Enrollment failed", error);
      toast.error(error.response?.data?.message || "Failed to enroll");
    } finally {
      setIsProcessing(null);
    }
  };

  const isEnrolled = (courseId: number) => enrollments.includes(courseId);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Course Catalog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Explore our curated selection of premium courses and start your learning journey today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Search courses..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={18} />
            Filters
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * course.id }}
            >
              <Card className="h-full flex flex-col overflow-hidden p-0 group border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-sm font-bold shadow-sm">
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </div>
                  {isEnrolled(course.id) && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500/90 text-white backdrop-blur-sm text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Enrolled
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {course.lessonsCount} Lessons
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                    {course.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <BookOpen size={14} />
                        <span>{course.instructor}</span>
                      </div>
                    </div>
                    
                    {isEnrolled(course.id) ? (
                      <Button 
                        onClick={() => router.push(`/courses/${course.id}/learn`)}
                        size="sm" 
                        className="rounded-full px-4"
                      >
                        Learn
                      </Button>
                    ) : canUnlock(course.id) ? (
                      <Button 
                        onClick={() => handleUnlock(course.id)}
                        disabled={isProcessing === course.id}
                        size="sm" 
                        className="rounded-full px-4 gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                      >
                        {isProcessing === course.id ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                        Unlock
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(course.id)}
                        disabled={isProcessing === course.id}
                        size="sm" 
                        variant="outline"
                        className="rounded-full px-4 gap-2"
                      >
                        {isProcessing === course.id ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
                        Enroll
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
const PlusCircle = ({ size, className }: { size?: number; className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
  </svg>
);
