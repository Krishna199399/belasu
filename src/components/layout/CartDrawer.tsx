'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice, SHIPPING_FEE } from '@/lib/utils';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const pathname = usePathname();
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalItems, needsShipping } = useCart();
  const shippingFee = needsShipping() ? SHIPPING_FEE : 0;

  // Prevent background website scrolling when cart drawer is open (Bulletproof mobile iOS/Android + desktop)
  React.useEffect(() => {
    if (!isOpen) return;

    // Capture current scroll offset
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Compensate for scrollbar disappearing on desktop to avoid layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Freeze body in place at the current viewport position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      // Revert styles
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;

      // Restore previous scroll position seamlessly
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen || pathname?.startsWith('/admin')) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden overscroll-none select-none"
      style={{ overscrollBehavior: 'none' }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in select-none"
        onClick={closeCart}
        onTouchMove={(e) => e.preventDefault()}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overscroll-contain"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header */}
          <div
            className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0 select-none touch-none"
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Your Cart ({totalItems})</h3>
            </div>
            <button
              onClick={closeCart}
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div
            className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            {cart.length === 0 ? (
              <div
                className="text-center py-12 flex flex-col items-center justify-center my-auto select-none"
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">
                  Discover English translated Kannada guidebooks designed for Classes 1 to 5.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition cursor-pointer min-h-[44px]"
                >
                  Explore Books Catalog
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity, productType }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition"
                >
                  <div className="w-16 h-20 bg-white rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                          {product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                        Class {product.gradeClass} {productType === 'physical' && 'series' in product && `(${product.series} - Hard Copy)`}
                        {productType === 'digital' && ' - Digital'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-amber-700">
                        {formatPrice(product.price * quantity)}
                      </span>

                      {productType === 'physical' ? (
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-slate-900">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                            💻 Digital License
                          </div>
                          <span className="text-xs text-slate-600 mt-0.5">Qty: 1</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div
              className="p-4 sm:p-5 pb-safe border-t border-slate-200 bg-white space-y-4 shrink-0 select-none"
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">{shippingFee === 0 ? '₹0' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-amber-600">{formatPrice(subtotal + shippingFee)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition text-sm min-h-[48px]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center py-2 text-xs font-semibold text-slate-600 hover:text-amber-600 transition min-h-[40px] flex items-center justify-center"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
