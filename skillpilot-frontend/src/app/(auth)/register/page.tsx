"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Lock, Mail, User, Building, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { AuthResponse, Tenant } from "@/types/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  tenant_id: z.string().min(1, "Please select a tenant"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [step, setStep] = useState(1);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const selectedTenantId = watch("tenant_id");

  useEffect(() => {
    // In a real app, this might be a public endpoint to list available tenants
    // For now, we'll try to fetch them or use a fallback
    const fetchTenants = async () => {
      try {
        // Mocking public tenant fetch or using a specific endpoint if exists
        const response = await api.get<Tenant[]>("/tenants").catch(() => ({ data: [] }));
        setTenants(response.data);
      } catch (err) {
        console.error("Failed to fetch tenants", err);
      }
    };
    fetchTenants();
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Submitting Register Form:", data);
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/register", data);
      console.log("Register Success:", response.data);
      setAuth(response.data.user, response.data.token);
      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Register Error:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20 text-white">
              <GraduationCap size={32} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Skill<span className="text-primary">Pilot</span>
            </span>
          </Link>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-800 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="text-slate-500 dark:text-slate-400">
                {step === 1 ? "Start with your basic details" : "Choose your learning workspace"}
              </p>
            </div>
            <div className="flex gap-1">
              <div className={cn("h-1.5 w-6 rounded-full transition-all", step === 1 ? "bg-primary" : "bg-slate-200 dark:bg-slate-800")} />
              <div className={cn("h-1.5 w-6 rounded-full transition-all", step === 2 ? "bg-primary" : "bg-slate-200 dark:bg-slate-800")} />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                    <Input
                      {...register("name")}
                      placeholder="Full Name"
                      className="pl-11"
                      error={errors.name?.message}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                    <Input
                      {...register("email")}
                      placeholder="name@example.com"
                      className="pl-11"
                      error={errors.email?.message}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                      <Input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className="pl-11"
                        error={errors.password?.message}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        {...register("password_confirmation")}
                        type="password"
                        placeholder="Confirm"
                        error={errors.password_confirmation?.message}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full mt-4"
                    size="lg"
                    onClick={async () => {
                      const isValid = await trigger(["name", "email", "password", "password_confirmation"]);
                      if (isValid) setStep(2);
                    }}
                  >
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                      Select Workspace
                    </label>
                    <div className="grid grid-cols-1 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                      {tenants.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setValue("tenant_id", t.id.toString())}
                          className={cn(
                            "group cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between",
                            selectedTenantId === t.id.toString()
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-xl transition-colors",
                              selectedTenantId === t.id.toString() ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                            )}>
                              <Building size={18} />
                            </div>
                            <div>
                              <p className="font-semibold">{t.name}</p>
                              <p className="text-xs text-slate-500">{t.slug}.skillpilot.com</p>
                            </div>
                          </div>
                          {selectedTenantId === t.id.toString() && (
                            <Check className="text-primary" size={20} />
                          )}
                        </div>
                      ))}
                      {tenants.length === 0 && (
                        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                          <p className="text-slate-500">No public workspaces found.</p>
                        </div>
                      )}
                    </div>
                    {errors.tenant_id && (
                      <p className="text-xs text-red-500 mt-1">{errors.tenant_id.message}</p>
                    )}
                  </div>

                  {Object.keys(errors).length > 0 && !errors.tenant_id && (
                    <p className="text-xs text-red-500 text-center italic">
                      Please check Step 1 for errors.
                    </p>
                  )}

                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-[2]"
                      isLoading={isLoading}
                    >
                      Complete Sign Up <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
