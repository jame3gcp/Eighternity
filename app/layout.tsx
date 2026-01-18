import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, MessageSquare, Calendar, User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Eighternity | 오늘의 나침반",
  description: "당신만을 위한 사주 기반 라이프 가이드. 오늘 하루의 방향을 읽어보세요.",
  openGraph: {
    title: "Eighternity | 오늘의 나침반",
    description: "당신만을 위한 사주 기반 라이프 가이드. 오늘 하루의 방향을 읽어보세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} selection:bg-indigo-100`}>
        <div className="mobile-container flex flex-col min-h-screen border-x border-white/20">
          <header className="sticky top-0 z-30 w-full bg-white/30 backdrop-blur-2xl border-b border-white/20 px-8 py-6 flex justify-between items-center">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 tracking-tighter">
              Eighternity
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white/50 border border-white/80 shadow-sm flex items-center justify-center text-primary backdrop-blur-md">
              <User size={20} strokeWidth={2.5} />
            </div>
          </header>

          <main className="flex-grow px-8 py-8 overflow-y-auto pb-36">
            {children}
          </main>
          
          <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-64px)] max-w-[416px] glass-card flex justify-around py-4 px-2 z-40 rounded-[2.5rem] border-white/60">
            <NavItem href="/home" icon={<Home size={24} />} label="홈" />
            <NavItem href="/ask" icon={<MessageSquare size={24} />} label="질문" />
            <NavItem href="/calendar" icon={<Calendar size={24} />} label="달력" />
            <NavItem href="/profile" icon={<User size={24} />} label="프로필" />
          </nav>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-all duration-300 px-3 py-1 rounded-2xl hover:bg-indigo-50/50"
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </Link>
  );
}
