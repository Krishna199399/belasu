'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  mobileHeadline: string;
  desktopHeadline: string;
  ctaText: string;
  href: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'digital-class-6',
    badge: 'Digital E-Reader',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '💻',
    mobileHeadline: 'Class 6 Kannada Digital Guidebook is Now Live!',
    desktopHeadline: 'New Launch: Class 6 Kannada English-Translated Digital Guidebook is Now Available!',
    ctaText: 'Read Online',
    href: '/digital/kannada-class-6-guide',
  },
  {
    id: 'spoken-kannada-book',
    badge: 'New Release',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '🗣️',
    mobileHeadline: 'New Book: "A Destination to Speak Kannada" Available',
    desktopHeadline: 'New Book: "A Destination to Speak Kannada" — Master Everyday Spoken Kannada with Ease',
    ctaText: 'Order Book',
    href: '/books/a-destination-to-speak-kannada',
  },
  {
    id: 'vtu-belgaum-office',
    badge: 'Campus Office',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: '🏛️',
    mobileHeadline: 'Visit Us: VTU Campus, Belgaum',
    desktopHeadline: 'Visit Our Operations Office: VRIF, Visvesvaraya Technological University (VTU) Campus, Belgaum',
    ctaText: 'Get Directions',
    href: '/contact',
  },
];

const subscribeNoop = () => () => {};

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isManualDismissed, setIsManualDismissed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isSessionDismissed = useSyncExternalStore(
    subscribeNoop,
    () => {
      try {
        return sessionStorage.getItem('belesu_announcement_dismissed_v1') === 'true';
      } catch {
        return false;
      }
    },
    () => false
  );

  const isDismissed = isManualDismissed || isSessionDismissed;

  // Auto-rotation every 4.5 seconds
  useEffect(() => {
    if (isDismissed || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDismissed, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManualDismissed(true);
    try {
      sessionStorage.setItem('belesu_announcement_dismissed_v1', 'true');
    } catch {
      // ignore storage errors
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    } else if (diff < -40) {
      setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
    }
    setTouchStartX(null);
  };

  if (isDismissed) {
    return null;
  }

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <aside
      aria-label="Website Announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative z-50 w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-b border-amber-500/25 select-none transition-all duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1 sm:gap-3 text-xs">
        
        {/* Left: Previous Nav Arrow (Desktop & Tablet) */}
        <button
          type="button"
          onClick={handlePrev}
          className="hidden sm:inline-flex p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Center Content: Animated Announcement Details */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-1 overflow-hidden">
          <Link
            key={current.id}
            href={current.href}
            className="group/ann inline-flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full text-center hover:opacity-95 transition"
          >
            {/* Pulsing Badge */}
            <span
              className={`shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${current.badgeColor}`}
            >
              <span>{current.icon}</span>
              <span className="hidden xs:inline">{current.badge}</span>
            </span>

            {/* Headline */}
            <span className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-200 group-hover/ann:text-white transition truncate">
              <span className="sm:hidden">{current.mobileHeadline}</span>
              <span className="hidden sm:inline">{current.desktopHeadline}</span>
            </span>

            {/* Direct CTA Link with Moving Arrow */}
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-bold text-amber-400 group-hover/ann:text-amber-300 underline underline-offset-2 transition ml-0.5">
              <span>{current.ctaText}</span>
              <ArrowRight className="w-3 h-3 group-hover/ann:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Right Section: Indicators & Controls */}
        <div className="shrink-0 flex items-center gap-1 sm:gap-1.5">
          {/* Slide Indicator Dots (Hidden on narrow mobile) */}
          <div className="hidden md:flex items-center gap-1 mr-1">
            {ANNOUNCEMENTS.map((a, idx) => (
              <button
                key={`dot-${a.id}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to announcement ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Nav Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:inline-flex p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss (Close) Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/10 transition cursor-pointer ml-0.5"
            aria-label="Dismiss announcement bar"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
