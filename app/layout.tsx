import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SplashScreen from "./components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rubiks FX",
  description: "Live currency converter by Rubiks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-100 dark:bg-gray-950">
        <SplashScreen />
        <Header />
        {children}
        <footer className="py-6 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-violet-400 to-violet-400" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-light">Made by</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent via-pink-400 to-pink-400" />
          </div>
          <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent select-none">
            RUBIKS
          </span>
        </footer>
      </body>
    </html>
  );
}
