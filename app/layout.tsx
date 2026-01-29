import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageSelector } from "@/components/language-selector";

export const metadata: Metadata = {
  title: {
    default: "Padel Tracker — Seguimiento de partidos y estadísticas en vivo",
    template: "%s - Padel Tracker",
  },
  description:
    "Seguí tus partidos de pádel en tiempo real. Registrá puntos, winners, errores, magias y compartí estadísticas detalladas. Gratis, sin registro. Track your padel matches live with detailed stats.",
  keywords: [
    "padel",
    "padel tracker",
    "padel score",
    "padel statistics",
    "padel stats",
    "seguimiento padel",
    "estadísticas padel",
    "marcador padel",
    "score tracker",
    "match tracker",
    "pádel en vivo",
    "padel app",
  ],
  metadataBase: new URL("https://padeltracker.pro"),
  alternates: {
    canonical: "https://padeltracker.pro",
  },
  openGraph: {
    title: "Padel Tracker — Seguimiento de partidos y estadísticas en vivo",
    description:
      "Seguí tus partidos de pádel en tiempo real. Registrá puntos, winners, errores y compartí estadísticas detalladas.",
    url: "https://padeltracker.pro",
    siteName: "Padel Tracker",
    type: "website",
    locale: "es_AR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Padel Tracker",
    description:
      "Seguimiento de partidos de pádel en tiempo real con estadísticas detalladas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "google2ec5dac979dceb06",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Padel Tracker",
              url: "https://padeltracker.pro",
              applicationCategory: "SportsApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Seguimiento de partidos de pádel en tiempo real con estadísticas detalladas de puntos, winners, errores y magias.",
              inLanguage: ["es", "en"],
            }),
          }}
        />
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
