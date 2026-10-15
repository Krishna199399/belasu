'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BOOKS_DATA } from '@/data/mockData';
import { BookCard } from '@/components/ui/BookCard';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct, BookSeries } from '@/types';
import { Search, BookOpen, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function BooksContent() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get('series');
  const gradeParam = searchParams.get('grade');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<BookSeries | 'All'>('All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);
  const [booksList, setBooksList] = useState<BookProduct[]>(BOOKS_DATA);

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
    if (seriesParam && ['Savi', 'Kali', 'Siri', 'Tili'].includes(seriesParam)) {
      setSelectedSeries(seriesParam as BookSeries);
    }
    if (gradeParam) {
      const parsedGrade = parseInt(gradeParam, 10);
      if (!isNaN(parsedGrade)) {
        setSelectedGrade(parsedGrade);
      }
    }
  }, [seriesParam, gradeParam]);

  const seriesCounts = useMemo(() => {
    return {
      all: booksList.length,
      kali: booksList.filter((b) => b.series === 'Kali').length,
      savi: booksList.filter((b) => b.series === 'Savi').length,
      siri: booksList.filter((b) => b.series === 'Siri').length,
      tili: booksList.filter((b) => b.series === 'Tili').length,
    };
  }, [booksList]);

  const filteredBooks = useMemo(() => {
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
  }, [searchQuery, selectedSeries, selectedGrade, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Open Book Hero Banner */}
      <section className="relative w-full py-16 md:py-24 bg-stone-100 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/book-back.png"
            alt="Open Book Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight">
            Purchase Book
          </h1>

          {/* Series Categories Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 font-serif text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-700">
            <button
              onClick={() => { setSelectedSeries('All'); setSelectedGrade('All'); }}
              className={`transition cursor-pointer ${
                selectedSeries === 'All' ? 'text-amber-600 underline underline-offset-8' : 'hover:text-amber-600'
              }`}
            >
              BOOKS <span className="text-xs text-slate-400 font-sans">({seriesCounts.all} Products)</span>
            </button>

            <button
              onClick={() => setSelectedSeries('Kali')}
              className={`transition cursor-pointer ${
                selectedSeries === 'Kali' ? 'text-amber-600 underline underline-offset-8' : 'hover:text-amber-600'
              }`}
            >
              KALI KANNADA <span className="text-xs text-slate-400 font-sans">({seriesCounts.kali} Products)</span>
            </button>

            <button
              onClick={() => setSelectedSeries('Savi')}
              className={`transition cursor-pointer ${
                selectedSeries === 'Savi' ? 'text-amber-600 underline underline-offset-8' : 'hover:text-amber-600'
              }`}
            >
              SAVI KANNADA <span className="text-xs text-slate-400 font-sans">({seriesCounts.savi} Products)</span>
            </button>

            <button
              onClick={() => setSelectedSeries('Siri')}
              className={`transition cursor-pointer ${
                selectedSeries === 'Siri' ? 'text-amber-600 underline underline-offset-8' : 'hover:text-amber-600'
              }`}
            >
              SIRI KANNADA <span className="text-xs text-slate-400 font-sans">({seriesCounts.siri} Product)</span>
            </button>

            <button
              onClick={() => setSelectedSeries('Tili')}
              className={`transition cursor-pointer ${
                selectedSeries === 'Tili' ? 'text-amber-600 underline underline-offset-8' : 'hover:text-amber-600'
              }`}
            >
              TILI KANNADA <span className="text-xs text-slate-400 font-sans">({seriesCounts.tili} Product)</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Toolbar & Controls */}
      <section className="py-6 border-b border-stone-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-amber-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">Purchase Book</span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-6">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-stone-100 rounded-lg text-xs border border-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <span>Sorting:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="py-1.5 px-3 bg-stone-100 rounded-lg text-xs font-bold border border-stone-200 focus:outline-none"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-asc">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
                </select>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Product Catalog Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No books found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">Try searching for a different title or series.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSeries('All');
                  setSelectedGrade('All');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onPreview={(b) => setPreviewBook(b)} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. Corporate Footer Card */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore- 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>

            <div className="text-center md:text-right space-y-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full font-black text-slate-900 bg-amber-400 hover:bg-amber-500 text-xs uppercase tracking-wider transition"
              >
                Contact Support <ChevronRight className="w-4 h-4" />
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
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading Belesu Store Catalog...</p>
        </div>
      </div>
    }>
      <BooksContent />
    </Suspense>
  );
}
