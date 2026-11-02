
'use client';

import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';
import '@/lib/iconify-offline';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Hormati setting "reduce motion" OS untuk semua animasi framer-motion */}
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}