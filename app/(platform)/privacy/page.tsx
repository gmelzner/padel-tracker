import type { Metadata } from "next";
import { PrivacyContent } from "@/components/legal/privacy-content";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates } from "@/lib/seo";

const META = {
  en: { title: "Privacy Policy", description: "Padel Tracker privacy policy." },
  es: { title: "Política de privacidad", description: "Política de privacidad de Padel Tracker." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...META[locale], alternates: localizedAlternates(locale, "/privacy") };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
