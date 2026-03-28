import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalErrorBoundary } from "@/components/error-boundary";
import { OfflineBanner } from "@/components/safe-ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoundryAI - Forge Your Next Venture",
  description: "Where million-dollar ideas are forged. Transform raw concepts into actionable business plans with AI-powered execution planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <GlobalErrorBoundary>
          <OfflineBanner />
          {children}
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
