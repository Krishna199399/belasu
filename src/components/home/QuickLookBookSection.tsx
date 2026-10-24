'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  ZoomIn,
  ShoppingBag,
  FileText,
  BookMarked,
  Pencil,
  Eye,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { BookProduct, BookSeries } from '@/types';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface QuickLookBookSectionProps {
  onPreview?: (book: BookProduct) => void;
}

interface SeriesMeta {
  id: BookSeries;
  name: string;
  shortLabel: string;
  badge: string;
  classes: number[];
  color: {
    dot: string;
    pillBg: string;
    pillText: string;
  };
}

const SERIES_CONFIG: SeriesMeta[] = [
  {
    id: 'Savi',
    name: 'Savi Kannada',
    shortLabel: 'Savi',
    badge: 'Classes 1–4',
    classes: [1, 2, 3, 4],
    color: {
      dot: 'bg-amber-500',
      pillBg: 'bg-amber-100',
      pillText: 'text-amber-900',
    },
  },
  {
    id: 'Kali',
    name: 'Kali Kannada',
    shortLabel: 'Kali',
    badge: 'Classes 1–4',
    classes: [1, 2, 3, 4],
    color: {
      dot: 'bg-emerald-500',
      pillBg: 'bg-emerald-100',
      pillText: 'text-emerald-900',
    },
  },
  {
    id: 'Siri',
    name: 'Siri Kannada',
    shortLabel: 'Siri',
    badge: 'Class 5',
    classes: [5],
    color: {
      dot: 'bg-indigo-500',
      pillBg: 'bg-indigo-100',
      pillText: 'text-indigo-900',
    },
  },
  {
    id: 'Tili',
    name: 'Tili Kannada',
    shortLabel: 'Tili',
    badge: 'Class 5',
    classes: [5],
    color: {
      dot: 'bg-rose-500',
      pillBg: 'bg-rose-100',
      pillText: 'text-rose-900',
    },
  },
];

export const QuickLookBookSection: React.FC<QuickLookBookSectionProps> = ({ onPreview }) => {
  const { addToCart, openCart } = useCart();
  const [selectedSeries, setSelectedSeries] = useState<BookSeries>('Savi');
  const [selectedClass, setSelectedClass] = useState<number>(2);

  // Active Series Meta
  const activeSeriesMeta = useMemo(() => {
    return SERIES_CONFIG.find((s) => s.id === selectedSeries) || SERIES_CONFIG[0];
  }, [selectedSeries]);

  // Current active book from mockData
  const activeBook = useMemo(() => {
    const found = BOOKS_DATA.find(
      (b) => b.series === selectedSeries && b.gradeClass === selectedClass
    );
    if (found) return found;
    return (
      BOOKS_DATA.find((b) => b.series === selectedSeries) ||
      BOOKS_DATA[1] // Savi 2 default
    );
  }, [selectedSeries, selectedClass]);

  // Handle series switch
  const handleSelectSeries = (series: BookSeries) => {
    setSelectedSeries(series);
    const meta = SERIES_CONFIG.find((s) => s.id === series);
    if (meta && !meta.classes.includes(selectedClass)) {
      setSelectedClass(meta.classes[0]);
    }
  };

  // Direct quick book selection
  const handleSelectBookDirect = (book: BookProduct) => {
    setSelectedSeries(book.series);
    setSelectedClass(book.gradeClass);
  };

  const handleAddToCart = () => {
    if (!activeBook) return;
    addToCart(activeBook, 'physical', 1);
    toast.success(`Added ${activeBook.title} to cart`);
    openCart();
  };

  const handleOpenPreview = () => {
    if (onPreview && activeBook) {
      onPreview(activeBook);
    }
  };

  // Scanned pages array
  const samplePages = activeBook?.samplePages || [];
  const indexPage = samplePages[0];
  const poemPage = samplePages[1];
  const exercisesPage = samplePages[2];

  return (
    <section className="bg-gradient-to-b from-stone-50 via-white to-stone-50 py-10 sm:py-12 lg:py-14 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header (Compact & High Impact) ── */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Sample Pages · All 10 Books</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            A Quick Look at the Books
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Browse real scanned sample pages from all 10 Karnataka State Board companions to inspect
            the page layout, parallel English translations, and solved exercise keys before ordering.
          </p>
        </div>

        {/* ── Unified Compact Studio Dock (Combines Series & Class into ONE sleek bar) ── */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-stone-100/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Left: 4 Curriculum Series Segmented Switcher */}
            <div className="flex items-center gap-1 p-1 bg-white/90 rounded-xl border border-stone-200/80 shadow-xs w-full md:w-auto overflow-x-auto scrollbar-none">
              {SERIES_CONFIG.map((s) => {
                const isSelected = selectedSeries === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSeries(s.id)}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-slate-950 text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100/80'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${s.color.dot}`} />
                    <span>{s.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-slate-500'
                      }`}
                    >
                      {s.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Grade Level Pills */}
            <div className="flex items-center gap-1.5 w-full md:w-auto justify-center md:justify-end px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Grade:
              </span>
              <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-stone-200/80 shadow-xs">
                {activeSeriesMeta.classes.map((cls) => {
                  const isClassSelected = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                        isClassSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100/80'
                      }`}
                    >
                      <span>Class {cls}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── Compact Direct 10-Book Quick Switcher Strip (Single Slim Row) ── */}
        <div className="max-w-4xl mx-auto mb-8 flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Direct Jump:
          </span>
          {BOOKS_DATA.map((book) => {
            const isActive = activeBook.id === book.id;
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => handleSelectBookDirect(book)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black ring-1 ring-amber-400'
                    : 'bg-white text-slate-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    book.series === 'Savi'
                      ? 'bg-amber-500'
                      : book.series === 'Kali'
                      ? 'bg-emerald-500'
                      : book.series === 'Siri'
                      ? 'bg-indigo-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span>
                  {book.series} {book.gradeClass}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Slim Active Book Bar (Inline Title, Price, & Quick Actions) ── */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Left: Book Meta Thumbnail + Title */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0 w-12 sm:w-14 aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 p-0.5 flex items-center justify-center shadow-xs">
              <img
                src={activeBook.coverImage}
                alt={activeBook.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200/80">
                  {activeBook.series} Kannada
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  Class {activeBook.gradeClass} State Board
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{activeBook.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({activeBook.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug truncate">
                {activeBook.title}
              </h4>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Line-by-line parallel English translations · Solved textbook exercises</span>
              </div>
            </div>
          </div>

          {/* Right: Price & Quick Action Buttons */}
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            <div className="text-left sm:text-right pr-1">
              <div className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                {formatPrice(activeBook.price)}
              </div>
              {activeBook.originalPrice && (
                <div className="text-[10px] text-slate-400 line-through mt-0.5">
                  M.R.P: {formatPrice(activeBook.originalPrice)}
                </div>
              )}
            </div>

            {onPreview && (
              <button
                type="button"
                onClick={handleOpenPreview}
                className="px-3.5 py-2 rounded-xl font-bold text-xs text-slate-800 bg-stone-100 hover:bg-stone-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                <span>Fullscreen View</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-600 transition shadow-xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>

        </div>

        {/* ── Sample Pages Showcase Grid (4 High-Impact Cards) ── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Index Page */}
          {indexPage && (
            <div
              onClick={handleOpenPreview}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-slate-800 border border-stone-200/80 group-hover:bg-amber-100 group-hover:text-amber-900 group-hover:border-amber-300 transition-colors">
                    <FileText className="w-3 h-3 text-amber-600" />
                    <span>1. Syllabus Index</span>
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                    <Eye className="w-3 h-3" /> Inspect
                  </span>
                </div>

                <div className="w-full aspect-[3/4] bg-stone-900/5 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 border border-stone-200/80 group-hover:shadow-md transition-shadow relative">
                  <img
                    src={indexPage.imageUrl}
                    alt={indexPage.title}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-md">
                      <ZoomIn className="w-4 h-4 text-amber-600" />
                    </span>
                  </div>
                </div>

                <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1">
                  {indexPage.title}
                </h5>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {indexPage.englishTranslation ||
                    'Full syllabus chapter list matching Karnataka State Board curriculum.'}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] font-bold text-amber-800">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authentic Scan
                </span>
                <span className="text-slate-400 group-hover:text-amber-600 transition-colors">
                  Page {indexPage.pageNumber}
                </span>
              </div>
            </div>
          )}

          {/* Card 2: Poem / Lesson Breakdown */}
          {poemPage && (
            <div
              onClick={handleOpenPreview}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-slate-800 border border-stone-200/80 group-hover:bg-amber-100 group-hover:text-amber-900 group-hover:border-amber-300 transition-colors">
                    <BookMarked className="w-3 h-3 text-amber-600" />
                    <span>2. Parallel Translation</span>
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                    <Eye className="w-3 h-3" /> Inspect
                  </span>
                </div>

                <div className="w-full aspect-[3/4] bg-stone-900/5 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 border border-stone-200/80 group-hover:shadow-md transition-shadow relative">
                  <img
                    src={poemPage.imageUrl}
                    alt={poemPage.title}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-md">
                      <ZoomIn className="w-4 h-4 text-amber-600" />
                    </span>
                  </div>
                </div>

                <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1">
                  {poemPage.title}
                </h5>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {poemPage.englishTranslation ||
                    'Stanza-by-stanza English translation, pronunciation, and bilingual vocabulary.'}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] font-bold text-amber-800">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authentic Scan
                </span>
                <span className="text-slate-400 group-hover:text-amber-600 transition-colors">
                  Page {poemPage.pageNumber}
                </span>
              </div>
            </div>
          )}

          {/* Card 3: Solved Exercises */}
          {exercisesPage && (
            <div
              onClick={handleOpenPreview}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-slate-800 border border-stone-200/80 group-hover:bg-amber-100 group-hover:text-amber-900 group-hover:border-amber-300 transition-colors">
                    <Pencil className="w-3 h-3 text-amber-600" />
                    <span>3. Solved Exercises</span>
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                    <Eye className="w-3 h-3" /> Inspect
                  </span>
                </div>

                <div className="w-full aspect-[3/4] bg-stone-900/5 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 border border-stone-200/80 group-hover:shadow-md transition-shadow relative">
                  <img
                    src={exercisesPage.imageUrl}
                    alt={exercisesPage.title}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900 shadow-md">
                      <ZoomIn className="w-4 h-4 text-amber-600" />
                    </span>
                  </div>
                </div>

                <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1">
                  {exercisesPage.title}
                </h5>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {exercisesPage.englishTranslation ||
                    'Step-by-step solved question banks for homework, revision, and exams.'}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] font-bold text-amber-800">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authentic Scan
                </span>
                <span className="text-slate-400 group-hover:text-amber-600 transition-colors">
                  Page {exercisesPage.pageNumber}
                </span>
              </div>
            </div>
          )}

          {/* Card 4: Full Print Edition Cover */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-slate-800 border border-stone-200/80 group-hover:bg-amber-100 group-hover:text-amber-900 group-hover:border-amber-300 transition-colors">
                  <BookOpen className="w-3 h-3 text-amber-600" />
                  <span>4. Print Edition</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock
                </span>
              </div>

              <div className="w-full aspect-[3/4] bg-stone-900/5 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 border border-stone-200/80 group-hover:shadow-md transition-shadow relative">
                <img
                  src={activeBook.coverImage}
                  alt={activeBook.title}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                />
              </div>

              <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1 truncate">
                {activeBook.title}
              </h5>
              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                100% Authentic Karnataka State Board companion with parallel English explanations.
              </p>
            </div>

            <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-slate-900">
                  {formatPrice(activeBook.price)}
                </span>
                {activeBook.originalPrice && (
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">
                    {formatPrice(activeBook.originalPrice)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Buy Book</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Curriculum Series Explore CTAs (Compact Footer) ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <Link
            href="/books?series=Savi"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs tracking-wide rounded-xl shadow-xs transition transform active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" /> Explore Savi (Classes 1–4){' '}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/books?series=Kali"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold text-xs tracking-wide rounded-xl shadow-xs transition transform active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Explore Kali (Classes 1–4){' '}
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </Link>
          <Link
            href="/books?series=Siri"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-indigo-50 text-indigo-950 border border-indigo-300 font-bold text-xs tracking-wide rounded-xl shadow-xs transition transform active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Siri & Tili Class 5{' '}
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
          </Link>
        </div>

      </div>
    </section>
  );
};
