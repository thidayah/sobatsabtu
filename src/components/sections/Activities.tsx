'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Section } from '../ui/Section';
import { formatDate, formatTime } from '@/lib/utils';

interface Activity {
  id: string;
  name: string;
  slug: string;
  type: string;
  date: string;
  time: string;
  location: string;
  location_url?: string | null;
  image_url: string;
  descriptions?: string | null;
  is_active?: boolean;
  current_participants: number;
  max_participants: number;
  external_url?: string | null;
}

interface ActivitiesProps {
  activities: Activity[];
}

// Event tutup jika nonaktif atau tanggalnya sudah lewat (sama dengan ActivityCard)
const isEventClosed = (activity: Activity) => {
  if (!activity.is_active) return true;
  const eventDateTime = new Date(`${activity.date}T${activity.time}`);
  return eventDateTime < new Date();
};

// Tanggal dipecah agar hari dan tanggal bisa dicetak besar seperti papan jadwal
const dateParts = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  };
};

export const Activities = ({ activities }: ActivitiesProps) => {
  return (
    // scroll-mt: beri ruang untuk navbar fixed saat discroll lewat tombol "Let's Explore"
    <Section id="activities" className="bg-paper scroll-mt-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Header */}
        <div className="mb-8 lg:mb-12 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl">
            Upcoming Activities
          </h2>
          <p className="text-base sm:text-xl text-muted md:justify-self-end md:text-right max-w-md">
            Don&apos;t miss out on the exciting and challenging activities we&apos;ll be hosting
          </p>
        </div>

        {/* No Activities State */}
        {activities.length === 0 && (
          <div className="border-t-2 border-ink py-20">
            <h3 className="text-3xl mb-2">
              No Upcoming Activities
            </h3>
            <p className="text-muted">
              Check back soon for new events and activities!
            </p>
          </div>
        )}

        {/* Index: satu baris per event, tanggal besar di kiri */}
        {activities.length > 0 && (
          <ol className="border-t-2 border-ink">
            {activities.map((activity) => (
              <EventRow key={activity.id} activity={activity} />
            ))}
          </ol>
        )}
      </div>
    </Section>
  );
};

const EventRow = ({ activity }: { activity: Activity }) => {
  const closed = isEventClosed(activity);
  const soldOut = !closed && activity.current_participants >= activity.max_participants;
  const { day, month, weekday } = dateParts(activity.date);

  return (
    <li className={`grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[7rem_5rem_minmax(0,1fr)_auto] gap-x-4 md:gap-x-8 gap-y-4 items-center py-6 border-b border-rule ${closed ? 'opacity-60' : ''}`}>
      {/* Tanggal */}
      <div className="font-display font-extrabold uppercase leading-none num">
        <span className="block text-5xl md:text-6xl text-accent dark:text-sobat-yellow">{day}</span>
        <span className="block text-lg">{weekday} {month}</span>
      </div>

      {/* Poster kecil */}
      <div className="relative hidden md:block w-20 aspect-[9/16] overflow-hidden photo">
        <Image
          src={activity.image_url}
          alt={activity.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Nama, waktu, tempat */}
      <div className="min-w-0">
        <p className="text-sm text-muted mb-1">{activity.type}</p>
        <h3 className="text-2xl md:text-4xl">{activity.name}</h3>
        <p className="mt-2 text-sm md:text-base text-ink-2">
          <span className="sr-only">{formatDate(activity.date)}, </span>
          {formatTime(activity.time)}, {activity.location}
        </p>
      </div>

      {/* Aksi */}
      <div className="col-span-2 md:col-span-1 flex gap-2 md:justify-end">
        {closed ? (
          <button disabled className="btn btn--secondary">
            <Icon icon="lucide:lock" width="16" height="16" aria-hidden="true" />
            Closed
          </button>
        ) : activity.external_url ? (
          <Link href={activity.external_url} target="_blank" className="btn btn--primary">
            <Icon icon="mdi:external-link" width="16" height="16" aria-hidden="true" />
            Visit
          </Link>
        ) : (
          <>
            {soldOut ? (
              <button disabled className="btn btn--secondary">
                <Icon icon="lucide:alert-circle" width="16" height="16" aria-hidden="true" />
                Sold Out
              </button>
            ) : (
              <Link href={`/event/${activity.slug}?tab=registration`} className="btn btn--primary">
                <Icon icon="mdi:sign-in" width="16" height="16" aria-hidden="true" />
                Register
              </Link>
            )}
            <Link href={`/event/${activity.slug}?tab=participants`} className="btn btn--secondary">
              <Icon icon="lucide:list" width="16" height="16" aria-hidden="true" />
              Participants
            </Link>
          </>
        )}
      </div>
    </li>
  );
};
