"use client";

import React from "react";
import { FileText, Video as VideoIcon, ExternalLink, Play } from "lucide-react";

interface MediaPreviewProps {
  type: "video" | "pdf" | "text";
  url?: string;
  file?: File | null;
  className?: string;
}

export function MediaPreview({ type, url, file, className }: MediaPreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      // Handle relative paths from backend
      if (url.startsWith('tenants/') || url.startsWith('lessons/')) {
        setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${url}`);
      } else {
        setPreviewUrl(url);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [file, url]);

  if (!previewUrl && type !== "text") {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
        <VideoIcon size={32} className="text-slate-300 mb-2" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Media Selected</p>
      </div>
    );
  }

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isVimeo = (url: string) => {
    return url.includes('vimeo.com');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (type === "video") {
    if (url && (isYouTube(url) || isVimeo(url))) {
      const embedUrl = isYouTube(url) ? getYouTubeEmbedUrl(url) : url; // Vimeo embed would need more logic or just use url
      return (
        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-black">
          <iframe
            src={embedUrl || url}
            className="w-full h-full"
            allowFullScreen
            title="Video Preview"
          />
        </div>
      );
    }

    return (
      <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-black relative group">
        <video 
          src={previewUrl!} 
          controls 
          className="w-full h-full object-contain"
          poster="/video-poster.png"
        />
      </div>
    );
  }

  if (type === "pdf") {
    return (
      <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex flex-col">
          <div className="flex-1 overflow-hidden">
             <embed src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full" />
          </div>
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">
                    {file?.name || 'Document Preview'}
                </span>
            </div>
            <a 
              href={previewUrl!} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-slate-50 rounded-lg text-primary transition-colors"
            >
                <ExternalLink size={14} />
            </a>
          </div>
      </div>
    );
  }

  return null;
}
