"use client";

import { useEffect, useRef, useState } from "react";
import { useMatch } from "@/lib/match-context";
import { getPointDisplay } from "@/lib/scoring-engine";

export function Scoreboard() {
  const { state } = useMatch();
  const { score, players, config, history } = state;

  const team1Players = players.filter((p) => p.team === 1);
  const team2Players = players.filter((p) => p.team === 2);
  const [pt1, pt2] = getPointDisplay(score);

  // Flash animation on point recorded
  const [flashClass, setFlashClass] = useState("");
  const [scorePopKey, setScorePopKey] = useState(0);
  const prevHistoryLen = useRef(history.length);

  useEffect(() => {
    if (history.length > prevHistoryLen.current) {
      // A new point was recorded
      const lastPoint = history[history.length - 1];
      const isTeam1Point = lastPoint.pointWonByTeam === 1;
      setFlashClass(isTeam1Point ? "animate-flash-green" : "animate-flash-red");
      setScorePopKey((k) => k + 1);

      const timeout = setTimeout(() => setFlashClass(""), 500);
      prevHistoryLen.current = history.length;
      return () => clearTimeout(timeout);
    }
    prevHistoryLen.current = history.length;
  }, [history]);

  return (
    <div className={`bg-slate-800 text-white rounded-2xl p-4 space-y-1.5 overflow-hidden ${flashClass}`}>
      {/* Team names */}
      <div className="grid grid-cols-3 text-center text-sm">
        <div className="text-team1-light font-medium truncate">
          {team1Players.map((p) => p.name).join(" / ")}
        </div>
        <div className="text-slate-500 text-xs self-center">vs</div>
        <div className="text-team2-light font-medium truncate">
          {team2Players.map((p) => p.name).join(" / ")}
        </div>
      </div>

      {/* Sets (if more than 1) */}
      {config.numberOfSets > 1 && (
        <div className="grid grid-cols-3 text-center">
          <div className="text-2xl font-bold">{score.sets[0]}</div>
          <div className="text-slate-500 text-xs self-center">SETS</div>
          <div className="text-2xl font-bold">{score.sets[1]}</div>
        </div>
      )}

      {/* Completed sets detail */}
      {score.completedSets.length > 0 && (
        <div className="flex justify-center gap-3 text-xs text-slate-400">
          {score.completedSets.map((set, i) => (
            <span key={i}>
              {set.games[0]}-{set.games[1]}
              {set.tiebreakPlayed && set.tiebreakScore
                ? ` (${set.tiebreakScore[0]}-${set.tiebreakScore[1]})`
                : ""}
            </span>
          ))}
        </div>
      )}

      {/* Games */}
      <div className="grid grid-cols-3 text-center">
        <div className="text-3xl font-bold">{score.games[0]}</div>
        <div className="text-slate-500 text-xs self-center">
          {score.isTiebreak ? "TIEBREAK" : "GAMES"}
        </div>
        <div className="text-3xl font-bold">{score.games[1]}</div>
      </div>

      {/* Points — with pop animation */}
      <div className="grid grid-cols-3 text-center">
        <div
          key={`pt1-${scorePopKey}`}
          className={`text-4xl font-black ${pt1 === "Ad" ? "text-yellow-400" : ""} ${scorePopKey > 0 ? "animate-score-pop" : ""}`}
        >
          {pt1}
        </div>
        <div className="text-slate-500 text-xs self-center">
          {score.isTiebreak ? "PUNTOS" : ""}
        </div>
        <div
          key={`pt2-${scorePopKey}`}
          className={`text-4xl font-black ${pt2 === "Ad" ? "text-yellow-400" : ""} ${scorePopKey > 0 ? "animate-score-pop" : ""}`}
        >
          {pt2}
        </div>
      </div>

      {/* Serve indicator */}
      <div className="grid grid-cols-3 text-center text-xs text-slate-400">
        <div>{score.servingTeam === 1 ? "● Saque" : ""}</div>
        <div></div>
        <div>{score.servingTeam === 2 ? "Saque ●" : ""}</div>
      </div>
    </div>
  );
}
