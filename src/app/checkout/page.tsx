'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, CreditCard, CheckCircle2, ArrowLeft, Lock, Package, BookOpen, LogIn, Loader } from 'lucide-react';
import Link from 'next/link';
import AddressManager from '@/components/address/AddressManager';
import { AuthModal } from '@/components/auth/AuthModal';
import { useRazorpay } from '@/hooks/useRazorpay';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, hasPhysicalBooks, hasDigitalBooks, getPhysicalItems, getDigitalItems, needsShipping } = useCart();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  const shippingFee = needsShipping() ? 45 : 0;
  const grandTotal = subtotal + shippingFee;

  const physicalItems = getPhysicalItems();
  const digitalItems = getDigitalItems();

  // Razorpay hook
  const { initiatePayment, loading: paymentLoading } = useRazorpay({
    onSuccess: async (response) => {
      // Payment successful, create order
      await createOrder(response.razorpay_payment_id, response.razorpay_order_id);
    },
    onFailure: (error) => {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    },
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && cart.length === 0) {
      router.push('/cart');
    }
  }, [cart.length, authLoading, router]);

  // Set default address when user data loads
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user, selectedAddress]);

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
        shippingAddressId: selectedAddress?.id,
        paymentMethod: paymentMethod === 'Razorpay' ? 'Razorpay - Online Payment' : 'Cash on Delivery',
        paymentId,
        razorpayOrderId,
        shippingFee,
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        setOrderId(data.order.orderNumber);
        setPlacedOrderDetails(data.order);
        setOrderPlaced(true);
        clearCart();
        // Refresh user data to get updated purchased_books
        await refreshUser();
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      alert(`Failed to create order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (needsShipping() && !selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'Razorpay') {
        // Initiate Razorpay payment
        await initiatePayment({
          amount: grandTotal,
          description: `Order for ${cart.length} item(s)`,
          notes: {
            items: cart.length,
            hasPhysical: hasPhysicalBooks(),
            hasDigital: hasDigitalBooks(),
          },
        });
      } else {
        // COD order - create directly
        await createOrder();
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
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

  // Login required
  if (!user) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Login Required</h2>
            <p className="text-sm text-slate-600 mt-2">
              Please login to complete your purchase. We need your contact information to process orders and provide updates.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-xs text-blue-800 font-bold mb-2">
              Why login?
            </p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Track your orders</li>
              <li>Save delivery addresses</li>
              <li>Access purchased digital books</li>
              <li>Get order updates via SMS</li>
            </ul>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition"
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </button>

          <Link
            href="/cart"
            className="block text-sm text-gray-600 hover:text-orange-600 transition"
          >
            ← Back to Cart
          </Link>
        </div>

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-emerald-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Thank You for Your Order!</h2>
            <p className="text-xs text-slate-600 mt-1">Order ID: <strong className="text-slate-900 font-mono">{orderId}</strong></p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{user?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="font-bold text-amber-700">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold text-emerald-700">{formatPrice(grandTotal)}</span>
            </div>
            {hasPhysicalBooks() && (
              <div className="pt-2 border-t text-[11px] text-slate-500">
                📦 Hard copy books will be dispatched within 24 hours to your selected address.
              </div>
            )}
          </div>

          {/* Digital Books Section with Reader Links */}
          {hasDigitalBooks() && digitalItems.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Your Digital Books Are Ready!</h3>
              </div>
              <p className="text-xs text-blue-700 mb-4">
                Start reading instantly. Your books are now in your library with lifetime access.
              </p>
              <div className="space-y-2">
                {digitalItems.map((item) => (
                  <Link
                    key={item.product.id}
                    href={`/reader/${item.product.slug}`}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {'subject' in item.product ? item.product.subject : 'Digital Book'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700">
                      <span className="text-xs font-semibold">Open Reader</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/library"
                className="block text-center mt-4 text-xs text-blue-700 hover:text-blue-900 font-semibold transition"
              >
                View All in Library →
              </Link>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/library"
              className="flex-1 py-3 px-4 rounded-xl font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition text-xs"
            >
              View Library
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition text-xs shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="mb-10">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 mb-2 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-7 h-7 text-amber-600" /> Secure Checkout
          </h1>
          <p className="text-sm text-gray-600 mt-2">Logged in as {user.phone}</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Address & Payment (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Address Selection (only for physical books) */}
              {needsShipping() && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-600" /> Delivery Address
                  </h3>
                  
                  <AddressManager 
                    mode="select"
                    onSelectAddress={handleSelectAddress}
                    selectedAddressId={selectedAddress?.id}
                  />
                </div>
              )}

              {/* Digital Books Info (if only digital) */}
              {hasDigitalBooks() && !hasPhysicalBooks() && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Digital Purchase</h4>
                      <p className="text-sm text-blue-800">
                        Your digital books will be instantly available in your Library after payment completion.
                        No shipping required!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" /> Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'Razorpay', label: 'Online Payment', desc: 'UPI, Card, Net Banking, Wallets', icon: '💳' },
                    { id: 'COD', label: 'Cash on Delivery', desc: hasPhysicalBooks() ? 'Pay upon delivery' : 'Not available for digital', disabled: !hasPhysicalBooks(), icon: '💵' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => !method.disabled && setPaymentMethod(method.id as any)}
                      disabled={method.disabled}
                      className={`p-5 rounded-2xl border text-left transition ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                          : method.disabled
                          ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <span className="font-bold text-sm text-slate-900 block">{method.label}</span>
                          <span className="text-xs text-slate-600">{method.desc}</span>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle2 className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'Razorpay' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
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
                )}
              </div>

            </div>

            {/* Right: Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary
                </h3>

                {/* Hard Copy Books */}
                {physicalItems.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                      <Package className="w-3 h-3" /> Hard Copy Books
                    </h4>
                    <div className="space-y-2">
                      {physicalItems.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-700 line-clamp-1 max-w-[180px]">
                            {quantity}x {product.title}
                          </span>
                          <span className="font-bold text-slate-900">{formatPrice(product.price * quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Digital Books */}
                {digitalItems.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> Digital Books
                    </h4>
                    <div className="space-y-2">
                      {digitalItems.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-700 line-clamp-1 max-w-[180px]">
                            {product.title}
                          </span>
                          <span className="font-bold text-slate-900">{formatPrice(product.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
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
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Grand Total</span>
                    <span className="text-amber-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || paymentLoading || (needsShipping() && !selectedAddress)}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing || paymentLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" /> 
                      {paymentMethod === 'Razorpay' ? 'Opening Payment Gateway...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> 
                      {paymentMethod === 'Razorpay' ? 'Pay Now' : 'Place Order'} ({formatPrice(grandTotal)})
                    </>
                  )}
                </button>

                {needsShipping() && !selectedAddress && (
                  <p className="text-xs text-red-600 text-center">
                    Please select a delivery address to continue
                  </p>
                )}
              </div>
            </div>

          </div>
        </form>

      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
