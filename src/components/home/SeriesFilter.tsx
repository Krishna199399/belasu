'use client';

import React, { useState } from 'react';
import { BOOKS_DATA } from '@/data/mockData';
import { BookCard } from '@/components/ui/BookCard';
import { BookProduct, BookSeries } from '@/types';
import { Filter, Sparkles, BookOpen } from 'lucide-react';

interface SeriesFilterProps {
  onPreview: (book: BookProduct) => void;
}

export const SeriesFilter: React.FC<SeriesFilterProps> = ({ onPreview }) => {
  const [selectedSeries, setSelectedSeries] = useState<BookSeries | 'All'>('All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');

  const filteredBooks = BOOKS_DATA.filter((book) => {
    const matchesSeries = selectedSeries === 'All' || book.series === selectedSeries;
    const matchesGrade = selectedGrade === 'All' || book.gradeClass === selectedGrade;
    return matchesSeries && matchesGrade;
  });

  return (
    <section className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/60">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> State Syllabus Guidebooks
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Find Your Child’s Exact <span className="text-amber-600">Kannada Guidebook</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Select your child’s primary school class or textbook series to view English-translated study workbooks.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xs border border-slate-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Series Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 hidden sm:inline-block">
              Series:
            </span>
            {(['All', 'Savi', 'Kali', 'Siri', 'Tili'] as const).map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  selectedSeries === series
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {series === 'All' ? 'All Series' : `${series} Kannada`}
              </button>
            ))}
          </div>

          {/* Grade Class Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 hidden sm:inline-block">
              Grade:
            </span>
            {(['All', 1, 2, 3, 4, 5] as const).map((grade) => (
              <button
                key={grade.toString()}
                onClick={() => setSelectedGrade(grade)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  selectedGrade === grade
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grade === 'All' ? 'All Classes' : `Class ${grade}`}
              </button>
            ))}
          </div>

        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No books found for selected filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try resetting your grade or series selection.</p>
            <button
              onClick={() => {
                setSelectedSeries('All');
                setSelectedGrade('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onPreview={onPreview} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
