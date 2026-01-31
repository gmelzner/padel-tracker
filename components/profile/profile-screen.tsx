"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { getUserMatches, deleteMatch } from "@/lib/match-service";
import type { Match } from "@/lib/database.types";
import { StatsSummary } from "./stats-summary";
import { MatchCard } from "./match-card";
import { MatchDetailView } from "./match-detail-view";

export function ProfileScreen() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const t = useTranslations();

  useEffect(() => {
    if (!user) return;
    setLoadingMatches(true);
    getUserMatches(user.id).then(({ data }) => {
      setMatches(data);
      setLoadingMatches(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400">{t("sharedResults.loading")}</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold text-slate-800">
            {t("profile.notLoggedIn")}
          </h1>
          <button
            onClick={() => signInWithGoogle("/profile")}
            className="h-11 px-6 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm active:scale-95 transition-all inline-flex items-center gap-2"
          >
            {t("profile.signInWithGoogle")}
          </button>
          <div>
            <a href="/tracker" className="text-sm text-slate-400 underline">
              {t("profile.goBack")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name ?? user.email ?? "";

  async function handleDelete(matchId: string) {
    const { error } = await deleteMatch(matchId);
    if (!error) {
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    }
  }

  if (selectedMatch) {
    return (
      <MatchDetailView
        match={selectedMatch}
        onBack={() => setSelectedMatch(null)}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-8">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-12 h-12 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800 truncate">
              {displayName}
            </h1>
            <p className="text-xs text-slate-400">{t("profile.title")}</p>
          </div>
        </div>

        {/* Stats */}
        {!loadingMatches && <StatsSummary matches={matches} />}

        {/* Match history */}
        <div className="space-y-2">
          <h2 className="font-semibold text-slate-800">
            {t("profile.matchHistory")}
          </h2>

          {loadingMatches ? (
            <div className="text-sm text-slate-400 text-center py-8">
              {t("sharedResults.loading")}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-8 bg-white rounded-xl border border-slate-200 p-4">
              {t("profile.noMatches")}
            </div>
          ) : (
            matches.map((m) => (
              <MatchCard key={m.id} match={m} onDelete={handleDelete} onSelect={setSelectedMatch} />
            ))
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <a
            href="/tracker"
            className="block w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg text-center leading-[3.5rem] active:scale-[0.98] transition-all"
          >
            {t("profile.newMatch")}
          </a>
          <button
            onClick={() => signOut()}
            className="w-full text-sm text-slate-400 font-medium py-2"
          >
            {t("profile.signOutButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
