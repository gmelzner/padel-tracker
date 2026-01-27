"use client";

import { useEffect } from "react";
import { MatchProvider, useMatch } from "@/lib/match-context";
import { SetupScreen } from "./setup/setup-screen";
import { TrackingScreen } from "./tracking/tracking-screen";
import { ResultsScreen } from "./results/results-screen";

function ScreenRouter() {
  const { state } = useMatch();

  // Warn before leaving during match
  useEffect(() => {
    if (state.screen !== "tracking") return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.screen]);

  // Wake lock to prevent screen from sleeping during match
  useEffect(() => {
    if (state.screen !== "tracking") return;

    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake lock not supported or denied — not critical
      }
    }

    requestWakeLock();

    return () => {
      wakeLock?.release();
    };
  }, [state.screen]);

  switch (state.screen) {
    case "setup":
      return <SetupScreen />;
    case "tracking":
      return <TrackingScreen />;
    case "results":
      return <ResultsScreen />;
  }
}

export function MatchApp() {
  return (
    <MatchProvider>
      <ScreenRouter />
    </MatchProvider>
  );
}
