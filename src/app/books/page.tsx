'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BOOKS_DATA } from '@/data/mockData';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { BookCard } from '@/components/ui/BookCard';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct } from '@/types';
import {
  Search,
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
  X,
  Filter,
} from 'lucide-react';

type SeriesFilter = 'All' | 'Savi' | 'Kali' | 'Siri' | 'Tili' | 'Digital';
type GradeFilter = 'All' | 1 | 2 | 3 | 4 | 5 | 6;

function BooksContent() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get('series');
  const gradeParam = searchParams.get('grade');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<SeriesFilter>('All');
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);
  const [booksList, setBooksList] = useState<BookProduct[]>(BOOKS_DATA);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const catalogRef = useRef<HTMLElement>(null);

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
    if (seriesParam) {
      if (['Savi', 'Kali', 'Siri', 'Tili'].includes(seriesParam)) {
        setSelectedSeries(seriesParam as SeriesFilter);
      } else if (seriesParam.toLowerCase() === 'digital') {
        setSelectedSeries('Digital');
      }
    }
    if (gradeParam) {
      const parsedGrade = parseInt(gradeParam, 10);
      if ([1, 2, 3, 4, 5, 6].includes(parsedGrade)) {
        setSelectedGrade(parsedGrade as GradeFilter);
      }
    }
    if (seriesParam || gradeParam) {
      setTimeout(() => {
        scrollToCatalogTop();
      }, 150);
    }
  }, [seriesParam, gradeParam]);

  // Product series counts
  const seriesCounts = useMemo(() => {
    return {
      all: booksList.length + 1,
      savi: booksList.filter((b) => b.series === 'Savi').length,
      kali: booksList.filter((b) => b.series === 'Kali').length,
      siri: booksList.filter((b) => b.series === 'Siri').length,
      tili: booksList.filter((b) => b.series === 'Tili').length,
      digital: 1,
    };
  }, [booksList]);

  // Filtered physical books
  const filteredPhysicalBooks = useMemo(() => {
    if (selectedSeries === 'Digital') return [];

    let result = booksList.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeries = selectedSeries === 'All' || book.series === selectedSeries;
      const matchesGrade = selectedGrade === 'All' || book.gradeClass === selectedGrade;
      return matchesSearch && matchesSeries && matchesGrade;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [booksList, searchQuery, selectedSeries, selectedGrade, sortBy]);

  // Digital Class 6 Book matching
  const showDigitalClass6 = useMemo(() => {
    if (selectedGrade !== 'All' && selectedGrade !== 6) return false;
    if (selectedSeries !== 'All' && selectedSeries !== 'Digital' && selectedSeries !== 'Siri') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const d = DIGITAL_BOOKS_DATA[0];
      return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    }
    return true;
  }, [selectedGrade, selectedSeries, searchQuery]);

  const totalFilteredCount = filteredPhysicalBooks.length + (showDigitalClass6 ? 1 : 0);
  const digitalBookClass6 = DIGITAL_BOOKS_DATA[0];

  const isAnyFilterActive = selectedSeries !== 'All' || selectedGrade !== 'All' || searchQuery !== '';

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
    setSearchQuery('');
    if (!isMobileFilterOpen) {
      scrollToCatalogTop();
    }
  };

  const faqs = [
    {
      q: 'Where can I buy Kannada guidebooks online?',
      a: 'Browse the available books on this page, select a product, review its details and price, and add it to your cart.',
    },
    {
      q: 'Which classes are covered by Belesu guidebooks?',
      a: 'Printed Savi Kannada and Kali Kannada guidebooks are available for Classes 1–4, while Siri Kannada and Tili Kannada cover Class 5. The Siri Kannada digital guidebook is available for Class 6.',
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
      
      {/* ── Breadcrumb ── */}
      <div className="bg-stone-50 border-b border-stone-200 py-2.5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Books</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. H1: Buy Kannada Academic Guidebooks Online
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-10 sm:py-12 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white border-b border-stone-200 overflow-hidden text-center">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-tr from-amber-300/20 via-orange-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kannada Mathadi, Kannada Belesi.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Buy Kannada Academic Guidebooks Online
          </h1>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-2xl mx-auto pt-1">
            Explore printed Kannada guidebooks for Classes 1–5 and the available Siri Kannada digital guidebook for Class 6. Belesu’s English-translated learning resources help students understand Kannada lessons and learn with confidence.
          </p>

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
          
          {/* Mobile Filter Control Bar */}
          <div className="lg:hidden mb-5 p-3 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2.5">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs cursor-pointer min-h-[44px]"
                aria-label="Open filter menu"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter Books</span>
                {isAnyFilterActive && (
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                )}
              </button>

              <div className="flex items-center gap-2">
                {isAnyFilterActive && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-rose-600 underline px-2 py-1 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <span className="text-xs font-bold text-slate-700 bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg shadow-2xs">
                  {totalFilteredCount} {totalFilteredCount === 1 ? 'Book' : 'Books'}
                </span>
              </div>
            </div>

            {/* Quick Active Filter Dismiss Chips */}
            {isAnyFilterActive && (
              <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll pt-1 pb-0.5">
                {selectedSeries !== 'All' && (
                  <button
                    onClick={() => handleSeriesSelect('All')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
                  >
                    <span>Series: {selectedSeries}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {selectedGrade !== 'All' && (
                  <button
                    onClick={() => handleGradeSelect('All')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-200 text-slate-800 border border-stone-300 px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
                  >
                    <span>Class {selectedGrade}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-200 text-slate-800 border border-stone-300 px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
                  >
                    <span className="max-w-[120px] truncate">&ldquo;{searchQuery}&rdquo;</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ────────────────────────────────────────────────────────────────
                LEFT COLUMN: E-COMMERCE FILTER SIDEBAR (Desktop Only: 3 cols)
            ──────────────────────────────────────────────────────────────── */}
            <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 z-20 space-y-5">
              <div className="bg-stone-50/90 rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
                
                {/* Section Header */}
                <div className="border-b border-stone-200 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                      <h2 className="text-base sm:text-lg font-serif font-black text-slate-900 tracking-tight">
                        Shop Kannada Guidebooks by Series and Class
                      </h2>
                    </div>

                    {isAnyFilterActive && (
                      <button
                        onClick={resetAllFilters}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer shrink-0"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                    Browse available guidebooks and choose the right book for your class and learning needs.
                  </p>
                </div>

                {/* Filter Subheading */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <span>Filters</span>
                  <span className="text-[11px] font-semibold text-slate-500 normal-case">
                    {totalFilteredCount} shown
                  </span>
                </div>

                {/* Search Bar */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search guidebooks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 bg-white rounded-xl text-xs font-medium border border-stone-300 focus:outline-none focus:border-amber-500 shadow-2xs transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Series Filter List */}
                <div className="space-y-2 border-t border-stone-200/80 pt-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Series
                  </span>
                  
                  <div className="space-y-1">
                    {[
                      { id: 'All', label: 'All Books', count: seriesCounts.all },
                      { id: 'Savi', label: 'Savi Kannada', count: seriesCounts.savi },
                      { id: 'Kali', label: 'Kali Kannada', count: seriesCounts.kali },
                      { id: 'Siri', label: 'Siri Kannada', count: seriesCounts.siri },
                      { id: 'Tili', label: 'Tili Kannada', count: seriesCounts.tili },
                      { id: 'Digital', label: 'Digital Books', count: seriesCounts.digital },
                    ].map((s) => {
                      const isSelected = selectedSeries === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleSeriesSelect(s.id as SeriesFilter)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                              : 'bg-transparent hover:bg-stone-200/70 text-slate-700'
                          }`}
                        >
                          <span>{s.label}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isSelected
                                ? 'bg-amber-600 text-slate-950'
                                : 'bg-stone-200 text-slate-600'
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
                <div className="space-y-2 border-t border-stone-200/80 pt-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Class
                  </span>

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'All', label: 'All Classes' },
                      { id: 1, label: 'Class 1' },
                      { id: 2, label: 'Class 2' },
                      { id: 3, label: 'Class 3' },
                      { id: 4, label: 'Class 4' },
                      { id: 5, label: 'Class 5' },
                      { id: 6, label: 'Class 6' },
                    ].map((g) => {
                      const isSelected = selectedGrade === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => handleGradeSelect(g.id as GradeFilter)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs font-black'
                              : 'bg-white hover:bg-stone-200/70 text-slate-700 border border-stone-200'
                          }`}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort Option */}
                <div className="space-y-1.5 border-t border-stone-200/80 pt-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Sort
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
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
                    {/* Search Bar */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                        Search Books
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search guidebooks..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-8 py-2.5 bg-stone-50 rounded-xl text-xs font-medium border border-stone-300 focus:outline-none focus:border-amber-500 shadow-2xs"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Series Filter List */}
                    <div className="space-y-2 border-t border-stone-100 pt-3">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                        Series
                      </span>
                      <div className="space-y-1">
                        {[
                          { id: 'All', label: 'All Books', count: seriesCounts.all },
                          { id: 'Savi', label: 'Savi Kannada', count: seriesCounts.savi },
                          { id: 'Kali', label: 'Kali Kannada', count: seriesCounts.kali },
                          { id: 'Siri', label: 'Siri Kannada', count: seriesCounts.siri },
                          { id: 'Tili', label: 'Tili Kannada', count: seriesCounts.tili },
                          { id: 'Digital', label: 'Digital Books', count: seriesCounts.digital },
                        ].map((s) => {
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
                        {[
                          { id: 'All', label: 'All Classes' },
                          { id: 1, label: 'Class 1' },
                          { id: 2, label: 'Class 2' },
                          { id: 3, label: 'Class 3' },
                          { id: 4, label: 'Class 4' },
                          { id: 5, label: 'Class 5' },
                          { id: 6, label: 'Class 6' },
                        ].map((g) => {
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

                    {/* Sort Option */}
                    <div className="space-y-1.5 border-t border-stone-100 pt-3">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                        Sort
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer min-h-[44px]"
                      >
                        <option value="default">Default Sorting</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
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
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 text-xs font-black rounded-xl uppercase tracking-wider shadow-md transition min-h-[48px] flex items-center justify-center gap-1.5"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Showing {totalFilteredCount} {totalFilteredCount === 1 ? 'Guidebook' : 'Guidebooks'}
                  </span>

                  {isAnyFilterActive && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Filtered
                    </span>
                  )}
                </div>

                {isAnyFilterActive && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Product Cards Container (3 Columns on Desktop = 3x3 Grid) */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  
                  {/* Physical Books */}
                  {filteredPhysicalBooks.map((book) => (
                    <BookCard key={book.id} book={book} onPreview={(b) => setPreviewBook(b)} />
                  ))}

                  {/* Digital Class 6 Card */}
                  {showDigitalClass6 && (
                    <div className="group relative bg-white rounded-2xl border border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs uppercase tracking-wider">
                          Class 6
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
                          Digital Edition
                        </span>
                      </div>

                      <div className="p-6 pb-3">
                        <div className="relative w-full h-56 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-teal-50 flex items-center justify-center p-3 mb-4 group-hover:bg-emerald-50/50 transition-colors overflow-hidden">
                          <img
                            src="/digital/class-6-siri/cover.jpeg"
                            alt={digitalBookClass6.title}
                            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
                            <Link
                              href="/reader/kannada-class-6-guide?preview=true"
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-stone-100 transition shadow-md flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-600" /> View Free Preview
                            </Link>
                          </div>
                        </div>

                        <div className="mb-1">
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                            Siri Kannada Digital Guidebook
                          </span>
                        </div>

                        <Link href={`/digital/${digitalBookClass6.slug}`}>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-emerald-700 transition mb-2">
                            {digitalBookClass6.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                          {digitalBookClass6.description}
                        </p>
                      </div>

                      <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-lg font-black text-slate-900 block leading-tight">
                            ₹{digitalBookClass6.price}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                            Lifetime Access
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href="/reader/kannada-class-6-guide?preview=true"
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-stone-100 border border-stone-200 transition"
                          >
                            Preview
                          </Link>
                          <Link
                            href={`/digital/${digitalBookClass6.slug}`}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-xs"
                          >
                            Explore
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
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
          4. H2: Digital Kannada Guidebooks
      ══════════════════════════════════════════════════════════════════════════ */}
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
