'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookProduct } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

interface HeroCarouselProps {
  onPreview: (book: BookProduct) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onPreview }) => {
  const { addToCart } = useCart();
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 280,
      originalPrice: 340,
      badge: 'Bestseller',
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 250,
      originalPrice: 299,
      badge: 'Popular for Beginners',
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 290,
      originalPrice: 350,
      badge: 'New Edition',
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 290,
      originalPrice: 350,
      badge: 'Top Rated',
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 290,
      originalPrice: 350,
      badge: 'Class 5 Special',
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 280,
      originalPrice: 330,
      badge: 'Parent Favorite',
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
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 260,
      originalPrice: 310,
      badge: 'Recommended',
      coverImg: '/covers/savi-2.png',
      bgImg: '/background5.png',
      headline: 'Savi Kannada Class 2',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Gunintagalu master guide and full exercise answer keys aligned with Karnataka State Board.'
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
  const activeBook = BOOKS_DATA.find((b) => b.id === activeSlide.bookId) || BOOKS_DATA[0];

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
      className="relative w-full min-h-[540px] sm:min-h-[620px] lg:min-h-[660px] bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200 select-none group/carousel flex items-center py-8 sm:py-10 lg:py-14"
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
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/90 to-white lg:from-white/40 lg:via-white/94 lg:to-white" />
      </div>

      {/* Main Content Container (Full Width Pad) */}
      <div className="relative z-10 max-w-[1400px] mx-auto h-full px-4 sm:px-8 lg:px-12 flex items-center py-6 sm:py-12 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          
          {/* Left Side: Prominent Book Cover Showcase with smooth fade + float animation */}
          <div
            key={`cover-light-${activeSlide.id}`}
            className="lg:col-span-5 flex items-center justify-center animate-hero-cover"
          >
            <div className="relative max-w-[240px] sm:max-w-sm w-full aspect-[3/4] flex items-center justify-center p-2 group">
              <img
                src={activeSlide.coverImg}
                alt={activeSlide.title}
                className="max-h-[260px] sm:max-h-[380px] lg:max-h-[460px] max-w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)] transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Side: Editorial Book Copy & Vibrant Yellow/Amber CTAs */}
          <div
            className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100/90 border border-amber-300/80 text-amber-900 font-bold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Kannada Mathadi, Kannada Belesi</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-black tracking-tight text-slate-900 leading-[1.2]">
              Kannada to English Translated Academic Guidebooks for School Children
            </h1>

            {/* Feature Ribbon */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 bg-white/90 border border-amber-200/90 text-amber-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-lg shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Innovative Academic Guidebooks
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/90 border border-amber-200/90 text-amber-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-lg shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Kannada-to-English Translation
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/90 border border-amber-200/90 text-amber-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-lg shadow-2xs">
                🎯 Easy Kannada Learning & Exam Preparation
              </span>
            </div>

            {/* Descriptive Body Card */}
            <div className="bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs max-w-2xl mx-auto lg:mx-0 text-left border-l-4 border-l-amber-500 space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                Understand Kannada lessons with English-translated guidebooks from Belesu.
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>English translations to help students understand Kannada lessons.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>Learning support for schoolwork and exam preparation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>Helpful for English-medium students and parents supporting learning at home.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>Supplementary guidebooks to use alongside prescribed textbooks.</span>
                </li>
              </ul>
            </div>

            {/* Dynamic Active Book Context Tag */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-500 pt-1">
              <span className="text-slate-400">Featured Book:</span>
              <span className="text-slate-900 font-bold">{activeSlide.title}</span>
              {activeSlide.badge && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {activeSlide.badge}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex items-center justify-center lg:justify-start">
              <Link
                href="/books"
                className="w-full sm:w-auto py-3.5 px-8 rounded-full font-black text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-xl shadow-amber-400/30 flex items-center justify-center gap-2 text-sm tracking-wide transition transform active:scale-95 cursor-pointer uppercase min-h-[48px]"
              >
                <BookOpen className="w-4 h-4 text-slate-950" /> Explore Kannada Guidebooks
              </Link>
            </div>
          </div>

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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={`dot-light-${s.id}`}
            type="button"
            onClick={() => handleSelectSlide(idx)}
            className={`h-3 rounded-full transition-all duration-500 cursor-pointer ${
              currentSlide === idx
                ? 'w-10 bg-amber-500 shadow-md shadow-amber-500/40'
                : 'w-3 bg-slate-300/80 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
