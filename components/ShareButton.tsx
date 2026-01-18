"use client";

import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

export const ShareButton = ({ title, text, className }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.origin}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "group relative flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 text-indigo-700 font-black text-xs uppercase tracking-[0.15em] shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden",
        className
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 flex items-center gap-2">
        {copied ? (
          <>
            <Check size={16} className="text-green-600 transition-transform duration-300 scale-110" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Share2 size={16} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span>Share</span>
          </>
        )}
      </span>
    </button>
  );
};
