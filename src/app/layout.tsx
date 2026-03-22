import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
//@ts-ignore
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Sobat Sabtu - Komunitas Olahraga Anak Muda Bandung',
  description: 'Komunitas olahraga untuk anak muda Bandung dengan konsep Mager yang seru! Lari, badminton, sepak bola, basket, dan billiard.',
  keywords: ['lari', 'olahraga', 'komunitas', 'Bandung', 'badminton', 'sepak bola', 'basket', 'billiard'],
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Sobat Sabtu" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}