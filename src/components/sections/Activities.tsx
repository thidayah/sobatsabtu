'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import Link from 'next/link';
import { ActivityCard } from "../ui/ActivityCard";

// Data activities - dalam format 9:16 image_url/flyer
const activitiesMock = [
  {
    id: 'asmr-1',
    title: 'ASMR #42 - Bandung City Run',
    type: 'ASMR',
    date: 'Saturday, 24 May 2025',
    time: '06:30 WIB',
    location: 'Start: Bandung City Hall',
    image_url: 'https://images.unsplash.com/photo-1638886050954-dbd7208412c0?q=80&w=987&auto=format&fit=crop',
    participants: 48,
    maxParticipants: 60,
    isOpen: false,
  },
  {
    id: 'night-run-12',
    title: 'Night Run #12 - Lights & Night',
    type: 'Night Run',
    date: 'Tuesday, 20 May 2025',
    time: '19:30 WIB',
    location: 'Start: Gasibu Field',
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=987&auto=format&fit=crop',
    participants: 32,
    maxParticipants: 50,
    isOpen: false,
  },
  {
    id: 'exercise-5',
    title: 'Exercise Session #5 - Core Strength',
    type: 'Exercise Session',
    date: 'Thursday, 22 May 2025',
    time: '19:00 WIB',
    location: 'Taman Lalu Lintas',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=987&auto=format&fit=crop',
    participants: 18,
    maxParticipants: 30,
    isOpen: true,
  },
  {
    id: 'run-wood-8',
    title: 'Run in the Wood #8 - Pine Forest',
    type: 'Run in the Wood',
    date: 'Sunday, 1 June 2025',
    time: '06:00 WIB',
    location: 'Start: Curug Malela',
    image_url: 'https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?q=80&w=987&auto=format&fit=crop',
    participants: 24,
    maxParticipants: 35,
    isOpen: false,
  },
  {
    id: 'nepak-3',
    title: 'Sobat Nepak #3 - Badminton Night',
    type: 'Sobat Nepak',
    date: 'Friday, 23 May 2025',
    time: '19:00 WIB',
    location: 'GOR Badminton Buah Batu',
    image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=987&auto=format&fit=crop',
    participants: 12,
    maxParticipants: 20,
    isOpen: false,
  },
  {
    id: 'nyepak-2',
    title: 'Sobat Nyepak #2 - Futsal Fun',
    type: 'Sobat Nyepak',
    date: 'Saturday, 24 May 2025',
    time: '16:00 WIB',
    location: 'Lapangan Futsal Saparua',
    image_url: 'https://images.unsplash.com/photo-1575361204480-a3d5b3544f2b?q=80&w=987&auto=format&fit=crop',
    participants: 14,
    maxParticipants: 20,
    isOpen: true,
  },
  {
    id: 'hoops-1',
    title: 'Sobat Hoops #1 - Basketball Session',
    type: 'Sobat Hoops',
    date: 'Sunday, 25 May 2025',
    time: '08:00 WIB',
    location: 'Lapangan Basket Gasibu',
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=989&auto=format&fit=crop',
    participants: 10,
    maxParticipants: 20,
    isOpen: false,
  },
  {
    id: 'nyodok-4',
    title: 'Sobat Nyodok #4 - Billiard Night',
    type: 'Sobat Nyodok',
    date: 'Monday, 26 May 2025',
    time: '19:00 WIB',
    location: 'Rocket Billiard Dago',
    image_url: 'https://images.unsplash.com/photo-1623182081166-9e5b5e5b5b5b?q=80&w=987&auto=format&fit=crop',
    participants: 8,
    maxParticipants: 16,
    isOpen: false,
  }
];

// Categories for filtering
// const categories = ['All', 'Running Series', 'Multi-Sport Series'];

export const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          '/api/events?page=1&limit=8&sort_by=date&sort_order=desc'
        );
        const result = await response.json();

        if (result.success) {
          setActivities(result.data.items || []);
        } else {
          console.error('Failed to fetch activities:', result.message);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // const filteredActivities = activitiesMock;
  const filteredActivities = activities;
  // const filteredActivities = selectedCategory === 'All'
  //   ? activities
  //   : activities.filter(a => a.category === selectedCategory);


  // Check scroll position for arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();

      // Check after activities change
      setTimeout(checkScroll, 100);

      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [filteredActivities]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Width of one card + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Section id="activities" className="bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Container fullWidth>
        <div ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 pt-16 md:pt-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 lg:mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-5xl lg:text-7xl font-bold mb-4 border-l-4 md:border-l-8 border-sobat-blue pl-2 md:pl-4"
            >
              Upcoming <span className="text-gradient">Activities &nbsp;</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs sm:text-xl text-gray-600 dark:text-gray-400"
            >
              Don't miss out on the exciting and challenging activities we'll be hosting
            </motion.p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center flex-col gap-4 items-center py-20">
              <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin" />
              <span className=" text-xs md:text-base">Loading ...</span>
            </div>
          )}

          {/* No Activities State */}
          {!loading && filteredActivities.length === 0 && (
            <div className="text-center py-20">
              <Icon icon="mdi:calendar-blank" width="64" height="64" className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Upcoming Activities
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Check back soon for new events and activities!
              </p>
            </div>
          )}

          {/* Category Filter */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-8 lg:mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                    ? 'bg-sobat-blue text-white dark:bg-sobat-yellow dark:text-black shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div> */}

          {/* Horizontal Scroll Section */}
          {!loading && filteredActivities.length > 0 && (
            <div className="relative">
              {/* Left Arrow */}
              {showLeftArrow && (
                <ArrowButton
                  name="left"
                  onClick={() => scroll('left')}
                />
              )}

              {/* Right Arrow */}
              {showRightArrow && (
                <ArrowButton
                  name="right"
                  onClick={() => scroll('right')}
                />
              )}

              {/* Gradient Overlays */}
              {showLeftArrow && (
                <div className="absolute -left-5 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50/50 dark:from-gray-900 to-transparent z-10 pointer-events-none hidden lg:block" />
              )}
              {showRightArrow && (
                <div className="absolute -right-5 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50/50 dark:from-gray-900 to-transparent z-10 pointer-events-none hidden lg:block" />
              )}

              {/* Horizontal Scroll Container */}
              <motion.div
                ref={scrollContainerRef}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex overflow-x-auto gap-3 md:gap-6 pb-12 px-4 -mx-4 no-scrollbar snap-x"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {filteredActivities.map((activity: any, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    onHoverStart={() => setHoveredCard(activity.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                  >
                    <ActivityCard activity={activity} isHovered={hoveredCard === activity.id} />
                  </motion.div>
                ))}

                {/* View All Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * filteredActivities.length }}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                >
                  <Link href="/activities">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon icon="lucide:arrow-right" width="32" height="32" className="text-gray-900 dark:text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">View All</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {filteredActivities.length} activities available
                      </p>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

const ArrowButton = ({ name, onClick }: { name: string; onClick: () => void }) => {
  const isLeft: boolean = name === 'left'
  return (
    <motion.button
      initial={{ opacity: 0, x: isLeft ? - 20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? - 20 : 20 }}
      onClick={onClick}
      className={` ${isLeft ? 'left-0 -ml-6' : 'right-0 -mr-6'} absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-110 transition-all duration-300 hidden lg:flex`}
      aria-label="Scroll left"
    >
      <Icon icon={`lucide:chevron-${name}`} width="24" height="24" />
    </motion.button>
  )
}