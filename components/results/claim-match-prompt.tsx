"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { saveMatchFromShared } from "@/lib/match-service";
import type { DecodedMatchResults } from "@/lib/share-codec";

type ClaimFlowState = "idle" | "selectPlayer" | "saving" | "saved" | "error";

interface ClaimMatchPromptProps {
  data: DecodedMatchResults;
  sourceSharedId?: string;
}

export function ClaimMatchPrompt({ data, sourceSharedId }: ClaimMatchPromptProps) {
  const { user, loading, signInWithGoogle } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [flow, setFlow] = useState<ClaimFlowState>("idle");
  const t = useTranslations();

  if (loading || dismissed) return null;

  // Not logged in
  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="font-semibold text-slate-800">
          {t("auth.claimMatch")}
        </h2>
        <p className="text-sm text-slate-500">{t("auth.claimDescription")}</p>
        <div className="flex gap-2">
          <button
            onClick={() => signInWithGoogle()}
            className="flex-1 h-11 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            {t("auth.signInWithGoogle")}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-4 h-11 rounded-xl text-slate-400 text-sm font-medium active:scale-95 transition-all"
          >
            {t("auth.skip")}
          </button>
        </div>
      </div>
    );
  }

  // Saved
  if (flow === "saved") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
        <div className="flex items-center gap-3">
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800">{t("auth.saved")}</p>
          </div>
          <a href="/profile" className="text-xs font-semibold text-emerald-700 underline">
            {t("auth.viewProfile")}
          </a>
        </div>
      </div>
    );
  }

  // Error
  if (flow === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
        <p className="text-sm text-red-700">{t("auth.saveError")}</p>
        <button
          onClick={() => setFlow("selectPlayer")}
          className="text-xs font-semibold text-red-700 underline"
        >
          {t("auth.retry")}
        </button>
      </div>
    );
  }

  // Saving
  if (flow === "saving") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500 text-center">{t("auth.saving")}</p>
      </div>
    );
  }

  // Select player
  if (flow === "selectPlayer") {
    const team1Players = data.players.filter((p) => p.team === 1);
    const team2Players = data.players.filter((p) => p.team === 2);

    async function handleClaim(player: { name: string; team: 1 | 2 } | null) {
      setFlow("saving");
      const { error } = await saveMatchFromShared(data, user!.id, player, sourceSharedId);
      setFlow(error ? "error" : "saved");
    }

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="font-semibold text-slate-800">
          {t("auth.whichPlayer")}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {team1Players.map((p, i) => (
            <button
              key={`t1-${i}`}
              onClick={() => handleClaim({ name: p.name, team: p.team })}
              className="h-12 rounded-xl bg-team1 text-white font-semibold text-sm active:scale-95 transition-all"
            >
              {p.name}
            </button>
          ))}
          {team2Players.map((p, i) => (
            <button
              key={`t2-${i}`}
              onClick={() => handleClaim({ name: p.name, team: p.team })}
              className="h-12 rounded-xl bg-team2 text-white font-semibold text-sm active:scale-95 transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleClaim(null)}
          className="w-full h-12 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t("auth.coach")}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="w-full text-slate-400 text-xs font-medium"
        >
          {t("auth.skip")}
        </button>
      </div>
    );
  }

  // Idle — show prompt
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-3">
        {user.user_metadata?.avatar_url && (
          <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {t("auth.signedInAs", {
              name: user.user_metadata?.full_name ?? user.email ?? "",
            })}
          </p>
        </div>
      </div>
      <button
        onClick={() => setFlow("selectPlayer")}
        className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm active:scale-95 transition-all"
      >
        {t("auth.claimMatch")}
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="w-full text-slate-400 text-xs font-medium"
      >
        {t("auth.skip")}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
