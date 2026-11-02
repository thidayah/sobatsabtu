'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const contacts = [
  { name: 'Whatsapp', icon: 'mdi:whatsapp', url: process.env.NEXT_PUBLIC_WHATSAPP, color: '#FC4C02' },
  { name: 'Email', icon: 'mdi:email-outline', url: process.env.NEXT_PUBLIC_EMAIL, color: '#E4405F' },
];

export const Footer = () => {
  const sectionRef = useRef(null);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const BlueLogo = '/icons/blue.svg'
  const WhiteLogo = '/icons/white.svg'

  // Animasi mengetik
  useEffect(() => {
    const phrases = [
      'UntalentedRunners',
      'PelariKonten',
      'MagerCulture'
    ];

    const currentPhrase = phrases[loopNum % phrases.length];
    const typingSpeed = isDeleting ? 50 : 100;

    const handleTyping = () => {
      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }

      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        return;
      }

      const nextText = isDeleting
        ? currentPhrase.substring(0, displayText.length - 1)
        : currentPhrase.substring(0, displayText.length + 1);

      setDisplayText(nextText);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum]);

  // Deteksi tema dari class HTML
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Check initial theme
    checkTheme();

    // Observer untuk perubahan class dark
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={sectionRef} className="relative bg-paper-2 border-t border-ink">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-16 py-12 lg:py-16">
        {/* Kolom indeks: merek, kontak, kredit */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand Column */}
          <div className="max-w-md">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
              {isDark ? (
                <Image src={WhiteLogo} width={1321} height={541} alt="Sobat Sabtu Logo" className="w-28 lg:w-40 h-auto" />
              ) : (
                <Image src={BlueLogo} width={1598} height={679} alt="Sobat Sabtu Logo" className="w-28 lg:w-40 h-auto" />
              )}
            </button>
            <p className="text-sm md:text-base text-muted leading-relaxed mt-4">
              Since 2019, we&apos;ve been transforming the &quot;Mager&quot; culture into positive energy through fun and inclusive sports activities in Bandung.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl mb-3">Contact</h3>
            <ul className="space-y-1">
              {contacts.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-11 hover:text-accent dark:hover:text-sobat-yellow transition-colors duration-150"
                  >
                    <Icon icon={social.icon} width="18" height="18" aria-hidden="true" />
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Credit */}
          <div className="text-sm text-muted space-y-2 md:text-right">
            <p>© {new Date().getFullYear()} Sobat Sabtu. All rights reserved.</p>
            <p>
              Developed by{' '}
              <a
                href="https://thidayah.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-2 underline underline-offset-2"
              >
                Runminders
              </a>
            </p>
          </div>
        </div>

        {/* Mast: hashtag mengetik, dicetak sebesar lebar halaman */}
        <h2 className="mt-12 lg:mt-20 text-[clamp(1.75rem,8vw,9rem)] break-all leading-none text-accent dark:text-white">
          <span>#</span>
          <span>{displayText}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            aria-hidden="true"
            className="inline-block w-1 h-[0.8em] bg-sobat-yellow ml-2 align-baseline"
          />
        </h2>
      </div>
    </footer>
  );
};
