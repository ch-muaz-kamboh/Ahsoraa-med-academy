'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { enforceEnglishGoogleCookies } from '@/lib/i18n/LanguageContext';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay?: boolean;
            layout?: number;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslateLoader() {
  const pathname = usePathname();
  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/staff');

  useEffect(() => {
    if (isExcluded) return;

    // Define the global callback function if not already defined
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        try {
          if (window.google?.translate?.TranslateElement) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,bn,ar,fa,tr,fr,it,es,ru,zh-CN,hi,si,ne,ta',
                autoDisplay: false,
              },
              'google_translate_element'
            );

            const savedLang = localStorage.getItem('ahsora_selected_lang') || 'en';
            if (savedLang && savedLang !== 'en') {
              setTimeout(() => {
                const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
                if (select) {
                  select.value = savedLang;
                  select.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }, 400);
            } else {
              // Ensure English cookies and combo are strictly enforced so Google Translate never reverts to another language!
              enforceEnglishGoogleCookies();
              setTimeout(() => {
                const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
                if (select && select.value !== '') {
                  select.value = '';
                  select.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }, 200);
            }
          }
        } catch (e) {
          console.debug('Translate init note:', e);
        }
      };
    }

    // Check if non-English language was explicitly requested
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('ahsora_selected_lang') : null;
    const isNonEnglish = savedLang && savedLang !== 'en';

    const loadScript = () => {
      const SCRIPT_ID = 'google-translate-script';
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    if (isNonEnglish) {
      loadScript();
    } else {
      // Defer loading on mobile/desktop until idle or user interaction
      let timer: any;
      if (typeof window !== 'undefined') {
        const triggerHandler = () => {
          loadScript();
          window.removeEventListener('ahsora_trigger_translate', triggerHandler);
        };
        window.addEventListener('ahsora_trigger_translate', triggerHandler, { once: true });

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadScript, { timeout: 4000 });
        } else {
          timer = setTimeout(loadScript, 3500);
        }
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [isExcluded]);

  if (isExcluded) {
    return null;
  }

  return (
    <div
      id="google_translate_element"
      style={{
        display: 'none !important' as 'none',
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none',
        clip: 'rect(0 0 0 0)',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
}
