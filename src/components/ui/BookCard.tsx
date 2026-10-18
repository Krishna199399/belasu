'use client';

import React from 'react';
import { BookProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { Eye, BookOpen } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Button, IconButton, Badge } from '@/components/ui/Button';

interface BookCardProps {
  book: BookProduct;
  onPreview: (book: BookProduct) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPreview }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Class Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge variant="amber">
          Class {book.gradeClass}
        </Badge>
      </div>

      <div className="p-6 pb-3">
        {/* Book Cover Container */}
        <div className="relative w-full h-56 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-4 group-hover:bg-amber-50/40 transition-colors overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />

          {/* Quick Preview Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(book)}
            >
              <Eye className="w-4 h-4" /> Preview
            </Button>
          </div>
        </div>

        {/* Series Tag */}
        <div className="mb-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            {book.series} Kannada Series
          </span>
        </div>

        {/* Title */}
        <Link href={`/books/${book.slug}`}>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-600 transition mb-2">
            {book.title}
          </h3>
        </Link>

        {/* Sub-description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {book.description}
        </p>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div>
          <span className="text-lg font-black text-slate-900 block leading-tight">
            {formatPrice(book.price)}
          </span>
          {book.stockQuantity <= 5 && book.stockQuantity > 0 && (
            <span className="text-xs font-bold text-amber-700 block mt-0.5">
              Only {book.stockQuantity} left!
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <IconButton
            variant="default"
            onClick={() => onPreview(book)}
            title="Preview Book Pages"
          >
            <BookOpen className="w-4 h-4" />
          </IconButton>
          {book.stockQuantity <= 0 ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-60 cursor-not-allowed text-rose-600 border-rose-200"
            >
              Sold Out
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => addToCart(book, 'physical')}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
