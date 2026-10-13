import type { Metadata } from "next";
import { SubmitForm } from "@/components/tournaments/submit-form";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates } from "@/lib/seo";

const META = {
  en: {
    title: "Submit a Tournament",
    description:
      "Submit a padel tournament or open court to the Padel Tracker directory. Free and open to everyone.",
  },
  es: {
    title: "Publicar torneo",
    description:
      "Sumá un torneo o una cancha abierta de pádel al directorio de Padel Tracker. Gratis y abierto a todos.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...META[locale], alternates: localizedAlternates(locale, "/torneos/submit") };
}

export default function SubmitTournamentPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-12 md:py-16">
      <SubmitForm />
    </section>
  );
}
