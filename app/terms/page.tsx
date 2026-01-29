import type { Metadata } from "next";
import { TermsContent } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "Términos y Condiciones / Terms and Conditions",
  description:
    "Términos y condiciones de uso de Padel Tracker. Padel Tracker terms and conditions of use.",
  alternates: {
    canonical: "https://padeltracker.pro/terms",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
