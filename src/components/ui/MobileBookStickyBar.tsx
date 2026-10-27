'use client';

import React from 'react';
import { ShoppingBag, BookOpen } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { BookProduct } from '@/types';

interface MobileBookStickyBarProps {
  book: BookProduct;
  onAddToCart: () => void;
  onPreview: () => void;
}

export function MobileBookStickyBar({ book, onAddToCart, onPreview }: MobileBookStickyBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 pb-safe z-40 shadow-xl flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-lg sm:text-xl font-black text-amber-600 leading-tight">
          {formatPrice(book.price)}
        </div>
        <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 truncate">
          In Stock · Free Shipping
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onPreview}
          className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          aria-label="Preview book pages"
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span className="hidden xs:inline">Preview</span>
        </button>
        {book.stockQuantity <= 0 ? (
          <button
            type="button"
            disabled
            className="min-h-[44px] px-4 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center"
          >
            Out of Stock
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddToCart}
            className="min-h-[44px] px-4 sm:px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
