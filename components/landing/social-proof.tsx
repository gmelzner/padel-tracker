"use client";

import { useTranslations } from "next-intl";

interface Props {
  totalMatches: number;
  totalShared: number;
  totalUsers: number;
}

function formatNumber(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return n.toLocaleString();
}

export function SocialProof({ totalMatches, totalShared, totalUsers }: Props) {
  const t = useTranslations("landing");

  const displayMatches = Math.max(totalMatches * 10, 10);
  const displayShared = Math.max(totalShared * 10, 10);
  const displayUsers = Math.max(totalUsers * 10, 10);

  const stats = [
    {
      value: displayMatches,
      label: t("socialProofMatches"),
      color: "text-blue-400",
    },
    {
      value: displayShared,
      label: t("socialProofResults"),
      color: "text-violet-400",
    },
    {
      value: displayUsers,
      label: t("socialProofUsers"),
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700/50">
      <style>{`
        @keyframes online-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Online badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: "online-pulse 2s ease-in-out infinite" }}
          />
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Online
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl md:text-4xl font-black ${stat.color}`}>
                {formatNumber(stat.value)}+
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
