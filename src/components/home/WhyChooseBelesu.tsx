'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, BookOpen, Sparkles, Compass, ArrowRight } from 'lucide-react';

interface BrandTenet {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tenets: BrandTenet[] = [
  {
    title: 'Created Around a Real Learning Need',
    description:
      'Belesu grew from an effort to understand the challenges students and families face when Kannada lessons are difficult to follow at home.',
    icon: Compass,
  },
  {
    title: 'Focused on Understanding, Not Just Memorisation',
    description:
      'English translations and lesson explanations, where included, help students connect with the meaning of Kannada content rather than relying only on memorisation.',
    icon: BookOpen,
  },
  {
    title: 'Designed to Support Learning at Home',
    description:
      'Our guidebooks help parents follow school lessons and provide additional academic support, even when Kannada is not the main language spoken at home.',
    icon: HeartHandshake,
  },
  {
    title: 'Built Around a Broader Language Vision',
    description:
      'Belesu aims to make Kannada academic learning more accessible while encouraging students and families to build a stronger connection with the language.',
    icon: Sparkles,
  },
];

export const WhyChooseBelesu: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim (Compact) */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-5 sm:mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>The Belesu Difference</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Why Belesu?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            Belesu helps make academic Kannada easier to understand through English-translated learning resources for students and families.
          </p>
        </div>

        {/* 4 Tenets Grid (Compact & Balanced) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {tenets.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>

                  <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 group-hover:text-amber-800 transition leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3">
                  <div className="w-6 h-0.5 bg-amber-400/40 rounded-full group-hover:w-12 group-hover:bg-amber-500 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button matching home page.md (Compact) */}
        <div className="text-center pt-5 sm:pt-6">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition transform active:scale-95"
          >
            About Belesu <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
};
