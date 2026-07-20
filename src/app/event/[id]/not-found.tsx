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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The event you are looking for does not exist.
          </p>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
