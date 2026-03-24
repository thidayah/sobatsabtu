'use client';

import { Icon } from '@iconify/react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    pages.push(1);
    
    if (page > 3) {
      pages.push('...');
    }
    
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (page < totalPages - 2) {
      pages.push('...');
    }
    
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="w-8 h-8 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon icon="lucide:chevron-left" width="18" height="18" />
      </button>

      {getPageNumbers().map((p, idx) => (
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm font-medium transition-colors ${
              page === p
                ? 'bg-sobat-blue text-white'
                : 'border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {p}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="w-8 h-8 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon icon="lucide:chevron-right" width="18" height="18" />
      </button>
    </div>
  );
};