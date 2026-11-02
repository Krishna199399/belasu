'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Star,
  ShieldCheck,
  Heart,
  Truck,
} from 'lucide-react';

export const HomeBottomCtaSection: React.FC = () => {
  return (
    <section className="relative py-4 sm:py-5 lg:py-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF2] to-[#FFF8EA] overflow-hidden border-b border-amber-100/70">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-5 lg:px-6 relative z-10">
        
        {/* ══════════════════════════════════════════════════════════════════
            MAIN MIDNIGHT NAVY CONTAINER (Compact, High-Converting)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0B1528] text-white p-4 sm:p-5 lg:p-6 shadow-xl shadow-slate-950/20 border border-amber-500/20 relative overflow-hidden">
          
          {/* Subtle warm interior glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center relative z-10">
            
            {/* ══════════════════════════════════════════════════════════════════
                LEFT / TOP: Editorial, Checklist, Motto & CTAs
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5 sm:space-y-3">
              
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1E293B]/80 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs">
                {/* Seedling / Sprout SVG */}
                <svg
                  className="w-3.5 h-3.5 text-amber-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 20h10" />
                  <path d="M10 20c0-4.5 1-8 4-10" />
                  <path d="M14 10c2-3 5-4 7-4-1 3-2 6-5 7" />
                  <path d="M9 13c-2-2-4-2-6-2 1 2 2 4 4 5" />
                </svg>
                <span>Start Learning Today</span>
              </div>

              {/* Heading with Radiant Rays & Curved Wave Underline */}
              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 pt-0.5">
                {/* Left Rays */}
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0 select-none"
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

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black tracking-tight leading-tight text-white relative inline-block">
                  <span>Find the Right Book</span>{' '}
                  <span className="relative inline-block whitespace-nowrap">
                    for Your Child
                    {/* Decorative curved wave underline */}
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

                {/* Right Rays */}
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0 select-none"
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
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-normal max-w-md">
                Choose a guidebook based on your child&apos;s class and learning needs.
              </p>

              {/* 2-Column Parent Reassurance Checklist with Hairline Divider */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 py-1 text-left w-full max-w-md border-y border-white/10 my-0.5">
                {/* Left Column */}
                <div className="space-y-1.5 pr-2 border-r border-white/10">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Line-by-line English translations</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Ideal for non-Kannadiga families</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-1.5 pl-2">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Solved textbook question banks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>100% Karnataka State Syllabus</span>
                  </div>
                </div>
              </div>

              {/* Cultural Tagline */}
              <div>
                <div className="inline-block px-3.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/40 text-amber-300 font-serif font-bold text-xs sm:text-sm tracking-wide shadow-2xs">
                  Kannada Mathadi, Kannada Belesi
                </div>
              </div>

              {/* Action Buttons (Desktop Side-by-Side) */}
              <div className="hidden lg:flex items-center gap-3 pt-1 w-full">
                <Link
                  href="/books"
                  className="px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse All Books</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#1E293B] hover:bg-[#334155] border border-slate-700 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Belesu</span>
                </Link>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════════════
                RIGHT: Authentic Parent-Child Visual Showcase with Overlays
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md">
                
                {/* Photo Container */}
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-900">
                  <img
                    src="/mother-and-child.png"
                    alt="Mother helping child learn Kannada at home with Belesu guidebook"
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover object-center"
                  />

                  {/* Gradient Overlay for bottom text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Rating Pill Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-black text-white">4.9 / 5.0</span>
                    <span className="text-[9px] text-slate-300">(Verified)</span>
                  </div>

                  {/* Bottom Overlays: Book Pill + Real Experience Quote */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center gap-1.5 sm:gap-2">
                    {/* Floating White Book Card */}
                    <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-lg border border-amber-200/80 flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <img
                        src="/covers/savi-4.png"
                        alt="Savi Kannada Class 4"
                        className="w-7 sm:w-8 h-auto object-contain rounded"
                      />
                      <div className="pr-1 text-slate-900 text-left">
                        <div className="text-[8px] font-black uppercase tracking-wider text-amber-800">
                          State Board
                        </div>
                        <div className="text-[10px] font-black leading-tight">
                          Savi Kannada
                        </div>
                        <div className="text-[9px] font-bold text-slate-800 leading-tight">
                          Class 4
                        </div>
                        <div className="text-[8px] text-emerald-700 font-bold">
                          ✓ English Translated
                        </div>
                      </div>
                    </div>

                    {/* Testimonial Quote Glass Bar */}
                    <div className="bg-slate-950/85 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-white/15 flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-300 uppercase tracking-wider truncate">
                          Real Family Experience
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-200 leading-snug italic line-clamp-2">
                        &ldquo;We can now understand every lesson and help with homework.&rdquo;
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                MOBILE ACTION BUTTONS (Stacked, matching user screenshot)
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:hidden col-span-1 flex flex-col gap-2 pt-1 w-full max-w-md mx-auto">
              <Link
                href="/books"
                className="w-full py-2.5 rounded-full font-black text-xs uppercase tracking-wider bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse All Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/contact"
                className="w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#1E293B] hover:bg-[#334155] border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Belesu</span>
              </Link>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              BOTTOM 3 TRUST BADGES (Horizontal with Delicate Dividers)
          ══════════════════════════════════════════════════════════════════ */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center text-slate-300 text-[10px] sm:text-[11px] font-medium">
              {/* Badge 1 */}
              <div className="flex items-center justify-center gap-1.5 pr-1 border-r border-white/10">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="leading-tight">Fast delivery in 3–5 days</span>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center justify-center gap-1.5 px-1 border-r border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="leading-tight">100% Authentic State Curriculum</span>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center justify-center gap-1.5 pl-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
                <span className="leading-tight">500+ Happy Families</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
