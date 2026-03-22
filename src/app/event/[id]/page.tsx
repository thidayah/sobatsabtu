'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Mock data - nanti diganti dengan data dari backend
const eventData = {
  id: 'asmr-1',
  title: 'ASMR #42 - Bandung City Run',
  date: 'Saturday, 24 May 2025',
  time: '06:30 - 08:30 WIB',
  location: 'Start: Bandung City Hall',
  description: 'Join us for our weekly Saturday Morning Run! We\'ll start at Bandung City Hall and run through the beautiful city streets. All paces welcome, we run together and have fun!',
  poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=987&auto=format&fit=crop',
  participants: 48,
  maxParticipants: 60,
  registered: false,
  participantsList: [
    { id: 1, name: 'Budi Santoso', avatar: 'https://i.pravatar.cc/150?img=1', status: 'confirmed' },
    { id: 2, name: 'Siti Nurhaliza', avatar: 'https://i.pravatar.cc/150?img=2', status: 'confirmed' },
    { id: 3, name: 'Ahmad Fauzi', avatar: 'https://i.pravatar.cc/150?img=3', status: 'confirmed' },
    { id: 4, name: 'Dewi Lestari', avatar: 'https://i.pravatar.cc/150?img=4', status: 'confirmed' },
    { id: 5, name: 'Rizki Pratama', avatar: 'https://i.pravatar.cc/150?img=5', status: 'confirmed' },
    { id: 6, name: 'Maya Sari', avatar: 'https://i.pravatar.cc/150?img=6', status: 'pending' },
  ]
};

export default function EventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('registration');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'registration' || tab === 'participants') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <Container fullWidth>
        <div className="pt-28 md:pt-40 px-4 sm:px-6 lg:px-8 pb-16">
          {/* Event Header */}
          <div className="flex md:gap-12 mb-12">
            {/* Poster */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:block relative aspect-[9/16] max-w-[400px] mx-auto lg:mx-0 overflow-hidden shadow-2xl"
              >
                <img src={eventData.poster} alt={eventData.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            </div>

            {/* Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3 md:space-y-6"
              >
                <h1 className="text-2xl lg:text-4xl font-bold">{eventData.title}</h1>

                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <Icon icon="lucide:calendar" className="size-4 md:size-6 text-sobat-blue dark:text-sobat-yellow" />
                    <span>{eventData.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <Icon icon="lucide:clock" className="size-4 md:size-6 text-sobat-blue dark:text-sobat-yellow" />
                    <span>{eventData.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <Icon icon="lucide:map-pin" className="size-4 md:size-6 text-sobat-blue dark:text-sobat-yellow" />
                    <span>{eventData.location}</span>
                  </div>
                </div>

                <p className="text-xs md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {eventData.description}
                </p>

                {/* Participants Progress */}
                <div className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900 ">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs md:text-base font-semibold">Participants</span>
                    <span className="text-xs md:text-base text-sobat-blue dark:text-sobat-yellow font-bold">
                      {eventData.participants}/{eventData.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full h-1 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(eventData.participants / eventData.maxParticipants) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-sobat-blue to-sobat-gray rounded-full"
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
                  <div className="max-w-2xl">
                    <h2 className="text-xl md:text-2xl font-bold mb-6">Register for this event</h2>

                    {/* Search Section */}
                    <div className="mb-8 p-3 md:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <p className="text-xs md:text-base text-gray-600 dark:text-gray-400 mb-4">
                        Enter your email or instagram username to auto-fill your details if you've registered before.
                      </p>

                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="email"
                            placeholder="Type here .."
                            className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
                          />
                        </div>
                        <button
                          className="px-6 py-2 bg-sobat-blue text-white rounded-full font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <Icon icon="lucide:search" width="18" height="18" />
                          <span className=" text-sm md:text-base">Search</span>
                        </button>
                      </div>

                      {/* Contoh hasil search (nanti dari API) */}
                      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 hidden">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Icon icon="lucide:check" width="20" height="20" className="text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Member found!</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your details have been auto-filled below.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration Form */}
                    <form className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all"
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
                            <input type="radio" name="gender" value="male" className="w-4 h-4 text-sobat-blue" />
                            <span>Male</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
                            <input type="radio" name="gender" value="female" className="w-4 h-4 text-sobat-blue" />
                            <span>Female</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
                            <input type="radio" name="gender" value="other" className="w-4 h-4 text-sobat-blue" />
                            <span>Other</span>
                          </label>
                        </div>
                      </div>

                      {/* Username Instagram */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Instagram Username
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                          <input
                            type="text"
                            className="w-full px-3 py-2 pl-8 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all"
                            placeholder="username"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          We'll tag you in our event photos!
                        </p>
                      </div>

                      {/* Emergency Contact */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Emergency Contact <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            className="px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all"
                            placeholder="Contact name"
                            required
                          />
                          <input
                            type="tel"
                            className="px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all"
                            placeholder="Phone number"
                            required
                          />
                        </div>
                      </div>

                      {/* Conditions/Medical Notes */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Medical Notes / Conditions
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all resize-none"
                          placeholder="Any medical conditions, allergies, or special requirements we should know about? (Optional)"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          This information helps us ensure your safety during the activity.
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full px-8 py-4 text-sm md:text-base bg-gradient-to-r from-sobat-blue to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                          <Icon icon="mdi:paper-plane" width="20" height="20" className="group-hover:scale-110 transition-transform" />
                          Send Registration
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 hidden">
                      <h2 className="md:text-2xl font-bold">Participants ({eventData.participants})</h2>

                      {/* Search and Export */}
                      <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search participants..."
                            className=" sm:w-80 px-4 py-2 pl-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all text-sm md:text-base"
                          />
                          <Icon
                            icon="lucide:search"
                            width="18"
                            height="18"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                        <button
                          className="px-6 py-2  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2 text-sm cursor-pointer justify-center"
                        >
                          <Icon icon="lucide:search" width="18" height="18" className="md:hidden" />
                          <span className="hidden sm:inline">Search</span>
                        </button>
                      </div>
                    </div>

                    {/* Participants Table */}
                    <div className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6 ">
                      <div className="overflow-x-auto">
                        <table className=" w-full">
                          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">No</th>
                              <th className="px-6 py-4 min-w-40 text-left text-sm font-semibold text-gray-900 dark:text-white">Participant</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Username</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Registered</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                              <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 transition-colors">
                                <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">{item}</td>
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-3">
                                    {/* <img
                                      src={`https://i.pravatar.cc/150?img=${item}`}
                                      alt="Participant"
                                      className="w-8 h-8 rounded-full"
                                    /> */}
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item % 2 === 0 ? 'Budi Santoso' : 'Siti Nurhaliza'}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item % 2 === 0 ? 'Male' : 'Female'}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  @{item % 2 === 0 ? 'budisantoso' : 'sitinar'}
                                </td>
                                <td className="px-6 py-3">
                                  <div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' `}>
                                      Confirmed
                                    </span>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">2 hours ago</p>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">{eventData.participants}</span> participants
                      </p>

                      <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                          className="w-7 h-7 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled
                        >
                          <Icon icon="lucide:chevron-left" width="20" height="20" />
                        </button>

                        {/* Page Numbers */}
                        <button className="w-7 h-7 md:w-10 md:h-10 bg-sobat-blue text-white flex items-center justify-center text-sm font-medium">
                          1
                        </button>
                        <button className="w-7 h-7 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          2
                        </button>
                        <button className="w-7 h-7 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          3
                        </button>
                        <span className="text-gray-500 dark:text-gray-400">...</span>
                        <button className="w-7 h-7 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          10
                        </button>

                        {/* Next Button */}
                        <button
                          className="w-7 h-7 md:w-10 md:h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Icon icon="lucide:chevron-right" width="20" height="20" />
                        </button>
                      </div>
                    </div>

                    {/* Export Options Modal (hidden by default) */}
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Export Participants</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Choose your preferred format to export the participants list.
                        </p>
                        <div className="space-y-3 mb-6">
                          <button className="w-full p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon icon="lucide:file-text" width="20" height="20" className="text-sobat-blue" />
                              <div>
                                <p className="font-medium">CSV File</p>
                                <p className="text-sm text-gray-500">Compatible with Excel, Google Sheets</p>
                              </div>
                            </div>
                            <Icon icon="lucide:chevron-right" width="20" height="20" className="text-gray-400" />
                          </button>
                          <button className="w-full p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon icon="lucide:file-spreadsheet" width="20" height="20" className="text-green-600" />
                              <div>
                                <p className="font-medium">Excel File</p>
                                <p className="text-sm text-gray-500">.xlsx format with formatting</p>
                              </div>
                            </div>
                            <Icon icon="lucide:chevron-right" width="20" height="20" className="text-gray-400" />
                          </button>
                          <button className="w-full p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon icon="lucide:file-text" width="20" height="20" className="text-red-600" />
                              <div>
                                <p className="font-medium">PDF Document</p>
                                <p className="text-sm text-gray-500">Printable format with table styling</p>
                              </div>
                            </div>
                            <Icon icon="lucide:chevron-right" width="20" height="20" className="text-gray-400" />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Cancel
                          </button>
                          <button className="flex-1 px-3 py-2 bg-sobat-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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