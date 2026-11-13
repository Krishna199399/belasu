'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { BookProduct, DigitalBook, EnhancedCartItem, ProductType } from '@/types';
import { SHIPPING_FEE } from '@/lib/utils';

interface CartContextType {
  cart: EnhancedCartItem[];
  isOpen: boolean;
  sessionId: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: BookProduct | DigitalBook, productType: ProductType, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  
  // Helpers for mixed cart
  hasPhysicalBooks: () => boolean;
  hasDigitalBooks: () => boolean;
  getPhysicalItems: () => EnhancedCartItem[];
  getDigitalItems: () => EnhancedCartItem[];
  needsShipping: () => boolean;

  // Abandoned Cart Sync Engine
  syncCart: (customPhone?: string, customName?: string, customEmail?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<EnhancedCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const lastSyncHashRef = useRef<string>('');

  // 1. Initialize sessionId and load cart from localStorage on mount
  useEffect(() => {
    try {
      // Manage persistent session ID for abandoned cart tracking
      let storedSession = localStorage.getItem('belesu_cart_session_id');
      if (!storedSession) {
        storedSession = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('belesu_cart_session_id', storedSession);
      }
      setSessionId(storedSession);

      // Check if URL has a ?recover=SESSION_ID param
      const urlParams = new URLSearchParams(window.location.search);
      const recoverId = urlParams.get('recover');

      const savedCart = localStorage.getItem('belesu_cart_v2');
      let initialCart: EnhancedCartItem[] = [];
      if (savedCart) {
        initialCart = JSON.parse(savedCart);
      }

      if (recoverId && initialCart.length === 0) {
        // Fetch recovered cart from server
        fetch(`/api/cart/sync?sessionId=${encodeURIComponent(recoverId)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.cart) && data.cart.length > 0) {
              const restored = data.cart.map((item: any) => ({
                product: {
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  coverImage: item.coverImage,
                  sku: item.sku,
                  gradeClass: item.gradeClass || 0,
                  stockQuantity: 99,
                  inStock: true,
                },
                productType: item.productType || 'physical',
                quantity: item.quantity || 1,
              }));
              setCart(restored);
              toast.success(`Welcome back ${data.customerName || ''}! Your reserved cart has been restored.`);
            }
          })
          .catch(() => {});
      } else {
        setCart(initialCart);
      }
    } catch (e) {
      console.error('Failed to initialize cart:', e);
    }
    setIsInitialized(true);
  }, []);

  // 2. Save cart to localStorage on updates
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('belesu_cart_v2', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Total calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const hasPhysical = cart.some((item) => item.productType === 'physical');
  const shipping = hasPhysical ? SHIPPING_FEE : 0;
  const grandTotal = subtotal + shipping;

  // 3. Centralized Cart Sync Function (Abandoned Cart Engine)
  const syncCart = useCallback(
    async (customPhone?: string, customName?: string, customEmail?: string) => {
      if (!isInitialized || !sessionId) return;

      const phone =
        customPhone ||
        sessionStorage.getItem('belasu_auth_phone') ||
        localStorage.getItem('belasu_guest_phone') ||
        '';

      const name =
        customName ||
        sessionStorage.getItem('belasu_auth_name') ||
        localStorage.getItem('belasu_guest_name') ||
        'Customer';

      if (!phone || phone.replace(/\D/g, '').length < 10) return;

      // Remember contact details for subsequent cart changes
      if (customPhone) localStorage.setItem('belasu_guest_phone', customPhone);
      if (customName) localStorage.setItem('belasu_guest_name', customName);

      // Prevent duplicate identical sync calls
      const currentHash = `${phone}_${cart.length}_${totalItems}_${subtotal}`;
      if (currentHash === lastSyncHashRef.current) return;
      lastSyncHashRef.current = currentHash;

      try {
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            phone,
            name,
            email: customEmail,
            cart,
            subtotal,
            shippingFee: shipping,
            grandTotal,
          }),
        });
      } catch (err) {
        console.warn('[CartContext] Background sync notice:', err);
      }
    },
    [isInitialized, sessionId, cart, totalItems, subtotal, shipping, grandTotal]
  );

  // Debounced auto-sync when cart or contact changes
  useEffect(() => {
    if (!isInitialized || cart.length === 0) return;

    const timer = setTimeout(() => {
      syncCart();
    }, 1500);

    return () => clearTimeout(timer);
  }, [cart, isInitialized, syncCart]);

  // Tab unload / close safety beacon
  useEffect(() => {
    const handleUnload = () => {
      const phone = localStorage.getItem('belasu_guest_phone') || sessionStorage.getItem('belasu_auth_phone');
      if (phone && sessionId && cart.length > 0) {
        const payload = JSON.stringify({
          sessionId,
          phone,
          name: localStorage.getItem('belasu_guest_name') || 'Customer',
          cart,
          subtotal,
          shippingFee: shipping,
          grandTotal,
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/cart/sync', new Blob([payload], { type: 'application/json' }));
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionId, cart, subtotal, shipping, grandTotal]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: BookProduct | DigitalBook, productType: ProductType, quantity: number = 1) => {
    // Check out of stock for physical books
    if (productType === 'physical') {
      const book = product as BookProduct;
      if (book.stockQuantity <= 0 || book.inStock === false) {
        toast.error('Sorry, this book is currently out of stock.');
        return;
      }
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        // Digital books are single lifetime licenses
        if (productType === 'digital') {
          toast('This digital book is already in your cart', { icon: 'ℹ️' });
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, productType, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const hasPhysicalBooks = () => cart.some((item) => item.productType === 'physical');
  const hasDigitalBooks = () => cart.some((item) => item.productType === 'digital');
  const getPhysicalItems = () => cart.filter((item) => item.productType === 'physical');
  const getDigitalItems = () => cart.filter((item) => item.productType === 'digital');
  const needsShipping = () => hasPhysicalBooks();

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        sessionId,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        hasPhysicalBooks,
        hasDigitalBooks,
        getPhysicalItems,
        getDigitalItems,
        needsShipping,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
