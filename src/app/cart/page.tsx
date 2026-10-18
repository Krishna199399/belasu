'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, needsShipping } = useCart();
  const freeShippingThreshold = 500;
  const isFreeShipping = subtotal >= freeShippingThreshold || !needsShipping();
  const shippingFee = (needsShipping() && !isFreeShipping) ? 45 : 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-amber-600" /> Shopping Cart ({totalItems} items)
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your shopping cart is empty</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Explore our English translated Kannada guidebooks for Classes 1 to 5 and add them to your cart.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition text-xs shadow-md"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map(({ product, quantity, productType }) => (
                <div
                  key={product.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                        Class {product.gradeClass} {productType === 'physical' && 'series' in product && `(${product.series} - Hard Copy)`}
                        {productType === 'digital' && ' - Digital'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug mt-1 max-w-md">
                        {product.title}
                      </h3>
                      <span className="text-sm font-black text-amber-600 block mt-1">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {productType === 'physical' ? (
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-bold text-slate-900">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-2 hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
                          💻 Digital License
                        </div>
                        <span className="text-xs text-slate-600 mt-1">Quantity: 1</span>
                      </div>
                    )}

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-emerald-600">
                      {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
