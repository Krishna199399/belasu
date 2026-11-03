'use client';

import React, { useEffect, useRef } from 'react';
import { Lock, X, LayoutGrid } from 'lucide-react';
import { DigitalBook } from '@/types';

interface ReaderSidebarProps {
  book: DigitalBook;
  currentPage: number;
  isOwned: boolean;
  freePreviewPages: number;
  darkMode?: boolean;
  onPageJump: (page: number) => void;
  onClose?: () => void;
}

export function ReaderSidebar({
  book,
  currentPage,
  isOwned,
  freePreviewPages,
  darkMode = false,
  onPageJump,
  onClose,
}: ReaderSidebarProps) {
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null);

  const handleJump = (p: number) => {
    onPageJump(p);
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  // Auto-scroll active thumbnail into view when current page changes or sidebar opens
  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentPage]);

  const totalPages = book.totalPages || 1;

  return (
    <aside
      className={`w-72 sm:w-80 flex flex-col h-full overflow-hidden shadow-2xl transition-colors duration-200 select-none ${
        darkMode
          ? 'bg-slate-900 border-r border-slate-800 text-white'
          : 'bg-[#FAF8F5] border-r border-stone-200 text-slate-900'
      }`}
    >
      {/* ── Header: Book Title & Progress ── */}
      <div className={`p-4 border-b ${darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-stone-200 bg-white/70'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-12 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
              📖
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-black leading-snug line-clamp-2">
                {book.title}
              </h2>
              <p className={`text-[10px] mt-0.5 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Class {book.gradeClass} · {book.subject}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-stone-200'
              }`}
              aria-label="Close thumbnails sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Reading Progress Indicator */}
        <div className="mt-3.5 space-y-1.5">
          <div className={`flex justify-between text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Reading Progress</span>
            <span>{Math.round((currentPage / totalPages) * 100)}%</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-stone-200'}`}>
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (currentPage / totalPages) * 100)}%` }}
            />
          </div>
          <div className={`flex items-center justify-between text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Page {currentPage} of {totalPages}</span>
            {!isOwned && (
              <span className="text-amber-600 font-bold">
                Preview: {freePreviewPages} pages free
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Subheader Title ── */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
        darkMode ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-stone-200 bg-stone-100/60 text-slate-600'
      }`}>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
          <span>Page Thumbnails</span>
        </div>
        <span className="text-[11px] font-mono font-bold">
          {totalPages} Pages
        </span>
      </div>

      {/* ── Visual Page Thumbnails Grid ── */}
      <div className="flex-1 overflow-y-auto p-3 touch-scroll">
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => {
            const isLocked = !isOwned && p > freePreviewPages;
            const isActive = currentPage === p;

            return (
              <button
                key={`thumb-${p}`}
                ref={isActive ? activeThumbnailRef : undefined}
                type="button"
                onClick={() => !isLocked && handleJump(p)}
                disabled={isLocked}
                className={`relative rounded-xl p-2 transition-all flex flex-col items-center justify-between aspect-[3/4] cursor-pointer text-center group ${
                  isActive
                    ? 'border-2 border-amber-500 ring-2 ring-amber-400/40 shadow-md scale-102 bg-white'
                    : isLocked
                    ? darkMode
                      ? 'border border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
                      : 'border border-stone-200 bg-stone-100/60 opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'border border-slate-800 bg-slate-800/80 hover:border-slate-700 hover:bg-slate-800 shadow-2xs'
                    : 'border border-stone-200 bg-white hover:border-amber-400 hover:shadow-xs'
                }`}
                aria-label={`Jump to page ${p}`}
              >
                {/* Simulated miniature book page sheet */}
                <div className="w-full flex-1 flex flex-col justify-between py-1 px-1.5 pointer-events-none">
                  <div className="space-y-1">
                    <div className={`h-1.5 w-1/3 rounded-full mx-auto ${
                      darkMode ? 'bg-slate-700' : 'bg-stone-200'
                    }`} />
                    <div className={`h-1 w-full rounded-full ${
                      darkMode ? 'bg-slate-700/60' : 'bg-stone-100'
                    }`} />
                    <div className={`h-1 w-5/6 rounded-full ${
                      darkMode ? 'bg-slate-700/60' : 'bg-stone-100'
                    }`} />
                    <div className={`h-1 w-4/6 rounded-full ${
                      darkMode ? 'bg-slate-700/60' : 'bg-stone-100'
                    }`} />
                  </div>

                  {/* Center icon or lock */}
                  <div className="flex items-center justify-center py-2">
                    {isLocked ? (
                      <div className="flex flex-col items-center gap-0.5 text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold">Locked</span>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-mono font-bold ${
                        isActive ? 'text-amber-600' : darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        p. {p}
                      </span>
                    )}
                  </div>

                  <div className={`h-1 w-1/2 rounded-full mx-auto ${
                    darkMode ? 'bg-slate-700/40' : 'bg-stone-200'
                  }`} />
                </div>

                {/* Bottom Page Badge */}
                <div className={`w-full py-1 text-[10px] font-bold rounded-md ${
                  isActive
                    ? 'bg-amber-500 text-slate-950'
                    : darkMode
                    ? 'bg-slate-900 text-slate-300'
                    : 'bg-stone-100 text-slate-700'
                }`}>
                  Page {p}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
