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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 ">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
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
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
                >
                  <span className=" bg-black text-white dark:bg-white dark:text-black px-4">More Than Just</span>
                  <span className="block text-gradient mt-2">A Sports Community</span>
                </motion.h2>
              </motion.div>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Founded in Bandung, we transform the "Mager" (lazy mood) culture into positive energy through fun and inclusive sports activities.
                We started with a simple idea: what if we could make sports fun for young people who think
                they're "too lazy" to exercise? We package physical activities in engaging content and create
                a welcoming space for everyone, regardless of their athletic ability.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Our hashtag <span className="font-semibold text-sobat-blue dark:text-sobat-yellow">#pelarikonten</span> reflects our philosophy —
                we're content creators who happen to run, not runners who create content. Every run, every
                game, every session is an opportunity to create memorable moments.
              </p>

              {/* Feature Grid - Desktop (Hidden on mobile) */}
              <div className="hidden lg:grid grid-cols-2 gap-6 pt-6 ">
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

              {/* <div className="flex items-center gap-4 mt-20">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sobat-blue to-sobat-yellow flex items-center justify-center"
                >
                  <Icon icon="mdi:run-fast" width="32" height="32" className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold">#untalentedrunners</h3>
                  <p className="text-gray-600 dark:text-gray-400">You don't need to be talented to run</p>
                </div>
              </div> */}
            </motion.div>

            {/* Right Column - Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Image 1 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[3/4] overflow-hidden duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1638886050954-dbd7208412c0?q=80&w=2070&auto=format&fit=crop"
                    alt="Community running"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white italic">Casual city run every Saturday morning</div>
                </motion.div>

                {/* Image 2 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[3/4] overflow-hidden duration-300 mt-8"
                >
                  <img
                    src="https://images.unsplash.com/photo-1644293230796-739c37cf4ffd?q=80&w=2070&auto=format&fit=crop"
                    alt="Trail running"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white italic">Trail running in mountains & plantations</div>
                </motion.div>

                {/* Image 3 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[3/4] overflow-hidden duration-300 -mt-8"
                >
                  <img
                    src="https://images.unsplash.com/photo-1616279969856-759f316a5ac1?q=80&w=2070&auto=format&fit=crop"
                    alt="Exercise"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white italic">Strength training every 1-2 weeks</div>
                </motion.div>

                {/* Image 4 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[3/4] overflow-hidden duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1705468616275-616b7c01d317?q=80&w=2070&auto=format&fit=crop"
                    alt="Night city run"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white italic">Evening runs exploring Bandung at night</div>
                </motion.div>
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
                // className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl max-w-xs hidden lg:block"
                className="absolute -top-6 -right-6 bg-white/70 dark:bg-black/70  p-6 rounded-xl max-w-xs hidden lg:block"
              >
                <p className="text-sm">
                  "Best decision ever! I never thought I'd enjoy running,
                  but Sobat Sabtu made it fun and social."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-sobat-blue/20 rounded-full" />
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-xs text-gray-500">Member since 2022</p>
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