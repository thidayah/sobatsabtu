'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Icon } from '@iconify/react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

// Data partner logos (ganti dengan logo asli nanti)
const partners = [
  { id: 1, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', category: 'sport' },
  { id: 2, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', category: 'sport' },
  { id: 3, name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg', category: 'sport' },
  { id: 4, name: 'The North Face', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/The_North_Face_logo.svg', category: 'outdoor' },
  { id: 5, name: 'Salomon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Salomon_Logo.svg', category: 'outdoor' },
  { id: 6, name: 'Garmin', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Garmin_logo.svg', category: 'tech' },
  { id: 7, name: 'Suunto', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Suunto_logo.svg', category: 'tech' },
  { id: 8, name: 'Red Bull', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Red_Bull_logo.svg', category: 'energy' },
  { id: 9, name: 'Pocari Sweat', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Pocari_Sweat_logo.svg', category: 'beverage' },
  { id: 10, name: 'Hydro Coco', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Hydro_Coco_logo.svg', category: 'beverage' },
  { id: 11, name: 'Decathlon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Decathlon_logo.svg', category: 'retail' },
  { id: 12, name: 'REI', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/REI_logo.svg', category: 'retail' },
];

// Background activity images untuk collage
const backgroundImages = [
  'https://images.unsplash.com/photo-1638886050954-dbd7208412c0?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1644293230796-739c37cf4ffd?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1705468616275-616b7c01d317?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1705468616275-616b7c01d317?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1644293230796-739c37cf4ffd?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1638886050954-dbd7208412c0?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1705468616275-616b7c01d317?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616279969856-759f316a5ac1?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1705468616275-616b7c01d317?q=80&w=2070&auto=format&fit=crop',
];

export const Collaboration = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <Section id="collaboration" className="relative overflow-hidden bg-black">
      {/* Background Image Collage dengan Gradasi */}
      <div className="absolute inset-0">
        {/* Grid of background images */}
        <div className="absolute inset-0 grid grid-cols-6 gap-0.5 opacity-30">
          {backgroundImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="relative w-full h-full min-h-[25vh] overflow-hidden"
            >
              <img
                src={img}
                alt="Activity background"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Multiple Gradient Layers untuk efek unik */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/10" /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-sobat-blue via-transparent to-sobat-yellow mix-blend-overlay" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/70" />

        {/* Animated gradient orbs */}
        {/* <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-sobat-blue rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-sobat-yellow rounded-full blur-3xl"
        /> */}
      </div>

      <Container fullWidth>
        <div ref={sectionRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 lg:py-24 ">
          {/* Header */}
          <div className=" flex items-center justify-between mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className=" "
            >

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 border-l-8 border-sobat-blue pl-4"
              >
                Trusted By
                <span className=" text-gradient"> The Best</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg sm:text-xl text-white/70"
              >
                We're proud to collaborate with leading brands that share our passion
                for sports and community building.
              </motion.p>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className=" text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:shadow-xl hover:shadow-white/25 transition-all duration-300 inline-flex items-center gap-2 group cursor-pointer"
              >
                <Icon icon="mdi:handshake" width="20" height="20" className="group-hover:rotate-12 transition-transform" />
                Become a Partner
              </motion.button>
            </motion.div>
          </div>

          {/* Logo Grid - Unik Layout */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-white/5 rounded-full z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-white/10 rounded-full z-0" />

            {/* Floating Logo Circles */}
            <div className="relative grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-6 lg:gap-8">
              {partners.map((partner, index) => {
                // Hitung posisi untuk efek floating yang berbeda-beda
                const delay = index * 0.1;
                const yOffset = (index % 3) * 10 - 10;
                const xOffset = (index % 4) * 8 - 12;
                const rotateOffset = (index % 5) * 5 - 10;

                return (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + delay,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: rotateOffset,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="relative group"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sobat-blue/50 to-sobat-yellow/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Logo container */}
                    <div className="relative aspect-square bg-white/10 backdrop-blur-lg border border-white/20 p-4 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                      {/* Animated border */}
                      <div className="absolute inset-0  overflow-hidden">
                        <motion.div
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 3,
                            delay: index * 0.2,
                            repeat: Infinity,
                            repeatDelay: 5,
                          }}
                          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                        />
                      </div>

                      {/* Placeholder logo - ganti dengan gambar asli */}
                      <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white/80 text-xs text-center font-medium px-2">
                          {partner.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};