'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Package, 
  BookOpen, 
  ArrowRight, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Loader, 
  ShoppingBag,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { BOOKS_DATA } from '@/data/mockData';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  title: string;
  productType?: string;
  sku?: string;
  quantity: number;
  price: number;
  total: number;
  productId?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  orderStatus: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  hasPhysicalBooks: boolean;
  hasDigitalBooks: boolean;
  shipping?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    phone?: string;
  };
  billing?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    phone?: string;
    email?: string;
  };
  items: OrderItem[];
}

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const rawOrderNumber = resolvedParams.orderNumber;
  const orderNumber = decodeURIComponent(rawOrderNumber || '').trim();
  const router = useRouter();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        setLoading(true);

        const fetchDetails = async () => {
          const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, {
            cache: 'no-store',
          });
          return await res.json();
        };

        let data = await fetchDetails();

        // If order was just placed, retry once after 1.2s to handle any replication delay
        if (!data.success && (!data.order || data.error === 'Order not found')) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (!isMounted) return;
          data = await fetchDetails();
        }

        if (!isMounted) return;

        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || 'Unable to find order details');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load order:', err);
        setError('Network error while loading order details');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (orderNumber) {
      fetchOrder();
    } else {
      setLoading(false);
      setError('Order number is missing');
    }

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  const handleCopyOrderNumber = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    toast.success('Order number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <Loader className="w-10 h-10 animate-spin text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Retrieving Order Details...</h2>
          <p className="text-xs text-slate-500">Please wait while we fetch your confirmed purchase details.</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    const errorWaUrl = `https://wa.me/919606636804?text=${encodeURIComponent(
      `Hi Belesu, I placed an order (#${orderNumber || 'Unknown'}), but the confirmation details are pending. Please help verify.`
    )}`;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-5 max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order Confirmation</h2>
            <p className="text-xs text-slate-600 mt-2">
              {error || `Order #${orderNumber} could not be retrieved directly.`}
            </p>
            {orderNumber && (
              <p className="text-xs font-mono font-bold text-amber-700 mt-1">
                Ref: #{orderNumber}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition"
            >
              Back to Home
            </Link>
            <Link
              href="/profile"
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition"
            >
              View My Account
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <a
              href={errorWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold transition hover:underline"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Need help? Chat with WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Today';

  const waSupportUrl = `https://wa.me/919606636804?text=${encodeURIComponent(
    `Hi Belesu, I have a question regarding my order #${order.orderNumber}`
  )}`;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-6 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Progress Stepper: Step 3 (Confirmation) Active / Completed */}
        <CheckoutStepper currentStep={3} />

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden mt-2">
          
          {/* Top Celebration Header */}
          <div className="bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-white px-6 pt-10 pb-8 text-center border-b border-emerald-100/60">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 mb-5 ring-8 ring-emerald-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Order Placed Successfully
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Thank You for Your Order!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              We&apos;ve received your order and sent a confirmation receipt to{' '}
              <strong className="text-slate-900">{order.customerEmail || order.customerPhone}</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Order Number</span>
                <button
                  type="button"
                  onClick={handleCopyOrderNumber}
                  className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 hover:text-amber-800 transition group"
                  title="Click to copy order number"
                >
                  <span>#{order.orderNumber}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  )}
                </button>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Order Date</span>
                <span className="font-bold text-slate-900 block">{formattedDate}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Payment</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Paid (Online)
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-0.5">Total Paid</span>
                <span className="font-extrabold text-amber-600 text-sm block">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* What They Bought (Itemized Items List) */}
            <div className="space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                Items Purchased ({order.items.length})
              </h2>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {order.items.map((item) => {
                  const bookMatch = BOOKS_DATA.find(
                    (b) => b.id === item.productId || b.id === item.id || b.title.toLowerCase() === item.title.toLowerCase()
                  );
                  const coverSrc = bookMatch?.coverImage;

                  return (
                    <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-12 h-14 sm:w-14 sm:h-16 bg-stone-50 rounded-xl border border-stone-200/80 p-1 flex items-center justify-center shrink-0">
                          {coverSrc ? (
                            <img
                              src={coverSrc}
                              alt={item.title}
                              className="max-h-full max-w-full object-contain rounded"
                            />
                          ) : item.productType === 'digital' ? (
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Package className="w-5 h-5 text-amber-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                item.productType === 'digital'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {item.productType === 'digital' ? 'Digital Web Reader' : 'Hard Copy Book'}
                            </span>

                            {item.sku && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                #{item.sku}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 mt-1">
                            Qty: <strong className="text-slate-700">{item.quantity}</strong> × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-xs sm:text-sm text-slate-900">
                          {formatPrice(item.total || item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{formatPrice(order.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">
                  {order.shippingAmount > 0 ? formatPrice(order.shippingAmount) : 'Free Shipping'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-amber-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {/* Delivery Details (for Hard Copy Books) */}
            {order.hasPhysicalBooks && (
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Delivery Address &amp; Shipping Details
                </h2>

                <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 text-slate-700 leading-relaxed">
                  <p className="font-bold text-slate-900 text-sm">
                    {order.shipping?.firstName} {order.shipping?.lastName}
                  </p>
                  {order.shipping?.address1 && <p>{order.shipping.address1}</p>}
                  {order.shipping?.address2 && <p>{order.shipping.address2}</p>}
                  <p>
                    {order.shipping?.city}, {order.shipping?.state} - {order.shipping?.postcode}
                  </p>
                  {order.shipping?.phone && (
                    <p className="flex items-center gap-1.5 pt-1 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.shipping.phone}</span>
                    </p>
                  )}
                </div>

                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
                  <Package className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Doorstep Dispatch:</strong> Your book package is being verified and will be dispatched within 24 hours via reliable express courier.
                  </span>
                </div>
              </div>
            )}

            {/* Instant Access Banner (for Digital Books) */}
            {order.hasDigitalBooks && (
              <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-amber-50/30 border border-indigo-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-700" />
                  <h3 className="font-bold text-sm sm:text-base text-indigo-950">
                    Your Digital E-Reader Access Is Ready!
                  </h3>
                </div>

                <p className="text-xs text-indigo-800 leading-relaxed">
                  Your digital guidebooks are activated for your account with lifetime access and instant browser reading.
                </p>

                <div className="pt-2">
                  <Link
                    href="/library"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    <span>Open My Digital Library</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Action Buttons & Customer Support */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/books"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm text-center shadow-md shadow-amber-500/25 transition active:scale-98"
                >
                  Continue Shopping
                </Link>

                <Link
                  href="/profile"
                  className="flex-1 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm text-center transition active:scale-98"
                >
                  View My Orders
                </Link>
              </div>

              {/* WhatsApp Support Assistance */}
              <div className="text-center pt-2">
                <a
                  href={waSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold transition hover:underline"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Need help with this order? Chat with us on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

