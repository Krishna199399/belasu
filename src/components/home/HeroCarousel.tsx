'use client';

import React, { useState, useEffect } from 'react';
import { BookProduct } from '@/types';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface HeroCarouselProps {
  onPreview?: (book: BookProduct) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

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

  const slides = [
    {
      id: 's1',
      bookId: '16351', // Savi Class 4
      title: 'Savi Kannada Class 4',
      govtTitle: 'Govt Savi Kannada Class 4',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 280,
      originalPrice: 340,
      badge: 'Bestseller',
      govtCoverImg: '/government-covers/savi-4.jpg',
      coverImg: '/covers/savi-4.png',
      bgImg: '/slider-image.png',
      headline: 'Savi Kannada Class 4',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Comprehensive study guide with line-by-line English renderings, Ottakshara tutorials, and solved exam question banks.'
    },
    {
      id: 's2',
      bookId: '15926', // Savi Class 1
      title: 'Savi Kannada Class 1',
      govtTitle: 'Govt Savi Kannada Class 1',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 250,
      originalPrice: 299,
      badge: 'Popular for Beginners',
      govtCoverImg: '/government-covers/savi-1.jpg',
      coverImg: '/covers/savi-1.png',
      bgImg: '/2.png',
      headline: 'Savi Kannada Class 1',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Designed for young learners & non-Kannadiga parents. Includes alphabet pronunciation guide in English script.'
    },
    {
      id: 's3',
      bookId: '19577', // Kali Class 2
      title: 'Kali Kannada Class 2',
      govtTitle: 'Govt Kali Kannada Class 2',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 290,
      originalPrice: 350,
      badge: 'New Edition',
      govtCoverImg: '/government-covers/kali-2.jpg',
      coverImg: '/covers/kali-2.png',
      bgImg: '/background5.png',
      headline: 'Kali Kannada Class 2',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Moral stories, poem summaries, and textbook exercises explained step-by-step in clear English.'
    },
    {
      id: 's4',
      bookId: '19571', // Kali Class 3
      title: 'Kali Kannada Class 3',
      govtTitle: 'Govt Kali Kannada Class 3',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 290,
      originalPrice: 350,
      badge: 'Top Rated',
      govtCoverImg: '/government-covers/kali-3.jpg',
      coverImg: '/covers/kali-3.png',
      bgImg: '/3.png',
      headline: 'Kali Kannada Class 3',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Master reading comprehension, grammar tenses, and synonyms with comprehensive learning support.'
    },
    {
      id: 's5',
      bookId: '17548', // Siri Class 5
      title: 'Siri Kannada Class 5',
      govtTitle: 'Govt Siri Kannada Class 5',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 290,
      originalPrice: 350,
      badge: 'Class 5 Special',
      govtCoverImg: '/government-covers/siri-5.jpg',
      coverImg: '/covers/siri-5.png',
      bgImg: '/slider-960-x-760-px.jpg',
      headline: 'Siri Kannada Class 5',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Formal & informal letter writing templates, literature history, and model question papers for high scores.'
    },
    {
      id: 's6',
      bookId: '16142', // Savi Class 3
      title: 'Savi Kannada Class 3',
      govtTitle: 'Govt Savi Kannada Class 3',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 280,
      originalPrice: 330,
      badge: 'Parent Favorite',
      govtCoverImg: '/government-covers/savi-3.jpg',
      coverImg: '/covers/savi-3.png',
      bgImg: '/2.png',
      headline: 'Savi Kannada Class 3',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Kannada sentence structure simplified in English with 500+ academic vocabulary keys.'
    },
    {
      id: 's7',
      bookId: '15849', // Savi Class 2
      title: 'Savi Kannada Class 2',
      govtTitle: 'Govt Savi Kannada Class 2',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 260,
      originalPrice: 310,
      badge: 'Recommended',
      govtCoverImg: '/government-covers/savi-2.jpg',
      coverImg: '/covers/savi-2.png',
      bgImg: '/background5.png',
      headline: 'Savi Kannada Class 2',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Gunintagalu master guide and full exercise answer keys aligned with Karnataka School Textbooks.'
    }
  ];

  // Auto-play timer every 3.0 seconds per user request
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length, currentSlide]);

  const activeSlide = slides[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200 select-none group/carousel flex items-center pt-2.5 pb-12 sm:pt-4 sm:pb-14 lg:pb-12"
    >

      {/* Vivid Background Image with Soft Light Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          key={`bg-light-${activeSlide.id}`}
          src={activeSlide.bgImg}
          alt="Karnataka Landmark Background"
          className="w-full h-full object-cover opacity-90 animate-hero-bg pointer-events-none"
        />
        {/* Soft White/Light Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white/95" />
      </div>

      {/* Main Content Container - Apple Product Style Centered Flow */}
      <div className="relative z-10 max-w-[1360px] mx-auto h-full px-2.5 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center pt-0 pb-1 sm:pt-1 sm:pb-2">
        
        {/* 1. Header: Tagline & Sleek Apple-Style Headline */}
        <div className="space-y-1 sm:space-y-1.5 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-100/90 border border-amber-300 text-amber-950 font-bold px-3 py-0.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kannada Mathadi, Kannada Belesi</span>
          </div>

          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] font-serif font-black tracking-tight text-slate-900 leading-[1.2] px-1 sm:px-0">
            Kannada to English Translated Academic Guidebooks
          </h1>
        </div>

        {/* 2. Main Stage: Grand Side-by-Side Books with Radiant Conversion Flow */}
        <div
          key={`apple-stage-${activeSlide.id}`}
          className="w-full my-2 sm:my-3 flex items-center justify-center animate-hero-cover relative"
        >
          {/* Subtle Ambient Translation Light Beam connecting School Book to Belesu Guide */}
          <div className="absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-200/40 via-amber-300/50 to-amber-400/50 rounded-full pointer-events-none overflow-hidden hidden sm:block">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-beam-flow" />
          </div>

          <div className="w-full max-w-[800px] flex items-center justify-center gap-1.5 xs:gap-3 sm:gap-6 md:gap-10 px-1 sm:px-2 relative z-10">
            
            {/* Government School Textbook */}
            <div className="flex-1 flex flex-col items-center group/govt min-w-0 max-w-[125px] xs:max-w-[145px] sm:max-w-[240px] lg:max-w-[290px]">
              <div className="mb-1 sm:mb-1.5 inline-flex items-center gap-0.5 sm:gap-1 bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[11px] shadow-2xs whitespace-nowrap">
                <span>🏛️</span>
                <span>Kannada Textbook</span>
              </div>
              <div className="relative w-full aspect-[3/4] flex items-center justify-center group-hover/govt:-translate-y-1.5 transition-all duration-300">
                <img
                  src={activeSlide.govtCoverImg}
                  alt={activeSlide.govtTitle}
                  className="w-full h-full max-h-[155px] xs:max-h-[185px] sm:max-h-[290px] lg:max-h-[350px] object-contain rounded-md drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)] sm:drop-shadow-[0_18px_30px_rgba(0,0,0,0.22)] transform group-hover/govt:scale-105 transition-all duration-300"
                />
              </div>
            </div>

            {/* Center Translation Connector with Ripple & Magnetic Nudge */}
            <div className="shrink-0 flex flex-col items-center justify-center gap-1 sm:gap-1.5 z-10 -mt-1 relative group/arrow">
              {/* Radiating Ripple Glow behind circle */}
              <div className="absolute top-0 w-7 h-7 sm:w-12 sm:h-12 rounded-full bg-amber-400/35 animate-ripple-pulse pointer-events-none" />

              <div className="relative w-7 h-7 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-md sm:shadow-lg shadow-amber-400/50 border border-white sm:border-2">
                <ArrowRight className="w-3.5 h-3.5 sm:w-6 sm:h-6 stroke-[2.5] animate-arrow-nudge" />
              </div>
              <div className="bg-amber-100 border border-amber-300 text-amber-950 text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap">
                English Guide
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold hidden sm:inline">
                Line-by-Line
              </span>
            </div>

            {/* Belesu Bilingual Guidebook */}
            <div className="flex-1 flex flex-col items-center group/belesu min-w-0 max-w-[125px] xs:max-w-[145px] sm:max-w-[240px] lg:max-w-[290px]">
              <div className="mb-1 sm:mb-1.5 inline-flex items-center gap-0.5 sm:gap-1 bg-amber-400 text-slate-950 font-black px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[11px] shadow-2xs whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950" />
                <span className="hidden xs:inline">Belesu Guidebook</span>
                <span className="xs:hidden">Guidebook</span>
              </div>
              <Link
                href="/books"
                className="relative w-full aspect-[3/4] flex items-center justify-center cursor-pointer group-hover/belesu:-translate-y-2 transition-all duration-300"
              >
                <img
                  src={activeSlide.coverImg}
                  alt={activeSlide.title}
                  className="w-full h-full max-h-[160px] xs:max-h-[190px] sm:max-h-[300px] lg:max-h-[360px] object-contain rounded-md drop-shadow-[0_12px_22px_rgba(245,158,11,0.25)] sm:drop-shadow-[0_20px_35px_rgba(245,158,11,0.32)] group-hover/belesu:drop-shadow-[0_25px_45px_rgba(245,158,11,0.55)] transform group-hover/belesu:scale-105 transition-all duration-300"
                />
              </Link>
            </div>

          </div>
        </div>

        {/* 3. Below Books: Primary Action Button */}
        <div className="w-full flex flex-col items-center gap-1.5 sm:gap-2">
          
          <div className="flex items-center justify-center">
            {/* Primary Buy Button with Ambient Breathing Glow */}
            <Link
              href="/books"
              className="py-2.5 sm:py-3 px-6 sm:px-10 rounded-full font-black text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-lg animate-cta-breathe flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide transition transform hover:scale-105 active:scale-95 cursor-pointer uppercase min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Buy Kannada Guidebooks</span>
            </Link>
          </div>

          {/* Active Featured Book Context Tag */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-semibold text-slate-600">
            <span className="text-slate-400">Featured Book:</span>
            <span className="text-slate-900 font-bold">{activeSlide.title}</span>
            {activeSlide.badge && (
              <span className="bg-amber-100 text-amber-900 text-[9.5px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full uppercase border border-amber-300/80">
                {activeSlide.badge}
              </span>
            )}
          </div>
        </div>

        {/* 4. Below Actions: Value Feature Pillars Strip */}
        <div className="mt-2 sm:mt-3 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-4xl mx-auto w-full px-1 sm:px-0">
          <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-xs border border-amber-200 text-slate-800 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-2xs text-center">
            <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="truncate">English Translation</span>
          </span>
          <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-xs border border-amber-200 text-slate-800 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-2xs text-center">
            <BookOpen className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="truncate sm:hidden">State Syllabus</span>
            <span className="hidden sm:inline">Karnataka State Syllabus</span>
          </span>
          <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-xs border border-amber-200 text-slate-800 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-2xs text-center">
            <span className="shrink-0">🎯</span>
            <span className="truncate">Solved Exercises</span>
          </span>
          <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-xs border border-amber-200 text-slate-800 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-2xs text-center">
            <span className="shrink-0">🏡</span>
            <span className="truncate">Parent Guidance</span>
          </span>
        </div>

      </div>

      {/* Translucent Light Arrow Controls (Hidden on narrow mobile, available on sm+) */}
      <button
        type="button"
        onClick={handlePrev}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/85 hover:bg-amber-400 text-slate-900 hover:text-slate-950 border border-slate-300 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer min-w-[44px] min-h-[44px] items-center justify-center"
        aria-label="Previous Banner"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/85 hover:bg-amber-400 text-slate-900 hover:text-slate-950 border border-slate-300 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer min-w-[44px] min-h-[44px] items-center justify-center"
        aria-label="Next Banner"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Amber Dot Indicators with Smooth Width Extension */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
        {slides.map((s, idx) => (
          <button
            key={`dot-light-${s.id}`}
            type="button"
            onClick={() => handleSelectSlide(idx)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              currentSlide === idx
                ? 'w-7 sm:w-9 bg-amber-500 shadow-md shadow-amber-500/40'
                : 'w-2 sm:w-2.5 bg-slate-300/80 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
