'use client';

import React from 'react';
import Link from 'next/link';
import {
  Star,
  Users,
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

// Compact Review Card component matching the new design language
function MarqueeReviewCard({ review }: { review: ParentReview }) {
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
    <div className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-white rounded-2xl border border-[#FDE68A] p-4 sm:p-4.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between mx-2 sm:mx-2.5 select-none hover:-translate-y-0.5">
      <div>
        {/* Rating & Verified Pill */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: review.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
            <svg
              className="w-3 h-3 text-emerald-600"
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
        <div className="text-amber-400 font-serif font-black text-xl leading-none mb-1 select-none">
          ““
        </div>

        {/* Review Text (Compact and readable) */}
        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-normal mb-3 line-clamp-4">
          &ldquo;{review.reviewText}&rdquo;
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
              <span className="truncate">{review.parentName}</span>
              <svg
                className="w-3 h-3 text-emerald-600 shrink-0 fill-emerald-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </h4>
            <p className="text-[10px] text-slate-500 truncate">
              {review.childGrade} • {city}
            </p>
          </div>
        </div>

        {/* Series Badge */}
        <span className="text-[9px] sm:text-[10px] font-semibold text-amber-900 bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded-md shrink-0">
          {getSeriesTag(review.bookTitle)}
        </span>
      </div>
    </div>
  );
}

export const ParentFeedbackSection: React.FC = () => {
  // Put Dr. Archana Rao first followed by other reviews, duplicated for a continuous seamless marquee
  const orderedReviews: ParentReview[] = [
    ...PARENT_REVIEWS.filter((r) => r.parentName.includes('Archana')),
    ...PARENT_REVIEWS.filter((r) => !r.parentName.includes('Archana')),
  ];
  const marqueeReviews = [...orderedReviews, ...orderedReviews];

  return (
    <section className="relative py-4 sm:py-5 lg:py-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF2] to-[#FFF8EA] border-b border-amber-100/70 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ══════════════════════════════════════════════════════════════════
            HEADER (Reduced height, tight and compact spacing)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-2xl mx-auto space-y-1 mb-3 sm:mb-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#B45309] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs">
            <Users className="w-3 h-3 text-amber-600" />
            <span>Parent Experiences</span>
          </div>

          {/* Heading with Decorative Radiant Rays & Curved Wave Underline */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-0.5">
            {/* Left Radiant Rays */}
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 shrink-0 select-none"
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

            <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-black text-slate-900 tracking-tight leading-tight relative inline-block">
              <span>What Parents Say</span>{' '}
              <span className="relative inline-block whitespace-nowrap">
                About Belesu
                {/* Curved decorative underline */}
                <svg
                  className="absolute -bottom-1 left-0 w-full h-1.5 text-amber-400 select-none"
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
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 shrink-0 select-none"
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
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            Real feedback from parents who are using Belesu guidebooks for their child&apos;s learning.
          </p>

          {/* Social Proof Rating Metric Pill */}
          <div className="pt-0.5">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-amber-200/90 shadow-2xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-black text-slate-900 text-xs">4.9 / 5.0</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-slate-600 font-medium text-[10px] sm:text-[11px]">
                500+ Happy Families
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          INFINITE HORIZONTAL MARQUEE (Pauses on Hover / Touch)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden pause-hover py-1 sm:py-2">
        {/* Left & Right Soft Blur Edge Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-28 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/70 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-28 bg-gradient-to-l from-[#FFFDF9] via-[#FFFDF9]/70 to-transparent z-10" />

        {/* Smooth Left Scrolling Marquee Track */}
        <div className="flex animate-marquee-left">
          {marqueeReviews.map((review, idx) => (
            <MarqueeReviewCard key={`marquee-${review.id}-${idx}`} review={review} />
          ))}
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ══════════════════════════════════════════════════════════════════
            CTA BUTTON: Centered Dark Navy Pill Button (Compact)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex justify-center mt-3 sm:mt-4 mb-3 sm:mb-4">
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2 rounded-full bg-[#0B1B3D] hover:bg-[#152B5A] text-white font-bold text-xs shadow-xs transition-all duration-200 hover:shadow-md active:scale-95 group cursor-pointer"
          >
            <span>Read More Parent Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM TRUST BADGES: 3-Item Compact Trust Bar
        ══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-2xl mx-auto pt-2.5 border-t border-amber-200/50">
          <div className="grid grid-cols-3 gap-1 sm:gap-3 text-center">
            {/* Badge 1: Verified Purchases */}
            <div className="flex flex-col items-center justify-center pr-1 border-r border-stone-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
                100% Verified
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-tight">
                Parent Purchases
              </p>
            </div>

            {/* Badge 2: Trusted Families */}
            <div className="flex flex-col items-center justify-center px-1 border-r border-stone-200/80">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 mb-0.5" />
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
                Trusted by
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-tight">
                500+ Families
              </p>
            </div>

            {/* Badge 3: Karnataka School Syllabus Aligned */}
            <div className="flex flex-col items-center justify-center pl-1">
              <GraduationCap className="w-4 h-4 text-amber-500 mb-0.5" />
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
                Karnataka School
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-tight">
                Syllabus Aligned
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
