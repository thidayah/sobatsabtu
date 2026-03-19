'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors"
    >
      {theme === 'dark' ? (
        <Icon icon="lucide:sun" width="24" height="24" className="text-sobat-yellow" />
      ) : (
        <Icon icon="lucide:moon" width="24" height="24" className="text-sobat-blue" />
      )}
    </motion.button>
  );
};