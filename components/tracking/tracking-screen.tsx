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
      <div className="p-4 pt-0 flex justify-center gap-6">
        <button
          onClick={() => setShowScoreEditor(true)}
          className="text-slate-400 text-sm underline py-2"
        >
          Ajustar marcador
        </button>
        <button
          onClick={handleEndMatch}
          className="text-slate-400 text-sm underline py-2"
        >
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
