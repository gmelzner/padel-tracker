"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Tournament, TournamentType } from "@/lib/database.types";
import type { Locale } from "@/lib/i18n";
import {
  extractCities,
  groupCitiesByCountry,
  COUNTRY_LABELS,
} from "@/lib/city-utils";
import { TournamentCard } from "./tournament-card";

interface TournamentListProps {
  tournaments: Tournament[];
  locale: Locale;
}

type TypeFilter = "all" | TournamentType;

export function TournamentList({ tournaments, locale }: TournamentListProps) {
  const t = useTranslations("tournaments");
  const [activeType, setActiveType] = useState<TypeFilter>("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cities = useMemo(() => extractCities(tournaments), [tournaments]);
  const cityGroups = useMemo(() => groupCitiesByCountry(cities), [cities]);

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: "all", label: t("allTypes") },
    { key: "tournament", label: t("typeTournament") },
    { key: "open_court", label: t("typeOpenCourt") },
  ];

  const filtered = useMemo(() => {
    let result = tournaments;

    if (activeType !== "all") {
      result = result.filter((item) => item.type === activeType);
    }

    if (activeCity !== "all") {
      result = result.filter((item) => item.city === activeCity);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const name = locale === "es" ? item.name_es : item.name_en;
        return (
          name.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          (item.address ?? "").toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [tournaments, activeType, activeCity, searchQuery, locale]);

  return (
    <div>
      {/* Header: title + search + submit */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {t("pageTitle")}
        </h1>
        <p className="text-slate-500 text-sm">{t("pageSubtitle")}</p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
          />
        </div>
        <a
          href="/torneos/submit"
          className="whitespace-nowrap text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          + {t("submitCta")}
        </a>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-1">
          {t("filterByType")}
        </span>
        {typeFilters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              activeType === key
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* City filter pills grouped by country */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-1">
          {t("filterByCity")}
        </span>
        <button
          onClick={() => setActiveCity("all")}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
            activeCity === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {t("allCities")}
        </button>

        {cityGroups.map(({ country, cities: groupCities }) => (
          <div key={country} className="contents">
            <span className="text-xs text-slate-400 font-medium ml-1">
              {COUNTRY_LABELS[country]?.[locale] ?? country}:
            </span>
            {groupCities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                  activeCity === city
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-400 mb-4">
        {t("resultsCount", { count: filtered.length })}
      </p>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">{t("noResults")}</p>
          <a
            href="/torneos/submit"
            className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {t("submitCta")}
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
