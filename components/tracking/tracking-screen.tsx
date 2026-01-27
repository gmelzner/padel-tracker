"use client";

import { useState } from "react";
import { useMatch } from "@/lib/match-context";
import { Scoreboard } from "./scoreboard";
import { PointRecorder } from "./point-recorder";
import { MagiaRecorder } from "./magia-recorder";
import { UndoButton } from "./undo-button";
import { ScoreEditor } from "./score-editor";

export function TrackingScreen() {
  const { dispatch } = useMatch();
  const [showScoreEditor, setShowScoreEditor] = useState(false);

  function handleEndMatch() {
    if (window.confirm("¿Terminar el partido? Se mostrarán las estadísticas acumuladas.")) {
      dispatch({ type: "END_MATCH" });
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      {/* Sticky scoreboard */}
      <div className="sticky top-0 z-10 p-3 bg-slate-50">
        <Scoreboard />
      </div>

      {/* Point recorder */}
      <div className="flex-1 p-4 space-y-4">
        <PointRecorder />
        <MagiaRecorder />
        <UndoButton />
      </div>

      {/* Bottom actions */}
      <div className="p-4 pt-0 flex justify-center gap-3">
        <button
          onClick={() => setShowScoreEditor(true)}
          className="flex items-center gap-1.5 text-slate-400 text-xs px-3 py-2 rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
          Ajustar marcador
        </button>
        <button
          onClick={handleEndMatch}
          className="flex items-center gap-1.5 text-slate-400 text-xs px-3 py-2 rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          Terminar partido
        </button>
      </div>

      {/* Score editor modal */}
      {showScoreEditor && (
        <ScoreEditor onClose={() => setShowScoreEditor(false)} />
      )}
    </div>
  );
}
