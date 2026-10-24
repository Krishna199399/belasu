'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Compass, Sparkles } from 'lucide-react';

export const ElevatingKannadaSection: React.FC = () => {
  const visionPoints = [
    {
      title: 'Connecting Academic Learning with Everyday Life',
      desc: 'By helping students read, write, understand, and communicate in Kannada, Belesu hopes to strengthen their connection with the language, both as a school subject and as part of Karnataka’s cultural life.',
      icon: BookOpen,
    },
    {
      title: 'Building a Stronger Learning Ecosystem',
      desc: 'Students, parents, and teachers all play an important role in language learning. Belesu works to bridge home and school learning by making academic Kannada more approachable and helping families participate more confidently.',
      icon: Users,
    },
    {
      title: 'Supporting Kannada for Future Generations',
      desc: 'Our long-term vision is to help more young learners build a lasting relationship with Kannada and encourage its continued use in education, communication, and everyday life across Karnataka.',
      icon: Compass,
    },
  ];

  return (
    <section className="bg-stone-50/70 py-12 sm:py-14 lg:py-16 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Vision & Cultural Impact</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Elevating Kannada Across Karnataka
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal pt-1">
            Belesu’s vision goes beyond helping students understand their Kannada lessons. Through
            innovative English-translated academic guidebooks and accessible learning resources, we
            aim to connect academic growth with a stronger relationship with Kannada.
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From families in Bengaluru’s diverse communities to learners across Karnataka, we want to
            make Kannada more accessible, understandable, and meaningful in education and everyday
            communication.
          </p>
        </div>

        {/* 3 Vision Pillars Grid (H3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {visionPoints.map((point, idx) => {
            const Icon = point.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-stone-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-3 leading-snug group-hover:text-amber-700 transition">
                    {point.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {point.desc}
                  </p>
                </div>

                <div className="pt-6">
                  <div className="w-8 h-1 bg-amber-400/30 rounded-full group-hover:w-16 group-hover:bg-amber-500 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tagline & CTA Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-200">
              Our Movement
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              Kannada Mathadi, Kannada Belesi
            </div>
            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
              Let’s encourage the next generation to learn Kannada, use it with confidence, and carry
              the language forward.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-amber-50 font-bold text-sm rounded-xl transition shadow-md active:scale-95"
              >
                Read Our Vision and Mission <ArrowRight className="w-4 h-4 text-amber-600" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
