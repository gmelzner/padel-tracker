"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { MatchAction, MatchState } from "./types";
import { matchReducer, getInitialState } from "./match-reducer";

const PENDING_SAVE_KEY = "padel-pending-save";

interface MatchContextValue {
  state: MatchState;
  dispatch: React.Dispatch<MatchAction>;
  /** True when state was just restored from a pre-OAuth localStorage save */
  pendingSave: boolean;
  clearPendingSave: () => void;
}

const MatchContext = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, undefined, getInitialState);
  const [pendingSave, setPendingSave] = useState(false);

  // Restore match state saved before OAuth redirect
  useEffect(() => {
    const pending = localStorage.getItem(PENDING_SAVE_KEY);
    if (!pending) return;
    localStorage.removeItem(PENDING_SAVE_KEY);
    try {
      const restored: MatchState = JSON.parse(pending);
      if (restored.screen === "results" && restored.players.length > 0) {
        dispatch({ type: "RESTORE_STATE", payload: restored });
        setPendingSave(true);
      }
    } catch {
      // Invalid data — ignore
    }
  }, []);

  const clearPendingSave = () => setPendingSave(false);

  return (
    <MatchContext.Provider value={{ state, dispatch, pendingSave, clearPendingSave }}>
      {children}
    </MatchContext.Provider>
  );
}

export { PENDING_SAVE_KEY };

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) {
    throw new Error("useMatch must be used within MatchProvider");
  }
  return ctx;
}
