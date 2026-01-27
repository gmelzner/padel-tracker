"use client";

import { createContext, useContext, useReducer } from "react";
import type { MatchAction, MatchState } from "./types";
import { matchReducer, getInitialState } from "./match-reducer";

interface MatchContextValue {
  state: MatchState;
  dispatch: React.Dispatch<MatchAction>;
}

const MatchContext = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, undefined, getInitialState);
  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) {
    throw new Error("useMatch must be used within MatchProvider");
  }
  return ctx;
}
