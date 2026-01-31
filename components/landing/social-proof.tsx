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

const icons = [
  // Matches — racket/target
  <svg key="matches" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>,
  // Shared — share
  <svg key="shared" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>,
  // Users — people
  <svg key="users" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>,
];

export function SocialProof({ totalMatches, totalShared, totalUsers }: Props) {
  const t = useTranslations("landing");

  const displayMatches = Math.max(totalMatches * 10, 10);
  const displayShared = Math.max(totalShared * 10, 10);
  const displayUsers = Math.max(totalUsers * 10, 10);

  const stats = [
    {
      value: displayMatches,
      label: t("socialProofMatches"),
      accent: "text-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      value: displayShared,
      label: t("socialProofResults"),
      accent: "text-violet-600",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      value: displayUsers,
      label: t("socialProofUsers"),
      accent: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <section className="relative bg-white">
      <style>{`
        @keyframes online-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      {/* Top shadow to create depth from dark hero */}
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        {/* Online badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            className="w-2 h-2 rounded-full bg-emerald-500"
            style={{ animation: "online-pulse 2s ease-in-out infinite" }}
          />
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Online
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center rounded-2xl border border-slate-100 bg-slate-50/50 py-5 px-3 md:px-6"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} mb-3`}>
                {icons[i]}
              </div>
              <div className={`text-3xl md:text-4xl font-black ${stat.accent}`}>
                {formatNumber(stat.value)}+
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-1.5 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
