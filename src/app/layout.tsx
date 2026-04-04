import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/layer-1-security/auth";
import { ThemeProvider } from "@/lib/theme/theme-context";

export const metadata: Metadata = {
  title: "FoundryAI - Transform Ideas Into Businesses",
  description: "AI-powered business plan generator. Transform your ideas into actionable business strategies with market research, tech stack recommendations, and monetization plans.",
  keywords: ["AI", "business plan", "startup", "entrepreneurship", "market research", "MVP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
