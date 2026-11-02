'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, HeartHandshake, Share2, ArrowRight } from 'lucide-react';

interface BrandTenet {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  illustration: string;
  illustrationAlt: string;
}

const tenets: BrandTenet[] = [
  {
    title: 'Created Around a Real Learning Need',
    description:
      'Belesu grew from an effort to understand the challenges students and families face when Kannada lessons are difficult to follow at home.',
    icon: Compass,
    illustration: '/why-belesu/books.png',
    illustrationAlt: 'Stack of books representing real learning needs',
  },
  {
    title: 'Focused on Understanding, Not Just Memorisation',
    description:
      'English translations and lesson explanations, where included, help students connect with the meaning of Kannada content rather than relying only on memorisation.',
    icon: BookOpen,
    illustration: '/why-belesu/bulb.png',
    illustrationAlt: 'Lightbulb representing deep conceptual understanding',
  },
  {
    title: 'Designed to Support Learning at Home',
    description:
      'Our guidebooks help parents follow school lessons and provide additional academic support, even when Kannada is not the main language spoken at home.',
    icon: HeartHandshake,
    illustration: '/why-belesu/house.png',
    illustrationAlt: 'Family home representing home learning support',
  },
  {
    title: 'Built Around a Broader Language Vision',
    description:
      'Belesu aims to make Kannada academic learning more accessible while encouraging students and families to build a stronger connection with the language.',
    icon: Share2,
    illustration: '/why-belesu/karnataka.png',
    illustrationAlt: 'Karnataka map with heritage Vidhana Soudha and flag',
  },
];

export const WhyChooseBelesu: React.FC = () => {
  return (
    <section className="relative py-10 sm:py-14 lg:py-18 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF2] to-[#FFF8EA] border-b border-amber-100/70 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header matching Belesu mobile & desktop reference verbatim */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-7 sm:mb-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#B45309] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
            <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2" />
              <circle cx="5" cy="18" r="2" />
              <circle cx="19" cy="18" r="2" />
              <path d="M12 7v5" />
              <path d="m12 12-5 4" />
              <path d="m12 12 5 4" />
            </svg>
            <span>The Belesu Difference</span>
          </div>

          {/* Heading with Decorative Radiant Rays */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1">
            {/* Left Rays */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="5" y1="5" x2="10" y2="9" />
              <line x1="5" y1="19" x2="10" y2="15" />
            </svg>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Why Belesu?
            </h2>

            {/* Right Rays */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="21" y1="12" x2="15" y2="12" />
              <line x1="19" y1="5" x2="14" y2="9" />
              <line x1="19" y1="19" x2="14" y2="15" />
            </svg>
          </div>

          {/* Subtitle verbatim */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto pt-0.5">
            Belesu helps make academic Kannada easier to understand through English-translated learning resources for students and families.
          </p>
        </div>

        {/* 4 Cards Grid: 1 column on Mobile, 2x2 Balanced Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 max-w-5xl mx-auto">
          {tenets.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border border-amber-100/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 group"
              >
                {/* Left Icon Container */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-100 transition-transform duration-200">
                  <Icon className="w-5 h-5 text-amber-700" />
                </div>

                {/* Middle Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug mb-1 group-hover:text-amber-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Right Thematic Illustration */}
                <div className="shrink-0 w-20 sm:w-24 lg:w-28 flex items-center justify-end">
                  <img
                    src={item.illustration}
                    alt={item.illustrationAlt}
                    className="w-full max-h-16 sm:max-h-20 lg:max-h-24 object-contain select-none group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button verbatim */}
        <div className="text-center pt-8 sm:pt-10">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all transform active:scale-95"
          >
            <span>About Belesu</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Link>
        </div>

      </div>
    </section>
  );
};
