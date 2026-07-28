'use client';

import React from 'react';
import { XCircle, CheckCircle2, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisons = [
    {
      feature: 'Annual Expense',
      tuition: '₹12,000 – ₹18,000 per year for private tutors',
      belesu: '₹250 – ₹295 one-time book purchase',
      winner: 'belesu'
    },
    {
      feature: 'Parent Involvement',
      tuition: 'Parents remain in the dark about actual daily progress',
      belesu: 'Parents can directly verify & teach using line-by-line English translation',
      winner: 'belesu'
    },
    {
      feature: 'Homework Stress',
      tuition: 'Late night arguments & anxiety over Kannada assignments',
      belesu: 'Instant answer keys & English notes eliminate homework anxiety',
      winner: 'belesu'
    },
    {
      feature: 'Pronunciation Assistance',
      tuition: 'Limited to 1 hour daily tutor session',
      belesu: '24/7 access to English script transliteration key',
      winner: 'belesu'
    },
    {
      feature: 'Exam Preparation',
      tuition: 'Rushed last-minute cramming',
      belesu: 'Complete solved textbook question bank for confident exam prep',
      winner: 'belesu'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> Save Money & Remove Stress
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Traditional Home Tuition vs. <span className="text-amber-400">Belesu Guidebooks</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            See why thousands of parents across Karnataka switch from expensive home tuitions to Belesu study workbooks.
          </p>
        </div>

        {/* Comparison Table / Grid */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 bg-slate-950 p-4 sm:p-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b border-slate-800 text-slate-400">
            <div className="col-span-4">Feature / Need</div>
            <div className="col-span-4 text-rose-400">Private Home Tuition</div>
            <div className="col-span-4 text-emerald-400 flex items-center gap-1">
              Belesu Books <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {comparisons.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 sm:p-6 items-center text-xs sm:text-sm gap-2">
                <div className="col-span-4 font-bold text-white leading-tight">
                  {item.feature}
                </div>

                <div className="col-span-4 text-slate-400 flex items-start gap-2 pr-2">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{item.tuition}</span>
                </div>

                <div className="col-span-4 text-emerald-300 font-semibold flex items-start gap-2 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item.belesu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
