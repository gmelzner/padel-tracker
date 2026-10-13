import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";
import { AuthProvider } from "@/components/auth-provider";
import { getServerLocale } from "@/lib/locale-server";
import { getMessages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Padel Tracker — La plataforma de padel",
    template: "%s - Padel Tracker",
  },
  description:
    "Padel Tracker: seguimiento de partidos en tiempo real, estadisticas detalladas, blog y torneos. Track your padel matches live with detailed stats.",
  keywords: [
    "padel",
    "padel tracker",
    "padel score",
    "padel statistics",
    "padel stats",
    "seguimiento padel",
    "estadisticas padel",
    "marcador padel",
    "score tracker",
    "match tracker",
    "padel en vivo",
    "padel app",
    "torneos padel",
  ],
  metadataBase: new URL("https://www.padeltracker.pro"),
  openGraph: {
    title: "Padel Tracker — La plataforma de padel",
    description:
      "Seguimiento de partidos en tiempo real, estadisticas detalladas, blog y torneos de padel.",
    url: "https://www.padeltracker.pro",
    siteName: "Padel Tracker",
    type: "website",
    locale: "es_AR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Padel Tracker",
    description:
      "La plataforma de padel: tracking en vivo, estadisticas, blog y torneos.",
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
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1e293b",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className="bg-slate-50 text-slate-900 min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Padel Tracker",
              url: "https://www.padeltracker.pro",
              description:
                "Plataforma de padel con tracking en vivo, estadisticas, blog y torneos.",
              inLanguage: ["es", "en"],
            }),
          }}
        />
        <AuthProvider>
          <LocaleProvider locale={locale} messages={messages}>
            {children}
          </LocaleProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-G48Q2E7JE0" />
    </html>
  );
}
