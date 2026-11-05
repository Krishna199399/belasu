'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DigitalBook } from '@/types';
import { X, Printer, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PrintBookModalProps {
  book: DigitalBook | null;
  isOpen: boolean;
  onClose: () => void;
}

type PrintMode = 'all' | 'first20' | 'custom';

interface LoadedPage {
  pageNum: number;
  url: string;
}

export function PrintBookModal({ book, isOpen, onClose }: PrintBookModalProps) {
  const [printMode, setPrintMode] = useState<PrintMode>('first20');
  const [customStart, setCustomStart] = useState<number>(1);
  const [customEnd, setCustomEnd] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (book) {
      setCustomStart(1);
      setCustomEnd(Math.min(10, book.totalPages));
      setIsLoading(false);
      setProgress({ current: 0, total: 0 });
      isCancelledRef.current = false;
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const totalPages = book.totalPages || 100;

  const getTargetPages = (): number[] => {
    let start = 1;
    let end = totalPages;

    if (printMode === 'first20') {
      start = 1;
      end = Math.min(20, totalPages);
    } else if (printMode === 'custom') {
      start = Math.max(1, Math.min(customStart || 1, totalPages));
      end = Math.max(start, Math.min(customEnd || totalPages, totalPages));
    }

    const pages: number[] = [];
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  };

  const handleStartPrint = async () => {
    const targetPageNums = getTargetPages();
    if (!targetPageNums.length) {
      toast.error('Please select a valid page range');
      return;
    }

    setIsLoading(true);
    setProgress({ current: 0, total: targetPageNums.length });
    isCancelledRef.current = false;

    const loaded: LoadedPage[] = [];

    try {
      // Fetch signed URLs and preload images in batches of 4 for speed and reliability
      const BATCH_SIZE = 4;
      for (let i = 0; i < targetPageNums.length; i += BATCH_SIZE) {
        if (isCancelledRef.current) break;

        const batch = targetPageNums.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (pageNum) => {
            try {
              const res = await fetch(`/api/reader/page?bookId=${book.id}&page=${pageNum}&preview=false`);
              const data = await res.json();
              if (data.url) {
                // Preload image to guarantee no blank prints
                await new Promise<void>((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                  img.src = data.url;
                });
                return { pageNum, url: data.url };
              }
              return null;
            } catch {
              return null;
            }
          })
        );

        for (const item of results) {
          if (item) loaded.push(item);
        }

        setProgress({
          current: Math.min(i + batch.length, targetPageNums.length),
          total: targetPageNums.length,
        });
      }

      if (isCancelledRef.current) {
        setIsLoading(false);
        return;
      }

      if (!loaded.length) {
        toast.error('Unable to load pages for printing. Please try again.');
        setIsLoading(false);
        return;
      }

      // Use isolated iframe engine — prevents Next.js DOM from interfering with print
      printViaIframe(loaded);
    } catch (err) {
      console.error('Print preparation error:', err);
      toast.error('Failed to prepare print');
      setIsLoading(false);
    }
  };

  // Isolated iframe print engine — the Next.js app DOM never interferes
  const printViaIframe = (pages: LoadedPage[]) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:0;border:0;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow!.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 portrait; margin: 8mm; }
        html, body { background: white; width: 100%; }
        .ps {
          page-break-after: always;
          break-after: page;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .ps:last-child { page-break-after: auto; break-after: auto; }
        .ps img {
          max-width: 100%;
          max-height: 100vh;
          object-fit: contain;
          display: block;
        }
      </style>
    </head><body>
      ${pages
        .map(
          (p) =>
            `<div class="ps"><img src="${p.url}" alt="Page ${p.pageNum}" /></div>`
        )
        .join('')}
    </body></html>`);
    doc.close();

    // Reset modal state immediately so user is unblocked — iframe prints independently
    setIsLoading(false);
    onClose();

    // Wait for images to fully render inside the iframe before printing
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
      }, 300);
    };

    // Clean up iframe after print dialog closes (or after 5 min safety fallback)
    const cleanup = () => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    // Safety fallback: remove iframe after 5 min if afterprint never fires
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 300_000);
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    setIsLoading(false);
    onClose();
  };

  const selectedCount = getTargetPages().length;

  return (
    <>
      {/* ── Screen Modal UI ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs print:hidden animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-stone-100 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                  Print Book Pages
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {book.title}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Range Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Pages to Print
              </label>

              {/* Option 1: Quick 20 */}
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  printMode === 'first20'
                    ? 'border-amber-400 bg-amber-50/60 text-slate-900'
                    : 'border-stone-200 hover:bg-stone-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="printMode"
                    value="first20"
                    checked={printMode === 'first20'}
                    onChange={() => setPrintMode('first20')}
                    disabled={isLoading}
                    className="accent-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold block">First 20 Pages</span>
                    <span className="text-[11px] text-slate-500">Pages 1 to {Math.min(20, totalPages)}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-stone-200">
                  {Math.min(20, totalPages)} sheets
                </span>
              </label>

              {/* Option 2: Custom Range */}
              <label
                className={`block p-3 rounded-xl border cursor-pointer transition ${
                  printMode === 'custom'
                    ? 'border-amber-400 bg-amber-50/60 text-slate-900'
                    : 'border-stone-200 hover:bg-stone-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="printMode"
                    value="custom"
                    checked={printMode === 'custom'}
                    onChange={() => setPrintMode('custom')}
                    disabled={isLoading}
                    className="accent-amber-500"
                  />
                  <span className="text-xs font-bold">Custom Page Range</span>
                </div>

                {printMode === 'custom' && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center gap-2 pl-6">
                    <span className="text-xs text-slate-600">From</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={customStart}
                      disabled={isLoading}
                      onChange={(e) => setCustomStart(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 text-xs text-center font-bold bg-white border border-stone-300 rounded-lg focus:outline-amber-500"
                    />
                    <span className="text-xs text-slate-600">to</span>
                    <input
                      type="number"
                      min={customStart}
                      max={totalPages}
                      value={customEnd}
                      disabled={isLoading}
                      onChange={(e) => setCustomEnd(Math.min(totalPages, parseInt(e.target.value) || totalPages))}
                      className="w-16 px-2 py-1 text-xs text-center font-bold bg-white border border-stone-300 rounded-lg focus:outline-amber-500"
                    />
                    <span className="text-[11px] text-slate-500">(Max {totalPages})</span>
                  </div>
                )}
              </label>

              {/* Option 3: All Pages */}
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  printMode === 'all'
                    ? 'border-amber-400 bg-amber-50/60 text-slate-900'
                    : 'border-stone-200 hover:bg-stone-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="printMode"
                    value="all"
                    checked={printMode === 'all'}
                    onChange={() => setPrintMode('all')}
                    disabled={isLoading}
                    className="accent-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold block">Complete Book</span>
                    <span className="text-[11px] text-slate-500">All {totalPages} pages</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-stone-200">
                  {totalPages} sheets
                </span>
              </label>
            </div>

            {/* Loading / Progress State */}
            {isLoading && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Preparing pages for print...</span>
                  </div>
                  <span>
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-200"
                    style={{
                      width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Pre-buffering high-resolution images so no pages come out blank.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-stone-200/60 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleStartPrint}
              disabled={isLoading || selectedCount <= 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading ({progress.current}/{progress.total})...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Print ({selectedCount} Pages)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </>
  );
}

