"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

const courseSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description should be detailed (min 50 chars)"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price cannot be negative")),
  category: z.string().min(1, "Please select a category"),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "web-development",
      level: "beginner",
    },
  });

  const watchAll = watch();

  const onSubmit = async (data: CourseFormValues) => {
    setIsLoading(true);
    try {
      await api.post("/courses", {
        ...data,
        status: "draft",
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/instructor/courses");
      }, 2000);
    } catch (err) {
      console.error("Failed to create course", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Course Studio</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-6">Save as Draft</Button>
          <Button 
            className="rounded-xl px-6" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "creating..." : "Create Course"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
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
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <Settings size={14} />
                <span>Level & Settings</span>
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
            </div>
          </Card>
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
                  <Video size={10} /> 32 Lessons
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
                  {watchAll.title || "Your brilliant course title will appear here..."}
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

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
              <h4 className="text-xs font-bold text-primary flex items-center gap-2">
                <CheckCircle2 size={14} /> Studio Tip
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                High-quality thumbnails and descriptive titles can increase student enrollment by up to 40%. Keep your title concise and focused on the outcome.
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
              <div className="h-20 w-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/40">
                <CheckCircle2 size={42} />
              </div>
              <h2 className="text-3xl font-black">Course Created!</h2>
              <p className="text-slate-500 font-medium">Setting up your learning studio environment...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
