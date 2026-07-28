'use client';

import React, { useState } from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ElevatingKannadaSection } from '@/components/home/ElevatingKannadaSection';
import { QuickLookBookSection } from '@/components/home/QuickLookBookSection';
import { CurriculumExplorer } from '@/components/home/CurriculumExplorer';
import { SeriesFilter } from '@/components/home/SeriesFilter';
import { WhyChooseBelesu } from '@/components/home/WhyChooseBelesu';
import { ComparisonSection } from '@/components/home/ComparisonSection';
import { ParentFeedbackSection } from '@/components/home/ParentFeedbackSection';
import { VideoReelsSection } from '@/components/home/VideoReelsSection';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct } from '@/types';
import Link from 'next/link';
import { BookOpen, ArrowRight, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';

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

      {/* 7. Tuition vs Belesu Comparison Matrix */}
      <ComparisonSection />

      {/* 8. Why Choose Belesu Features Grid */}
      <WhyChooseBelesu />

      {/* 9. Online Tuition Classes Promo */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 10% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 90% 20%, #f97316 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest">
                🎓 New · Online Live Classes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Learn Kannada Online<br />
                <span className="text-amber-400">with Expert Teachers</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                Now Belesu offers live online tuition classes for Classes 1–5 — perfectly aligned with your guidebook. Small batches, personalised attention, recorded sessions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: '👩‍🏫', text: 'Expert certified teachers' },
                  { emoji: '🎯', text: 'Max 8 students per batch' },
                  { emoji: '📚', text: 'Book-aligned syllabus' },
                  { emoji: '📹', text: 'Recorded sessions included' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-slate-200">
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/tuition"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm px-7 py-3.5 rounded-xl transition transform active:scale-95 uppercase tracking-wider"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/tuition/enroll"
                  className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition"
                >
                  Quick Enroll
                </Link>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10', label: 'Live Courses', sub: 'Classes 1–5 across all series', emoji: '📖' },
                { value: '₹500', label: 'Per Month', sub: 'Affordable excellence', emoji: '💰' },
                { value: '8', label: 'Max Students', sub: 'Focused personalised batches', emoji: '🎯' },
                { value: '24h', label: 'Confirmation', sub: 'Via WhatsApp after enrollment', emoji: '📱' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center space-y-1">
                  <div className="text-2xl">{stat.emoji}</div>
                  <div className="text-2xl font-black text-amber-400">{stat.value}</div>
                  <div className="text-xs font-bold text-white">{stat.label}</div>
                  <div className="text-[10px] text-slate-400">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Parent Feedback / Testimonials */}
      <ParentFeedbackSection />


      {/* 10. Video Demonstration Reels */}
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
