'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Section } from '../ui/Section';

const features = [
  {
    icon: 'mdi:calendar',
    title: 'Since 2019',
    description: 'Building a healthy community in Bandung for over 5 years'
  },
  {
    icon: 'mdi:heart-outline',
    title: 'Mager Concept',
    description: 'We embrace laziness and transform it into positive energy'
  },
  {
    icon: 'mdi:flash',
    title: '8+ Activities',
    description: 'From running to basketball, there\'s something for everyone'
  },
  {
    icon: 'mdi:users',
    title: '1000+ Members',
    description: 'Join our growing family of young sports enthusiasts'
  }
];

const galleries = [
  {
    // video: 'https://cdn.jumpshare.com/preview/rDchYgez1y5h3I4loVv20uhigJdZ-ks0B8DeEJ57D33zOr2n0cXOyrAbHADeRfU3tirdI8hEtNfBJY8wf1YP4EbnU8lh79r2WQEo9dxsphX8Smj1CWdc46BKRwc-sFl0kLC1Er44IWfLONBObgK5OG6yjbN-I2pg_cnoHs_AmgI.mp4', // Running video
    video: '/videos/asmr.MP4', // Running video
    image: 'https://i.ibb.co.com/gMcTdFFs/IMG-1696.jpg',
    title: 'Casual city run every Saturday morning',
    type: 'video'
  },
  {
    // video: 'https://cdn.jumpshare.com/preview/IrXY0I5lb_xxk2joZ14qfHHgjdfd2rY1DkcPB_GWBoftXi0QRoxs9KE-MrAvqGwy2L5MVocvuGkD62JLZF7InE7ZDyNr3NAHIAPLg2yNnixigNfcDo5V3o2oyzOpVPo0kLC1Er44IWfLONBObgK5OG6yjbN-I2pg_cnoHs_AmgI.mp4', // Basketball video
    video: '/videos/hoops.MP4', // Basketball video
    image: 'https://i.ibb.co.com/Nn7CdKgV/IMG-1698.jpg',
    title: 'Basketball matches by Sobat Hoops',
    type: 'video'
  },
  {
    // video: 'https://cdn.jumpshare.com/preview/yLRfBlybHAp_grUSLc6n90-8LuzLB_wYC-wwIXnsOTNAujVbE2CCYoTlvChK6IduYyxN4lBSuFYTq2X0_pbZ-fSsEd6TXKOTu7cEh0ZHuxitLGRBhR8-kGlGmKW3RHzByLO-TVT5IcjHLn7SjsAHsm6yjbN-I2pg_cnoHs_AmgI.mp4', // Mini soccer video
    video: '/videos/nyepak.MP4', // Mini soccer video
    image: 'https://i.ibb.co.com/tThv7QXc/IMG-1693.jpg',
    title: 'Pressing, passing and then shooting',
    type: 'video'
  },
  {
    // video: 'https://cdn.jumpshare.com/preview/vurX5MJiR8lAhRCm0oM5sAnrFdJrpWxUI4wKVtdwhGsS-ElqYCTlp5508Gaz2e1u6Un6zm4-2Zm4kuPwvs2vwZRCeGeIwAj4WQO9KK2YHoE', // Night run video
    video: '/videos/nightrun.MP4', // Night run video
    image: 'https://i.ibb.co.com/WvGhd98L/IMG-1697.jpg',
    title: 'Evening runs exploring Bandung at night',
    type: 'video'
  }
];

export const About = () => {
  const containerRef = useRef(null);
  // Video baru dimuat saat section terlihat, supaya halaman awal tetap ringan
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <Section id="about" className="relative bg-paper-2">
      <div ref={containerRef} className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-16">
        <h2 className="text-5xl sm:text-6xl lg:text-8xl max-w-[16ch]">
          More Than Just A Sports Community
        </h2>

        {/* Cerita di kiri, kutipan anggota di kanan */}
        <div className="mt-10 md:mt-16 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-start">
          <div className="space-y-4 text-base md:text-lg text-ink-2 leading-relaxed max-w-[60ch]">
            <p>
              Founded in Bandung, we transform the &quot;Mager&quot; (lazy mood) culture into positive energy through fun and inclusive sports activities.
              We started with a simple idea: what if we could make sports fun for young people who think
              they&apos;re &quot;too lazy&quot; to exercise? We package physical activities in engaging content and create
              a welcoming space for everyone, regardless of their athletic ability.
            </p>
            <p>
              Our hashtag <span className="font-medium text-accent dark:text-sobat-yellow">#pelarikonten</span> reflects our philosophy:
              we&apos;re content creators who happen to run, not runners who create content. Every run, every
              game, every session is an opportunity to create memorable moments.
            </p>
          </div>

          {/* Kutipan anggota, dicetak sebagai teks, bukan kartu melayang */}
          <figure className="lg:border-l lg:border-rule lg:pl-10">
              <blockquote className="font-display font-extrabold uppercase text-3xl md:text-4xl leading-none text-ink">
                &ldquo;Best decision ever! I never thought I&apos;d enjoy running,
                but Sobat Sabtu made it fun and social.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <span className="font-medium text-ink">Pratama</span>, member since 2021
              </figcaption>
          </figure>
        </div>

        {/* Empat video sesi, sejajar dalam satu baris */}
        <div className="mt-10 md:mt-16 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-4 gap-2 md:gap-4">
            {galleries.map((gallery, index) => (
              <figure key={index} className="relative aspect-[3/4] overflow-hidden photo">
                {gallery.type === 'video' && isInView ? (
                  <video
                    src={gallery.video}
                    poster={gallery.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    aria-label={gallery.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={gallery.image}
                    alt={gallery.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                <figcaption className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 text-white text-sm md:text-base">{gallery.title}</figcaption>
              </figure>
            ))}
        </div>

        {/* Papan angka: fakta komunitas dicetak besar */}
        <dl className="mt-16 md:mt-24 border-t-2 border-ink grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="py-6 pr-4 border-b border-rule lg:border-b-0 lg:border-r last:border-r-0 lg:pl-6 lg:first:pl-0">
              <dt className="font-display font-extrabold uppercase text-4xl md:text-5xl leading-none text-accent dark:text-sobat-yellow num">
                {feature.title}
              </dt>
              <dd className="mt-3 text-sm md:text-base text-ink-2">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
};
