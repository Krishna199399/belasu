'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BookProduct, SamplePage, SamplePageCategory } from '@/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  Star,
  CheckCircle2,
  FileText,
  BookMarked,
  Pencil,
  Sparkles,
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
  const [activeCategory, setActiveCategory] = useState<'All' | SamplePageCategory>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Build the complete sample pages array (always runs unconditionally)
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
        kannadaText: 'ಅಧ್ಯಾಯ ವಿವರಣೆ (Lesson Overview)',
        englishTranslation: 'Line-by-line English translation and solved exercises provided in the book.',
      },
    ];
  }, [book]);

  // Filter samples based on category filter (always runs unconditionally)
  const displayedSamples = useMemo(() => {
    if (activeCategory === 'All') return allSamples;
    const filtered = allSamples.filter((s) => s.category === activeCategory);
    return filtered.length > 0 ? filtered : allSamples;
  }, [allSamples, activeCategory]);

  // Reset state when book changes
  useEffect(() => {
    setCurrentPageIndex(0);
    setActiveCategory('All');
    setZoomLevel(1);
  }, [book]);

  // Safe navigation calculation
  const safeIndex = Math.min(currentPageIndex, Math.max(0, displayedSamples.length - 1));
  const currentSample = displayedSamples[safeIndex] || allSamples[0];

  const handleNext = () => {
    if (safeIndex < displayedSamples.length - 1) {
      setCurrentPageIndex(safeIndex + 1);
      setZoomLevel(1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentPageIndex(safeIndex - 1);
      setZoomLevel(1);
    }
  };

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!book) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (safeIndex < displayedSamples.length - 1) {
          setCurrentPageIndex((prev) => Math.min(prev + 1, displayedSamples.length - 1));
          setZoomLevel(1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (safeIndex > 0) {
          setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
          setZoomLevel(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, safeIndex, displayedSamples.length, onClose]);

  // Prevent background website scrolling when modal is open
  useEffect(() => {
    if (!book) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [book]);

  // Early return ONLY after all hooks have been unconditionally invoked
  if (!book || !currentSample) return null;

  const handleSelectCategory = (cat: 'All' | SamplePageCategory) => {
    setActiveCategory(cat);
    setCurrentPageIndex(0);
    setZoomLevel(1);
  };

  const handleAddToCart = () => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart`);
    openCart();
    onClose();
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const resetZoom = () => setZoomLevel(1);

  // Available categories with counts
  const categories: Array<{ id: 'All' | SamplePageCategory; label: string; icon: React.ReactNode; count: number }> = [
    { id: 'All', label: 'All Pages', icon: <Sparkles className="w-3.5 h-3.5" />, count: allSamples.length },
    {
      id: 'Index',
      label: 'Index',
      icon: <FileText className="w-3.5 h-3.5" />,
      count: allSamples.filter((s) => s.category === 'Index').length,
    },
    {
      id: 'Poem',
      label: 'Poem & Lesson',
      icon: <BookMarked className="w-3.5 h-3.5" />,
      count: allSamples.filter((s) => s.category === 'Poem').length,
    },
    {
      id: 'Exercises',
      label: 'Exercises',
      icon: <Pencil className="w-3.5 h-3.5" />,
      count: allSamples.filter((s) => s.category === 'Exercises').length,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 overscroll-contain"
    >
      
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[95vh] border border-stone-200 overscroll-contain"
      >
        
        {/* ── Top Bar: Title & Category Tabs ── */}
        <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <h3 className="font-serif font-black text-slate-900 text-sm sm:text-base truncate">
                {book.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Class {book.gradeClass} · {book.series} Kannada State Board Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Filter Pills */}
            <div className="hidden sm:inline-flex p-1 bg-stone-200/80 rounded-xl border border-stone-300/80">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-stone-200/80 transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Category Bar */}
        <div className="sm:hidden bg-stone-100 px-3 py-2 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto overscroll-contain scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white text-slate-600 border border-stone-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Body: Viewer (70%) + Details Sidebar (30%) ── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* Left / Center Column: High-Res Scanned Page Canvas */}
          <div className="flex-1 bg-stone-900/95 flex flex-col justify-between relative overflow-hidden p-3 sm:p-5">
            
            {/* Canvas Header Overlay */}
            <div className="flex items-center justify-between text-white z-10 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                  {currentSample.category === 'Index' && <FileText className="w-3 h-3" />}
                  {currentSample.category === 'Poem' && <BookMarked className="w-3 h-3" />}
                  {currentSample.category === 'Exercises' && <Pencil className="w-3 h-3" />}
                  <span>{currentSample.category || 'Sample'} Page</span>
                </span>
                <span className="text-xs text-stone-300 font-medium hidden sm:inline">
                  {currentSample.title}
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.75}
                  className="p-1 text-stone-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-stone-300 font-mono px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 2.5}
                  className="p-1 text-stone-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="p-1 text-stone-400 hover:text-amber-400 ml-1 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* High-Resolution Scanned Page Image Viewport */}
            <div className="flex-1 flex items-center justify-center relative overflow-auto overscroll-contain rounded-2xl bg-stone-950/60 p-2 sm:p-4">
              <div
                className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={currentSample.imageUrl}
                  alt={currentSample.title}
                  className="max-h-[50vh] sm:max-h-[60vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10 select-none pointer-events-none"
                />
              </div>

              {/* Canvas Arrow Controls */}
              {displayedSamples.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={safeIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer z-10 shadow-lg"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={safeIndex === displayedSamples.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer z-10 shadow-lg"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Interactive Thumbnail Strip */}
            {displayedSamples.length > 1 && (
              <div className="pt-3 z-10 flex items-center justify-center gap-2 overflow-x-auto overscroll-contain scrollbar-none py-1">
                {displayedSamples.map((sample, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentPageIndex(idx);
                        setZoomLevel(1);
                      }}
                      className={`relative p-1 rounded-xl bg-stone-800 transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                        isActive
                          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-105'
                          : 'border-stone-700 hover:border-stone-500 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="h-10 sm:h-12 w-auto object-cover rounded-md"
                      />
                      <div className="text-left pr-2 text-white hidden sm:block">
                        <div className="text-[10px] font-black uppercase text-amber-400">
                          {sample.category || `Page ${idx + 1}`}
                        </div>
                        <div className="text-[11px] font-bold text-stone-200 max-w-[100px] truncate">
                          {sample.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Column: Book Details, Pricing & Direct Cart Actions */}
          <div className="lg:w-80 xl:w-96 p-5 sm:p-7 bg-white border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between overflow-y-auto overscroll-contain space-y-6">
            
            <div className="space-y-4">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                  Class {book.gradeClass} Edition
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-600 bg-stone-100">
                  {book.series} Kannada
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 leading-snug">
                  {book.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">({book.reviewCount || 48} reviews)</span>
                </div>
              </div>

              {/* Verified Reassurance Pillars */}
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
                  <span>100% aligned to Karnataka State Board</span>
                </div>
              </div>

              {/* Current Sample Notes */}
              {currentSample.englishTranslation && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="font-bold text-slate-700 text-[11px]">
                    Current Preview Focus:
                  </div>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    {currentSample.englishTranslation}
                  </p>
                </div>
              )}

            </div>

            {/* Bottom Pricing & Add to Cart Action */}
            <div className="pt-4 border-t border-stone-200 space-y-3 pb-safe">
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
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  In Stock · Ready to Ship
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider min-h-[48px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fast 3–5 day delivery across Karnataka</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
