'use client';

import { notFound } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getDigitalBookBySlug } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Lock, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';

export default function DigitalBookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [book, setBook] = useState<DigitalBook | undefined>(() => getDigitalBookBySlug(slug));
  const [loading, setLoading] = useState(!book);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [tocExpanded, setTocExpanded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch('/api/digital/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.books) {
          const matched = data.books.find((b: DigitalBook) => b.slug === slug);
          if (matched) {
            setBook(matched);
          }
        }
      })
      .catch((err) => console.error('Failed to load live book data:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-12">
        <div className="text-xs font-bold text-slate-500 animate-pulse">Loading digital book details...</div>
      </div>
    );
  }

  if (!book) notFound();

  const owned = user?.purchasedBooks?.digital?.includes(book.id);

  const handleAddToCart = () => {
    addToCart(book, 'digital', 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const subjectEmoji: Record<string, string> = {
    Kannada: '📚',
    Mathematics: '📐',
    Science: '🔬',
    'Social Science': '🌏',
    English: '✍️',
    Hindi: '🇮🇳',
  };

  const subjectGradients: Record<string, string> = {
    Kannada: 'from-amber-500 to-orange-600',
    Mathematics: 'from-blue-500 to-indigo-600',
    Science: 'from-emerald-500 to-teal-600',
    'Social Science': 'from-rose-500 to-pink-600',
    English: 'from-violet-500 to-purple-600',
    Hindi: 'from-red-500 to-rose-600',
  };
  const gradient = subjectGradients[book.subject] || 'from-amber-500 to-orange-600';

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-16">
      
      {/* Top Breadcrumb Nav Bar */}
      <div className="bg-white border-b border-stone-200 py-3">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-amber-700 transition">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <Link href="/digital" className="hover:text-amber-700 transition">Digital Books</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span className="text-amber-700 font-bold truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {book.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Left: Book Info Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Hero Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className={`w-32 h-44 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0 flex items-center justify-center text-5xl shadow-md text-white`}>
                {subjectEmoji[book.subject] || '📖'}
              </div>
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Class {book.gradeClass}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {book.subject}
                  </span>
                  {owned && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ✓ In Your Library
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                  {book.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" /> {book.totalPages} Pages
                  </span>
                  <span>•</span>
                  <span>Karnataka State Board</span>
                  <span>•</span>
                  <span>By {book.author}</span>
                </div>
              </div>
            </div>

            {/* Description & Features Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
                About This Digital Book
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                {book.description}
              </p>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Key Curriculum Features:
                </h3>
                <ul className="space-y-2.5">
                  {book.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Secure Reader Callout */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 flex gap-4 items-start shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-300 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-amber-950 mb-1">
                  100% Secure Web-Only Reader
                </h3>
                <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                  This book is accessed through Belesu’s secure web reader — optimized for phones, tablets, and laptops. Protected against downloads and unauthorized sharing, with your registered user details securely watermarked.
                </p>
              </div>
            </div>

            {/* Table of Contents Accordion */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
              <button
                onClick={() => setTocExpanded(!tocExpanded)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition cursor-pointer"
              >
                <h2 className="text-sm font-bold text-slate-900">
                  Table of Contents ({book.tableOfContents.length} Chapters)
                </h2>
                {tocExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {tocExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                  {book.tableOfContents.map((ch, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                        <span className="text-xs font-medium text-slate-800">{ch.chapter}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {!owned && i >= book.isFreePreviewPages && (
                          <Lock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>Page {ch.startPage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Purchase & Access Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-lg">
              
              {/* Pricing Box */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">₹{book.price}</span>
                  <span className="text-xs font-bold text-slate-500">INR</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-xs font-medium text-slate-600">One-time purchase · Lifetime digital access</p>
                </div>
              </div>

              {/* Action Buttons */}
              {owned ? (
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-emerald-900">You Own This Digital Book</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Read anytime in your browser</p>
                  </div>
                  <Link
                    href={`/reader/${book.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition text-xs shadow-md"
                  >
                    <BookOpen className="w-4 h-4" /> Open in Web Reader <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl transition text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                    disabled={addedToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                    {!addedToCart && <ArrowRight className="w-4 h-4" />}
                  </button>
                  <Link
                    href={`/reader/${book.slug}?preview=true`}
                    className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition text-xs"
                  >
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Preview {book.isFreePreviewPages} Free Pages
                  </Link>
                  <p className="text-center text-[11px] text-slate-500 pt-1">
                    🔒 Instant activation upon payment. No monthly subscriptions.
                  </p>
                </div>
              )}

              {/* Trust Signals */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <span>Instant browser access</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                    📱
                  </div>
                  <span>Compatible with phones, tablets & PC</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                    ♾️
                  </div>
                  <span>Lifetime valid access</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
