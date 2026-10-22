'use client';

import React from 'react';
import Link from 'next/link';
import { Languages, HelpCircle, BookCheck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AcademicFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: AcademicFeature[] = [
  {
    title: 'English Translation for Better Understanding',
    description:
      'English-translated lesson content helps students understand Kannada words, sentences and chapters more clearly. This additional support can make academic Kannada easier to follow, particularly for learners who are more comfortable studying in English.',
    icon: Languages,
  },
  {
    title: 'Accurate Pronunciation and Vocabulary Support',
    description:
      'Pronunciation guidance and explanations of word meanings, where included, help students learn Kannada vocabulary and develop a better understanding of how words are read and used.',
    icon: HelpCircle,
  },
  {
    title: 'Chapter-Wise Learning and Exercise Support',
    description:
      'Chapter-wise translations and exercise guidance, where provided, help students follow their lessons, practise relevant questions, and revise academic content.',
    icon: BookCheck,
  },
  {
    title: 'A Supplement to Prescribed Textbooks',
    description:
      'Belesu guidebooks are designed to support learning alongside school textbooks. They provide additional explanations and academic help without replacing the prescribed curriculum or the role of classroom teaching.',
    icon: ShieldCheck,
  },
];

export const AcademicFeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Academic Methodology</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            How Belesu Guidebooks Support Kannada Academic Learning
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal pt-1">
            Belesu’s innovative guidebooks supplement prescribed Kannada textbooks by helping students
            understand lessons, practise language skills, and work through academic exercises. Each book
            has its own features, so explore the individual product details to find the most suitable
            learning support.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-stone-50/70 hover:bg-white rounded-2xl p-7 border border-stone-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition transform active:scale-95 uppercase tracking-wider"
          >
            Explore Kannada Academic Guidebooks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
