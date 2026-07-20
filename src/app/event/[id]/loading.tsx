import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <Container fullWidth>
        <div className="pt-28 md:pt-40 px-4 sm:px-6 lg:px-8 pb-16 flex flex-col gap-4 justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
          <span className=" text-xs md:text-base">Loading ...</span>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
