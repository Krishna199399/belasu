'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { PARENT_REVIEWS } from '@/data/mockData';
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
  Sparkles,
  Building2,
  Phone,
  Languages,
  Scroll,
  ShoppingCart,
  ZoomIn,
  Star,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PreviewTab {
  id: string;
  label: string;
  sublabel: string;
  imageUrl: string;
  title: string;
}

const PREVIEW_TABS: PreviewTab[] = [
  {
    id: 'cover',
    label: 'Cover',
    sublabel: 'Official',
    imageUrl: '/digital/class-6-siri/cover.jpeg',
    title: 'Official Belesu Class 6 Siri Kannada Guidebook Cover (Part 1 & Part 2)',
  },
  {
    id: 'poem',
    label: 'Poem',
    sublabel: 'Page 46',
    imageUrl: '/digital/class-6-siri/poem.jpeg',
    title: 'Poem 1: Besige (Summer) — Kannada with Line-by-Line English Translation',
  },
  {
    id: 'lesson',
    label: 'Lesson',
    sublabel: 'Page 12',
    imageUrl: '/digital/class-6-siri/lesson.jpeg',
    title: 'Lesson 2: Gandharva Sena — Story Explanation & Vocabulary Meanings',
  },
  {
    id: 'exercises',
    label: 'Exercises',
    sublabel: 'Page 03',
    imageUrl: '/digital/class-6-siri/exercises.jpeg',
    title: 'Solved Exercises — Fill in Blanks & Own Sentences with English Answers',
  },
];

export default function DigitalClass6Page() {
  const { user } = useAuth();
  const { addToCart, openCart } = useCart();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activePreview, setActivePreview] = useState<PreviewTab>(PREVIEW_TABS[0]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const book = DIGITAL_BOOKS_DATA[0]; // Class 6 Kannada digital guidebook
  const isOwned = user?.purchasedBooks?.digital?.includes(book.id);

  // Reviews for continuous infinite marquee
  const marqueeReviews = [...PARENT_REVIEWS, ...PARENT_REVIEWS];

  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(book, 'digital', 1);
    toast.success(`Added ${book.title} to cart!`);
    openCart();
  };

  const handleBuyNow = () => {
    addToCart(book, 'digital', 1);
    router.push('/checkout');
  };

  const keyBenefits = [
    {
      title: 'Understand Lessons',
      description: 'Follow Kannada content with English translations.',
      icon: Languages,
    },
    {
      title: 'Improve Comprehension',
      description: 'Explore prose, poems and grammar.',
      icon: BookOpen,
    },
    {
      title: 'Practise Questions',
      description: 'Review solved exercises and model answers.',
      icon: CheckCircle2,
    },
    {
      title: 'Revise Easily',
      description: 'Use bilingual chapter summaries for revision.',
      icon: Scroll,
    },
  ];

  const inclusions = [
    'Line-by-line English translations',
    'Kannada prose, poems and grammar',
    'Solved textbook exercises and model answers',
    'Chapter summaries in Kannada and English',
  ];

  const readerFeatures = [
    'One-time payment with lifetime access',
    'No recurring subscription',
    'Reader protections designed to restrict downloading and unauthorised sharing',
  ];

  const faqs = [
    {
      q: '1. What does the Class 6 Kannada digital guidebook include?',
      a: 'It includes line-by-line English translations, Kannada prose, poems and grammar, solved textbook exercises, model answers, and chapter summaries in Kannada and English.',
    },
    {
      q: '2. Is this guidebook suitable for Karnataka State Board students?',
      a: 'The guidebook is aligned with the Karnataka State Board Class 6 Kannada curriculum. Students should use it alongside their prescribed textbook.',
    },
    {
      q: '3. How much does the digital guidebook cost?',
      a: 'The guidebook costs ₹199, payable once for lifetime digital access.',
    },
    {
      q: '4. Can I read the guidebook on my phone?',
      a: 'Yes. You can access it through a compatible web browser on your phone, tablet or computer without installing a separate app.',
    },
    {
      q: '5. Can I download the guidebook as a PDF?',
      a: 'No. The guidebook is provided through the Belesu online reader and is not available as a downloadable PDF.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 lg:pb-0">
      
      {/* ── BREADCRUMB ── */}
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
          1. HERO SECTION (H1)
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
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Understand Class 6 Kannada lessons through English translations, solved textbook exercises and chapter summaries. Access your guidebook online through Belesu&apos;s digital reader.
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
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-black bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all transform active:scale-[0.99] shadow-lg shadow-amber-500/25 cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 text-slate-950" />
                      <span>Buy & Read for ₹199</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-base font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition cursor-pointer"
                    >
                      <span>Add to Cart</span>
                    </button>
                    <Link
                      href="/reader/kannada-class-6-guide?preview=true"
                      className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-base font-bold bg-white hover:bg-stone-50 text-slate-800 border-2 border-stone-300 transition cursor-pointer"
                    >
                      <Eye className="w-5 h-5 text-amber-600" />
                      <span>Preview Free Pages</span>
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

            {/* Right: Book Showcase with Authentic Cover & Sample Scans */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[360px]">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

                {/* Digital Showcase Card */}
                <div className="relative rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-stone-200 space-y-3">
                  
                  {/* Stage Image */}
                  <div 
                    onClick={() => setIsZoomed(true)}
                    className="relative cursor-pointer rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-inner group/img aspect-[3/4] flex items-center justify-center p-1"
                  >
                    <img
                      src={activePreview.imageUrl}
                      alt={activePreview.title}
                      className="w-full h-full object-contain rounded-lg transition-transform duration-200 group-hover/img:scale-102"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                      <span className="bg-slate-950/85 backdrop-blur-xs text-amber-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/30">
                        Class 6 Siri
                      </span>
                      <span className="bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                        180 Pages
                      </span>
                    </div>

                    {/* Zoom Prompt on Hover */}
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <span className="px-3 py-1 rounded-full bg-white/95 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                        <span>Click to Enlarge</span>
                      </span>
                    </div>

                    {/* Scan Caption */}
                    <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-medium text-center truncate pointer-events-none">
                      {activePreview.title}
                    </div>
                  </div>

                  {/* Interactive 4-tab dock */}
                  <div className="grid grid-cols-4 gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
                    {PREVIEW_TABS.map((tab) => {
                      const isActive = activePreview.id === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActivePreview(tab)}
                          className={`px-1.5 py-1 rounded-lg text-center transition-all cursor-pointer ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs font-bold'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-stone-200/60'
                          }`}
                        >
                          <div className="text-[11px] leading-tight font-bold">{tab.label}</div>
                          <div className="text-[9px] text-amber-500 leading-none mt-0.5">{tab.sublabel}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Format & Preview link */}
                  <div className="pt-1 flex items-center justify-between text-xs text-slate-600 border-t border-stone-100">
                    <span className="font-semibold text-slate-700">Format: Online web reader</span>
                    <Link
                      href="/reader/kannada-class-6-guide?preview=true"
                      className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview 5 Free Pages
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. H2: Key Benefits
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
              Key Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {keyBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. H2: Reviews from Students and Parents
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight text-center sm:text-left">
            Reviews from Students and Parents
          </h2>
        </div>

        {/* Continuous Infinite Marquee Showcase with Fade Masks */}
        <div className="relative overflow-hidden pause-hover py-2">
          {/* Left & Right Soft Blur Fade Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-stone-50 via-stone-50/80 to-transparent z-10" />

          {/* Infinite Marquee Track */}
          <div className="flex animate-marquee-left">
            {marqueeReviews.map((review, idx) => (
              <div
                key={`marquee-${review.id}-${idx}`}
                className="w-72 sm:w-80 shrink-0 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 mx-3 hover:border-amber-400 hover:shadow-md transition-all select-none"
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

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
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
          5. H2: What's Included in the Digital Guidebook?
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
              What&apos;s Included in the Digital Guidebook?
            </h2>
          </div>

          <div className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto space-y-4">
            <ul className="space-y-3.5">
              {inclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-stone-200">
              <Link
                href="/reader/kannada-class-6-guide?preview=true"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-900 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview 5 Free Pages</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. H2: Read Through the Belesu Web Reader
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
              Read Through the Belesu Web Reader
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Access your purchased guidebook through a compatible browser on your phone, tablet or computer, without installing a separate app.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4">
            <ul className="space-y-3">
              {readerFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-700/80">
              <p className="text-xs text-slate-300 font-medium">
                <strong>Please note:</strong> The guidebook is available through the online reader and is not provided as a downloadable PDF.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. H2: Frequently Asked Questions
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
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
                    <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 font-normal">
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
          8. H2: Get Your Class 6 Kannada Digital Guidebook
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
            Get Your Class 6 Kannada Digital Guidebook
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Support Kannada learning with English translations, solved exercises and chapter summaries in one digital guidebook.
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
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-black bg-slate-950 hover:bg-slate-900 text-white transition-all transform active:scale-95 shadow-xl cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <span>Buy & Read for ₹199</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base sm:text-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-md"
                >
                  <span>Add to Cart</span>
                </button>
                <Link
                  href="/reader/kannada-class-6-guide?preview=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base sm:text-lg font-bold bg-white/90 hover:bg-white text-slate-950 border border-slate-900/10 transition cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-amber-700" />
                  <span>Preview Free Pages</span>
                </Link>
              </>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-800 pt-2 italic">
            One-time payment. Lifetime digital access. No recurring subscription
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. CORPORATE CREDIBILITY STRIP
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
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                <strong>Operations Office:</strong> VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018
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

      {/* Zoom Preview Modal */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-xl max-h-[92vh] bg-white rounded-2xl p-3 shadow-2xl flex flex-col items-center"
          >
            <img
              src={activePreview.imageUrl}
              alt={activePreview.title}
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <div className="mt-2 text-xs font-bold text-slate-800 text-center">
              {activePreview.title}
            </div>
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="mt-2 px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 pb-safe z-40 shadow-xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
            ₹199
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 truncate">
            {isOwned ? 'In Your Library' : 'Lifetime Digital Access'}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOwned ? (
            <Link
              href="/reader/kannada-class-6-guide"
              className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Now</span>
            </Link>
          ) : (
            <>
              <Link
                href="/reader/kannada-class-6-guide?preview=true"
                className="min-h-[44px] min-w-[40px] px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition"
                aria-label="Preview free pages"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="hidden xs:inline">Preview</span>
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                className="min-h-[44px] px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="min-h-[44px] px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
