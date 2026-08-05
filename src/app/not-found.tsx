import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <Container fullWidth>
        <div className="pt-28 md:pt-40 px-4 sm:px-6 lg:px-8 pb-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Icon icon="lucide:alert-circle" width="64" height="64" className="text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-sobat-blue rounded-full hover:bg-blue-600 transition-colors"
          >
            <Icon icon="lucide:home" width={18} height={18} />
            Back to Home
          </Link>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
