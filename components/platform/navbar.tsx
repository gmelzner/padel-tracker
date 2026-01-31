"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";

export function Navbar() {
  const t = useTranslations("nav");
  const { user, signInWithGoogle } = useAuth();
  const { locale, setLocale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/tracker", label: t("tracker") },
    { href: "/blog", label: t("blog") },
    { href: "/torneos", label: t("tournaments") },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-lg font-black text-slate-800 tracking-tight">
            Padel Tracker
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Language toggle */}
          <div className="flex bg-slate-100 rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLocale("en")}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                locale === "en"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("es")}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                locale === "es"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              ES
            </button>
          </div>

          {/* Auth */}
          {user ? (
            <a
              href="/profile"
              className="flex items-center gap-1.5"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-8 h-8 rounded-full border border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                  {(user.user_metadata?.full_name ?? user.email ?? "?")[0].toUpperCase()}
                </div>
              )}
            </a>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              {t("signIn")}
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-600"
          aria-label="Menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-slate-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 py-2">
            <div className="flex bg-slate-100 rounded-full p-0.5 text-xs font-semibold">
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
          {!user && (
            <button
              onClick={() => {
                signInWithGoogle();
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-600"
            >
              {t("signIn")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
