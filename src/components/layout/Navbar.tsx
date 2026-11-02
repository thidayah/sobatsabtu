'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
// import { ThemeToggle } from "../ui/ThemeToggle";

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const BlueLogo = '/icons/blue.svg'
  const WhiteLogo = '/icons/white.svg'

  // Deteksi theme dari localStorage atau system preference
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDarkMode = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode); // eslint-disable-line react-hooks/set-state-in-effect -- theme detection is client-only; runs in effect (localStorage/window unavailable during SSR)
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  // Deteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-[background-color,box-shadow,padding] duration-500 ease-out ${
        scrolled 
          ? 'bg-paper border-b border-ink py-4 md:py-5' 
          : 'bg-transparent py-8 md:py-10'
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center">
          {/* Logo Sobat Sabtu */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              {isDark ? (
                <Image src={WhiteLogo} width={1321} height={541} alt="Sobat Sabtu Logo" className="w-24 lg:w-40 h-auto" priority />
              ) : (
                <Image src={BlueLogo} width={1598} height={679} alt="Sobat Sabtu Logo" className="w-24 lg:w-40 h-auto" priority />
              )}
            </motion.div>
          </Link>

          {/* Theme Toggle dengan Iconify */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={toggleTheme}
            className="p-3 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Icon icon="lucide:sun" width="20" height="20" className="text-white" />
            ) : (
              <Icon icon="lucide:moon" width="20" height="20" className="text-gray-500" />
            )}
          </motion.button>

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </motion.nav>
  );
};