'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const freeShippingThreshold = 500;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 40;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `BLS-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-emerald-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Thank You for Your Order!</h2>
            <p className="text-xs text-slate-500 mt-1">Order Reference ID: <strong className="text-slate-900 font-mono">{orderId}</strong></p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Customer Name:</span>
              <span className="font-bold">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-amber-700">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold text-emerald-700">{formatPrice(grandTotal)}</span>
            </div>
            <div className="pt-2 border-t text-[11px] text-slate-500">
              Dispatched within 24 hours. Doorstep delivery in 3-5 business days across Karnataka.
            </div>
          </div>

          <Link
            href="/"
            className="block py-3 px-6 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition text-xs shadow-md"
          >
            Return to Homepage
          </Link>
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
            <Lock className="w-7 h-7 text-amber-600" /> Secure Express Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Shipping & Payment Details (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Shipping Address */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" /> Doorstep Shipping Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roopa Sanjiv"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Phone Number (For Delivery Updates) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 99023 83451"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  <label className="block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  <label className="block mb-1">Flat / House No. / Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42, 3rd Main, Indiranagar"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 560038"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" /> Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', desc: 'Instant 1-Click Pay' },
                    { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'COD', label: 'Cash on Delivery', desc: 'Pay upon doorstep arrival' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 block">{method.label}</span>
                      <span className="text-[10px] text-slate-500">{method.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Order Breakdown
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700 line-clamp-1 max-w-[180px]">
                        {quantity}x {product.title}
                      </span>
                      <span className="font-bold text-slate-900">{formatPrice(product.price * quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Grand Total</span>
                    <span className="text-amber-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition"
                >
                  <ShieldCheck className="w-5 h-5" /> Place Order ({formatPrice(grandTotal)})
                </button>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
