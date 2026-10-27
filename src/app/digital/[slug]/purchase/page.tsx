'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDigitalBookBySlug } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShieldCheck, CreditCard, Smartphone, Banknote, ArrowRight, Lock, BookOpen, Sparkles } from 'lucide-react';

type PaymentMethod = 'UPI' | 'Card' | 'COD';

export default function PurchasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [book, setBook] = useState<DigitalBook | undefined>(() => getDigitalBookBySlug(slug));
  const [loadingBook, setLoadingBook] = useState(!book);
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch(`/api/digital/books?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.book) {
          setBook(data.book);
        }
      })
      .catch((err) => console.error('Failed to load book for checkout:', err))
      .finally(() => setLoadingBook(false));
  }, [slug]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/digital/${slug}/purchase`);
    }
  }, [user, authLoading, router, slug]);

  useEffect(() => {
    if (user && book && user.purchasedBooks?.digital?.includes(book.id)) {
      router.push(`/reader/${slug}`);
    }
  }, [user, book, router, slug]);

  if (loadingBook) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) notFound();

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="text-slate-500 text-sm">Redirecting to login...</div>
      </div>
    );
  }

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/digital/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, paymentMethod: method, amount: book.price }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        toast.success('Purchase successful! Opening your book...');
        router.push(`/reader/${slug}`);
      } else {
        toast.error(data.error || 'Purchase failed. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 pb-safe">
      <div className="w-full max-w-lg mx-auto space-y-5 sm:space-y-6">
        
        {/* Header Breadcrumb / Logo */}
        <div className="text-center space-y-2">
          <Link href={`/digital/${book.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition min-h-[40px] px-2 py-1">
            &larr; Back to {book.title}
          </Link>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-amber-700" /> Instant Digital Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Complete Your Digital Order
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Instant lifetime reading access in our secure web reader
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Order Summary</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Lifetime Access
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-18 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl flex-shrink-0 text-white shadow-xs">
              📖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-snug text-slate-900 line-clamp-2">{book.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                <span className="bg-stone-100 px-2 py-0.5 rounded font-semibold text-slate-700">Class {book.gradeClass}</span>
                <span>•</span>
                <span>{book.subject}</span>
                <span>•</span>
                <span>{book.totalPages} pages</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-500 block">Total Payable</span>
              <span className="text-xs text-emerald-600 font-semibold">Zero shipping fee (Digital)</span>
            </div>
            <div className="text-right">
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xs text-slate-400 line-through mr-2 font-medium">₹{book.originalPrice}</span>
              )}
              <span className="text-2xl font-black text-amber-700 tracking-tight">₹{book.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Select Payment Method</h2>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {([
              { id: 'UPI' as PaymentMethod, icon: <Smartphone className="w-4 h-4" />, label: 'UPI / QR' },
              { id: 'Card' as PaymentMethod, icon: <CreditCard className="w-4 h-4" />, label: 'Debit / Card' },
              { id: 'COD' as PaymentMethod, icon: <Banknote className="w-4 h-4" />, label: 'Direct Help' },
            ]).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`min-h-[52px] flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
                  method === m.id
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs'
                    : 'border-stone-200 text-slate-600 hover:border-slate-300 bg-stone-50/50'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {method === 'UPI' && (
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 text-center">
              Instant activation via PhonePe, Google Pay, Paytm or BHIM UPI
            </div>
          )}
          {method === 'Card' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-600 text-center">
              Credit card, debit card & NetBanking supported with 256-bit SSL encryption
            </div>
          )}
          {method === 'COD' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-600 text-center">
              Need assistance? Instant activation supported with our customer care team via WhatsApp
            </div>
          )}
        </div>

        {/* Logged in User Bar */}
        <div className="text-xs text-slate-500 text-center bg-white border border-stone-200/80 rounded-xl py-2.5 px-4 truncate">
          Ordering as <span className="font-bold text-slate-900">{user.name}</span> ({user.phone})
        </div>

        {/* Pay Action Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-4 px-6 rounded-2xl shadow-md shadow-amber-500/20 transition text-sm cursor-pointer active:scale-98"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
              Activating Digital Reader...
            </span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Pay ₹{book.price} & Read Now
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center pb-2">
          <Lock className="w-3.5 h-3.5" /> 100% Secure Checkout • DRM Protected Web Reader
        </div>
      </div>
    </div>
  );
}
