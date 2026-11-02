'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Eye,
  ShoppingBag,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Check
} from 'lucide-react';
import { BOOKS_DATA } from '@/data/mockData';
import { BookProduct, BookSeries } from '@/types';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

interface CurriculumExplorerProps {
  onPreview?: (book: BookProduct) => void;
}

interface SeriesDeckConfig {
  id: BookSeries;
  title: string;
  badge: string;
  grades: number[];
  defaultGrade: number;
  description: string;
  ctaText: string;
  theme: {
    accent: string;
    border: string;
    hoverBorder: string;
    tagBg: string;
    tagText: string;
    pillActive: string;
    btnBg: string;
    btnHover: string;
    btnText: string;
    shadow: string;
  };
}

const DECK_SERIES: SeriesDeckConfig[] = [
  {
    id: 'Savi',
    title: 'Savi Kannada | Classes 1–4',
    badge: 'CLASSES 1–4',
    grades: [1, 2, 3, 4],
    defaultGrade: 4,
    description: 'English-translated Kannada guidebooks for primary school students.',
    ctaText: 'Buy Book',
    theme: {
      accent: 'text-amber-600',
      border: 'border-amber-200/90',
      hoverBorder: 'hover:border-amber-400',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-900',
      pillActive: 'bg-amber-500 text-slate-950 font-bold shadow-xs',
      btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      btnHover: 'hover:from-amber-600 hover:to-orange-600',
      btnText: 'text-slate-950',
      shadow: 'hover:shadow-amber-500/15',
    },
  },
  {
    id: 'Kali',
    title: 'Kali Kannada | Classes 1–4',
    badge: 'CLASSES 1–4',
    grades: [1, 2, 3, 4],
    defaultGrade: 1,
    description: 'Kannada guidebooks with English translations for primary school learning.',
    ctaText: 'Buy Book',
    theme: {
      accent: 'text-indigo-600',
      border: 'border-indigo-200/90',
      hoverBorder: 'hover:border-indigo-400',
      tagBg: 'bg-indigo-100',
      tagText: 'text-indigo-900',
      pillActive: 'bg-indigo-600 text-white font-bold shadow-xs',
      btnBg: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      btnHover: 'hover:from-indigo-700 hover:to-indigo-800',
      btnText: 'text-white',
      shadow: 'hover:shadow-indigo-500/15',
    },
  },
  {
    id: 'Siri',
    title: 'Siri Kannada | Class 5',
    badge: 'CLASS 5',
    grades: [5],
    defaultGrade: 5,
    description: 'Explore the Class 5 Siri Kannada guidebook.',
    ctaText: 'Buy Book',
    theme: {
      accent: 'text-rose-600',
      border: 'border-rose-200/90',
      hoverBorder: 'hover:border-rose-400',
      tagBg: 'bg-rose-100',
      tagText: 'text-rose-900',
      pillActive: 'bg-rose-600 text-white font-bold shadow-xs',
      btnBg: 'bg-gradient-to-r from-rose-600 to-rose-700',
      btnHover: 'hover:from-rose-700 hover:to-rose-800',
      btnText: 'text-white',
      shadow: 'hover:shadow-rose-500/15',
    },
  },
  {
    id: 'Tili',
    title: 'Tili Kannada | Class 5',
    badge: 'CLASS 5',
    grades: [5],
    defaultGrade: 5,
    description: 'Explore the Class 5 Tili Kannada guidebook.',
    ctaText: 'Buy Book',
    theme: {
      accent: 'text-teal-600',
      border: 'border-teal-200/90',
      hoverBorder: 'hover:border-teal-400',
      tagBg: 'bg-teal-100',
      tagText: 'text-teal-900',
      pillActive: 'bg-teal-600 text-white font-bold shadow-xs',
      btnBg: 'bg-gradient-to-r from-teal-600 to-teal-700',
      btnHover: 'hover:from-teal-700 hover:to-teal-800',
      btnText: 'text-white',
      shadow: 'hover:shadow-teal-500/15',
    },
  },
];

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({ onPreview }) => {
  const { addToCart, openCart } = useCart();
  const [books, setBooks] = useState<BookProduct[]>(BOOKS_DATA);

  // Selected grade per series (for Savi & Kali multi-grade selector)
  const [selectedGrades, setSelectedGrades] = useState<Record<string, number>>({
    Savi: 4,
    Kali: 1,
    Siri: 5,
    Tili: 5,
  });

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.books && Array.isArray(data.books)) {
          setBooks(data.books);
        }
      })
      .catch((err) => console.error('Failed to load live book data in explorer:', err));
  }, []);

  const handleSelectGrade = (seriesId: string, grade: number) => {
    setSelectedGrades((prev) => ({
      ...prev,
      [seriesId]: grade,
    }));
  };

  const handleAddToCart = (book: BookProduct) => {
    if (book.stockQuantity <= 0 || !book.inStock) {
      toast.error(`${book.title} is currently out of stock`);
      return;
    }
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart`);
    openCart();
  };

  return (
    <section
      id="series-deck"
      className="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-[#fefbf6] via-white to-[#fff8ee] border-b border-stone-200"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Decorative Flourishes */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-500 font-serif text-lg sm:text-xl tracking-tighter">⇶</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Find the Right Kannada Guidebook
            </h2>
            <span className="text-amber-500 font-serif text-lg sm:text-xl tracking-tighter">⇶</span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Explore Belesu guidebooks by class and choose the right book for your child.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4-SERIES MASTER DECK
            Mobile: Ergonomic Horizontal Cards (Image 1)
            Desktop: 4-Column Showcase Grid (Image 2)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {DECK_SERIES.map((series) => {
            const currentGrade = selectedGrades[series.id] || series.defaultGrade;
            
            // Resolve active book for selected grade
            const activeBook =
              books.find((b) => b.series === series.id && b.gradeClass === currentGrade) ||
              books.find((b) => b.series === series.id) ||
              books[0];

            const isOutOfStock = !activeBook.inStock || (activeBook.stockQuantity !== undefined && activeBook.stockQuantity <= 0);

            return (
              <div
                key={series.id}
                className={`bg-white rounded-2xl sm:rounded-3xl border ${series.theme.border} ${series.theme.hoverBorder} shadow-xs hover:shadow-lg ${series.theme.shadow} transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-0.5 p-3.5 sm:p-4`}
              >
                
                {/* ========================================================
                    TOP ROW (DESKTOP) / HEADER & METADATA
                   ======================================================== */}
                <div className="hidden sm:flex items-center justify-between mb-2">
                  <span
                    className={`text-[9.5px] uppercase font-black px-2.5 py-0.5 rounded-full ${series.theme.tagBg} ${series.theme.tagText} tracking-wider`}
                  >
                    {series.badge}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50/80 px-2 py-0.5 rounded-full text-[11px] font-extrabold text-amber-950 border border-amber-200/80 shadow-2xs">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* ========================================================
                    MAIN SHOWCASE SECTION:
                    - Mobile: Horizontal Row (Left: Cover, Right: Info)
                    - Desktop: Vertical Stack (Cover on top, Info below)
                   ======================================================== */}
                <div className="flex flex-row sm:flex-col items-center sm:items-stretch gap-3.5 sm:gap-2">
                  
                  {/* Book Cover Image */}
                  <div className="shrink-0 w-[100px] xs:w-[115px] sm:w-full h-36 sm:h-44 flex items-center justify-center relative group/stage">
                    <Link
                      href={`/books/${activeBook.slug}`}
                      className="h-full flex items-center justify-center transform group-hover/stage:scale-105 transition-transform duration-300 drop-shadow-sm block cursor-pointer"
                      title={`View ${activeBook.title}`}
                    >
                      <img
                        src={activeBook.coverImage}
                        alt={activeBook.title}
                        className="max-h-full w-auto object-contain rounded-md shadow-md hover:brightness-105 transition-all"
                      />
                    </Link>
                  </div>

                  {/* Information Details (Right on mobile, Below on desktop) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5 sm:space-y-2">
                    
                    {/* Mobile Only: Top Badge & Rating Row */}
                    <div className="flex sm:hidden items-center justify-between">
                      <span
                        className={`text-[8.5px] uppercase font-black px-2 py-0.5 rounded-full ${series.theme.tagBg} ${series.theme.tagText} tracking-wider`}
                      >
                        {series.badge}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-amber-950 border border-amber-200">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>4.9</span>
                      </div>
                    </div>

                    {/* Series Title */}
                    <h3 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug">
                      <Link
                        href={`/books/${activeBook.slug}`}
                        className="hover:text-amber-600 transition-colors block line-clamp-1"
                        title={activeBook.title}
                      >
                        {series.title}
                      </Link>
                    </h3>

                    {/* Series Description */}
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal line-clamp-2 min-h-[30px]">
                      {series.description}
                    </p>

                    {/* Interactive Class Edition Selector Pills */}
                    {series.grades.length > 1 ? (
                      <div className="pt-1">
                        <div className="grid grid-cols-4 gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200 shadow-2xs">
                          {series.grades.map((grade) => {
                            const isSel = currentGrade === grade;
                            return (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => handleSelectGrade(series.id, grade)}
                                className={`py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer text-center min-h-[28px] sm:min-h-[32px] flex items-center justify-center ${
                                  isSel
                                    ? series.theme.pillActive
                                    : 'text-slate-600 hover:text-slate-950 hover:bg-white bg-transparent'
                                }`}
                                aria-label={`Select Class ${grade}`}
                              >
                                {`Class ${grade}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1">
                        <div className="py-1 px-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center text-[10.5px] font-bold text-slate-700 shadow-2xs">
                          Class 5 Edition · State Board
                        </div>
                      </div>
                    )}

                    {/* Mobile Only: Price & Stock inline with info */}
                    <div className="flex sm:hidden items-baseline justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-900">
                          ₹{activeBook.price}
                        </span>
                        {activeBook.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{activeBook.originalPrice}
                          </span>
                        )}
                      </div>
                      {isOutOfStock ? (
                        <span className="text-[8.5px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-0.5">
                          <span className="font-bold">✕</span>
                          <span>Out of Stock</span>
                        </span>
                      ) : (
                        <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                          <span>In Stock · Fast Dispatch</span>
                        </span>
                      )}
                    </div>

                  </div>

                </div>

                {/* ========================================================
                    CARD FOOTER: Pricing & Action Buttons
                   ======================================================== */}
                <div className="pt-3 border-t border-stone-100 space-y-2.5 mt-2 sm:mt-3">
                  
                  {/* Desktop Only: Price & Stock Status Bar */}
                  <div className="hidden sm:flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900">
                        ₹{activeBook.price}
                      </span>
                      {activeBook.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{activeBook.originalPrice}
                        </span>
                      )}
                    </div>
                    {isOutOfStock ? (
                      <span className="text-[9.5px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-0.5">
                        <span className="font-bold">✕</span>
                        <span>Out of Stock</span>
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>In Stock · Fast Dispatch</span>
                      </span>
                    )}
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Left Button: Preview Sample Pages */}
                    <button
                      type="button"
                      onClick={() => onPreview && onPreview(activeBook)}
                      className="py-2.5 px-2 rounded-xl bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs min-h-[42px]"
                      title={`Preview sample pages of ${activeBook.title}`}
                      aria-label={`Preview sample pages of ${activeBook.title}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="truncate">Preview Pages</span>
                    </button>

                    {/* Right Button: Primary BUY BOOK + Add to Cart */}
                    <div className="flex items-center gap-1">
                      {isOutOfStock ? (
                        <Link
                          href={`/books/${activeBook.slug}`}
                          title={`View ${activeBook.title} (Temporarily Out of Stock)`}
                          className="flex-1 py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 shadow-2xs flex items-center justify-center gap-1 transition cursor-pointer uppercase tracking-wider min-h-[42px]"
                        >
                          <span className="truncate">Out of Stock</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                      ) : (
                        <Link
                          href={`/books/${activeBook.slug}`}
                          title={`Buy ${activeBook.title}`}
                          className={`flex-1 py-2.5 px-2.5 rounded-xl font-bold text-xs ${series.theme.btnBg} ${series.theme.btnHover} ${series.theme.btnText} shadow-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer uppercase tracking-wider min-h-[42px]`}
                        >
                          <span className="truncate">{series.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                      )}

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleAddToCart(activeBook)}
                        title={isOutOfStock ? `${activeBook.title} is currently out of stock` : `Add ${activeBook.title} to cart`}
                        aria-label={isOutOfStock ? `${activeBook.title} is currently out of stock` : `Add ${activeBook.title} to cart`}
                        className={`py-2.5 px-2.5 rounded-xl border flex items-center justify-center transition min-h-[42px] shrink-0 ${
                          isOutOfStock
                            ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
                            : 'bg-stone-100 hover:bg-stone-200 text-slate-900 border-stone-200 active:scale-95 cursor-pointer shadow-xs'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-800" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            CONFIDENCE ASSURANCE STRIP (Directly matching mockups)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-2.5 sm:gap-4 text-xs font-bold text-slate-700 text-center sm:text-left">
          
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Fast 3–5 Day Delivery Across Karnataka</span>
          </div>

          <div className="hidden sm:block text-stone-200">|</div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Karnataka School Textbook Aligned</span>
          </div>

          <div className="hidden sm:block text-stone-200">|</div>

          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Complete Parallel English Translations</span>
          </div>

        </div>

      </div>
    </section>
  );
};
