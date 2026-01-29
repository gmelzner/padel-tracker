import type { Metadata } from "next";
import { PrivacyContent } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "Política de Privacidad / Privacy Policy",
  description:
    "Política de privacidad de Padel Tracker. Conocé qué datos recopilamos y cómo los usamos. Padel Tracker privacy policy — learn what data we collect and how we use it.",
  alternates: {
    canonical: "https://padeltracker.pro/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
