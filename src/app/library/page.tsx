'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, BookMarked, Sparkles } from 'lucide-react';

interface ProgressMap {
  [bookId: string]: number;
}

export default function LibraryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [progressMap, setProgressMap] = useState<ProgressMap>({});

  useEffect(() => {
    if (!isLoading && !user) router.replace('/auth/login?redirect=/library');
  }, [user, isLoading, router]);

  const [allBooks, setAllBooks] = useState<DigitalBook[]>(DIGITAL_BOOKS_DATA);

  useEffect(() => {
    fetch('/api/digital/books', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.books)) {
          setAllBooks(data.books);
        }
      })
      .catch((err) => console.error('Failed to load live books for library:', err));
  }, []);

  const ownedBooks: DigitalBook[] = user
    ? allBooks.filter((b) => user.purchasedBooks?.digital?.includes(b.id))
    : [];

  // Load reading progress for each owned book
  useEffect(() => {
    if (!ownedBooks.length) return;
    const fetchProgress = async () => {
      const map: ProgressMap = {};
      await Promise.all(
        ownedBooks.map(async (book) => {
          try {
            const res = await fetch(`/api/reader/progress?bookId=${book.id}`);
            const data = await res.json();
            map[book.id] = data.lastPage || 1;
          } catch {
            map[book.id] = 1;
          }
        })
      );
      setProgressMap(map);
    };
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const subjectColors: Record<string, string> = {
    Kannada: 'from-amber-500 to-orange-600',
    Mathematics: 'from-blue-500 to-indigo-600',
    Science: 'from-emerald-500 to-teal-600',
    'Social Science': 'from-rose-500 to-pink-600',
    English: 'from-violet-500 to-purple-600',
    Hindi: 'from-red-500 to-rose-600',
  };

  const subjectEmoji: Record<string, string> = {
    Kannada: '📚',
    Mathematics: '📐',
    Science: '🔬',
    'Social Science': '🌏',
    English: '✍️',
    Hindi: '🇮🇳',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-20 sm:pb-12">
      {/* Header Banner */}
      <div className="bg-white border-b border-stone-200/80 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Digital Library
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                My Library
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Welcome back, <span className="text-amber-700 font-bold">{user?.name}</span> · {ownedBooks.length} book{ownedBooks.length !== 1 ? 's' : ''} owned
              </p>
            </div>
            <Link
              href="/digital"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-5 py-3 min-h-[44px] rounded-xl shadow-xs transition active:scale-98 cursor-pointer"
            >
              Browse More Books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 sm:py-10">
        {ownedBooks.length === 0 ? (
          /* Empty state - Matching warm Belesu aesthetic */
          <div className="text-center py-16 sm:py-20 px-6 max-w-md mx-auto bg-white border border-stone-200/80 rounded-3xl shadow-xs space-y-4 my-4 sm:my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto text-3xl shadow-xs">
              📚
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">No Books Yet</h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Purchase digital books for Classes 6–10 to start reading in our secure web reader.
            </p>
            <div className="pt-2">
              <Link
                href="/digital"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 min-h-[44px] rounded-xl text-sm shadow-xs transition active:scale-98 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Browse Digital Books
              </Link>
            </div>
          </div>
        ) : (
          /* Owned Books Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {ownedBooks.map((book) => {
              const lastPage = progressMap[book.id] || 1;
              const progressPct = Math.round((lastPage / book.totalPages) * 100);
              const gradient = subjectColors[book.subject] || 'from-slate-600 to-slate-800';

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-stone-200/80 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Cover */}
                  <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider z-10">
                      Class {book.gradeClass}
                    </div>
                    <div className="text-center text-white p-4 drop-shadow-sm">
                      <div className="text-4xl mb-1">{subjectEmoji[book.subject] || '📖'}</div>
                      <div className="text-xs font-bold uppercase tracking-wider opacity-90">{book.subject}</div>
                    </div>
                    {progressPct > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                        <div className="h-full bg-amber-400 transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                        {book.subject} · Class {book.gradeClass}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-t border-stone-100 pt-3">
                        <div className="flex items-center gap-1.5">
                          <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                          <span>Page {lastPage} of {book.totalPages}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{progressPct}% completed</span>
                        </div>
                      </div>

                      <Link
                        href={`/reader/${book.slug}`}
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-sm shadow-xs transition active:scale-98 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        {lastPage > 1 ? `Continue Reading (p.${lastPage})` : 'Start Reading'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
