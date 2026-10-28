'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, needsShipping } = useCart();
  const shippingFee = needsShipping() ? 45 : 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="py-8 sm:py-12 md:py-20 bg-slate-50 min-h-screen pb-28 lg:pb-12">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" /> Shopping Cart ({totalItems} items)
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your shopping cart is empty</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Explore our English translated Kannada guidebooks for Classes 1 to 5 and add them to your cart.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition text-xs shadow-md min-h-[44px]"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map(({ product, quantity, productType }) => (
                <div
                  key={product.id}
                  className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg inline-block">
                        Class {product.gradeClass} {productType === 'physical' && 'series' in product && `(${product.series} - Hard Copy)`}
                        {productType === 'digital' && ' - Digital'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base leading-snug mt-1 max-w-md line-clamp-2">
                        {product.title}
                      </h3>
                      <span className="text-xs sm:text-sm font-black text-amber-600 block mt-1">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {productType === 'physical' ? (
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-slate-100 text-slate-600 transition cursor-pointer active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 sm:px-3 text-xs sm:text-sm font-bold text-slate-900 font-mono">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-slate-100 text-slate-600 transition cursor-pointer active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="text-[10px] sm:text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg">
                          💻 Digital License
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-600 mt-0.5">Qty: 1</span>
                      </div>
                    )}

                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-slate-900 block">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="min-h-[36px] px-2 py-0.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition inline-flex items-center gap-1 mt-0.5 cursor-pointer"
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
              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-slate-900">
                      {shippingFee > 0 ? formatPrice(shippingFee) : '₹0'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full min-h-[48px] py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition active:scale-98"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 pb-safe z-40 shadow-xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-black text-amber-600 leading-tight">
              {formatPrice(grandTotal)}
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate">
              {shippingFee > 0 ? `+ ${formatPrice(shippingFee)} Shipping` : 'Instant Digital Delivery'}
            </div>
          </div>
          <Link
            href="/checkout"
            className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shrink-0"
          >
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
