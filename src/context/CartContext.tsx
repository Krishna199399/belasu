'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookProduct, DigitalBook, EnhancedCartItem, ProductType } from '@/types';

interface CartContextType {
  cart: EnhancedCartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: BookProduct | DigitalBook, productType: ProductType, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  
  // New helpers for mixed cart
  hasPhysicalBooks: () => boolean;
  hasDigitalBooks: () => boolean;
  getPhysicalItems: () => EnhancedCartItem[];
  getDigitalItems: () => EnhancedCartItem[];
  needsShipping: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<EnhancedCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('belesu_cart_v2');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on updates
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('belesu_cart_v2', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: BookProduct | DigitalBook, productType: ProductType, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
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

  // Helper methods for mixed cart
  const hasPhysicalBooks = () => {
    return cart.some(item => item.productType === 'physical');
  };

  const hasDigitalBooks = () => {
    return cart.some(item => item.productType === 'digital');
  };

  const getPhysicalItems = () => {
    return cart.filter(item => item.productType === 'physical');
  };

  const getDigitalItems = () => {
    return cart.filter(item => item.productType === 'digital');
  };

  const needsShipping = () => {
    return hasPhysicalBooks();
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
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
