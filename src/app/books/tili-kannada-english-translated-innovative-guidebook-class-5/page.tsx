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
  FileText,
  PenTool,
  Scroll,
} from 'lucide-react';
import Link from 'next/link';
import { BookProduct } from '@/types';
import toast from 'react-hot-toast';

export default function TiliClass5Page() {
  const { addToCart, openCart } = useCart();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Tili Kannada Class 5 book data (Index 9 in mockData)
  const book: BookProduct = BOOKS_DATA[9];

  // Related guidebooks (Siri Kannada Class 5 as per content brief)
  const relatedBooks = BOOKS_DATA.filter(
    (b) => b.slug === 'siri-kannada-english-translated-guidebook-class-5'
  );

  const handleAddToCart = () => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart!`);
    openCart();
  };

  const keyBenefits = [
    'Understand Class 5 Tili Kannada lessons through English translations.',
    'Build vocabulary and improve reading comprehension.',
    'Learn grammar concepts, including Alankara, Samasa and Tatsama-Tadbhava.',
    'Review chapter summaries and important thematic points.',
    'Practise textbook-based questions with a structured question bank and model scoring guidance.',
  ];

  const faqs = [
    {
      q: 'What is the Tili Kannada Class 5 guidebook?',
      a: 'The Tili Kannada Class 5 guidebook is an English-translated academic support book featuring lesson translations, chapter summaries, advanced grammar explanations and question-bank support.',
    },
    {
      q: 'Does the guidebook include English translations of Kannada lessons?',
      a: 'Yes. The guidebook includes English translations of the Class 5 Tili Kannada textbook content to help students understand lessons and improve reading comprehension.',
    },
    {
      q: 'Which Kannada grammar topics does the guidebook cover?',
      a: 'The listed grammar topics include Alankara, Samasa and Tatsama-Tadbhava. These sections provide additional material for students to review Kannada grammar concepts.',
    },
    {
      q: 'Is the Tili Kannada Class 5 guidebook a replacement for the school textbook?',
      a: 'No. It is intended to supplement the prescribed textbook by providing additional explanations, summaries, grammar support and question practice.',
    },
    {
      q: 'What is the price of the Tili Kannada Class 5 guidebook?',
      a: 'The Tili Kannada Class 5 guidebook costs ₹295. It is listed as in stock with free shipping and an estimated delivery time of 3–5 business days.',
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
              <span className="text-slate-400">Tili Kannada</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Class 5</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% State Syllabus Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. HERO SECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 py-10 lg:py-16 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Book Details & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Karnataka State Board Edition
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  In Stock & Ready to Ship
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-200 text-slate-700">
                  SKU: {book?.sku || 'TL5'}
                </span>
              </div>

              {/* Main Title (H1) */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Tili Kannada English Translated Innovative Guidebook Class 5
                </h1>
                <p className="text-sm sm:text-base font-medium text-amber-700">
                  ತಿಳಿ ಕನ್ನಡ ೫ನೇ ತರಗತಿ — Complete English Translation, Advanced Grammar & Question Bank
                </p>
              </div>

              {/* Price & Shipping Info */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm inline-flex flex-wrap items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">₹295</span>
                  <span className="text-base text-slate-400 line-through">₹360</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save ₹65
                  </span>
                </div>
                <div className="h-4 w-px bg-stone-200 hidden sm:block"></div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Free Shipping • Delivery in 3–5 business days</span>
                </div>
              </div>

              {/* Introductory Paragraph */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                The Tili Kannada Class 5 English-translated innovative guidebook helps students develop reading comprehension, expand Kannada vocabulary and understand more advanced grammar concepts. With lesson translations, chapter summaries and question-and-answer support, it provides additional resources for students revising Kannada lessons and preparing for school assessments.
              </p>

              {/* Key Benefits Bulleted List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Benefits for Class 5 Students:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {keyBenefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-stone-100/70 p-2.5 rounded-xl border border-stone-200/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs: Add to Cart + Preview */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all transform active:scale-[0.99] shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-slate-950" />
                  <span>Add to Cart (₹295)</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold bg-white hover:bg-stone-50 text-slate-800 border-2 border-stone-300 transition cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span>Preview Inside</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Verified Content
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-600" /> Doorstep Delivery across Karnataka & India
                </span>
              </div>

            </div>

            {/* Right Column: Book Visual Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[380px]">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                {/* Book Card */}
                <div className="relative rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md bg-stone-100">
                    <img
                      src={book?.coverImage || '/covers/tili-5.png'}
                      alt="Tili Kannada Class 5 Guidebook Cover"
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Micro-preview button overlay */}
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold">Sample Pages Included</span>
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Index & Samples
                    </button>
                  </div>
                </div>

                {/* Optional Government Textbook Companion indicator */}
                {book?.karnatakaTextbookCover && (
                  <div className="mt-4 p-3 bg-white/90 backdrop-blur rounded-xl border border-stone-200 text-xs flex items-center gap-3">
                    <img
                      src={book.karnatakaTextbookCover}
                      alt="Karnataka Textbook"
                      className="w-10 h-12 object-cover rounded shadow"
                    />
                    <div className="text-left">
                      <p className="font-bold text-slate-800">Prescribed Companion</p>
                      <p className="text-slate-500">Aligned with Class 5 Karnataka State Board</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. KEY FEATURES AND HIGHLIGHTS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Academic Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Tili Kannada Class 5 Guidebook: Key Features and Highlights
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The Tili Kannada Class 5 guidebook combines English translations, grammar explanations, chapter summaries and question practice. It offers supplementary support for students who want to understand lesson content more clearly and strengthen their preparation for assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Full Tili Kannada Class 5 Textbook English Translation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                English translations help students follow the meaning of Kannada textbook lessons and understand unfamiliar words and passages. This additional explanation supports reading comprehension and independent revision.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Advanced Grammar Guide: Alankara, Samasa, Tatsama-Tadbhava
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The grammar section covers Alankara, Samasa and Tatsama-Tadbhava concepts. It provides students with additional material to review these topics and strengthen their understanding of Kannada grammar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                <Scroll className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Chapter Summaries and Key Thematic Points
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Chapter summaries highlight important ideas and themes from the lessons. Students can use them to revisit the main points of a chapter and organise their revision.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Full Question Bank with Model Scoring Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The question bank provides additional practice based on the guidebook's learning content, while the model scoring guide helps students understand how answers may be structured for assessment.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. TABLE OF CONTENTS (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <BookMarked className="w-3.5 h-3.5 text-amber-600" />
              Syllabus Structure
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Tili Kannada Class 5 Table of Contents
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The guidebook is organised into four lessons covering Kannada literary history, environmental conservation, advanced grammar and answer-key support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Lesson 1 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Lesson 1
                </span>
                <span className="text-xs text-slate-400 font-semibold">History of Literature</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Lesson 1: Kannada Sahitya Charitre (History of Literature)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This lesson focuses on the history of Kannada literature. It provides students with supplementary support for understanding the literary topics covered in the lesson.
              </p>
            </div>

            {/* Lesson 2 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Lesson 2
                </span>
                <span className="text-xs text-slate-400 font-semibold">Nature & Environment</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Lesson 2: Parisara Samrakshane (Environmental Conservation)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This lesson covers environmental conservation. Students can use the English-language learning support to understand the topic and review its key ideas.
              </p>
            </div>

            {/* Lesson 3 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Lesson 3
                </span>
                <span className="text-xs text-slate-400 font-semibold">Alankara • Samasa • Tatsama-Tadbhava</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Lesson 3: Advanced Grammar Masterclass
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This lesson focuses on advanced grammar concepts, including Alankara, Samasa and Tatsama-Tadbhava, giving students additional material for grammar revision.
              </p>
            </div>

            {/* Lesson 4 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Lesson 4
                </span>
                <span className="text-xs text-slate-400 font-semibold">Self-Evaluation & Solutions</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Lesson 4: Comprehensive Answer Key
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This lesson provides answer-key support to help students review questions and compare their responses with the answers provided in the guidebook.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. ACADEMIC VALUE / AUDIENCE SECTION (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              Tailored For Modern Learners
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              A Kannada Academic Guidebook for Class 5 Students
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The Tili Kannada Class 5 guidebook offers supplementary support for students who need English explanations to understand Kannada lessons, develop vocabulary and revise grammar concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Audience 1 */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto sm:mx-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Supports English-Medium School Students
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                English translations help English-medium students understand Kannada passages, follow lesson themes and build familiarity with Kannada vocabulary.
              </p>
            </div>

            {/* Audience 2 */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center mx-auto sm:mx-0">
                <Home className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Helps Parents Support Learning at Home
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Parents can refer to the translations, chapter summaries and grammar explanations when helping children revise lessons and practise questions at home.
              </p>
            </div>

            {/* Audience 3 */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/15 text-blue-700 flex items-center justify-center mx-auto sm:mx-0">
                <BookMarked className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Supplements the Prescribed Textbook
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The guidebook provides additional translations, summaries, grammar explanations and question practice alongside the prescribed textbook. It is intended to supplement classroom learning, not replace the school textbook.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. CURRICULUM AND LEARNING SUPPORT (H2 & 3 PILLARS)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Government Curriculum Alignment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Curriculum and Learning Support
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Structured to give students, teachers, and parents 100% confidence throughout the academic year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-lg font-bold text-amber-400">
                Karnataka State Board Aligned
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The guidebook is described as 100% state syllabus aligned, providing supplementary academic support for students studying Tili Kannada in Class 5.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-lg font-bold text-emerald-400">
                English-Translated Learning Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                English translations and chapter summaries help students understand lesson content, identify important themes and revisit unfamiliar vocabulary during revision.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-lg font-bold text-blue-400">
                Grammar and Exam Preparation Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Grammar explanations, a question bank and model scoring guidance provide additional resources for practising Kannada concepts and preparing for assessments.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. ORDER ONLINE CONVERSION BANNER (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4 text-amber-400" />
            Free Shipping Included
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
            Order the Tili Kannada Class 5 Guidebook Online
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Help your child strengthen Kannada comprehension, vocabulary and grammar with the Tili Kannada Class 5 English-translated innovative guidebook. Its lesson translations, summaries and question bank provide additional material for learning and revision at home.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-black bg-slate-950 hover:bg-slate-900 text-white transition-all transform active:scale-95 shadow-xl cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>Add to Cart (₹295)</span>
            </button>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base sm:text-lg font-bold bg-white/90 hover:bg-white text-slate-950 border border-slate-900/10 transition cursor-pointer"
            >
              <Eye className="w-5 h-5 text-amber-700" />
              <span>Preview Inside</span>
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-800 pt-2">
            Free shipping is available, with delivery estimated in 3–5 business days.
          </p>

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
              Everything you need to know about the Tili Kannada Class 5 guidebook.
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
          9. EXPLORE RELATED KANNADA GUIDEBOOKS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Related Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Related Kannada Guidebooks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Discover more Kannada academic guidebooks from Belesu to support your child's learning at different stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {relatedBooks.map((relBook) => (
              <div
                key={relBook.id}
                className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-400 p-4 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <Link href={`/books/${relBook.slug}`} className="block">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 mb-3 shadow-inner">
                      <img
                        src={relBook.coverImage}
                        alt={relBook.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {relBook.title}
                    </h3>
                  </Link>
                </div>

                <Link
                  href={`/books/${relBook.slug}`}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                >
                  <span>View Guidebook</span>
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
