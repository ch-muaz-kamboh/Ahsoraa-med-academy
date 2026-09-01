import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Ahsora Meds Academy | Admissions, Exam Prep & University Placement',
  description:
    'Comprehensive exam preparation, admissions consultancy and university placement support across Italy, UK, Hungary, Germany and USA. Start your global academic journey with Ahsora Meds.',
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
          <Navbar />
          <main style={{ minHeight: '80vh' }}>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
