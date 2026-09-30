"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Video, 
  FileText, 
  Type, 
  Upload, 
  Link as LinkIcon, 
  Clock,
  PlusCircle,
  Loader2,
  Play,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPreview } from "@/components/shared/MediaPreview";
import { Switch } from "@/components/ui/switch";

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content_type: z.enum(["video", "pdf", "text"]),
  content_url: z.string().url().optional().or(z.literal("")),
  duration: z.string().optional(),
  is_active: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface BackendLesson {
  id?: number;
  title?: string;
  content_type?: "video" | "pdf" | "text";
  content_path?: string;
  content_url?: string;
  duration?: string | number;
  is_active?: boolean | number;
}

interface LessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData, lessonId?: number) => Promise<void>;
  sectionId: number;
  initialData?: BackendLesson | null;
}

export function LessonFormModal({ isOpen, onClose, onSubmit, sectionId, initialData }: LessonFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      content_type: "video",
      is_active: true,
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData && typeof initialData === 'object') {
        const formData = {
          title: initialData.title || "",
          content_type: initialData.content_type || "video",
          content_url: initialData.content_path || initialData.content_url || "",
          duration: initialData.duration?.toString() || "",
          is_active: initialData.is_active === 1 || initialData.is_active === true,
        };
        reset(formData);
      } else {
        reset({
          title: "",
          content_type: "video",
          content_url: "",
          duration: "",
          is_active: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const contentType = watch("content_type");
  const contentUrl = watch("content_url");

  const handleFormSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("section_id", sectionId.toString());
      formData.append("title", data.title);
      formData.append("content_type", data.content_type);
      formData.append("is_active", data.is_active ? "1" : "0");
      
      if (data.content_url) {
        formData.append("content_url", data.content_url);
      }
      
      if (selectedFile) {
        formData.append("content_file", selectedFile);
      }

      if (data.duration) {
        formData.append("duration", data.duration);
      }

      await onSubmit(formData, initialData?.id);
      reset();
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error("Failed to add/update lesson:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  {initialData ? <Edit3 size={20} /> : <PlusCircle size={20} />}
                </div>
                <h3 className="text-xl font-bold">{initialData ? "Edit Lesson" : "Add New Lesson"}</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-hidden flex flex-row">
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar border-r border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between pb-2">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Visibility & Status</label>
                   <Switch {...register("is_active")} label="Active" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Lesson Title</label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Introduction to React"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  {errors.title && <p className="text-xs text-red-500 ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Content Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'video', label: 'Video', icon: Video },
                      { id: 'pdf', label: 'PDF', icon: FileText },
                      { id: 'text', label: 'Text', icon: Type },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => reset({ ...watch(), content_type: item.id as 'video' | 'pdf' | 'text' })}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                          contentType === item.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                        )}
                      >
                        <item.icon size={20} />
                        <span className="text-xs font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {contentType === 'video' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Video Integration</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          {...register("content_url")}
                          placeholder="Paste Video URL (YouTube, Vimeo...)"
                          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {contentType !== 'text' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">
                      {contentType === 'video' ? 'Video File' : 'PDF Document'}
                    </label>
                    <div 
                      className={cn(
                        "relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all group",
                        selectedFile 
                          ? "border-primary/50 bg-primary/5" 
                          : "border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <input
                        type="file"
                        id="lesson-file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept={contentType === 'video' ? "video/*" : ".pdf"}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        {selectedFile ? <FileText className="text-primary" /> : <Upload className="text-slate-400" />}
                      </div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400 text-center px-2">
                        {selectedFile ? selectedFile.name : `Click to upload ${contentType === 'video' ? 'video' : 'PDF'}`}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Max file size: 50MB</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Duration (seconds)</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      {...register("duration")}
                      type="number"
                      placeholder="e.g. 600"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      initialData ? <Edit3 size={20} /> : <PlusCircle size={20} />
                    )}
                    {isSubmitting 
                      ? (initialData ? "Updating Lesson..." : "Adding Lesson...") 
                      : (initialData ? "Update Lesson" : "Create Lesson")
                    }
                  </button>
                </div>
              </div>

              {/* Preview Sidebar */}
              <div className="hidden md:flex w-96 bg-slate-50/50 dark:bg-slate-800/30 p-6 flex-col space-y-4 overflow-y-auto">
                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                   <Play size={12} fill="currentColor" />
                   <span>Interactive Preview</span>
                </div>
                
                <MediaPreview 
                  type={contentType} 
                  url={contentUrl} 
                  file={selectedFile} 
                />

                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
                   <h5 className="text-xs font-bold text-slate-500 uppercase tracking-tight">Lesson Configuration</h5>
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">STATUS</span>
                      <span className={watch("is_active") ? "text-emerald-500" : "text-amber-500"}>
                        {watch("is_active") ? "PUBLIC" : "HIDDEN"}
                      </span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">TYPE</span>
                      <span className="text-primary uppercase">{contentType}</span>
                   </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed italic text-center px-4">
                  Previews are generated instantly. Make sure to check your YouTube/Vimeo URLs for embed restrictions.
                </p>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
