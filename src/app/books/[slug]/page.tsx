'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { BOOKS_DATA, PARENT_REVIEWS } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Eye, CheckCircle2, ShieldCheck, Truck, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { BookProduct } from '@/types';

export default function BookDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [book, setBook] = useState<BookProduct>(
    () => BOOKS_DATA.find((b) => b.slug === slug) || BOOKS_DATA[0]
  );

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.books) {
          const matched = data.books.find((b: BookProduct) => b.slug === slug);
          if (matched) setBook(matched);
        }
      })
      .catch((err) => console.error('Failed to load live book data:', err));
  }, [slug]);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen pb-28 lg:pb-12">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Back Link */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 mb-6 sm:mb-8 min-h-[40px] py-1 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Books
        </Link>

        {/* Product Details Layout */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8 md:p-12 mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Image Showcase */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center relative">
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 bg-amber-500 text-white font-bold text-xs rounded-full shadow-xs">
                Class {book.gradeClass} ({book.series} Series)
              </span>

              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-72 sm:max-h-96 object-contain drop-shadow-2xl my-4 sm:mb-6"
              />

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm hover:bg-amber-50 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-600" /> Preview Sample Pages Inside
              </button>

              {book.karnatakaTextbookCover && (
                <div className="w-full mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-3">
                  <img
                    src={book.karnatakaTextbookCover}
                    alt={`Karnataka School Textbook Class ${book.gradeClass}`}
                    className="w-12 h-16 object-contain rounded border border-amber-300/80 shadow-2xs shrink-0"
                  />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                      Karnataka School Textbook Aligned
                    </span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight block">
                      English-translated companion for the official Class {book.gradeClass} {book.series} textbook.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Details Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-snug">
                  {book.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-2 border-y border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-amber-600">{formatPrice(book.price)}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  In Stock
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {book.gradeClass ? `An English-translated Kannada guidebook for Class ${book.gradeClass} students.` : book.description}
              </p>

              {/* Stock Warning Banner if Low or Out */}
              {book.stockQuantity <= 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Currently Out of Stock. Please check back soon or contact support.</span>
                </div>
              ) : book.stockQuantity <= 5 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>⚡ Hurry! Only {book.stockQuantity} copies remaining in stock.</span>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                {book.stockQuantity <= 0 ? (
                  <button
                    disabled
                    className="flex-1 min-h-[48px] py-3.5 px-6 rounded-2xl font-bold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ShoppingBag className="w-5 h-5 text-slate-400" /> Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(book, 'physical')}
                    className="flex-1 min-h-[48px] py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-sm sm:text-base transition cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add to Cart ({formatPrice(book.price)})
                  </button>
                )}

                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="min-h-[48px] py-3.5 px-6 rounded-2xl font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" /> Preview Inside
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" /> 3-5 Business Days Delivery
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 100% State Syllabus Aligned
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Key Features & Highlights */}
        <div className="mb-12 sm:mb-16">
          <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-4xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" /> What This Guidebook Provides:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600">
              {book.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 pb-safe z-40 shadow-xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-amber-600 leading-tight">
            {formatPrice(book.price)}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 truncate">
            In Stock
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            aria-label="Preview book pages"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden xs:inline">Preview</span>
          </button>
          {book.stockQuantity <= 0 ? (
            <button
              disabled
              className="min-h-[44px] px-4 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => addToCart(book, 'physical')}
              className="min-h-[44px] px-4 sm:px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Book Preview Modal */}
      {isPreviewOpen && book && <BookPreviewModal book={book} onClose={() => setIsPreviewOpen(false)} />}
    </div>
  );
}
