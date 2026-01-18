import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { User } from "lucide-react";
import { Navigation } from "@/components/Navigation";

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
          <header className="sticky top-0 z-30 w-full bg-white/40 backdrop-blur-3xl border-b border-white/30 px-8 py-5 flex justify-between items-center shadow-sm shadow-indigo-500/5">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 tracking-tighter">
              Eighternity
            </span>
            <Link 
              href="/profile"
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-md shadow-indigo-500/10 flex items-center justify-center text-indigo-600 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
            >
              <User size={20} strokeWidth={2.5} />
            </Link>
          </header>

          <main className="flex-grow px-8 py-8 overflow-y-auto pb-36">
            {children}
          </main>
          
          <Navigation />
        </div>
      </body>
    </html>
  );
}
