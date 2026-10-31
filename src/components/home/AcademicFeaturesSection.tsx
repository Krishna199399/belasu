'use client';

import React from 'react';
import { Languages, BookCheck, HeartHandshake, Sparkles } from 'lucide-react';

interface LearningSupportItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const supportItems: LearningSupportItem[] = [
  {
    title: 'English Translations',
    description: 'Help students understand Kannada words, sentences and lessons.',
    icon: Languages,
  },
  {
    title: 'Lesson and Exercise Support',
    description: "Reinforce learning alongside prescribed textbooks, according to each book's contents.",
    icon: BookCheck,
  },
  {
    title: 'Learning Like a Teacher',
    description: "Help parents support their children's Kannada studies.",
    icon: HeartHandshake,
  },
];

export const AcademicFeaturesSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 bg-white border-b border-stone-200">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Compact) */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-6 sm:mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Academic Support</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Support for Learning Kannada
          </h2>
        </div>

        {/* 3 Pillars (Sleek Horizontal Feature Strip) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
          {supportItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-gradient-to-br from-stone-50/80 to-white hover:from-white hover:to-amber-50/30 rounded-xl p-4 sm:p-4.5 border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100/80 text-amber-800 border border-amber-300/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200 shadow-2xs mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 group-hover:text-amber-900 transition-colors leading-snug mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
