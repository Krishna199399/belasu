'use client';

import React, { useState } from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ElevatingKannadaSection } from '@/components/home/ElevatingKannadaSection';
import { QuickLookBookSection } from '@/components/home/QuickLookBookSection';
import { CurriculumExplorer } from '@/components/home/CurriculumExplorer';
import { SeriesFilter } from '@/components/home/SeriesFilter';
import { WhyChooseBelesu } from '@/components/home/WhyChooseBelesu';
import { ParentFeedbackSection } from '@/components/home/ParentFeedbackSection';
import { VideoReelsSection } from '@/components/home/VideoReelsSection';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct } from '@/types';
import Link from 'next/link';
import { BookOpen, ArrowRight, ShieldCheck, Truck, Headphones, Sparkles, CheckCircle2, Star, Clock } from 'lucide-react';

export default function HomePage() {
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);

  return (
    <div>
      {/* 1. Dynamic 7-Banner Light Hero Carousel */}
      <HeroCarousel onPreview={(book) => setPreviewBook(book)} />

      {/* 2. Elevating Kannada Across Karnataka & 4 Pillars Grid */}
      <ElevatingKannadaSection />

      {/* 3. A Quick Look at the Book Interactive Sample Pages Gallery */}
      <QuickLookBookSection />

      {/* 4. Value Proposition Strip */}
      <section className="bg-slate-950 text-white py-6 border-y border-slate-800">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Fast Doorstep Delivery</h4>
                <p className="text-xs text-slate-400">Shipped in 3-5 days across Karnataka</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Authentic Belesu Quality</h4>
                <p className="text-xs text-slate-400">100% verified state board curriculum</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Dedicated WhatsApp Support</h4>
                <p className="text-xs text-slate-400">Instant answers for parents & teachers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Grade & Curriculum Explorer */}
      <CurriculumExplorer onPreview={(book) => setPreviewBook(book)} />

      {/* 6. Full Books Catalog / Series Filter */}
      <SeriesFilter onPreview={(book) => setPreviewBook(book)} />

      {/* 6.5 Digital Books Promo (Class 6 Spotlight + Coming Soon Roadmap) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50/60 via-stone-50 to-orange-50/40 text-slate-900 relative overflow-hidden border-y border-amber-200/60">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Value Proposition & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300/80 rounded-full px-4 py-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Now Live · Class 6 Digital Edition
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-900 tracking-tight">
                Class 6 Kannada Guidebook,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                  Now on Digital Reader
                </span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Empower your child to master Class 6 Kannada with complete line-by-line English translations, chapter summaries, and solved textbook answers. Accessible anytime on mobile or laptop via our high-speed, secure web reader.
              </p>

              {/* Feature Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { title: '180 Complete Pages', desc: 'Full prose, poems & grammar translated' },
                  { title: 'Zero Wait, Instant Access', desc: 'Read immediately — no shipping delay' },
                  { title: 'Secure Web Reader', desc: 'Anti-copy & DRM screenshot protection' },
                  { title: 'Lifetime Access for ₹199', desc: 'One-time fee, read forever on any device' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2.5 bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200/60 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/reader/kannada-class-6-guide?preview=true"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/25 active:scale-95 uppercase tracking-wider"
                >
                  <BookOpen className="w-4 h-4" /> Try Free 5-Page Preview
                </Link>
                <Link
                  href="/digital/kannada-class-6-guide"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50/50 text-slate-900 border border-amber-200 hover:border-amber-400 font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-xs active:scale-95"
                >
                  Buy Digital Copy · ₹199 <ArrowRight className="w-4 h-4 text-amber-600" />
                </Link>
              </div>
            </div>

            {/* Right Column: Featured Class 6 Showcase Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xl shadow-amber-900/5 relative">
                {/* Header status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                    ★ Bestseller
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>4.8</span>
                    <span className="text-slate-400 font-normal">(142 reviews)</span>
                  </div>
                </div>

                {/* Book Visual Mockup */}
                <div className="relative rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 text-white text-center shadow-md overflow-hidden">
                  <div className="absolute top-2.5 right-2.5 bg-black/25 backdrop-blur-xs text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-amber-100">
                    Karnataka Board
                  </div>
                  <div className="text-4xl sm:text-5xl my-2">📖</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-amber-100">
                    Savi Kannada · English Medium Guide
                  </div>
                  <div className="text-lg sm:text-xl font-black mt-1 leading-snug">
                    Class 6 Kannada Digital Guidebook
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold">
                    <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">180 Pages</span>
                    <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">Web Reader</span>
                    <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">5-Page Free Preview</span>
                  </div>
                </div>

                {/* Pricing & Guarantee Strip */}
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">₹199</span>
                      <span className="text-xs text-slate-400 line-through">₹349</span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Save 43%</span>
                    </div>
                    <div className="text-[11px] text-slate-500">One-time purchase · Lifetime access</div>
                  </div>
                  <Link
                    href="/digital/kannada-class-6-guide"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Upcoming Classes Notice */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-700">Classes 7–10:</span>
                    <span className="text-slate-500">Launching shortly</span>
                  </div>
                  <Link
                    href="/digital"
                    className="text-amber-700 hover:text-amber-800 font-bold underline underline-offset-2 flex items-center gap-1 shrink-0 text-[11px]"
                  >
                    View Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Belesu Features Grid */}
      <WhyChooseBelesu />

      {/* 10. Parent Feedback / Testimonials */}
      <ParentFeedbackSection />

      {/* 11. Video Demonstration Reels */}
      <VideoReelsSection />

      {/* 11. High-Converting Call To Action Banner */}
      <section className="py-20 bg-gradient-to-br from-amber-500 via-amber-600 to-rose-600 text-white relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-3 sm:px-4 lg:px-5 text-center space-y-6 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Transform Homework Stress Into Exam Success
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Give Your Child the Power to Excel in Kannada Today!
          </h2>

          <p className="text-base sm:text-lg text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Order your English-translated Savi, Kali, Siri, or Tili guidebook and make learning Kannada simple, stress-free, and enjoyable for your family.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/books"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl font-black text-slate-900 bg-white hover:bg-slate-100 shadow-2xl flex items-center justify-center gap-2 text-base transition transform active:scale-95"
            >
              <BookOpen className="w-5 h-5 text-amber-600" /> Order Guidebook Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Interactive Book Preview Modal */}
      <BookPreviewModal book={previewBook} onClose={() => setPreviewBook(null)} />
    </div>
  );
}
