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
        "flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-primary font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100/20 hover:scale-[1.05] active:scale-[0.95] transition-all",
        className
      )}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
};
