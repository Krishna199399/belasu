'use client';

import React from 'react';
import { PARENT_REVIEWS } from '@/data/mockData';
import { Star, Quote, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';
import { ParentReview } from '@/types';

function ReviewCard({ review }: { review: ParentReview }) {
  // Extract initials for visual avatar
  const initials = review.parentName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="w-[360px] sm:w-[420px] shrink-0 bg-white/95 backdrop-blur-xs p-6 sm:p-7 rounded-2xl border border-amber-200/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 mx-3 select-none group">
      <div>
        {/* Rating, Verified Pill & Date */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Parent</span>
          </div>
        </div>

        {/* Quote Icon & Review Text */}
        <div className="relative mb-4">
          <Quote className="w-7 h-7 text-amber-300/60 mb-1.5" />
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            &ldquo;{review.reviewText}&rdquo;
          </p>
        </div>
      </div>

      {/* Reviewer Details & Series Tag */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 truncate">
              <span className="truncate">{review.parentName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {review.childGrade} • {review.location}
            </p>
          </div>
        </div>

        {review.bookTitle && (
          <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 border border-amber-200/80 px-2 py-1 rounded-lg shrink-0 max-w-[130px] truncate text-right">
            {review.bookTitle.split('English')[0].trim() || review.bookTitle}
          </span>
        )}
      </div>
    </div>
  );
}

export const ParentFeedbackSection: React.FC = () => {
  // Single row of reviews duplicated for a seamless 100% infinite marquee loop
  const marqueeReviews = [...PARENT_REVIEWS, ...PARENT_REVIEWS];

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-gradient-to-b from-amber-50/60 via-amber-50/30 to-white border-b border-stone-200 relative overflow-hidden">
      
      {/* Container for Header matching Belesu - Contents.md verbatim */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Parent Experiences</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              What Parents Say About Belesu
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Every family’s learning experience is different. Read feedback from parents who have
              used Belesu guidebooks to support their children’s Kannada studies and learning at
              home.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            {/* Social Proof Metric Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-amber-200 shadow-2xs text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900 ml-1">4.9 / 5.0</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">500+ Happy Families</span>
            </div>

            {/* CTA matching Belesu - Contents.md verbatim */}
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group cursor-pointer"
            >
              <span>Read More Parent Reviews</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          INFINITE MARQUEE SHOWCASE (SINGLE ROW WITH EDGE GRADIENT MASKS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden pause-hover py-1">
        
        {/* Left & Right Soft Blur Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-amber-50/95 via-amber-50/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-amber-50/95 via-amber-50/60 to-transparent z-10" />

        {/* Single Row: Smooth scrolling left */}
        <div className="flex animate-marquee-left">
          {marqueeReviews.map((review, idx) => (
            <ReviewCard key={`single-row-${review.id}-${idx}`} review={review} />
          ))}
        </div>

      </div>

      {/* Bottom Subtle Trust Ribbon */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium text-center">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Verified Parent Purchases
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Trusted by Non-Kannadiga Families Across Karnataka
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Karnataka State Board Aligned (Classes 1–10)
          </span>
        </div>
      </div>

    </section>
  );
};
