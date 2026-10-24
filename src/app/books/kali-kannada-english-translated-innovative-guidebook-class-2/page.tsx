'use client';

import React, { useState } from 'react';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Languages,
  BookMarked,
  GraduationCap,
  Home,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Building2,
  Phone,
  Volume2,
  FileCheck2,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { BookProduct } from '@/types';
import toast from 'react-hot-toast';

export default function KaliClass2Page() {
  const { addToCart, openCart } = useCart();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Kali Kannada Class 2 book data
  const book: BookProduct = BOOKS_DATA[5];

  // Related Kali books for Class 1, 3, 4
  const relatedBooks = BOOKS_DATA.filter(
    (b) => b.series === 'Kali' && b.gradeClass !== 2
  );

  const handleAddToCart = () => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart!`);
    openCart();
  };

  const keyBenefits = [
    'English translations with sentence-level grammar explanations',
    'Interactive exercises with solved answer keys',
    'Pronunciation guidance for new vocabulary',
    'Visual summaries of Kannada stories',
    'Additional support for homework and revision',
  ];

  const faqs = [
    {
      q: 'What is the Kali Kannada Class 2 English-translated guidebook?',
      a: 'It is a supplementary academic guidebook designed to help Class 2 students understand Kannada lessons through English translations, grammar explanations, pronunciation guidance and solved exercises.',
    },
    {
      q: 'Does the Kali Kannada Class 2 guidebook include solved exercises?',
      a: 'Yes. The listed features include interactive exercises with solved answer keys and a section covering textbook solved answers.',
    },
    {
      q: 'Is this guidebook suitable for students who are not fluent in Kannada?',
      a: 'The guidebook is designed to support students and families who benefit from English translations and explanations while learning Kannada. Parents should check the sample pages and syllabus alignment before purchasing.',
    },
    {
      q: 'Can this guidebook replace the school textbook?',
      a: 'No. The Kali Kannada Class 2 guidebook is a supplementary learning resource intended to support the prescribed textbook and classroom teaching.',
    },
    {
      q: 'How much does the Kali Kannada Class 2 guidebook cost, and how can I order it?',
      a: 'The listed price is ₹290. You can order through the product page by selecting Add to Cart and following the checkout process. The page lists free shipping and an estimated delivery time of 3–5 business days.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. BREADCRUMB & BACK LINK
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-stone-50 border-b border-stone-200 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <Link href="/books" className="hover:text-amber-600 flex items-center gap-1.5 transition">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Books
              </Link>
              <span>/</span>
              <span className="text-slate-400">Kali Kannada</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Class 2</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              In Stock · Free Shipping
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. PRODUCT HERO STAGE (H1)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-stone-50/70 via-amber-50/20 to-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (5 cols): Book Mockup, State Textbook Companion, and Quick Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative bg-white rounded-3xl p-8 border border-stone-200 shadow-md flex flex-col items-center justify-center overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow-xs">
                    Class 2
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 uppercase tracking-wider">
                    Kali Series
                  </span>
                </div>

                <div className="my-6 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="max-h-80 sm:max-h-96 w-auto object-contain rounded-lg"
                  />
                </div>

                {/* Secondary CTA: Preview Inside */}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-900 font-bold text-xs border border-stone-300 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Preview Inside (Sample Pages)</span>
                </button>
              </div>

              {/* Karnataka State Board Textbook Companion Strip */}
              {book.karnatakaTextbookCover && (
                <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200/90 flex items-center gap-3.5 shadow-2xs">
                  <img
                    src={book.karnatakaTextbookCover}
                    alt="Karnataka State Board Class 2 Kali Kannada Textbook"
                    className="w-12 h-16 object-contain rounded border border-amber-300 shadow-2xs shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                      Karnataka State Board Aligned
                    </span>
                    <span className="text-xs font-semibold text-slate-800 leading-snug block">
                      English-translated companion engineered specifically for the official Class 2 Kali Kannada textbook.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (7 cols): Editorial Title, Price, Key Benefits, CTAs, and Guarantees */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Primary School Kannada Series</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 leading-tight">
                  Kali Kannada English Translated Innovative Guidebook Class 2
                </h1>
              </div>

              {/* Pricing & Availability Bar */}
              <div className="flex flex-wrap items-baseline gap-4 py-3 border-y border-stone-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{book.price}
                  </span>
                  {book.originalPrice && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{book.originalPrice}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  ✓ In Stock ({book.stockQuantity} available)
                </span>

                <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  🚚 Free Shipping
                </span>
              </div>

              {/* Overview Narrative */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                The Kali Kannada Class 2 English-translated guidebook helps children understand their
                Kannada lessons through English translations, grammar explanations and solved exercises.
                Designed to support students and families who may not be familiar with Kannada, it provides
                additional help with homework, vocabulary and lesson revision at home.
              </p>

              {/* Key Benefits Checklist */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/90 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Benefits:
                </h2>
                <div className="space-y-2">
                  {keyBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-xl font-black text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (₹290)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="py-4 px-6 rounded-xl font-bold text-slate-900 bg-white hover:bg-stone-100 border border-stone-300 shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Preview Inside</span>
                </button>
              </div>

              {/* Delivery & Curriculum Metadata Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-stone-100">
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Delivery:</strong> 3–5 Business Days across Karnataka</span>
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
          3. KEY FEATURES AND HIGHLIGHTS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Pedagogical Strengths
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Kali Kannada Class 2 Guidebook: Key Features and Highlights
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              The Kali Kannada Class 2 English-translated guidebook provides additional learning support
              for students as they work through Kannada stories, poems and grammar. English explanations,
              pronunciation guidance and solved exercises help children follow lesson content and give
              parents a resource to refer to during home study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="bg-stone-50/90 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                  <Languages className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Sentence Translations with Grammar Explanations
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  English translations accompanied by grammar breakdowns help students understand Kannada sentences and follow how the language is used in their lessons.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-amber-800">
                Sentence syntax & grammar breakdowns
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-stone-50/90 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shadow-2xs">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Interactive Exercises and Solved Answer Keys
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Practice exercises and solved answer keys give children opportunities to revisit lesson concepts, check their answers and strengthen their understanding of the material.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-indigo-800">
                Interactive exercises & full answer keys
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-stone-50/90 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Pronunciation Support for New Vocabulary
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pronunciation guidance for new vocabulary words helps students become more familiar with Kannada sounds as they develop their reading and speaking skills.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-emerald-800">
                Phonetic keys & oral clarity
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-stone-50/90 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-2xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Visual Story Summaries
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Visual summaries of stories help present lesson content in an accessible format, supporting students as they recall key ideas and understand what they have read.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-rose-800">
                Accessible visual story summaries
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. TABLE OF CONTENTS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Kali Kannada Class 2 Table of Contents
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore the main sections of the Class 2 guidebook to understand the types of Kannada learning content it covers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Part 1 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 inline-block">
                Part 1
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Part 1: Story Lessons & Moral Tales
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Covers story-based lessons and moral tales, supported by English translations to help students understand the content.
              </p>
            </div>

            {/* Part 2 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200 inline-block">
                Part 2
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Part 2: Rhymes & Poems with Translation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Focuses on rhymes and poems with English translations, helping children follow the meaning of the Kannada text.
              </p>
            </div>

            {/* Part 3 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 inline-block">
                Part 3
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Part 3: Basic Kannada Grammar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Introduces basic Kannada grammar concepts, providing additional support as students learn how the language is structured.
              </p>
            </div>

            {/* Part 4 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200 inline-block">
                Part 4
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Part 4: Textbook Solved Answers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Provides solved textbook answers to help students review lesson questions and practise their work during homework and revision.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. ACADEMIC VALUE FOR CLASS 2 STUDENTS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Targeted Academic Value
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              A Kannada Academic Guidebook for Class 2 Students
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              As children progress in Kannada, they begin working with longer sentences, stories, poems
              and grammar concepts. The Kali Kannada Class 2 guidebook offers additional academic support
              through sentence translations, pronunciation guidance and solved exercises.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed italic">
              It also helps parents who are less familiar with Kannada follow their child's learning
              and provide support with schoolwork at home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Supports English-Medium School Students
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  English translations and grammar explanations help students who are more comfortable learning in English understand Kannada sentences and lesson content.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Bridge language comfort zone
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-2xs">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Helps Parents Support Learning at Home
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Parents can refer to the translated lessons, pronunciation guidance and solved answers to follow the material and assist children with homework and revision.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Zero home tutoring barrier
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Supplements the Prescribed Textbook
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The guidebook is intended to complement the prescribed Class 2 Kannada textbook by offering additional explanations and practice, not replace the textbook or classroom teaching.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                100% textbook companion
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. CURRICULUM AND LEARNING SUPPORT (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Quality & Alignment Standards
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Curriculum and Learning Support
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Karnataka State Board Aligned
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Kali Kannada Class 2 guidebook is presented as a supplementary learning resource aligned with the Karnataka State Board syllabus, providing additional support as students work through their prescribed Kannada lessons.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                English-Translated Learning Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sentence translations and grammar explanations help children connect Kannada lesson content with meanings they can understand.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Practice and Revision Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Interactive exercises, solved answer keys and visual story summaries give students additional ways to revisit concepts and practise at their own pace, with help from parents or teachers when needed.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. ORDER ONLINE ANCHOR CARD (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-18 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 text-center relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider border border-white/30">
            <span>Direct Publisher Order</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Order the Kali Kannada Class 2 Guidebook Online
          </h2>

          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            Support your child's Kannada learning with the Kali Kannada Class 2 English-translated
            guidebook. With sentence translations, grammar explanations, pronunciation guidance and
            solved exercises, it offers additional help for understanding lessons and completing schoolwork.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Add to Cart (₹290)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-stone-100 text-slate-950 border border-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Preview Inside</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-white/80 flex items-center justify-center gap-4">
            <span>✓ In Stock</span>
            <span>•</span>
            <span>✓ Free Shipping</span>
            <span>•</span>
            <span>✓ Delivery in 3–5 Days</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Parent Questions Answered</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

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
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50"
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
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
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
          9. EXPLORE RELATED KANNADA GUIDEBOOKS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Continue the Learning Journey
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Explore Related Kannada Guidebooks
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Discover more Kali Kannada academic guidebooks from Belesu to support your child's learning at different stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
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
                    <div className="h-52 flex items-center justify-center p-2 mb-3 bg-stone-50 rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={relBook.coverImage}
                        alt={relBook.title}
                        className="max-h-full w-auto object-contain drop-shadow-md rounded"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      Kali Kannada Class {relBook.gradeClass}
                    </h3>
                  </Link>
                </div>

                <Link
                  href={`/books/${relBook.slug}`}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Class {relBook.gradeClass}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

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
                <span>All Guidebooks</span>
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

      {/* Book Preview Modal */}
      {isPreviewOpen && book && (
        <BookPreviewModal book={book} onClose={() => setIsPreviewOpen(false)} />
      )}

    </div>
  );
}
