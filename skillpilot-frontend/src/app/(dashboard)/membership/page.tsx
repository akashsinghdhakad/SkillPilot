"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Star, 
  Zap, 
  Crown, 
  CreditCard,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  level: number;
  billing_interval: string;
}

export default function MembershipPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, statusRes] = await Promise.all([
          api.get("/v1/memberships/plans"),
          api.get("/v1/memberships/status")
        ]);
        setPlans(plansRes.data);
        setCurrentSub(statusRes.data);
      } catch (err) {
        console.error("Failed to fetch membership data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuy = async (plan: Plan) => {
    try {
      const res = await api.post("/orders", {
        items: [
          { id: plan.id, type: 'membership_plan' }
        ]
      });
      router.push(`/checkout?orderId=${res.data.id}`);
    } catch (err) {
      toast.error("Failed to initiate checkout");
    }
  };

  const getTierIcon = (level: number) => {
    if (level === 1) return <Zap size={24} className="text-amber-500" />;
    if (level === 2) return <Star size={24} className="text-indigo-500" />;
    return <Crown size={24} className="text-primary" />;
  };

  const getTierColor = (level: number) => {
    if (level === 1) return "from-amber-400 to-amber-600";
    if (level === 2) return "from-indigo-400 to-indigo-600";
    return "from-primary to-violet-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white italic">
          Unlock Your <span className="text-primary">Potential</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Choose a membership tier that fits your learning goals. Get unlimited access to premium courses and certified pathways.
        </p>
      </header>

      {currentSub && (
        <Card className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Active Subscription: {currentSub?.plan?.name}</h3>
              <p className="text-sm text-slate-500">Your membership is active and grants access to Level {currentSub?.plan?.level} content.</p>
            </div>
          </div>
          <Button variant="outline" className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 font-bold">
            Manage Billing
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className="flex h-full"
          >
            <Card className={cn(
              "p-8 flex flex-col h-full relative overflow-hidden group border-2 transition-all duration-300",
              currentSub?.plan_id === plan.id ? "border-primary shadow-xl ring-2 ring-primary/20" : "border-slate-100 dark:border-slate-800"
            )}>
              {currentSub?.plan_id === plan.id && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                  Current Plan
                </div>
              )}
              
              <div className="mb-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-inner">
                  {getTierIcon(plan.level)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{plan.description || "Unlimited access to specific course tiers."}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-slate-500 font-medium">/{plan.billing_interval}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Access to Level {plan.level} Courses
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Direct Instructor Support
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Verified Certificates Included
                </li>
              </ul>

              <Button className={cn(
                "w-full rounded-2xl py-6 font-bold shadow-lg transition-all",
                currentSub?.plan_id === plan.id 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border-0 shadow-none dark:bg-slate-800" 
                  : cn("bg-gradient-to-r text-white border-0", getTierColor(plan.level))
              )}
              onClick={() => handleBuy(plan)}
              disabled={currentSub?.plan_id === plan.id}
              >
                {currentSub?.plan_id === plan.id ? "Already Active" : (currentSub ? "Upgrade Plan" : "Get Started")}
                {currentSub?.plan_id !== plan.id && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <footer className="pt-12 text-center border-t border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center gap-6 px-8 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <CreditCard size={18} className="text-primary" />
            Secure Checkout with Stripe
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            Cancel Anytime
          </div>
        </div>
      </footer>
    </div>
  );
}
