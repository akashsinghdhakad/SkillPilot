"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  DollarSign,
  ArrowUpRight,
  Loader2,
  Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface DashboardStats {
  revenue: number;
  total_enrollments: number;
  active_students: number;
  completion_rate: number;
}

interface RevenueData {
  date: string;
  total: number;
}

interface CoursePerformance {
  id: number;
  title: string;
  enrollments: number;
  avg_progress: number;
}

const MetricCard = ({ label, value, icon: Icon, color, prefix = "" }: any) => (
  <Card className="p-6 relative overflow-hidden group">
    <div className={cn("absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity", color)}>
      <Icon size={64} />
    </div>
    <div className="space-y-4">
      <div className={cn("p-2 rounded-lg w-fit text-white", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold mt-1 text-slate-950 dark:text-white">
          {prefix}{value.toLocaleString()}
        </p>
      </div>
    </div>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [performance, setPerformance] = useState<CoursePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, revenueRes, perfRes] = await Promise.all([
          api.get("/v1/admin/dashboard/stats"),
          api.get("/v1/admin/dashboard/revenue"),
          api.get("/v1/admin/dashboard/performance")
        ]);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setPerformance(perfRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white italic flex items-center gap-3">
            Tenant Analytics
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold border border-emerald-500/20 flex items-center gap-1">
              <TrendingUp size={12} />
              Live Insights
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time performance and financial overview for your organization.
          </p>
        </div>
      </header>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Revenue" 
          value={stats?.revenue || 0} 
          prefix="$" 
          icon={DollarSign} 
          color="bg-emerald-500 shadow-emerald-500/20" 
        />
        <MetricCard 
          label="Cumulative Enrollments" 
          value={stats?.total_enrollments || 0} 
          icon={BookOpen} 
          color="bg-indigo-500 shadow-indigo-500/20" 
        />
        <MetricCard 
          label="Active Students" 
          value={stats?.active_students || 0} 
          icon={Users} 
          color="bg-sky-500 shadow-sky-500/20" 
        />
        <MetricCard 
          label="Avg. Completion" 
          value={stats?.completion_rate || 0} 
          prefix="%" 
          icon={CheckCircle2} 
          color="bg-amber-500 shadow-amber-500/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Revenue Trend</h3>
              <p className="text-sm text-slate-500">Earnings over the last 30 days</p>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Last 30 Days</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Courses */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-lg font-bold">Top Courses</h3>
          </div>
          <div className="space-y-6">
            {performance.map((course, idx) => (
              <div key={course.id} className="group relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-slate-100 dark:text-slate-800 group-hover:text-primary/20 transition-colors pointer-events-none">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{course.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-xs font-bold">{course.enrollments}</span>
                    <Users size={12} />
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.avg_progress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex justify-between uppercase font-bold tracking-widest">
                  <span>Avg. Progress</span>
                  <span>{course.avg_progress}%</span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
