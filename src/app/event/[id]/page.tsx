import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventByIdentifier } from '@/lib/events';
import { isEventPast } from '@/lib/utils';
import { JsonLd } from '@/components/ui/JsonLd';
import { EventDetailClient } from './EventDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

interface EventPageParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: EventPageParams): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventByIdentifier(id);

  if (!event) {
    return { title: 'Event Not Found - Sobat Sabtu' };
  }

  const title = `${event.name} - Sobat Sabtu`;
  const description = event.descriptions || `Join ${event.name} with Sobat Sabtu`;

  return {
    title,
    description,
    alternates: {
      canonical: `/event/${event.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/event/${event.slug}`,
      images: event.image_url ? [{ url: event.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: event.image_url ? [event.image_url] : undefined,
    },
  };
}

export default async function EventDetailPage({ params, searchParams }: EventPageParams) {
  const { id } = await params;
  const { tab } = await searchParams;

  const eventData = await getEventByIdentifier(id);

  if (!eventData) {
    notFound();
  }

  const initialTab = tab === 'registration' || tab === 'participants'
    ? tab
    : isEventPast(eventData.date, eventData.time) ? 'participants' : 'registration';

  const eventImage = eventData.image_url?.startsWith('/')
    ? `${BASE_URL}${eventData.image_url}`
    : eventData.image_url || undefined;

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: eventData.name,
    description: eventData.descriptions || undefined,
    startDate: eventData.time ? `${eventData.date}T${eventData.time}` : eventData.date,
    image: eventImage,
    url: `${BASE_URL}/event/${eventData.slug}`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: eventData.location,
      url: eventData.location_url || undefined,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Sobat Sabtu',
      url: BASE_URL,
    },
    maximumAttendeeCapacity: eventData.max_participants > 0
      ? eventData.max_participants
      : undefined,
  };

  return (
    <>
      <JsonLd data={eventSchema} />
      <EventDetailClient eventData={eventData} initialTab={initialTab} />
    </>
  );
}
