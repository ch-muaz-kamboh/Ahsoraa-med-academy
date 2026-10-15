'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  LanguageCode,
  LanguageInfo,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from './languages';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  isRTL: boolean;
  currentLangInfo: LanguageInfo;
  t: (key: string, fallback?: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'ahsora_selected_lang';

export function enforceEnglishGoogleCookies() {
  if (typeof window === 'undefined') return;

  const hostname = window.location.hostname;
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isLocal = hostname === 'localhost' || isIp;

  const domainsToDelete = ['', hostname, `.${hostname}`];
  if (!isLocal && hostname.includes('.')) {
    const rootDomain = hostname.split('.').slice(-2).join('.');
    domainsToDelete.push(`.${rootDomain}`);
    domainsToDelete.push(rootDomain);
  }

  const paths = ['/', '/en', '/portal', window.location.pathname];

  // 1. Expire all existing non-English cookies
  domainsToDelete.forEach((d) => {
    paths.forEach((p) => {
      const domainAttr = d ? `domain=${d}; ` : '';
      document.cookie = `googtrans=; ${domainAttr}path=${p}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
    });
  });

  // 2. Explicitly set googtrans to /en/en with 1 year validity so Google Translate knows page is in English
  document.cookie = `googtrans=/en/en; path=/; max-age=31536000; SameSite=Lax`;
  if (!isLocal) {
    document.cookie = `googtrans=/en/en; path=/; domain=.${hostname.replace(/^www\./, '')}; max-age=31536000; SameSite=Lax`;
    document.cookie = `googtrans=/en/en; path=/; domain=${hostname}; max-age=31536000; SameSite=Lax`;
  }
}

function setGoogleTranslateCookie(lang: LanguageCode) {
  if (typeof window === 'undefined') return;

  const hostname = window.location.hostname;
  const target = lang === 'en' ? '/en/en' : `/en/${lang}`;

  // Set cookie for both current domain and root path
  document.cookie = `googtrans=${target}; path=/; max-age=31536000; SameSite=Lax`;
  if (hostname && hostname !== 'localhost' && !hostname.startsWith('127.')) {
    document.cookie = `googtrans=${target}; path=/; domain=.${hostname.replace(/^www\./, '')}; max-age=31536000; SameSite=Lax`;
  }

  // Trigger Google Translate select element if present
  try {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = lang === 'en' ? '' : lang;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } catch (err) {
    console.debug('Google translate element not ready yet', err);
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [mounted, setMounted] = useState(false);

  // Check if current route is admin or staff (translation disabled)
  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/staff');

  // Initialize language on mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (savedLang && LANGUAGES[savedLang]) {
        setLanguageState(savedLang);
        applyDocumentAttributes(savedLang);
      } else {
        applyDocumentAttributes('en');
      }
    } catch {
      applyDocumentAttributes('en');
    }
  }, []);

  const applyDocumentAttributes = useCallback((lang: LanguageCode) => {
    if (typeof document === 'undefined') return;
    const info = LANGUAGES[lang] || LANGUAGES.en;
    const html = document.documentElement;

    html.lang = lang;
    html.dir = info.dir;

    if (info.dir === 'rtl') {
      html.classList.add('rtl-layout');
      document.body.classList.add('rtl-layout');
    } else {
      html.classList.remove('rtl-layout');
      document.body.classList.remove('rtl-layout');
    }
  }, []);

  const setLanguage = useCallback(
    (code: LanguageCode) => {
      if (!LANGUAGES[code]) return;
      const prev = language;

      setLanguageState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // localStorage might be unavailable in private mode
      }

      applyDocumentAttributes(code);

      if (code === 'en') {
        enforceEnglishGoogleCookies();

        // If switching back from another language to English:
        if (prev !== 'en') {
          // Attempt in-page restore via combo if available
          try {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
            if (select) {
              select.value = '';
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
          } catch (e) {}

          // Google Translate replaces live DOM text nodes irreversibly;
          // reloading immediately and seamlessly restores pristine, 100% original English with zero manual refresh needed!
          setTimeout(() => {
            window.location.reload();
          }, 60);
          return;
        }
      } else {
        setGoogleTranslateCookie(code);
      }
    },
    [language, applyDocumentAttributes]
  );

  // React to route changes: Ensure correct attributes, reset if entering admin
  useEffect(() => {
    if (isExcluded) {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.remove('rtl-layout');
        document.body.classList.remove('rtl-layout');
      }
    } else if (mounted) {
      applyDocumentAttributes(language);
    }
  }, [pathname, isExcluded, mounted, language, applyDocumentAttributes]);

  const currentLangInfo = isExcluded ? LANGUAGES.en : LANGUAGES[language] || LANGUAGES.en;
  const isRTL = currentLangInfo.dir === 'rtl';

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (isExcluded) return fallback || key;
      const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return langDict[key] ?? TRANSLATIONS.en[key] ?? fallback ?? key;
    },
    [language, isExcluded]
  );

  return (
    <LanguageContext.Provider
      value={{
        language: isExcluded ? 'en' : language,
        setLanguage,
        isRTL,
        currentLangInfo,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe fallback if outside provider
    return {
      language: 'en' as LanguageCode,
      setLanguage: () => {},
      isRTL: false,
      currentLangInfo: LANGUAGES.en,
      t: (_key: string, fallback?: string) => fallback || _key,
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
