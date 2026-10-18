import React from 'react';

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-5">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase">Legal</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Terms & Conditions</h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Welcome to Belesu.in. By placing an order or browsing our platform, you agree to comply with our terms of service regarding academic content usage, ordering, and delivery.
            </p>
            <h3 className="font-bold text-slate-900 text-base">Intellectual Property</h3>
            <p>
              All Belesu English translations, word dictionaries, layout designs, and research compilations are protected under copyright laws. Unauthorized reproduction or resale is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
