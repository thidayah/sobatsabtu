import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

export const Section = ({ children, className, id, fullWidth = false }: SectionProps) => {
  return (
    <section 
      id={id}
      className={cn(
        "w-full py-12 md:py-24 lg:py-32",
        className
      )}
    >
      {children}
    </section>
  );
};