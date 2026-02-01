"use client";

import { useTranslations } from "next-intl";
import type { Tournament } from "@/lib/database.types";
import type { Locale } from "@/lib/i18n";

interface TournamentCardProps {
  tournament: Tournament;
  locale: Locale;
}

export function TournamentCard({ tournament, locale }: TournamentCardProps) {
  const t = useTranslations("tournaments");
  const name = locale === "es" ? tournament.name_es : tournament.name_en;

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString(
      locale === "es" ? "es-AR" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );

  return (
    <a href={`/torneos/${tournament.id}`} className="group block">
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow h-full">
        {tournament.image_url && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={tournament.image_url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                tournament.type === "tournament"
                  ? "text-purple-600 bg-purple-50"
                  : "text-emerald-600 bg-emerald-50"
              }`}
            >
              {tournament.type === "tournament"
                ? t("typeTournament")
                : t("typeOpenCourt")}
            </span>
            {tournament.category && (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {t(`categories.${tournament.category}`)}
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 mb-2 line-clamp-2">
            {name}
          </h2>

          <div className="space-y-1 text-sm text-slate-500">
            {tournament.date_start ? (
              <p>
                {formatDate(tournament.date_start)}
                {tournament.date_end &&
                  tournament.date_end !== tournament.date_start &&
                  ` ${t("dateTo")} ${formatDate(tournament.date_end)}`}
              </p>
            ) : (
              <p className="text-emerald-600 font-medium">{t("dateOpen")}</p>
            )}

            <p>{tournament.city}</p>

            {tournament.price && (
              <p className="font-medium text-slate-600">{tournament.price}</p>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
            {tournament.contact_phone && (
              <span className="text-slate-400" title={t("contactPhone")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
            )}
            {tournament.contact_email && (
              <span className="text-slate-400" title={t("contactEmail")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            )}
            {tournament.contact_whatsapp && (
              <span className="text-emerald-500" title={t("contactWhatsApp")}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.523 5.853L.06 23.64l5.897-1.442A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.943 0-3.783-.51-5.378-1.404l-.386-.229-3.502.856.888-3.413-.25-.398A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                </svg>
              </span>
            )}
            {tournament.external_url && (
              <span className="text-slate-400" title={t("visitWebsite")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
