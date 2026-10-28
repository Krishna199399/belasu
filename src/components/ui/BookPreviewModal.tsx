'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BookProduct, SamplePage } from '@/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Star,
  CheckCircle2,
  FileText,
  BookMarked,
  Pencil,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface BookPreviewModalProps {
  book: BookProduct | null;
  onClose: () => void;
}

export const BookPreviewModal: React.FC<BookPreviewModalProps> = ({ book, onClose }) => {
  const { addToCart, openCart } = useCart();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [prevBookId, setPrevBookId] = useState<string | number | undefined>(book?.id);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Build the complete sample pages array
  const allSamples: SamplePage[] = useMemo(() => {
    if (!book) return [];
    if (book.samplePages && book.samplePages.length > 0) {
      return book.samplePages;
    }
    // Fallback if no sample pages exist
    return [
      {
        pageNumber: 1,
        title: `${book.title} Sample Lesson`,
        imageUrl: book.coverImage,
        category: 'Poem',
        kannadaText: 'ಪಾಠ ವಿವರಣೆ (Lesson Overview)',
        englishTranslation: 'Line-by-line English translation and solved exercises provided in the book.',
      },
    ];
  }, [book]);

  // Reset state during render when book changes
  if (book && book.id !== prevBookId) {
    setPrevBookId(book.id);
    setCurrentPageIndex(0);
    setZoomLevel(1);
  }

  const totalPages = allSamples.length;
  const safeIndex = Math.min(currentPageIndex, Math.max(0, totalPages - 1));
  const currentSample = allSamples[safeIndex] || allSamples[0];

  const handleNext = useCallback(() => {
    setCurrentPageIndex((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
    setZoomLevel(1);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setZoomLevel(1);
  }, []);

  const handleSelectPage = (index: number) => {
    setCurrentPageIndex(index);
    setZoomLevel(1);
  };

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!book) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, handleNext, handlePrev, onClose]);

  // Prevent background website scrolling when modal is open (Bulletproof mobile iOS/Android + desktop)
  useEffect(() => {
    if (!book) return;

    // Capture current scroll offset
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Compensate for scrollbar disappearing on desktop to avoid layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Freeze body in place at the current viewport position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      // Revert styles
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;

      // Restore previous scroll position seamlessly
      window.scrollTo(0, scrollY);
    };
  }, [book]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // Only swipe if horizontal intent clearly exceeds vertical intent
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchEndX(null);
    setTouchEndY(null);
  };

  if (!book || !currentSample) return null;

  const handleAddToCart = () => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart`);
    openCart();
    onClose();
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.85));
  const resetZoom = () => setZoomLevel(1);

  // Tab config matching the 3 sample page stages
  const pageTabLabels = [
    { label: 'Syllabus Index', icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Lesson & Translation', icon: <BookMarked className="w-3.5 h-3.5" /> },
    { label: 'Solved Exercises', icon: <Pencil className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 md:p-6 animate-in fade-in duration-200 select-none"
      style={{ overscrollBehavior: 'none' }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full sm:h-auto sm:max-h-[94vh] max-w-6xl bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 text-slate-900"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* ── 1. Top Navigation Bar (Single fixed row on all viewports) ── */}
        <div
          className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 select-none"
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Left: Book Meta Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                  Class {book.gradeClass}
                </span>
                <h3 className="font-serif font-black text-slate-900 text-xs sm:text-sm md:text-base truncate">
                  {book.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Right: Page Indicator & Prominent Close Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 bg-white border border-stone-200 px-2.5 py-1 rounded-lg shadow-2xs whitespace-nowrap">
              Page {safeIndex + 1} of {totalPages}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-stone-200/80 transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-stone-200 bg-white shadow-2xs"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. Clean 3-Tab Quick Switcher (Index / Lesson / Exercises) ── */}
        <div
          className="bg-stone-100/90 border-b border-stone-200 px-3 sm:px-6 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none shrink-0"
          style={{ overscrollBehavior: 'contain' }}
        >
          {allSamples.map((sample, idx) => {
            const isActive = idx === safeIndex;
            const tabMeta = pageTabLabels[idx] || {
              label: sample.category || `Page ${idx + 1}`,
              icon: <Sparkles className="w-3.5 h-3.5" />,
            };

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPage(idx)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-1 ring-amber-400'
                    : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-stone-200/70 border border-stone-200'
                }`}
              >
                {tabMeta.icon}
                <span>{tabMeta.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── 3. Main Body: Dual-Pane (Desktop) / Scrollable Canvas (Mobile) ── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-stone-50">
          {/* ── Left: High-Res Scanned Book Page Canvas ── */}
          <div
            ref={canvasRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex-1 flex flex-col justify-between p-3 sm:p-5 relative overflow-y-auto bg-stone-100/60"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            {/* Top Toolbar: Topic Title + Zoom Controls */}
            <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded truncate">
                  {currentSample.title || `Sample Page ${safeIndex + 1}`}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  (Swipe or use arrows to flip)
                </span>
              </div>

              {/* Desktop Zoom Controls */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-stone-200 shadow-2xs text-xs">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.85}
                  className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-700 font-mono px-1 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 2.0}
                  className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="p-1 text-amber-600 hover:text-amber-800 ml-0.5 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Scanned Page Viewport (White Paper on Daylight Background) */}
            <div
              className="flex-1 flex items-center justify-center relative rounded-2xl bg-stone-200/50 p-2 sm:p-4 min-h-[260px] sm:min-h-[300px] overflow-auto"
              style={{ overscrollBehavior: 'contain' }}
            >
              <div
                className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={currentSample.imageUrl}
                  alt={currentSample.title}
                  className="max-h-[52vh] sm:max-h-[58vh] lg:max-h-[64vh] w-auto max-w-full object-contain rounded-lg shadow-xl border border-stone-300 bg-white select-none pointer-events-none"
                />
              </div>

              {/* Prev / Next Touch Arrows */}
              {totalPages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={safeIndex === 0}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-stone-300 shadow-md backdrop-blur-xs disabled:opacity-20 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer z-10"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-800" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={safeIndex === totalPages - 1}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-stone-300 shadow-md backdrop-blur-xs disabled:opacity-20 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer z-10"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-800" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Strip (Desktop & Tablet) */}
            {totalPages > 1 && (
              <div className="hidden sm:flex items-center justify-center gap-3 pt-3 shrink-0">
                {allSamples.map((sample, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPage(idx)}
                      className={`relative p-1 rounded-xl bg-white transition-all duration-200 cursor-pointer flex items-center gap-2 border shadow-2xs ${
                        isActive
                          ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-sm scale-105'
                          : 'border-stone-200 hover:border-amber-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="h-10 sm:h-12 w-auto object-cover rounded-md"
                      />
                      <div className="text-left pr-2">
                        <div className="text-[10px] font-black uppercase text-amber-800">
                          Page {idx + 1}
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 max-w-[110px] truncate">
                          {pageTabLabels[idx]?.label || sample.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right: Book Overview, Learning Support & Purchase Action (Desktop) ── */}
          <div className="hidden lg:flex lg:w-80 xl:w-96 p-5 sm:p-6 bg-white border-l border-stone-200 flex-col justify-between overflow-y-auto space-y-5">
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                  Class {book.gradeClass} Edition
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-stone-100 border border-stone-200">
                  {book.series} Kannada
                </span>
              </div>

              {/* Title & Reviews */}
              <div>
                <h4 className="text-base sm:text-lg font-serif font-black text-slate-900 leading-snug">
                  {book.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">({book.reviewCount || 48} reviews)</span>
                </div>
              </div>

              {/* Verified Learning Pillars */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
                <div className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                  What This Guidebook Provides:
                </div>
                <div className="flex items-start gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Line-by-line parallel English translations</span>
                </div>
                <div className="flex items-start gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Full textbook exercises with solved model answers</span>
                </div>
                <div className="flex items-start gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Karnataka School Textbook Aligned</span>
                </div>
              </div>

              {/* Current Preview Explanation */}
              {currentSample.englishTranslation && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                    About This Sample Page:
                  </div>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    {currentSample.englishTranslation}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Pricing & Buy Action Card */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {formatPrice(book.price)}
                  </div>
                  {book.originalPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      M.R.P: {formatPrice(book.originalPrice)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  In Stock · Ready to Ship
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider min-h-[48px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(book.price)})</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Free 3–5 day delivery across Karnataka</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Mobile Sticky Bottom Purchase Bar (Always Visible on Mobile) ── */}
        <div
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:p-4 pb-safe flex items-center justify-between gap-3 shrink-0 shadow-lg z-20 select-none"
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="min-w-0">
            <div className="text-lg font-black text-slate-900 leading-tight">
              {formatPrice(book.price)}
            </div>
            <div className="text-[10px] font-bold text-emerald-700 truncate">
              In Stock
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 max-w-xs py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
