"use client";

import { useTranslations } from "next-intl";
import type { Tournament } from "@/lib/database.types";
import type { Locale } from "@/lib/i18n";

interface TournamentDetailProps {
  tournament: Tournament;
  locale: Locale;
}

export function TournamentDetail({ tournament, locale }: TournamentDetailProps) {
  const t = useTranslations("tournaments");
  const name = locale === "es" ? tournament.name_es : tournament.name_en;
  const description =
    locale === "es" ? tournament.description_es : tournament.description_en;

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString(
      locale === "es" ? "es-AR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );

  const whatsappUrl = tournament.contact_whatsapp
    ? `https://wa.me/${tournament.contact_whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  const mapsUrl = tournament.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.address + ", " + tournament.city)}`
    : null;

  return (
    <div>
      <a
        href="/torneos"
        className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        &larr; {t("backToList")}
      </a>

      {tournament.image_url && (
        <img
          src={tournament.image_url}
          alt={name}
          className="w-full rounded-2xl mt-6 mb-8 aspect-[16/9] object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-2 mt-6 mb-4">
        <span
          className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
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
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {t(`categories.${tournament.category}`)}
          </span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
        {name}
      </h1>

      {description && (
        <p className="text-lg text-slate-600 leading-relaxed mb-8 whitespace-pre-line">
          {description}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 mb-10">
        {(tournament.date_start || tournament.type === "open_court") && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {t("date")}
            </h3>
            {tournament.date_start ? (
              <p className="text-slate-800 font-medium">
                {formatDate(tournament.date_start)}
                {tournament.date_end &&
                  tournament.date_end !== tournament.date_start &&
                  ` ${t("dateTo")} ${formatDate(tournament.date_end)}`}
              </p>
            ) : (
              <p className="text-emerald-600 font-medium">{t("dateOpen")}</p>
            )}
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {t("city")}
          </h3>
          <p className="text-slate-800 font-medium">{tournament.city}</p>
        </div>

        {tournament.address && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {t("address")}
            </h3>
            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline underline-offset-2 font-medium"
              >
                {tournament.address}
              </a>
            ) : (
              <p className="text-slate-800 font-medium">{tournament.address}</p>
            )}
          </div>
        )}

        {tournament.price && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {t("price")}
            </h3>
            <p className="text-slate-800 font-medium">{tournament.price}</p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {t("detail.contactOrganizer")}
        </h2>
        <div className="flex flex-wrap gap-3">
          {tournament.contact_phone && (
            <a
              href={`tel:${tournament.contact_phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t("contactPhone")}
            </a>
          )}
          {tournament.contact_email && (
            <a
              href={`mailto:${tournament.contact_email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t("contactEmail")}
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.523 5.853L.06 23.64l5.897-1.442A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.943 0-3.783-.51-5.378-1.404l-.386-.229-3.502.856.888-3.413-.25-.398A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
              </svg>
              {t("contactWhatsApp")}
            </a>
          )}
          {tournament.external_url && (
            <a
              href={tournament.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t("visitWebsite")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
