import React from 'react';

export default function ReturnsPolicyPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-5">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase">Customer Guarantee</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Returns & Replacement Policy</h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="font-bold text-slate-900 text-base">Damaged or Defective Items</h3>
            <p>
              We take utmost pride in the printing and binding quality of Belesu academic guidebooks. If you receive a damaged, torn, or defective book, we will replace it immediately free of charge.
            </p>

            <h3 className="font-bold text-slate-900 text-base">7-Day Replacement Window</h3>
            <p>
              Please report any issue within 7 days of receiving your package by contacting our support team on WhatsApp at +91 99023 83451 or via email at kannada@belesu.in along with photos of the damaged item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
