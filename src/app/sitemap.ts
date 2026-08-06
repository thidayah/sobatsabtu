import type { MetadataRoute } from 'next';
import { getAllEvents } from '@/lib/events';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getAllEvents();

  const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE_URL}/event/${event.slug}`,
    lastModified: event.updated_at ? new Date(event.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...eventUrls,
  ];
}
