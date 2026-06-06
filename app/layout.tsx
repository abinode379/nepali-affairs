import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import env from '../lib/env';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Nepali Affairs',
  description: env.siteDescription,
  openGraph: {
    title: 'Nepali Affairs',
    description: env.siteDescription,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepali Affairs',
    description: env.siteDescription
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
