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
    <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center gap-2 px-3 flex-shrink-0 select-none">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
        title={sidebarOpen ? 'Hide contents' : 'Show contents'}
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      <div className="h-5 w-px bg-slate-700" />

      {/* Home */}
      <Link href="/library" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition" title="My Library">
        <Home className="w-4 h-4" />
      </Link>

      <div className="h-5 w-px bg-slate-700" />

      {/* Book title (hidden on small) */}
      <span className="text-xs text-slate-400 hidden sm:block truncate max-w-[180px]">{bookTitle}</span>

      {/* Navigation */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
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
            className="w-12 text-center bg-slate-800 border border-slate-700 text-white text-xs rounded-lg py-1 focus:outline-none focus:border-amber-500"
          />
          <span className="text-xs text-slate-500">/ {totalPages}</span>
        </div>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="h-5 w-px bg-slate-700" />

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <button onClick={onZoomOut} disabled={zoom <= 0.6} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs text-slate-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={onZoomIn} disabled={zoom >= 2} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-5 w-px bg-slate-700" />

      {/* Dark mode */}
      <button
        onClick={onToggleDark}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
        title="Toggle reading mode"
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
