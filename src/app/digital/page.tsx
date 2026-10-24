'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
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
  Check,
  HelpCircle,
  Phone,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DigitalBooksPage() {
  const { user } = useAuth();
  const [booksList, setBooksList] = useState<DigitalBook[]>(DIGITAL_BOOKS_DATA);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/digital/books', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.books)) {
          setBooksList(data.books);
        }
      })
      .catch((err) => console.error('Failed to fetch digital books list:', err));
  }, []);

  const class6Book = booksList.find((b) => b.gradeClass === 6) || DIGITAL_BOOKS_DATA[0];
  const isClass6Owned = user?.purchasedBooks?.digital?.includes(class6Book.id);

  const faqs = [
    {
      q: 'What are Belesu digital academic guidebooks?',
      a: 'They are online Kannada learning resources designed to help students understand academic lessons through English translations and structured learning support.',
    },
    {
      q: 'How are digital guidebooks different from physical books?',
      a: 'Digital guidebooks are accessed through an online reader, while physical guidebooks provide printed content. Choose the format that best suits your reading preferences.',
    },
    {
      q: 'Do I need to install an app?',
      a: 'No. You can read your purchased guidebook through a compatible web browser on your phone, tablet or computer.',
    },
    {
      q: 'Is digital access subscription-based?',
      a: 'No. You make a one-time purchase for the selected guidebook and receive lifetime access.',
    },
    {
      q: 'Can I download or print the digital guidebook?',
      a: 'The guidebook is provided through the Belesu web reader rather than as a downloadable PDF. Reader protections are designed to restrict downloading and unauthorized sharing.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. BREADCRUMB STRIP
      ══════════════════════════════════════════════════════════════════════════ */}
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
          2. HERO SECTION (H1)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 py-12 lg:py-20 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Platform Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Digital Learning Platform</span>
            </div>

            {/* Primary Heading H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Discover Belesu's Digital Kannada Academic Guidebooks
            </h1>

            {/* Introductory Summary */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
              A new way to access Kannada academic learning resources. Belesu's digital guidebooks help students understand Kannada lessons through English translations and structured learning support, with the convenience of reading online.
            </p>

            {/* Tagline Highlight */}
            <div className="pt-2">
              <p className="text-lg sm:text-xl font-black text-amber-700 tracking-wide">
                Learn with clarity. Read online. Access for life.
              </p>
            </div>

            {/* 3 Core Hero Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
              
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Understand Kannada Better
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Follow lessons with English translations and explanations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold">
                  <Laptop className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Read on Your Devices
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access your guidebook through a compatible web browser.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Pay Once, Access for Life
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No recurring subscription for your purchased digital guidebook.
                </p>
              </div>

            </div>

            {/* Quick Action Links */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#available-book"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-lg shadow-amber-500/20"
              >
                <span>Explore Class 6 Digital Guidebook</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#comparison-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300 transition"
              >
                <span>Digital vs Physical Comparison</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. INTRODUCING A NEW DIGITAL LEARNING EXPERIENCE (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Modern Learning Medium
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Introducing a New Digital Learning Experience
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Belesu is bringing its Kannada academic learning resources into a digital format, giving students another way to access learning support beyond printed books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* H3: Understand Lessons Through English */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Understand Lessons Through English
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                English translations and structured learning support help students follow Kannada academic content with greater clarity.
              </p>
            </div>

            {/* H3: Learn from Wherever You Are */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4" />
                  <Tablet className="w-4 h-4" />
                  <Laptop className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Learn from Wherever You Are
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Read your digital guidebook through a compatible browser on your phone, tablet or computer, without installing a separate app.
              </p>
            </div>

            {/* H3: One Purchase, Lifetime Access */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                One Purchase, Lifetime Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Make a one-time payment and retain lifetime access to your purchased digital guidebook, without a recurring subscription.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. COMPARISON: DIGITAL VS PHYSICAL GUIDEBOOKS (H2 & TABLE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="comparison-section" className="py-14 sm:py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Format Decision Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Digital Guidebooks or Physical Books? Choose What Works for You
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Belesu offers different ways to access Kannada academic learning resources. Choose based on how you prefer to study.
            </p>
          </div>

          {/* Comparison Table Container */}
          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs sm:text-sm uppercase tracking-wider">
                    <th className="py-4 px-5 sm:px-6 font-bold w-1/4">Feature</th>
                    <th className="py-4 px-5 sm:px-6 font-bold w-3/8 text-amber-400 bg-slate-950">
                      Digital Guidebooks
                    </th>
                    <th className="py-4 px-5 sm:px-6 font-bold w-3/8">Physical Guidebooks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs sm:text-sm text-slate-700">
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 bg-stone-50/50">Format</td>
                    <td className="py-4 px-5 sm:px-6 font-medium text-amber-900 bg-amber-50/30">
                      Online web reader
                    </td>
                    <td className="py-4 px-5 sm:px-6">Printed book</td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 bg-stone-50/50">Access</td>
                    <td className="py-4 px-5 sm:px-6 font-medium text-amber-900 bg-amber-50/30">
                      Read on a compatible device
                    </td>
                    <td className="py-4 px-5 sm:px-6">Read directly from the book</td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 bg-stone-50/50">Portability</td>
                    <td className="py-4 px-5 sm:px-6 font-medium text-amber-900 bg-amber-50/30">
                      Access digitally without carrying a book
                    </td>
                    <td className="py-4 px-5 sm:px-6">Carry your printed guidebook</td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 bg-stone-50/50">Reading preference</td>
                    <td className="py-4 px-5 sm:px-6 font-medium text-amber-900 bg-amber-50/30">
                      Suitable for students comfortable with screen-based reading
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      Suitable for students who prefer reading on paper
                    </td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 bg-stone-50/50">Purchase</td>
                    <td className="py-4 px-5 sm:px-6 font-medium text-amber-900 bg-amber-50/30">
                      One-time purchase with lifetime digital access
                    </td>
                    <td className="py-4 px-5 sm:px-6">Purchase a physical copy</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Decision Guidance Footer */}
            <div className="p-6 bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 border-t border-stone-200">
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium text-center">
                <strong>Choose digital</strong> if you prefer online access and the convenience of reading on your devices. <strong>Choose physical</strong> if you prefer a printed book for everyday study.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. AVAILABLE DIGITAL GUIDEBOOK (H2 & H3)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="available-book" className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Available Now
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Available Digital Guidebook
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Instant access upon purchase — start reading in seconds on any web browser.
            </p>
          </div>

          {/* Spotlight Book Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-stone-50 to-white border-2 border-stone-200 shadow-xl overflow-hidden hover:border-amber-400 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
              
              {/* Left Column: Visual Cover */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-[280px]">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col justify-between p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="bg-white/90 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        Class 6
                      </span>
                      <span className="bg-black/30 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        180 Pages
                      </span>
                    </div>

                    <div className="text-center py-6 z-10">
                      <span className="text-5xl block mb-2">📖</span>
                      <h4 className="text-lg font-black tracking-tight leading-snug">
                        Kannada Class 6
                      </h4>
                      <p className="text-xs text-amber-100 font-medium">Digital Academic Guide</p>
                    </div>

                    <div className="bg-black/40 backdrop-blur rounded-xl p-2.5 text-center text-xs text-amber-200 font-semibold z-10">
                      Web Reader • Lifetime Access
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Specs & CTAs */}
              <div className="md:col-span-7 space-y-5">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      Subject: Kannada
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Class 6
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Kannada Class 6 Digital Guidebook
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    An English-translated Kannada guidebook designed to support Class 6 students with lesson explanations, solved textbook exercises and chapter summaries.
                  </p>
                </div>

                {/* Specs List */}
                <div className="grid grid-cols-2 gap-3 py-2 text-xs text-slate-700">
                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Class</strong>
                    <span>6</span>
                  </div>
                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Subject</strong>
                    <span>Kannada</span>
                  </div>
                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Length</strong>
                    <span>180 pages</span>
                  </div>
                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200">
                    <strong className="block text-slate-900 font-bold">Access</strong>
                    <span>Lifetime digital access</span>
                  </div>
                </div>

                {/* Pricing & CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div>
                    <span className="text-3xl font-black text-slate-900 block leading-none">₹199</span>
                    <span className="text-xs text-slate-500 font-medium">One-time purchase</span>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
                    {isClass6Owned ? (
                      <Link
                        href="/reader/kannada-class-6-guide"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Read Now</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/digital/kannada-class-6-guide"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-slate-950" />
                          <span>View Class 6 Guidebook</span>
                        </Link>
                        <Link
                          href="/reader/kannada-class-6-guide?preview=true"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-stone-50 text-slate-800 border-2 border-stone-300 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-amber-600" />
                          <span>Preview 5 Free Pages</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. MORE DIGITAL KANNADA GUIDEBOOKS COMING SOON (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              More Digital Kannada Guidebooks Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We are expanding the Belesu digital library across higher grades and both prescribed Karnataka curriculums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Upcoming 1: Tili Kannada Class 6 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Class 6
                </span>
                <span className="text-xs text-amber-600 font-bold">Coming Soon</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Tili Kannada</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Class 6</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A digital Kannada learning guidebook for Class 6 students.
              </p>
            </div>

            {/* Upcoming 2: Siri Kannada Classes 7-10 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Classes 7–10
                </span>
                <span className="text-xs text-amber-600 font-bold">Coming Soon</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Siri Kannada</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Classes 7–10</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                More digital Kannada academic guides for secondary classes.
              </p>
            </div>

            {/* Upcoming 3: Tili Kannada Classes 7-10 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Classes 7–10
                </span>
                <span className="text-xs text-amber-600 font-bold">Coming Soon</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Tili Kannada</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Classes 7–10</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Upcoming digital guides to support Kannada learning across classes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. READ THROUGH THE BELESU WEB READER (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Secure Digital Reading Experience
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Read Through the Belesu Web Reader
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your digital guidebook is accessed through an online reader designed to make reading convenient while helping protect the content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Browser-Based Access
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Access through a compatible web browser.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Zero App Installation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No separate app required.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Lifetime Digital Access
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lifetime access after a one-time purchase.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Reader Protections
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reader protections designed to restrict downloading and unauthorized sharing.
              </p>
            </div>

          </div>

          {/* Reader PDF Notice */}
          <div className="mt-8 max-w-2xl mx-auto p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 text-center">
            <p className="text-xs text-slate-300 font-medium">
              Digital guidebooks are available through the web reader and are not supplied as downloadable PDF files.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about Belesu's digital Kannada learning platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50/80 transition cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100">
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
          9. HAVE QUESTIONS ABOUT BELESU DIGITAL GUIDEBOOKS? (H2 & CTA)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Platform Support & Inquiries
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
            Have Questions About Belesu Digital Guidebooks?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Need help choosing a guidebook or want to know more about the digital learning platform? Get in touch with Belesu, and our team can help you with your questions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-black bg-slate-950 hover:bg-slate-900 text-white transition-all transform active:scale-95 shadow-xl cursor-pointer"
            >
              <Phone className="w-5 h-5 text-amber-400" />
              <span>Contact Belesu</span>
            </Link>
          </div>

          <p className="text-xs font-semibold text-slate-800 pt-2">
            For product details, digital access enquiries and assistance with your purchase.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          10. CORPORATE CREDIBILITY STRIP
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Physical Books</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Support</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
