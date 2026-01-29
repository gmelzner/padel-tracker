"use client";

import { useTranslations } from "next-intl";
import type { DeuceMode } from "@/lib/types";

interface MatchConfigProps {
  gamesPerSet: number;
  numberOfSets: number;
  deuceMode: DeuceMode;
  tiebreakEnabled: boolean;
  onGamesChange: (n: number) => void;
  onSetsChange: (n: number) => void;
  onDeuceModeChange: (m: DeuceMode) => void;
  onTiebreakChange: (b: boolean) => void;
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (v: string | number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 w-28 shrink-0">{label}</span>
      <div className="flex gap-2 flex-1">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 h-11 rounded-lg font-semibold text-sm transition-colors ${
              value === opt.value
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MatchConfigForm({
  gamesPerSet,
  numberOfSets,
  deuceMode,
  tiebreakEnabled,
  onGamesChange,
  onSetsChange,
  onDeuceModeChange,
  onTiebreakChange,
}: MatchConfigProps) {
  const t = useTranslations();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      <h2 className="font-semibold text-slate-800">{t("config.matchFormat")}</h2>

      <OptionGroup
        label={t("config.gamesPerSet")}
        options={[
          { label: "4", value: 4 },
          { label: "6", value: 6 },
        ]}
        value={gamesPerSet}
        onChange={(v) => onGamesChange(v as number)}
      />

      <OptionGroup
        label={t("config.sets")}
        options={[
          { label: "1", value: 1 },
          { label: "3", value: 3 },
        ]}
        value={numberOfSets}
        onChange={(v) => onSetsChange(v as number)}
      />

      <OptionGroup
        label={t("config.deuce")}
        options={[
          { label: t("config.goldenPoint"), value: "golden-point" },
          { label: t("config.advantage"), value: "advantage" },
        ]}
        value={deuceMode}
        onChange={(v) => onDeuceModeChange(v as DeuceMode)}
      />

      <OptionGroup
        label={t("config.tiebreak")}
        options={[
          { label: t("config.yes"), value: "yes" },
          { label: t("config.no"), value: "no" },
        ]}
        value={tiebreakEnabled ? "yes" : "no"}
        onChange={(v) => onTiebreakChange(v === "yes")}
      />
    </div>
  );
}
