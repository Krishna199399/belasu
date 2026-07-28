'use client';

import React from 'react';
import { BookProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Star, BookOpen } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface BookCardProps {
  book: BookProduct;
  onPreview: (book: BookProduct) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPreview }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-white shadow-xs">
          Class {book.gradeClass}
        </span>
        {book.badge && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-600 text-white">
            {book.badge}
          </span>
        )}
      </div>

      <div className="p-5 pb-3">
        {/* Book Cover Container */}
        <div className="relative w-full h-56 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-4 group-hover:bg-amber-50/40 transition-colors overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />

          {/* Quick Preview Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
            <button
              onClick={() => onPreview(book)}
              className="py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1.5 transition"
            >
              <Eye className="w-4 h-4 text-amber-600" /> Preview Pages
            </button>
          </div>
        </div>

        {/* Series Tag & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            {book.series} Kannada Series
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{book.rating}</span>
            <span className="text-slate-400 font-normal">({book.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/books/${book.slug}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-600 transition mb-2">
            {book.title}
          </h3>
        </Link>

        {/* Sub-description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {book.description}
        </p>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div>
          <span className="text-lg font-black text-slate-900 block leading-tight">
            {formatPrice(book.price)}
          </span>
          {book.originalPrice && (
            <span className="text-[11px] line-through text-slate-400">
              {formatPrice(book.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(book)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-600 transition"
            title="Preview Book Pages"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => addToCart(book)}
            className="py-2.5 px-3.5 rounded-xl font-bold text-xs text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition"
          >
            <ShoppingBag className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
