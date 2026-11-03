'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface ReaderToolbarProps {
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  darkMode: boolean;
  sidebarOpen: boolean;
  viewMode?: 'single' | 'double';
  bookSlug?: string;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
  onToggleViewMode?: () => void;
  onPageInput: (page: number) => void;
}

export function ReaderToolbar({
  bookTitle,
  currentPage,
  totalPages,
  zoom,
  darkMode,
  sidebarOpen,
  viewMode = 'single',
  bookSlug,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onToggleDark,
  onToggleSidebar,
  onToggleViewMode,
  onPageInput,
}: ReaderToolbarProps) {
  const backHref = bookSlug
    ? bookSlug.includes('savi')
      ? `/books/${bookSlug.replace('-digital', '')}`
      : `/digital/${bookSlug}`
    : '/digital';

  return (
    <header
      className={`h-14 sm:h-13 border-b flex items-center justify-between gap-1 sm:gap-3 px-3 sm:px-4 flex-shrink-0 select-none z-30 transition-colors duration-200 ${
        darkMode
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white/95 border-stone-200 text-slate-900 backdrop-blur-md shadow-2xs'
      }`}
    >
      {/* ── Left Section: Exit, Sidebar Toggle & Title ── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        {/* Back link */}
        <Link
          href={backHref}
          className={`h-9 px-2 sm:px-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            darkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100'
          }`}
          title="Exit Reader"
          aria-label="Exit Reader"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Exit</span>
        </Link>

        <div className={`h-4 w-px ${darkMode ? 'bg-slate-800' : 'bg-stone-200'}`} />

        {/* Contents Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`h-9 px-2.5 sm:px-3 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            sidebarOpen
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : darkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-800'
              : 'text-slate-700 hover:text-slate-950 hover:bg-stone-100'
          }`}
          title={sidebarOpen ? 'Close Contents' : 'Open Contents & Thumbnails'}
          aria-label={sidebarOpen ? 'Close Contents' : 'Open Contents & Thumbnails'}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span className="hidden md:inline">Contents</span>
        </button>

        {/* Book Title */}
        <span className={`text-xs font-serif font-black hidden lg:block truncate max-w-[200px] xl:max-w-[320px] ${
          darkMode ? 'text-slate-300' : 'text-slate-800'
        }`} title={bookTitle}>
          {bookTitle}
        </span>
      </div>

      {/* ── Center Section: Page Navigation Controls ── */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage <= 1}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            darkMode
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-stone-100 hover:text-slate-950 border border-stone-200 shadow-2xs'
          }`}
          aria-label="Previous Page"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={currentPage}
            min={1}
            max={totalPages}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= totalPages) onPageInput(v);
            }}
            className={`w-11 sm:w-13 text-center text-xs font-mono font-bold rounded-lg py-1 px-1 focus:outline-none transition ${
              darkMode
                ? 'bg-slate-800 border border-slate-700 text-white focus:border-amber-500'
                : 'bg-stone-50 border border-stone-300 text-slate-900 focus:border-amber-500 focus:bg-white'
            }`}
            aria-label="Current page number"
          />
          <span className={`text-xs font-mono font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            / {totalPages}
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            darkMode
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-stone-100 hover:text-slate-950 border border-stone-200 shadow-2xs'
          }`}
          aria-label="Next Page"
          title="Next Page (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Right Section: Spread Mode, Zoom & Theme ── */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Two-Page Spread vs Single-Page Toggle (Desktop) */}
        {onToggleViewMode && (
          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={onToggleViewMode}
              className={`h-9 px-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'double'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                  : darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
              title={viewMode === 'double' ? 'Switch to Single Page' : 'Switch to Two-Page Book Spread'}
              aria-label="Toggle Page Spread"
            >
              {viewMode === 'double' ? (
                <>
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>2 Pages</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>1 Page</span>
                </>
              )}
            </button>
            <div className={`h-4 w-px mx-1.5 ${darkMode ? 'bg-slate-800' : 'bg-stone-200'}`} />
          </div>
        )}

        {/* Zoom Controls (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={onZoomOut}
            disabled={zoom <= 0.7}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition cursor-pointer disabled:opacity-30 ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100'
            }`}
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className={`text-[11px] font-mono font-bold w-9 text-center ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            disabled={zoom >= 1.8}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition cursor-pointer disabled:opacity-30 ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-950 hover:bg-stone-100'
            }`}
            aria-label="Zoom in"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className={`h-4 w-px mx-1 ${darkMode ? 'bg-slate-800' : 'bg-stone-200'}`} />
        </div>

        {/* Theme Toggle (Warm Paper vs Dark Mode) */}
        <button
          type="button"
          onClick={onToggleDark}
          className={`h-9 px-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
            darkMode
              ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border border-stone-200'
          }`}
          title={darkMode ? 'Switch to Warm Paper Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Paper</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
