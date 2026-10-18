'use client';

import React from 'react';
import { PARENT_REVIEWS } from '@/data/mockData';
import { Star, Quote, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ParentFeedbackSection: React.FC = () => {
  return (
    <section className="py-20 bg-amber-50/50 border-b border-amber-100/60">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Verified Parent Feedback
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-2">
              What Parents Say About <span className="text-amber-600">Belesu Books</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Over 5,000 families across Karnataka rely on Belesu guidebooks for stress-free Kannada study.
            </p>
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            Read All Reviews & Submit Feedback <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PARENT_REVIEWS.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-2xl border border-amber-200/60 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{review.date}</span>
                </div>

                <Quote className="w-8 h-8 text-amber-300/60 mb-2" />

                <p className="text-sm text-slate-700 leading-relaxed font-medium mb-6">
                  "{review.reviewText}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {review.parentName}
                    <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  </h3>
                  <p className="text-xs text-slate-600">{review.childGrade} • {review.location}</p>
                </div>
                {review.bookTitle && (
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1.5 rounded-xl">
                    {review.bookTitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
