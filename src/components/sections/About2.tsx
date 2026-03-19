'use client';

import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Icon } from "@iconify/react";

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
    description: 'From running to billiard, there\'s something for everyone'
  },
  {
    icon: 'mdi:users',
    title: '1000+ Members',
    description: 'Join our growing family of young sports enthusiasts'
  }
];

export const About2 = () => {
  return (
    <Section id="about" className="relative overflow-hidden">
      <Container fullWidth>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center px-4 sm:px-6 lg:px-8">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-sobat-blue dark:text-sobat-yellow font-semibold text-lg">
              About Sobat Sabtu
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
              More Than Just
              <span className="block text-gradient">A Sports Community</span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mt-6 leading-relaxed">
              Founded in 2019 in Bandung, we started with a simple idea:
              what if we could make sports fun for young people who think
              they're "too lazy" to exercise? We package physical activities
              in engaging content and create a welcoming space for everyone,
              regardless of their athletic ability.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
              Our hashtags #untalentedrunners and #pelarikonten reflect our
              philosophy — you don't need to be talented to run, you just
              need to show up and have fun. We're content creators who happen
              to run, not runners who create content.
            </p>

            {/* Feature Grid - Mobile */}
            <div className="grid grid-cols-2 gap-4 mt-12 lg:hidden">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl"
                >
                  <Icon icon={feature.icon} className="w-6 h-6 text-sobat-blue dark:text-sobat-yellow mb-2" />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Placeholder - Ganti dengan gambar real nanti */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-sobat-blue to-sobat-yellow">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Sobat Sabtu</span>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl max-w-xs hidden lg:block"
            >
              <p className="text-sm">
                "Best decision ever! I never thought I'd enjoy running,
                but Sobat Sabtu made it fun and social."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-sobat-blue/20 rounded-full" />
                <div>
                  <p className="font-semibold">Sarah Wijaya</p>
                  <p className="text-xs text-gray-500">Member since 2022</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Grid - Desktop (Hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-4 gap-8 mt-24 px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:scale-105 transition-transform"
            >
              <Icon icon={feature.icon} className="w-8 h-8 text-sobat-blue dark:text-sobat-yellow mb-3" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};