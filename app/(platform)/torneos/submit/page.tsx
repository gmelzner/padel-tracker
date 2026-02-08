import type { Metadata } from "next";
import { SubmitForm } from "@/components/tournaments/submit-form";

export const metadata: Metadata = {
  title: "Publicar Torneo",
  description:
    "Submit a padel tournament or open court to the Padel Tracker directory. Free and open to everyone.",
  alternates: {
    canonical: "https://www.padeltracker.pro/torneos/submit",
  },
};

export default function SubmitTournamentPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-12 md:py-16">
      <SubmitForm />
    </section>
  );
}
