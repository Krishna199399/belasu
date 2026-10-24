'use client';

import React from 'react';
import { BookOpen, HeartHandshake, Compass, ShieldCheck, Sparkles } from 'lucide-react';

interface SubSectionCard {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const subSections: SubSectionCard[] = [
  {
    step: '01',
    title: 'Understand Lessons Beyond the Classroom',
    description:
      'English translations and lesson explanations help students understand Kannada textbook content more clearly, making it easier to follow lessons and revise key concepts.',
    icon: BookOpen,
  },
  {
    step: '02',
    title: 'Make Home Learning More Supportive',
    description:
      'Give parents a practical way to support their child’s Kannada academic learning, even when they cannot independently explain every word or lesson in Kannada.',
    icon: HeartHandshake,
  },
  {
    step: '03',
    title: 'Encourage Independent Learning',
    description:
      'Help students revisit translated lessons at their own pace, explore meanings independently and practise Kannada outside classroom hours.',
    icon: Compass,
  },
  {
    step: '04',
    title: 'Build Confidence Through Understanding',
    description:
      'By connecting Kannada text with English translations, pronunciation guidance and exercise support, Belesu helps students approach academic Kannada with greater confidence.',
    icon: ShieldCheck,
  },
];

export const AcademicSupportSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-stone-50 via-white to-amber-50/20 py-12 sm:py-14 lg:py-16 border-b border-stone-200/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Introductory Context */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Bridging the Academic Gap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Making Kannada Learning Easier for Students and Parents
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-1">
            Learning Kannada as a school subject can be challenging when students struggle to understand
            the language or when parents are unfamiliar with Kannada. Belesu’s English-translated academic
            guidebooks help bridge this gap with additional support for understanding lessons, learning
            vocabulary, and preparing for schoolwork.
          </p>
        </div>

        {/* 4-Card Sub-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8 sm:mt-10">
          {subSections.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-amber-200/70 shadow-xs hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Step Index & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 tracking-wider">
                      Part {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Sub-heading (H3) */}
                  <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-amber-700 transition leading-snug mb-3">
                    {item.title}
                  </h3>

                  {/* Sub-section Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="pt-6">
                  <div className="w-8 h-1 bg-amber-400/40 rounded-full group-hover:w-16 group-hover:bg-amber-500 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
