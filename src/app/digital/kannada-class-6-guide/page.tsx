'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  BookOpen,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Eye,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
  HelpCircle,
  Building2,
  Phone,
  Languages,
  FileText,
  Scroll,
  Layers,
  ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DigitalClass6Page() {
  const { user } = useAuth();
  const { addToCart, openCart } = useCart();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const book = DIGITAL_BOOKS_DATA[0]; // Class 6 Kannada digital guidebook
  const isOwned = user?.purchasedBooks?.digital?.includes(book.id);

  const handleAddToCart = () => {
    addToCart(book, 'digital', 1);
    toast.success(`Added ${book.title} to cart!`);
    openCart();
  };

  const inclusions = [
    'Complete Class 6 Kannada guidebook',
    'Line-by-line English translations',
    'Prose, poems and grammar coverage',
    'Solved textbook exercises and model answers',
    'Chapter summaries in Kannada and English',
  ];

  const productDetails = [
    { label: 'Class', value: '6' },
    { label: 'Subject', value: 'Kannada' },
    { label: 'Pages', value: '180' },
    { label: 'Curriculum', value: 'Karnataka State Board' },
    { label: 'Format', value: 'Secure online web reader' },
    { label: 'Price', value: '₹199' },
    { label: 'Access', value: 'Lifetime digital access' },
  ];

  const faqs = [
    {
      q: 'What does the Class 6 Kannada digital guidebook include?',
      a: 'It includes line-by-line English translations, Kannada prose, poems and grammar, solved textbook exercises, model answers, and chapter summaries in Kannada and English.',
    },
    {
      q: 'Is this guidebook suitable for Karnataka State Board students?',
      a: 'The guidebook is aligned with the Karnataka State Board Class 6 Kannada curriculum. Students should continue using their prescribed textbook alongside supplementary learning resources.',
    },
    {
      q: 'How much does the digital guidebook cost?',
      a: 'The Class 6 Kannada digital guidebook costs ₹199, payable once for lifetime digital access.',
    },
    {
      q: 'Can I read the guidebook on my phone?',
      a: 'Yes. You can access it through a compatible web browser on a phone, tablet or computer without installing a separate app.',
    },
    {
      q: 'Can I download the guidebook as a PDF?',
      a: 'No. The guidebook is provided through the Belesu online reader, with protections designed to restrict downloading and unauthorized sharing.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. BREADCRUMBS
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-stone-50 border-b border-stone-200 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <Link href="/digital" className="hover:text-amber-600 transition">Digital Guidebooks</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Class 6 Kannada</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. HERO SECTION (H1)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 py-10 lg:py-16 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Book Details & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Karnataka State Board Edition
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instant Web Access
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-200 text-slate-700">
                  SKU: SD6-KN
                </span>
              </div>

              {/* Main Heading H1 */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Class 6 Kannada Digital Guidebook with English Translation
                </h1>
                <p className="text-sm sm:text-base font-semibold text-amber-800">
                  ₹199 | One-Time Payment | Lifetime Digital Access
                </p>
              </div>

              {/* Price & Offer Card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm inline-flex flex-wrap items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">₹199</span>
                  <span className="text-base text-slate-400 line-through">₹349</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save ₹150
                  </span>
                </div>
                <div className="h-4 w-px bg-stone-200 hidden sm:block"></div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>One-time payment • Lifetime digital access • No subscription</span>
                </div>
              </div>

              {/* Intro text */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Understand your Class 6 Kannada lessons with the Belesu digital guidebook. Explore Kannada prose, poems and grammar with line-by-line English translations, solved textbook exercises and chapter summaries, all accessible through an online reader.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {isOwned ? (
                  <Link
                    href="/reader/kannada-class-6-guide"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-lg"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Open in Web Reader</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/digital/kannada-class-6-guide/purchase"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-black bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all transform active:scale-[0.99] shadow-lg shadow-amber-500/25 cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 text-slate-950" />
                      <span>Buy & Read for ₹199</span>
                    </Link>
                    <Link
                      href="/reader/kannada-class-6-guide?preview=true"
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold bg-white hover:bg-stone-50 text-slate-800 border-2 border-stone-300 transition cursor-pointer"
                    >
                      <Eye className="w-5 h-5 text-amber-600" />
                      <span>Preview 5 Free Pages</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Secure Web Reader
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Laptop className="w-4 h-4 text-amber-600" /> Compatible with Phones, Tablets & PC
                </span>
              </div>

            </div>

            {/* Right: Book Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[340px]">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

                {/* Digital Card */}
                <div className="relative rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4">
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex flex-col justify-between p-6 text-white shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="bg-white/95 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        Class 6
                      </span>
                      <span className="bg-black/30 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        180 Pages
                      </span>
                    </div>

                    <div className="text-center py-6 z-10">
                      <div className="text-5xl mb-2">📚</div>
                      <h3 className="text-xl font-black tracking-tight leading-tight">
                        Kannada Class 6
                      </h3>
                      <p className="text-xs text-amber-100 font-medium mt-1">
                        English-Translated Digital Guidebook
                      </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur rounded-xl p-2.5 text-center text-xs text-amber-200 font-semibold z-10">
                      Line-by-Line English Translation
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold">Format: Secure Web Reader</span>
                    <Link
                      href="/reader/kannada-class-6-guide?preview=true"
                      className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Free Pages
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. UNDERSTAND KANNADA LESSONS WITH GREATER CLARITY (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Pedagogical Clarity
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Understand Kannada Lessons with Greater Clarity
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Designed specifically for English-medium students and parents seeking comprehensive guidance across the Karnataka State Board Class 6 curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* H3: Line-by-Line English Translation */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Line-by-Line English Translation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Follow Kannada lessons with English translations that help you understand the meaning of the text.
              </p>
            </div>

            {/* H3: Lessons, Poems and Grammar */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Lessons, Poems and Grammar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Access learning support across Kannada prose, poems and grammar chapters in one digital guidebook.
              </p>
            </div>

            {/* H3: Solved Textbook Exercises */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Solved Textbook Exercises
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Use solved exercises and model answers to support your study and revision.
              </p>
            </div>

            {/* H3: Chapter Summaries in Two Languages */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                <Scroll className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Chapter Summaries in Two Languages
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review key lesson concepts through chapter summaries in Kannada and English.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. WHAT'S INCLUDED & PRODUCT DETAILS (H2 & TABLE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Complete Curriculum Package
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              What's Included in the Digital Guidebook?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Everything needed to achieve mastery and remove language anxiety in Class 6 Kannada.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            
            {/* Left: What's Included Bullets */}
            <div className="lg:col-span-6 space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-stone-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Included Resources
              </h3>
              <ul className="space-y-3">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-stone-100">
                <Link
                  href="/reader/kannada-class-6-guide?preview=true"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-900 hover:bg-amber-500 hover:text-slate-950 transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Free Sample Pages</span>
                </Link>
              </div>
            </div>

            {/* Right: Product Details Table */}
            <div className="lg:col-span-6 overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base">Product Details</h3>
                <span className="text-xs text-amber-400 font-semibold">SKU: SD6-KN</span>
              </div>
              <div className="divide-y divide-stone-200 text-xs sm:text-sm">
                {productDetails.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 px-5 hover:bg-stone-50 transition">
                    <span className="font-bold text-slate-700">{row.label}</span>
                    <span className="font-semibold text-slate-900 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. READ ONLINE WITH BELESU'S SECURE WEB READER (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Protected Platform
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Read Online with Belesu's Secure Web Reader
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Access your purchased guidebook through a compatible web browser without installing a separate app.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Universal Devices</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Read on a compatible phone, tablet or computer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Lifetime Access</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get lifetime access with a one-time purchase.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Zero Subscriptions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No recurring subscription.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Content Security</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reader protections designed to restrict downloading and unauthorized sharing.
              </p>
            </div>

          </div>

          {/* Reader Note */}
          <div className="mt-8 max-w-2xl mx-auto p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 text-center">
            <p className="text-xs text-slate-300 font-medium">
              <strong>Please note:</strong> The guidebook is available through the online reader and is not provided as a downloadable PDF.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. FREQUENTLY ASKED QUESTIONS (H2 & H3s)
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
              Everything you need to know about the Class 6 Kannada digital guidebook.
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
          7. GET YOUR CLASS 6 KANNADA DIGITAL GUIDEBOOK (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Instant Digital Access
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
            Get Your Class 6 Kannada Digital Guidebook
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Make Kannada lessons easier to follow with English translations, solved exercises and chapter summaries in one convenient digital resource.
          </p>

          <div className="p-3 bg-slate-950/10 rounded-2xl max-w-xs mx-auto">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 block">Price: ₹199</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isOwned ? (
              <Link
                href="/reader/kannada-class-6-guide"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-black bg-slate-950 hover:bg-slate-900 text-white transition shadow-xl cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Open in Web Reader</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/digital/kannada-class-6-guide/purchase"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-black bg-slate-950 hover:bg-slate-900 text-white transition-all transform active:scale-95 shadow-xl cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <span>Buy & Read for ₹199</span>
                </Link>
                <Link
                  href="/reader/kannada-class-6-guide?preview=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base sm:text-lg font-bold bg-white/90 hover:bg-white text-slate-950 border border-slate-900/10 transition cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-amber-700" />
                  <span>Preview 5 Free Pages</span>
                </Link>
              </>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-800 pt-2">
            One-time payment. Lifetime digital access. No recurring subscription.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. CORPORATE CREDIBILITY STRIP
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
                href="/digital"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>All Digital Books</span>
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
