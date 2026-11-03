'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DigitalBook } from '@/types';
import { ReaderSidebar } from './ReaderSidebar';
import { ReaderToolbar } from './ReaderToolbar';
import { SecurePageCanvas } from './SecurePageCanvas';
import { Lock, ShieldAlert, ChevronLeft, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SecureBookReaderProps {
  book: DigitalBook;
  userPhone: string;
  isOwned: boolean;
  initialPage?: number;
}

const PROGRESS_SAVE_DEBOUNCE_MS = 3000;

export function SecureBookReader({ book, userPhone, isOwned, initialPage = 1 }: SecureBookReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null);
  const [secondPageImageUrl, setSecondPageImageUrl] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isScreenshotBlocked, setIsScreenshotBlocked] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false); // Default: Warm Paper Mode (#F8F6F2)
  const [viewMode, setViewMode] = useState<'single' | 'double'>('single');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedPageRef = useRef(initialPage);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const maxPage = isOwned ? book.totalPages : book.isFreePreviewPages;

  // Handle responsive view mode: disable double mode on mobile / tablet screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && viewMode === 'double') {
        setViewMode('single');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(clamped);
  }, [maxPage]);

  const handlePrev = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    goToPage(currentPage - step);
  }, [currentPage, viewMode, goToPage]);

  const handleNext = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    goToPage(currentPage + step);
  }, [currentPage, viewMode, goToPage]);

  // ── Touch swipe navigation & Mobile 3-Finger Screenshot Blocker ───────────
  const handleTouchStart = (e: React.TouchEvent) => {
    // Intercept 3-finger swipe screenshot (Android MIUI / ColorOS / OxygenOS / Realme / OneUI)
    if (e.touches.length >= 3) {
      e.preventDefault();
      triggerScreenshotProtection();
      return;
    }
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Continuous multi-touch detection during swipe
    if (e.touches.length >= 3) {
      e.preventDefault();
      triggerScreenshotProtection();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // ── Anti-Screenshot Emergency Blackout & Clipboard Scrambler ─────────────
  const triggerScreenshotProtection = useCallback(() => {
    setIsScreenshotBlocked(true);

    // Immediately scramble system clipboard if user pressed PrintScreen
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(
          `[PROTECTED CONTENT] Belesu Digital Guidebook — Screenshots and unauthorized copying are strictly prohibited. Registered account: ${userPhone}`
        );
      }
    } catch {
      // Ignore clipboard permission blocks
    }

    toast.error('Screenshots and screen capture are strictly prohibited.', {
      id: 'drm-screenshot-alert',
      duration: 3500,
    });

    setTimeout(() => {
      setIsScreenshotBlocked(false);
    }, 2000);
  }, [userPhone]);

  // ── Keyboard Navigation & Anti-Screenshot Hotkey Interceptors ─────────────
  useEffect(() => {
    const handleKeyEvents = (e: KeyboardEvent) => {
      // Allow navigation arrows
      if (e.key === 'ArrowLeft') {
        handlePrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNext();
        return;
      }

      // Detect PrintScreen or Snipping Tool shortcuts (Win+Shift+S, Cmd+Shift+3/4)
      if (
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 's' || e.code === 'KeyS'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotProtection();
        return;
      }

      // DRM: Block shortcuts for copy, print, save, devtools, inspect
      const blocked = [
        (e.ctrlKey || e.metaKey) && ['s', 'p', 'u', 'a', 'c', 'v'].includes(e.key.toLowerCase()),
        e.key === 'F12',
        e.key === 'F11',
      ];
      if (blocked.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
          triggerScreenshotProtection();
        }
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData(
          'text/plain',
          `[PROTECTED CONTENT] Belesu Digital Guidebook. Content copying is disabled. Account: ${userPhone}`
        );
      }
      triggerScreenshotProtection();
    };

    window.addEventListener('keydown', handleKeyEvents, true);
    window.addEventListener('keyup', handleKeyEvents, true);
    window.addEventListener('copy', handleCopy, true);

    return () => {
      window.removeEventListener('keydown', handleKeyEvents, true);
      window.removeEventListener('keyup', handleKeyEvents, true);
      window.removeEventListener('copy', handleCopy, true);
    };
  }, [handlePrev, handleNext, triggerScreenshotProtection, userPhone]);

  // ── DRM: Complete Opaque Blackout on Window Blur (Snipping Tool & Alt-Tab) ─
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) setIsBlurred(true);
    };
    const handleFocus = () => setIsBlurred(false);
    const handleBlur = () => setIsBlurred(true);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // ── DRM: DevTools detection via window resize trick ──────────────────────
  useEffect(() => {
    const THRESHOLD = 160;
    const check = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      setDevToolsDetected(widthDiff > THRESHOLD || heightDiff > THRESHOLD);
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── DRM: Disable right-click ──────────────────────────────────────────────
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', block);
    return () => document.removeEventListener('contextmenu', block);
  }, []);

  // ── Mobile Touch DRM: Intercept multi-finger gestures & long-press callouts ─
  useEffect(() => {
    const handleWindowTouch = (e: TouchEvent) => {
      // 3 or more touch points triggers multi-finger screenshot on Android
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        triggerScreenshotProtection();
      }
    };

    window.addEventListener('touchstart', handleWindowTouch, { passive: false });
    window.addEventListener('touchmove', handleWindowTouch, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleWindowTouch);
      window.removeEventListener('touchmove', handleWindowTouch);
    };
  }, [triggerScreenshotProtection]);

  // ── Lock down canvas export methods (toDataURL / toBlob) against scraper extensions ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const origToBlob = HTMLCanvasElement.prototype.toBlob;

    HTMLCanvasElement.prototype.toDataURL = function () {
      return 'data:image/png;base64,';
    };
    HTMLCanvasElement.prototype.toBlob = function (callback: BlobCallback) {
      callback(new Blob([], { type: 'image/png' }));
    };

    return () => {
      HTMLCanvasElement.prototype.toDataURL = origToDataURL;
      HTMLCanvasElement.prototype.toBlob = origToBlob;
    };
  }, []);

  // ── Fetch signed page image URL ───────────────────────────────────────────
  const fetchPage = useCallback(async (page: number) => {
    setIsPageLoading(true);
    setPageImageUrl(null);
    setSecondPageImageUrl(null);
    try {
      const isPreview = !isOwned;
      const res = await fetch(`/api/reader/page?bookId=${book.id}&page=${page}&preview=${isPreview}`);
      const data = await res.json();
      if (data.isDemoMode) {
        setIsDemoMode(true);
        setPageImageUrl(null);
      } else if (data.url) {
        setIsDemoMode(false);
        setPageImageUrl(data.url);
      }

      // If in double page mode, fetch the adjacent page
      if (viewMode === 'double' && page + 1 <= maxPage) {
        const res2 = await fetch(`/api/reader/page?bookId=${book.id}&page=${page + 1}&preview=${isPreview}`);
        const data2 = await res2.json();
        if (data2.url) {
          setSecondPageImageUrl(data2.url);
        }
      }
    } catch {
      console.error('Failed to load page');
    } finally {
      setIsPageLoading(false);
    }
  }, [book.id, isOwned, viewMode, maxPage]);

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage, fetchPage]);

  // ── Load initial reading progress ─────────────────────────────────────────
  useEffect(() => {
    if (!isOwned) return;
    fetch(`/api/reader/progress?bookId=${book.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.lastPage && d.lastPage !== currentPage) {
          setCurrentPage(d.lastPage);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save reading progress (debounced) ────────────────────────────────────
  useEffect(() => {
    if (!isOwned || currentPage === lastSavedPageRef.current) return;
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    progressTimerRef.current = setTimeout(async () => {
      await fetch('/api/reader/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, page: currentPage }),
      });
      lastSavedPageRef.current = currentPage;
    }, PROGRESS_SAVE_DEBOUNCE_MS);
    return () => { if (progressTimerRef.current) clearTimeout(progressTimerRef.current); };
  }, [currentPage, isOwned, book.id]);

  const isLastFreePageReached = !isOwned && currentPage >= book.isFreePreviewPages;

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden transition-colors duration-200 drm-protected-container select-none ${
        darkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8F6F2] text-slate-900'
      }`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      } as React.CSSProperties}
    >
      {/* ── Top Header Toolbar ── */}
      <ReaderToolbar
        bookTitle={book.title}
        bookSlug={book.slug}
        currentPage={currentPage}
        totalPages={maxPage}
        zoom={zoom}
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 1.8))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.7))}
        onToggleDark={() => setDarkMode((d) => !d)}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onToggleViewMode={() => setViewMode((m) => (m === 'single' ? 'double' : 'single'))}
        onPageInput={goToPage}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile / Tablet Drawer Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: Slide-over on mobile/tablet, collapsible column on desktop */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 z-40 transition-transform duration-300 h-full ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
          }`}
        >
          <ReaderSidebar
            book={book}
            currentPage={currentPage}
            isOwned={isOwned}
            darkMode={darkMode}
            freePreviewPages={book.isFreePreviewPages}
            onPageJump={goToPage}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* ── Main Book Reading Viewport ── */}
        <main
          className="flex-1 overflow-auto flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 relative touch-scroll drm-protected-container select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* DevTools Security Overlay */}
          {devToolsDetected && (
            <div className="absolute inset-0 bg-[#0B0F17] z-50 flex items-center justify-center p-4 select-none">
              <div className="text-center space-y-4">
                <ShieldAlert className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 mx-auto" />
                <h3 className="text-white font-black text-lg sm:text-xl">Developer Tools Detected</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
                  Please close developer tools to continue reading. This academic content is protected.
                </p>
              </div>
            </div>
          )}

          {/* Screenshot Intercept Alert Overlay */}
          {isScreenshotBlocked && (
            <div className="absolute inset-0 bg-[#0B0F17] z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
              <div className="text-center space-y-3 bg-rose-950/60 border border-rose-500/40 p-6 sm:p-8 rounded-3xl max-w-md shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-white font-black text-lg">⚠️ Screenshot Blocked</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Screenshots and screen capture are strictly prohibited. Your registered account details (<span className="font-mono text-amber-400 font-bold">{userPhone}</span>) are permanently watermarked on this reader session.
                </p>
              </div>
            </div>
          )}

          {/* 100% Solid Opaque Blackout Overlay on Window Blur (Snipping Tool & Background Tabs) */}
          {isBlurred && !devToolsDetected && !isScreenshotBlocked && (
            <div
              className="absolute inset-0 bg-[#0B0F17] z-40 flex items-center justify-center cursor-pointer p-4 select-none"
              onClick={() => setIsBlurred(false)}
            >
              <div className="text-center space-y-3 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-base">Reading Paused</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Page content is concealed while window is unfocused to protect copyright.
                </p>
                <button
                  type="button"
                  onClick={() => setIsBlurred(false)}
                  className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  Click to Resume Reading
                </button>
              </div>
            </div>
          )}

          {/* ── Left Margin Flip Arrow (Desktop) ── */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="hidden md:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all cursor-pointer shadow-md bg-white/90 hover:bg-white text-slate-700 hover:text-amber-600 border border-stone-200 disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* ── Right Margin Flip Arrow (Desktop) ── */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= maxPage}
            aria-label="Next page"
            className="hidden md:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all cursor-pointer shadow-md bg-white/90 hover:bg-white text-slate-700 hover:text-amber-600 border border-stone-200 disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* ── Page Canvas Container ── */}
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}
            className={`w-full mx-auto my-auto flex justify-center items-center pb-6 transition-all ${
              isBlurred || devToolsDetected || isScreenshotBlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } ${viewMode === 'double' ? 'max-w-[1240px]' : 'max-w-[760px]'}`}
          >
            {isPageLoading ? (
              <div
                className={`w-full max-w-[720px] aspect-[1/1.3] rounded-2xl flex items-center justify-center shadow-lg border ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin mx-auto" />
                  <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Loading page {currentPage}...
                  </p>
                </div>
              </div>
            ) : isDemoMode ? (
              /* ── High-Fidelity Paper Preview Sheet (Until PDF is uploaded) ── */
              <div
                className={`w-full rounded-2xl shadow-xl border overflow-hidden transition-all duration-200 ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-stone-200 shadow-stone-300/40'
                } ${viewMode === 'double' ? 'grid grid-cols-2 divide-x divide-stone-200' : 'max-w-[720px]'}`}
                onDragStart={(e) => e.preventDefault()}
              >
                {/* Page Left (Current Page) */}
                <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between min-h-[580px] sm:min-h-[780px] relative overflow-hidden">
                  <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between border-b pb-3 border-stone-200 text-xs text-slate-500">
                      <span className="font-serif font-bold text-slate-800">{book.title}</span>
                      <span className="font-mono font-bold">Page {currentPage}</span>
                    </div>

                    {/* Book Series Badge */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                        Class {book.gradeClass} · {book.subject}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 leading-snug">
                        {book.title}
                      </h3>
                    </div>

                    {/* Notice card */}
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>PDF Conversion Ready</span>
                      </div>
                      <p className="leading-relaxed text-amber-900">
                        When the PDF file is uploaded, crisp high-resolution textbook pages with Kannada script and English translations will display here seamlessly.
                      </p>
                    </div>

                    {/* Sample Page Skeleton Structure */}
                    <div className="space-y-3 pt-2">
                      <div className="h-3 bg-stone-100 rounded-md w-3/4" />
                      <div className="h-2.5 bg-stone-100 rounded-md w-full" />
                      <div className="h-2.5 bg-stone-100 rounded-md w-5/6" />
                      <div className="h-2.5 bg-stone-100 rounded-md w-4/5" />
                      <div className="h-2.5 bg-stone-100 rounded-md w-full" />
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="pt-6 border-t border-stone-200 flex items-center justify-between text-xs text-slate-400">
                    <span>Belesu Academic Karnataka</span>
                    <span>{currentPage}</span>
                  </div>
                </div>

                {/* Page Right (Only in Two-Page Spread Mode) */}
                {viewMode === 'double' && (
                  <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between min-h-[580px] sm:min-h-[780px] bg-stone-50/30 relative overflow-hidden">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-3 border-stone-200 text-xs text-slate-500">
                        <span className="font-mono font-bold">Page {currentPage + 1}</span>
                        <span className="font-serif font-bold text-slate-800">English Translation</span>
                      </div>

                      <div className="space-y-3 pt-4">
                        <div className="h-3 bg-stone-200/70 rounded-md w-1/2" />
                        <div className="h-2.5 bg-stone-100 rounded-md w-full" />
                        <div className="h-2.5 bg-stone-100 rounded-md w-5/6" />
                        <div className="h-2.5 bg-stone-100 rounded-md w-full" />
                        <div className="h-2.5 bg-stone-100 rounded-md w-4/5" />
                        <div className="h-2.5 bg-stone-100 rounded-md w-3/4" />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-stone-200 flex items-center justify-between text-xs text-slate-400">
                      <span>Solved Textbook Questions</span>
                      <span>{currentPage + 1}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : pageImageUrl ? (
              /* ── Real Book Page Image with Anti-Screenshot Decoy Shield & Indelible Watermark ── */
              <div
                className={`w-full rounded-2xl shadow-xl overflow-hidden transition-all duration-200 select-none relative ${
                  viewMode === 'double' && secondPageImageUrl
                    ? 'grid grid-cols-2 divide-x divide-stone-200 bg-white shadow-stone-300/40 border border-stone-200'
                    : 'max-w-[720px] bg-white shadow-stone-300/40 border border-stone-200'
                }`}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toast.error('Downloads and right-click are disabled for protected digital books.');
                }}
              >
                {/* Single / Left Page */}
                <div className="relative overflow-hidden select-none drm-protected-container">
                  <SecurePageCanvas
                    imageUrl={pageImageUrl}
                    pageNumber={currentPage}
                    userPhone={userPhone}
                    darkMode={darkMode}
                  />
                  {/* Transparent Anti-Inspect Decoy Shield */}
                  <div
                    className="absolute inset-0 z-20 cursor-default select-none"
                    style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toast.error('Right-click is disabled on protected digital content.');
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>

                {/* Right Page (Two-Page Spread) */}
                {viewMode === 'double' && secondPageImageUrl && (
                  <div className="relative overflow-hidden select-none drm-protected-container">
                    <SecurePageCanvas
                      imageUrl={secondPageImageUrl}
                      pageNumber={currentPage + 1}
                      userPhone={userPhone}
                      darkMode={darkMode}
                    />
                    {/* Transparent Anti-Inspect Decoy Shield */}
                    <div
                      className="absolute inset-0 z-20 cursor-default select-none"
                      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toast.error('Right-click is disabled on protected digital content.');
                      }}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Preview Boundary Overlay */}
            {isLastFreePageReached && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent rounded-2xl flex items-end justify-center pb-8 sm:pb-12 z-30">
                <div className="text-center space-y-3 sm:space-y-4 px-4 sm:px-8 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-serif font-black text-lg sm:text-xl">
                    Free Preview Reached
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    You have previewed the first {book.isFreePreviewPages} pages. Unlock full lifetime access to read all {book.totalPages} pages.
                  </p>
                  <Link
                    href={`/digital/${book.slug}/purchase`}
                    className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-lg min-h-[44px] cursor-pointer"
                  >
                    <span>Unlock Full Book for ₹{book.price}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Sleek Docked Footer Scrubber (Does not cover page content) ── */}
          <footer
            className={`w-full max-w-4xl mx-auto rounded-2xl px-4 py-2.5 sm:py-3 border flex flex-col sm:flex-row items-center justify-between gap-2.5 select-none shrink-0 transition-colors ${
              darkMode
                ? 'bg-slate-900/95 border-slate-800 text-white'
                : 'bg-white/95 border-stone-200 text-slate-800 shadow-sm'
            }`}
          >
            {/* Book Info Label */}
            <div className="flex items-center gap-2 min-w-0 max-w-full sm:max-w-[280px]">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-xs font-bold truncate text-slate-700">
                {book.title}
              </span>
            </div>

            {/* Slider Scrubber */}
            <div className="flex-1 w-full sm:max-w-xs flex items-center gap-2.5">
              <input
                type="range"
                min={1}
                max={maxPage}
                value={currentPage}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                aria-label="Page slider scrubber"
              />
            </div>

            {/* Page Count Meta */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 shrink-0">
              <span>Page {currentPage} of {maxPage}</span>
              <span className="text-stone-300">|</span>
              <span className="text-amber-600 font-sans">
                {Math.round((currentPage / maxPage) * 100)}%
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
