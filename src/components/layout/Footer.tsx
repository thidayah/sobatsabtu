'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Container } from '../ui/Container';

const contacts = [
  { name: 'Whatsapp', icon: 'mdi:whatsapp', url: process.env.NEXT_PUBLIC_WHATSAPP, color: '#FC4C02' },
  { name: 'Email', icon: 'mdi:email-outline', url: process.env.NEXT_PUBLIC_EMAIL, color: '#E4405F' },
];

export const Footer = () => {
  const sectionRef = useRef(null);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const BlueLogo = '/icons/blue.svg'
  const WhiteLogo = '/icons/white.svg'

  // Animasi mengetik
  useEffect(() => {
    const phrases = [
      'UntalentedRunners',
      'PelariKonten',
      'MagerCulture'
    ];

    const currentPhrase = phrases[loopNum % phrases.length];
    const typingSpeed = isDeleting ? 50 : 100;

    const handleTyping = () => {
      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }

      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        return;
      }

      const nextText = isDeleting
        ? currentPhrase.substring(0, displayText.length - 1)
        : currentPhrase.substring(0, displayText.length + 1);

      setDisplayText(nextText);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum]);

  // Deteksi tema dari class HTML
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Check initial theme
    checkTheme();

    // Observer untuk perubahan class dark
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    // <footer ref={sectionRef} className="relative bg-gray-900 dark:bg-black text-white overflow-hidden">
    <footer ref={sectionRef} className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black  overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 4px 4px, var(--color-sobat-white) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Container fullWidth>
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          {/* Main Heading dengan Animasi Mengetik. Konten terlihat sejak awal (tanpa reveal yang menyembunyikan) */}
          <div className="mb-8 lg:mb-16 text-center">
            <h2 className="text-3xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-sobat-blue dark:text-white">
              <span>#</span>
              <span>{displayText}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                aria-hidden="true"
                className="inline-block w-1 h-8 sm:h-16 lg:h-24 bg-sobat-yellow ml-2 align-middle"
              />
            </h2>
          </div>

          {/* Footer Content Grid */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 md:items-end border-t pt-8 border-gray-200 dark:border-white/10">
            {/* Brand Column */}
            <div className=" max-w-xl">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
                {isDark ? (
                  <Image src={WhiteLogo} width={1321} height={541} alt="Sobat Sabtu Logo" className="w-24 lg:w-40 h-auto" />
                ) : (
                  <Image src={BlueLogo} width={1598} height={679} alt="Sobat Sabtu Logo" className="w-24 lg:w-40 h-auto" />
                )}
              </button>
              <p className="text-xs md:text-base text-gray-600 dark:text-white/60 leading-relaxed mt-2">
                Since 2019, we&apos;ve been transforming the &quot;Mager&quot; culture into positive energy through fun and inclusive sports activities in Bandung.
              </p>
            </div>

            <div>
              {/* Contact Us Icons */}
              <div className="flex gap-3 md:justify-end mb-6">
                {contacts.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-11 h-11 rounded-full bg-gray-600/90 hover:bg-gray-600 active:bg-gray-700 dark:bg-white/10 dark:hover:bg-white/20 dark:active:bg-white/30 flex items-center justify-center transition-colors duration-300"
                  >
                    <Icon icon={social.icon} width="16" height="16" className="text-white" />
                  </motion.a>
                ))}
              </div>

              {/* Bottom Bar */}
              <div className="flex flex-col md:items-end gap-2">
                {/* Copyright */}
                <div className="text-gray-600 dark:text-white/60 text-xs md:text-sm md:text-center">
                  © {new Date().getFullYear()} Sobat Sabtu. All rights reserved.
                </div>

                {/* Developed By */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-white/60 text-xs md:text-sm">Developed by</span>
                  <a
                    href="https://thidayah.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex underline-offset-2 hover:underline"
                  >
                    <span className="text-gray-800 dark:text-white/80 text-xs md:text-sm font-medium"> Runminders</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};