'use client';

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Sun, Moon, Menu, X, Home } from 'lucide-react';
import Link from 'next/link';

interface ReaderToolbarProps {
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  darkMode: boolean;
  sidebarOpen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
  onPageInput: (page: number) => void;
}

export function ReaderToolbar({
  bookTitle, currentPage, totalPages, zoom, darkMode, sidebarOpen,
  onPrev, onNext, onZoomIn, onZoomOut, onToggleDark, onToggleSidebar, onPageInput,
}: ReaderToolbarProps) {
  return (
    <div className="h-14 sm:h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-1 sm:gap-2 px-2 sm:px-3 flex-shrink-0 select-none">
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          title={sidebarOpen ? 'Hide contents' : 'Show contents'}
          aria-label={sidebarOpen ? 'Hide contents' : 'Show contents'}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="h-5 w-px bg-slate-700 hidden xs:block" />

        {/* Home */}
        <Link
          href="/library"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          title="My Library"
          aria-label="My Library"
        >
          <Home className="w-4 h-4" />
        </Link>

        <div className="h-5 w-px bg-slate-700 hidden sm:block" />

        {/* Book title (hidden on small) */}
        <span className="text-xs text-slate-400 hidden sm:block truncate max-w-[160px] md:max-w-[220px]">
          {bookTitle}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="min-w-[36px] min-h-[36px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          <input
            type="number"
            value={currentPage}
            min={1}
            max={totalPages}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= totalPages) onPageInput(v);
            }}
            className="w-11 sm:w-12 text-center bg-slate-800 border border-slate-700 text-white text-xs rounded-lg py-1.5 focus:outline-none focus:border-amber-500 font-mono"
            aria-label="Current page number"
          />
          <span className="text-[11px] sm:text-xs text-slate-500 font-mono">/ {totalPages}</span>
        </div>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="min-w-[36px] min-h-[36px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom (desktop & tablet) + Dark Mode */}
      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-1 mr-1">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.6}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition cursor-pointer"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-slate-400 w-9 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 2}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition cursor-pointer"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="h-5 w-px bg-slate-700 mx-1" />
        </div>

        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          title="Toggle reading mode"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
