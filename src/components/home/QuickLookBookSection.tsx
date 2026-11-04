'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  X,
  ZoomIn,
  Scale,
} from 'lucide-react';
import Link from 'next/link';
import { BookSeries, BookProduct } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { GovernmentBookCompareModal } from '@/components/home/GovernmentBookCompareModal';
import toast from 'react-hot-toast';

type CurriculumTrack = 'SaviSiri' | 'KaliTili';

export const QuickLookBookSection: React.FC = () => {
  const { addToCart, openCart } = useCart();
  const [books, setBooks] = useState<BookProduct[]>(BOOKS_DATA);

  // Curriculum track: Savi & Siri (1st Language) vs Kali & Tili (2nd Language)
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>('SaviSiri');

  // Selected series and class (default: Savi Class 1)
  const [selectedSeries, setSelectedSeries] = useState<BookSeries>('Savi');
  const [selectedClass, setSelectedClass] = useState<number>(1);

  // Government book comparison modal state
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Lightbox preview modal state
  const [modalItem, setModalItem] = useState<{
    id: string;
    title: string;
    tag: string;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.books && Array.isArray(data.books)) {
          setBooks(data.books);
        }
      })
      .catch((err) => console.error('Failed to load live book data in quicklook:', err));
  }, []);

  // Active book lookup
  const activeBook = useMemo(() => {
    const found = books.find(
      (b) => b.series === selectedSeries && b.gradeClass === selectedClass
    );
    if (found) return found;
    return books.find((b) => b.series === selectedSeries) || books[0];
  }, [books, selectedSeries, selectedClass]);

  const isOutOfStock = !activeBook.inStock || (activeBook.stockQuantity !== undefined && activeBook.stockQuantity <= 0);

  // Handle Track Switch
  const handleSelectTrack = (track: CurriculumTrack) => {
    setSelectedTrack(track);
    if (track === 'SaviSiri') {
      setSelectedSeries(selectedClass === 5 ? 'Siri' : 'Savi');
    } else {
      setSelectedSeries(selectedClass === 5 ? 'Tili' : 'Kali');
    }
  };

  // Handle Class Switch (1 to 5)
  const handleSelectClass = (cls: number) => {
    setSelectedClass(cls);
    if (cls === 5) {
      setSelectedSeries(selectedTrack === 'SaviSiri' ? 'Siri' : 'Tili');
    } else {
      setSelectedSeries(selectedTrack === 'SaviSiri' ? 'Savi' : 'Kali');
    }
  };

  // Navigation arrows cycle through classes 1 to 5
  const handlePrevClass = () => {
    const newClass = selectedClass > 1 ? selectedClass - 1 : 5;
    handleSelectClass(newClass);
  };

  const handleNextClass = () => {
    const newClass = selectedClass < 5 ? selectedClass + 1 : 1;
    handleSelectClass(newClass);
  };

  const handleAddToCart = () => {
    if (!activeBook) return;
    if (isOutOfStock) {
      toast.error(`${activeBook.title} is currently out of stock`);
      return;
    }
    addToCart(activeBook, 'physical', 1);
    toast.success(`Added ${activeBook.title} to cart`);
    openCart();
  };

  // 6 Filmstrip gallery items matching reference mockups:
  // 1. Govt Part 1
  // 2. Govt Part 2
  // 3. Belesu Book Cover
  // 4. Sample Page 1 (Syllabus Index)
  // 5. Sample Page 2 (English Translation)
  // 6. Sample Page 3 (Solved Exercises)
  const galleryItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      tag: string;
      imageUrl: string;
      pillStyle: string;
    }> = [];

    // 1. Govt Part 1
    if (activeBook.karnatakaTextbookCover) {
      items.push({
        id: 'govt-1',
        title: `${activeBook.series} Kannada Class ${activeBook.gradeClass} ${activeBook.karnatakaTextbookPart2Cover ? '(Part 1)' : '(Govt Textbook)'}`,
        tag: activeBook.karnatakaTextbookPart2Cover ? 'Govt Textbook Part 1' : 'Govt State Textbook',
        imageUrl: activeBook.karnatakaTextbookCover,
        pillStyle: 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46]',
      });
    }

    // 2. Govt Part 2 (or Side-by-Side Comparison Card if Part 2 not published)
    if (activeBook.karnatakaTextbookPart2Cover) {
      items.push({
        id: 'govt-2',
        title: `${activeBook.series} Kannada Class ${activeBook.gradeClass} (Part 2)`,
        tag: 'Govt Textbook Part 2',
        imageUrl: activeBook.karnatakaTextbookPart2Cover,
        pillStyle: 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46]',
      });
    } else if (activeBook.karnatakaTextbookCover) {
      // Compare Govt vs Belesu image removed — not shown in gallery
    }

    // 3. Belesu Guidebook Front Cover
    items.push({
      id: 'belesu-cover',
      title: activeBook.title,
      tag: 'Belesu Guidebook Cover',
      imageUrl: activeBook.coverImage,
      pillStyle: 'bg-[#fffbeb] border border-[#fde68a] text-[#92400e]',
    });

    // 4, 5, 6. Sample Inside Pages
    const pageTags = ['1. Syllabus Index', '2. English Translation', '3. Solved Exercises'];
    if (activeBook.samplePages && activeBook.samplePages.length > 0) {
      activeBook.samplePages.forEach((page, idx) => {
        items.push({
          id: `sample-${idx}`,
          title: page.title || pageTags[idx] || `Sample Page ${idx + 1}`,
          tag: pageTags[idx] || `Sample ${idx + 1}`,
          imageUrl: page.imageUrl,
          pillStyle: 'bg-white border border-slate-200 text-slate-700 shadow-2xs',
        });
      });
    }

    return items;
  }, [activeBook]);

  return (
    <section className="relative w-full bg-gradient-to-b from-[#fdfbf7] via-white to-[#fff9ee] py-10 sm:py-14 lg:py-16 border-b border-amber-100/80 overflow-hidden select-none">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-6 sm:mb-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#fef9ee] border border-[#fde68a] text-[#78350f] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="hidden sm:inline">STATE SYLLABUS REFERENCE – ALL BOOKS</span>
            <span className="sm:hidden">STATE SYLLABUS REFERENCE – ALL 10 BOOKS</span>
          </div>

          {/* H2 Title with Radiant Flares */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-amber-500 font-serif text-xl sm:text-2xl font-bold tracking-tight">⇶</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[2.65rem] font-serif font-black text-slate-900 tracking-tight leading-tight">
              A Quick Look Inside Our Books
            </h2>
            <span className="text-amber-500 font-serif text-xl sm:text-2xl font-bold tracking-tight">⇶</span>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Preview sample pages to understand the layout and learning approach before choosing a guidebook.
          </p>
        </div>

        {/* ── 2. Unified Controls Bar (Track Switcher + Class Pills) ── */}
        <div className="max-w-4xl mx-auto mb-5 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Track Switcher (Savi & Siri vs Kali & Tili) */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSelectTrack('SaviSiri')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[38px] ${
                selectedTrack === 'SaviSiri'
                  ? 'bg-[#0c1e38] text-white shadow-xs font-black'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Savi & Siri (1–5)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTrack('KaliTili')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[38px] ${
                selectedTrack === 'KaliTili'
                  ? 'bg-[#0c1e38] text-white shadow-xs font-black'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kali & Tili (1–5)</span>
            </button>
          </div>

          {/* Class Selector Pills (C1 to C5) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              CLASS:
            </span>
            <div className="grid grid-cols-5 gap-1.5 w-full sm:w-auto">
              {[1, 2, 3, 4, 5].map((cls) => {
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleSelectClass(cls)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center min-h-[36px] flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#f97316] text-white font-black shadow-xs ring-2 ring-orange-400/30'
                        : 'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50'
                    }`}
                  >
                    C{cls}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── 3. Active Book Title & Direct Cart Action Strip ── */}
        <div className="max-w-5xl mx-auto mb-6 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-center sm:text-left justify-center sm:justify-start">
            <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg">
              {`${activeBook.series} Kannada Class ${activeBook.gradeClass} Guidebook`}
            </h3>
            {/* Compare Govt vs Belesu button removed */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matches Govt. Syllabus</span>
            </span>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <span>✕</span>
                <span>Out of Stock</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span>✓</span>
                <span>In Stock</span>
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider min-h-[42px]"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>OUT OF STOCK</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider min-h-[42px]"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>ADD TO CART</span>
            </button>
          )}
        </div>

        {/* ── 4. Showcase Gallery (Desktop 6-Card Row / Mobile 3-Column Grid) ── */}
        <div className="relative max-w-6xl mx-auto mb-8 px-8 sm:px-10">
          
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrevClass}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer z-20 active:scale-95"
            aria-label="Previous Class Sample Pages"
            title="View Previous Class"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Cards Grid: Mobile 3-Cols / Desktop 6-Cols */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 lg:gap-4 items-start">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.id === 'govt-compare') {
                    setShowCompareModal(true);
                  } else {
                    setModalItem(item);
                  }
                }}
                className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1 duration-200"
                title={`Click to preview: ${item.title}`}
              >
                {/* White Rounded Card */}
                <div className="relative w-full aspect-[3/4] bg-white rounded-2xl p-1.5 sm:p-2 border border-slate-200/90 shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden bg-slate-50/40">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain pointer-events-none select-none transition-transform group-hover:scale-[1.03] duration-300"
                    draggable={false}
                  />

                  {/* Hover Zoom Overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="p-1.5 bg-white/95 rounded-full shadow-md text-slate-800">
                      <ZoomIn className="w-4 h-4 text-orange-600" />
                    </span>
                  </div>
                </div>

                {/* Bottom Pill Badge */}
                <span
                  className={`mt-2 text-[9px] xs:text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-full text-center whitespace-nowrap shadow-2xs w-full truncate ${item.pillStyle}`}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNextClass}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer z-20 active:scale-95"
            aria-label="Next Class Sample Pages"
            title="View Next Class"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Dots Indicator (Class 1 to 5) */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {[1, 2, 3, 4, 5].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => handleSelectClass(cls)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  selectedClass === cls
                    ? 'w-6 h-2 bg-orange-500'
                    : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Jump to Class ${cls}`}
              />
            ))}
          </div>

        </div>

        {/* ── 5. Bottom Series Buy CTAs ── */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          {selectedTrack === 'SaviSiri' ? (
            <>
              <Link
                href="/books/?series=Savi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm tracking-wider rounded-full shadow-sm hover:shadow-md transition transform active:scale-98 uppercase whitespace-nowrap min-h-[46px]"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>BUY SAVI KANNADA</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <Link
                href="/books/?series=Siri"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-white hover:bg-amber-50/60 border-2 border-[#f59e0b] text-slate-900 font-black text-xs sm:text-sm tracking-wider rounded-full shadow-2xs hover:shadow-sm transition transform active:scale-98 uppercase whitespace-nowrap min-h-[46px]"
              >
                <BookOpen className="w-4 h-4 shrink-0 text-amber-600" />
                <span>BUY SIRI KANNADA</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-amber-600" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/books/?series=Kali"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm tracking-wider rounded-full shadow-sm hover:shadow-md transition transform active:scale-98 uppercase whitespace-nowrap min-h-[46px]"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>BUY KALI KANNADA</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <Link
                href="/books/?series=Tili"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-white hover:bg-amber-50/60 border-2 border-[#f59e0b] text-slate-900 font-black text-xs sm:text-sm tracking-wider rounded-full shadow-2xs hover:shadow-sm transition transform active:scale-98 uppercase whitespace-nowrap min-h-[46px]"
              >
                <BookOpen className="w-4 h-4 shrink-0 text-amber-600" />
                <span>BUY TILI KANNADA</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-amber-600" />
              </Link>
            </>
          )}
        </div>

      </div>

      {/* ── 6. Fullscreen Sample Page Lightbox Modal ── */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalItem(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-slate-900 text-sm sm:text-base">
                  {modalItem.title}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {modalItem.tag}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalItem(null);
                    setShowCompareModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition cursor-pointer shadow-2xs"
                  title="Open side-by-side comparison"
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xs:inline">Compare with Govt</span>
                  <span className="xs:hidden">Compare</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* High-Res Image View */}
            <div className="relative w-full max-h-[70vh] aspect-[3/4] my-4 flex items-center justify-center overflow-hidden bg-slate-50 rounded-2xl">
              <img
                src={modalItem.imageUrl}
                alt={modalItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Modal Bottom Action */}
            <div className="w-full flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Official Karnataka Curriculum Reference & Translation
              </span>
              <button
                type="button"
                onClick={() => {
                  setModalItem(null);
                  handleAddToCart();
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy This Book</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Interactive Government Book Comparison Modal ── */}
      <GovernmentBookCompareModal
        book={activeBook}
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        onAddToCart={handleAddToCart}
      />

    </section>
  );
};
