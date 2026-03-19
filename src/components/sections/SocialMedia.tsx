'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

// Data sosial media Sobat Sabtu
const socialMedia = [
  {
    name: 'Instagram',
    url: process.env.NEXT_PUBLIC_INSTAGRAM,
    icon: 'mdi:instagram',
    color: '#E4405F', // Instagram pink
    action: 'Follow Us',
    description: 'Daily updates and community moments',
  },
  {
    name: 'TikTok',
    url: process.env.NEXT_PUBLIC_TIKTOK,
    icon: 'ic:outline-tiktok',
    color: '#000000', // TikTok black
    action: 'Watch Us',
    description: 'Fun videos and challenges',
  },
  {
    name: 'Twitter',
    url: process.env.NEXT_PUBLIC_TWITTER,
    icon: 'mdi:twitter',
    color: '#1DA1F2', // Twitter blue
    action: 'Tweet Us',
    description: 'Latest news and announcements',
  },
  {
    name: 'Strava',
    url: process.env.NEXT_PUBLIC_STRAVA,
    icon: 'mdi:strava',
    color: '#FC4C02', // Strava orange
    action: 'Join Us',
    description: 'Track your runs and challenge friends',
  },
  {
    name: 'Spotify',
    url: process.env.NEXT_PUBLIC_SPOTIFY,
    icon: 'mdi:spotify',
    color: '#1DB954', // Spotify green
    action: "Let's Listen",
    description: 'Running playlists and podcasts',
  },
  {
    name: 'Email',
    url: `mailto:${process.env.NEXT_PUBLIC_EMAIL}`,
    icon: 'mdi:email',
    color: '#000000', // Threads black
    action: 'Contact Us',
    description: 'Get in touch directly with us',
  },
];

export const SocialMedia = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Section id="social" className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0928d5 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Container fullWidth>
        <div ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className=" mb-16 lg:mb-20"
          >

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 border-l-8 border-sobat-blue pl-4"
            >
              Stay
              <span className=" text-gradient"> Connected</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400"
            >
              Follow our journey across all platforms and be part of the Sobat Sabtu community
            </motion.p>
          </motion.div>

          {/* Social Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {socialMedia.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onHoverStart={() => setHoveredId(social.name)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative block"
              >
                {/* Card dengan efek glassmorphism */}
                <div className="relative p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  {/* Hover Gradient Background */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoveredId === social.name ? 0.1 : 0,
                      scale: hoveredId === social.name ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at center, ${social.color} 0%, transparent 70%)`
                    }}
                  />

                  {/* Animated Border on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === social.name ? 1 : 0 }}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: `0 0 0 2px ${social.color}`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Header dengan Icon dan Action */}
                    <div className="flex items-start justify-between ">
                      <div className="flex items-center gap-3">
                        {/* Icon - Grayscale, berwarna saat hover */}
                        <motion.div
                          animate={{
                            filter: hoveredId === social.name
                              ? 'grayscale(0%)'
                              : 'grayscale(100%)'
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
                        >
                          <Icon
                            icon={social.icon}
                            width="28"
                            height="28"
                            style={{
                              color: hoveredId === social.name ? social.color : undefined
                            }}
                            className={hoveredId === social.name ? '' : 'text-gray-500 dark:text-gray-400'}
                          />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-lg">{social.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{social.description}</p>
                        </div>
                      </div>

                      {/* Action Badge */}
                      <motion.div
                        animate={{
                          scale: hoveredId === social.name ? 1.05 : 1,
                          backgroundColor: hoveredId === social.name ? social.color : 'transparent',
                          color: hoveredId === social.name ? 'white' : 'currentColor',
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300"
                        style={{
                          borderColor: hoveredId === social.name ? social.color : 'currentColor'
                        }}
                      >
                        {social.action}
                      </motion.div>
                    </div>

                    {/* Visit Link - Muncul di hover */}
                    {/* <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: hoveredId === social.name ? 1 : 0,
                        y: hoveredId === social.name ? 0 : 10
                      }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: social.color }}>
                          {social.username}
                        </span>
                        <motion.div
                          animate={{ x: hoveredId === social.name ? 5 : 0 }}
                          className="flex items-center gap-1 text-sm text-gray-500"
                        >
                          Visit
                          <Icon icon="lucide:arrow-right" width="14" height="14" />
                        </motion.div>
                      </div>
                    </motion.div> */}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Custom Action Teks untuk setiap platform */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
              <span className="text-sm text-gray-600 dark:text-gray-400">Platforms:</span>
              {socialMedia.map((social, index) => (
                <motion.div
                  key={social.name}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                >
                  <Icon
                    icon={social.icon}
                    width="14"
                    height="14"
                    style={{ color: social.color }}
                  />
                  <span className="text-xs font-medium">{social.action}</span>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </Container>
    </Section>
  );
};