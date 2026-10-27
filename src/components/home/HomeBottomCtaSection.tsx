'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
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
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-white via-amber-50/40 to-amber-100/50 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Showcase Container (Compact) */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-5 sm:p-7 lg:p-8 shadow-xl shadow-slate-950/20 border border-amber-500/20 relative overflow-hidden">
          
          {/* Subtle interior glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* ══════════════════════════════════════════════════════════════════
                LEFT COLUMN (7 cols): Editorial, Parent Value & Action CTAs
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Start Learning Today</span>
              </div>

              {/* H2 Title matching home page.md verbatim */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight text-white">
                Find the Right Book for Your Child
              </h2>

              {/* Subtitle matching home page.md */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Choose a guidebook based on your child's class and learning needs.
              </p>

              {/* Parent Reassurance Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Line-by-line English translations</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Solved textbook question banks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ideal for non-Kannadiga families</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Karnataka State Syllabus</span>
                </div>
              </div>

              {/* Cultural Tagline matching home page.md */}
              <div className="pt-1">
                <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 font-serif font-bold text-sm sm:text-base tracking-wide shadow-2xs">
                  Kannada Mathadi, Kannada Belesi
                </div>
              </div>

              {/* Action Buttons matching home page.md CTAs */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/books"
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition active:scale-95 uppercase tracking-wider cursor-pointer min-h-[44px]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse All Books</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center gap-1.5 transition active:scale-95 uppercase tracking-wider cursor-pointer min-h-[44px]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Belesu</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-400" /> Fast delivery in 3-5 days
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Authentic State Curriculum
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> 500+ Happy Families
                </span>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════════════
                RIGHT COLUMN (5 cols): Authentic Parent-Child Visual Showcase
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              
              {/* Outer Card with layered imagery */}
              <div className="relative w-full max-w-[380px]">
                
                {/* Ambient glow behind image */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur-lg" />

                {/* Main Mother and Child Photo */}
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-900">
                  <img
                    src="/mother-and-child.png"
                    alt="Mother helping child learn Kannada at home with Belesu guidebook"
                    className="w-full h-64 sm:h-72 object-cover object-center"
                  />

                  {/* Gradient Overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Rating Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-black text-white">4.9 / 5.0</span>
                    <span className="text-[9px] text-slate-300">(Verified)</span>
                  </div>

                  {/* Floating Testimonial Quote Pill at bottom */}
                  <div className="absolute bottom-2.5 inset-x-2.5 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-white/15 shadow-md">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                        Real Family Experience
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug italic">
                      &ldquo;We can now understand every lesson and help with homework without any stress!&rdquo;
                    </p>
                    <div className="mt-1 text-[9px] font-bold text-slate-400">
                      — Class 4 Parent · Bengaluru
                    </div>
                  </div>

                </div>

                {/* Floating 3D Book Mockup Thumbnail Overlay */}
                <div className="hidden sm:flex absolute -bottom-3 -left-4 bg-white p-1.5 rounded-xl border border-amber-200 shadow-xl items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform duration-200">
                  <img
                    src="/covers/savi-4.png"
                    alt="Savi Kannada Guidebook"
                    className="w-10 h-auto object-contain rounded"
                  />
                  <div className="pr-2 text-slate-900">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-amber-800">
                      State Board
                    </div>
                    <div className="text-[11px] font-black leading-tight">
                      Savi Kannada Class 4
                    </div>
                    <div className="text-[9px] text-emerald-700 font-bold">
                      ✓ English Translated
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
