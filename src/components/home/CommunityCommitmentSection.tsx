'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const CommunityCommitmentSection: React.FC = () => {
  const pillars = [
    {
      title: 'Language Preservation',
      iconImg: '/icons/1-1.png',
      desc: 'Encouraging younger generations to learn, understand, and use Kannada in education and everyday life.',
    },
    {
      title: 'Cultural Enrichment',
      iconImg: '/icons/2.png',
      desc: 'Helping learners connect with the Kannada language, literature, and the cultural heritage it carries.',
    },
    {
      title: 'Community Empowerment',
      iconImg: '/icons/3.png',
      desc: 'Supporting students, parents, and teachers with resources that make Kannada learning more accessible across diverse communities.',
    },
    {
      title: 'Visionary Leadership',
      iconImg: '/icons/4.png',
      desc: 'Exploring innovative educational approaches that help Kannada learning evolve with the needs of today’s students and families.',
    },
  ];

  return (
    <section className="bg-stone-50/70 py-12 sm:py-14 lg:py-16 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Community & Heritage</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Belesu’s Commitment to Kannada and Its Community
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal pt-1">
            Belesu believes Kannada learning can contribute to more than academic progress. It can help
            strengthen cultural connections, encourage communication, and create opportunities for more
            families to engage with the language.
          </p>
        </div>

        {/* 4 Pillars Grid with Original Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-7 bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-amber-50/80 border border-amber-200/80 flex items-center justify-center mb-5 shadow-xs hover:scale-110 transition-transform duration-300">
                <img
                  src={item.iconImg}
                  alt={item.title}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2.5">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
