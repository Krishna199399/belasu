'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BOOKS_DATA } from '@/data/mockData';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { BookCard } from '@/components/ui/BookCard';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct, BookSeries, DigitalBook } from '@/types';
import {
  Search,
  BookOpen,
  Building2,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap,
  Laptop,
  CheckCircle2,
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  BookMarked,
  Languages,
  Home,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

type FilterSeries = 'All' | 'Savi' | 'Kali' | 'Siri' | 'Tili' | 'Digital' | 'Spoken';
type FilterGrade = 'All' | 1 | 2 | 3 | 4 | 5 | 6;

function BooksContent() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get('series');
  const gradeParam = searchParams.get('grade');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<FilterSeries>('All');
  const [selectedGrade, setSelectedGrade] = useState<FilterGrade>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);
  const [booksList, setBooksList] = useState<BookProduct[]>(BOOKS_DATA);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  useEffect(() => {
    if (seriesParam) {
      if (['Savi', 'Kali', 'Siri', 'Tili', 'Spoken'].includes(seriesParam)) {
        setSelectedSeries(seriesParam as BookSeries);
      } else if (seriesParam.toLowerCase() === 'digital') {
        setSelectedSeries('Digital');
      }
    }
    if (gradeParam) {
      const parsedGrade = parseInt(gradeParam, 10);
      if ([1, 2, 3, 4, 5, 6].includes(parsedGrade)) {
        setSelectedGrade(parsedGrade as FilterGrade);
      }
    }
  }, [seriesParam, gradeParam]);

  // Combined product counts
  const seriesCounts = useMemo(() => {
    return {
      all: booksList.length + 1, // physical + 1 digital class 6
      savi: booksList.filter((b) => b.series === 'Savi').length,
      kali: booksList.filter((b) => b.series === 'Kali').length,
      siri: booksList.filter((b) => b.series === 'Siri').length,
      tili: booksList.filter((b) => b.series === 'Tili').length,
      spoken: booksList.filter((b) => b.series === 'Spoken').length,
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

  // Check if Class 6 digital book matches current filter
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

  const faqs = [
    {
      q: 'Where can I buy Kannada guidebooks online?',
      a: 'You can browse and purchase available Kannada guidebooks directly from Belesu’s Books page. Filter the products by series or class, open the relevant product page to review its details and price, and add your selected book to the cart.',
    },
    {
      q: 'Which classes are covered by Belesu Kannada guidebooks?',
      a: 'Belesu offers printed Savi Kannada and Kali Kannada guidebooks for Classes 1–4, along with Siri Kannada and Tili Kannada guidebooks for Class 5. The Siri Kannada digital guidebook is available for Class 6.',
    },
    {
      q: 'Are Belesu Kannada guidebooks available with English translation?',
      a: 'Yes. Belesu’s English-translated Kannada guidebooks help students understand Kannada lessons through English meanings and additional academic support. Features such as pronunciation guidance and exercise explanations may vary by title, so review the individual product page before purchasing.',
    },
    {
      q: 'Are Belesu guidebooks suitable for English-medium school students?',
      a: 'Belesu guidebooks are designed to support students who benefit from English explanations while learning Kannada. Suitability depends on the student’s class, prescribed Kannada textbook, and the specific guidebook selected.',
    },
    {
      q: 'How can I get help with my order?',
      a: 'For help choosing a book, checking availability, or resolving an order-related query, contact Belesu at +91 9902383451 or kannada@belesu.in.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO HEADER (H1)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-14 pb-12 sm:pt-20 sm:pb-16 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white border-b border-stone-200 overflow-hidden text-center">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-tr from-amber-300/20 via-orange-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Belesu Bookstore</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Buy Kannada Academic Guidebooks Online
          </h1>

          <div className="max-w-3xl mx-auto space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-1">
            <p>
              Make Kannada learning easier with Belesu’s innovative academic guidebooks. Our English-translated
              Kannada guidebooks help school students understand lessons, learn correct pronunciation, and
              prepare for Kannada exams with greater confidence.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm">
              Explore printed guidebooks for Classes 1–5 and the available Siri Kannada digital guidebook for Class 6
              to find a learning resource that suits your needs.
            </p>
          </div>

          {/* Cultural Tagline */}
          <div className="pt-2 flex flex-col items-center gap-1.5">
            <span className="text-sm sm:text-base font-serif font-bold text-amber-800 italic">
              “Kannada Mathadi, Kannada Belesi”
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 shadow-2xs">
              ಕನ್ನಡ ಮಾತಾಡಿ, ಕನ್ನಡ ಬೆಳೆಸಿ
            </span>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. SHOP BY SERIES & CLASS FILTERS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-stone-50/70 border-b border-stone-200 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                Shop Kannada Guidebooks by Series and Class
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Browse Belesu’s Kannada guidebooks, compare the available titles and choose a book that matches your class and learning needs.
              </p>
            </div>

            {/* Live Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search titles or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs font-medium border border-stone-300 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              {/* Sorting Select */}
              <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-3 py-2 shadow-2xs">
                <span className="text-xs font-bold text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Pills Strip: Series & Classes */}
          <div className="space-y-3 pt-2">
            
            {/* Filter by Series */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
                Series:
              </span>
              {(['All', 'Savi', 'Kali', 'Siri', 'Tili', 'Spoken', 'Digital'] as FilterSeries[]).map((series) => {
                const isSelected = selectedSeries === series;
                const labelMap: Record<FilterSeries, string> = {
                  All: `All Books (${seriesCounts.all})`,
                  Savi: `Savi Kannada (${seriesCounts.savi})`,
                  Kali: `Kali Kannada (${seriesCounts.kali})`,
                  Siri: `Siri Kannada (${seriesCounts.siri})`,
                  Tili: `Tili Kannada (${seriesCounts.tili})`,
                  Spoken: `Spoken Kannada (${seriesCounts.spoken})`,
                  Digital: `Digital Books (${seriesCounts.digital})`,
                };
                return (
                  <button
                    key={series}
                    onClick={() => setSelectedSeries(series)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-xs scale-102 font-black'
                        : 'bg-white hover:bg-stone-100 text-slate-700 border border-stone-200'
                    }`}
                  >
                    {labelMap[series]}
                  </button>
                );
              })}
            </div>

            {/* Filter by Class */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-3">
                Class:
              </span>
              {(['All', 1, 2, 3, 4, 5, 6] as FilterGrade[]).map((grade) => {
                const isSelected = selectedGrade === grade;
                const label = grade === 'All' ? 'All Classes' : `Class ${grade}`;
                return (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs scale-105'
                        : 'bg-white hover:bg-stone-100 text-slate-700 border border-stone-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              {(selectedSeries !== 'All' || selectedGrade !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSeries('All');
                    setSelectedGrade('All');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. PRODUCT CATALOG GRID
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Showing {totalFilteredCount} {totalFilteredCount === 1 ? 'Title' : 'Titles'}
            </span>
            <span className="text-xs text-slate-500">
              Karnataka State Syllabus Aligned
            </span>
          </div>

          {totalFilteredCount === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 max-w-xl mx-auto space-y-4">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg">No matching guidebooks found</h3>
                <p className="text-xs text-slate-600">Try adjusting your search query, series, or class filter.</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSeries('All');
                  setSelectedGrade('All');
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Printed Books */}
              {filteredPhysicalBooks.map((book) => (
                <BookCard key={book.id} book={book} onPreview={(b) => setPreviewBook(b)} />
              ))}

              {/* Digital Class 6 Book Card (renders when filter matches) */}
              {showDigitalClass6 && (
                <div className="group relative bg-white rounded-2xl border border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  {/* Class Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs uppercase tracking-wider">
                      Class 6
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
                      Digital Edition
                    </span>
                  </div>

                  <div className="p-6 pb-3">
                    {/* Cover Container */}
                    <div className="relative w-full h-56 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-teal-50 flex items-center justify-center p-3 mb-4 group-hover:bg-emerald-50/50 transition-colors overflow-hidden">
                      <img
                        src="/covers/siri-5.png"
                        alt={digitalBookClass6.title}
                        className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
                        <Link
                          href="/reader/kannada-class-6-guide?preview=true"
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-stone-100 transition shadow-md flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" /> Free Preview
                        </Link>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Siri Kannada · Digital Reader
                      </span>
                    </div>

                    <Link href={`/digital/${digitalBookClass6.slug}`}>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-emerald-700 transition mb-2">
                        {digitalBookClass6.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {digitalBookClass6.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-lg font-black text-slate-900 block leading-tight">
                        ₹{digitalBookClass6.price}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                        Lifetime Web Access
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

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. PRINTED KANNADA GUIDEBOOKS FOR CLASSES 1–5 (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/80 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Primary School Curricula
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Printed Kannada Guidebooks for Classes 1–5
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore printed Kannada guidebooks with English translations and supplementary academic support.
              Select a series and class to review the book details, check the price, and place your order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Savi Kannada */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                  Classes 1–4
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">
                  Savi Kannada English-Translated Guidebooks
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore Savi Kannada guidebooks designed to help primary school students understand Kannada lessons through English translations and additional learning support.
                </p>
                <div className="text-xs text-slate-700 font-medium pt-2 border-t border-stone-100">
                  <strong>Products:</strong> Savi Kannada Guidebook for Class 1, Class 2, Class 3, and Class 4.
                </div>
              </div>
              <button
                onClick={() => { setSelectedSeries('Savi'); setSelectedGrade('All'); }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Savi Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Kali Kannada */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-300 inline-block">
                  Classes 1–4
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">
                  Kali Kannada English-Translated Guidebooks
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Discover Kali Kannada guidebooks that support students as they develop their Kannada reading, writing, and comprehension skills through class-specific learning resources.
                </p>
                <div className="text-xs text-slate-700 font-medium pt-2 border-t border-stone-100">
                  <strong>Products:</strong> Kali Kannada Guidebook for Class 1, Class 2, Class 3, and Class 4.
                </div>
              </div>
              <button
                onClick={() => { setSelectedSeries('Kali'); setSelectedGrade('All'); }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-100 hover:bg-indigo-600 hover:text-white text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Kali Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Siri Kannada */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-rose-400 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-300 inline-block">
                  Class 5
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">
                  Siri Kannada English-Translated Guidebook
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore the Siri Kannada guidebook for Class 5, with supplementary learning support to help students understand Kannada lessons and work through academic exercises.
                </p>
                <div className="text-xs text-slate-700 font-medium pt-2 border-t border-stone-100">
                  <strong>Product:</strong> Siri Kannada Guidebook Class 5 (Middle school literature & poetry).
                </div>
              </div>
              <button
                onClick={() => { setSelectedSeries('Siri'); setSelectedGrade(5); }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-100 hover:bg-rose-600 hover:text-white text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Siri Class 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tili Kannada */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-400 transition-colors">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-teal-100 text-teal-900 border border-teal-300 inline-block">
                  Class 5
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">
                  Tili Kannada English-Translated Guidebook
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Find the Tili Kannada guidebook for Class 5 and explore its learning content to support Kannada comprehension and schoolwork.
                </p>
                <div className="text-xs text-slate-700 font-medium pt-2 border-t border-stone-100">
                  <strong>Product:</strong> Tili Kannada Guidebook Class 5 (Chapter summaries & takeaways).
                </div>
              </div>
              <button
                onClick={() => { setSelectedSeries('Tili'); setSelectedGrade(5); }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-100 hover:bg-teal-600 hover:text-white text-slate-800 border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Tili Class 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. DIGITAL KANNADA GUIDEBOOKS SPOTLIGHT (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-emerald-500/10 via-amber-50/30 to-white border-b border-stone-200 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-emerald-200/90 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                  <Laptop className="w-4 h-4 text-emerald-700" />
                  <span>Digital Reading Experience</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                  Digital Kannada Guidebooks
                </h2>

                <p className="text-base text-slate-700 leading-relaxed font-normal">
                  Looking for a digital Kannada guidebook? Explore Belesu’s available digital edition for Class 6
                  and access Kannada learning content through the supported digital reader.
                </p>

                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-3">
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    Siri Kannada Digital Guidebook | Class 6
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Explore the Siri Kannada digital guidebook for Class 6, designed to support academic Kannada learning through English-translated content and the learning features included in the digital edition.
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    Visit the product page to review the available content, explore the preview, and check the current price and access terms before purchasing.
                  </p>
                </div>

                {/* CTAs matching books.md verbatim */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={`/digital/${digitalBookClass6.slug}`}
                    className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explore Digital Guidebook</span>
                  </Link>

                  <Link
                    href="/reader/kannada-class-6-guide?preview=true"
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>View Free Preview</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Stage */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-50 to-white border border-emerald-200 shadow-md text-center space-y-3 max-w-sm">
                  <img
                    src="/covers/siri-5.png"
                    alt="Siri Kannada Digital Guidebook Class 6"
                    className="max-h-64 mx-auto object-contain drop-shadow-xl rounded-lg"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Compatible on All Devices
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Smartphone · Tablet · Laptop · Desktop
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. WHY CHOOSE BELESU KANNADA GUIDEBOOKS? (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              The Belesu Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Why Choose Belesu Kannada Guidebooks?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Engineered specifically to alleviate language anxiety and empower students and parents with joyful, self-paced learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                  <Languages className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  English Translation for Easier Understanding
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  English-translated content helps students connect Kannada words, sentences, and lessons with meanings they can understand more easily.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Word-by-word parallel clarity
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shadow-2xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Supplementary Academic Support
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore learning resources designed to help students follow Kannada lessons, practise language skills, and prepare for school examinations.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                State Board textbook aligned
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                  <Laptop className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Printed and Digital Learning Options
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Choose from printed guidebooks for primary school classes or explore the available Siri Kannada digital guidebook for Class 6.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Flexible formats for every need
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-2xs">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                  Support for Learning at Home
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Belesu guidebooks give parents an additional resource to refer to when helping children understand Kannada lessons and practise schoolwork.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Stress-free parental guidance
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. BUYER FAQS SECTION (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Frequently Asked Questions About Buying Kannada Guidebooks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about purchasing, syllabus coverage, translations, and order assistance.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50"
                  >
                    <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
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
          8. ADVISORY CTA: NEED HELP CHOOSING? (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 text-center relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider border border-white/30">
            <span>Academic Consultation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Need Help Choosing the Right Kannada Guidebook?
          </h2>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Not sure which edition is suitable for your class or learning needs? Contact Belesu for help
            identifying an appropriate guidebook and understanding the available options.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+919902383451"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-stone-100 text-slate-950 border border-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Call +91 9902383451</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. CORPORATE CREDIBILITY STRIP
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </Link>
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
