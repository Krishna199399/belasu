'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import { formatPrice, SHIPPING_FEE } from '@/lib/utils';
import { ShieldCheck, CreditCard, CheckCircle2, ArrowLeft, Lock, Package, BookOpen, LogIn, Loader, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import AddressManager from '@/components/address/AddressManager';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { useRazorpay } from '@/hooks/useRazorpay';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, hasPhysicalBooks, hasDigitalBooks, getPhysicalItems, getDigitalItems, needsShipping, syncCart } = useCart();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isNavigatingToSuccess, setIsNavigatingToSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [verifiedBook, setVerifiedBook] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Redirect to single unified login page if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  // Ensure addresses are refreshed if missing
  useEffect(() => {
    if (user && (!user.addresses || user.addresses.length === 0)) {
      refreshUser();
    }
  }, [user, refreshUser]);

  // Sync abandoned cart in real-time with customer contact info
  useEffect(() => {
    if (user?.phone && cart.length > 0) {
      syncCart(user.phone, user.name, user.email);
    }
  }, [user, cart, syncCart]);

  // Digital access contact fields
  const [digitalEmail, setDigitalEmail] = useState(() => user?.email || '');
  const [digitalPhone, setDigitalPhone] = useState(() => user?.phone || '');
  const [digitalName, setDigitalName] = useState(() => user?.name || '');
  const [prevUserId, setPrevUserId] = useState(user?.id);

  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    if (!digitalEmail && user.email) setDigitalEmail(user.email);
    if (!digitalPhone && user.phone) setDigitalPhone(user.phone);
    if (!digitalName && user.name) setDigitalName(user.name);
  }

  const shippingFee = needsShipping() ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shippingFee;

  const physicalItems = getPhysicalItems();
  const digitalItems = getDigitalItems();

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || null;
  const currentAddress = selectedAddress || defaultAddress;

  // Razorpay hook
  const { initiatePayment, loading: paymentLoading } = useRazorpay({
    onSuccess: async (response, verifyData) => {
      // If order was already created atomically in the verify step, route directly to order-success
      if (verifyData?.orderNumber) {
        setIsNavigatingToSuccess(true);
        clearCart();
        await refreshUser();
        router.replace(`/order-success/${encodeURIComponent(verifyData.orderNumber)}`);
        setIsProcessing(false);
      } else {
        // Fallback: create order if not yet fulfilled
        await createOrder(response.razorpay_payment_id, response.razorpay_order_id);
      }
    },
    onFailure: (error) => {
      console.error('Payment failed or cancelled:', error);
      setIsProcessing(false);
    },
    onDismiss: () => {
      console.log('Payment modal closed by user');
      setIsProcessing(false);
    },
  });

  // Auto-reset isProcessing if user cancels or closes the gateway modal / tab
  useEffect(() => {
    if (!isProcessing) return;

    const handleFocus = () => {
      setTimeout(() => {
        const hasRazorpay = document.querySelector('iframe.razorpay-checkout-frame') || document.querySelector('.razorpay-container');
        if (!hasRazorpay) {
          setIsProcessing(false);
        }
      }, 800);
    };

    // Safety timeout: Never stay stuck in isProcessing if modal was closed or orphaned
    const timeout = setTimeout(() => {
      const hasRazorpay = document.querySelector('iframe.razorpay-checkout-frame') || document.querySelector('.razorpay-container');
      if (!hasRazorpay) {
        setIsProcessing(false);
      }
    }, 30000);

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearTimeout(timeout);
    };
  }, [isProcessing]);

  // Redirect if cart is empty (unless routing to dedicated order success page)
  useEffect(() => {
    if (!authLoading && cart.length === 0 && !isNavigatingToSuccess) {
      router.push('/cart/');
    }
  }, [cart.length, authLoading, router, isNavigatingToSuccess]);

  // Create order after payment success
  const createOrder = async (paymentId?: string, razorpayOrderId?: string) => {
    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.product.id,
          sku: item.product.sku,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          productType: item.productType,
          slug: item.product.slug,
        })),
        shippingAddressId: currentAddress?.id,
        paymentMethod: 'Razorpay - Online Payment',
        paymentId,
        razorpayOrderId,
        shippingFee,
        customerEmail: currentAddress?.email || digitalEmail.trim() || user?.email || '',
        customerPhone: currentAddress?.phone || digitalPhone.trim() || user?.phone || '',
        customerName: (currentAddress ? `${currentAddress.firstName} ${currentAddress.lastName}`.trim() : digitalName.trim()) || user?.name || '',
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success && data.order?.orderNumber) {
        setIsNavigatingToSuccess(true);
        clearCart();
        // Refresh user data to get updated purchased_books
        await refreshUser();
        // Route immediately to dedicated Thank You / Order Success page
        router.replace(`/order-success/${encodeURIComponent(data.order.orderNumber)}`);
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Order creation error:', error);
      alert(`Failed to create order: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    if (needsShipping() && !currentAddress) {
      setValidationError('Please select a delivery address to proceed.');
      toast.error('Please select a delivery address');
      return;
    }

    if (!agreedToTerms) {
      setValidationError('Please read and accept the terms and conditions to proceed with your order.');
      toast.error('Please accept terms and conditions');
      return;
    }

    if (!verifiedBook) {
      setValidationError('Please confirm that you have verified the book edition and reviewed sample pages.');
      toast.error('Please confirm book verification');
      return;
    }

    if (!needsShipping()) {
      const email = (digitalEmail || user?.email || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setValidationError('Please enter a valid Gmail / Email address to receive your digital guidebook receipt and reader link.');
        toast.error('Please enter a valid email address');
        return;
      }
    }

    setValidationError(null);
    setIsProcessing(true);

    try {
      const orderItems = cart.map(item => ({
        id: item.product.id,
        sku: item.product.sku,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        productType: item.productType,
        slug: item.product.slug,
      }));

      const customerEmailVal = currentAddress?.email || digitalEmail.trim() || user?.email || '';
      const customerPhoneVal = currentAddress?.phone || digitalPhone.trim() || user?.phone || '';
      const customerNameVal = (currentAddress ? `${currentAddress.firstName} ${currentAddress.lastName}`.trim() : digitalName.trim()) || user?.name || '';

      // Initiate Razorpay online payment with attached orderPayload for atomic verification-fulfillment
      await initiatePayment({
        amount: grandTotal,
        description: `Order for ${cart.length} item(s)`,
        orderPayload: {
          items: orderItems,
          shippingAddressId: currentAddress?.id || null,
          shippingFee,
          customerEmail: customerEmailVal,
          customerPhone: customerPhoneVal,
          customerName: customerNameVal,
          paymentMethod: 'Razorpay - Online Payment',
        },
        notes: {
          items: cart.length,
          hasPhysical: hasPhysicalBooks(),
          hasDigital: hasDigitalBooks(),
          shipping_address_id: currentAddress?.id || '',
          shipping_fee: String(shippingFee || 48),
          customer_phone: customerPhoneVal,
          customer_email: customerEmailVal,
          customer_name: customerNameVal,
          items_summary: cart.map(i => `${i.product.sku || i.product.id}:${i.quantity || 1}`).join(',').slice(0, 250),
        },
        prefill: {
          name: customerNameVal,
          email: customerEmailVal,
          contact: customerPhoneVal,
        },
      });
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    if (validationError?.includes('address')) {
      setValidationError(null);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Login required fallback view
  if (!user) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Login Required</h2>
            <p className="text-sm text-slate-600 mt-2">
              Please login with your mobile number to complete your purchase, access saved addresses, and track order updates.
            </p>
          </div>
          
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 text-left">
            <p className="text-xs text-amber-900 font-bold mb-2">
              Why login?
            </p>
            <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
              <li>Auto-fill your saved delivery addresses</li>
              <li>Track shipping & SMS order notifications</li>
              <li>Instant access to purchased digital books</li>
            </ul>
          </div>

          <Link
            href="/auth/login?redirect=/checkout"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </Link>

          <Link
            href="/cart/"
            className="block text-sm font-semibold text-slate-500 hover:text-amber-700 transition"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[#faf9f6] min-h-screen pb-28 lg:pb-12">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Progress Stepper: Step 2 (Details & Payment) Active */}
        <CheckoutStepper currentStep={2} />

        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-2">
          <Link href="/cart/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 mb-2 transition min-h-[40px] py-1">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" /> Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Logged in as {user.phone}</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            
            {/* Left: Address & Payment (8 cols) */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              
              {/* Mixed Order Notification (When both physical and digital items exist) */}
              {hasDigitalBooks() && hasPhysicalBooks() && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
                    ✨
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700">
                    <p className="font-bold text-amber-950 mb-0.5">
                      Combined Order: Hard Copy &amp; Digital Guidebooks
                    </p>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      Your digital books will be <strong>instantly unlocked</strong> in My Library right after payment. Your hard copy books will be dispatched to the delivery address selected below.
                    </p>
                  </div>
                </div>
              )}

              {/* Address Selection (only for physical books) */}
              {needsShipping() && (
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" /> Delivery Address
                  </h3>
                  
                  <AddressManager 
                    mode="select"
                    onSelectAddress={handleSelectAddress}
                    selectedAddressId={currentAddress?.id}
                  />
                </div>
              )}

              {/* Digital Books Info & Contact Card (if only digital) */}
              {hasDigitalBooks() && !hasPhysicalBooks() && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm sm:text-base mb-1.5">Instant Digital Purchase</h4>
                        <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                          Your digital books will be instantly available in your Library after payment completion.
                          No shipping or physical delivery required!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-amber-600" /> Receipt &amp; Activation Details
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">For Razorpay Receipt</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={digitalName}
                          onChange={(e) => setDigitalName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-3.5 py-2.5 min-h-[46px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          value={digitalPhone}
                          onChange={(e) => setDigitalPhone(e.target.value)}
                          placeholder="Mobile number"
                          className="w-full px-3.5 py-2.5 min-h-[46px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gmail / Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={digitalEmail}
                        onChange={(e) => {
                          setDigitalEmail(e.target.value);
                          if (validationError?.includes('email')) setValidationError(null);
                        }}
                        placeholder="e.g. yourname@gmail.com"
                        required
                        className="w-full px-3.5 py-2.5 min-h-[46px] text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Your Razorpay payment receipt and instant web reader activation will be linked to this email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" /> Payment Method
                </h3>

                <div className="p-4 sm:p-5 rounded-2xl border border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💳</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">Online Payment</span>
                        <span className="text-[11px] sm:text-xs text-slate-600 block">UPI (Google Pay, PhonePe, Paytm), Cards, Net Banking, Wallets</span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 sm:p-4 text-left">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-900 mb-1">
                        🔒 Secure Payment via Razorpay
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Your payment information is encrypted and secure. We support UPI, Credit/Debit Cards, Net Banking, and digital wallets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Order Summary & Confirmation Notices (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-sm sticky top-24 space-y-5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                  <span className="text-amber-500 text-lg">🛒</span>
                  <span>Order Summary</span>
                </h3>

                {/* Items List matching mockup */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 py-1.5 border-b border-stone-100 last:border-b-0">
                      <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-stone-50 border border-stone-200/80 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={item.product.coverImage}
                          alt={item.product.title}
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {item.productType === 'digital' ? 'Official Digital Web Edition' : 'Kannada-English Translated Guidebook'}
                        </p>
                      </div>
                      <div className="text-right shrink-0 text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  {needsShipping() && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-bold text-slate-900">{formatPrice(shippingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-stone-100">
                    <span>Grand Total</span>
                    <span className="text-amber-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* ── Privacy Policy Transparency Notice ── */}
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                  <Link href="/privacy-policy/" target="_blank" className="font-semibold text-slate-800 underline hover:text-amber-700">
                    privacy policy
                  </Link>.
                </p>

                {/* ── Terms and Conditions Checkbox ── */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked && validationError?.includes('terms')) {
                          setValidationError(null);
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0"
                    />
                    <span>
                      I have read and agree to the website{' '}
                      <Link href="/terms-and-conditions/" target="_blank" className="font-bold text-red-600 underline hover:text-red-700">
                        terms and conditions
                      </Link>{' '}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                  {!agreedToTerms && validationError?.includes('terms') && (
                    <p className="text-[11px] text-red-600 pl-6.5 font-medium">
                      Please read and accept the terms and conditions to proceed with your order.
                    </p>
                  )}
                </div>

                {/* ── Order Verification Notice Box (Amber Container matching user request) ── */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Please Read Before Placing Your Order</span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                    Please ensure you are <strong className="text-slate-900 font-bold">ordering the correct book</strong> and have reviewed the{' '}
                    <strong className="text-slate-900 font-bold">Sample Pages</strong> before placing your order. This helps avoid ordering mistakes.
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      If you need any clarification before ordering, please call us at{' '}
                      <a href="tel:+919606636804" className="font-bold text-slate-900 underline hover:text-amber-800">
                        9606636804
                      </a>.
                    </span>
                  </div>

                  <div className="pt-2 border-t border-amber-200">
                    <label className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-800 font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={verifiedBook}
                        onChange={(e) => {
                          setVerifiedBook(e.target.checked);
                          if (e.target.checked && validationError?.includes('verified')) {
                            setValidationError(null);
                          }
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0"
                      />
                      <span>
                        I understand that I have verified the book and reviewed the sample pages before placing this order.{' '}
                        <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center animate-in fade-in">
                    {validationError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing || paymentLoading || (needsShipping() && !currentAddress)}
                  className="w-full min-h-[48px] py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
                >
                  {isProcessing || paymentLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" /> 
                      Opening Payment Gateway...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> 
                      Pay Now ({formatPrice(grandTotal)})
                    </>
                  )}
                </button>

                {needsShipping() && !currentAddress && (
                  <p className="text-xs text-red-600 text-center">
                    Please select a delivery address to continue
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Sticky Bottom Pay Bar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 pb-safe z-40 shadow-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-black text-amber-600 leading-tight">
                  {formatPrice(grandTotal)}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate">
                  Razorpay Secure
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing || paymentLoading || (needsShipping() && !currentAddress)}
                className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isProcessing || paymentLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>Pay Now</span>
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
