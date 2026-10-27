'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/reader')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/919606636804?text=Hello%20Belesu%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20English-translated%20Kannada%20guidebooks."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 sm:p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group min-w-[48px] min-h-[48px]"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
        WhatsApp Inquiry
      </span>
    </a>
  );
};
