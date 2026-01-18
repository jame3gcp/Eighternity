"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Calendar, User } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", icon: Home, label: "홈" },
    { href: "/ask", icon: MessageSquare, label: "질문" },
    { href: "/calendar", icon: Calendar, label: "달력" },
    { href: "/profile", icon: User, label: "프로필" },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-64px)] max-w-[416px] z-40">
      <div className="relative glass-card flex justify-around py-3 px-3 rounded-[2.5rem] border border-white/40 backdrop-blur-2xl bg-white/70 shadow-2xl shadow-indigo-500/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/home" && pathname === "/");
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`group relative flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ease-out ${
                isActive ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-rose-500/20 blur-sm" />
              )}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              <span className="relative flex flex-col items-center gap-1.5">
                <span className={`transition-all duration-300 ${
                  isActive 
                    ? "text-indigo-600 scale-110" 
                    : "group-hover:text-indigo-600 group-hover:scale-110"
                } transform`}>
                  <Icon size={22} />
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                  isActive 
                    ? "text-indigo-600" 
                    : "text-slate-400 group-hover:text-indigo-600"
                }`}>
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
