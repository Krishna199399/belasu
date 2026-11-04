import React from 'react';
import Link from 'next/link';
import { BookOpen, Home, ArrowRight, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | Belesu Academic Publishers',
  description: 'The requested page could not be found. Explore Belesu Kannada academic guidebooks and learning resources.',
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-stone-50">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
        {/* Badge & Decorative Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-800" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            404 — Page Moved or Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Looking for Our Kannada Guidebooks?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            We have recently revamped the Belesu bookstore with a brand-new experience. The old page link you followed may have moved or been updated.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/books/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <span>Explore All 11 Guidebooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-slate-800 font-bold text-xs uppercase tracking-wider border border-stone-200 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>

        {/* Help Banner */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <p className="text-xs font-bold text-slate-800">Need help finding a specific book?</p>
            <p className="text-[11px] text-slate-500">Class 1 to 5 Savi, Kali, Siri, Tili guides available.</p>
          </div>
          <a
            href="https://wa.me/918105829199?text=Hi%20Belesu,%20I%20am%20looking%20for%20a%20guidebook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

