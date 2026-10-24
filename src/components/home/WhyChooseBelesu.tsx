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
    <section className="py-12 sm:py-14 lg:py-16 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>The Belesu Difference</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Why Belesu?
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal pt-1">
            Belesu brings together language learning and academic support to help students understand
            Kannada more clearly. Our approach recognises that students may need additional guidance and
            that parents also need accessible ways to participate in their child’s learning journey.
          </p>
        </div>

        {/* 4 Tenets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {tenets.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-stone-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-amber-700 transition leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6">
                  <div className="w-8 h-1 bg-amber-400/30 rounded-full group-hover:w-16 group-hover:bg-amber-500 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button matching Belesu - Contents.md */}
        <div className="text-center pt-12">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-sm rounded-xl shadow-xs transition transform active:scale-95"
          >
            Learn More About Belesu <ArrowRight className="w-4 h-4 text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
};
