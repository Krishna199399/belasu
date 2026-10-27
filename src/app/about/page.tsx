import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Headphones,
  MessageSquare,
  Sparkles,
  Target,
  Compass,
  PhoneCall,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Belesu | Kannada Academic Learning Initiative',
  description:
    'Discover Belesu’s vision, mission, and thoughtful approach to Kannada academic learning through English-translated guidebooks and language development.',
  keywords: [
    'Kannada academic guidebooks',
    'English-translated Kannada guidebooks',
    'Kannada academic learning',
    'Kannada learning initiative',
    'Kannada guidebooks for school students',
  ],
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const guidebooks = [
    {
      series: 'Savi Kannada',
      classes: 'Classes 1 to 4',
      cover: '/covers/savi-4.png',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      series: 'Kali Kannada',
      classes: 'Classes 1 to 4',
      cover: '/covers/kali-1.png',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      series: 'Siri Kannada',
      classes: 'Class 5',
      cover: '/covers/siri-5.png',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    },
    {
      series: 'Tili Kannada',
      classes: 'Class 5',
      cover: '/covers/tili-5.png',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    },
  ];

  const bhasyaAreas = [
    {
      title: 'Listening',
      description:
        'Helping children become familiar with Kannada words, sounds, and spoken language.',
      icon: Headphones,
      iconBg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    },
    {
      title: 'Speaking',
      description:
        'Encouraging children to use Kannada and build confidence in everyday conversations.',
      icon: MessageSquare,
      iconBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    },
    {
      title: 'Reading',
      description:
        'Helping children recognise written Kannada and develop their reading skills.',
      icon: BookOpen,
      iconBg: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      
      {/* ── Breadcrumb ── */}
      <div className="bg-stone-50 border-b border-stone-200 py-2.5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">About Belesu</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. H1: About Belesu
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-gradient-to-b from-amber-50/50 via-amber-50/20 to-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            
            {/* Left Column: Heading & Introduction */}
            <div className="md:col-span-7 space-y-3">
              {/* Tagline */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Kannada Mathadi, Kannada Belesi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                About Belesu
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Belesu is a Kannada learning initiative that helps children understand Kannada academically and build confidence in using the language in everyday life. Through structured learning resources, Belesu aims to make Kannada more accessible to both Kannada-speaking and non-Kannada-speaking students.
              </p>
            </div>

            {/* Right Column: Mother and Child Visual */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-square rounded-2xl overflow-hidden border border-amber-200/90 bg-amber-50/40 shadow-sm">
                <img
                  src="/mother-and-child.png"
                  alt="Mother and child learning Kannada together with Belesu"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. H2: Our Vision & H2: Our Mission (Compact 2-Column Grid)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Our Vision */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 hover:border-amber-400 transition-all duration-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center mb-3">
                  <Compass className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight mb-2">
                  Our Vision
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Our vision is to promote Kannada across Karnataka by connecting academic learning with everyday communication. We want children to understand, learn and use Kannada confidently, both inside and outside the classroom.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 hover:border-amber-400 transition-all duration-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight mb-2">
                  Our Mission
                </h2>
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  <p>
                    Belesu focuses on primary school children, helping them develop Kannada language skills alongside their academic learning. By making Kannada lessons easier to understand and practise, we aim to build a strong foundation in reading, writing and everyday communication.
                  </p>
                  <p className="text-slate-800 font-medium">
                    Our long-term goal is to expand the reach of Kannada-speaking communities, with an ambition to increase Kannada-speaking population coverage to 18% by 2030.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. H2: What We Do & H3: Our Kannada Guidebooks (Non-clickable Display)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-stone-50/60 border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              What We Do
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <p>
                Belesu develops Kannada academic guidebooks for Classes 1 to 5, designed for both Kannada-speaking and non-Kannada-speaking students. The books connect Kannada textbook content with English translations, helping children understand lessons, learn word meanings and improve pronunciation.
              </p>
              <p>
                They also support parents who may have limited knowledge of Kannada and find it difficult to help their children with schoolwork. These guidebooks are supplementary learning resources intended to be used alongside prescribed textbooks.
              </p>
            </div>
          </div>

          {/* H3: Our Kannada Guidebooks */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 tracking-tight">
              Our Kannada Guidebooks
            </h3>

            {/* Static book covers display (Images should not link to purchase pages) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {guidebooks.map((book) => (
                <div
                  key={book.series}
                  className="bg-white rounded-xl p-3 border border-stone-200/90 shadow-2xs flex flex-col items-center select-none"
                >
                  <div className="relative aspect-[3/4] w-full max-w-[140px] flex items-center justify-center p-1 bg-stone-50 rounded-lg border border-stone-200/70 mb-2">
                    <img
                      src={book.cover}
                      alt={`${book.series} Guidebook`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 block truncate">
                      {book.series}
                    </span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1 ${book.badgeColor}`}>
                      {book.classes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. H2: Bhasya Belesu & H3s: Listening, Speaking, Reading
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          
          <div className="max-w-3xl space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Bhasya Belesu
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              Bhasya Belesu is based on the Matru Bhasya technique, using familiar, real-life activities to support a gradual and practical approach to learning Kannada.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              The approach focuses on three key areas:
            </p>
          </div>

          {/* 3 Key Areas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {bhasyaAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="bg-stone-50/70 rounded-xl p-4 sm:p-5 border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-2.5 ${area.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 mb-1.5">
                      {area.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {area.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. H2: Explore Belesu (CTAs)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 bg-gradient-to-b from-stone-50/50 via-amber-50/20 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Explore Belesu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Discover our Kannada academic guidebooks and find learning resources suitable for your child&apos;s class.
            </p>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/books"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-98 uppercase tracking-wider cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Our Kannada Guidebooks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs transition active:scale-98 uppercase tracking-wider cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>Contact Belesu</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
