'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { ThemeToggle } from "../ui/ThemeToggle";

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const BlueLogo = '/icons/blue.svg'
  const WhiteLogo = '/icons/white.svg'

  // Deteksi theme dari localStorage atau system preference
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDarkMode = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
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
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-white dark:bg-black shadow-lg dark:shadow-white/5 py-4 md:py-5' 
          : 'bg-transparent py-8 md:py-10'
      }`}
    >
      <div className=" mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Sobat Sabtu */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              {/* Logo circle - warna berubah sesuai background */}
              {/* <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-500 ${
                scrolled 
                  ? 'bg-sobat-blue dark:bg-white' 
                  : 'bg-sobat-blue dark:bg-white'
              }`} />
              <div>
                <span className={`block text-xl md:text-2xl font-bold leading-tight transition-colors duration-500 ${
                  scrolled 
                    ? 'text-sobat-blue dark:text-white' 
                    : 'text-sobat-blue dark:text-white'
                }`}>
                  SOBAT
                </span>
                <span className={`block text-xl md:text-2xl font-bold leading-tight transition-colors duration-500 ${
                  scrolled 
                    ? 'text-sobat-blue dark:text-white' 
                    : 'text-sobat-blue dark:text-white'
                }`}>
                  SABTU
                </span>
              </div> */}
              <img src={isDark ? WhiteLogo : BlueLogo} className=" w-40 transition-all duration-500" alt="Blue Logo" />
            </motion.div>
          </Link>

          {/* Theme Toggle dengan Iconify */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-500 cursor-pointer ${
              scrolled 
                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' 
                : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Icon icon="lucide:sun" width="24" height="24" className="text-white" />
            ) : (
              <Icon icon="lucide:moon" width="24" height="24" className="text-gray-500" />
            )}
          </motion.button>

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </motion.nav>
  );
};