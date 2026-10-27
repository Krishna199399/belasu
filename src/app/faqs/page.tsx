'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What if I receive a damaged or defective book?',
      answer: 'We take utmost care to ensure all Belesu guidebooks are printed and shipped in pristine condition. However, if you receive a damaged or defective copy, please notify our customer support on WhatsApp within 48 hours. We will immediately arrange a replacement free of charge.'
    },
    {
      question: 'How long will doorstep delivery take across Karnataka?',
      answer: 'Orders are dispatched within 24 hours of placement. Delivery typically takes 2 to 4 business days for major cities like Bengaluru, Mysuru, Hubballi, and Mangaluru, and 3 to 5 business days for rural pincodes across Karnataka.'
    },
    {
      question: 'Are Belesu books 100% aligned with the Karnataka State Board syllabus?',
      answer: 'Yes! Belesu guidebooks for Savi Kannada, Kali Kannada, Siri Kannada, and Tili Kannada (Classes 1-5) strictly mirror the latest Karnataka State Department of School Education & Literacy syllabus.'
    },
    {
      question: 'Can non-Kannadiga parents teach their children using these guidebooks?',
      answer: 'Absolutely! Our books feature line-by-line English translations, English transliteration (pronunciation key in English script), and solved textbook answers, making it effortless for non-native parents to assist with homework.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).'
    },
    {
      question: 'Can I order books in bulk for a school or learning center?',
      answer: 'Yes, we offer bulk academic discounts for schools and educational institutions. Please contact our support team at +91 96066 36804 or email kannada@belesu.in for custom quotes.'
    }
  ];

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Shopping & Academic Help
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked <span className="text-amber-600">Questions</span>
          </h1>
          <p className="text-base text-slate-600">
            Everything you need to know about Belesu guidebooks, ordering, and delivery.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-6 min-h-[56px] text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:text-amber-600 transition cursor-pointer active:bg-slate-50"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-emerald-900">Still have questions?</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Our support team is available on WhatsApp to help you choose the right guidebook for your child.
          </p>
          <a
            href="https://wa.me/919606636804?text=Hello%20Belesu,%20I%20have%20a%20question."
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-98"
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp (+91 96066 36804)
          </a>
        </div>

      </div>
    </div>
  );
}
