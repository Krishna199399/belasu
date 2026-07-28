'use client';

import React from 'react';
import { BookCheck, Languages, HelpCircle, GraduationCap, Sparkles, HeartHandshake } from 'lucide-react';

export const WhyChooseBelesu: React.FC = () => {
  const features = [
    {
      icon: Languages,
      title: 'Line-by-Line English Translation',
      description: 'Every lesson, poem, and prose piece is rendered with parallel English translation, ensuring non-Kannadiga parents can guide their children effortlessly.'
    },
    {
      icon: GraduationCap,
      title: '100% State Syllabus Aligned',
      description: 'Covers the exact school curriculum for Savi, Kali, Siri, and Tili Kannada textbooks across Classes 1, 2, 3, 4, and 5.'
    },
    {
      icon: HelpCircle,
      title: 'Solved Textbook Exercise Answers',
      description: 'Complete doubt-solving section with step-by-step answers for all textbook questions, grammar exercises, and exam preparation.'
    },
    {
      icon: BookCheck,
      title: 'Pronunciation & Vocabulary Keys',
      description: 'Features English script transliteration for difficult Kannada words, enabling accurate pronunciation and vocabulary building.'
    },
    {
      icon: HeartHandshake,
      title: 'Designed for Home Learning Ease',
      description: 'Eliminates the requirement for expensive private home tutors by giving parents complete clarity over daily school homework.'
    },
    {
      icon: Sparkles,
      title: 'Research-Backed Methodology',
      description: 'Developed under Founder Roopa Sanjiv P’s extensive field research with children, parents, and primary school teachers across Karnataka.'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
            Why Belesu Is Loved By Families
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Bridging School Curricula with <span className="text-amber-600">Home Learning</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Discover how Belesu guidebooks remove language barriers and transform academic stress into student success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-amber-600 transition">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
