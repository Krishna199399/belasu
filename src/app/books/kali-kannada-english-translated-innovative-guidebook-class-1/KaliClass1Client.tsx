'use client';

import React, { useState } from 'react';
import { BOOKS_DATA, PARENT_REVIEWS } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { MobileBookStickyBar } from '@/components/ui/MobileBookStickyBar';
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Truck,
  BookOpen,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { BookProduct } from '@/types';
import toast from 'react-hot-toast';

export default function KaliClass1Client() {
  const { addToCart, openCart } = useCart();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Kali Kannada Class 1 book data
  const book: BookProduct = BOOKS_DATA[4];

  // Related Kali books for Class 2, 3, 4
  const relatedBooks = [
    {
      id: 'kali-kannada-class-2',
      title: 'Kali Kannada English Translated Innovative Guidebook Class 2',
      shortTitle: 'Kali Kannada Class 2',
      slug: 'kali-kannada-english-translated-innovative-guidebook-class-2',
      gradeClass: 2,
      price: 290,
      coverImage: '/covers/kali-2.png',
    },
    {
      id: 'kali-kannada-class-3',
      title: 'Kali Kannada English Translated Innovative Guidebook Class 3',
      shortTitle: 'Kali Kannada Class 3',
      slug: 'kali-kannada-english-translated-innovative-guidebook-class-3',
      gradeClass: 3,
      price: 290,
      coverImage: '/covers/kali-3.png',
    },
    {
      id: 'kali-kannada-class-4',
      title: 'Kali Kannada English Translated Innovative Guidebook Class 4',
      shortTitle: 'Kali Kannada Class 4',
      slug: 'kali-kannada-english-translated-innovative-guidebook-class-4',
      gradeClass: 4,
      price: 295,
      coverImage: '/covers/kali-4.png',
    },
  ];

  // Duplicate reviews for seamless infinite marquee loop
  const marqueeReviews = [...PARENT_REVIEWS, ...PARENT_REVIEWS];

  const handleAddToCart = () => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart!`);
    openCart();
  };

  const keyBenefits = [
    'Foundational Kannada pronunciation guidance',
    'Kannada script with English transliteration',
    'Visual learning layouts for beginner concepts',
    'English notes to help parents support learning',
    'Structured practice for early Kannada development',
  ];

  const tableOfContents = [
    {
      label: 'Module 1',
      title: 'Module 1: Aksharamale Basics',
      description: 'Introduces the Kannada alphabet to help beginners recognise and become familiar with Kannada letters.',
    },
    {
      label: 'Module 2',
      title: 'Module 2: Simple 2-Letter Words',
      description: 'Helps children begin connecting Kannada letters and learning simple words.',
    },
    {
      label: 'Module 3',
      title: 'Module 3: Colours & Numbers in Kannada',
      description: 'Introduces familiar colours and numbers in Kannada to build foundational vocabulary.',
    },
    {
      label: 'Module 4',
      title: 'Module 4: Exercise Workbook',
      description: 'Provides practice activities to help children revisit and reinforce the concepts covered in the guidebook.',
    },
  ];

  const faqs = [
    {
      q: '1. What is the Kali Kannada Class 1 English-translated guidebook?',
      a: 'It is a supplementary guidebook for children beginning to learn Kannada, covering alphabet basics, pronunciation, simple vocabulary and practice activities.',
    },
    {
      q: '2. Does the guidebook include English transliteration?',
      a: 'Yes. It includes Kannada script with English transliteration to help beginners connect Kannada letters with familiar English-letter representations.',
    },
    {
      q: '3. Is this guidebook suitable for children who are new to Kannada?',
      a: 'The guidebook covers foundational topics such as the Kannada alphabet, simple two-letter words, colours and numbers, making it suitable for beginner-level practice.',
    },
    {
      q: '4. Can parents use this guidebook to support learning at home?',
      a: "Yes. English transliteration and parent assistance notes help parents follow the content and support their children's Kannada practice.",
    },
    {
      q: '5. Can this guidebook replace the school textbook?',
      a: 'No. It is intended to supplement the prescribed textbook and classroom learning by providing additional practice and explanations.',
    },
    {
      q: '6. What is the price, and how long does delivery take?',
      a: 'The guidebook costs ₹280 and includes free shipping. The estimated delivery time is 3–5 business days.',
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-0 text-slate-900">
      
      {/* ── Breadcrumb ── */}
      <div className="bg-stone-50 border-b border-stone-200 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-amber-600 transition">
                Home
              </Link>
              <span>/</span>
              <Link href="/books" className="hover:text-amber-600 flex items-center gap-1 transition">
                All Books
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold" aria-current="page">
                Kali Kannada Class 1
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              In Stock · Free Shipping
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. H1: Kali Kannada English Translated Innovative Guidebook Class 1
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 md:py-14 bg-gradient-to-b from-stone-50/70 via-amber-50/20 to-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Book Cover Showcase */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md flex flex-col items-center justify-center overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow-xs">
                    Class 1
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 uppercase tracking-wider">
                    Kali Series
                  </span>
                </div>

                <div className="my-6 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl">
                  <img
                    src={book.coverImage}
                    alt="Kali Kannada English Translated Innovative Guidebook Class 1"
                    className="max-h-72 sm:max-h-96 w-auto object-contain rounded-lg"
                  />
                </div>

                {/* Secondary CTA: Preview Inside */}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-900 font-bold text-xs border border-stone-300 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                >
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Preview Inside</span>
                </button>
              </div>

              {/* Karnataka State Board Aligned Badge Strip */}
              {book.karnatakaTextbookCover && (
                <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200/90 flex items-center gap-3.5 shadow-2xs">
                  <img
                    src={book.karnatakaTextbookCover}
                    alt="Karnataka State Board Class 1 Kali Kannada Textbook"
                    className="w-12 h-16 object-contain rounded border border-amber-300 shadow-2xs shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                      Karnataka State Board Aligned
                    </span>
                    <span className="text-xs font-semibold text-slate-800 leading-snug block">
                      English-translated companion engineered specifically for the official Class 1 Kali Kannada textbook.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Book Details Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Primary School Kannada Series</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 leading-tight">
                  Kali Kannada English Translated Innovative Guidebook Class 1
                </h1>
              </div>

              {/* Price, Availability, Shipping */}
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 py-3 border-y border-stone-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Price:</span>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹280
                  </span>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  ✓ In Stock
                </span>

                <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  🚚 Free Shipping
                </span>
              </div>

              {/* Exact Description */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                The Kali Kannada Class 1 English-translated guidebook is designed for children beginning their Kannada learning journey. With foundational pronunciation guidance, Kannada script practice and simple everyday vocabulary, it helps young learners become familiar with Kannada while giving parents additional support during home study.
              </p>

              {/* Key Benefits */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/90 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Benefits:
                </h2>
                <ul className="space-y-2">
                  {keyBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 min-h-[48px] py-4 px-6 rounded-xl font-black text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart | ₹280</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="min-h-[48px] py-4 px-6 rounded-xl font-bold text-slate-900 bg-white hover:bg-stone-100 border border-stone-300 shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Preview Inside</span>
                </button>
              </div>

              {/* Delivery & Curriculum Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-stone-100">
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Delivery:</strong> 3–5 Business Days</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Curriculum:</strong> Karnataka State Board Aligned</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2 & 3. Split Left/Right: Table of Contents & Academic Support
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: H2: Kali Kannada Class 1 Table of Contents */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                  Kali Kannada Class 1 Table of Contents
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tableOfContents.map((unit, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-2 hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 inline-block">
                      {unit.label}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-slate-900 leading-snug">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {unit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: H2: Academic Support for Class 1 Kannada */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                  Academic Support for Class 1 Kannada
                </h2>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <p>
                    The Kali Kannada Class 1 guidebook introduces foundational Kannada through alphabet practice, pronunciation guidance, English transliteration and simple vocabulary. Its visual learning layouts and English notes also help parents support children during home study.
                  </p>
                  <p>
                    It is a supplementary resource designed to complement the prescribed Karnataka State Board Kannada textbook and classroom teaching, not replace them.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. H2: Reviews from Parents and Students
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Reviews from Parents and Students
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
          5. H2: Frequently Asked Questions
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
          6. H2: Explore Related Kannada Guidebooks
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Explore Related Kannada Guidebooks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore other Kali Kannada guidebooks for different class levels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl">
            {relatedBooks.map((relBook) => (
              <div
                key={relBook.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Class {relBook.gradeClass}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{relBook.price}
                    </span>
                  </div>

                  <Link href={`/books/${relBook.slug}`} className="block">
                    <div className="h-48 flex items-center justify-center p-2 mb-3 bg-stone-50 rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={relBook.coverImage}
                        alt={relBook.title}
                        className="max-h-full w-auto object-contain drop-shadow-md rounded"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {relBook.title}
                    </h3>
                  </Link>
                </div>

                <Link
                  href={`/books/${relBook.slug}`}
                  className="w-full min-h-[40px] py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>View Class {relBook.gradeClass}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Book Preview Modal */}
      {isPreviewOpen && book && (
        <BookPreviewModal book={book} onClose={() => setIsPreviewOpen(false)} />
      )}

      {/* Mobile Sticky Bottom Purchase Bar */}
      <MobileBookStickyBar
        book={book}
        onAddToCart={handleAddToCart}
        onPreview={() => setIsPreviewOpen(true)}
      />

    </div>
  );
}
