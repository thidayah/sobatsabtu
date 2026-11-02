import type { Metadata } from 'next';
import { Inter, Poppins, Barlow, Barlow_Condensed } from 'next/font/google';
import { Providers } from './providers';
import { JsonLd } from '@/components/ui/JsonLd';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});
// Font halaman publik (tema Piste): Barlow untuk teks, Barlow Condensed 800 untuk judul
const barlow = Barlow({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-barlow'
});
const barlowCondensed = Barlow_Condensed({
  weight: ['800'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed'
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsClub',
  name: 'Sobat Sabtu',
  url: BASE_URL,
  logo: `${BASE_URL}/images/sobatsabtu.jpg`,
  image: `${BASE_URL}/images/sobatsabtu.jpg`,
  description:
    'Komunitas olahraga untuk anak muda Bandung dengan konsep Mager yang seru! Lari, badminton, sepak bola, basket, dan billiard.',
  areaServed: 'Bandung, Indonesia',
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM,
    process.env.NEXT_PUBLIC_WHATSAPP,
    process.env.NEXT_PUBLIC_TWITTER,
    process.env.NEXT_PUBLIC_TIKTOK,
    process.env.NEXT_PUBLIC_STRAVA,
    process.env.NEXT_PUBLIC_SPOTIFY,
  ].filter(Boolean),
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Sobat Sabtu - Komunitas Olahraga Anak Muda Bandung',
  description: 'Komunitas olahraga untuk anak muda Bandung dengan konsep Mager yang seru! Lari, badminton, sepak bola, basket, dan billiard.',
  keywords: ['lari', 'olahraga', 'komunitas', 'Bandung', 'badminton', 'sepak bola', 'basket', 'billiard'],
  icons: {
    icon: '/icon0.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: new URL(BASE_URL),
  },
  openGraph: {
    title: 'Sobat Sabtu - Komunitas Olahraga Anak Muda Bandung',
    description: 'Komunitas olahraga untuk anak muda Bandung dengan konsep Mager yang seru! Lari, badminton, sepak bola, basket, dan billiard.',
    url: new URL(BASE_URL),
    siteName: "Sobat Sabtu",
    images: [
      {
        url: "/images/sobatsabtu.jpg",
        width: 900,
        height: 600,
        alt: "Sobat Sabtu - Komunitas Olahraga Anak Muda Bandung",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/sobatsabtu.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${barlow.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Sobat Sabtu" />
        <meta name="google-site-verification" content="W_8GikSlYamXWIb3m3-RWktpmB6GP4P1Wjib2LYXO4o" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}