"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DeuceMode, Player } from "@/lib/types";
import { useMatch } from "@/lib/match-context";
import { useAuth } from "@/components/auth-provider";
import { MatchConfigForm } from "./match-config";

interface TeamDraft {
  drive: string;
  reves: string;
}

export function SetupScreen() {
  const { dispatch } = useMatch();
  const { user } = useAuth();
  const t = useTranslations();
  const [team1, setTeam1] = useState<TeamDraft>({ drive: "", reves: "" });
  const [team2, setTeam2] = useState<TeamDraft>({ drive: "", reves: "" });
  const [gamesPerSet, setGamesPerSet] = useState(4);
  const [numberOfSets, setNumberOfSets] = useState(1);
  const [deuceMode, setDeuceMode] = useState<DeuceMode>("golden-point");
  const [tiebreakEnabled, setTiebreakEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!team1.drive.trim() || !team1.reves.trim()) {
      return t("setup.errorTeam1");
    }
    if (!team2.drive.trim() || !team2.reves.trim()) {
      return t("setup.errorTeam2");
    }
    return null;
  }

  function handleStart() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const matchPlayers: Player[] = [
      { id: "p0", name: team1.drive.trim(), team: 1, position: "drive" },
      { id: "p1", name: team1.reves.trim(), team: 1, position: "reves" },
      { id: "p2", name: team2.drive.trim(), team: 2, position: "drive" },
      { id: "p3", name: team2.reves.trim(), team: 2, position: "reves" },
    ];

    dispatch({
      type: "INITIALIZE_MATCH",
      payload: {
        players: matchPlayers,
        config: { gamesPerSet, numberOfSets, deuceMode, tiebreakEnabled },
      },
    });
  }

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-8">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="text-center pt-6 pb-2 relative">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {t("setup.title")}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {t("setup.subtitle")}
          </p>
          {user && (
            <a
              href="/profile"
              className="absolute top-6 right-0 flex items-center gap-1.5"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                  {(user.user_metadata?.full_name ?? user.email ?? "?")[0].toUpperCase()}
                </div>
              )}
            </a>
          )}
        </div>

        {/* Team 1 block */}
        <div className="rounded-2xl bg-team1 p-4 space-y-3">
          <h2 className="text-white font-bold text-lg">{t("setup.team1")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-blue-200 text-xs font-medium">Revés</label>
              <input
                type="text"
                value={team1.reves}
                onChange={(e) => setTeam1({ ...team1, reves: e.target.value })}
                placeholder={t("setup.namePlaceholder")}
                className="w-full h-12 px-3 rounded-xl bg-white/20 text-white placeholder-blue-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-blue-200 text-xs font-medium">Drive</label>
              <input
                type="text"
                value={team1.drive}
                onChange={(e) => setTeam1({ ...team1, drive: e.target.value })}
                placeholder={t("setup.namePlaceholder")}
                className="w-full h-12 px-3 rounded-xl bg-white/20 text-white placeholder-blue-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-sm font-bold">{t("setup.vs")}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Team 2 block */}
        <div className="rounded-2xl bg-team2 p-4 space-y-3">
          <h2 className="text-white font-bold text-lg">{t("setup.team2")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-orange-200 text-xs font-medium">Revés</label>
              <input
                type="text"
                value={team2.reves}
                onChange={(e) => setTeam2({ ...team2, reves: e.target.value })}
                placeholder={t("setup.namePlaceholder")}
                className="w-full h-12 px-3 rounded-xl bg-white/20 text-white placeholder-orange-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-orange-200 text-xs font-medium">Drive</label>
              <input
                type="text"
                value={team2.drive}
                onChange={(e) => setTeam2({ ...team2, drive: e.target.value })}
                placeholder={t("setup.namePlaceholder")}
                className="w-full h-12 px-3 rounded-xl bg-white/20 text-white placeholder-orange-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>

        {/* Match config */}
        <MatchConfigForm
          gamesPerSet={gamesPerSet}
          numberOfSets={numberOfSets}
          deuceMode={deuceMode}
          tiebreakEnabled={tiebreakEnabled}
          onGamesChange={setGamesPerSet}
          onSetsChange={setNumberOfSets}
          onDeuceModeChange={setDeuceMode}
          onTiebreakChange={setTiebreakEnabled}
        />

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 rounded-xl p-3 animate-fade-in">
            {error}
          </p>
        )}

        <button
          onClick={handleStart}
          className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg active:scale-[0.98] transition-all"
        >
          {t("setup.startMatch")}
        </button>
      </div>
    </div>
  );
}
