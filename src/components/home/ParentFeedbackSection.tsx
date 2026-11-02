'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Heart,
  GraduationCap,
} from 'lucide-react';
import { PARENT_REVIEWS } from '@/data/mockData';
import { ParentReview } from '@/types';

// Helper to extract clean book/series tag
function getSeriesTag(bookTitle?: string): string {
  if (!bookTitle) return 'Kannada Guide';
  if (bookTitle.includes('Savi')) return 'Savi Kannada';
  if (bookTitle.includes('Kali')) return 'Kali Kannada';
  if (bookTitle.includes('Tili')) return 'Tili Kannada';
  if (bookTitle.includes('Siri')) return 'Siri Kannada';
  return bookTitle.split('English')[0].trim() || 'Kannada Guide';
}

// Single Review Card component matching user's design 1:1
function ReviewCard({ review }: { review: ParentReview }) {
  const initials = review.parentName
    .replace('Dr. ', '')
    .trim()
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const city = review.location.split(',')[0].trim();

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#FDE68A] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Rating & Verified Pill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: review.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            <svg
              className="w-3.5 h-3.5 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified Parent</span>
          </div>
        </div>

        {/* Decorative Quote Mark */}
        <div className="text-amber-400 font-serif font-black text-2xl sm:text-3xl leading-none mb-1 select-none">
          ““
        </div>

        {/* Review Text */}
        <p className="text-[13px] sm:text-sm text-slate-800 leading-relaxed font-normal mb-5">
          &ldquo;{review.reviewText}&rdquo;
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EA580C] text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 truncate">
              <span className="truncate">{review.parentName}</span>
              <svg
                className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">
              {review.childGrade} • {city}
            </p>
          </div>
        </div>

        {/* Series Badge */}
        <span className="text-[10px] sm:text-[11px] font-semibold text-amber-900 bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 rounded-md shrink-0">
          {getSeriesTag(review.bookTitle)}
        </span>
      </div>
    </div>
  );
}

export const ParentFeedbackSection: React.FC = () => {
  // Put Dr. Archana Rao first so initial view matches user reference screenshot 1:1, followed by all real reviews
  const allReviews: ParentReview[] = [
    ...PARENT_REVIEWS.filter((r) => r.parentName.includes('Archana')),
    ...PARENT_REVIEWS.filter((r) => !r.parentName.includes('Archana')),
  ];

  // Mobile carousel state (1 card visible at a time, 4 dots)
  const mobileReviews = allReviews.slice(0, 4);
  const [mobileIndex, setMobileIndex] = useState(0);

  // Desktop carousel state (3 cards visible at a time)
  // Group into pages of 3: Page 0 (0,1,2), Page 1 (3,4,5), Page 2 (6,7 + 0)
  const desktopPages: ParentReview[][] = [
    allReviews.slice(0, 3),
    allReviews.slice(3, 6),
    [...allReviews.slice(6, 8), allReviews[0]],
  ];
  const [desktopIndex, setDesktopIndex] = useState(0);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> next
      setMobileIndex((prev) => (prev + 1) % mobileReviews.length);
    } else if (diff < -50) {
      // Swiped right -> prev
      setMobileIndex((prev) => (prev - 1 + mobileReviews.length) % mobileReviews.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleDesktopPrev = () => {
    setDesktopIndex((prev) => (prev - 1 + desktopPages.length) % desktopPages.length);
  };

  const handleDesktopNext = () => {
    setDesktopIndex((prev) => (prev + 1) % desktopPages.length);
  };

  return (
    <section className="relative py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF2] to-[#FFF8EA] border-b border-amber-100/70 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ══════════════════════════════════════════════════════════════════
            HEADER (Clean, Centered, Elegant with Radiant Rays & Accent)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-5 sm:mb-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#B45309] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Parent Experiences</span>
          </div>

          {/* Heading with Decorative Radiant Rays & Curved Wave Underline */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 pt-0.5">
            {/* Left Radiant Rays */}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="5" y1="5" x2="10" y2="9" />
              <line x1="5" y1="19" x2="10" y2="15" />
            </svg>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight relative inline-block">
              <span>What Parents Say</span>{' '}
              <span className="relative inline-block whitespace-nowrap">
                About Belesu
                {/* Curved decorative underline */}
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-amber-400 select-none"
                  viewBox="0 0 100 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5.5C25 2 75 2 99 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Right Radiant Rays */}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="21" y1="12" x2="15" y2="12" />
              <line x1="19" y1="5" x2="14" y2="9" />
              <line x1="19" y1="19" x2="14" y2="15" />
            </svg>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            Real feedback from parents who are using Belesu guidebooks for their child&apos;s learning.
          </p>

          {/* Social Proof Rating Metric Pill */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2.5 bg-white px-4 py-1.5 rounded-full border border-amber-200/90 shadow-2xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-black text-slate-900 text-xs sm:text-sm">4.9 / 5.0</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-slate-600 font-medium text-[11px] sm:text-xs">
                500+ Happy Families
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE VIEW: Single Card with Touch Swipe & 4 Dots
        ══════════════════════════════════════════════════════════════════ */}
        <div className="block md:hidden max-w-sm mx-auto">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="transition-all duration-300 ease-out"
          >
            <ReviewCard review={mobileReviews[mobileIndex]} />
          </div>

          {/* 4 Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-5">
            {mobileReviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  mobileIndex === idx
                    ? 'w-5 h-2 bg-[#EA580C]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP VIEW: 3-Card Carousel with Side Navigation Arrows
        ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block max-w-5xl mx-auto relative">
          {/* Navigation Arrows */}
          <button
            onClick={handleDesktopPrev}
            aria-label="Previous reviews"
            className="absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-amber-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800 shadow-sm flex items-center justify-center transition cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleDesktopNext}
            aria-label="Next reviews"
            className="absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-amber-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800 shadow-sm flex items-center justify-center transition cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 3 Review Cards Grid */}
          <div className="grid grid-cols-3 gap-4 lg:gap-5">
            {desktopPages[desktopIndex].map((review, idx) => (
              <ReviewCard key={`${review.id}-${idx}`} review={review} />
            ))}
          </div>

          {/* Desktop Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-5 mb-6">
            {desktopPages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setDesktopIndex(idx)}
                aria-label={`Go to page ${idx + 1}`}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  desktopIndex === idx
                    ? 'w-6 h-2 bg-[#EA580C]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CTA BUTTON: Centered Dark Navy Pill Button
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex justify-center mb-6 sm:mb-7">
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#0B1B3D] hover:bg-[#152B5A] text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 group cursor-pointer"
          >
            <span>Read More Parent Reviews</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM TRUST BADGES: 3-Item Trust Bar with Dividers
        ══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-3xl mx-auto pt-3 border-t border-amber-200/50">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Badge 1: Verified Purchases */}
            <div className="flex flex-col items-center justify-center pr-2 border-r border-stone-200/80">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                100% Verified
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                Parent Purchases
              </p>
            </div>

            {/* Badge 2: Trusted Families */}
            <div className="flex flex-col items-center justify-center px-2 border-r border-stone-200/80">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mb-1" />
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                Trusted by
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                500+ Families
              </p>
            </div>

            {/* Badge 3: Karnataka School Syllabus Aligned */}
            <div className="flex flex-col items-center justify-center pl-2">
              <GraduationCap className="w-5 h-5 text-amber-500 mb-1" />
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                Karnataka School
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                Syllabus Aligned
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
                (Classes 1–10)
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
