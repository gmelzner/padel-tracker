"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
        <p className="text-sm text-slate-500 mb-6">{t("lastUpdated")}</p>
        <p className="mb-6 text-slate-700">{t("intro")}</p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("section1Title")}</h2>

          <h3 className="font-medium mb-1">{t("section1Subtitle1")}</h3>
          <p className="mb-3 text-slate-700 text-sm">{t("section1Text1")}</p>

          <h3 className="font-medium mb-1">{t("section1Subtitle2")}</h3>
          <p className="mb-3 text-slate-700 text-sm">{t("section1Text2")}</p>

          <h3 className="font-medium mb-1">{t("section1Subtitle3")}</h3>
          <p className="mb-3 text-slate-700 text-sm">{t("section1Text3")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t("section2Title")}</h2>
          <p className="text-slate-700 text-sm">{t("section2Text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t("section3Title")}</h2>
          <p className="text-slate-700 text-sm">{t("section3Text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t("section4Title")}</h2>
          <p className="text-slate-700 text-sm">{t("section4Text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t("section5Title")}</h2>
          <p className="text-slate-700 text-sm">{t("section5Text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t("section6Title")}</h2>
          <p className="text-slate-700 text-sm">{t("section6Text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t("section7Title")}</h2>
          <p className="text-slate-700 text-sm">
            {t("section7Text")}{" "}
            <a
              href="mailto:contacto@padeltracker.pro"
              className="text-blue-600 underline"
            >
              contacto@padeltracker.pro
            </a>
          </p>
        </section>

        <div className="pt-4 border-t border-slate-200">
          <Link
            href="/"
            className="text-sm text-blue-600 underline"
          >
            {t("backToApp")}
          </Link>
        </div>
      </div>
    </div>
  );
}
