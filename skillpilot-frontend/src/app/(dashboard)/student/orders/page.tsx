"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Order {
  id: number;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
  items: Array<{
    id: number;
    price: string;
    itemable: {
      title?: string;
      name?: string;
    }
  }>;
}

export default function StudentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to load your purchase history");
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
      link.setAttribute('download', `receipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default: return <Loader2 size={12} className="animate-spin" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">Retrieving Purchase History...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white italic flex items-center gap-3">
          Purchase <span className="text-primary">History</span>
          <ShoppingBag className="text-primary" size={28} />
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Track your course enrollments and download official receipts for your records.
        </p>
      </header>

      {orders.length === 0 ? (
        <Card className="p-20 text-center flex flex-col items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No orders yet</h3>
            <p className="text-sm text-slate-500 italic">You haven't made any purchases yet. Your course certificates and receipts will appear here.</p>
          </div>
          <Button className="rounded-full px-8 mt-4" onClick={() => window.location.href = '/courses'}>
            Browse Courses
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="p-0 overflow-hidden border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-all">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Order #{(order.id).toString().padStart(6, '0')}</span>
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            getStatusColor(order.payment_status)
                          )}>
                            {getStatusIcon(order.payment_status)}
                            {order.payment_status}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {order.items.map(i => i.itemable?.title || i.itemable?.name).join(', ')}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-0 pt-4 md:pt-0 border-slate-50">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                        <p className="text-xl font-black italic text-slate-900 dark:text-white">${parseFloat(order.total_amount).toFixed(2)}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "rounded-2xl gap-2 font-bold transition-all",
                          order.payment_status === 'paid' ? "hover:bg-primary/10 hover:text-primary" : "opacity-30 cursor-not-allowed"
                        )}
                        disabled={order.payment_status !== 'paid'}
                        onClick={() => handleDownloadInvoice(order.id)}
                      >
                        <Download size={18} />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
