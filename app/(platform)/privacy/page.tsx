import type { Metadata } from "next";
import { PrivacyContent } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "Politica de Privacidad / Privacy Policy",
  description:
    "Politica de privacidad de Padel Tracker. Padel Tracker privacy policy.",
  alternates: {
    canonical: "https://www.padeltracker.pro/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
