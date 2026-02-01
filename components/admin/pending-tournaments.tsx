"use client";

import { useState } from "react";
import type { Tournament } from "@/lib/database.types";

interface PendingTournamentsProps {
  tournaments: Tournament[];
}

export function PendingTournaments({
  tournaments: initial,
}: PendingTournamentsProps) {
  const [tournaments, setTournaments] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  if (tournaments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Pending Tournaments
        </h3>
        <p className="text-sm text-slate-500">No pending submissions.</p>
      </div>
    );
  }

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (action === "reject" && !confirm("Reject and delete this submission?")) {
      return;
    }

    setLoading(id);
    const res = await fetch(`/api/admin/tournaments/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    }
    setLoading(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Pending Tournaments{" "}
        <span className="text-sm font-normal text-amber-600">
          ({tournaments.length})
        </span>
      </h3>
      <div className="space-y-3">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    t.type === "tournament"
                      ? "text-purple-600 bg-purple-100"
                      : "text-emerald-600 bg-emerald-100"
                  }`}
                >
                  {t.type === "tournament" ? "Torneo" : "Cancha"}
                </span>
                <span className="text-xs text-slate-400">{t.city}</span>
              </div>
              <p className="text-sm font-medium text-slate-800 truncate">
                {t.name_es}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(t.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleAction(t.id, "approve")}
                disabled={loading === t.id}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(t.id, "reject")}
                disabled={loading === t.id}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
