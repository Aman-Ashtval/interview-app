import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@/styles/globals.scss";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Mock Interview | Practice & Get Feedback",
  description:
    "Full-stack AI-powered mock interview app. Practice interviews, record answers, and get AI feedback.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-dvh overflow-x-hidden`}>
        {children}
        <Toaster position="top-right" richColors duration={3000} className="bg-white" />
      </body>
    </html>
  );
}
