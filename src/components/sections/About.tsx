'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Icon } from '@iconify/react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

const features = [
  {
    icon: 'mdi:calendar',
    title: 'Since 2019',
    description: 'Building a healthy community in Bandung for over 5 years'
  },
  {
    icon: 'mdi:heart-outline',
    title: 'Mager Concept',
    description: 'We embrace laziness and transform it into positive energy'
  },
  {
    icon: 'mdi:flash',
    title: '8+ Activities',
    description: 'From running to basketball, there\'s something for everyone'
  },
  {
    icon: 'mdi:users',
    title: '1000+ Members',
    description: 'Join our growing family of young sports enthusiasts'
  }
];

const galleries = [
  {
    // video: 'https://cdn.jumpshare.com/preview/rDchYgez1y5h3I4loVv20uhigJdZ-ks0B8DeEJ57D33zOr2n0cXOyrAbHADeRfU3tirdI8hEtNfBJY8wf1YP4EbnU8lh79r2WQEo9dxsphX8Smj1CWdc46BKRwc-sFl0kLC1Er44IWfLONBObgK5OG6yjbN-I2pg_cnoHs_AmgI.mp4', // Running video
    video: '/videos/asmr.MP4', // Running video
    image: 'https://i.ibb.co.com/gMcTdFFs/IMG-1696.jpg',
    title: 'Casual city run every Saturday morning',
    type: 'video'
  },
  {
    // video: 'https://cdn.jumpshare.com/preview/IrXY0I5lb_xxk2joZ14qfHHgjdfd2rY1DkcPB_GWBoftXi0QRoxs9KE-MrAvqGwy2L5MVocvuGkD62JLZF7InE7ZDyNr3NAHIAPLg2yNnixigNfcDo5V3o2oyzOpVPo0kLC1Er44IWfLONBObgK5OG6yjbN-I2pg_cnoHs_AmgI.mp4', // Basketball video
    video: '/videos/hoops.MP4', // Basketball video
    image: 'https://i.ibb.co.com/Nn7CdKgV/IMG-1698.jpg',
    title: 'Basketball matches by Sobat Hoops',
    type: 'video'
  },
  {
    // video: 'https://cdn.jumpshare.com/preview/yLRfBlybHAp_grUSLc6n90-8LuzLB_wYC-wwIXnsOTNAujVbE2CCYoTlvChK6IduYyxN4lBSuFYTq2X0_pbZ-fSsEd6TXKOTu7cEh0ZHuxitLGRBhR8-kGlGmKW3RHzByLO-TVT5IcjHLn7SjsAHsm6yjbN-I2pg_cnoHs_AmgI.mp4', // Mini soccer video
    video: '/videos/nyepak.MP4', // Mini soccer video
    image: 'https://i.ibb.co.com/tThv7QXc/IMG-1693.jpg',
    title: 'Pressing, passing and then shooting',
    type: 'video'
  },
  {
    // video: 'https://cdn.jumpshare.com/preview/vurX5MJiR8lAhRCm0oM5sAnrFdJrpWxUI4wKVtdwhGsS-ElqYCTlp5508Gaz2e1u6Un6zm4-2Zm4kuPwvs2vwZRCeGeIwAj4WQO9KK2YHoE', // Night run video
    video: '/videos/nightrun.MP4', // Night run video
    image: 'https://i.ibb.co.com/WvGhd98L/IMG-1697.jpg',
    title: 'Evening runs exploring Bandung at night',
    type: 'video'
  }
];

export const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <Section id="about" className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-sobat-blue/5 to-sobat-yellow/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-sobat-yellow/5 to-sobat-blue/5 rounded-full blur-3xl"
        />
      </div>

      <Container fullWidth>
        <div ref={containerRef} className="relative px-4 sm:px-6 lg:px-8">
          {/* Story Section dengan Image */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-24 items-center mb-4 md:mb-24 ">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            // className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {/* <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="inline-block px-4 py-2 text-sm font-medium bg-sobat-blue/10 dark:bg-sobat-yellow/10 text-sobat-blue dark:text-sobat-yellow rounded-full border border-sobat-blue/20 dark:border-sobat-yellow/20 mb-6"
                >
                  <Icon icon="mdi:run-fast" className="inline w-4 h-4 mr-2" />
                  All About Us
                </motion.span> */}

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 md:mb-12"
                >
                  <span className=" bg-black text-white dark:bg-white dark:text-black px-4">More Than Just</span>
                  <span className="block text-gradient mt-2">A Sports Community</span>
                </motion.h2>
              </motion.div>

              <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Founded in Bandung, we transform the "Mager" (lazy mood) culture into positive energy through fun and inclusive sports activities.
                We started with a simple idea: what if we could make sports fun for young people who think
                they're "too lazy" to exercise? We package physical activities in engaging content and create
                a welcoming space for everyone, regardless of their athletic ability.
              </p>

              <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Our hashtag <span className="font-semibold text-sobat-blue dark:text-sobat-yellow italic">#pelarikonten</span> reflects our philosophy —
                we're content creators who happen to run, not runners who create content. Every run, every
                game, every session is an opportunity to create memorable moments.
              </p>

              {/* Feature Grid - Desktop (Hidden on mobile) */}
              <div className="hidden lg:grid grid-cols-2 gap-6 pt-12 ">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:scale-105 transition-transform"
                  >
                    {/* <feature.icon className="w-8 h-8 text-sobat-blue dark:text-sobat-yellow mb-3" /> */}
                    <Icon icon={feature.icon} className="text-sobat-blue dark:text-sobat-yellow mb-3 size-8" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {galleries.map((gallery, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`relative aspect-[3/4] overflow-hidden duration-300 ${index === 1 ? 'mt-8' : index === 2 ? '-mt-8' : ''}`}
                  >
                    {gallery.type === 'video' ? (
                      <video
                        src={gallery.video}
                        poster={gallery.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={gallery.image}
                        alt={gallery.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-white italic text-xs md:text-base">{gallery.title}</div>
                  </motion.div>
                ))}
              </div>

              {/* Floating Badge */}
              {/* <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 glass p-4 rounded-2xl hidden lg:block"
              >
                <p className="text-sm font-medium">Since 2019</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">5+ years of community</p>
              </motion.div> */}

              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white/70 dark:bg-black/70  p-6 rounded-xl max-w-xs hidden lg:block"
              >
                <p className="text-sm">
                  "Best decision ever! I never thought I'd enjoy running,
                  but Sobat Sabtu made it fun and social."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-sobat-blue/20 rounded-full" />
                  <div>
                    <p className="font-semibold">Pratama</p>
                    <p className="text-xs text-gray-500">Member since 2021</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
};