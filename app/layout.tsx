import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NEURAVOX — The Cognitive Interface',
  description:
    'Where Human Thought Meets Synthetic Intelligence.',
  keywords: ['NEURAVOX', 'AI interface', 'synthetic intelligence', 'futuristic AI', 'cognitive system'],
  openGraph: {
    title: 'NEURAVOX — The Cognitive Interface',
    description:
      'Where Human Thought Meets Synthetic Intelligence.',
    url: 'https://mertalp.me',
    siteName: 'NEURAVOX',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NEURAVOX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEURAVOX — The Cognitive Interface',
    description:
      'Where Human Thought Meets Synthetic Intelligence.',
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
