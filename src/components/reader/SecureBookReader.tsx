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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedPageRef = useRef(initialPage);

  const maxPage = isOwned ? book.totalPages : book.isFreePreviewPages;

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
        {/* Sidebar */}
        {sidebarOpen && (
          <ReaderSidebar
            book={book}
            currentPage={currentPage}
            isOwned={isOwned}
            freePreviewPages={book.isFreePreviewPages}
            onPageJump={goToPage}
          />
        )}

        {/* Reader Area */}
        <main className="flex-1 overflow-auto flex items-start justify-center p-6 relative">
          {/* DevTools Blur Overlay */}
          {devToolsDetected && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShieldAlert className="w-14 h-14 text-amber-400 mx-auto" />
                <h3 className="text-white font-black text-xl">Developer Tools Detected</h3>
                <p className="text-slate-400 text-sm max-w-xs">Please close developer tools to continue reading. This content is protected.</p>
              </div>
            </div>
          )}

          {/* Tab Switch Blur */}
          {isBlurred && !devToolsDetected && (
            <div
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-40 flex items-center justify-center cursor-pointer"
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
            className="relative"
          >
            {isPageLoading ? (
              <div
                className={`w-[680px] h-[900px] rounded-2xl flex items-center justify-center ${darkMode ? 'bg-amber-100' : 'bg-slate-800'}`}
              >
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-slate-400">Loading page {currentPage}...</p>
                </div>
              </div>
            ) : isDemoMode ? (
              /* Demo Mode — shows placeholder when no book images uploaded yet */
              <div
                className={`w-[680px] min-h-[900px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col ${darkMode ? 'bg-amber-50' : 'bg-white'}`}
                onDragStart={(e) => e.preventDefault()}
              >
                <PageWatermark userPhone={userPhone} />
                <div className="flex-1 flex flex-col items-center justify-center p-16 text-center gap-6">
                  <div className="text-7xl">📖</div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{book.title}</h3>
                    <p className="text-slate-500 text-sm mt-2">Page {currentPage} of {book.totalPages}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 text-left max-w-sm">
                    <p className="font-black mb-2">📚 Demo Mode</p>
                    <p>Book pages will appear here once uploaded to Supabase Storage. The reader and all DRM protections are fully active.</p>
                  </div>
                  {/* Demo page content */}
                  <div className="w-full border border-slate-200 rounded-xl p-6 text-left space-y-3">
                    <h4 className="font-black text-slate-800">{book.tableOfContents.find((ch, i) =>
                      currentPage >= ch.startPage && (i === book.tableOfContents.length - 1 || currentPage < book.tableOfContents[i + 1].startPage)
                    )?.chapter || `Page ${currentPage}`}</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`h-3 rounded-full bg-slate-200 ${i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-full' : 'w-5/6'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : pageImageUrl ? (
              /* Real Page Image from Supabase */
              <div
                className={`relative rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-amber-50' : 'bg-white'}`}
                onDragStart={(e) => e.preventDefault()}
              >
                <PageWatermark userPhone={userPhone} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pageImageUrl}
                  alt={`Page ${currentPage}`}
                  draggable={false}
                  className="max-w-[680px] block"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}
                />
              </div>
            ) : null}

            {/* Purchase prompt at preview boundary */}
            {isLastFreePageReached && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent rounded-2xl flex items-end justify-center pb-12">
                <div className="text-center space-y-4 px-8">
                  <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-white font-black text-lg">Free Preview Ended</h3>
                  <p className="text-slate-300 text-sm">Purchase this book to read all {book.totalPages} pages</p>
                  <Link
                    href={`/digital/${book.slug}/purchase`}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-6 py-3 rounded-xl text-sm transition"
                  >
                    Buy for ₹{book.price} — Unlock All Pages
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Bottom page nav (mobile friendly) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-full px-5 py-2.5 shadow-xl">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-bold">{currentPage} / {maxPage}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= maxPage}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
