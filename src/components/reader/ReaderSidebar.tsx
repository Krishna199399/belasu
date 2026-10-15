'use client';

import { BookOpen, Lock } from 'lucide-react';
import { DigitalBook } from '@/types';

interface ReaderSidebarProps {
  book: DigitalBook;
  currentPage: number;
  isOwned: boolean;
  freePreviewPages: number;
  onPageJump: (page: number) => void;
}

export function ReaderSidebar({ book, currentPage, isOwned, freePreviewPages, onPageJump }: ReaderSidebarProps) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Book info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">📖</div>
          <div>
            <h2 className="text-xs font-black text-white leading-tight line-clamp-2">{book.title}</h2>
            <p className="text-[10px] text-slate-400 mt-1">Class {book.gradeClass} · {book.subject}</p>
          </div>
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

      {/* Table of Contents */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 mb-2">Table of Contents</p>
        <nav className="space-y-0.5">
          {book.tableOfContents.map((ch, i) => {
            const isLocked = !isOwned && i >= freePreviewPages;
            const isActive = currentPage >= ch.startPage && (i === book.tableOfContents.length - 1 || currentPage < book.tableOfContents[i + 1].startPage);
            return (
              <button
                key={i}
                onClick={() => !isLocked && onPageJump(ch.startPage)}
                disabled={isLocked}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-[11px] transition group ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : isLocked
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                <span className="flex-1 line-clamp-1">{ch.chapter}</span>
                {isLocked && <Lock className="w-3 h-3 flex-shrink-0 opacity-50" />}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
