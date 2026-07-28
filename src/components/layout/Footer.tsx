'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 text-slate-700 pt-16 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200">
          
          {/* Column 1: Brand & Office Details (5 Cols) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            {/* Logo Header */}
            <Link href="/" className="inline-flex group">
              <img
                src="/Belesu-logo1.png"
                alt="Belesu Logo"
                className="h-12 sm:h-14 md:h-16 object-contain self-start"
              />
            </Link>

            {/* Corporate Info Block */}
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-sans pt-2">
              <p className="font-bold text-slate-900">
                Belesu - A Kannada Initiative for Academics and Communication
              </p>
              <p>
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore- 562125
              </p>
              <p className="font-extrabold text-slate-900 pt-1">
                CKELP TECHNOLOGIES PRIVATE LIMITED
              </p>
              <p>
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>
          </div>

          {/* Column 2: Useful Links (3 Cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-stone-200 pb-2 inline-block">
              USEFUL LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/" className="hover:text-amber-600 transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-600 transition">About us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-600 transition">Contact Us</Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-amber-600 transition">Returns</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-amber-600 transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-amber-600 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-amber-600 transition">Shipping Policy</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us & Direct Contact (4 Cols) */}
          <div className="md:col-span-3 lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-stone-200 pb-2 inline-block">
                FOLLOW US
              </h4>
              
              {/* Social Icons Bar (Inline SVGs for 100% stability) */}
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919902383451"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 flex items-center justify-center transition"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Direct Contact Phone & Email */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Phone: <a href="tel:+919902383451" className="font-bold text-slate-800 hover:text-amber-600">+91 9902383451</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email: <a href="mailto:kannada@belesu.in" className="font-bold text-slate-800 hover:text-amber-600">kannada@belesu.in</a></span>
              </div>
            </div>

          </div>

        </div>

        {/* Sub-Footer Copyright & Payment Logos */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p>
            Designed and Developed by Krishna. © <strong>Belesu {new Date().getFullYear()}</strong>.
          </p>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
              VISA
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
              MasterCard
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
              PayPal
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
              AMEX
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
              UPI
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
