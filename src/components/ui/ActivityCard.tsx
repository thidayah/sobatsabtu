import { formatDate, formatTime } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";

export const ActivityCard = ({ activity, isHovered }: { activity: any; isHovered: boolean }) => {
  // Check if event is closed (inactive or date already passed)
  const isEventClosed = () => {
    if (!activity.is_active) return true;

    // Check if event date has passed
    const eventDateTime = new Date(`${activity.date}T${activity.time}`);
    const currentDateTime = new Date();
    return eventDateTime < currentDateTime;
  };

  // Check if event is sold out
  const isSoldOut = () => {
    return activity.current_participants >= activity.max_participants;
  };

  const closed = isEventClosed();  
  const soldOut = !closed && isSoldOut();

  return (
    <div className="relative w-full group">
      {/* Card dengan rasio 9:16 (portrait) */}
      <div className="relative aspect-[9/16] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Background Image dengan overlay gradient */}
        <div className="absolute inset-0">
          <img
            src={activity.image_url}
            alt={activity.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" /> */}
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-2 text-[10px] md:text-xs font-medium rounded-full bg-sobat-blue-50 text-white shadow-lg`}>
            {activity.type}
          </span>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          {/* Icon and name */}
          <motion.div
            animate={{ y: isHovered ? -5 : 0 }}
            className="mb-4"
          >
            <h3 className="md:text-2xl font-extrabold text-white leading-tight mb-1 line-clamp-2">
              {activity.name}
            </h3>
          </motion.div>

          {/* Date, Time, Location */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className="space-y-2 mb-4 text-sm"
          >
            <div className="flex items-center gap-2 text-white/80">
              <Icon icon="lucide:calendar" width="14" height="14" />
              <span className="line-clamp-1 text-xs md:text-base">{formatDate(activity.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Icon icon="lucide:clock" width="14" height="14" />
              <span className=" text-xs md:text-base">{formatTime(activity.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Icon icon="lucide:map-pin" width="14" height="14" />
              <span className="truncate text-xs md:text-base">{activity.location}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          {closed ? (
            // Jika event closed, tampilkan satu button "Closed" disabled
            <button
              disabled
              className="w-full py-2.5 rounded-full font-medium text-sm bg-white/20 text-white/70 cursor-not-allowed"
            >
              <span className="flex text-xs md:text-base items-center justify-center gap-2">
                <Icon icon="lucide:lock" width="16" height="16" />
                Closed
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {/* Register Button - Soldout or Normal */}
              <Link href={soldOut ? '#' : `/event/${activity.slug}?tab=registration`} className="w-full col-span-2">
                <motion.button
                  whileHover={!soldOut ? { scale: 1.02 } : {}}
                  whileTap={!soldOut ? { scale: 0.98 } : {}}
                  disabled={soldOut}
                  className={`w-full py-2.5 rounded-full font-medium text-sm transition-all duration-300  ${soldOut
                      ? 'bg-red-500/50 text-white/70 cursor-not-allowed'
                      : 'bg-white text-gray-900 hover:bg-white/90 cursor-pointer'
                    }`}
                >
                  <span className="flex text-xs md:text-base items-center justify-center gap-2">
                    <Icon icon={soldOut ? "lucide:alert-circle" : "mdi:sign-in"} width="16" height="16" />
                    {soldOut ? 'Sold Out' : 'Register'}
                  </span>
                </motion.button>
              </Link>

              {/* Participants Button */}
              <Link href={`/event/${activity.slug}?tab=participants`} className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-full font-medium text-sm bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-white/30 cursor-pointer"
                >
                  <span className="flex text-xs md:text-base items-center justify-center gap-2">
                    <Icon icon="lucide:list" width="16" height="16" />
                  </span>
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};