import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageSelector } from "@/components/language-selector";

export const metadata: Metadata = {
  title: "Padel Tracker",
  description: "Real-time padel match tracking",
  metadataBase: new URL("https://padeltracker.pro"),
  openGraph: {
    title: "Padel Tracker",
    description: "Real-time padel match tracking",
    url: "https://padeltracker.pro",
    siteName: "Padel Tracker",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e293b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-dvh">
        <AuthProvider>
          <LocaleProvider>
            <LanguageSelector />
            {children}
          </LocaleProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-G48Q2E7JE0" />
    </html>
  );
}
