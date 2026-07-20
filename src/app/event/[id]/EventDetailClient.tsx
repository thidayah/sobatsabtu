'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { RegistrationForm } from '@/components/ui/RegistrationForm';
import { ParticipantsTable } from '@/components/ui/ParticipantsTable';
import { formatDate, formatTime } from '@/lib/utils';

interface EventDetailClientProps {
  eventData: any;
  initialTab: 'registration' | 'participants';
}

export function EventDetailClient({ eventData, initialTab }: EventDetailClientProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <Container fullWidth>
        <div className="pt-28 md:pt-40 px-4 sm:px-6 lg:px-8 pb-16">
          {/* Event Header */}
          <div className="flex md:gap-12 mb-12">
            {/* Image */}
            <div className="hidden lg:block md:w-[400px] md:shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative w-full aspect-[9/16] overflow-hidden shadow-2xl "
              >
                <Image
                  src={eventData.image_url}
                  alt={eventData.name}
                  fill
                  sizes="400px"
                  priority
                  className="object-cover"
                />
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
                      onClick={() => setActiveTab(row as 'registration' | 'participants')}
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
