'use client';

import React from 'react';
import { GraduationCap, Award, Languages, HeartHandshake, Users, Sparkles } from 'lucide-react';

interface LearningNeedItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const learningNeeds: LearningNeedItem[] = [
  {
    title: 'Students in English-Medium Schools',
    description:
      'English-translated Kannada guidebooks help students understand Kannada lessons, learn new vocabulary, and strengthen their academic learning alongside their regular schoolwork.',
    icon: GraduationCap,
    tag: 'Academic Fluency',
  },
  {
    title: 'CBSE, ICSE, IG and State Board Students',
    description:
      'Belesu guidebooks provide supplementary Kannada academic support for students across different school boards, depending on the book and prescribed textbook.',
    icon: Award,
    tag: 'Multi-Board Support',
  },
  {
    title: 'Non-Kannada-Speaking Families',
    description:
      'English translations, lesson explanations, and pronunciation guidance help families understand Kannada lessons and support their children’s language learning at home.',
    icon: Languages,
    tag: 'Zero Language Barrier',
  },
  {
    title: 'Parents Supporting Academic Learning at Home',
    description:
      'Belesu helps parents follow Kannada lessons, understand textbook exercises, and support their children’s revision and academic preparation beyond school hours.',
    icon: HeartHandshake,
    tag: 'Home Learning Ease',
  },
  {
    title: 'Teachers Supporting Kannada Language Development',
    description:
      'Teachers can use suitable supplementary guidebooks to reinforce Kannada lessons, explain vocabulary, support classroom revision, and strengthen students’ academic understanding.',
    icon: Users,
    tag: 'Classroom Aid',
  },
  {
    title: 'Students Building Everyday Kannada',
    description:
      'Beyond academic learning, Belesu aims to help students develop a stronger connection with Kannada and build confidence in everyday language and communication.',
    icon: Sparkles,
    tag: 'Daily Confidence',
  },
];

export const LearningNeedsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-white border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            Personalized Curriculum Support
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Designed for Different Kannada Learning Needs
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-1">
            Belesu’s innovative guidebooks are designed to support students learning Kannada as part of
            their school curriculum, while also helping parents and teachers participate more
            effectively in the learning process.
          </p>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
          {learningNeeds.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-stone-50/70 hover:bg-white rounded-2xl p-7 border border-stone-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-md">
                      {item.tag}
                    </span>
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
      </div>
    </section>
  );
};
