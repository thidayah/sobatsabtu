'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const ButtonOld = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-white/90 hover:shadow-lg hover:shadow-white/25',
    secondary: 'bg-gradient-to-r from-[#0928d5] to-[#4a6cf7] text-white hover:shadow-lg hover:shadow-blue-500/25',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
    ghost: 'text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    //@ts-ignore
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};