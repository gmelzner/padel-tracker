"use client";

import { createContext, useContext, useEffect, useCallback, useRef } from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  type Locale,
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  localizePath,
  splitLocale,
} from "@/lib/i18n";
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

// Set when the visitor picks a language with the selector on this device
const CHOICE_KEY = "padel-locale";
// Server and browser must format dates in the same zone to hydrate cleanly
const TIME_ZONE = "America/Argentina/Buenos_Aires";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

interface LocaleProviderProps {
  /** Locale of the URL and its messages, resolved on the server. */
  locale: Locale;
  messages: Record<string, unknown>;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  const { user } = useAuth();
  const profileSynced = useRef(false);

  // Switching language means going to the same page in the other language
  const setLocale = useCallback(
    (newLocale: Locale) => {
      rememberLocale(newLocale);

      if (user) {
        fetch("/api/profile/locale", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferred_locale: newLocale }),
        }).catch(() => {});
      }

      if (newLocale === locale) return;
      // Pages declare their translation in hreflang; blog posts change slug between languages
      const alternate = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${newLocale}"]`
      );
      const { path } = splitLocale(window.location.pathname);
      window.location.assign(
        alternate?.href ??
          localizePath(newLocale, path) + window.location.search + window.location.hash
      );
    },
    [locale, user]
  );

  // Remember the language of the page being visited
  useEffect(() => {
    rememberLocale(locale);
  }, [locale]);

  // On login, a visitor who never chose a language here gets the one in their profile
  useEffect(() => {
    if (!user) {
      profileSynced.current = false;
      return;
    }
    if (profileSynced.current) return;
    profileSynced.current = true;
    if (localStorage.getItem(CHOICE_KEY)) return;

    fetch("/api/profile/locale")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (isLocale(data?.preferred_locale) && data.preferred_locale !== locale) {
          setLocale(data.preferred_locale);
        }
      })
      .catch(() => {});
  }, [user, locale, setLocale]);

  const chooseLocale = useCallback(
    (newLocale: Locale) => {
      localStorage.setItem(CHOICE_KEY, newLocale);
      setLocale(newLocale);
    },
    [setLocale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale: chooseLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
