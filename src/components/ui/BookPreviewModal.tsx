'use client';

import React, { useState } from 'react';
import { BookProduct } from '@/types';
import { X, ChevronLeft, ChevronRight, BookOpen, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface BookPreviewModalProps {
  book: BookProduct | null;
  onClose: () => void;
}

export const BookPreviewModal: React.FC<BookPreviewModalProps> = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { addToCart } = useCart();

  if (!book) return null;

  const samples = book.samplePages && book.samplePages.length > 0 ? book.samplePages : [
    {
      pageNumber: 1,
      title: 'Sample Lesson Translation',
      imageUrl: book.coverImage,
      kannadaText: 'ಅಧ್ಯಾಯ ೧: ಪಾಠ ಮತ್ತು ಅನುವಾದ (Lesson 1: Translation & Notes)',
      englishTranslation: 'Line-by-line English transliteration and word meanings provided for every lesson.'
    }
  ];

  const currentSample = samples[currentPage];

  const handleNext = () => {
    if (currentPage < samples.length - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Page Image / Viewer */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center relative border-r border-slate-100">
          <div className="relative w-full h-72 md:h-96 flex items-center justify-center">
            {/* Page Content Card */}
            <div className="w-full h-full bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Sample Page {currentSample.pageNumber} of {samples.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">Belesu Academic Series</span>
              </div>

              <div className="space-y-4 my-auto">
                <h4 className="text-base font-bold text-slate-900">{currentSample.title}</h4>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200/60">
                  <p className="text-xs font-semibold text-amber-800 uppercase mb-1">Kannada Text:</p>
                  <p className="text-sm font-medium text-slate-900 leading-relaxed font-sans">{currentSample.kannadaText}</p>
                </div>

                <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-1">English Translation & Notes:</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{currentSample.englishTranslation}</p>
                </div>
              </div>

              <div className="pt-3 border-t text-center text-xs text-slate-400">
                Class {book.gradeClass} {book.series} Kannada Curriculum Aid
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {samples.length > 1 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium text-slate-600">
                {currentPage + 1} / {samples.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === samples.length - 1}
                className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Book Details & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                Class {book.gradeClass}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">
                {book.series} Kannada Series
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-3">
              {book.title}
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-black text-amber-600">{formatPrice(book.price)}</span>
              {book.originalPrice && (
                <span className="text-sm line-through text-slate-400">{formatPrice(book.originalPrice)}</span>
              )}
              <span className="text-xs text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 rounded">
                In Stock & Free Shipping
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {book.description}
            </p>

            <div className="space-y-2 mb-6">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Key Features:</h5>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                {book.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => {
                addToCart(book);
                onClose();
              }}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
