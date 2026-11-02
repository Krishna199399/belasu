'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Languages,
  Lightbulb,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Users,
  GraduationCap,
  Award,
  Eye,
  Sparkles
} from 'lucide-react';
import { BookProduct } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';

interface HeroCarouselProps {
  onPreview?: (book: BookProduct) => void;
}

interface ComparisonSlide {
  id: string;
  classNameLabel: string;
  badge: string;
  govtTitle: string;
  govtCoverImg: string;
  belesuBookId: string;
  belesuTitle: string;
  belesuCoverImg: string;
  tagline: string;
  bgImg: string;
}

const COMPARISON_SLIDES: ComparisonSlide[] = [
  // Slide 0: Class 2 - Featured match from reference image!
  {
    id: 'class-2',
    classNameLabel: 'Class 2',
    badge: 'RECOMMENDED',
    govtTitle: 'Govt Savi Kannada Class 2',
    govtCoverImg: '/government-covers/savi-2.jpg',
    belesuBookId: '15849',
    belesuTitle: 'Savi Kannada Class 2',
    belesuCoverImg: '/covers/savi-2.png',
    tagline: 'Matches Karnataka State Syllabus Line-by-Line',
    bgImg: '/background5.png',
  },
  // Slide 1: Class 3
  {
    id: 'class-3',
    classNameLabel: 'Class 3',
    badge: 'POPULAR',
    govtTitle: 'Govt Savi Kannada Class 3',
    govtCoverImg: '/government-covers/savi-3.jpg',
    belesuBookId: '16142',
    belesuTitle: 'Savi Kannada Class 3',
    belesuCoverImg: '/covers/savi-3.png',
    tagline: 'Kannada sentence structure simplified with English keys',
    bgImg: '/2.png',
  },
  // Slide 2: Class 1
  {
    id: 'class-1',
    classNameLabel: 'Class 1',
    badge: 'BEGINNER FRIENDLY',
    govtTitle: 'Govt Savi Kannada Class 1',
    govtCoverImg: '/government-covers/savi-1.jpg',
    belesuBookId: '15926',
    belesuTitle: 'Savi Kannada Class 1',
    belesuCoverImg: '/covers/savi-1.png',
    tagline: 'English alphabet pronunciation & foundational vocabulary',
    bgImg: '/slider-image.png',
  },
  // Slide 3: Class 4
  {
    id: 'class-4',
    classNameLabel: 'Class 4',
    badge: 'BESTSELLER',
    govtTitle: 'Govt Savi Kannada Class 4',
    govtCoverImg: '/government-covers/savi-4.jpg',
    belesuBookId: '16351',
    belesuTitle: 'Savi Kannada Class 4',
    belesuCoverImg: '/covers/savi-4.png',
    tagline: 'Ottakshara tutorials, poem meanings & solved exercises',
    bgImg: '/3.png',
  },
  // Slide 4: Class 5
  {
    id: 'class-5',
    classNameLabel: 'Class 5',
    badge: 'BOARD SPECIAL',
    govtTitle: 'Govt Siri Kannada Class 5',
    govtCoverImg: '/government-covers/siri-5.jpg',
    belesuBookId: '17548',
    belesuTitle: 'Siri Kannada Class 5',
    belesuCoverImg: '/covers/siri-5.png',
    tagline: 'Formal letter writing, literature history & model papers',
    bgImg: '/slider-960-x-760-px.jpg',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onPreview }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Auto-scroll comparison slides every 1.5 seconds per user request
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % COMPARISON_SLIDES.length);
    }, 1500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = COMPARISON_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % COMPARISON_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + COMPARISON_SLIDES.length) % COMPARISON_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // 1-Click Preview Modal for Belesu Guidebook
  const handleBelesuClick = () => {
    const found = BOOKS_DATA.find((b) => b.id === activeSlide.belesuBookId);
    if (found && onPreview) {
      onPreview(found);
    }
  };

  const scrollToSeriesDeck = (e: React.MouseEvent) => {
    const el = document.getElementById('series-deck');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-gradient-to-b from-[#fefbf6] via-[#fffdf9] to-[#fff8ee] text-slate-900 overflow-hidden select-none"
    >
      <style jsx>{`
        
        @keyframes arrow-nudge {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-nudge {
          animation: arrow-nudge 1.6s ease-in-out infinite;
        }
        @keyframes cta-breathe {
          0%, 100% {
            box-shadow: 0 10px 25px -3px rgba(234, 88, 12, 0.35);
          }
          50% {
            box-shadow: 0 15px 35px 2px rgba(234, 88, 12, 0.55);
          }
        }
        .animate-cta-glow {
          animation: cta-breathe 2.8s ease-in-out infinite;
        }
      `}</style>

      {/* Synchronized Multi-Image Scenic Background with Smooth Cross-Fade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {COMPARISON_SLIDES.map((slide, idx) => (
          <img
            key={slide.id}
            src={slide.bgImg}
            alt={slide.belesuTitle}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out pointer-events-none ${
              idx === currentSlide ? 'opacity-85' : 'opacity-0'
            }`}
          />
        ))}
        {/* Soft Light Gradient Overlay for Crystal-Clear Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-[#fefbf6]/50 to-[#fff8ee]/75 pointer-events-none" />
      </div>

      {/* Ambient Decorative Accents */}
      <div className="absolute top-0 left-0 w-28 h-28 sm:w-44 sm:h-44 bg-gradient-to-br from-emerald-100/40 via-amber-100/20 to-transparent rounded-full blur-2xl pointer-events-none z-0" />
      <div className="absolute top-10 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4">
        
        {/* Responsive Grid: Desktop 2-column split / Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ========================================================
              LEFT COLUMN (Desktop) / TOP STACK (Mobile):
              Badge + Headline + Subtitle + 4 Features + CTAs
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 sm:space-y-4">
            
            {/* 1. Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] text-[#78350f] font-bold px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs tracking-wider uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>KANNADA MATHADI, KANNADA BELESI</span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.15rem] font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
              Kannada to English Translated Academic <br className="hidden sm:inline" />
              Guidebooks
            </h1>

            {/* 3. Subtitle Paragraph (Desktop Left Column) */}
            <p className="hidden lg:block text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl font-normal">
              Belesu Guidebooks help students from Class 1–6 read, pronounce and understand Kannada easily with clear English translation.
            </p>

            {/* 4. 4 Feature Cards (Desktop Left Column) */}
            <div className="hidden lg:grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3 w-full max-w-xl pt-1">
              {/* Feature 1 */}
              <div className="bg-white/95 border border-stone-200/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-w-0 transition-transform hover:-translate-y-0.5">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c]" />
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                  Easy <br /> Pronunciation
                </span>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/95 border border-stone-200/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-w-0 transition-transform hover:-translate-y-0.5">
                <Languages className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c]" />
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                  Meaningful <br /> English Translation
                </span>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/95 border border-stone-200/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-w-0 transition-transform hover:-translate-y-0.5">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c]" />
                <span className="text-[9.5px] xs:text-[10.5px] sm:text-xs font-bold text-slate-800 leading-tight">
                  Synopsis of Lesson <br /> in English
                </span>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/95 border border-stone-200/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-w-0 transition-transform hover:-translate-y-0.5">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c]" />
                <span className="text-[9.5px] xs:text-[10.5px] sm:text-xs font-bold text-slate-800 leading-tight">
                  All Exercises in <br /> English Translation
                </span>
              </div>
            </div>

            {/* 5. Dual Action Buttons (Desktop Left Column) */}
            <div className="hidden lg:flex items-center gap-3 pt-2">
              <Link
                href="#series-deck"
                onClick={scrollToSeriesDeck}
                className="animate-cta-glow inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Buy Guidebooks Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-700" />
                <span>Explore All Books</span>
              </Link>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN (Desktop) / MIDDLE STACK (Mobile):
              The Side-by-Side Comparison: One Govt Book ➔ One Belesu Book
              Resting on the Wooden Pedestal Table under Hanging Chalkboard
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center relative w-full pt-2 pb-2">
            
            {/* Ambient Warm Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-200/25 via-orange-100/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* Comparison Stage Container */}
            <div className="relative w-full max-w-[500px] xs:max-w-[560px] sm:max-w-[640px] lg:max-w-[720px] flex flex-col items-center justify-center">
              
              {/* The 2-Book Comparative Duo: Govt Textbook (Left) ➔ Belesu Guide (Right) */}
              <div
                key={`comparison-stage-${activeSlide.id}`}
                className="relative z-10 w-full flex items-center justify-center gap-2 xs:gap-3 sm:gap-6 px-2 transition-all duration-500"
              >
                
                {/* 1. Government School Textbook (Left) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[160px] xs:max-w-[190px] sm:max-w-[260px] lg:max-w-[305px] xl:max-w-[325px] group/govt transition-transform hover:-translate-y-1.5 duration-300">
                  {/* Badge */}
                  <div className="mb-1.5 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] shadow-2xs whitespace-nowrap">
                    <span>🏛️</span>
                    <span>Kannada Textbook</span>
                  </div>

                  {/* Book Image */}
                  <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                    <img
                      src={activeSlide.govtCoverImg}
                      alt={activeSlide.govtTitle}
                      className="w-full h-full max-h-[210px] xs:max-h-[250px] sm:max-h-[340px] lg:max-h-[395px] object-contain rounded-sm drop-shadow-[0_14px_22px_rgba(0,0,0,0.30)] sm:drop-shadow-[0_22px_36px_rgba(0,0,0,0.38)] group-hover/govt:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="mt-1.5 text-[9px] sm:text-xs font-bold text-stone-700 truncate max-w-full text-center">
                    {activeSlide.govtTitle}
                  </span>
                </div>

                {/* 2. Center Translation Connector Badge with Glowing Orange Arrow */}
                <div className="shrink-0 flex flex-col items-center justify-center gap-1 sm:gap-1.5 z-20 -mt-2">
                  {/* Circular Orange Arrow Button */}
                  <div className="relative w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 border-2 border-white">
                    <ArrowRight className="w-4.5 h-4.5 sm:w-7 sm:h-7 stroke-[2.5] animate-nudge" />
                  </div>

                  {/* English Guide Pill */}
                  <div className="bg-amber-100 border border-amber-300 text-amber-950 text-[8.5px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap">
                    English Guide
                  </div>

                  <span className="text-[8.5px] sm:text-[10px] text-stone-600 font-bold whitespace-nowrap">
                    Line-by-Line
                  </span>
                </div>

                {/* 3. Belesu Bilingual Guidebook (Right) */}
                <div
                  onClick={handleBelesuClick}
                  className="flex-1 flex flex-col items-center min-w-0 max-w-[160px] xs:max-w-[190px] sm:max-w-[260px] lg:max-w-[305px] xl:max-w-[325px] group/belesu cursor-pointer transition-transform hover:-translate-y-2 duration-300"
                  title="Click to preview this book"
                >
                  {/* Badge */}
                  <div className="mb-1.5 inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] shadow-2xs whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950" />
                    <span>Belesu Kannada Guide Book</span>
                  </div>

                  {/* Book Image */}
                  <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                    <img
                      src={activeSlide.belesuCoverImg}
                      alt={activeSlide.belesuTitle}
                      className="w-full h-full max-h-[210px] xs:max-h-[250px] sm:max-h-[340px] lg:max-h-[395px] object-contain rounded-sm drop-shadow-[0_16px_26px_rgba(234,88,12,0.35)] sm:drop-shadow-[0_24px_42px_rgba(234,88,12,0.44)] group-hover/belesu:scale-105 transition-transform duration-300"
                    />

                    {/* 1-Click Preview Overlay */}
                    <div className="absolute inset-0 bg-black/25 rounded-xs opacity-0 group-hover/belesu:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-slate-900 font-extrabold text-[9.5px] sm:text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-orange-600" /> Preview Pages
                      </span>
                    </div>
                  </div>

                  <span className="mt-1.5 text-[9px] sm:text-xs font-bold text-orange-700 truncate max-w-full text-center group-hover/belesu:underline">
                    {activeSlide.belesuTitle}
                  </span>
                </div>

              </div>



            </div>

            {/* Auto-Scroll Slide Indicator Dots & Class Tag */}
            <div className="flex flex-col items-center gap-1.5 mt-4 sm:mt-5 z-20">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Prev Arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded-full bg-white/85 hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  aria-label="Previous Class Comparison"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Dots */}
                {COMPARISON_SLIDES.map((s, idx) => (
                  <button
                    key={`dot-${s.id}`}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx
                        ? 'w-7 sm:w-8 bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm'
                        : 'w-2 sm:w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Show ${s.classNameLabel}`}
                  />
                ))}

                {/* Next Arrow */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 rounded-full bg-white/85 hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  aria-label="Next Class Comparison"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Class Pill Tag */}
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-stone-600 bg-white/90 border border-stone-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                <span className="text-stone-400">Featured Book:</span>
                <span className="text-slate-900 font-extrabold">{activeSlide.belesuTitle}</span>
                <span className="bg-amber-100 text-amber-900 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase border border-amber-300/80">
                  {activeSlide.badge}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            MOBILE SEQUENCE (Stacked below the comparison stage on mobile):
            1. CTAs ➔ 2. Subtitle Paragraph ➔ 3. 4 Feature Cards
           ======================================================== */}
        <div className="lg:hidden flex flex-col items-center w-full max-w-xl mx-auto mt-4 space-y-4 px-2">
          {/* 1. Mobile Action Buttons */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 w-full max-w-sm mx-auto">
            <Link
              href="#series-deck"
              onClick={scrollToSeriesDeck}
              className="animate-cta-glow inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all text-center cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Buy Guidebooks Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs active:scale-95 transition-all text-center cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>Explore All Books</span>
            </Link>
          </div>

          {/* 2. Mobile Subtitle Paragraph */}
          <p className="text-slate-600 text-sm leading-relaxed text-center max-w-md mx-auto font-normal px-2">
            Belesu Guidebooks help students from Class 1–6 read, pronounce and understand Kannada easily with clear English translation.
          </p>

          {/* 3. Mobile 4 Feature Cards */}
          <div className="grid grid-cols-4 gap-1.5 xs:gap-2 w-full max-w-md mx-auto pt-1">
            {/* Feature 1 */}
            <div className="bg-white/95 border border-stone-200/90 rounded-xl p-2 text-center shadow-xs flex flex-col items-center justify-center gap-1 min-w-0">
              <BookOpen className="w-4 h-4 text-[#ea580c]" />
              <span className="text-[10px] xs:text-[11px] font-bold text-slate-800 leading-tight">
                Easy <br /> Pronunciation
              </span>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/95 border border-stone-200/90 rounded-xl p-2 text-center shadow-xs flex flex-col items-center justify-center gap-1 min-w-0">
              <Languages className="w-4 h-4 text-[#ea580c]" />
              <span className="text-[10px] xs:text-[11px] font-bold text-slate-800 leading-tight">
                Meaningful <br /> English Translation
              </span>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/95 border border-stone-200/90 rounded-xl p-2 text-center shadow-xs flex flex-col items-center justify-center gap-1 min-w-0">
              <Lightbulb className="w-4 h-4 text-[#ea580c]" />
              <span className="text-[9.5px] xs:text-[10.5px] font-bold text-slate-800 leading-tight">
                Synopsis of Lesson <br /> in English
              </span>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/95 border border-stone-200/90 rounded-xl p-2 text-center shadow-xs flex flex-col items-center justify-center gap-1 min-w-0">
              <TrendingUp className="w-4 h-4 text-[#ea580c]" />
              <span className="text-[9.5px] xs:text-[10.5px] font-bold text-slate-800 leading-tight">
                All Exercises in <br /> English Translation
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM 3-COLUMN TRUST STRIP (Matching reference mockups)
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5 max-w-5xl mx-auto w-full pt-6 sm:pt-8">
          
          {/* Trust 1: Syllabus Alignment */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-amber-200/80 rounded-2xl p-3 sm:p-4 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 text-white shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
              For CBSE | ICSE | English Medium | IG &amp; State Syllabus Students
            </div>
          </div>

          {/* Trust 2: Series Coverage */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-amber-200/80 rounded-2xl p-3 sm:p-4 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
              Savi (Class 1 – 4) <br className="hidden sm:inline" />
              Siri (Class 5) | Kali (Class 1 – 4) | Tili (Class 5)
            </div>
          </div>

          {/* Trust 3: Non-Kannadiga Parents Support */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-amber-200/80 rounded-2xl p-3 sm:p-4 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 text-white shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
              Designed for <br className="hidden sm:inline" />
              Non-Kannadiga Parents too
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================
          BOTTOM CURVED GOLDEN WAVE DIVIDER:
          Smooth transition into "⇶ Our Book Series ⇶"
         ======================================================== */}
      <div className="w-full relative -mb-1 mt-4 sm:mt-6">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-9 sm:h-12 fill-amber-400 block"
          preserveAspectRatio="none"
        >
          <path d="M0,28 C280,55 420,10 720,32 C1020,54 1180,12 1440,30 L1440,60 L0,60 Z" />
        </svg>

        {/* Centered Pill Badge "Our Book Series" */}
        <div className="absolute inset-x-0 bottom-0 sm:bottom-0.5 flex items-center justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-white text-slate-900 font-black text-[11px] sm:text-xs px-4 sm:px-5 py-1 rounded-full shadow-md border border-amber-200 pointer-events-auto">
            <span className="text-amber-500 tracking-tighter font-serif text-sm">⇶</span>
            <span className="tracking-wide uppercase">Our Book Series</span>
            <span className="text-amber-500 tracking-tighter font-serif text-sm">⇶</span>
          </div>
        </div>
      </div>

    </section>
  );
};
