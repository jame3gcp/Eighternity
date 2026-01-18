"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-sm font-medium text-gray-700"
      aria-label="Toggle language"
    >
      <Languages size={16} />
      <span>{language === "ko" ? "English" : "한국어"}</span>
    </button>
  );
}
