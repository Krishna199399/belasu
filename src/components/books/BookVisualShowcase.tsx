'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, ArrowLeft } from 'lucide-react';
import { BookProduct } from '@/types';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  isSamplePage?: boolean;
  samplePageIndex?: number;
}

interface BookVisualShowcaseProps {
  book: BookProduct;
  onOpenPreview?: (initialPageIndex?: number) => void;
  primaryBadge?: string;
  secondaryBadge?: string;
  categoryName?: string;
  showBreadcrumb?: boolean;
}

export const BookVisualShowcase: React.FC<BookVisualShowcaseProps> = ({
  book,
  onOpenPreview,
  primaryBadge,
  secondaryBadge,
  categoryName,
  showBreadcrumb = false,
}) => {
  // Build items list: Cover image + Sample Pages + optional Govt Textbook cover
  const items: GalleryItem[] = [
    {
      id: 'cover',
      title: 'Book Cover',
      imageUrl: book.coverImage,
      isSamplePage: false,
    },
    ...(book.samplePages || []).map((page, idx) => ({
      id: `sample-${idx}`,
      title: page.title || `Sample Page ${idx + 1}`,
      imageUrl: page.imageUrl,
      isSamplePage: true,
      samplePageIndex: idx,
    })),
    ...(book.karnatakaTextbookCover
      ? [
          {
            id: 'karnataka-govt',
            title: 'Karnataka State Textbook Aligned',
            imageUrl: book.karnatakaTextbookCover,
            isSamplePage: false,
          },
        ]
      : []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeItem = items[selectedIndex] || items[0];

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handlePrev = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
  };

  // Determine badges if not explicitly passed
  const leftBadgeText =
    primaryBadge !== undefined
      ? primaryBadge
      : book.series === 'Spoken'
      ? ''
      : book.series
      ? `${book.series.toUpperCase()} KANNADA`
      : `CLASS ${book.gradeClass}`;

  const rightBadgeText =
    secondaryBadge ||
    (book.series === 'Spoken'
      ? '23 Chapters'
      : book.gradeClass
      ? `Class ${book.gradeClass} Syllabus`
      : 'State Board Aligned');

  const resolvedCategory =
    categoryName ||
    (book.series === 'Spoken'
      ? 'Spoken Kannada'
      : `${book.series} Kannada Series`);

  return (
    <div className="w-full space-y-3">
      {/* ── Optional Integrated Breadcrumbs ── */}
      {showBreadcrumb && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
          <Link
            href="/books/"
            className="inline-flex items-center gap-1 text-slate-700 hover:text-amber-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Books</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600">{resolvedCategory}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
            {book.title}
          </span>
        </div>
      )}

      {/* ── Visual Showcase Grid: Vertical Thumbnails (Desktop) + Main Showcase Card ── */}
      <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-3 sm:gap-4 lg:gap-5 w-full">
        
        {/* ══════════════════════════════════════════════════════════════════
            1. THUMBNAIL SELECTOR (Vertical on md+, Horizontal on mobile)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex md:flex-col items-center justify-center gap-1.5 sm:gap-2 shrink-0 w-full md:w-auto">
          {/* Up Chevron Button (Desktop) / Left (Mobile) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            aria-label="Previous thumbnail"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200 text-slate-700 shadow-2xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer active:scale-95 shrink-0"
          >
            <span className="hidden md:inline">
              <ChevronUp className="w-4 h-4" />
            </span>
            <span className="inline md:hidden">
              <ChevronLeft className="w-4 h-4" />
            </span>
          </button>

          {/* Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[380px] lg:max-h-[440px] max-w-full md:max-w-none p-1 no-scrollbar scroll-smooth"
          >
            {items.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative rounded-xl p-1 bg-white transition-all duration-200 cursor-pointer shrink-0 overflow-hidden text-left ${
                    isSelected
                      ? 'border-2 border-amber-500 ring-2 ring-amber-400/40 shadow-sm scale-102'
                      : 'border border-stone-200/90 hover:border-amber-300 opacity-80 hover:opacity-100 hover:scale-101 shadow-2xs'
                  }`}
                  aria-label={item.title}
                >
                  <div className="w-14 h-18 sm:w-16 sm:h-21 lg:w-18 lg:h-24 bg-stone-50 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Down Chevron Button (Desktop) / Right (Mobile) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedIndex === items.length - 1}
            aria-label="Next thumbnail"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200 text-slate-700 shadow-2xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer active:scale-95 shrink-0"
          >
            <span className="hidden md:inline">
              <ChevronDown className="w-4 h-4" />
            </span>
            <span className="inline md:hidden">
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            2. MAIN BOOK DISPLAY CARD (Large White Showcase Card with Badges)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 w-full max-w-[420px] md:max-w-none bg-white rounded-3xl border border-stone-200/90 shadow-lg p-4 sm:p-5 lg:p-6 flex flex-col justify-between relative group">
          
          {/* Top Badges Row inside Card */}
          {(leftBadgeText || rightBadgeText) && (
            <div className={`flex items-center ${leftBadgeText ? 'justify-between' : 'justify-end'} gap-2 mb-3 sm:mb-4 px-0.5`}>
              {leftBadgeText ? (
                <span className="bg-[#EA580C] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                  {leftBadgeText}
                </span>
              ) : null}

              {rightBadgeText ? (
                <span className="bg-white border border-stone-200 text-slate-700 font-bold text-[11px] sm:text-xs px-3 py-1 rounded-full shadow-2xs">
                  {rightBadgeText}
                </span>
              ) : null}
            </div>
          )}

          {/* Main Visual Image Viewport */}
          <div
            onClick={() => {
              if (onOpenPreview) {
                onOpenPreview(activeItem.samplePageIndex ?? 0);
              }
            }}
            className="w-full aspect-[3/4] max-h-[380px] sm:max-h-[440px] flex items-center justify-center overflow-hidden rounded-2xl bg-[#FFFDF9] cursor-pointer relative group/img transition-transform duration-300"
          >
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="w-full h-full object-contain p-2 rounded-xl group-hover/img:scale-102 transition-transform duration-300 drop-shadow-md"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Click to Full Preview</span>
              </span>
            </div>
          </div>

          {/* Card Bottom Meta & Quick Preview Trigger */}
          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span className="truncate pr-2 font-semibold text-slate-700">
              {activeItem.title}
            </span>
            <button
              type="button"
              onClick={() => {
                if (onOpenPreview) {
                  onOpenPreview(activeItem.samplePageIndex ?? 0);
                }
              }}
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-bold shrink-0 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Inside</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

