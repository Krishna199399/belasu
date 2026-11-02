'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';

interface AnnouncementItem {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  headline: string;
  ctaText: string;
  href: string;
}

const ALL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'elevate-startup-award',
    badge: 'Govt Award',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: '🏆',
    headline: 'Belesu Won Elevate Startup Program from Government of Karnataka for Contribution to Kannada Culture & Academics',
    ctaText: 'About Us',
    href: '/about',
  },
  {
    id: 'vtu-new-office',
    badge: 'New Office',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
    icon: '🏛️',
    headline: 'Belesu Inaugurated New Office at Visveswariya Technological University (VTU), Belagavi',
    ctaText: 'Visit Us',
    href: '/contact/',
  },
  {
    id: 'spoken-kannada-launch',
    badge: 'Book Launch',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    icon: '✨',
    headline: 'Launch of "A Destination to Speak Kannada" Book with MP Shri Tejasvi Surya',
    ctaText: 'Order Book',
    href: '/books/a-destination-to-speak-kannada/',
  },
  {
    id: 'digital-class-6',
    badge: 'Digital E-Reader',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
    icon: '💻',
    headline: 'Class 6 Kannada English-Translated Digital Guidebook is Now Live on Web Reader',
    ctaText: 'Read Online',
    href: '/digital/kannada-class-6-guide/',
  },
];

// Temporarily filter out Class 6 digital announcement while PDF is prepared
const ANNOUNCEMENTS: AnnouncementItem[] = HIDE_DIGITAL_CLASS_6
  ? ALL_ANNOUNCEMENTS.filter((a) => a.id !== 'digital-class-6')
  : ALL_ANNOUNCEMENTS;

const subscribeNoop = () => () => {};

export const AnnouncementBar: React.FC = () => {
  const [isManualDismissed, setIsManualDismissed] = useState(false);

  const isSessionDismissed = useSyncExternalStore(
    subscribeNoop,
    () => {
      try {
        return sessionStorage.getItem('belesu_announcement_dismissed_v2') === 'true';
      } catch {
        return false;
      }
    },
    () => false
  );

  const isDismissed = isManualDismissed || isSessionDismissed;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManualDismissed(true);
    try {
      sessionStorage.setItem('belesu_announcement_dismissed_v2', 'true');
    } catch {
      // ignore storage errors
    }
  };

  if (isDismissed) {
    return null;
  }

  // Render announcement list with decorative diamond separators
  const renderTrackItems = (keyPrefix: string) => (
    <div className="flex items-center space-x-6 sm:space-x-8 pr-6 sm:pr-8 shrink-0">
      {ANNOUNCEMENTS.map((item) => (
        <React.Fragment key={`${keyPrefix}-${item.id}`}>
          <Link
            href={item.href}
            className="group/item inline-flex items-center gap-2 sm:gap-2.5 text-xs text-slate-900 hover:text-black transition whitespace-nowrap"
          >
            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}
            >
              <span>{item.icon}</span>
              <span>{item.badge}</span>
            </span>

            {/* Headline */}
            <span className="font-semibold text-slate-900 group-hover/item:text-amber-700 transition">
              {item.headline}
            </span>

            {/* Direct CTA */}
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 group-hover/item:text-amber-800 underline underline-offset-2 ml-1">
              <span>{item.ctaText}</span>
              <ArrowRight className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Decorative Rolling Separator */}
          <span className="text-amber-500 text-[10px] select-none" aria-hidden="true">
            ◆
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <aside
      aria-label="Website Announcements"
      className="relative z-40 w-full bg-white text-slate-900 border-t border-b border-stone-200 select-none overflow-hidden pause-hover flex items-center h-9 sm:h-10 shadow-2xs"
    >
      {/* Left Static Indicator Badge */}
      <div className="shrink-0 z-20 h-full flex items-center pl-2 sm:pl-3.5 pr-2 bg-gradient-to-r from-white via-white to-transparent">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-slate-950 animate-pulse" />
          <span className="hidden sm:inline">Updates</span>
        </div>
      </div>

      {/* Edge Gradient Mask for Smooth Fade-In on Left */}
      <div className="absolute left-10 sm:left-24 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

      {/* Rolling Marquee Tape Container */}
      <div className="flex-1 overflow-hidden flex items-center min-w-0">
        <div className="animate-rolling-ticker flex items-center">
          {renderTrackItems('track-1')}
          {renderTrackItems('track-2')}
        </div>
      </div>

      {/* Edge Gradient Mask for Smooth Fade-Out on Right */}
      <div className="absolute right-9 sm:right-11 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Right Dismiss Button */}
      <div className="shrink-0 z-20 h-full flex items-center pr-2 sm:pr-3 pl-1.5 bg-gradient-to-l from-white via-white to-transparent">
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 min-w-[32px] min-h-[32px] rounded-md text-slate-500 hover:text-slate-900 hover:bg-stone-100 transition cursor-pointer flex items-center justify-center"
          aria-label="Dismiss announcement bar"
          title="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
