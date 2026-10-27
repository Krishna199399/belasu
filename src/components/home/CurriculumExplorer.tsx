'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Eye,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
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
    cardBg: string;
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
    badge: 'Classes 1–4',
    grades: [1, 2, 3, 4],
    defaultGrade: 4,
    description: 'English-translated Kannada guidebooks for primary school students.',
    ctaText: 'Explore Books',
    theme: {
      accent: 'text-amber-600',
      border: 'border-amber-200/90',
      hoverBorder: 'hover:border-amber-400',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-900',
      cardBg: 'from-amber-500/10 via-amber-50/30 to-white',
      pillActive: 'bg-amber-500 text-slate-950 font-black shadow-xs',
      btnBg: 'bg-amber-500',
      btnHover: 'hover:bg-amber-600',
      btnText: 'text-slate-950',
      shadow: 'hover:shadow-amber-500/15',
    },
  },
  {
    id: 'Kali',
    title: 'Kali Kannada | Classes 1–4',
    badge: 'Classes 1–4',
    grades: [1, 2, 3, 4],
    defaultGrade: 1,
    description: 'Kannada guidebooks with English translations for primary school learning.',
    ctaText: 'Explore Books',
    theme: {
      accent: 'text-indigo-600',
      border: 'border-indigo-200/90',
      hoverBorder: 'hover:border-indigo-400',
      tagBg: 'bg-indigo-100',
      tagText: 'text-indigo-900',
      cardBg: 'from-indigo-500/10 via-indigo-50/30 to-white',
      pillActive: 'bg-indigo-600 text-white font-black shadow-xs',
      btnBg: 'bg-indigo-600',
      btnHover: 'hover:bg-indigo-700',
      btnText: 'text-white',
      shadow: 'hover:shadow-indigo-500/15',
    },
  },
  {
    id: 'Siri',
    title: 'Siri Kannada | Class 5',
    badge: 'Class 5',
    grades: [5],
    defaultGrade: 5,
    description: 'Explore the Class 5 Siri Kannada guidebook.',
    ctaText: 'View Book',
    theme: {
      accent: 'text-rose-600',
      border: 'border-rose-200/90',
      hoverBorder: 'hover:border-rose-400',
      tagBg: 'bg-rose-100',
      tagText: 'text-rose-900',
      cardBg: 'from-rose-500/10 via-rose-50/30 to-white',
      pillActive: 'bg-rose-600 text-white font-black shadow-xs',
      btnBg: 'bg-rose-600',
      btnHover: 'hover:bg-rose-700',
      btnText: 'text-white',
      shadow: 'hover:shadow-rose-500/15',
    },
  },
  {
    id: 'Tili',
    title: 'Tili Kannada | Class 5',
    badge: 'Class 5',
    grades: [5],
    defaultGrade: 5,
    description: 'Explore the Class 5 Tili Kannada guidebook.',
    ctaText: 'View Book',
    theme: {
      accent: 'text-teal-600',
      border: 'border-teal-200/90',
      hoverBorder: 'hover:border-teal-400',
      tagBg: 'bg-teal-100',
      tagText: 'text-teal-900',
      cardBg: 'from-teal-500/10 via-teal-50/30 to-white',
      pillActive: 'bg-teal-600 text-white font-black shadow-xs',
      btnBg: 'bg-teal-600',
      btnHover: 'hover:bg-teal-700',
      btnText: 'text-white',
      shadow: 'hover:shadow-teal-500/15',
    },
  },
];

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({ onPreview }) => {
  const { addToCart, openCart } = useCart();

  // Selected grade per series (for Savi & Kali multi-grade selector)
  const [selectedGrades, setSelectedGrades] = useState<Record<string, number>>({
    Savi: 4,
    Kali: 1,
    Siri: 5,
    Tili: 5,
  });

  const handleSelectGrade = (seriesId: string, grade: number) => {
    setSelectedGrades((prev) => ({
      ...prev,
      [seriesId]: grade,
    }));
  };

  const handleAddToCart = (book: BookProduct) => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart`);
    openCart();
  };

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-stone-50/80 via-white to-amber-50/20 border-b border-stone-200">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>State Syllabus Curriculum</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Find the Right Kannada Guidebook
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Explore Belesu guidebooks by class and choose the right book for your child.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4-SERIES MASTER DECK (Compact, Sleek 1-Click Discovery)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {DECK_SERIES.map((series) => {
            const currentGrade = selectedGrades[series.id] || series.defaultGrade;
            
            // Resolve active book for selected grade
            const activeBook =
              BOOKS_DATA.find((b) => b.series === series.id && b.gradeClass === currentGrade) ||
              BOOKS_DATA.find((b) => b.series === series.id) ||
              BOOKS_DATA[0];

            return (
              <div
                key={series.id}
                className={`bg-white rounded-2xl border ${series.theme.border} ${series.theme.hoverBorder} shadow-2xs hover:shadow-lg ${series.theme.shadow} transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-0.5 relative`}
              >
                {/* Top Badge & Book Showcase Stage */}
                <div className={`p-3.5 sm:p-4 bg-gradient-to-b ${series.theme.cardBg} border-b border-stone-100 relative`}>
                  
                  {/* Series Badge & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${series.theme.tagBg} ${series.theme.tagText} tracking-wider`}
                    >
                      {series.badge}
                    </span>
                    <div className="flex items-center gap-1 bg-white/95 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-slate-700 border border-stone-200 shadow-2xs">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* 3D Book Cover Stage (Compact ~150px) */}
                  <div className="relative h-36 sm:h-40 flex items-center justify-center my-1 group/stage">
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

                    {/* Quick Preview Icon Button (if onPreview is provided) */}
                    {onPreview && (
                      <button
                        type="button"
                        onClick={() => onPreview(activeBook)}
                        className="absolute bottom-1 right-1 p-2 rounded-lg bg-white/95 hover:bg-slate-900 text-slate-800 hover:text-white border border-stone-200 shadow-xs backdrop-blur-xs transition-all duration-200 cursor-pointer group/prev min-w-[38px] min-h-[38px] flex items-center justify-center"
                        title={`Preview sample pages of ${activeBook.title}`}
                        aria-label={`Preview sample pages of ${activeBook.title}`}
                      >
                        <Eye className="w-4 h-4 text-amber-600 group-hover/prev:text-amber-400" />
                      </button>
                    )}
                  </div>

                  {/* Interactive Class Edition Selector Pills */}
                  {series.grades.length > 1 ? (
                    <div className="pt-2">
                      <div className="grid grid-cols-4 gap-1 bg-white/90 p-1 rounded-lg border border-stone-200/90 shadow-2xs">
                        {series.grades.map((grade) => {
                          const isSel = currentGrade === grade;
                          return (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => handleSelectGrade(series.id, grade)}
                              className={`py-1.5 sm:py-1 rounded-md text-xs sm:text-[11px] font-bold transition-all cursor-pointer text-center min-h-[36px] flex items-center justify-center ${
                                isSel
                                  ? series.theme.pillActive
                                  : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100/80'
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
                    <div className="pt-2">
                      <div className="py-1 px-2 rounded-lg bg-white/90 border border-stone-200/90 text-center text-[10px] font-bold text-slate-700 shadow-2xs">
                        Class 5 Edition · State Board
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Body: Title, Description & Action Bar */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug">
                      <Link
                        href={`/books/${activeBook.slug}`}
                        className="hover:text-amber-600 transition-colors block line-clamp-1"
                        title={activeBook.title}
                      >
                        {series.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2 min-h-[32px]">
                      {series.description}
                    </p>
                  </div>

                  {/* Pricing Bar & Action Buttons */}
                  <div className="pt-2.5 border-t border-stone-100 space-y-2.5">
                    
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-900">
                          ₹{activeBook.price}
                        </span>
                        {activeBook.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{activeBook.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        In Stock · Fast Dispatch
                      </span>
                    </div>

                    {/* Action Buttons: Primary Link + Direct Add to Cart */}
                    <div className="grid grid-cols-12 gap-1.5">
                      <Link
                        href={`/books/${activeBook.slug}`}
                        title={`${series.ctaText} - ${activeBook.title}`}
                        className={`col-span-9 py-2.5 px-3 rounded-xl font-bold text-xs ${series.theme.btnBg} ${series.theme.btnHover} ${series.theme.btnText} shadow-2xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer uppercase tracking-wider min-h-[44px]`}
                      >
                        <span>{series.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(activeBook)}
                        title={`Add ${activeBook.title} to cart`}
                        aria-label={`Add ${activeBook.title} to cart`}
                        className="col-span-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-900 border border-stone-200 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs min-h-[44px]"
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

        {/* Confidence Assurance Strip (Compact) */}
        <div className="mt-6 sm:mt-8 p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-2 text-xs text-slate-600 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Fast 3–5 Day Delivery Across Karnataka</span>
          </div>
          <div className="hidden sm:block text-slate-300">•</div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Aligned with Karnataka State Board</span>
          </div>
          <div className="hidden sm:block text-slate-300">•</div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Complete Parallel English Translations</span>
          </div>
        </div>

      </div>
    </section>
  );
};
