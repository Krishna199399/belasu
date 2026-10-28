'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  MessageCircle,
  BookOpen,
  Laptop,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/reader')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100 border-t border-amber-200/70 text-slate-700 font-sans relative overflow-hidden">
      {/* Main Footer Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        
        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-amber-200/60">
          
          {/* ── Column 1: Brand & Academic Mission (3.5 Cols) ── */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-flex group">
              <img
                src="/Belesu-logo1.png"
                alt="Belesu Logo"
                className="h-12 sm:h-14 object-contain transition transform group-hover:scale-[1.02]"
              />
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm font-normal">
              Empowering students and parents across Karnataka with English-translated Kannada guidebooks, bilingual workbooks, and high-speed digital readers for stress-free exam success.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100/70 border border-amber-200/80 text-amber-900 font-bold text-[11px]">
                <span>🌱</span>
                <span>ಕನ್ನಡ ಮಾತಾಡಿ, ಕನ್ನಡ ಬೆಳೆಸಿ</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                An initiative by <strong className="text-slate-800">Ckelp Technologies Private Limited</strong>.
              </p>
            </div>
          </div>

          {/* ── Column 2: Savi & Kali Kannada (2 Cols) ── */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-1 border-b border-stone-200/80">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Savi & Kali Series</span>
            </h4>
            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-1">
                  Savi Kannada (1–4)
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/books/savi-kannada-class-1" className="hover:text-amber-700 hover:underline transition">
                      Class 1 · Savi Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/savi-kannada-class-2" className="hover:text-amber-700 hover:underline transition">
                      Class 2 · Savi Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/savi-kannada-class-3" className="hover:text-amber-700 hover:underline transition">
                      Class 3 · Savi Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/savi-kannada-class-4" className="hover:text-amber-700 hover:underline transition">
                      Class 4 · Savi Kannada
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pt-1.5 border-t border-stone-200/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-1">
                  Kali Kannada (1–4)
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/books/kali-kannada-english-translated-innovative-guidebook-class-1" className="hover:text-amber-700 hover:underline transition">
                      Class 1 · Kali Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/kali-kannada-english-translated-innovative-guidebook-class-2" className="hover:text-amber-700 hover:underline transition">
                      Class 2 · Kali Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/kali-kannada-english-translated-innovative-guidebook-class-3" className="hover:text-amber-700 hover:underline transition">
                      Class 3 · Kali Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/kali-kannada-english-translated-innovative-guidebook-class-4" className="hover:text-amber-700 hover:underline transition">
                      Class 4 · Kali Kannada
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Column 3: Class 5 & Digital Readers (2 Cols) ── */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-1 border-b border-stone-200/80">
              <Laptop className="w-3.5 h-3.5 text-indigo-600" />
              <span>Class 5 & Digital</span>
            </h4>
            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                  Class 5 & Spoken
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/books/siri-kannada-english-translated-guidebook-class-5" className="hover:text-amber-700 hover:underline transition">
                      Class 5 · Siri Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/tili-kannada-english-translated-innovative-guidebook-class-5" className="hover:text-amber-700 hover:underline transition">
                      Class 5 · Tili Kannada
                    </Link>
                  </li>
                  <li>
                    <Link href="/books/a-destination-to-speak-kannada" className="hover:text-amber-700 hover:underline transition">
                      A Destination to Speak Kannada
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pt-1.5 border-t border-stone-200/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-1">
                  Digital Platform
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="/digital/kannada-class-6-guide"
                      className="hover:text-indigo-700 transition flex items-center gap-1 text-indigo-700 font-bold"
                    >
                      <span>Class 6 Digital Guide</span>
                      <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">Live</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/digital" className="hover:text-indigo-700 hover:underline transition">
                      Digital Readers Hub
                    </Link>
                  </li>
                  <li>
                    <Link href="/reader/kannada-class-6-guide?preview=true" className="hover:text-indigo-700 hover:underline transition">
                      Free 5-Page Preview
                    </Link>
                  </li>
                  <li className="pt-1">
                    <Link href="/books" className="text-amber-800 font-black hover:text-amber-900 transition flex items-center gap-1">
                      <span>Browse All 11 Books</span>
                      <span>→</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Column 4: Company & Legal Policies (2 Cols) ── */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-1 border-b border-stone-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Company & Legal</span>
            </h4>
            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                  Explore Belesu
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/about" className="hover:text-amber-700 hover:underline transition">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="hover:text-amber-700 hover:underline transition">
                      Our Academic Team
                    </Link>
                  </li>
                  <li>
                    <Link href="/videos" className="hover:text-amber-700 hover:underline transition">
                      Video Demonstrations
                    </Link>
                  </li>
                  <li>
                    <Link href="/reviews" className="hover:text-amber-700 hover:underline transition">
                      Parent & Student Reviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs" className="hover:text-amber-700 hover:underline transition">
                      FAQs & Help
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-amber-700 hover:underline transition">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pt-1.5 border-t border-stone-200/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                  Policies & Terms
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/policies/returns" className="hover:text-amber-700 hover:underline transition">
                      Returns & Refunds
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies/shipping" className="hover:text-amber-700 hover:underline transition">
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies/terms" className="hover:text-amber-700 hover:underline transition">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies/privacy" className="hover:text-amber-700 hover:underline transition">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Column 5: Offices, WhatsApp & Direct Connect (2.5 Cols) ── */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-stone-200/80">
              Offices & Support
            </h4>

            {/* Instant WhatsApp Card */}
            <a
              href="https://wa.me/919606636804?text=Hello%20Belesu%20Team,%20I%20would%20like%20to%20know%20more%20about%20your%20English-translated%20Kannada%20guidebooks."
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
                    WhatsApp Support
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
                <span>Call: <a href="tel:+919606636804" className="font-bold text-slate-900 hover:text-amber-600">+91 9606636804</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Email: <a href="mailto:kannada@belesu.in" className="font-bold text-slate-900 hover:text-amber-600">kannada@belesu.in</a></span>
              </div>
              
              {/* Offices */}
              <div className="space-y-1.5 pt-1 border-t border-stone-200/60 text-[11px] text-slate-500">
                <div className="text-[11px] font-bold text-slate-800 tracking-tight pb-0.5">
                  Belesu Offices: CKelp Technologies Pvt Ltd
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">Bangalore:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">Operations:</strong> VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018
                  </span>
                </div>
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
                href="https://wa.me/919606636804"
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

        {/* ── Sub-Footer Copyright & Payment Logos ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p className="text-center md:text-left">
            Designed and Developed by <strong className="text-slate-700 font-semibold">Korvion Media</strong>. © <strong className="text-slate-800">Belesu {currentYear}</strong>. All rights reserved.
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
