'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DIGITAL_BOOKS_DATA } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, BookMarked } from 'lucide-react';

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

  const ownedBooks: DigitalBook[] = user
    ? DIGITAL_BOOKS_DATA.filter((b) => user.purchasedBooks?.digital?.includes(b.id))
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
    Kannada: '📚', Mathematics: '📐', Science: '🔬', 'Social Science': '🌏', English: '✍️', Hindi: '🇮🇳',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black">My Library</h1>
              <p className="text-slate-400 text-sm mt-1">
                Welcome back, <span className="text-amber-400 font-bold">{user?.name}</span> · {ownedBooks.length} book{ownedBooks.length !== 1 ? 's' : ''} owned
              </p>
            </div>
            <Link href="/digital" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm px-5 py-2.5 rounded-xl transition">
              Browse More Books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-10">
        {ownedBooks.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 space-y-5">
            <div className="text-7xl">📚</div>
            <h2 className="text-xl font-black text-white">No Books Yet</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Purchase digital books for Classes 6–10 to start reading in our secure web reader.
            </p>
            <Link href="/digital" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-6 py-3 rounded-xl text-sm transition">
              <BookOpen className="w-4 h-4" /> Browse Digital Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ownedBooks.map((book) => {
              const lastPage = progressMap[book.id] || 1;
              const progressPct = Math.round((lastPage / book.totalPages) * 100);
              const gradient = subjectColors[book.subject] || 'from-slate-500 to-slate-700';

              return (
                <div key={book.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all group flex flex-col">
                  {/* Cover */}
                  <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-1">{subjectEmoji[book.subject] || '📖'}</div>
                      <div className="text-xs font-bold opacity-80">Class {book.gradeClass} · {book.subject}</div>
                    </div>
                    {progressPct > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                        <div className="h-full bg-white/80 transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{book.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-slate-700">{book.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookMarked className="w-3.5 h-3.5" />
                        <span>Page {lastPage}/{book.totalPages}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{progressPct}% done</span>
                      </div>
                    </div>

                    <Link
                      href={`/reader/${book.slug}`}
                      className="mt-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-2.5 rounded-xl text-sm transition"
                    >
                      <BookOpen className="w-4 h-4" />
                      {lastPage > 1 ? `Continue (p.${lastPage})` : 'Start Reading'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
