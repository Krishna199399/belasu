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

interface HeroSlide {
  id: string;
  classNameLabel: string;
  badge: string;
  tagline: string;
  // 4 books on the pedestal table
  books: {
    role: 'left' | 'center-govt' | 'right-center' | 'right';
    bookId?: string;
    title: string;
    label: string;
    coverImg: string;
    isGovt?: boolean;
    scale?: string;
  }[];
}

const HERO_SLIDES: HeroSlide[] = [
  // Slide 0: Class 3 - Exact mockup reference state!
  {
    id: 'class-3',
    classNameLabel: 'Class 3',
    badge: 'Popular for Primary',
    tagline: 'Savi 3 + Govt Textbook Companion',
    books: [
      {
        role: 'left',
        bookId: '16142', // Savi Class 3
        title: 'Savi Kannada Support Class 3',
        label: 'Savi Support',
        coverImg: '/covers/savi-3.png',
      },
      {
        role: 'center-govt',
        title: 'Govt Savi Kannada Class 3',
        label: 'Govt Textbook',
        coverImg: '/government-covers/savi-3.jpg',
        isGovt: true,
      },
      {
        role: 'right-center',
        bookId: '19577', // Kali Class 2
        title: 'Kali Kannada Class 2',
        label: 'Kali Kannada',
        coverImg: '/covers/kali-2.png',
      },
      {
        role: 'right',
        bookId: '17548', // Siri Class 5
        title: 'Siri Kannada Class 5',
        label: 'Siri Kannada',
        coverImg: '/covers/siri-5.png',
      },
    ],
  },
  // Slide 1: Class 1 Foundation
  {
    id: 'class-1',
    classNameLabel: 'Class 1',
    badge: 'Beginner Friendly',
    tagline: 'Perfect for Starting Kannada',
    books: [
      {
        role: 'left',
        bookId: '15926', // Savi Class 1
        title: 'Savi Kannada Class 1',
        label: 'Savi Class 1',
        coverImg: '/covers/savi-1.png',
      },
      {
        role: 'center-govt',
        title: 'Govt Savi Kannada Class 1',
        label: 'Govt Textbook',
        coverImg: '/government-covers/savi-1.jpg',
        isGovt: true,
      },
      {
        role: 'right-center',
        bookId: '19570', // Kali Class 1
        title: 'Kali Kannada Class 1',
        label: 'Kali Class 1',
        coverImg: '/covers/kali-1.png',
      },
      {
        role: 'right',
        bookId: '15849', // Savi Class 2
        title: 'Savi Kannada Class 2',
        label: 'Savi Class 2',
        coverImg: '/covers/savi-2.png',
      },
    ],
  },
  // Slide 2: Class 2
  {
    id: 'class-2',
    classNameLabel: 'Class 2',
    badge: 'Vocabulary Builder',
    tagline: 'Word Formation & Pronunciation',
    books: [
      {
        role: 'left',
        bookId: '15849', // Savi Class 2
        title: 'Savi Kannada Class 2',
        label: 'Savi Class 2',
        coverImg: '/covers/savi-2.png',
      },
      {
        role: 'center-govt',
        title: 'Govt Savi Kannada Class 2',
        label: 'Govt Textbook',
        coverImg: '/government-covers/savi-2.jpg',
        isGovt: true,
      },
      {
        role: 'right-center',
        bookId: '19577', // Kali Class 2
        title: 'Kali Kannada Class 2',
        label: 'Kali Class 2',
        coverImg: '/covers/kali-2.png',
      },
      {
        role: 'right',
        bookId: '19571', // Kali Class 3
        title: 'Kali Kannada Class 3',
        label: 'Kali Class 3',
        coverImg: '/covers/kali-3.png',
      },
    ],
  },
  // Slide 3: Class 4
  {
    id: 'class-4',
    classNameLabel: 'Class 4',
    badge: 'Bestseller',
    tagline: 'Exam Preparation & Grammar Keys',
    books: [
      {
        role: 'left',
        bookId: '16351', // Savi Class 4
        title: 'Savi Kannada Class 4',
        label: 'Savi Class 4',
        coverImg: '/covers/savi-4.png',
      },
      {
        role: 'center-govt',
        title: 'Govt Savi Kannada Class 4',
        label: 'Govt Textbook',
        coverImg: '/government-covers/savi-4.jpg',
        isGovt: true,
      },
      {
        role: 'right-center',
        bookId: '19757', // Kali Class 4
        title: 'Kali Kannada Class 4',
        label: 'Kali Class 4',
        coverImg: '/covers/kali-4.png',
      },
      {
        role: 'right',
        bookId: '16142', // Savi Class 3
        title: 'Savi Kannada Class 3',
        label: 'Savi Class 3',
        coverImg: '/covers/savi-3.png',
      },
    ],
  },
  // Slide 4: Class 5
  {
    id: 'class-5',
    classNameLabel: 'Class 5',
    badge: 'Class 5 Special',
    tagline: 'Siri & Tili Kannada Guidebooks',
    books: [
      {
        role: 'left',
        bookId: '17548', // Siri Class 5
        title: 'Siri Kannada Class 5',
        label: 'Siri Class 5',
        coverImg: '/covers/siri-5.png',
      },
      {
        role: 'center-govt',
        title: 'Govt Siri Kannada Class 5',
        label: 'Govt Textbook',
        coverImg: '/government-covers/siri-5.jpg',
        isGovt: true,
      },
      {
        role: 'right-center',
        bookId: '20049', // Tili Class 5
        title: 'Tili Kannada Class 5',
        label: 'Tili Class 5',
        coverImg: '/covers/tili-5.png',
      },
      {
        role: 'right',
        bookId: '16351', // Savi Class 4
        title: 'Savi Kannada Class 4',
        label: 'Savi Class 4',
        coverImg: '/covers/savi-4.png',
      },
    ],
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onPreview }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Auto-scroll carousel every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
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

  // Find book product for preview modal
  const handleBookClick = (bookId?: string) => {
    if (!bookId) return;
    const found = BOOKS_DATA.find((b) => b.id === bookId);
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-gradient-to-b from-[#fefbf6] via-[#fffdf9] to-[#fff8ee] text-slate-900 overflow-hidden select-none"
    >
      <style jsx>{`
        @keyframes chalkboard-swing {
          0% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
          100% {
            transform: rotate(-2deg);
          }
        }
        .animate-chalkboard {
          transform-origin: top center;
          animation: chalkboard-swing 4.5s ease-in-out infinite;
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

      {/* Ambient Decorative Leaves / Study Corner Accents */}
      <div className="absolute top-0 left-0 w-28 h-28 sm:w-44 sm:h-44 bg-gradient-to-br from-emerald-100/40 via-amber-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4">
        
        {/* Responsive Grid: Desktop 2-column split (Left: Copy & CTAs, Right: Stage) / Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ========================================================
              LEFT COLUMN (Desktop) / TOP STACK (Mobile):
              Badge + Headline + Subtitle + 4 Features + CTAs
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 sm:space-y-4">
            
            {/* 1. Top Authority Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] text-[#78350f] font-bold px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs shadow-2xs">
              <span className="text-sm">🏆</span>
              <span>Government Recognized &amp; Award-Winning Initiative</span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.12]">
              Kannada Textbooks <br className="hidden sm:inline" />
              with <span className="text-[#ea580c]">English Support</span>
            </h1>

            {/* 3. Subtitle Paragraph */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl font-normal">
              Belesu Guidebooks help students from Class 1–6 read, pronounce and understand Kannada easily with clear English translation.
            </p>

            {/* 4. 4 Feature Cards (Single Horizontal Row) */}
            <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3 w-full max-w-xl pt-1">
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
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                  Better <br /> Understanding
                </span>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/95 border border-stone-200/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center justify-center gap-1 sm:gap-1.5 min-w-0 transition-transform hover:-translate-y-0.5">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea580c]" />
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                  Builds <br /> Confidence
                </span>
              </div>
            </div>

            {/* 5. Dual Action Buttons (Desktop Only in left column) */}
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
              The Wooden Pedestal Table with Standing Books & Chalkboard
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center relative w-full pt-4 pb-2">
            
            {/* Ambient Background Glow Behind Books */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-200/25 via-orange-100/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* Hanging Chalkboard Badge */}
            <div className="relative z-20 flex flex-col items-center mb-1 -mr-28 sm:-mr-44 lg:-mr-40 self-center">
              {/* Twin Suspension Cords */}
              <div className="flex items-center gap-6 sm:gap-8 -mb-1">
                <div className="w-[1.5px] h-6 sm:h-8 bg-stone-700/60" />
                <div className="w-[1.5px] h-6 sm:h-8 bg-stone-700/60" />
              </div>

              {/* Wooden-Framed Dark Green Chalkboard */}
              <div className="animate-chalkboard p-1 sm:p-1.5 rounded-xl bg-gradient-to-b from-[#a16207] via-[#854d0e] to-[#713f12] shadow-xl border border-[#78350f]">
                <div className="bg-[#064e3b] border border-[#047857] rounded-lg px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-center shadow-inner">
                  <div className="text-[9px] sm:text-[10.5px] font-semibold text-emerald-100 uppercase tracking-widest leading-none">
                    For
                  </div>
                  <div className="text-[11px] sm:text-[13px] font-bold text-white tracking-wide leading-tight">
                    Class
                  </div>
                  <div className="text-sm sm:text-lg font-black text-amber-300 tracking-wider leading-none mt-0.5">
                    1 – 6
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Stage Container: 4 Standing Books on Wooden Pedestal */}
            <div className="relative w-full max-w-[420px] sm:max-w-[500px] flex flex-col items-center justify-center">
              
              {/* 4 Standing Books with 3D Angles & Drop Shadows */}
              <div
                key={`books-stage-${activeSlide.id}`}
                className="relative z-10 w-full flex items-end justify-center -space-x-3.5 xs:-space-x-4 sm:-space-x-6 px-2 transition-all duration-500"
              >
                {activeSlide.books.map((b, bIdx) => {
                  const isGovt = b.isGovt;
                  const isLeft = b.role === 'left';
                  const isRightCenter = b.role === 'right-center';
                  const isRight = b.role === 'right';

                  // Dynamic 3D depth, angle, and layering matching the mockup
                  let zIndex = 10;
                  let transformClass = '';
                  let widthClass = 'w-[80px] xs:w-[95px] sm:w-[125px]';

                  if (isGovt) {
                    zIndex = 30;
                    widthClass = 'w-[95px] xs:w-[115px] sm:w-[155px]';
                    transformClass = 'scale-105 sm:scale-110 -translate-y-1 sm:-translate-y-2';
                  } else if (isLeft) {
                    zIndex = 15;
                    transformClass = 'perspective-[600px] rotate-y-6 sm:rotate-y-8';
                  } else if (isRightCenter) {
                    zIndex = 20;
                    widthClass = 'w-[85px] xs:w-[100px] sm:w-[130px]';
                    transformClass = 'perspective-[600px] -rotate-y-4';
                  } else if (isRight) {
                    zIndex = 10;
                    transformClass = 'perspective-[600px] -rotate-y-8 sm:-rotate-y-12';
                  }

                  return (
                    <div
                      key={`book-${activeSlide.id}-${bIdx}`}
                      onClick={() => handleBookClick(b.bookId)}
                      className={`relative shrink-0 flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${widthClass} ${transformClass}`}
                      style={{ zIndex }}
                      title={b.bookId ? `Click to preview ${b.title}` : b.title}
                    >
                      {/* Floating Micro Badge for Government Textbook */}
                      {isGovt && (
                        <div className="mb-1 inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9.5px] uppercase tracking-wider shadow-xs whitespace-nowrap">
                          <span>Govt Companion</span>
                        </div>
                      )}

                      {/* Book Cover Image */}
                      <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                        <img
                          src={b.coverImg}
                          alt={b.title}
                          className="w-full h-full object-contain rounded-xs drop-shadow-[0_12px_16px_rgba(0,0,0,0.32)] sm:drop-shadow-[0_18px_24px_rgba(0,0,0,0.38)] group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover Preview Overlay */}
                        {b.bookId && (
                          <div className="absolute inset-0 bg-black/30 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/95 text-slate-900 font-extrabold text-[9px] sm:text-xs px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Eye className="w-3 h-3 text-orange-600" /> Preview
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Small Label below book */}
                      <span className="mt-1 text-[8.5px] sm:text-[10px] font-bold text-stone-600 truncate max-w-full text-center">
                        {b.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Round Polished Wooden Tabletop Pedestal */}
              <div className="relative w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[500px] h-[48px] sm:h-[62px] -mt-5 sm:-mt-7 z-0 flex items-center justify-center">
                {/* Ambient Table Shadow on Floor */}
                <div className="absolute inset-x-4 top-4 h-9 sm:h-12 bg-amber-950/25 rounded-full blur-xl transform scale-y-50 pointer-events-none" />

                {/* Polished Wood Tabletop Ellipse */}
                <div
                  className="w-full h-full rounded-[50%] shadow-[0_14px_30px_rgba(78,42,16,0.32)] border-t border-amber-200/70 relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 25%, #dfb589 0%, #b88653 40%, #8c5828 75%, #5a3411 100%)',
                  }}
                >
                  {/* Subtle Wood Highlight Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 opacity-35 pointer-events-none" />
                  {/* Beveled Edge Inset Shadow */}
                  <div className="absolute inset-0 rounded-[50%] shadow-[inset_0_3px_5px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.45)] pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Auto-Scroll Slide Indicator Dots & Class Tag */}
            <div className="flex flex-col items-center gap-1.5 mt-2.5 z-20">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Prev Arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded-full bg-white/80 hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  aria-label="Previous Class Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Dots */}
                {HERO_SLIDES.map((s, idx) => (
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
                  className="p-1 rounded-full bg-white/80 hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  aria-label="Next Class Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Class Pill Tag */}
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-stone-600 bg-white/90 border border-stone-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Showing:</span>
                <span className="text-slate-900 font-extrabold">{activeSlide.classNameLabel} Series</span>
                <span className="text-stone-400">•</span>
                <span className="text-amber-700">{activeSlide.badge}</span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            MOBILE ACTION BUTTONS (Stacked below the stage on mobile)
           ======================================================== */}
        <div className="lg:hidden flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 w-full max-w-sm mx-auto mt-4">
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

        {/* ========================================================
            BOTTOM 3-COLUMN TRUST STRIP (Directly matching mockups)
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
