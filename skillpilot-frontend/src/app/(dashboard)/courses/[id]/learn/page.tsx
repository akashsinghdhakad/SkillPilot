"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Clock, 
  BookOpen,
  ArrowLeft,
  Loader2,
  FileText,
  Award,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuizPlayer } from "@/components/student/QuizPlayer";
import { Trophy } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  type: string;
  content: string;
  video_url: string;
  duration: number;
  is_completed?: boolean;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  sections: Section[];
}
export default function CoursePlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [quiz, setQuiz] = useState<{ id: number; title: string } | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [isCertificateClaimed, setIsCertificateClaimed] = useState(false);
  const [certificateId, setCertificateId] = useState<number | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        
        // Fetch quiz
        try {
          const quizRes = await api.get(`/quizzes/course/${id}`);
          setQuiz(quizRes.data);
        } catch (e) {
          // No quiz found, which is fine for now
        }

        // Default to first lesson in first section
        if (res.data.sections?.[0]?.lessons?.[0]) {
          setCurrentLesson(res.data.sections[0].lessons[0]);
        }
        // Fetch existing certificate
        try {
          const certsRes = await api.get("/certificates");
          const existingCert = certsRes.data.find((c: any) => c.course_id === parseInt(id as string));
          if (existingCert) {
            setIsCertificateClaimed(true);
            setCertificateId(existingCert.id);
          }
        } catch (e) {}

      } catch (err) {
        console.error("Failed to fetch course", err);
        toast.error("Failed to load course content");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id, router]);

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    try {
      setIsMarking(true);
      await api.post(`/enrollments/lessons/${currentLesson.id}/complete`);
      toast.success("Lesson marked as complete!");
      
      // Update local state
      if (course) {
        const updatedCourse = { ...course };
        updatedCourse.sections = updatedCourse.sections.map(s => ({
          ...s,
          lessons: s.lessons.map(l => l.id === currentLesson.id ? { ...l, is_completed: true } : l)
        }));
        setCourse(updatedCourse);
        setCurrentLesson({ ...currentLesson, is_completed: true });
      }
    } catch (err) {
      console.error("Failed to mark lesson complete", err);
      toast.error("Failed to update progress");
    } finally {
      setIsMarking(false);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      setIsClaiming(true);
      const res = await api.post("/certificates/issue", { course_id: parseInt(id as string) });
      setIsCertificateClaimed(true);
      setCertificateId(res.data.id);
      toast.success("Certificate issued successfully!");
    } catch (err: any) {
      console.error("Failed to claim certificate", err);
      toast.error(err.response?.data?.message || "Failed to issue certificate");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!certificateId) return;
    try {
      const response = await api.get(`/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download certificate");
    }
  };

  const isCourseFullyCompleted = () => {
    if (!course) return false;
    const allLessonsCompleted = course.sections.every(s => 
      s.lessons.every(l => l.is_completed)
    );
    const quizPassed = quiz ? isPassed : true;
    return allLessonsCompleted && quizPassed;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-20 shadow-xl lg:shadow-none"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push("/dashboard")}
                className="gap-2 text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden" 
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold line-clamp-2">{course.title}</h2>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                <BookOpen size={14} />
                <span>{course.sections.length} Sections</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-6">
                {course.sections.map((section, idx) => (
                  <div key={section.id} className="space-y-3">
                    <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      Section {idx + 1}: {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                            currentLesson?.id === lesson.id 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            currentLesson?.id === lesson.id 
                              ? "bg-primary text-white shadow-lg shadow-primary/20" 
                              : "bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700"
                          )}>
                            {lesson.type === 'video' ? <Play size={14} fill={currentLesson?.id === lesson.id ? "currentColor" : "none" } /> : <FileText size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold line-clamp-1">{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 opacity-60">
                              <span className="text-[10px]">{lesson.duration || 0}m</span>
                              {lesson.is_completed && <CheckCircle2 size={10} className="text-emerald-500" />}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {quiz && (
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setIsQuizActive(true);
                        setCurrentLesson(null);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group",
                        isQuizActive 
                          ? "bg-slate-900 dark:bg-slate-800 text-white shadow-xl" 
                          : "hover:bg-primary/5 text-slate-900 dark:text-slate-100"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isQuizActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      )}>
                        <Trophy size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold uppercase tracking-tight">Final Assessment</p>
                        <p className="text-[10px] opacity-60 font-medium">Verify your skills</p>
                      </div>
                    </button>
                  </div>
                )}

                {isCourseFullyCompleted() && (
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <Award size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Course Completed!</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Claim your reward</p>
                        </div>
                      </div>
                      
                      {isCertificateClaimed ? (
                        <Button 
                          onClick={handleDownloadCertificate}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-11"
                        >
                          <FileText size={16} />
                          Download Certificate
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleClaimCertificate}
                          disabled={isClaiming}
                          className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl gap-2 h-11"
                        >
                          {isClaiming ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                          Claim Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Header Control */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2"
          >
            <Menu size={20} />
            <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-widest">Curriculum</span>
          </Button>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <ChevronLeft size={16} /> Previous
             </Button>
             <Button size="sm" className="flex items-center gap-2 shadow-lg shadow-primary/20">
                Next <ChevronRight size={16} />
             </Button>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 w-full bg-slate-900 relative overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full p-0 lg:p-10">
            {isQuizActive && quiz ? (
              <div className="bg-white dark:bg-slate-950 rounded-none lg:rounded-[2rem] min-h-[70vh] shadow-2xl overflow-hidden">
                 <QuizPlayer quizId={quiz.id} onComplete={(attempt) => {
                    if (attempt.status === 'passed') setIsPassed(true);
                 }} />
              </div>
            ) : currentLesson ? (
              <motion.div 
                key={currentLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Video Player Placeholder */}
                <Card className="aspect-video bg-black overflow-hidden relative group border-0 shadow-2xl rounded-none lg:rounded-3xl">
                   {currentLesson.video_url ? (
                     <iframe 
                      src={currentLesson.video_url} 
                      className="w-full h-full"
                      allow="autoplay; encrypted-media" 
                      allowFullScreen
                     />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                        <Play size={64} className="animate-pulse" />
                        <p className="font-bold text-xl">Video Content Coming Soon</p>
                     </div>
                   )}
                </Card>

                <div className="p-6 lg:p-0 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-extrabold text-white tracking-tight">{currentLesson.title}</h1>
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-[10px]">
                          <Clock size={14} /> {currentLesson.duration} Minutes
                        </span>
                        <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-[10px]">
                          <FileText size={14} /> {currentLesson.type}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleMarkComplete}
                      disabled={isMarking || currentLesson.is_completed}
                      variant="primary" 
                      className={cn(
                        "gap-2 border-0 text-white shadow-lg",
                        currentLesson.is_completed 
                          ? "bg-slate-700 cursor-default" 
                          : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                      )}
                    >
                      {isMarking ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                      {currentLesson.is_completed ? "Completed" : "Mark As Complete"}
                    </Button>
                  </div>

                  <div className="prose dark:prose-invert prose-slate max-w-none text-white/70 leading-relaxed text-lg">
                    {currentLesson.content || "No additional text content provided for this lesson."}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-white/20">
                <BookOpen size={100} />
                <p className="mt-4 text-xl font-bold underline decoration-primary decoration-4 underline-offset-8">Select a lesson to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
