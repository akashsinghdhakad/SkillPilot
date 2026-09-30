"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Palette, 
  Upload, 
  Check, 
  Loader2, 
  Image as ImageIcon, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BrandingData {
  name: string;
  logo_url: string | null;
  signature_url: string | null;
  brand_color: string;
}

export default function BrandingSettingsPage() {
  const [data, setData] = useState<BrandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [brandColor, setBrandColor] = useState("#0284c7");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBranding();
  }, []);

  useEffect(() => {
    if (data) {
      updatePdfPreview();
    }
  }, [brandColor, logoFile, signatureFile, data]);

  const fetchBranding = async () => {
    try {
      const res = await api.get("/tenant/branding");
      setData(res.data);
      setBrandColor(res.data.brand_color || "#0284c7");
    } catch (err) {
      console.error("Failed to fetch branding", err);
      toast.error("Failed to load branding settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePdfPreview = async () => {
    const formData = new FormData();
    if (logoFile) formData.append("logo", logoFile);
    if (signatureFile) formData.append("signature", signatureFile);
    formData.append("brand_color", brandColor);

    try {
      const res = await api.post("/certificates/preview", formData, {
        responseType: 'blob'
      });
      
      const newUrl = URL.createObjectURL(res.data);
      
      setPdfUrl(prevUrl => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return newUrl;
      });
    } catch (err) {
      console.error("PDF Preview failed", err);
    }
  };

  useEffect(() => {
    return () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    if (logoFile) formData.append("logo", logoFile);
    if (signatureFile) formData.append("signature", signatureFile);
    formData.append("brand_color", brandColor);

    try {
      const res = await api.post("/tenant/branding", formData);
      toast.success("Branding updated successfully");
      setData(prev => ({ 
        ...prev!, 
        logo_url: res.data.logo_url, 
        signature_url: res.data.signature_url,
        brand_color: res.data.brand_color
      }));
      setLogoFile(null);
      setSignatureFile(null);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update branding");
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
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
            Certificate <span className="text-primary">Branding</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Customize the appearance of certificates issued by your workspace. Changes are reflected in all new and existing downloads.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          Save Branding
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Part */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Palette className="text-primary" size={18} />
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-10 w-10 border-0 rounded-lg cursor-pointer"
                  />
                  <Input 
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 uppercase font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="text-primary" size={18} />
              Identity
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Corporate Logo</label>
                <div className="relative group aspect-video bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-primary/50">
                  {logoFile || data?.logo_url ? (
                    <img 
                      src={logoFile ? URL.createObjectURL(logoFile) : data?.logo_url!} 
                      className="max-h-[80%] max-w-[80%] object-contain"
                      alt="Logo"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <p className="text-[10px] text-slate-500">PNG OR JPG, MAX 2MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Authorized Signature</label>
                <div className="relative group h-24 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-primary/50">
                  {signatureFile || data?.signature_url ? (
                    <img 
                      src={signatureFile ? URL.createObjectURL(signatureFile) : data?.signature_url!} 
                      className="max-h-[70%] object-contain"
                      alt="Signature"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto text-slate-400 mb-2" size={20} />
                      <p className="text-[10px] text-slate-500">SCAN OF SIGNATURE</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </Card>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex gap-3 text-amber-600 dark:text-amber-500">
             <AlertCircle size={20} className="shrink-0 mt-0.5" />
             <div className="text-xs leading-relaxed">
               <span className="font-bold block mb-1">Professional Notice</span>
               Ensure your signature is on a transparent or white background for the best looking certificates.
             </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ExternalLink className="text-primary" size={20} />
            Real-time PDF Preview
          </h2>
          
          <Card className="p-0 overflow-hidden bg-slate-200 dark:bg-slate-900 border-none shadow-2xl relative aspect-[1.414/1]">
            {!pdfUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-slate-500 font-medium">Generating PDF Preview...</p>
                </div>
            ) : (
                <iframe 
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none"
                    title="Certificate Preview"
                />
            )}
          </Card>
          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-primary text-sm font-semibold">
            <ShieldCheck size={20} />
            This is a high-fidelity PDF rendering. Your students will download exactly what you see here.
          </div>
        </div>
      </div>
    </div>
  );
}
