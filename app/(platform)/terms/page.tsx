import type { Metadata } from "next";
import { TermsContent } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "Terminos y Condiciones / Terms and Conditions",
  description:
    "Terminos y condiciones de uso de Padel Tracker. Padel Tracker terms and conditions of use.",
  alternates: {
    canonical: "https://www.padeltracker.pro/terms",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
