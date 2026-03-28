'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { RegistrationForm } from "@/components/ui/RegistrationForm";
import { ParticipantsTable } from "@/components/ui/ParticipantsTable";
import { formatDate, formatTime } from "@/lib/utils";

// Mock data - nanti diganti dengan data dari backend
// const eventData = {
//   id: 'asmr-1',
//   title: 'ASMR #42 - Bandung City Run',
//   date: 'Saturday, 24 May 2025',
//   time: '06:30 - 08:30 WIB',
//   location: 'Start: Bandung City Hall',
//   description: 'Join us for our weekly Saturday Morning Run! We\'ll start at Bandung City Hall and run through the beautiful city streets. All paces welcome, we run together and have fun!',
//   poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=987&auto=format&fit=crop',
//   participants: 48,
//   maxParticipants: 60,
//   registered: false,
//   participantsList: [
//     { id: 1, name: 'Budi Santoso', avatar: 'https://i.pravatar.cc/150?img=1', status: 'confirmed' },
//     { id: 2, name: 'Siti Nurhaliza', avatar: 'https://i.pravatar.cc/150?img=2', status: 'confirmed' },
//     { id: 3, name: 'Ahmad Fauzi', avatar: 'https://i.pravatar.cc/150?img=3', status: 'confirmed' },
//     { id: 4, name: 'Dewi Lestari', avatar: 'https://i.pravatar.cc/150?img=4', status: 'confirmed' },
//     { id: 5, name: 'Rizki Pratama', avatar: 'https://i.pravatar.cc/150?img=5', status: 'confirmed' },
//     { id: 6, name: 'Maya Sari', avatar: 'https://i.pravatar.cc/150?img=6', status: 'pending' },
//   ]
// };

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('registration');
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'registration' || tab === 'participants') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const identifier = params.id;
        const response = await fetch(`/api/events/${identifier}`);
        const result = await response.json();

        if (result.success) {
          setEventData(result.data);
        } else {
          setError(result.message || 'Failed to fetch event');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  // Loading state
  if (loading) {
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

  // Error state
  if (error || !eventData) {
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
              {error || 'The event you are looking for does not exist.'}
            </p>
          </div>
        </Container>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <Container fullWidth>
        <div className="pt-28 md:pt-40 px-4 sm:px-6 lg:px-8 pb-16">
          {/* Event Header */}
          <div className="flex md:gap-12 mb-12">
            {/* Image */}
            <div className="">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:block relative aspect-[9/16] max-w-[400px] mx-auto lg:mx-0 overflow-hidden shadow-2xl "
              >
                <img src={eventData.image_url} alt={eventData.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            </div>

            {/* Info */}
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3 md:space-y-6"
              >
                <h1 className="text-2xl lg:text-4xl font-bold">{eventData.name}</h1>

                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <Icon icon="lucide:calendar" className="size-4 md:size-6 text-sobat-blue dark:text-sobat-yellow" />
                    <span>{formatDate(eventData.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <Icon icon="lucide:clock" className="size-4 md:size-6 text-sobat-blue dark:text-sobat-yellow" />
                    <span>{formatTime(eventData.time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <Icon icon="lucide:map-pin" className="size-4 md:size-6 text-sobat-blue dark:text-sobat-yellow" />
                    {eventData.location_url ?
                      <a href={eventData.location_url} target="_blank" className=" underline-offset-2 underline hover:opacity-85">{eventData.location}</a>
                      :
                      <span>{eventData.location}</span>
                    }
                  </div>
                </div>

                <p className="text-xs md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {eventData.descriptions}
                </p>

                {/* Participants Progress */}
                <div className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs md:text-base font-semibold">Participants</span>
                    <span className="text-xs md:text-base text-sobat-blue dark:text-sobat-yellow font-bold">
                      {eventData.current_participants}/{eventData.max_participants}
                    </span>
                  </div>
                  <div className="w-full h-1 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(eventData.current_participants / eventData.max_participants) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-sobat-blue to-sobat-yellow rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-800 my-6 md:my-12">
                <div className="flex gap-8">
                  {['registration', 'participants'].map((row, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(row)}
                      className={`pb-4 text-sm md:text-base font-medium transition-colors relative capitalize cursor-pointer ${activeTab === row
                          ? 'text-sobat-blue dark:text-sobat-yellow'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                      {row}
                      {activeTab === row && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-sobat-blue dark:bg-sobat-yellow"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'registration' ? (
                  <RegistrationForm {...eventData} />
                ) : (
                  <ParticipantsTable {...eventData} />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}