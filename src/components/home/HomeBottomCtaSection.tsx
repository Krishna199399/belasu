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
    <section className="py-12 sm:py-14 lg:py-16 bg-gradient-to-b from-white via-amber-50/40 to-amber-100/50 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Showcase Container */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-950/20 border border-amber-500/20 relative overflow-hidden">
          
          {/* Subtle interior glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            
            {/* ══════════════════════════════════════════════════════════════════
                LEFT COLUMN (7 cols): Editorial, Parent Value & Action CTAs
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Start Learning Today</span>
              </div>

              {/* H2 Title matching Belesu - Contents.md verbatim */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight text-white">
                Make Kannada Academic Learning Easier at Home and School
              </h2>

              {/* Exact Paragraph 1 matching Belesu - Contents.md */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                Give students additional support as they learn Kannada in school. Belesu’s innovative
                academic guidebooks combine Kannada learning with English translations and lesson
                support to help make textbook content easier to understand.
              </p>

              {/* Exact Paragraph 2 matching Belesu - Contents.md */}
              <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
                Explore the available guidebooks and find a resource that suits the student’s class,
                prescribed textbook, and learning needs.
              </p>

              {/* Parent Reassurance Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Line-by-line English translations</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Solved textbook question banks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ideal for non-Kannadiga families</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Karnataka State Syllabus</span>
                </div>
              </div>

              {/* Cultural Tagline matching Belesu - Contents.md */}
              <div className="pt-2">
                <div className="inline-block px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-serif font-bold text-lg sm:text-xl tracking-wide shadow-xs">
                  Kannada Mathadi, Kannada Belesi.
                </div>
              </div>

              {/* Action Buttons matching Belesu - Contents.md CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/books"
                  className="px-8 py-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-wider cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Kannada Guidebooks</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/contact"
                  className="px-7 py-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-wider cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Contact Belesu</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" /> Fast delivery in 3-5 days
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Authentic State Curriculum
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> 500+ Happy Families
                </span>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════════════
                RIGHT COLUMN (5 cols): Authentic Parent-Child Visual Showcase
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              
              {/* Outer Card with layered imagery */}
              <div className="relative w-full max-w-[440px]">
                
                {/* Ambient glow behind image */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-3xl blur-xl" />

                {/* Main Mother and Child Photo */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
                  <img
                    src="/mother-and-child.png"
                    alt="Mother helping child learn Kannada at home with Belesu guidebook"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                  />

                  {/* Gradient Overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Rating Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-white">4.9 / 5.0</span>
                    <span className="text-[10px] text-slate-300">(Verified Parents)</span>
                  </div>

                  {/* Floating Testimonial Quote Pill at bottom */}
                  <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        Real Family Experience
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-snug italic">
                      &ldquo;We can now understand every lesson and help with homework without any stress!&rdquo;
                    </p>
                    <div className="mt-1.5 text-[10px] font-bold text-slate-400">
                      — Class 4 Parent · Bengaluru
                    </div>
                  </div>

                </div>

                {/* Floating 3D Book Mockup Thumbnail Overlay */}
                <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white p-2 rounded-2xl border border-amber-200 shadow-2xl items-center gap-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="/covers/savi-4.png"
                    alt="Savi Kannada Guidebook"
                    className="w-14 h-auto object-contain rounded-md"
                  />
                  <div className="pr-3 text-slate-900">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Karnataka State Board
                    </div>
                    <div className="text-xs font-black leading-tight">
                      Savi Kannada Guidebook
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
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
