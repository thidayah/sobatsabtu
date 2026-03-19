import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Container = ({ children, className, fullWidth = false }: ContainerProps) => {
  return (
    <div className={cn(
      "w-full",
      !fullWidth && "px-4 sm:px-6 lg:px-8",
      className
    )}>
      {fullWidth ? children : (
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      )}
    </div>
  );
};