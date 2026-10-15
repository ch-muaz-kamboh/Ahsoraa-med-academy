import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SupportChatWidget from '@/components/chat/SupportChatWidget';
import GoogleTranslateLoader from '@/components/common/GoogleTranslateLoader';

export const metadata: Metadata = {
  title: 'Ahsora Med Academy | #1 IMAT Preparation Platform — Study Medicine in Italy',
  description:
    'The most comprehensive IMAT preparation platform. Master Biology, Chemistry, Physics & Math, and Critical Reasoning with 2,800+ questions, 12 full mock tests, and expert-led courses. Get into Italian medical school.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
