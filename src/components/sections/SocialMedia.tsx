'use client';

import { Icon } from '@iconify/react';
import { Section } from '../ui/Section';

// Data sosial media Sobat Sabtu
const socialMedia = [
  {
    name: 'Instagram',
    url: process.env.NEXT_PUBLIC_INSTAGRAM,
    icon: 'mdi:instagram',
    color: '#E4405F', // Instagram pink
    action: 'Follow Us',
    description: 'Daily updates and community moments',
  },
  {
    name: 'TikTok',
    url: process.env.NEXT_PUBLIC_TIKTOK,
    icon: 'ic:outline-tiktok',
    color: '#000000', // TikTok black
    action: 'Watch Us',
    description: 'Fun videos and challenges',
  },
  {
    name: 'Twitter',
    url: process.env.NEXT_PUBLIC_TWITTER,
    icon: 'mdi:twitter',
    color: '#1DA1F2', // Twitter blue
    action: 'Tweet Us',
    description: 'Latest news and announcements',
  },
  {
    name: 'Strava',
    url: process.env.NEXT_PUBLIC_STRAVA,
    icon: 'mdi:strava',
    color: '#FC4C02', // Strava orange
    action: 'Join Us',
    description: 'Track your runs and challenge friends',
  },
  {
    name: 'Spotify',
    url: process.env.NEXT_PUBLIC_SPOTIFY,
    icon: 'mdi:spotify',
    color: '#1DB954', // Spotify green
    action: "Let's Listen",
    description: 'Running playlists and podcasts',
  },
  {
    name: 'Email',
    url: process.env.NEXT_PUBLIC_EMAIL,
    icon: 'mdi:email',
    color: '#000000', // Threads black
    action: 'Contact Us',
    description: 'Get in touch directly with us',
  },
];

export const SocialMedia = () => {
  return (
    <Section id="social" className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-16">
        <div className="mb-8 lg:mb-12 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl">
            Stay Connected
          </h2>
          <p className="text-base sm:text-xl text-muted md:justify-self-end md:text-right max-w-md">
            Follow our journey across all platforms and be part of the Sobat Sabtu community
          </p>
        </div>

        {/* Daftar kanal: baris bergaris, satu tautan per baris */}
        <ul className="border-t-2 border-ink grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-12">
          {socialMedia.map((social) => (
            <li key={social.name} className="border-b border-rule">
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-5 hover:bg-paper-2 active:bg-paper-3 transition-colors duration-150 -mx-2 px-2"
              >
                <Icon icon={social.icon} width="28" height="28" className="shrink-0 text-ink-2" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-extrabold uppercase text-2xl leading-none">{social.name}</span>
                  <span className="block mt-1 text-sm text-muted">{social.description}</span>
                </span>
                <span className="shrink-0 text-sm font-medium underline underline-offset-4 decoration-1 group-hover:text-accent dark:group-hover:text-sobat-yellow">
                  {social.action}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};
