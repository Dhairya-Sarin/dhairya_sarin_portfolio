import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AnimatedBackground } from "@/components/animations/AnimatedBackground";

export const metadata: Metadata = {
  title: "Dhairya Sarin | Software Engineer",
  description: "Portfolio of Dhairya Sarin, Software Engineer - Data Systems & AI Infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
