import type { Metadata } from "next";
import { TermsContent } from "@/components/legal/terms-content";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates } from "@/lib/seo";

const META = {
  en: {
    title: "Terms and Conditions",
    description: "Padel Tracker terms and conditions of use.",
  },
  es: {
    title: "Términos y condiciones",
    description: "Términos y condiciones de uso de Padel Tracker.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...META[locale], alternates: localizedAlternates(locale, "/terms") };
}

export default function TermsPage() {
  return <TermsContent />;
}
