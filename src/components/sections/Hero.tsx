'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';

// Data untuk slides
type Slide = {
  id: number;
  type: 'image';
  url: string;
  title: string;
  description: string;
  // Opsional: jadikan sebagian teks deskripsi sebagai tautan
  link?: { text: string; href: string };
};

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP ?? 'https://wa.me/6287825801252';

const slides: Slide[] = [
  // {
  //   id: 1,
  //   type: 'image',
  //   url: 'https://images.unsplash.com/photo-1590333748338-d629e4564ad9?q=80&w=2070&auto=format&fit=crop', // Lari di kota
  //   title: 'A Saturday Morning Run',
  //   description: 'Start your weekend with positive energy together with the community'
  // },
  // {
  //   id: 2,
  //   type: 'image',
  //   url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop', // Exercise session
  //   title: 'Exercise Session',
  //   description: 'Strength training and functional fitness for all levels'
  // },
  // {
  //   id: 3,
  //   type: 'image',
  //   url: 'https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?q=80&w=2070&auto=format&fit=crop', // Trail running
  //   title: 'Run in the Wood',
  //   description: 'Explore the natural beauty of Bandung with Sobat Sabtu'
  // },
  // {
  //   id: 4,
  //   type: 'image',
  //   url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2070&auto=format&fit=crop', // Badminton
  //   title: 'Multi-Sport Fun',
  //   description: 'Badminton, mini soccer, basketball, billiard - choose your activity!'
  // },
  {
    id: 11,
    type: 'image',
    url: "https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/banners/bormar.jpg",
    title: 'Road to Bormar 2026',
    description: 'Interested in joining? Contact us immediately.',
    link: { text: 'Contact us', href: WHATSAPP_URL }
  },
  {
    id: 1,
    type: 'image',
    url: "https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/banners/keptbdg.jpg",
    title: 'Hello Kept',
    description: 'Saturday Morning Run sponsored by Kept — gear up, show up, and run together'
  },
  {
    id: 2,
    type: 'image',
    url: "https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/banners/estafet.jpg",
    title: 'Estafet Arcamanik',
    description: 'This year`s special jersey from Dyno for the Arcamanik relay'
  },
  // {
  //   id: 3,
  //   type: 'image',
  //   url: "https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/banners/ritw.jpg",
  //   title: 'Run in the Wood',
  //   description: 'This isn`t just a run, this is patience in motion, this is Sahur on the Trail'
  // },
  {
    id: 4,
    type: 'image',
    url: "https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/banners/syd.jpg",
    title: 'Share Your Distance',
    description: 'It`s not about who is the fastest, but about running together, encouraging each other and sharing the distance.'
  },
  {
    id: 5,
    type: 'image',
    url: "https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/banners/huricane.jpg",
    title: 'Huricane Collaborate',
    description: 'Weekend miles hit diffrent when your running with the right crew and the right gear'
  }
];

// Render deskripsi slide. Jika slide punya `link`, teks tersebut dijadikan tautan
// yang membuka tab baru (mis. langsung ke WhatsApp).
const renderDescription = (slide: Slide) => {
  if (!slide.link) return slide.description;

  const [before, after] = slide.description.split(slide.link.text);

  return (
    <>
      {before}
      <a
        href={slide.link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-semibold underline underline-offset-4 hover:text-sobat-yellow transition-colors"
      >
        {slide.link.text}
      </a>
      {after}
    </>
  );
};

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const scrollToActivities = () => {
    const activitiesSection = document.getElementById('activities');
    if (activitiesSection) {
      activitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].url}
            alt={slides[currentSlide].title}
            fill
            priority={currentSlide === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          {/* <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80" /> */}
        </motion.div>
      </AnimatePresence>

      {/* Content: marquee hero, judul slide besar rata kiri di bawah, kontrol di kanan */}
      <div className="relative mx-auto max-w-[1440px] min-h-svh flex flex-col justify-end px-4 sm:px-6 lg:px-16 pt-32 pb-10 md:pb-16">
        {/* Visually hidden h1 with primary keyword (SEO + a11y, no visual change) */}
        <h1 className="sr-only">
          Komunitas Lari &amp; Olahraga Anak Muda Bandung
        </h1>

        {/* Slide Title */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-7xl lg:text-8xl xl:text-[8rem] text-white max-w-[14ch]"
          >
            {slides[currentSlide].title}
          </motion.h2>
        </AnimatePresence>

        <div className="mt-6 md:mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-base sm:text-xl text-white max-w-xl"
              >
                {renderDescription(slides[currentSlide])}
              </motion.p>
            </AnimatePresence>

            {/* CTA Button */}
            <button
              onClick={scrollToActivities}
              className="btn btn--primary mt-6"
            >
              Let&apos;s Explore
              <Icon icon="lucide:chevron-down" width="20" height="20" aria-hidden="true" />
            </button>
          </div>

          {/* Slide Controls */}
          <div className="flex flex-row items-center gap-4">
              {/* Indicators */}
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsAutoPlay(false);
                    }}
                    aria-label={`Slide ${index + 1}`}
                    aria-current={index === currentSlide}
                    className={`h-1 transition-colors duration-300 ${index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-4 bg-white/50 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>

              {/* Play/Pause */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                aria-label={isAutoPlay ? 'Pause slideshow' : 'Play slideshow'}
                className="p-2 bg-black/50 hover:bg-black/70 active:bg-black/80 transition-colors"
              >
                {isAutoPlay ? (
                  <Icon icon="lucide:pause" width="16" height="16" className="text-white" />
                ) : (
                  <Icon icon="lucide:play" width="16" height="16" className="text-white" />
                )}
              </button>
          </div>
        </div>
      </div>
    </section>
  );
};