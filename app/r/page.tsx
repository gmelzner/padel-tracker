"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  decodeMatchResults,
  type DecodedMatchResults,
} from "@/lib/share-codec";
import { SharedResultsDisplay } from "@/components/results/shared-results-display";

export default function SharedResultsPage() {
  const [data, setData] = useState<DecodedMatchResults | null>(null);
  const [error, setError] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setError(true);
      return;
    }
    const decoded = decodeMatchResults(hash);
    if (!decoded) {
      setError(true);
      return;
    }
    setData(decoded);
  }, []);

  if (error) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-slate-800">
            {t("sharedResults.notFound")}
          </h1>
          <p className="text-slate-500">{t("sharedResults.invalidLink")}</p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold"
          >
            {t("sharedResults.goToApp")}
          </a>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400">{t("sharedResults.loading")}</div>
      </div>
    );
  }

  return <SharedResultsDisplay data={data} />;
}
