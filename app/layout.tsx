import type { Metadata } from 'next';
import { IBM_Plex_Sans, Geist_Mono, Sora } from 'next/font/google';
import './globals.css';

const bodyFont = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const headingFont = Sora({
  variable: '--font-heading',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Matchflow | Premium Lending Concierge',
  description:
    'Premium green-gray lending experience for curated financial offers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${bodyFont.variable} ${headingFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  );
}
