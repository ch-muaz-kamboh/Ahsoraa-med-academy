import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SupportChatWidget from '@/components/chat/SupportChatWidget';
import GoogleTranslateLoader from '@/components/common/GoogleTranslateLoader';
import { SITE_URL, SITE_NAME, getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/seo-constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ahsora Med Academy | #1 IMAT Preparation Platform — Study Medicine in Italy',
    template: '%s | Ahsora Med Academy',
  },
  description:
    'The most comprehensive IMAT preparation platform. Master Biology, Chemistry, Physics & Math, and Critical Reasoning with 2,800+ questions, 12 full mock tests, and expert-led courses. Get into Italian medical school.',
  keywords: [
    'IMAT preparation',
    'study medicine in Italy in English',
    'IMAT mock exams',
    'Italian medical universities cutoffs',
    'Universitaly pre-enrolment',
    'DSU Italian scholarships',
    'LM41 Medicine and Surgery',
    'IMAT past papers answer keys',
  ],
  authors: [{ name: 'Ahsora Med Academy', url: SITE_URL }],
  creator: 'Ahsora Med Academy',
  publisher: 'Ahsora Med Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Ahsora Med Academy | #1 IMAT Preparation Platform — Study Medicine in Italy',
    description:
      'Master Biology, Chemistry, Physics & Math, and Critical Reasoning with 2,800+ questions, 12 full mock tests, and expert-led courses. Get into Italian medical school.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Ahsora Med Academy Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahsora Med Academy | #1 IMAT Preparation Platform — Study Medicine in Italy',
    description:
      'Master Biology, Chemistry, Physics & Math, and Critical Reasoning with 2,800+ questions, 12 full mock tests, and expert-led courses.',
    images: ['/icon.png'],
    site: '@ahsorameds',
    creator: '@ahsorameds',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/ahsora-emblem.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/ahsora-emblem.png',
    apple: '/ahsora-emblem.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = getOrganizationJsonLd();
  const webSiteJsonLd = getWebSiteJsonLd();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body>
        <AppProvider>
          <LanguageProvider>
            <Navbar />
            <main style={{ minHeight: '80vh' }}>{children}</main>
            <Footer />
            <SupportChatWidget />
            <GoogleTranslateLoader />
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}
