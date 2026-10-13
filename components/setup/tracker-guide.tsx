"use client";

import { useMessages, useTranslations } from "next-intl";
import { LocaleLink } from "@/components/locale-link";
import { useLocale } from "@/components/locale-provider";

interface FaqItem {
  q: string;
  a: string;
}

const STAR_POINT_POST = {
  en: "/blog/star-point-new-padel-rule",
  es: "/blog/star-point-nueva-regla-padel",
};

const SCORING_POST = {
  en: "/blog/how-padel-scoring-works",
  es: "/blog/como-se-cuentan-los-puntos-en-padel",
};

/** Explains the scoreboard below the setup form: what it does, formats, FAQ. */
export function TrackerGuide() {
  const t = useTranslations("trackerGuide");
  const { locale } = useLocale();
  const faq = (useMessages().trackerGuide as { faq: FaqItem[] }).faq;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="pt-10 space-y-6 text-slate-600 text-sm leading-relaxed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-800">{t("title")}</h2>
        <p>{t("intro")}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-800">{t("formatsTitle")}</h2>
        <p>{t("formatsIntro")}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("goldenPoint")}</li>
          <li>{t("starPoint")}</li>
          <li>{t("advantage")}</li>
        </ul>
        <ul className="space-y-1">
          <li>
            <LocaleLink
              href={STAR_POINT_POST[locale]}
              className="text-blue-600 underline underline-offset-2"
            >
              {t("starPointLink")}
            </LocaleLink>
          </li>
          <li>
            <LocaleLink
              href={SCORING_POST[locale]}
              className="text-blue-600 underline underline-offset-2"
            >
              {t("scoringLink")}
            </LocaleLink>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-800">{t("statsTitle")}</h2>
        <p>{t("statsBody")}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-800">{t("faqTitle")}</h2>
        {faq.map((item) => (
          <div key={item.q}>
            <h3 className="font-semibold text-slate-800">{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
