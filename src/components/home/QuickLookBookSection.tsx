'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { BookProduct, BookSeries } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

type CurriculumTrack = 'SaviSiri' | 'KaliTili';

export const QuickLookBookSection: React.FC = () => {
  const { addToCart, openCart } = useCart();

  // Curriculum track: Savi & Siri (1st Language) vs Kali & Tili (2nd Language)
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>('SaviSiri');

  // Selected series and class (default: Savi Class 1)
  const [selectedSeries, setSelectedSeries] = useState<BookSeries>('Savi');
  const [selectedClass, setSelectedClass] = useState<number>(1);

  // Active book lookup
  const activeBook = useMemo(() => {
    const found = BOOKS_DATA.find(
      (b) => b.series === selectedSeries && b.gradeClass === selectedClass
    );
    if (found) return found;
    return BOOKS_DATA.find((b) => b.series === selectedSeries) || BOOKS_DATA[0]; // Savi 1 default
  }, [selectedSeries, selectedClass]);

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

  const handleAddToCart = () => {
    if (!activeBook) return;
    addToCart(activeBook, 'physical', 1);
    toast.success(`Added ${activeBook.title} to cart`);
    openCart();
  };

  // Horizontal gallery items:
  // 1. Govt Part 1 (or single)
  // 2. Govt Part 2 (if available)
  // 3. Belesu Book Cover
  // 4. Sample Page 1 (Index)
  // 5. Sample Page 2 (Poem / Translation)
  // 6. Sample Page 3 (Exercises)
  const galleryItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      tag: string;
      imageUrl: string;
      badgeColor: string;
      badgeText: string;
    }> = [];

    // Govt Part 1
    if (activeBook.karnatakaTextbookCover) {
      items.push({
        id: 'govt-1',
        title: `${activeBook.series} Kannada Class ${activeBook.gradeClass} (Part 1)`,
        tag: activeBook.karnatakaTextbookPart2Cover ? 'Govt Textbook Part 1' : 'Govt Prescribed Textbook',
        imageUrl: activeBook.karnatakaTextbookCover,
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        badgeText: 'Govt School Book',
      });
    }

    // Govt Part 2 (if available)
    if (activeBook.karnatakaTextbookPart2Cover) {
      items.push({
        id: 'govt-2',
        title: `${activeBook.series} Kannada Class ${activeBook.gradeClass} (Part 2)`,
        tag: 'Govt Textbook Part 2',
        imageUrl: activeBook.karnatakaTextbookPart2Cover,
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        badgeText: 'Govt School Book',
      });
    }

    // Belesu Guidebook Front Cover
    items.push({
      id: 'belesu-cover',
      title: activeBook.title,
      tag: 'Belesu Guidebook Cover',
      imageUrl: activeBook.coverImage,
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
      badgeText: 'Belesu Guidebook',
    });

    // Sample Inside Pages (Index, Translation, Exercises)
    if (activeBook.samplePages && activeBook.samplePages.length > 0) {
      const pageTags = ['1. Syllabus Index', '2. English Translation', '3. Solved Exercises'];
      activeBook.samplePages.forEach((page, idx) => {
        items.push({
          id: `sample-${idx}`,
          title: page.title || `Sample Page ${idx + 1}`,
          tag: pageTags[idx] || `Sample Page ${idx + 1}`,
          imageUrl: page.imageUrl,
          badgeColor: 'bg-stone-100 text-slate-800 border-stone-200',
          badgeText: `Sample ${idx + 1}`,
        });
      });
    }

    return items;
  }, [activeBook]);

  return (
    <section className="bg-gradient-to-b from-stone-50 via-white to-amber-50/20 py-8 sm:py-10 lg:py-12 border-b border-stone-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header (Compact & Crisp) ── */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>State Syllabus Reference · All 10 Books</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            A Quick Look Inside Our Books
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Preview sample pages to understand the layout and learning approach before choosing a guidebook.
          </p>
        </div>

        {/* ── Unified Single-Row Control Bar (Eliminates 5 bloated vertical layers) ── */}
        <div className="max-w-4xl mx-auto mb-4 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Track Switcher Segment */}
          <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSelectTrack('SaviSiri')}
              className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[38px] ${
                selectedTrack === 'SaviSiri'
                  ? 'bg-slate-900 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Savi & Siri (1–5)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTrack('KaliTili')}
              className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[38px] ${
                selectedTrack === 'KaliTili'
                  ? 'bg-slate-900 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Kali & Tili (1–5)</span>
            </button>
          </div>

          {/* Clean Class Pills (Class 1 to Class 5 in one row) */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Class:
            </span>
            <div className="grid grid-cols-5 gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 w-full sm:w-auto">
              {[1, 2, 3, 4, 5].map((cls) => {
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleSelectClass(cls)}
                    className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center min-h-[36px] flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#b47a46] text-white shadow-xs font-black ring-1 ring-amber-400/50'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-stone-200/60'
                    }`}
                  >
                    Cl {cls}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── Active Book Title & Direct Purchase Strip ── */}
        <div className="max-w-4xl mx-auto mb-4 px-3 py-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-sm text-slate-900">
              {`${activeBook.series} Kannada Class ${activeBook.gradeClass} Guide Book`}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-emerald-800 font-semibold text-[11px] bg-emerald-100/80 px-2 py-0.5 rounded">
              Matches Govt Syllabus
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider min-h-[40px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            HORIZONTAL VISUAL FILMSTRIP (Govt Book Covers ➔ Belesu ➔ Inside Scans)
            (Sleek ~220px Height: Fits comfortably in screen!)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="mb-5">
          <div className="flex items-center justify-start lg:justify-center gap-3 overflow-x-auto overflow-y-hidden pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-stone-300 overscroll-x-auto overscroll-y-auto">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="shrink-0 flex flex-col items-center group transition-transform duration-200"
              >
                {/* Book / Page Stage (Compact ~210px) */}
                <div className="relative h-48 sm:h-52 lg:h-56 aspect-[3/4] bg-white rounded-lg overflow-hidden border border-stone-200 shadow-sm p-1 flex items-center justify-center bg-stone-50/40">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                </div>

                {/* Compact Tag below each card */}
                <span
                  className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded border text-center whitespace-nowrap shadow-2xs ${item.badgeColor}`}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Curriculum Series Explore CTAs matching home page.md ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/books?series=Savi"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-xs transition transform active:scale-95 uppercase min-h-[44px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Savi Kannada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/books?series=Siri"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 sm:py-2.5 bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-2xs transition transform active:scale-95 uppercase min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Explore Siri Kannada</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
};

