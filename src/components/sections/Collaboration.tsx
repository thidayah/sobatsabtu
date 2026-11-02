'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Section } from '../ui/Section';

// Data partner logos (ganti dengan logo asli nanti)
const partners = [
  { id: 11, name: 'Samsung', logo: 'https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/partners/samsung-logo.jpeg', category: 'sport' },
  { id: 22, name: 'Jete', logo: 'https://biyurtytnwlmxuninybb.supabase.co/storage/v1/object/public/ss_images/partners/jete-logo.png', category: 'tech' },
  // { id: 1, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', category: 'sport' },
  // { id: 2, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', category: 'sport' },
  // { id: 3, name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg', category: 'sport' },
  // { id: 4, name: 'The North Face', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/The_North_Face_logo.svg', category: 'outdoor' },
  // { id: 5, name: 'Salomon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Salomon_Logo.svg', category: 'outdoor' },
  // { id: 6, name: 'Garmin', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Garmin_logo.svg', category: 'tech' },
  // { id: 7, name: 'Suunto', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Suunto_logo.svg', category: 'tech' },
  // { id: 8, name: 'Red Bull', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Red_Bull_logo.svg', category: 'energy' },
  // { id: 9, name: 'Pocari Sweat', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Pocari_Sweat_logo.svg', category: 'beverage' },
  // { id: 10, name: 'Hydro Coco', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Hydro_Coco_logo.svg', category: 'beverage' },
  // { id: 11, name: 'Decathlon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Decathlon_logo.svg', category: 'retail' },
  // { id: 12, name: 'REI', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/REI_logo.svg', category: 'retail' },
];

// Latar foto Unsplash dihapus (Hallmark 83: dinding foto stok); section ini kini pita warna brand
// Render logo partner dari URL, dengan fallback ke teks nama bila gambar gagal dimuat
const PartnerLogo = ({ src, name }: { src: string; name: string }) => {
  const [hasError, setHasError] = useState(false);

  // Fallback: kondisi placeholder seperti sebelumnya
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-black text-sm text-center font-medium px-2">
          {name}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Logo ${name}`}
      fill
      sizes="(max-width: 768px) 16vw, 8vw"
      className="object-contain p-1 md:p-4"
      onError={() => setHasError(true)}
    />
  );
};

export const Collaboration = () => {
  return (
    <Section id="collaboration" className="bg-accent text-accent-ink">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl">
              Trusted By The Best
            </h2>
            <p className="mt-6 text-base sm:text-xl max-w-xl">
              We&apos;re proud to collaborate with leading brands that share our passion
              for sports and community building.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <a
              className="btn bg-white text-black hover:bg-gray-100 active:bg-gray-200 whitespace-nowrap"
              href={process.env.NEXT_PUBLIC_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:handshake" width="20" height="20" aria-hidden="true" />
              Become a Partner
            </a>
          </div>
        </div>

        {/* Logo partner di atas petak putih, dipisah garis */}
        <ul className="mt-12 md:mt-16 border-t-2 border-white grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-px">
          {partners.map((partner) => (
            <li key={partner.id} className="relative aspect-[3/2] bg-white mt-4 mr-4">
              {/* Logo partner - fallback ke nama bila gambar gagal dimuat */}
              <PartnerLogo src={partner.logo} name={partner.name} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};
