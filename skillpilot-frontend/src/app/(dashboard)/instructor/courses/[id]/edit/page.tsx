"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Settings, 
  CheckCircle2, 
  Video, 
  Layout,
  DollarSign,
  Briefcase,
  Loader2,
  BookOpen,
  FileText,
  Clock,
  PlusCircle,
  Check,
  X,
  Edit2,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LessonFormModal } from "@/components/instructor/courses/LessonFormModal";
import { Plus, Trash2, GripVertical, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { QuizForm } from "@/components/instructor/courses/QuizForm";

const courseSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description should be detailed (min 50 chars)"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  status: z.enum(['draft', 'published']),
  is_active: z.boolean(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface Section {
  id: number;
  title: string;
  is_active: boolean;
  lessons: {
    id: number;
    title: string;
    content_type: "video" | "pdf" | "text";
    is_active: boolean;
    duration?: string | number;
  }[];
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [updatedSectionTitle, setUpdatedSectionTitle] = useState("");
  const [editingLesson, setEditingLesson] = useState<{ id: number; title: string; content_type: "video" | "pdf" | "text"; is_active: boolean; duration?: string | number } | null | undefined>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema) as Resolver<CourseFormValues>,
  });

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      const course = response.data;
      reset({
        title: course.title,
        description: course.description || "",
        price: course.price || 0,
        category: course.category || "web-development",
        level: course.level || "beginner",
        status: course.status || "draft",
        is_active: !!course.is_active,
      });
      setSections(course.sections || []);
    } catch (err) {
      console.error("Failed to fetch course", err);
      router.push("/instructor/courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id, reset, router]);

  const watchAll = watch();

  const addSection = () => {
    setIsAddingSection(true);
  };

  const createSection = async () => {
    if (!newSectionTitle.trim()) {
      setIsAddingSection(false);
      return;
    }

    try {
      await api.post(`/courses/${id}/sections`, { title: newSectionTitle });
      setNewSectionTitle("");
      setIsAddingSection(false);
      fetchCourse();
    } catch (error) {
      console.error("Failed to add section:", error);
    }
  };

  const deleteSection = async (sectionId: number) => {
    const pId = `section-${sectionId}`;
    if (processingId === pId) return;
    if (!confirm("Are you sure you want to delete this section and all its lessons?")) return;
    
    setProcessingId(pId);
    try {
      await api.delete(`/sections/${sectionId}`);
      fetchCourse();
    } catch (error) {
      console.error("Failed to delete section:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const updateSection = async (sectionId: number) => {
    if (!updatedSectionTitle.trim()) {
      setEditingSectionId(null);
      return;
    }
    
    const pId = `section-${sectionId}`;
    setProcessingId(pId);
    try {
      await api.put(`/sections/${sectionId}`, { title: updatedSectionTitle });
      setEditingSectionId(null);
      setUpdatedSectionTitle("");
      fetchCourse();
    } catch (error) {
      console.error("Failed to update section:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleSectionStatus = async (sectionId: number) => {
    const pId = `section-${sectionId}`;
    if (processingId === pId) return;

    setProcessingId(pId);
    try {
      await api.patch(`/sections/${sectionId}/toggle-status`);
      fetchCourse();
    } catch (error) {
      console.error("Failed to toggle section status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const deleteLesson = async (lessonId: number) => {
    const pId = `lesson-${lessonId}`;
    if (processingId === pId) return;
    if (!confirm("Delete this lesson?")) return;

    setProcessingId(pId);
    try {
      await api.delete(`/lessons/${lessonId}`);
      fetchCourse();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleLessonStatus = async (lessonId: number) => {
    const pId = `lesson-${lessonId}`;
    if (processingId === pId) return;

    setProcessingId(pId);
    try {
      await api.patch(`/lessons/${lessonId}/toggle-status`);
      fetchCourse();
    } catch (error) {
      console.error("Failed to toggle lesson status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleLessonSubmit = async (formData: FormData, lessonId?: number) => {
    try {
      if (lessonId) {
        await api.post(`/lessons/${lessonId}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        formData.append("section_id", activeSectionId!.toString());
        await api.post("/lessons", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchCourse();
      setEditingLesson(null);
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };

  const onSubmit: SubmitHandler<CourseFormValues> = async (data) => {
    setIsSaving(true);
    try {
      await api.put(`/courses/${id}`, data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/instructor/courses");
      }, 2000);
    } catch (err) {
      console.error("Failed to update course", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Edit Course Studio</h1>
        </div>
        <div className="flex gap-3">
          <Button 
            className="rounded-xl px-6" 
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 space-y-8 border-slate-100 dark:border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <Layout size={14} />
                <span>Basic Information</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Course Title</label>
                <Input 
                  {...register("title")}
                   placeholder="e.g. Advanced Next.js Implementation" 
                  className="text-lg font-medium p-6 bg-slate-50/50 border-slate-100 focus:bg-white transition-all shadow-none"
                />
                {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea 
                  {...register("description")}
                  placeholder="What will students learn in this course?" 
                  className="min-h-[200px] bg-slate-50/50 border-slate-100 focus:bg-white transition-all shadow-none italic"
                />
                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-400" /> Price ($)
                </label>
                <Input 
                  {...register("price")}
                  type="number"
                  placeholder="0 (Free)" 
                  className="bg-slate-50/50 border-slate-100 shadow-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-400" /> Category
                </label>
                <select 
                  {...register("category")}
                  className="w-full h-10 px-3 rounded-md bg-slate-50/50 border-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-none"
                >
                  <option value="web-development">Web Development</option>
                  <option value="ai-machine-learning">AI & Machine Learning</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Settings size={14} />
                    <span>Global Visibility</span>
                  </div>
                  <Switch 
                    label="Course Active" 
                    checked={watchAll.is_active} 
                    onChange={(e) => setValue("is_active", e.target.checked)}
                  />
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 size={14} />
                    <span>Publishing Status</span>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setValue("status", "draft")}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        watchAll.status === "draft" ? "bg-white dark:bg-slate-700 shadow-sm text-amber-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("status", "published")}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        watchAll.status === "published" ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Published
                    </button>
                  </div>
               </div>
               
               <div className="flex gap-4">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <label key={lvl} className="flex-1">
                    <input 
                      type="radio" 
                      value={lvl}
                      {...register("level")}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center rounded-xl border-2 border-slate-100 dark:border-slate-800 cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                      <span className="text-xs font-bold capitalize">{lvl}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {!watchAll.is_active && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-[10px] font-bold">
                  <AlertTriangle size={14} />
                  <span>This course will be hidden from the marketplace even if published.</span>
                </div>
              )}
            </div>
          </Card>

          {/* Curriculum Section */}
          <Card className="p-8 space-y-8 border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <BookOpen size={14} />
                <span>Course Curriculum</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-dashed border-2 font-bold"
                onClick={addSection}
                disabled={isAddingSection}
              >
                <Plus size={16} className="mr-2" /> Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {isAddingSection && (
                <div className="p-5 bg-white border-2 border-primary/20 rounded-3xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input 
                    autoFocus
                    placeholder="Enter section title..."
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createSection()}
                    className="flex-1 bg-slate-50 shadow-none border-none focus-visible:ring-0 font-bold"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={createSection} className="rounded-xl">Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingSection(false)} className="rounded-xl">Cancel</Button>
                  </div>
                </div>
              )}
              
              {sections.length === 0 && !isAddingSection ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium">No sections added yet. Start building your curriculum!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section: Section, sIdx: number) => (
                    <Card key={section.id} className="overflow-hidden border-slate-100 dark:border-slate-800">
                      <div className={cn(
                        "p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50",
                        !section.is_active && "bg-slate-100/30"
                      )}>
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black shadow-sm border border-slate-100 dark:border-slate-700">
                            {sIdx + 1}
                          </div>
                          
                          {editingSectionId === section.id ? (
                            <div className="flex items-center gap-2 flex-1 max-w-md">
                              <Input 
                                autoFocus
                                value={updatedSectionTitle}
                                onChange={(e) => setUpdatedSectionTitle(e.target.value)}
                                className="h-8 text-sm font-bold bg-white"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') updateSection(section.id);
                                  if (e.key === 'Escape') setEditingSectionId(null);
                                }}
                              />
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-500" onClick={() => updateSection(section.id)}>
                                <Check size={14} />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400" onClick={() => setEditingSectionId(null)}>
                                <X size={14} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/title">
                              <h3 className={cn(
                                "font-bold text-sm",
                                !section.is_active ? "text-slate-400" : "text-slate-700 dark:text-slate-200"
                              )}>{section.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover/title:opacity-100 transition-opacity text-slate-400 hover:text-primary"
                                onClick={() => {
                                  setEditingSectionId(section.id);
                                  setUpdatedSectionTitle(section.title);
                                }}
                              >
                                <Edit2 size={12} />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary font-bold hover:bg-primary/10 rounded-xl"
                            onClick={() => {
                              setActiveSectionId(section.id);
                              setEditingLesson(null);
                              setIsLessonModalOpen(true);
                            }}
                          >
                            <PlusCircle size={14} className="mr-2" /> Add Lesson
                          </Button>
                          <Switch 
                            className="scale-75"
                            disabled={processingId === `section-${section.id}`}
                            checked={!!section.is_active} 
                            onChange={() => toggleSectionStatus(section.id)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={processingId === `section-${section.id}`}
                            className="text-slate-400 hover:text-red-500 rounded-xl"
                            onClick={() => deleteSection(section.id)}
                          >
                            {processingId === `section-${section.id}` ? (
                              <Loader2 size={14} className="animate-spin text-primary" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        {section.lessons?.length === 0 ? (
                          <p className="text-[10px] text-slate-400 font-medium p-4 italic text-center">No lessons in this section</p>
                        ) : (
                          section.lessons?.map((lesson: { id: number; title: string; content_type: "video" | "pdf" | "text"; is_active: boolean; duration?: string | number }) => (
                            <div 
                              key={lesson.id} 
                              className={cn(
                                "flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group",
                                !lesson.is_active && "opacity-50"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                lesson.is_active 
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary" 
                                  : "bg-slate-50 text-slate-300"
                              )}>
                                {lesson.content_type === 'video' ? <Video size={14} /> : (lesson.content_type === 'pdf' ? <FileText size={14} /> : <Type size={14} />)}
                              </div>
                              <div className="flex-1 text-left">
                                <p className={cn(
                                  "text-xs font-bold transition-colors",
                                  lesson.is_active ? "text-slate-700 dark:text-slate-200" : "text-slate-400 line-through"
                                )}>{lesson.title}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{lesson.content_type}</span>
                                  {lesson.duration && (
                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                      <Clock size={8} /> {Math.floor(Number(lesson.duration) / 60)}m
                                    </span>
                                  )}
                                </div>
                              </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-slate-400 hover:text-primary rounded-lg transition-all"
                                  onClick={() => {
                                    setActiveSectionId(section.id);
                                    setEditingLesson(lesson);
                                    setIsLessonModalOpen(true);
                                  }}
                                >
                                  <Eye size={12} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-slate-400 hover:text-primary rounded-lg transition-all"
                                  onClick={() => {
                                    setActiveSectionId(section.id);
                                    setEditingLesson(lesson);
                                    setIsLessonModalOpen(true);
                                  }}
                                >
                                  <Edit2 size={12} />
                                </Button>
                                <Switch 
                                    className="scale-[0.6]"
                                    disabled={processingId === `lesson-${lesson.id}`}
                                    checked={!!lesson.is_active} 
                                    onChange={() => toggleLessonStatus(lesson.id)}
                                  />
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  disabled={processingId === `lesson-${lesson.id}`}
                                  className="text-slate-300 hover:text-red-500 rounded-lg transition-all"
                                  onClick={() => deleteLesson(lesson.id)}
                                >
                                  {processingId === `lesson-${lesson.id}` ? (
                                    <Loader2 size={12} className="animate-spin text-primary" />
                                  ) : (
                                    <Trash2 size={12} />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Assessment Section */}
          <QuizForm courseId={id} />
        </div>

        {/* Live Preview Column */}
        <div className="space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] ml-1">
              <Eye size={12} />
              <span>Live Marketplace Preview</span>
            </div>
            
            <Card className="overflow-hidden border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none group">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-50" />
                <div className="z-10 bg-white/90 dark:bg-slate-900/90 p-3 rounded-full shadow-lg text-slate-400 group-hover:scale-110 transition-transform">
                  <ImageIcon size={32} />
                </div>
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-bold tracking-tight">
                  <Video size={10} /> {sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)} Lessons
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    {watchAll.category?.replace('-', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {watchAll.level}
                  </span>
                </div>
                <h3 className="font-bold text-lg leading-tight h-[3.5rem] line-clamp-2">
                  {watchAll.title || "Your brilliant course title..."}
                </h3>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <div className="h-6 w-6 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-500 italic">By You</span>
                  <div className="ml-auto text-xl font-black text-slate-900 dark:text-white">
                    {Number(watchAll.price) > 0 ? `$${watchAll.price}` : <span className="text-emerald-500">Free</span>}
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                <Settings size={14} /> Editing Mode
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                You are currently editing an existing course. Changes will be reflected immediately in the student marketplace once you save.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
          >
            <div className="text-center space-y-4">
              <div className="h-20 w-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                <CheckCircle2 size={42} />
              </div>
              <h2 className="text-3xl font-black">Changes Saved!</h2>
              <p className="text-slate-500 font-medium">Updating course metadata across systems...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LessonFormModal 
        key={editingLesson?.id || (isLessonModalOpen ? 'new' : 'none')}
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={handleLessonSubmit}
        sectionId={activeSectionId || 0}
        initialData={editingLesson}
      />
    </div>
  );
}
