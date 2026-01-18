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
        <div className="mobile-container flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Eighternity
            </span>
            <Link 
              href="/profile"
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              <User size={18} strokeWidth={2} />
            </Link>
          </header>

          <main className="flex-grow overflow-y-auto pb-20">
            {children}
          </main>
          
          <Navigation />
        </div>
      </body>
    </html>
  );
}
