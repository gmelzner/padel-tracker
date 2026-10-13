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
// Server and browser must format dates in the same zone to hydrate cleanly
const TIME_ZONE = "America/Argentina/Buenos_Aires";

function setLocaleCookie(locale: Locale) {
  document.cookie = `padel-locale=${locale};path=/;max-age=31536000;samesite=lax`;
}

interface LocaleProviderProps {
  /** Locale and messages the server rendered with, so the HTML ships with its text. */
  initialLocale: Locale;
  initialMessages: Record<string, unknown>;
  children: React.ReactNode;
}

export function LocaleProvider({
  initialLocale,
  initialMessages,
  children,
}: LocaleProviderProps) {
  const { user } = useAuth();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  // Messages always travel with the locale they belong to
  const [loaded, setLoaded] = useState({
    locale: initialLocale,
    messages: initialMessages,
  });
  const profileSynced = useRef(false);

  // A locale saved in this browser wins over the one the server guessed
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const preferred = isLocale(stored) ? stored : initialLocale;
    setLocaleState(preferred);
    setLocaleCookie(preferred);
  }, [initialLocale]);

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

  // Load messages when the locale changes from the one already loaded
  useEffect(() => {
    if (locale === loaded.locale) return;
    getMessages(locale).then((messages) => setLoaded({ locale, messages }));
  }, [locale, loaded.locale]);

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

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={loaded.locale}
        messages={loaded.messages}
        timeZone={TIME_ZONE}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
