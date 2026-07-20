import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventByIdentifier } from '@/lib/events';
import { isEventPast } from '@/lib/utils';
import { EventDetailClient } from './EventDetailClient';

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
    openGraph: {
      title,
      description,
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

  return <EventDetailClient eventData={eventData} initialTab={initialTab} />;
}
