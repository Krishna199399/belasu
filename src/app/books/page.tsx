'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BOOKS_DATA } from '@/data/mockData';
import { DIGITAL_BOOKS_DATA, HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';
import {
  BookOpen,
  Sparkles,
  Laptop,
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ShoppingBag,
  ArrowUpDown,
  X,
} from 'lucide-react';

type SeriesFilter = 'All' | 'Savi' | 'Kali' | 'Siri' | 'Tili' | 'Digital';
type GradeFilter = 'All' | 1 | 2 | 3 | 4 | 5 | 6;

function BooksContent() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get('series');
  const gradeParam = searchParams.get('grade');

  const initialSeries: SeriesFilter = useMemo(() => {
    if (!seriesParam) return 'All';
    if (['Savi', 'Kali', 'Siri', 'Tili'].includes(seriesParam)) {
      return seriesParam as SeriesFilter;
    }
    if (seriesParam.toLowerCase() === 'digital') {
      return 'Digital';
    }
    return 'All';
  }, [seriesParam]);

  const initialGrade: GradeFilter = useMemo(() => {
    if (!gradeParam) return 'All';
    const parsed = parseInt(gradeParam, 10);
    if ([1, 2, 3, 4, 5, 6].includes(parsed)) {
      return parsed as GradeFilter;
    }
    return 'All';
  }, [gradeParam]);

  const [selectedSeries, setSelectedSeries] = useState<SeriesFilter>(initialSeries);
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>(initialGrade);
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);
  const [booksList, setBooksList] = useState<BookProduct[]>(BOOKS_DATA);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const catalogRef = useRef<HTMLElement>(null);

  type SortOption = 'bestseller' | 'price-low' | 'price-high' | 'class-asc';
  const [selectedSort, setSelectedSort] = useState<SortOption>('bestseller');
  const [isSeriesOpen, setIsSeriesOpen] = useState(true);
  const [isClassOpen, setIsClassOpen] = useState(true);

  const { addToCart, openCart } = useCart();

  const handleAddToCart = (book: BookProduct) => {
    if (book.stockQuantity <= 0 || !book.inStock) {
      toast.error(`${book.title} is currently out of stock`);
      return;
    }
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart`);
    openCart();
  };

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.books) {
          setBooksList(data.books);
        }
      })
      .catch((err) => console.error('Failed to load live books:', err));
  }, []);

  // Lock background scroll when mobile filter drawer is open
  useEffect(() => {
    if (!isMobileFilterOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileFilterOpen]);

  const scrollToCatalogTop = () => {
    if (typeof window === 'undefined') return;
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      const rect = catalogEl.getBoundingClientRect();
      const navbarOffset = window.innerWidth < 640 ? 68 : 85;
      const targetY = window.pageYOffset + rect.top - navbarOffset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (seriesParam || gradeParam) {
      setTimeout(() => {
        scrollToCatalogTop();
      }, 150);
    }
  }, [seriesParam, gradeParam]);

  // Filter out non-academic/spoken books (e.g. Class 0 A Destination to Speak Kannada) from Purchase Books catalog
  const academicBooksList = useMemo(() => {
    return booksList.filter(
      (b) => b.series !== 'Spoken' && b.slug !== 'a-destination-to-speak-kannada' && b.gradeClass > 0
    );
  }, [booksList]);

  // Product series counts
  const seriesCounts = useMemo(() => {
    return {
      all: academicBooksList.length + (HIDE_DIGITAL_CLASS_6 ? 0 : 1),
      savi: academicBooksList.filter((b) => b.series === 'Savi').length,
      kali: academicBooksList.filter((b) => b.series === 'Kali').length,
      siri: academicBooksList.filter((b) => b.series === 'Siri').length,
      tili: academicBooksList.filter((b) => b.series === 'Tili').length,
      digital: HIDE_DIGITAL_CLASS_6 ? 0 : 1,
    };
  }, [academicBooksList]);

  // Filtered physical books
  const filteredPhysicalBooks = useMemo(() => {
    if (selectedSeries === 'Digital') return [];

    return academicBooksList.filter((book) => {
      const matchesSeries = selectedSeries === 'All' || book.series === selectedSeries;
      const matchesGrade = selectedGrade === 'All' || book.gradeClass === selectedGrade;
      return matchesSeries && matchesGrade;
    });
  }, [academicBooksList, selectedSeries, selectedGrade]);

  const sortedPhysicalBooks = useMemo(() => {
    const list = [...filteredPhysicalBooks];
    if (selectedSort === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (selectedSort === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (selectedSort === 'class-asc') {
      return list.sort((a, b) => a.gradeClass - b.gradeClass);
    }
    return list;
  }, [filteredPhysicalBooks, selectedSort]);

  // Digital Class 6 Book matching (Hidden while PDF is prepared)
  const showDigitalClass6 = useMemo(() => {
    if (HIDE_DIGITAL_CLASS_6) return false;
    if (selectedGrade !== 'All' && selectedGrade !== 6) return false;
    if (selectedSeries !== 'All' && selectedSeries !== 'Digital' && selectedSeries !== 'Siri') return false;
    return true;
  }, [selectedGrade, selectedSeries]);

  const totalFilteredCount = filteredPhysicalBooks.length + (showDigitalClass6 ? 1 : 0);
  const digitalBookClass6 = DIGITAL_BOOKS_DATA[0];

  const isAnyFilterActive = selectedSeries !== 'All' || selectedGrade !== 'All';

  const handleGradeSelect = (grade: GradeFilter) => {
    setSelectedGrade(grade);
    if (!isMobileFilterOpen) {
      scrollToCatalogTop();
    }
  };

  const handleSeriesSelect = (series: SeriesFilter) => {
    setSelectedSeries(series);
    if (!isMobileFilterOpen) {
      scrollToCatalogTop();
    }
  };

  const resetAllFilters = () => {
    setSelectedSeries('All');
    setSelectedGrade('All');
    if (!isMobileFilterOpen) {
      scrollToCatalogTop();
    }
  };

  const seriesFilterOptions = useMemo(() => {
    const list = [
      { id: 'All', label: 'All Books', count: seriesCounts.all },
      { id: 'Savi', label: 'Savi Kannada', count: seriesCounts.savi },
      { id: 'Kali', label: 'Kali Kannada', count: seriesCounts.kali },
      { id: 'Siri', label: 'Siri Kannada', count: seriesCounts.siri },
      { id: 'Tili', label: 'Tili Kannada', count: seriesCounts.tili },
      { id: 'Digital', label: 'Digital Books', count: seriesCounts.digital },
    ];
    return HIDE_DIGITAL_CLASS_6 ? list.filter((s) => s.id !== 'Digital') : list;
  }, [seriesCounts]);

  const gradeFilterOptions = useMemo(() => {
    const list = [
      { id: 'All', label: 'All Classes' },
      { id: 1, label: 'Class 1' },
      { id: 2, label: 'Class 2' },
      { id: 3, label: 'Class 3' },
      { id: 4, label: 'Class 4' },
      { id: 5, label: 'Class 5' },
      { id: 6, label: 'Class 6' },
    ];
    return HIDE_DIGITAL_CLASS_6 ? list.filter((g) => g.id !== 6) : list;
  }, []);

  const faqs = [
    {
      q: 'Where can I buy Kannada guidebooks online?',
      a: 'Browse the available books on this page, select a product, review its details and price, and add it to your cart.',
    },
    {
      q: 'Which classes are covered by Belesu guidebooks?',
      a: HIDE_DIGITAL_CLASS_6
        ? 'Printed Savi Kannada and Kali Kannada guidebooks are available for Classes 1–4, while Siri Kannada and Tili Kannada cover Class 5.'
        : 'Printed Savi Kannada and Kali Kannada guidebooks are available for Classes 1–4, while Siri Kannada and Tili Kannada cover Class 5. The Siri Kannada digital guidebook is available for Class 6.',
    },
    {
      q: 'Do Belesu guidebooks include English translations?',
      a: 'Yes. English translations help students understand Kannada words, sentences, and lessons. Additional features may vary by book.',
    },
    {
      q: 'Are these guidebooks suitable for English-medium students?',
      a: 'They can help students who benefit from English explanations while learning Kannada. Check each product page to confirm suitability for your class and textbook.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO BANNER: SHOP KANNADA GUIDEBOOKS + 3 FANNED BELESU BOOKS
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#FFF9EE] via-[#FFFBF5] to-white border-b border-stone-200/80 pt-4 pb-8 sm:pb-12 overflow-hidden">
        {/* Ambient warm glow */}
        <div className="absolute -top-24 right-1/4 w-[500px] h-[300px] bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Books</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Titles & Tagline */}
            <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
              
              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
                <span>📖</span>
                <span>SHOP KANNADA GUIDEBOOKS</span>
              </div>

              {/* Headline with Radiant Rays */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                <span className="inline-flex items-center justify-center lg:justify-start gap-2 sm:gap-3 flex-wrap">
                  <span className="text-amber-500 font-bold select-none text-xl sm:text-2xl lg:text-3xl tracking-tighter">\ | /</span>
                  <span>Shop Kannada Guidebooks</span>
                  <span className="text-amber-500 font-bold select-none text-xl sm:text-2xl lg:text-3xl tracking-tighter">\ | /</span>
                </span>
                <span className="block mt-1 font-serif text-slate-900">
                  by Series and Class
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Browse available guidebooks and choose the right book for your class and learning needs.
              </p>
            </div>

            {/* Right: 3 Fanned 3D Belesu Guidebooks */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative flex items-center justify-center h-48 sm:h-56 w-full max-w-xs sm:max-w-md select-none">
                
                {/* Left Book: Kali Kannada Class 1 (Blue cover, tilted -10deg) */}
                <div className="absolute -translate-x-14 sm:-translate-x-20 translate-y-3 -rotate-10 transition-transform duration-300 hover:-translate-y-1 z-0">
                  <img
                    src="/covers/kali-1.png"
                    alt="Kali Kannada Class 1"
                    className="w-24 sm:w-32 md:w-36 h-auto object-contain rounded-lg shadow-xl border border-stone-200/70 bg-white"
                  />
                </div>

                {/* Center Book: Savi Kannada Class 2 (Yellow cover, upright 0deg, front z-10) */}
                <div className="relative z-10 -translate-y-1 rotate-0 transition-transform duration-300 hover:-translate-y-3">
                  <img
                    src="/covers/savi-2.png"
                    alt="Savi Kannada Class 2"
                    className="w-28 sm:w-36 md:w-40 h-auto object-contain rounded-lg shadow-2xl border border-amber-300 bg-white ring-2 ring-amber-400/40"
                  />
                </div>

                {/* Right Book: Siri Kannada Class 5 (Green cover, tilted +10deg) */}
                <div className="absolute translate-x-14 sm:translate-x-20 translate-y-3 rotate-10 transition-transform duration-300 hover:-translate-y-1 z-0">
                  <img
                    src="/covers/siri-5.png"
                    alt="Siri Kannada Class 5"
                    className="w-24 sm:w-32 md:w-36 h-auto object-contain rounded-lg shadow-xl border border-stone-200/70 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. MAIN CATALOG: LEFT SIDEBAR FILTERS + RIGHT 3x3 BOOKS GRID
      ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="catalog"
        ref={catalogRef}
        className="scroll-mt-24 py-8 sm:py-10 bg-white border-b border-stone-200"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Filter & Sort Control Bar (Side-by-side as shown in mockup) */}
          <div className="lg:hidden mb-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-slate-800 font-bold text-xs shadow-2xs hover:bg-stone-50 active:scale-95 transition cursor-pointer min-h-[44px]"
              aria-label="Open filter menu"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Filters</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                {totalFilteredCount}
              </span>
            </button>

            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                className="w-full appearance-none bg-white border border-stone-200 text-slate-800 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
              >
                <option value="bestseller">Sort By: Bestseller</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="class-asc">Class: 1 to 5</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ────────────────────────────────────────────────────────────────
                LEFT COLUMN: E-COMMERCE FILTER SIDEBAR (Desktop Only: 3 cols)
            ──────────────────────────────────────────────────────────────── */}
            <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 z-20 space-y-5">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-6">
                
                {/* Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                    <h2 className="font-serif font-black text-slate-900 text-sm tracking-tight">
                      Filters
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAnyFilterActive && (
                      <button
                        onClick={resetAllFilters}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                    <span className="text-xs font-semibold text-slate-500">
                      {totalFilteredCount} {totalFilteredCount === 1 ? 'book' : 'books'}
                    </span>
                  </div>
                </div>

                {/* Series Filter List */}
                <div className="space-y-2">
                  <div
                    onClick={() => setIsSeriesOpen(!isSeriesOpen)}
                    className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer select-none py-1"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      Series
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        isSeriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isSeriesOpen && (
                    <div className="space-y-1 pt-1">
                      {seriesFilterOptions.map((s) => {
                        const isSelected = selectedSeries === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => handleSeriesSelect(s.id as SeriesFilter)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                                : 'bg-transparent hover:bg-stone-100 text-slate-700'
                            }`}
                          >
                            <span>{s.label}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isSelected
                                  ? 'bg-amber-600 text-slate-950'
                                  : 'bg-stone-100 text-slate-600'
                              }`}
                            >
                              {s.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Class Filter Grid */}
                <div className="space-y-2 border-t border-stone-100 pt-4">
                  <div
                    onClick={() => setIsClassOpen(!isClassOpen)}
                    className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer select-none py-1"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      Class
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        isClassOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isClassOpen && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {gradeFilterOptions.map((g) => {
                        const isSelected = selectedGrade === g.id;
                        return (
                          <button
                            key={g.id}
                            onClick={() => handleGradeSelect(g.id as GradeFilter)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                              isSelected
                                ? 'bg-slate-950 text-white font-black shadow-xs'
                                : 'bg-white hover:bg-stone-100 text-slate-700 border border-stone-200'
                            }`}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </aside>

            {/* Mobile Slide-Over Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-[100] lg:hidden overflow-hidden overscroll-contain">
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-hidden="true"
                />

                {/* Drawer Container */}
                <div className="fixed inset-y-0 right-0 w-[88vw] max-w-sm bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
                  {/* Drawer Header */}
                  <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                      <h3 className="font-serif font-black text-slate-900 text-base">
                        Filter Guidebooks
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-stone-200/60 transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                      aria-label="Close filters"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Scrollable Body */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 touch-scroll">
                    {/* Series Filter List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                        Series
                      </span>
                      <div className="space-y-1">
                        {seriesFilterOptions.map((s) => {
                          const isSelected = selectedSeries === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => handleSeriesSelect(s.id as SeriesFilter)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[42px] ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                                  : 'bg-stone-50 hover:bg-stone-100 text-slate-700'
                              }`}
                            >
                              <span>{s.label}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isSelected ? 'bg-amber-600 text-slate-950' : 'bg-stone-200 text-slate-600'
                                }`}
                              >
                                {s.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Class Filter Grid */}
                    <div className="space-y-2 border-t border-stone-100 pt-3">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                        Class
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {gradeFilterOptions.map((g) => {
                          const isSelected = selectedGrade === g.id;
                          return (
                            <button
                              key={g.id}
                              onClick={() => handleGradeSelect(g.id as GradeFilter)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer min-h-[40px] flex items-center justify-center ${
                                isSelected
                                  ? 'bg-slate-900 text-white shadow-xs font-black'
                                  : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200'
                              }`}
                            >
                              {g.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="p-4 border-t border-stone-200 bg-stone-50/90 pb-safe flex items-center gap-2.5">
                    {isAnyFilterActive && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="px-4 py-3 rounded-xl border border-stone-300 bg-white text-rose-600 font-bold text-xs hover:bg-rose-50 transition min-h-[48px]"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileFilterOpen(false);
                        scrollToCatalogTop();
                      }}
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 text-xs font-black rounded-xl uppercase tracking-wider shadow-md transition min-h-[48px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Show {totalFilteredCount} {totalFilteredCount === 1 ? 'Book' : 'Books'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────────
                RIGHT COLUMN: 3×3 PRODUCT CATALOG GRID (9 cols)
            ──────────────────────────────────────────────────────────────── */}
            <main className="lg:col-span-9 space-y-6 min-h-[550px]">
              
              {/* Grid Top Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    Showing {totalFilteredCount} {totalFilteredCount === 1 ? 'Guidebook' : 'Guidebooks'}
                  </span>

                  {isAnyFilterActive && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Filtered
                    </span>
                  )}
                </div>

                <div className="hidden lg:flex items-center gap-2">
                  {/* Desktop Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                      className="appearance-none bg-white border border-stone-200 hover:border-amber-400 text-slate-800 text-xs font-bold py-2 pl-3 pr-8 rounded-xl shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="bestseller">Sort By: Bestseller</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="class-asc">Class: 1 to 5</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {isAnyFilterActive && (
                    <button
                      onClick={resetAllFilters}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer ml-2"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Product Cards Container */}
              {totalFilteredCount === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">No matching guidebooks found</p>
                  <button
                    onClick={resetAllFilters}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop / Tablet Cards Grid (3 Columns) */}
                  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {sortedPhysicalBooks.map((book) => (
                      <div
                        key={book.id}
                        className="group relative bg-white rounded-2xl border border-stone-200 hover:border-amber-400 shadow-2xs hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Class Badge */}
                          <div className="mb-3">
                            <span className="text-[11px] font-bold text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {book.gradeClass > 0 ? `Class ${book.gradeClass}` : 'Special'}
                            </span>
                          </div>

                          {/* Cover Image Container */}
                          <Link
                            href={`/books/${book.slug}`}
                            className="relative w-full h-48 sm:h-52 rounded-xl bg-stone-50/60 border border-stone-100 flex items-center justify-center p-2 mb-3 group-hover:bg-amber-50/30 transition-colors block overflow-hidden"
                          >
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                            />
                          </Link>

                          {/* Series Tag */}
                          <div className="mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                              {book.series.toUpperCase()} KANNADA SERIES
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={`/books/${book.slug}`}>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-700 transition mb-1.5">
                              {book.title}
                            </h3>
                          </Link>

                          {/* Short Description */}
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                            {book.description}
                          </p>
                        </div>

                        {/* Bottom Row: Price & Actions */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          <span className="text-lg font-black text-slate-900">
                            {formatPrice(book.price)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewBook(book)}
                              className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 transition cursor-pointer shadow-2xs"
                              title="Preview Sample Pages"
                              aria-label={`Preview ${book.title}`}
                            >
                              <BookOpen className="w-4 h-4 text-slate-800" />
                            </button>

                            {book.stockQuantity <= 0 || !book.inStock ? (
                              <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 bg-stone-100 border border-stone-200 cursor-not-allowed">
                                Sold Out
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToCart(book)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs transition cursor-pointer"
                              >
                                <span>Add</span>
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Digital Class 6 Card (Desktop) */}
                    {showDigitalClass6 && (
                      <div className="group relative bg-white rounded-2xl border border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 sm:p-5">
                        <div>
                          <div className="mb-3 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                              Class 6
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
                              Digital Edition
                            </span>
                          </div>

                          <div className="relative w-full h-48 sm:h-52 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-teal-50 flex items-center justify-center p-2 mb-3 overflow-hidden">
                            <img
                              src="/digital/class-6-siri/cover.jpeg"
                              alt={digitalBookClass6.title}
                              className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                            />
                          </div>

                          <div className="mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                              SIRI KANNADA DIGITAL GUIDEBOOK
                            </span>
                          </div>

                          <Link href={`/digital/${digitalBookClass6.slug}`}>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-emerald-700 transition mb-1.5">
                              {digitalBookClass6.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                            {digitalBookClass6.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          <span className="text-lg font-black text-slate-900">
                            {formatPrice(digitalBookClass6.price)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href="/reader/kannada-class-6-guide?preview=true"
                              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-slate-700 transition"
                              title="Preview"
                            >
                              <BookOpen className="w-4 h-4 text-slate-800" />
                            </Link>
                            <Link
                              href={`/digital/${digitalBookClass6.slug}`}
                              className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white uppercase tracking-wider shadow-xs transition"
                            >
                              Explore
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Horizontal Row List (Matching Mobile View Screenshot) */}
                  <div className="sm:hidden space-y-3">
                    {sortedPhysicalBooks.map((book) => (
                      <div
                        key={book.id}
                        className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs flex items-center gap-3"
                      >
                        {/* Left: Thumbnail & Class Pill */}
                        <div className="relative shrink-0 w-20 h-24 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center p-1.5 overflow-hidden">
                          <span className="absolute top-1 left-1 z-10 text-[9px] font-bold text-amber-950 bg-amber-100/95 border border-amber-300 px-1 py-0.2 rounded">
                            {book.gradeClass > 0 ? `Class ${book.gradeClass}` : 'Special'}
                          </span>
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="max-h-full max-w-full object-contain drop-shadow-2xs"
                          />
                        </div>

                        {/* Right: Info & Actions */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block truncate">
                            {book.series.toUpperCase()} KANNADA SERIES
                          </span>
                          <Link href={`/books/${book.slug}`}>
                            <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 hover:text-amber-700 transition mt-0.5">
                              {book.title}
                            </h3>
                          </Link>

                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100">
                            <span className="text-sm font-black text-slate-900">
                              {formatPrice(book.price)}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewBook(book)}
                                className="p-1.5 rounded-lg border border-stone-200 text-slate-700 hover:bg-stone-50 transition cursor-pointer"
                                title="Preview"
                                aria-label={`Preview ${book.title}`}
                              >
                                <BookOpen className="w-3.5 h-3.5 text-slate-800" />
                              </button>

                              {book.stockQuantity <= 0 || !book.inStock ? (
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 bg-stone-100 border border-stone-200">
                                  Sold Out
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(book)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-2xs transition cursor-pointer"
                                >
                                  <span>Add</span>
                                  <ShoppingBag className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Mobile Digital Class 6 Card */}
                    {showDigitalClass6 && (
                      <div className="bg-white rounded-2xl border border-emerald-200 p-3 shadow-2xs flex items-center gap-3">
                        <div className="relative shrink-0 w-20 h-24 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1.5 overflow-hidden">
                          <span className="absolute top-1 left-1 z-10 text-[9px] font-bold text-emerald-950 bg-emerald-100/95 border border-emerald-300 px-1 py-0.2 rounded">
                            Class 6
                          </span>
                          <img
                            src="/digital/class-6-siri/cover.jpeg"
                            alt={digitalBookClass6.title}
                            className="max-h-full max-w-full object-contain drop-shadow-2xs"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block truncate">
                            SIRI KANNADA DIGITAL
                          </span>
                          <Link href={`/digital/${digitalBookClass6.slug}`}>
                            <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 hover:text-emerald-700 transition mt-0.5">
                              {digitalBookClass6.title}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100">
                            <span className="text-sm font-black text-slate-900">
                              {formatPrice(digitalBookClass6.price)}
                            </span>
                            <Link
                              href={`/digital/${digitalBookClass6.slug}`}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider shadow-2xs"
                            >
                              Explore
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

            </main>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. H2: Printed Kannada Guidebooks for Classes 1–5
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-stone-50/60 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="space-y-1.5 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Printed Kannada Guidebooks for Classes 1–5
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              Explore English-translated supplementary guidebooks for primary school students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            
            {/* Savi Kannada */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-amber-400 transition-all duration-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                  Classes 1–4
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                  Savi Kannada | Classes 1–4
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  English-translated guidebooks to help students understand Kannada lessons.
                </p>
                <div className="text-xs text-slate-800 font-medium pt-2 border-t border-stone-100">
                  Products: Savi Kannada Guidebooks for Classes 1, 2, 3 and 4.
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSeries('Savi');
                  setSelectedGrade('All');
                  scrollToCatalogTop();
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <span>View Savi Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Kali Kannada */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-indigo-400 transition-all duration-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-300 inline-block">
                  Classes 1–4
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                  Kali Kannada | Classes 1–4
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Class-specific guidebooks to support Kannada comprehension and academic learning.
                </p>
                <div className="text-xs text-slate-800 font-medium pt-2 border-t border-stone-100">
                  Products: Kali Kannada Guidebooks for Classes 1, 2, 3 and 4.
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSeries('Kali');
                  setSelectedGrade('All');
                  scrollToCatalogTop();
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-indigo-600 hover:text-white text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <span>View Kali Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Siri Kannada Class 5 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-rose-400 transition-all duration-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 inline-block">
                  Class 5
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                  Siri Kannada | Class 5
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore the Class 5 guidebook for additional support with Kannada lessons and exercises.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSeries('Siri');
                  setSelectedGrade(5);
                  scrollToCatalogTop();
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-rose-600 hover:text-white text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <span>View Siri Class 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tili Kannada Class 5 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-teal-400 transition-all duration-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300 inline-block">
                  Class 5
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                  Tili Kannada | Class 5
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover the Class 5 guidebook to support Kannada comprehension and schoolwork.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSeries('Tili');
                  setSelectedGrade(5);
                  scrollToCatalogTop();
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-teal-600 hover:text-white text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <span>View Tili Class 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. H2: Digital Kannada Guidebooks (Temporarily hidden until Class 6 PDF release next week)
      ══════════════════════════════════════════════════════════════════════════ */}
      {!HIDE_DIGITAL_CLASS_6 && (
        <section className="py-10 sm:py-12 bg-white border-b border-stone-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            
            <div className="space-y-1.5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                Digital Kannada Guidebooks
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Explore Belesu’s available digital guidebook for Class 6.
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-amber-50/20 to-white border border-emerald-200/90 p-6 sm:p-8 lg:p-10 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                    <Laptop className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Class 6 Digital Edition</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
                    Siri Kannada Digital Guidebook | Class 6
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    Explore the digital edition, review the available learning content, and check the preview, price, and access details.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <Link
                      href={`/digital/${digitalBookClass6.slug}`}
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer min-h-[44px]"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Explore Digital Guidebook</span>
                    </Link>

                    <Link
                      href="/reader/kannada-class-6-guide?preview=true"
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                    >
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>View Free Preview</span>
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-full max-w-[200px] aspect-[3/4] rounded-2xl overflow-hidden border border-emerald-200 shadow-md bg-stone-50 flex items-center justify-center p-2">
                    <img
                      src="/digital/class-6-siri/cover.jpeg"
                      alt="Siri Kannada Digital Guidebook Class 6"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. H2: Frequently Asked Questions
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-stone-50/60 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 min-h-[48px]"
                  >
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-slate-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. H2: Need Help Choosing a Guidebook?
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-gradient-to-b from-stone-50/40 via-amber-50/30 to-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-sm text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Need Help Choosing a Guidebook?
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
              Contact Belesu for help choosing a book or checking product availability.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="tel:+919606636804"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-800 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>+91 9606636804</span>
              </a>

              <a
                href="mailto:kannada@belesu.in"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-800 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>kannada@belesu.in</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Book Preview Modal */}
      <BookPreviewModal book={previewBook} onClose={() => setPreviewBook(null)} />

    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Loading Belesu Guidebook Catalog...</p>
          </div>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
