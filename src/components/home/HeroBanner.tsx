'use client';

import React from 'react';
import Link from 'next/link';
import { BookProduct } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';
import { Star, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onPreview: (book: BookProduct) => void;
}

const FEATURED_BOOK_IDS = ['16351', '15926', '19577', '19571', '17548', '16142', '15849'];

const HIGHLIGHTS = [
  'Innovative Academic Guidebooks',
  'Kannada to English Translations for School Academic Textbooks - Savi, Siri, Kali and Tili',
  'Easy Kannada Learning and Exam Preparation',
];

const coverMap: Record<string, string> = {
  '16351': '/covers/savi-4.png',
  '15926': '/covers/savi-1.png',
  '19577': '/covers/kali-2.png',
  '19571': '/covers/kali-3.png',
  '17548': '/covers/siri-5.png',
  '16142': '/covers/savi-3.png',
  '15849': '/covers/savi-2.png',
};

const badgeMap: Record<string, string> = {
  '16351': 'Bestseller',
  '15926': 'Beginners',
  '19577': 'New Edition',
  '19571': 'Top Rated',
  '17548': 'Class 5',
  '16142': 'Parent Fav',
  '15849': 'Recommended',
};

export const HeroBanner: React.FC<HeroBannerProps> = () => {
  const books = FEATURED_BOOK_IDS.map(
    (id) => BOOKS_DATA.find((b) => b.id === id)
  ).filter(Boolean) as BookProduct[];

  // Duplicate for seamless infinite loop
  const loop = [...books, ...books];

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="relative w-full bg-stone-50 border-b border-amber-200/60 overflow-x-clip">
        {/* warm mesh background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 10% 20%, rgba(251,191,36,0.13) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(234,88,12,0.09) 0%, transparent 55%)',
          }}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row">

          {/* ── LEFT: sticky text panel ── */}
          <div className="lg:w-[52%] lg:sticky lg:top-0 lg:self-start lg:h-screen flex flex-col justify-center py-16 lg:py-0 lg:pr-12 z-10">

            {/* tagline pill */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-full px-4 py-1.5 text-xs font-black text-amber-900 uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Kannada Mathadi, Kannada Belesi
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.2rem] font-black leading-[1.1] tracking-tight text-slate-900 mb-6">
              English-Translated{' '}
              <span style={{ background: 'linear-gradient(135deg,#d97706 0%,#ea580c 60%,#b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Kannada Academic Guidebooks
              </span>{' '}
              for School Students
            </h1>

            {/* body */}
            <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mb-7">
              <p>
                Belesu&apos;s innovative guidebooks make Kannada easier to learn by translating lessons from Kannada to English. Designed to support academic learning, they help students understand textbook chapters, learn correct pronunciation, and prepare for Kannada exams with greater confidence.
              </p>
              <p>
                When children find Kannada difficult to understand, parents may also struggle to help with schoolwork. Belesu makes this easier with English translations and learning support that help both students and parents follow their Kannada lessons.
              </p>
            </div>

            {/* highlights */}
            <div className="flex flex-col gap-2 mb-8">
              {HIGHLIGHTS.map((h) => (
                <div key={h} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{h}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full sm:w-auto">
              <Link href="/books" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-400/30 active:scale-95 tracking-wide min-h-[48px]">
                Explore Kannada Guidebooks <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/books" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-slate-900 border border-slate-300 hover:border-amber-400 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 min-h-[48px]">
                View All Books
              </Link>
            </div>

            {/* social proof */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-amber-100">
              <div className="flex -space-x-2">
                {['🧒','👦','👧','🧑'].map((e, i) => (
                  <span key={i} className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-sm shadow-sm">{e}</span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="text-xs font-black text-slate-800 ml-1">4.9</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Trusted by 5,000+ families</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: horizontal auto-scroll book covers ── */}
          <div className="lg:w-[48%] flex flex-col justify-center py-12 lg:py-0 overflow-hidden">
            {/* fade edges */}
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
                style={{ background: 'linear-gradient(to right, #fafaf9, transparent)' }} />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
                style={{ background: 'linear-gradient(to left, #fafaf9, transparent)' }} />

              <div className="marquee-track gap-5" style={{ padding: '20px 0' }}>
                {loop.map((book, idx) => {
                  const cover = coverMap[book.id] ?? '/covers/savi-4.png';
                  const badge = badgeMap[book.id] ?? '';
                  return (
                    <div
                      key={`${book.id}-${idx}`}
                      className="flex-shrink-0 w-[160px] sm:w-[190px] mx-3"
                    >
                      <div className="relative group bg-white rounded-2xl p-3 border border-amber-100 shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-1">
                        {badge && (
                          <span className="absolute -top-2 -right-2 z-10 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full shadow">
                            {badge}
                          </span>
                        )}
                        <img
                          src={cover}
                          alt={book.title}
                          className="w-full aspect-[3/4] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 rounded-lg"
                        />
                        <p className="mt-2.5 text-xs font-black text-slate-800 text-center leading-snug line-clamp-2">
                          {book.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};