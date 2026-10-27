'use client';

import { Lock, X } from 'lucide-react';
import { DigitalBook } from '@/types';

interface ReaderSidebarProps {
  book: DigitalBook;
  currentPage: number;
  isOwned: boolean;
  freePreviewPages: number;
  onPageJump: (page: number) => void;
  onClose?: () => void;
}

export function ReaderSidebar({ book, currentPage, isOwned, freePreviewPages, onPageJump, onClose }: ReaderSidebarProps) {
  const handleJump = (p: number) => {
    onPageJump(p);
    if (typeof window !== 'undefined' && window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Book info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">📖</div>
            <div className="min-w-0">
              <h2 className="text-xs font-black text-white leading-tight line-clamp-2">{book.title}</h2>
              <p className="text-[10px] text-slate-400 mt-1">Class {book.gradeClass} · {book.subject}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close contents sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Reading Progress</span>
            <span>{Math.round((currentPage / book.totalPages) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentPage / book.totalPages) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Page {currentPage} of {book.totalPages}</p>
        </div>
      </div>

      {/* PDF Pages Navigator */}
      <div className="flex-1 overflow-y-auto p-3 touch-scroll">
        <div className="flex items-center justify-between px-2 mb-2.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PDF Pages</p>
          <span className="text-[10px] text-slate-500 font-mono font-bold">{book.totalPages} pp</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 px-1 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
          {Array.from({ length: book.totalPages || 1 }, (_, idx) => idx + 1).map((p) => {
            const isLocked = !isOwned && p > freePreviewPages;
            const isActive = currentPage === p;
            return (
              <button
                key={p}
                onClick={() => !isLocked && handleJump(p)}
                disabled={isLocked}
                title={isLocked ? `Page ${p} (Purchase required)` : `Jump to page ${p}`}
                className={`min-h-[44px] py-2 px-1 text-xs font-bold rounded-lg border transition flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                    : isLocked
                    ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>p. {p}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 opacity-60 text-slate-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
