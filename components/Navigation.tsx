"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Calendar, User, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/home", icon: Home, label: t.nav.home },
    { href: "/emotion", icon: Sparkles, label: t.nav.emotion },
    { href: "/ask", icon: MessageSquare, label: t.nav.ask },
    { href: "/calendar", icon: Calendar, label: t.nav.calendar },
    { href: "/profile", icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="max-w-[480px] mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/home" && pathname === "/");
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors duration-200 ${
                isActive ? "text-gray-900" : "text-gray-500"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${
                isActive ? "text-gray-900" : "text-gray-500"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
