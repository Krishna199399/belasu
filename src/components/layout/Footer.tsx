'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  BookOpen,
  Truck,
  Sparkles,
  ArrowUpRight,
  Clock,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/reader')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100 border-t border-amber-200/70 text-slate-700 font-sans relative overflow-hidden">
      {/* Top Value / Trust Pillars Strip */}
      <div className="border-b border-amber-200/50 bg-white/70 backdrop-blur-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Karnataka Board Aligned</h5>
                <p className="text-[11px] text-slate-500 leading-snug">Strictly tailored to state syllabus</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Instant Digital Reader</h5>
                <p className="text-[11px] text-slate-500 leading-snug">Read online immediately with zero wait</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Fast Doorstep Delivery</h5>
                <p className="text-[11px] text-slate-500 leading-snug">Tracked dispatch across Karnataka</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">100% Secure Checkout</h5>
                <p className="text-[11px] text-slate-500 leading-snug">UPI, Cards & NetBanking encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-amber-200/60">
          
          {/* Column 1: Brand & Academic Mission (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex group">
              <img
                src="/Belesu-logo1.png"
                alt="Belesu Logo"
                className="h-12 sm:h-14 object-contain transition transform group-hover:scale-[1.02]"
              />
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Empowering students and parents across Karnataka with English-translated Kannada guidebooks, bilingual workbooks, and high-speed digital readers for stress-free exam success.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100/70 border border-amber-200/80 text-amber-900 font-bold text-[11px]">
                <span>🌱</span>
                <span>ಕನ್ನಡ ಮಾತಾಡಿ, ಕನ್ನಡ ಬೆಳೆಸಿ</span>
              </div>
              <p className="text-[11px] text-slate-500">
                An initiative by <strong className="text-slate-800">Ckelp Technologies Private Limited</strong>.
                <br />Incubated at <strong className="text-slate-800">Deshpande Startups</strong>.
              </p>
            </div>
          </div>

          {/* Column 2: Academics & Guidebooks (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              Academics
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link
                  href="/digital/kannada-class-6-guide"
                  className="hover:text-amber-600 transition flex items-center gap-1 text-amber-700 font-bold"
                >
                  <span>Class 6 Digital Reader</span>
                  <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full uppercase">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-amber-600 transition">
                  Printed Guidebooks
                </Link>
              </li>
              <li>
                <Link href="/digital" className="hover:text-amber-600 transition">
                  Digital Books Platform
                </Link>
              </li>
              <li>
                <Link href="/reader/kannada-class-6-guide?preview=true" className="hover:text-amber-600 transition">
                  Free 5-Page Preview
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-amber-600 transition">
                  Video Demonstration Reels
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-amber-600 transition">
                  Parent Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Policies (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/about" className="hover:text-amber-600 transition">
                  About Belesu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-600 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-amber-600 transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-amber-600 transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-amber-600 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-amber-600 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Offices, WhatsApp & Direct Connect (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Get in Touch
            </h4>

            {/* Instant WhatsApp Card */}
            <a
              href="https://wa.me/919902383451"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    WhatsApp Academic Support
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">Quick answers for parents & teachers</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </a>

            {/* Direct Contacts */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Call: <a href="tel:+919902383451" className="font-bold text-slate-900 hover:text-amber-600">+91 9902383451</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Email: <a href="mailto:kannada@belesu.in" className="font-bold text-slate-900 hover:text-amber-600">kannada@belesu.in</a></span>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">Bangalore:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
                </span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">Registered:</strong> Deshpande Startups, Gokul Road, Hubballi - 580030
                </span>
              </div>
            </div>

            {/* Social Icons Bar */}
            <div className="pt-2 flex items-center gap-2.5">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-500 hover:text-white text-slate-600 flex items-center justify-center transition shadow-xs"
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
                className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-500 hover:text-white text-slate-600 flex items-center justify-center transition shadow-xs"
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
                className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-500 hover:text-white text-slate-600 flex items-center justify-center transition shadow-xs"
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
                className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:border-emerald-400 hover:bg-emerald-600 hover:text-white text-slate-600 flex items-center justify-center transition shadow-xs"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Sub-Footer Copyright & Payment Logos */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p className="text-center md:text-left">
            Designed and Developed by Krishna. © <strong className="text-slate-800">Belesu {new Date().getFullYear()}</strong>. All rights reserved.
          </p>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="px-2.5 py-1 bg-white text-slate-800 rounded-md text-[10px] font-black uppercase tracking-wider border border-stone-200 shadow-2xs">
              UPI
            </span>
            <span className="px-2.5 py-1 bg-white text-slate-800 rounded-md text-[10px] font-black uppercase tracking-wider border border-stone-200 shadow-2xs">
              RuPay
            </span>
            <span className="px-2.5 py-1 bg-white text-slate-800 rounded-md text-[10px] font-black uppercase tracking-wider border border-stone-200 shadow-2xs">
              Visa
            </span>
            <span className="px-2.5 py-1 bg-white text-slate-800 rounded-md text-[10px] font-black uppercase tracking-wider border border-stone-200 shadow-2xs">
              MasterCard
            </span>
            <span className="px-2.5 py-1 bg-white text-slate-800 rounded-md text-[10px] font-black uppercase tracking-wider border border-stone-200 shadow-2xs">
              NetBanking
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-200 shadow-2xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Razorpay Secured
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
