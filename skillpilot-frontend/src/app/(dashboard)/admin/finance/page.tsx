"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  FileText,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
  id: number;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    id: number;
    price: string;
    itemable: {
      title?: string;
      name?: string;
    }
  }>;
}

export default function AdminFinancePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/orders", {
        params: {
          page,
          search: search || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
        }
      });
      setOrders(res.data.data);
      setPagination(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to load financial data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download invoice");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'paid': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={12} />;
      case 'paid': return <CheckCircle2 size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default: return <Loader2 size={12} className="animate-spin" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white italic flex items-center gap-3">
            Financial <span className="text-primary">Operations</span>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold border border-primary/20 flex items-center gap-1">
              <TrendingUp size={12} />
              Real-time
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor transactions, manage orders, and generate student invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold bg-white dark:bg-slate-950">
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary to-violet-600 text-white border-0 shadow-xl shadow-primary/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">Monthly Revenue</span>
          </div>
          <div className="space-y-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Gross Total</p>
            <h3 className="text-3xl font-black italic">$42,910.00</h3>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg. Order Value</p>
            <h3 className="text-3xl font-black italic text-slate-900 dark:text-white">$145.20</h3>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Success Rate</p>
            <h3 className="text-3xl font-black italic text-slate-900 dark:text-white">98.4%</h3>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-100 dark:border-slate-800 shadow-xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by student name or email..." 
              className="pl-12 rounded-2xl bg-slate-50 border-transparent dark:bg-slate-800 focus:bg-white transition-all h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
               {['all', 'completed', 'pending', 'cancelled'].map((status) => (
                 <button
                   key={status}
                   onClick={() => setStatusFilter(status)}
                   className={cn(
                     "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     statusFilter === status 
                      ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                   )}
                 >
                   {status}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Items</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Compiling Ledger...</p>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <FileText size={48} />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No transactions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm">
                            {order.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{order.user.name}</p>
                            <p className="text-xs text-slate-500">{order.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col gap-1">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              {item.itemable?.title || item.itemable?.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-mono font-black text-slate-900 dark:text-white">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          getStatusColor(order.payment_status)
                        )}>
                          {getStatusIcon(order.payment_status)}
                          {order.payment_status}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white dark:hover:bg-slate-700">
                             <Eye size={16} />
                           </Button>
                           <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleDownloadInvoice(order.id)}
                           >
                             <Download size={16} />
                           </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing page {page} of {pagination.last_page}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-10 w-10 p-0"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-10 w-10 p-0"
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={page === pagination.last_page}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
