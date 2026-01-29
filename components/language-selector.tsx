"use client";

import { useLocale } from "./locale-provider";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="fixed top-3 right-3 z-50">
      <div className="flex bg-slate-200 rounded-full p-0.5 text-xs font-semibold">
        <button
          onClick={() => setLocale("en")}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            locale === "en"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLocale("es")}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            locale === "es"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500"
          }`}
        >
          ES
        </button>
      </div>
    </div>
  );
}
