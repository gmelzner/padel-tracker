"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { submitTournament } from "@/lib/tournament-service";
import type { TournamentType, TournamentCategory } from "@/lib/database.types";

export function SubmitForm() {
  const t = useTranslations("tournaments.submit");
  const { user, signInWithGoogle } = useAuth();

  const [type, setType] = useState<TournamentType>("tournament");
  const [nameEs, setNameEs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionEs, setDescriptionEs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [city] = useState("Buenos Aires");
  const [address, setAddress] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [category, setCategory] = useState<TournamentCategory | "">("");
  const [price, setPrice] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">{t("signInRequired")}</p>
        <button
          onClick={() => signInWithGoogle("/torneos/submit")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          {t("signInWithGoogle")}
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("successTitle")}</h2>
        <p className="text-slate-500 mb-6">{t("successMessage")}</p>
        <a
          href="/torneos"
          className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          &larr; {t("successBack")}
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nameEs.trim() || !nameEn.trim()) {
      setError(t("errorRequired"));
      return;
    }
    if (!contactPhone.trim() && !contactEmail.trim() && !contactWhatsapp.trim()) {
      setError(t("errorContact"));
      return;
    }

    setSubmitting(true);
    const { error: submitError } = await submitTournament({
      name_es: nameEs.trim(),
      name_en: nameEn.trim(),
      description_es: descriptionEs.trim() || undefined,
      description_en: descriptionEn.trim() || undefined,
      city,
      address: address.trim() || undefined,
      date_start: dateStart || undefined,
      date_end: dateEnd || undefined,
      type,
      category: category || undefined,
      price: price.trim() || undefined,
      contact_phone: contactPhone.trim() || undefined,
      contact_email: contactEmail.trim() || undefined,
      contact_whatsapp: contactWhatsapp.trim() || undefined,
      external_url: externalUrl.trim() || undefined,
      submitted_by: user.id,
    });

    setSubmitting(false);
    if (submitError) {
      setError(submitError);
    } else {
      setSubmitted(true);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Type */}
      <div>
        <label className={labelClass}>{t("type")} *</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setType("tournament")}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              type === "tournament"
                ? "bg-purple-50 text-purple-700 ring-2 ring-purple-500"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t("typeTournament")}
          </button>
          <button
            type="button"
            onClick={() => setType("open_court")}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              type === "open_court"
                ? "bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t("typeOpenCourt")}
          </button>
        </div>
      </div>

      {/* Names */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("nameEs")} *</label>
          <input
            type="text"
            value={nameEs}
            onChange={(e) => setNameEs(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("nameEn")} *</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("descriptionEs")}</label>
          <textarea
            value={descriptionEs}
            onChange={(e) => setDescriptionEs(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("descriptionEn")}</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("city")}</label>
          <input type="text" value={city} disabled className={`${inputClass} bg-slate-50 text-slate-400`} />
        </div>
        <div>
          <label className={labelClass}>{t("address")}</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Dates */}
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t("dateStart")}</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("dateEnd")}</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{t("dateHint")}</p>
      </div>

      {/* Category & Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("category")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TournamentCategory | "")}
            className={inputClass}
          >
            <option value="">{t("categoryNone")}</option>
            <option value="open">Open</option>
            <option value="amateur">Amateur</option>
            <option value="advanced">Advanced</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t("price")}</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t("pricePlaceholder")}
            className={inputClass}
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("contactPhone")} / {t("contactEmail")} / {t("contactWhatsApp")} *
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t("contactPhone")}</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("contactEmail")}</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("contactWhatsApp")}</label>
            <input
              type="tel"
              value={contactWhatsapp}
              onChange={(e) => setContactWhatsapp(e.target.value)}
              placeholder="5491155551234"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("externalUrl")}</label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? t("submitting") : t("submitButton")}
      </button>
    </form>
  );
}
