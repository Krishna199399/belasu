'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { DIGITAL_BOOKS_DATA, DIGITAL_GRADES, DIGITAL_SUBJECTS } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import { BookOpen, Lock, ShieldCheck, Filter, Search, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function DigitalBookCard({ book }: { book: DigitalBook }) {
  const { user } = useAuth();
  const owned = user?.purchasedBooks?.digital?.includes(book.id);

  const subjectColors: Record<string, string> = {
    Kannada: 'from-amber-500 to-orange-600',
    Mathematics: 'from-blue-500 to-indigo-600',
    Science: 'from-emerald-500 to-teal-600',
    'Social Science': 'from-rose-500 to-pink-600',
    English: 'from-violet-500 to-purple-600',
    Hindi: 'from-red-500 to-rose-600',
  };
  const gradient = subjectColors[book.subject] || 'from-slate-600 to-slate-800';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Cover Banner */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider z-10">
          Class {book.gradeClass}
        </div>
        {owned && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10 flex items-center gap-1 shadow-xs">
            ✓ Owned
          </span>
        )}
        <div className="text-center text-white p-4 drop-shadow-sm">
          <div className="text-5xl mb-2">📖</div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-90">{book.subject}</div>
          <div className="text-sm font-black mt-0.5">Class {book.gradeClass}</div>
        </div>
        {!owned && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-2.5 pt-6">
            <div className="flex items-center gap-1.5 text-white text-xs font-semibold bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full">
              <Lock className="w-3 h-3 text-amber-300" /> {book.isFreePreviewPages} pages free preview
            </div>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-6 pb-3 flex flex-col flex-1">
        <div className="mb-1.5">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            {book.subject} · Digital Reader
          </span>
        </div>

        <Link href={`/digital/${book.slug}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-600 transition mb-1.5">
            {book.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {book.description}
        </p>

        <div className="mt-auto flex items-center gap-2 text-xs text-slate-600 font-medium pt-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>{book.totalPages} Pages</span>
          <span className="text-slate-300">•</span>
          <span>Web Reader</span>
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div>
          <span className="text-xl font-black text-slate-900 block leading-tight">
            ₹{book.price}
          </span>
          <span className="text-xs font-medium text-slate-600 block">Lifetime access</span>
        </div>

        <div className="flex items-center gap-2">
          {owned ? (
            <Link
              href={`/reader/${book.slug}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" /> Read Now
            </Link>
          ) : (
            <>
              <Link
                href={`/reader/${book.slug}?preview=true`}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
              >
                Preview
              </Link>
              <Link
                href={`/digital/${book.slug}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-xs"
              >
                Buy & Read
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DigitalBooksPage() {
  const [booksList, setBooksList] = useState<DigitalBook[]>(DIGITAL_BOOKS_DATA);
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/digital/books', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.books)) {
          setBooksList(data.books);
        }
      })
      .catch((err) => console.error('Failed to fetch digital books list:', err));
  }, []);

  const filteredBooks = useMemo(() => {
    return booksList.filter((book) => {
      const gradeMatch = selectedGrade === 'all' || book.gradeClass === selectedGrade;
      const subjectMatch = selectedSubject === 'All' || book.subject === selectedSubject;
      const searchMatch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return gradeMatch && subjectMatch && searchMatch;
    });
  }, [booksList, selectedGrade, selectedSubject, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      
      {/* Hero Banner */}
      <section className="relative py-14 sm:py-16 md:py-20 bg-stone-100/90 border-b border-stone-200 overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-4 lg:px-6 relative z-10">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-4">
            <Link href="/" className="hover:text-amber-700 transition">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span className="text-amber-700 font-bold" aria-current="page">Digital Books</span>
          </nav>

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> New · Digital Books Platform
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Study Smarter for <span className="text-amber-600">Class 6th</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Purchase once, read forever. Our secure web reader lets you access the Karnataka Board Class 6 Kannada guidebook anywhere — no app download needed. Protected against screenshots and downloads.
            </p>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {[
                { icon: <ShieldCheck className="w-4 h-4 text-amber-600" />, text: 'Protected Web Reader' },
                { icon: <BookOpen className="w-4 h-4 text-amber-600" />, text: 'Class 6 Kannada Guide' },
                { icon: <Lock className="w-4 h-4 text-amber-600" />, text: 'One-Time Lifetime Access' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-xs">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1300px] mx-auto px-4 lg:px-6 py-8 md:py-10">
        
        {/* Filter Toolbar */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xs border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Grade Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1.5 hidden sm:inline-block">
                Grade:
              </span>
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                  selectedGrade === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Grades
              </button>
              {DIGITAL_GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Class {g}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search digital books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-4 py-2.5 rounded-xl placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

          </div>

          {/* Subject Indicator */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Subject:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-xs">
              📚 Kannada
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Line-by-line English-translated digital guidebooks for Karnataka State Board
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <section>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No digital books found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your grade or subject selection.</p>
              <button
                onClick={() => {
                  setSelectedGrade('all');
                  setSelectedSubject('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {filteredBooks.length} Digital Books Available
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <DigitalBookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}
        </section>

      </div>
    </div>
  );
}
