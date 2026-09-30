"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, Calendar, ShieldCheck, Mail, Loader2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface Certificate {
  id: number;
  course_id: number;
  certificate_no: string;
  issued_at: string;
  course: {
    title: string;
  };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
      toast.error("Failed to load your certificates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (certId: number) => {
    try {
      setDownloadingId(certId);
      const response = await api.get(`/certificates/${certId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download certificate");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">
          My <span className="text-primary">Certifications</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl">
          Verified proof of your professional expertise. Share your achievements with recruiters and your network.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/10 rounded-[3rem]">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 text-slate-200 dark:text-slate-800 mb-6 shadow-xl relative">
            <Award size={64} className="opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Award size={32} className="text-primary opacity-40 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Begin Your Journey</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            You haven't earned any certificates yet. Complete a course and pass its assessment to get certified.
          </p>
          <Link href="/courses">
            <Button className="mt-8 rounded-full px-8 gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              Explore Courses <ArrowRight size={18} />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-0 overflow-hidden group relative border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white dark:bg-slate-950">
                  {/* Decorative Background */}
                  <div className="absolute -top-12 -right-12 p-8 text-primary opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 pointer-events-none group-hover:rotate-12 group-hover:scale-150">
                    <Award size={240} />
                  </div>

                  <div className="p-10 space-y-8">
                    <div className="flex items-start justify-between relative z-10">
                      <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                        <ShieldCheck size={32} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Verify ID</p>
                        <p className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                          {cert.certificate_no}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                        {cert.course.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full">
                          <Calendar size={14} className="text-primary" />
                          <span>Issued {new Date(cert.issued_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 relative z-10">
                      <Button 
                        onClick={() => handleDownload(cert.id)}
                        disabled={downloadingId === cert.id}
                        className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-white rounded-2xl gap-3 h-14 font-bold transition-all duration-300"
                      >
                        {downloadingId === cert.id ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm" className="p-4 h-14 w-14 rounded-2xl text-slate-400 hover:text-primary transition-colors">
                        <Mail size={22} />
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
