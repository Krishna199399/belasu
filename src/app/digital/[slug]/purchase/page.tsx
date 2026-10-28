'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDigitalBookBySlug } from '@/data/digitalBooksData';
import { DigitalBook } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  ShoppingCart,
} from 'lucide-react';

export default function PurchasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [book, setBook] = useState<DigitalBook | undefined>(() => getDigitalBookBySlug(slug));
  const [loadingBook, setLoadingBook] = useState(!book);
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const { totalItems, subtotal, addToCart } = useCart();
  const router = useRouter();

  const handleCombineWithCart = () => {
    if (!book) return;
    addToCart(book, 'digital', 1);
    router.push('/checkout');
  };

  // Contact details for Razorpay prefill & order invoice
  const [customerName, setCustomerName] = useState(() => user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(() => user?.email || '');
  const [prevUserId, setPrevUserId] = useState(user?.id);

  // Sync state when user profile loads without effect-driven cascading renders
  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    if (!customerName && user.name) setCustomerName(user.name);
    if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    if (!customerEmail && user.email) setCustomerEmail(user.email);
  }

  const [emailError, setEmailError] = useState('');
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

  // Razorpay Hook Integration
  const { initiatePayment, loading: razorpayLoading } = useRazorpay({
    onSuccess: async (razorpayResponse) => {
      if (!book) return;
      setIsProcessing(true);
      try {
        const res = await fetch('/api/digital/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: book.id,
            amount: book.price,
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
            email: customerEmail.trim(),
            phone: customerPhone.trim(),
            name: customerName.trim(),
          }),
        });

        const data = await res.json();
        if (data.success) {
          await refreshUser();
          toast.success('Payment verified! Opening your digital guidebook...');
          router.push(`/reader/${slug}`);
        } else {
          toast.error(data.error || 'Failed to complete digital order.');
          setIsProcessing(false);
        }
      } catch (networkErr) {
        console.error('Failed to record digital purchase:', networkErr);
        toast.error('Network error while activating digital reader. Please contact support.');
        setIsProcessing(false);
      }
    },
    onFailure: (err) => {
      console.error('Payment failure or dismissal:', err);
      setIsProcessing(false);
    },
  });

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

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Email or Gmail address is required for receipt & activation.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address (e.g. name@gmail.com).';
    }
    return '';
  };

  const handleStartPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !book) return;

    const emailErr = validateEmail(customerEmail);
    if (emailErr) {
      setEmailError(emailErr);
      toast.error(emailErr);
      return;
    }
    setEmailError('');

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsProcessing(true);

    try {
      await initiatePayment({
        amount: book.price,
        description: `${book.title} (Class ${book.gradeClass} Digital Reader)`,
        notes: {
          bookId: book.id,
          bookTitle: book.title,
          gradeClass: book.gradeClass,
          slug: book.slug,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
        },
        prefill: {
          name: customerName.trim() || user.name,
          email: customerEmail.trim() || user.email || '',
          contact: customerPhone.trim() || user.phone,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not launch payment gateway';
      console.error('Payment launch error:', err);
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  const isBusy = isProcessing || razorpayLoading;

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-4 sm:py-8 md:py-10 px-3.5 sm:px-6 pb-28 lg:pb-12">
      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 border-b border-stone-200/80 pb-3.5">
          <div className="min-w-0">
            <Link
              href={`/digital/${book.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition py-1 truncate max-w-[280px] sm:max-w-none"
            >
              &larr; Back to {book.title}
            </Link>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight mt-0.5">
              Complete Digital Order
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <Lock className="w-3 h-3 text-amber-700" /> Instant Access
            </span>
          </div>
        </div>

        {/* Cart Merging Opportunity Banner */}
        {totalItems > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <p className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-700" />
                You already have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart ({formatPrice(subtotal)})
              </p>
              <p className="text-slate-600 text-xs leading-relaxed">
                Want to buy everything together? Combine this digital guidebook with your cart to complete everything in a single checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCombineWithCart}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs sm:text-sm text-slate-950 shrink-0 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition"
            >
              <span>Combine &amp; Checkout All ({formatPrice(subtotal + book.price)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* Left Column: Order Summary (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Lifetime Access
              </span>
            </div>

            <div className="flex items-start gap-3 sm:gap-3.5">
              {book.coverImage ? (
                <div className="relative w-15 h-20 sm:w-16 sm:h-22 rounded-xl overflow-hidden shadow-xs border border-stone-200 shrink-0 bg-stone-100">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 60px, 64px"
                  />
                </div>
              ) : (
                <div className="w-15 h-20 sm:w-16 sm:h-22 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shrink-0 text-white shadow-xs">
                  📖
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-snug text-slate-900 line-clamp-2">{book.title}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-slate-700 font-semibold text-[11px]">
                    Class {book.gradeClass}
                  </span>
                  <span>•</span>
                  <span>{book.subject}</span>
                  <span>•</span>
                  <span>{book.totalPages} pages</span>
                </div>
              </div>
            </div>

            {/* Price Row */}
            <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Access Type</span>
                <span className="font-semibold text-slate-800">DRM Web Reader</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-700">Instant (No Shipping)</span>
              </div>
              <div className="border-t border-stone-200/60 pt-2 mt-2 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">Total Payable</span>
                <div className="text-right">
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="text-xs text-slate-400 line-through mr-1.5">₹{book.originalPrice}</span>
                  )}
                  <span className="text-xl font-black text-amber-700">₹{book.price}</span>
                </div>
              </div>
            </div>

            {/* Included Features - Compact on mobile */}
            <div className="pt-0.5 space-y-1.5 sm:space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Instant reader activation after payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Read seamlessly on mobile, tablet & laptop</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Official bilingual English-Kannada guide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details & Razorpay Checkout (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs">
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Customer & Payment Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receipt and digital activation will be linked to your mobile and email.
                </p>
              </div>

              {/* 2-Col on SM screens for Name and Phone with 46px min-height to prevent iOS auto-zoom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-3.5 py-2.5 min-h-[46px] text-base sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit number"
                    required
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 min-h-[46px] text-base sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Email / Gmail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Gmail / Email (for Payment Receipt)
                </label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="e.g. yourname@gmail.com"
                  required
                  className={`w-full px-3.5 py-2.5 min-h-[46px] text-base sm:text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none transition ${
                    emailError
                      ? 'border-red-400 ring-2 ring-red-400/20'
                      : 'border-stone-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500'
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{emailError}</p>
                )}
              </div>

              {/* Integrated Compact Razorpay Banner */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-amber-400/80 bg-amber-50/60 flex items-center justify-between gap-2.5">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 truncate">
                    <CreditCard className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="truncate">Razorpay Secure Payment</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    UPI (Google Pay, PhonePe, Paytm), Cards & NetBanking
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-100/90 border border-amber-300/80 px-2 py-1 rounded-md shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> 256-Bit SSL
                </div>
              </div>

              {/* Desktop/Tablet Pay Action Button */}
              <button
                type="submit"
                disabled={isBusy}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3.5 px-5 rounded-xl shadow-md shadow-amber-500/20 transition text-sm cursor-pointer active:scale-98"
              >
                {isBusy ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Pay ₹{book.price} Securely via Razorpay
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-0.5">
                <Lock className="w-3 h-3" /> 100% Secure Checkout • DRM Web Reader • Instant Activation
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Pay Bar (Quick 1-Tap Trigger on Mobile) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-4 py-3 pb-safe z-40 shadow-xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-amber-700 leading-tight">
            ₹{book.price}
          </div>
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate">
            Instant Reader Access
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleStartPayment()}
          disabled={isBusy}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0"
        >
          {isBusy ? (
            <div className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Pay ₹{book.price}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
