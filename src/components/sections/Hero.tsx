'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Container } from '../ui/Container';

// Data untuk slides
const slides = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1590333748338-d629e4564ad9?q=80&w=2070&auto=format&fit=crop', // Lari di kota
    title: 'A Saturday Morning Run',
    description: 'Start your weekend with positive energy together with the community'
  },
  {
    id: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop', // Exercise session
    title: 'Exercise Session',
    description: 'Strength training and functional fitness for all levels'
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?q=80&w=2070&auto=format&fit=crop', // Trail running
    title: 'Run in the Wood',
    description: 'Explore the natural beauty of Bandung with Sobat Sabtu'
  },
  {
    id: 4,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2070&auto=format&fit=crop', // Badminton
    title: 'Multi-Sport Fun',
    description: 'Badminton, mini soccer, basketball, billiard - choose your activity!'
  }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const scrollToActivities = () => {
    const activitiesSection = document.getElementById('activities');
    if (activitiesSection) {
      activitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <Container fullWidth>
        <div className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 md:mb-6"
          >
            <span className="px-4 py-2 text-[10px] md:text-sm italic font-medium bg-white/10 text-white/90 backdrop-blur rounded-full border border-white/20">
              #untalentedrunners
            </span>
          </motion.div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white max-w-7xl mx-auto"
            >
              {slides[currentSlide].title}
            </motion.h1>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 md:mt-6 text-xs sm:text-xl text-white/80 max-w-3xl mx-auto"
            >
              {slides[currentSlide].description}
            </motion.p>
          </AnimatePresence>

          {/* Tagline */}
          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-2xl sm:text-3xl font-light text-white/60 max-w-3xl mx-auto"
          >
            Turn Your Weekend Laziness Into Adventure
          </motion.p> */}

          {/* Slide Controls */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-20">
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={scrollToActivities}
                className="rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center hover:shadow-lg hover:shadow-white/25 px-4 md:px-6 py-2 md:py-3 text-xs md:text-base text-white hover:bg-white/20 group cursor-pointer animate-bounce"
              >
                Let's Explore
                <Icon icon="lucide:chevron-down" width="20" height="20" className="ml-2 " />
              </button>
            </motion.div>
            <div className=" flex flex-row items-center gap-4">
              {/* Indicators */}
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsAutoPlay(false);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-4 bg-white/50 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>

              {/* Play/Pause */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
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
      </Container>
    </section>
  );
};