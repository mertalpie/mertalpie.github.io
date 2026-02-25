import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PulseMind AI — Turn meetings into momentum',
  description:
    'PulseMind AI automatically transcribes, summarizes, and extracts action items from your meetings — so your team can focus on what matters.',
  keywords: ['AI meeting assistant', 'meeting summaries', 'action items', 'productivity', 'SaaS'],
  openGraph: {
    title: 'PulseMind AI — Turn meetings into momentum',
    description:
      'PulseMind AI automatically transcribes, summarizes, and extracts action items from your meetings — so your team can focus on what matters.',
    url: 'https://mertalp.me',
    siteName: 'PulseMind AI',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PulseMind AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PulseMind AI — Turn meetings into momentum',
    description:
      'PulseMind AI automatically transcribes, summarizes, and extracts action items from your meetings.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://mertalp.me'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
