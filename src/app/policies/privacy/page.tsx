import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-5">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase">Data Protection</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Privacy Policy</h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              At Belesu, we respect your privacy and are committed to protecting the personal data of our customers and students.
            </p>
            <h3 className="font-bold text-slate-900 text-base">Information Collection</h3>
            <p>
              We collect your name, shipping address, phone number, and email address solely for order processing and delivery updates. We do not sell or share customer information with third-party advertisers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
