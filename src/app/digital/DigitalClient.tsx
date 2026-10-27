'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PARENT_REVIEWS } from '@/data/mockData';
import {
  BookOpen,
  Lock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Eye,
  Laptop,
  Smartphone,
  Tablet,
  Star,
  CheckCircle,
  HelpCircle,
  Phone,
} from 'lucide-react';

export default function DigitalClient() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Reviews for continuous infinite marquee
  const marqueeReviews = [...PARENT_REVIEWS, ...PARENT_REVIEWS];

  const faqs = [
    {
      q: '1. What are Belesu digital academic guidebooks?',
      a: 'They are online Kannada learning resources that help students understand academic lessons through English translations and structured learning support.',
    },
    {
      q: '2. How are digital guidebooks different from physical books?',
      a: 'Digital guidebooks are accessed through an online reader, while physical guidebooks provide printed content. Choose the format that best suits your reading preferences.',
    },
    {
      q: '3. Do I need to install an app?',
      a: 'No. You can read your purchased guidebook through a compatible web browser on your phone, tablet or computer.',
    },
    {
      q: '4. Is digital access subscription-based?',
      a: 'No. You make a one-time purchase for the selected guidebook and receive lifetime access.',
    },
    {
      q: '5. Can I download or print the digital guidebook?',
      a: 'The guidebook is accessed through the Belesu web reader and is not supplied as a downloadable PDF. Reader protections are designed to restrict downloading and unauthorised sharing.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* ── Breadcrumb ── */}
      <div className="bg-stone-50 border-b border-stone-200 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Digital Guidebooks</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. H1: Discover Belesu's Digital Kannada Academic Guidebooks
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50/70 via-amber-50/20 to-white py-12 lg:py-16 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Digital Kannada Learning Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Discover Belesu&apos;s Digital Kannada Academic Guidebooks
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto font-normal">
              Understand Kannada lessons through English translations and access your digital guidebook online, anytime.
            </p>

            {/* 3 Core Bullet Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
              
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  English Translations
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Understand Kannada lessons more clearly.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold">
                  <Laptop className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Read Online
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access your guidebook through a compatible browser.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Lifetime Access
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pay once, with no recurring subscription.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. H2: Available Digital Guidebook
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Available Digital Guidebook
            </h2>
          </div>

          {/* Spotlight Book Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-stone-50/70 border border-stone-200 shadow-md overflow-hidden hover:border-amber-400 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
              
              {/* Left Column: Visual Cover */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-[280px]">
                  <div className="aspect-[3/4] rounded-2xl bg-white border border-stone-200 shadow-md overflow-hidden p-2 flex items-center justify-center relative">
                    <img
                      src="/digital/class-6-siri/cover.jpeg"
                      alt="Kannada Class 6 Digital Guidebook"
                      className="w-full h-full object-contain rounded-xl transition-transform duration-200 group-hover:scale-102"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span className="bg-slate-950/85 backdrop-blur-xs text-amber-400 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/30">
                        Class 6
                      </span>
                      <span className="bg-slate-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                        180 Pages
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Details & CTAs */}
              <div className="md:col-span-7 space-y-5">
                
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                    Kannada Class 6 Digital Guidebook
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    An English-translated Kannada guidebook that helps Class 6 students understand lessons, review chapter summaries and practise textbook questions.
                  </p>
                </div>

                {/* Specs List */}
                <div className="grid grid-cols-2 gap-3 py-2 text-xs text-slate-700">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Class:</strong>
                    <span>6</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Subject:</strong>
                    <span>Kannada</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Length:</strong>
                    <span>180 pages</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Price:</strong>
                    <span>₹199</span>
                  </div>
                  <div className="col-span-2 p-3 bg-white rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Access:</strong>
                    <span>Lifetime digital access with a one-time purchase</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/digital/kannada-class-6-guide"
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-md shadow-amber-500/20 cursor-pointer active:scale-98"
                  >
                    <BookOpen className="w-4 h-4 text-slate-950" />
                    <span>View Class 6 Guidebook</span>
                  </Link>

                  <Link
                    href="/reader/kannada-class-6-guide?preview=true"
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-stone-100 text-slate-800 border border-stone-300 transition cursor-pointer active:scale-98"
                  >
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>Preview 5 Free Pages</span>
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. H2: Reviews from Students and Parents
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Reviews from Students and Parents
          </h2>
        </div>

        {/* Continuous Infinite Marquee Showcase with Fade Masks */}
        <div className="relative overflow-hidden pause-hover py-2">
          {/* Left & Right Soft Blur Fade Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Infinite Marquee Track */}
          <div className="flex animate-marquee-left">
            {marqueeReviews.map((review, idx) => (
              <div
                key={`marquee-${review.id}-${idx}`}
                className="w-72 sm:w-80 shrink-0 bg-stone-50/70 p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 mx-3 hover:border-amber-400 hover:shadow-md transition-all select-none"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic line-clamp-4">
                    &ldquo;{review.reviewText}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1">
                      {review.parentName}
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    </h4>
                    <p className="text-[11px] text-slate-500">{review.childGrade} · {review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. H2: Introducing a New Digital Learning Experience
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Introducing a New Digital Learning Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Belesu&apos;s digital guidebooks offer an alternative to printed learning resources, helping students access Kannada academic support online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            {/* H3: Understand Lessons Through English */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Understand Lessons Through English
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                English translations and explanations help students follow Kannada lessons and understand unfamiliar content.
              </p>
            </div>

            {/* H3: Learn from Wherever You Are */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <Tablet className="w-3.5 h-3.5" />
                  <Laptop className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Learn from Wherever You Are
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Read your guidebook on a phone, tablet or computer through a compatible browser, without installing a separate app.
              </p>
            </div>

            {/* H3: One Purchase, Lifetime Access */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                One Purchase, Lifetime Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Make a one-time payment and retain lifetime access to your purchased guidebook, without a recurring subscription.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. H2: Digital Guidebooks or Physical Books? Choose What Works for You
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Digital Guidebooks or Physical Books? Choose What Works for You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Choose the format that best suits your reading preferences.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="overflow-x-auto touch-scroll overscroll-x-contain">
              <table className="w-full text-left border-collapse min-w-[540px]">
                <thead>
                  <tr className="bg-stone-100 text-slate-900 text-xs uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3.5 px-5 font-bold w-1/4">Feature</th>
                    <th className="py-3.5 px-5 font-bold w-3/8 text-amber-900 bg-amber-50/60">
                      Digital Guidebooks
                    </th>
                    <th className="py-3.5 px-5 font-bold w-3/8">Physical Guidebooks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs sm:text-sm text-slate-700">
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 bg-stone-50/50">Format</td>
                    <td className="py-3.5 px-5 font-medium text-amber-950 bg-amber-50/20">
                      Online web reader
                    </td>
                    <td className="py-3.5 px-5">Printed book</td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 bg-stone-50/50">Access</td>
                    <td className="py-3.5 px-5 font-medium text-amber-950 bg-amber-50/20">
                      Read on a compatible device
                    </td>
                    <td className="py-3.5 px-5">Read directly from the book</td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 bg-stone-50/50">Portability</td>
                    <td className="py-3.5 px-5 font-medium text-amber-950 bg-amber-50/20">
                      Access digitally without carrying a book
                    </td>
                    <td className="py-3.5 px-5">Carry your printed guidebook</td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 bg-stone-50/50">Reading Preference</td>
                    <td className="py-3.5 px-5 font-medium text-amber-950 bg-amber-50/20">
                      Suitable for screen-based reading
                    </td>
                    <td className="py-3.5 px-5">
                      Suitable for reading on paper
                    </td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 bg-stone-50/50">Purchase</td>
                    <td className="py-3.5 px-5 font-medium text-amber-950 bg-amber-50/20">
                      One-time purchase with lifetime digital access
                    </td>
                    <td className="py-3.5 px-5">Purchase a physical copy</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-xs text-slate-700 font-normal">
              Choose digital for convenient online access or physical for a printed guidebook for everyday study.
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. H2: More Digital Kannada Guidebooks Coming Soon
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              More Digital Kannada Guidebooks Coming Soon
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Belesu plans to expand its digital Kannada guidebooks to support students across additional classes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* H3: Tili Kannada Class 6 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 inline-block">
                Class 6
              </span>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Tili Kannada Class 6
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                A digital Kannada learning guidebook for Class 6 students.
              </p>
            </div>

            {/* H3: Siri Kannada Classes 7–10 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 inline-block">
                Classes 7–10
              </span>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Siri Kannada Classes 7–10
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Upcoming digital academic guides for secondary classes.
              </p>
            </div>

            {/* H3: Tili Kannada Classes 7–10 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200 inline-block">
                Classes 7–10
              </span>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Tili Kannada Classes 7–10
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                More digital guides to support Kannada learning across classes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. H2: Read Through the Belesu Web Reader
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Read Through the Belesu Web Reader
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Digital guidebooks are accessed through the Belesu web reader, designed to make reading convenient while helping protect the content.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200">
            <ul className="space-y-3">
              {[
                'Access through a compatible web browser.',
                'No separate app required.',
                'Lifetime access after a one-time purchase.',
                'Reader protections designed to restrict downloading and unauthorised sharing.',
                'Not available as downloadable PDF files.',
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. H2: Frequently Asked Questions
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-6 min-h-[56px] text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50"
                  >
                    <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. H2: Have Questions About Belesu Digital Guidebooks?
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Have Questions About Belesu Digital Guidebooks?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Need help choosing a guidebook or understanding digital access? Contact Belesu for product information and purchase assistance.
          </p>

          <div>
            <Link
              href="/contact"
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-md active:scale-98 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>Contact Belesu</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
