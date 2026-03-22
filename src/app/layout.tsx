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

export const metadata: Metadata = {
  title: 'Sobat Sabtu - Komunitas Olahraga Anak Muda Bandung',
  description: 'Komunitas olahraga untuk anak muda Bandung dengan konsep Mager yang seru! Lari, badminton, futsal, basket, dan billiard.',
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