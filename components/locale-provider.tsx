"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { type Locale, defaultLocale, getMessages, isLocale } from "@/lib/i18n";
import { useAuth } from "@/components/auth-provider";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

const STORAGE_KEY = "padel-locale";

function setLocaleCookie(locale: Locale) {
  document.cookie = `padel-locale=${locale};path=/;max-age=31536000;samesite=lax`;
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, unknown> | null>(
    null
  );
  const profileSynced = useRef(false);

  // Load initial locale from localStorage
  useEffect(() => {
    const stored = getStoredLocale();
    setLocaleState(stored);
    setLocaleCookie(stored);
  }, []);

  // Sync locale from the user's profile on login
  useEffect(() => {
    if (!user || profileSynced.current) return;
    profileSynced.current = true;

    fetch("/api/profile/locale")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.preferred_locale && isLocale(data.preferred_locale)) {
          setLocaleState(data.preferred_locale);
          localStorage.setItem(STORAGE_KEY, data.preferred_locale);
          setLocaleCookie(data.preferred_locale);
        }
      })
      .catch(() => {});
  }, [user]);

  // Reset sync flag on logout
  useEffect(() => {
    if (!user) profileSynced.current = false;
  }, [user]);

  // Load messages whenever locale changes
  useEffect(() => {
    getMessages(locale).then(setMessages);
  }, [locale]);

  // Update html lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      setLocaleCookie(newLocale);

      // Persist to the user's profile if logged in
      if (user) {
        fetch("/api/profile/locale", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferred_locale: newLocale }),
        }).catch(() => {});
      }
    },
    [user]
  );

  if (!messages) return null;

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
