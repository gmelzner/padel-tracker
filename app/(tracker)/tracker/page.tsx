import type { Metadata } from "next";
import { MatchApp } from "@/components/match-app";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates } from "@/lib/seo";

const META = {
  en: {
    title: "Padel Score Tracker — Free Online Scoreboard",
    description:
      "Track your padel match live. Record winners, unforced errors, forced errors, and special shots. Real-time score and detailed statistics.",
  },
  es: {
    title: "Marcador de pádel online gratis",
    description:
      "Anotá tu partido de pádel en vivo: winners, errores no forzados, errores forzados y golpes especiales. Marcador automático y estadísticas detalladas, sin registrarte.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...META[locale], alternates: localizedAlternates(locale, "/tracker") };
}

export default function TrackerPage() {
  return <MatchApp />;
}
