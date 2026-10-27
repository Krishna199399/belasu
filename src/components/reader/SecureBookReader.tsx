'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DigitalBook } from '@/types';
import { PageWatermark } from './PageWatermark';
import { ReaderSidebar } from './ReaderSidebar';
import { ReaderToolbar } from './ReaderToolbar';
import { Lock, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedPageRef = useRef(initialPage);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const maxPage = isOwned ? book.totalPages : book.isFreePreviewPages;

  // On larger screens (desktop), open sidebar by default
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  // ── Touch swipe navigation for mobile readers ─────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goToPage(currentPage + 1);
      } else {
        goToPage(currentPage - 1);
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // ── DRM: Block all keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const blocked = [
        e.key === 'PrintScreen',
        (e.ctrlKey || e.metaKey) && ['s', 'p', 'u', 'a', 'c', 'v'].includes(e.key.toLowerCase()),
        e.key === 'F12',
        e.key === 'F11',
      ];
      if (blocked.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', blockKeys, true);
    return () => window.removeEventListener('keydown', blockKeys, true);
  }, []);

  // ── DRM: Blur page when tab is hidden / screen recording detected ─────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsBlurred(true);
      }
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

  // ── Fetch signed page image URL ───────────────────────────────────────────
  const fetchPage = useCallback(async (page: number) => {
    setIsPageLoading(true);
    setPageImageUrl(null);
    try {
      const isPreview = !isOwned;
      const res = await fetch(
        `/api/reader/page?bookId=${book.id}&page=${page}&preview=${isPreview}`
      );
      const data = await res.json();
      if (data.isDemoMode) {
        setIsDemoMode(true);
        setPageImageUrl(null);
      } else if (data.url) {
        setIsDemoMode(false);
        setPageImageUrl(data.url);
      }
    } catch {
      console.error('Failed to load page');
    } finally {
      setIsPageLoading(false);
    }
  }, [book.id, isOwned]);

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

  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(clamped);
  }, [maxPage]);

  const isLastFreePageReached = !isOwned && currentPage >= book.isFreePreviewPages;

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden ${darkMode ? 'bg-amber-50' : 'bg-slate-950'}`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
    >
      {/* Toolbar */}
      <ReaderToolbar
        bookTitle={book.title}
        currentPage={currentPage}
        totalPages={maxPage}
        zoom={zoom}
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        onPrev={() => goToPage(currentPage - 1)}
        onNext={() => goToPage(currentPage + 1)}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.6))}
        onToggleDark={() => setDarkMode((d) => !d)}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onPageInput={goToPage}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Drawer Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: Drawer on mobile, column on desktop */}
        <div
          className={`fixed md:relative inset-y-0 left-0 z-40 transition-transform duration-300 md:transition-none h-full ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
          }`}
        >
          <ReaderSidebar
            book={book}
            currentPage={currentPage}
            isOwned={isOwned}
            freePreviewPages={book.isFreePreviewPages}
            onPageJump={goToPage}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Reader Area */}
        <main
          className="flex-1 overflow-auto flex items-start justify-center p-2 sm:p-4 md:p-6 relative touch-scroll"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* DevTools Blur Overlay */}
          {devToolsDetected && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
              <div className="text-center space-y-4">
                <ShieldAlert className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 mx-auto" />
                <h3 className="text-white font-black text-lg sm:text-xl">Developer Tools Detected</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">Please close developer tools to continue reading. This content is protected.</p>
              </div>
            </div>
          )}

          {/* Tab Switch Blur */}
          {isBlurred && !devToolsDetected && (
            <div
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-40 flex items-center justify-center cursor-pointer p-4"
              onClick={() => setIsBlurred(false)}
            >
              <div className="text-center space-y-3">
                <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-white font-bold text-sm">Click anywhere to continue reading</p>
              </div>
            </div>
          )}

          {/* Page Content */}
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}
            className="relative w-full max-w-[680px] mx-auto pb-20"
          >
            {isPageLoading ? (
              <div
                className={`w-full max-w-[680px] h-[550px] sm:h-[800px] md:h-[900px] rounded-2xl flex items-center justify-center ${darkMode ? 'bg-amber-100' : 'bg-slate-800'}`}
              >
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin mx-auto" />
                  <p className="text-xs sm:text-sm text-slate-400">Loading page {currentPage}...</p>
                </div>
              </div>
            ) : isDemoMode ? (
              /* Demo Mode — shows placeholder when no book images uploaded yet */
              <div
                className={`w-full max-w-[680px] min-h-[550px] sm:min-h-[800px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col ${darkMode ? 'bg-amber-50' : 'bg-white'}`}
                onDragStart={(e) => e.preventDefault()}
              >
                <PageWatermark userPhone={userPhone} />
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 text-center gap-4 sm:gap-6">
                  <div className="text-5xl sm:text-7xl">📖</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">{book.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">Page {currentPage} of {book.totalPages}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-amber-800 text-left max-w-sm">
                    <p className="font-black mb-1.5">📚 Demo Mode</p>
                    <p>Book pages will appear here once uploaded to Supabase Storage. The reader and all DRM protections are fully active.</p>
                  </div>
                  {/* Demo page content */}
                  <div className="w-full border border-slate-200 rounded-xl p-4 sm:p-6 text-left space-y-3">
                    <h4 className="font-black text-slate-800 text-xs sm:text-sm">{book.tableOfContents.find((ch, i) =>
                      currentPage >= ch.startPage && (i === book.tableOfContents.length - 1 || currentPage < book.tableOfContents[i + 1].startPage)
                    )?.chapter || `Page ${currentPage}`}</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`h-2.5 sm:h-3 rounded-full bg-slate-200 ${i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-full' : 'w-5/6'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : pageImageUrl ? (
              /* Real Page Image from Supabase */
              <div
                className={`relative rounded-2xl shadow-2xl overflow-hidden w-full max-w-[680px] ${darkMode ? 'bg-amber-50' : 'bg-white'}`}
                onDragStart={(e) => e.preventDefault()}
              >
                <PageWatermark userPhone={userPhone} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pageImageUrl}
                  alt={`Page ${currentPage}`}
                  draggable={false}
                  className="w-full max-w-[680px] block"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}
                />
              </div>
            ) : null}

            {/* Purchase prompt at preview boundary */}
            {isLastFreePageReached && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent rounded-2xl flex items-end justify-center pb-8 sm:pb-12">
                <div className="text-center space-y-3 sm:space-y-4 px-4 sm:px-8">
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mx-auto" />
                  <h3 className="text-white font-black text-base sm:text-lg">Free Preview Ended</h3>
                  <p className="text-slate-300 text-xs sm:text-sm">Purchase this book to read all {book.totalPages} pages</p>
                  <Link
                    href={`/digital/${book.slug}/purchase`}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm transition min-h-[44px]"
                  >
                    Buy for ₹{book.price} — Unlock All Pages
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Bottom page nav (mobile friendly) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-xl pb-safe z-20">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white text-xs sm:text-sm font-bold font-mono px-1">{currentPage} / {maxPage}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= maxPage}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
