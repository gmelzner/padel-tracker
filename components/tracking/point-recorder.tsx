"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PointType, Team } from "@/lib/types";
import { useMatch } from "@/lib/match-context";

type Step = "type" | "player";

const ACTION_STYLES: Record<PointType, string> = {
  winner: "bg-winner text-white active:bg-green-600",
  "unforced-error": "bg-unforced text-white active:bg-red-600",
  "forced-error": "bg-forced text-white active:bg-green-500",
};

const POINT_TYPE_KEYS: Record<PointType, string> = {
  winner: "pointTypes.winner",
  "forced-error": "pointTypes.forcedError",
  "unforced-error": "pointTypes.unforcedError",
};

const PLAYER_PROMPT_KEYS: Record<PointType, string> = {
  winner: "playerPrompt.winner",
  "unforced-error": "playerPrompt.unforcedError",
  "forced-error": "playerPrompt.forcedError",
};

export function PointRecorder() {
  const t = useTranslations();
  const { state, dispatch } = useMatch();
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<PointType | null>(null);

  const team1Players = state.players.filter((p) => p.team === 1);
  const team2Players = state.players.filter((p) => p.team === 2);

  function handleTypeSelect(type: PointType) {
    setSelectedType(type);
    setStep("player");
  }

  function handlePlayerSelect(playerId: string) {
    if (!selectedType) return;
    dispatch({
      type: "RECORD_POINT",
      payload: { pointType: selectedType, playerId },
    });
    setStep("type");
    setSelectedType(null);
  }

  function handleQuickPoint(team: Team) {
    dispatch({ type: "RECORD_QUICK_POINT", payload: { team } });
  }

  function handleCancel() {
    setStep("type");
    setSelectedType(null);
  }

  if (step === "type") {
    return (
      <div className="space-y-3 animate-fade-in" key="step-type">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">{t("pointRecorder.directPoint")}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickPoint(1)}
            className="h-10 rounded-lg bg-team1/20 text-team1 text-sm font-semibold transition-all active:scale-95 active:bg-team1/30 truncate px-2"
          >
            {team1Players.map((p) => p.name).join(" / ")}
          </button>
          <button
            onClick={() => handleQuickPoint(2)}
            className="h-10 rounded-lg bg-team2/20 text-team2 text-sm font-semibold transition-all active:scale-95 active:bg-team2/30 truncate px-2"
          >
            {team2Players.map((p) => p.name).join(" / ")}
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">{t("pointRecorder.whatHappened")}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        {(Object.keys(POINT_TYPE_KEYS) as PointType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeSelect(type)}
            className={`w-full h-16 rounded-xl text-lg font-bold transition-all active:scale-95 ${ACTION_STYLES[type]}`}
          >
            {t(POINT_TYPE_KEYS[type])}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in-scale" key="step-player">
      <p className="text-center text-slate-500 text-sm font-medium">
        {selectedType ? t(PLAYER_PROMPT_KEYS[selectedType]) : ""}
      </p>

      {/* Court-view layout: top-down view of the court
           Seen from above, each team's half has revés on the left and drive on the right.
           Row 1 (top):    Revés Eq1  |  Drive Eq2    ← left side of court
           Row 2 (bottom): Drive Eq1  |  Revés Eq2    ← right side of court
           The net divides columns. */}
      <div className="relative rounded-2xl border-2 border-slate-300 bg-slate-100 p-3 overflow-hidden">
        {/* Net line in the middle */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2 z-0" />

        <div className="grid grid-cols-2 gap-3 relative z-10">
          {/* Row 1: Revés Eq1 (left-outer) | Drive Eq2 (right-inner) */}
          {[team1Players.find((p) => p.position === "reves"), team2Players.find((p) => p.position === "drive")].map(
            (p) =>
              p && (
                <button
                  key={p.id}
                  onClick={() => handlePlayerSelect(p.id)}
                  className={`h-20 rounded-xl text-white font-bold text-base transition-all active:scale-95 flex flex-col items-center justify-center ${
                    p.team === 1
                      ? "bg-team1 active:bg-blue-600"
                      : "bg-team2 active:bg-orange-600"
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-xs font-normal opacity-80">
                    {p.position === "drive" ? "Drive" : "Revés"}
                  </span>
                </button>
              )
          )}

          {/* Row 2: Drive Eq1 (left-inner) | Revés Eq2 (right-outer) */}
          {[team1Players.find((p) => p.position === "drive"), team2Players.find((p) => p.position === "reves")].map(
            (p) =>
              p && (
                <button
                  key={p.id}
                  onClick={() => handlePlayerSelect(p.id)}
                  className={`h-20 rounded-xl text-white font-bold text-base transition-all active:scale-95 flex flex-col items-center justify-center ${
                    p.team === 1
                      ? "bg-team1 active:bg-blue-600"
                      : "bg-team2 active:bg-orange-600"
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-xs font-normal opacity-80">
                    {p.position === "drive" ? "Drive" : "Revés"}
                  </span>
                </button>
              )
          )}
        </div>

        {/* Court labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium px-1">
          <span>{t("pointRecorder.team1")}</span>
          <span>{t("pointRecorder.team2")}</span>
        </div>
      </div>

      <button
        onClick={handleCancel}
        className="w-full h-11 rounded-lg text-slate-500 text-sm font-medium active:bg-slate-100 transition-colors"
      >
        {t("pointRecorder.cancel")}
      </button>
    </div>
  );
}
