"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Mail, 
  MapPin, 
  Hash,
  ShieldCheck, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { toast } from "sonner";

interface BillingData {
  support_email: string;
  billing_address: string;
  tax_id: string;
}

export default function BillingSettingsPage() {
  const [data, setData] = useState<BillingData>({
    support_email: "",
    billing_address: "",
    tax_id: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      const res = await api.get("/tenant/billing");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch billing", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post("/tenant/billing", data);
      toast.success("Billing information updated");
    } catch (err) {
      toast.error("Failed to update billing info");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white italic">
            Organization <span className="text-primary">Billing</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Configure your organization's legal and support information for professional PDF invoices.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20 font-bold"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          Update Info
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Mail className="text-primary" size={20} />
                Support Contact
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support Email Address</label>
                <Input 
                  value={data.support_email || ''}
                  onChange={(e) => setData({ ...data, support_email: e.target.value })}
                  placeholder="support@organization.com"
                  className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white transition-all"
                />
                <p className="text-[10px] text-slate-500 italic">This email will appear on all invoices as the primary contact for payment inquiries.</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <MapPin className="text-primary" size={20} />
                Legal Address
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headquarters / Billing Address</label>
                <Textarea 
                  value={data.billing_address || ''}
                  onChange={(e) => setData({ ...data, billing_address: e.target.value })}
                  placeholder="123 Education Lane, Learning City, 10101"
                  className="rounded-xl min-h-[120px] bg-slate-50 border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Hash className="text-primary" size={20} />
                Tax Identification
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">VAT ID / Tax Registration Number</label>
                <Input 
                  value={data.tax_id || ''}
                  onChange={(e) => setData({ ...data, tax_id: e.target.value })}
                  placeholder="VAT-123456789"
                  className="rounded-xl h-12 bg-slate-50 border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-primary/5 border-primary/20 h-full">
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary">
                <CreditCard size={24} />
              </div>
              <h4 className="font-bold">Invoicing Compliance</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                SkillPilot generates high-fidelity PDF receipts for every transaction. To ensure these documents are legally valid for your region, please provide accurate corporate information.
              </p>
              <div className="pt-4 flex gap-3 text-primary">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wider leading-normal">
                  Changes apply immediately to all future invoice downloads.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
