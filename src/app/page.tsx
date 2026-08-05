import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Activities } from '@/components/sections/Activities';
import { Collaboration } from "@/components/sections/Collaboration";
import { SocialMedia } from "@/components/sections/SocialMedia";
import { getHomepageEvents } from '@/lib/events';

export const metadata: Metadata = {
  title: 'Komunitas Lari & Olahraga Anak Muda Bandung | Sobat Sabtu',
  description:
    'Komunitas lari dan olahraga anak muda di Bandung. Lari Sabtu pagi, badminton, basket, mini soccer, dan billiard — gabung sekarang!',
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const activities = await getHomepageEvents(8);

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Activities activities={activities} />
      <Collaboration />
      <SocialMedia />
      <Footer />
    </main>
  );
}