"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Tournament, TournamentType } from "@/lib/database.types";
import type { Locale } from "@/lib/i18n";
import { TournamentCard } from "./tournament-card";

interface TournamentListProps {
  tournaments: Tournament[];
  locale: Locale;
}

type TypeFilter = "all" | TournamentType;

export function TournamentList({ tournaments, locale }: TournamentListProps) {
  const t = useTranslations("tournaments");
  const [activeType, setActiveType] = useState<TypeFilter>("all");

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: "all", label: t("allTypes") },
    { key: "tournament", label: t("typeTournament") },
    { key: "open_court", label: t("typeOpenCourt") },
  ];

  const filtered =
    activeType === "all"
      ? tournaments
      : tournaments.filter((t) => t.type === activeType);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {typeFilters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              activeType === key
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}

        <a
          href="/torneos/submit"
          className="ml-auto text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          + {t("submitCta")}
        </a>
      </div>

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
