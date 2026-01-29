"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CompletedSet, GamePoint, ScoreSnapshot, Team } from "@/lib/types";
import { useMatch } from "@/lib/match-context";

interface ScoreEditorProps {
  onClose: () => void;
}

const GAME_POINTS: GamePoint[] = [0, 15, 30, 40];

function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 w-16 shrink-0">{label}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 font-bold text-lg active:bg-slate-300"
      >
        -
      </button>
      <span className="w-8 text-center font-bold text-lg">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 font-bold text-lg active:bg-slate-300"
      >
        +
      </button>
    </div>
  );
}

export function ScoreEditor({ onClose }: ScoreEditorProps) {
  const t = useTranslations();
  const { state, dispatch } = useMatch();
  const { score, config } = state;

  const [games1, setGames1] = useState(score.games[0]);
  const [games2, setGames2] = useState(score.games[1]);
  const [points1, setPoints1] = useState<GamePoint>(score.points[0]);
  const [points2, setPoints2] = useState<GamePoint>(score.points[1]);
  const [sets1, setSets1] = useState(score.sets[0]);
  const [sets2, setSets2] = useState(score.sets[1]);
  const [servingTeam, setServingTeam] = useState<Team>(score.servingTeam);

  function handleApply() {
    // Build completed sets from the set count
    // We don't know the exact game scores of past sets, so we record them generically
    const completedSets: CompletedSet[] = [];
    const totalCompleted = sets1 + sets2;
    for (let i = 0; i < totalCompleted; i++) {
      // Assign set wins: first sets1 to team1, rest to team2
      if (i < sets1) {
        completedSets.push({ games: [config.gamesPerSet, 0], tiebreakPlayed: false });
      } else {
        completedSets.push({ games: [0, config.gamesPerSet], tiebreakPlayed: false });
      }
    }

    const newScore: ScoreSnapshot = {
      sets: [sets1, sets2],
      games: [games1, games2],
      points: [points1, points2],
      advantage: null,
      isTiebreak: config.tiebreakEnabled && games1 === config.gamesPerSet && games2 === config.gamesPerSet,
      tiebreakPoints: [0, 0],
      completedSets,
      currentSetIndex: totalCompleted,
      servingTeam,
    };

    dispatch({ type: "SET_SCORE", payload: { score: newScore } });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8 space-y-5 animate-slide-up">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">{t("scoreEditor.title")}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 text-sm font-medium"
          >
            {t("scoreEditor.cancel")}
          </button>
        </div>

        {/* Sets */}
        {config.numberOfSets > 1 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500">{t("scoreEditor.sets")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <NumberStepper label={t("scoreEditor.team1Short")} value={sets1} onChange={setSets1} max={Math.ceil(config.numberOfSets / 2)} />
              <NumberStepper label={t("scoreEditor.team2Short")} value={sets2} onChange={setSets2} max={Math.ceil(config.numberOfSets / 2)} />
            </div>
          </div>
        )}

        {/* Games */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-500">{t("scoreEditor.gamesCurrentSet")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberStepper label={t("scoreEditor.team1Short")} value={games1} onChange={setGames1} max={config.gamesPerSet + 2} />
            <NumberStepper label={t("scoreEditor.team2Short")} value={games2} onChange={setGames2} max={config.gamesPerSet + 2} />
          </div>
        </div>

        {/* Points */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-500">{t("scoreEditor.pointsCurrentGame")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 w-16 shrink-0">{t("scoreEditor.team1Short")}</span>
              <div className="flex gap-1 flex-1">
                {GAME_POINTS.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPoints1(pt)}
                    className={`flex-1 h-10 rounded-lg text-sm font-bold transition-colors ${
                      points1 === pt
                        ? "bg-team1 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 w-16 shrink-0">{t("scoreEditor.team2Short")}</span>
              <div className="flex gap-1 flex-1">
                {GAME_POINTS.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPoints2(pt)}
                    className={`flex-1 h-10 rounded-lg text-sm font-bold transition-colors ${
                      points2 === pt
                        ? "bg-team2 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Serving team */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-500">{t("scoreEditor.serve")}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setServingTeam(1)}
              className={`flex-1 h-11 rounded-lg font-semibold text-sm transition-colors ${
                servingTeam === 1
                  ? "bg-team1 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {t("scoreEditor.team1")}
            </button>
            <button
              type="button"
              onClick={() => setServingTeam(2)}
              className={`flex-1 h-11 rounded-lg font-semibold text-sm transition-colors ${
                servingTeam === 2
                  ? "bg-team2 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {t("scoreEditor.team2")}
            </button>
          </div>
        </div>

        <button
          onClick={handleApply}
          className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold text-lg active:bg-slate-700 transition-colors"
        >
          {t("scoreEditor.apply")}
        </button>
      </div>
    </div>
  );
}
