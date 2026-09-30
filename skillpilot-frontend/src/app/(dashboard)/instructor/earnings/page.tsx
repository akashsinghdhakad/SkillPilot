"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  CreditCard,
  BookOpen
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EarningStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalStudents: number;
  activeSubscriptions: number;
}

interface Transaction {
  id: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export default function InstructorEarningsPage() {
  const [stats, setStats] = useState<EarningStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for earnings
    setTimeout(() => {
      setStats({
        totalRevenue: 12548.50,
        monthlyRevenue: 1450.20,
        totalStudents: 312,
        activeSubscriptions: 45
      });
      setTransactions([
        { id: "TX-1001", courseTitle: "Next.js 15 Masterclass", amount: 49.99, date: "2026-03-16", status: 'completed' },
        { id: "TX-1002", courseTitle: "Laravel 12 API Design", amount: 59.99, date: "2026-03-15", status: 'completed' },
        { id: "TX-1003", courseTitle: "Next.js 15 Masterclass", amount: 49.99, date: "2026-03-14", status: 'completed' },
        { id: "TX-1004", courseTitle: "UI/UX Foundations", amount: 39.99, date: "2026-03-14", status: 'pending' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Earnings & Stats
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Monitor your financial performance and student enrollment growth.
          </p>
        </div>
        <Button variant="outline" size="lg" className="gap-2">
          <Download size={20} />
          Export Report
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              12%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ${stats?.totalRevenue.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Calendar size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/5 px-2 py-1 rounded-full">
              <ArrowDownRight size={14} />
              3%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Monthly Revenue</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ${stats?.monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              8%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Students</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats?.totalStudents}
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <CreditCard size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              15%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Subs</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats?.activeSubscriptions}
            </p>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Recent Sales</h2>
            <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
          </div>
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{tx.courseTitle}</p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">+${tx.amount}</p>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    tx.status === 'completed' ? "text-emerald-500" : "text-amber-500"
                  )}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-primary text-white overflow-hidden relative">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <TrendingUp size={240} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold italic">Top Performer</h2>
              <p className="text-primary-foreground/80 text-sm">Your Next.js 15 course is trending!</p>
            </div>
            <div className="space-y-6 mt-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60 font-bold uppercase tracking-wider">New Enrolled</p>
                  <p className="text-2xl font-bold">42 <small className="text-xs font-normal">this week</small></p>
                </div>
              </div>
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-slate-50">
                View Performance
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
