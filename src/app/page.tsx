import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Activities } from '@/components/sections/Activities';
import { Collaboration } from "@/components/sections/Collaboration";
import { SocialMedia } from "@/components/sections/SocialMedia";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Activities />
      <Collaboration />
      <SocialMedia />
      <Footer />
    </main>
  );
}