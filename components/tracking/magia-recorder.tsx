"use client";

import { useState } from "react";
import type { MagiaType } from "@/lib/types";
import { useMatch } from "@/lib/match-context";
import { MAGIA_TYPE_LABELS } from "@/lib/constants";

type Step = "closed" | "type" | "player";

const MAGIA_STYLES: Record<MagiaType, string> = {
  x3: "bg-purple-500 text-white active:bg-purple-600",
  x4: "bg-indigo-500 text-white active:bg-indigo-600",
  dejada: "bg-pink-500 text-white active:bg-pink-600",
  dormilona: "bg-cyan-500 text-white active:bg-cyan-600",
  "salida-de-pista": "bg-teal-500 text-white active:bg-teal-600",
};

export function MagiaRecorder() {
  const { state, dispatch } = useMatch();
  const [step, setStep] = useState<Step>("closed");
  const [selectedType, setSelectedType] = useState<MagiaType | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const magiaCount = state.magias.length;

  const team1Players = state.players.filter((p) => p.team === 1);
  const team2Players = state.players.filter((p) => p.team === 2);

  function handleTypeSelect(type: MagiaType) {
    setSelectedType(type);
    setStep("player");
  }

  function handlePlayerSelect(playerId: string) {
    if (!selectedType) return;
    dispatch({
      type: "RECORD_MAGIA",
      payload: { magiaType: selectedType, playerId },
    });
    const player = state.players.find((p) => p.id === playerId);
    setFlash(`${MAGIA_TYPE_LABELS[selectedType]} — ${player?.name}`);
    setStep("closed");
    setSelectedType(null);
    setTimeout(() => setFlash(null), 2000);
  }

  function handleCancel() {
    setStep(step === "player" ? "type" : "closed");
    if (step !== "player") setSelectedType(null);
  }

  if (step === "closed") {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setStep("type")}
          className="w-full h-14 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 text-sm font-semibold active:bg-purple-50 transition-colors flex flex-col items-center justify-center"
        >
          <span>🪄 Magias{magiaCount > 0 ? ` (${magiaCount})` : ""}</span>
          <span className="text-xs font-normal text-purple-400">Golpes especiales</span>
        </button>
        {flash && (
          <div className="text-center text-sm text-purple-600 font-medium animate-fade-in">
            {flash}
          </div>
        )}
      </div>
    );
  }

  if (step === "type") {
    return (
      <div className="space-y-3 animate-fade-in">
        <p className="text-center text-slate-500 text-sm font-medium">
          ¿Qué magia fue?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(MAGIA_TYPE_LABELS) as MagiaType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={`h-12 rounded-xl text-sm font-bold transition-all active:scale-95 ${MAGIA_STYLES[type]}`}
            >
              {MAGIA_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
        <button
          onClick={handleCancel}
          className="w-full h-10 rounded-lg text-slate-500 text-sm font-medium active:bg-slate-100 transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  // step === "player"
  return (
    <div className="space-y-3 animate-fade-in-scale">
      <p className="text-center text-slate-500 text-sm font-medium">
        ¿Quién hizo la {selectedType ? MAGIA_TYPE_LABELS[selectedType] : ""}?
      </p>

      <div className="relative rounded-2xl border-2 border-slate-300 bg-slate-100 p-3 overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2 z-0" />

        <div className="grid grid-cols-2 gap-3 relative z-10">
          {[team1Players.find((p) => p.position === "reves"), team2Players.find((p) => p.position === "drive")].map(
            (p) =>
              p && (
                <button
                  key={p.id}
                  onClick={() => handlePlayerSelect(p.id)}
                  className={`h-16 rounded-xl text-white font-bold text-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
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

          {[team1Players.find((p) => p.position === "drive"), team2Players.find((p) => p.position === "reves")].map(
            (p) =>
              p && (
                <button
                  key={p.id}
                  onClick={() => handlePlayerSelect(p.id)}
                  className={`h-16 rounded-xl text-white font-bold text-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
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

        <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium px-1">
          <span>Equipo 1</span>
          <span>Equipo 2</span>
        </div>
      </div>

      <button
        onClick={handleCancel}
        className="w-full h-10 rounded-lg text-slate-500 text-sm font-medium active:bg-slate-100 transition-colors"
      >
        Volver
      </button>
    </div>
  );
}
