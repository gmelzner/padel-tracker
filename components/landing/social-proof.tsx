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

  const stats = [
    { value: totalMatches, label: t("socialProofMatches") },
    { value: totalShared, label: t("socialProofResults") },
    { value: totalUsers, label: t("socialProofUsers") },
  ];

  return (
    <section className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-white">
                {formatNumber(stat.value)}+
              </div>
              <div className="text-xs md:text-sm text-slate-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
