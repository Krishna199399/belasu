'use client';

import React, { useState, useEffect } from 'react';
import { BookProduct } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Play, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface HeroCarouselProps {
  onPreview: (book: BookProduct) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onPreview }) => {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 's1',
      bookId: '16351', // Savi Class 4
      title: 'Savi Kannada Class 4',
      tagline: 'Kannada Mathadi, Kannada Belesi',
      price: 280,
      originalPrice: 340,
      badge: 'Bestseller',
      coverImg: '/cover-3.png',
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
      coverImg: '/Savi-Class1-CoverPage.png',
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
      coverImg: '/2nd-1stpart.png',
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
      coverImg: '/SV-3-2.png',
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
      coverImg: '/SV-5-2.png',
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
      coverImg: '/Savi-Class2-CoverPage.png',
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
      coverImg: '/savi-kannada-1st-1stpart.png',
      bgImg: '/background5.png',
      headline: 'Savi Kannada Class 2',
      subtitle: 'Innovative Book For Academic Help • Kannada to English Translation • Easy to learn Kannada and Write Exam',
      description: 'Gunintagalu master guide and full exercise answer keys aligned with Karnataka State Board.'
    }
  ];

  // Auto-play timer every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];
  const activeBook = BOOKS_DATA.find((b) => b.id === activeSlide.bookId) || BOOKS_DATA[0];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full min-h-[580px] lg:h-[640px] bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200">
      
      {/* Vivid Background Image with Soft Light Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          key={`bg-light-${activeSlide.id}`}
          src={activeSlide.bgImg}
          alt="Karnataka Landmark Background"
          className="w-full h-full object-cover opacity-90 transition-opacity duration-700 animate-in fade-in"
        />
        {/* Soft White/Light Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/85 to-white" />
      </div>

      {/* Main Content Container (Full Width Pad) */}
      <div className="relative z-10 max-w-[1400px] mx-auto h-full px-6 sm:px-8 lg:px-12 flex items-center py-12 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Side: Prominent Book Cover Showcase */}
          <div key={`cover-light-${activeSlide.id}`} className="lg:col-span-5 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative max-w-xs sm:max-w-sm w-full aspect-[3/4] flex items-center justify-center p-2 group">
              <img
                src={activeSlide.coverImg}
                alt={activeSlide.title}
                className="max-h-[460px] max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] transform group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg">
                ₹{activeSlide.price}
              </span>
            </div>
          </div>

          {/* Right Side: Editorial Book Copy & Vibrant Yellow/Amber CTAs */}
          <div key={`text-light-${activeSlide.id}`} className="lg:col-span-7 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-right-6 duration-500">
            
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-wide text-slate-600 block">
                {activeSlide.tagline}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                {activeSlide.headline}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-xl">
                {activeSlide.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              {activeSlide.description}
            </p>

            {/* Price Tag */}
            <div className="flex items-center justify-center lg:justify-start gap-4 py-1">
              <span className="text-3xl font-black text-amber-600">₹{activeSlide.price}</span>
            </div>

            {/* Bright Yellow / Amber Buttons (Matching Original Design) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={() => addToCart(activeBook, 'physical')}
                className="w-full sm:w-auto py-4 px-8 rounded-full font-black text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-xl shadow-amber-400/30 flex items-center justify-center gap-2 text-sm tracking-wide transition transform active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" /> Add to Cart (₹{activeSlide.price})
              </button>

              <button
                type="button"
                onClick={() => onPreview(activeBook)}
                className="w-full sm:w-auto py-4 px-6 rounded-full font-bold text-slate-900 bg-white/90 hover:bg-white border border-slate-300 hover:border-slate-400 transition text-xs tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-600" /> View More & Preview
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Translucent Light Arrow Controls */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-amber-400 text-slate-900 hover:text-slate-950 border border-slate-300 shadow-lg backdrop-blur-md transition cursor-pointer"
        aria-label="Previous Banner"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-amber-400 text-slate-900 hover:text-slate-950 border border-slate-300 shadow-lg backdrop-blur-md transition cursor-pointer"
        aria-label="Next Banner"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Amber Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={`dot-light-${s.id}`}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx
                ? 'w-8 bg-amber-500 shadow-sm'
                : 'w-3 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
