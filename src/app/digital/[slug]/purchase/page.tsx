'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDigitalBookBySlug } from '@/data/digitalBooksData';
import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShieldCheck, CreditCard, Smartphone, Banknote, ArrowRight, Lock } from 'lucide-react';

type PaymentMethod = 'UPI' | 'Card' | 'COD';

export default function PurchasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const book = getDigitalBookBySlug(slug);
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!book) notFound();
  if (!user) {
    router.push(`/auth/login?redirect=/digital/${slug}/purchase`);
    return null;
  }
  if (user.purchasedBooks?.digital?.includes(book.id)) {
    router.push(`/reader/${slug}`);
    return null;
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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
          <h1 className="text-2xl font-black">Complete Your Purchase</h1>
          <p className="text-slate-400 text-sm">You're one step away from digital access</p>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Order Summary</h2>
          <div className="flex items-start gap-3">
            <div className="w-12 h-14 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl flex-shrink-0">📖</div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-snug text-white">{book.title}</p>
              <p className="text-xs text-slate-400 mt-1">Class {book.gradeClass} · {book.subject} · {book.totalPages} pages</p>
              <p className="text-xs text-emerald-400 mt-1">✓ Lifetime digital access</p>
            </div>
          </div>
          <div className="border-t border-slate-700/60 pt-3 flex justify-between items-center">
            <span className="text-sm text-slate-400">Total</span>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-400">₹{book.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Payment Method</h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'UPI' as PaymentMethod, icon: <Smartphone className="w-5 h-5" />, label: 'UPI' },
              { id: 'Card' as PaymentMethod, icon: <CreditCard className="w-5 h-5" />, label: 'Card' },
              { id: 'COD' as PaymentMethod, icon: <Banknote className="w-5 h-5" />, label: 'Cash' },
            ]).map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-bold transition ${
                  method === m.id
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>

          {method === 'UPI' && (
            <div className="bg-slate-900/60 rounded-xl p-3 text-xs text-slate-400 text-center">
              You'll be redirected to your UPI app to complete payment
            </div>
          )}
          {method === 'Card' && (
            <div className="space-y-2">
              <input className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" placeholder="Card number" />
              <div className="grid grid-cols-2 gap-2">
                <input className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" placeholder="MM/YY" />
                <input className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" placeholder="CVV" />
              </div>
            </div>
          )}
          {method === 'COD' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300">
              ⚠️ Note: Digital books require payment before access. COD is processed via WhatsApp confirmation.
            </div>
          )}
        </div>

        {/* Logged in as */}
        <div className="text-xs text-slate-400 text-center">
          Purchasing as <span className="text-white font-bold">{user.name}</span> ({user.phone})
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-black py-4 rounded-2xl transition text-sm"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Pay ₹{book.price} & Start Reading
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
