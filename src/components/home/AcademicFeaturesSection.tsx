'use client';

import React from 'react';
import {
  Languages,
  BookCheck,
  HeartHandshake,
  Sparkles,
  BookOpen,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';

export const AcademicFeaturesSection: React.FC = () => {
  return (
    <section className="py-7 sm:py-9 lg:py-10 bg-gradient-to-b from-white via-[#fefdfa] to-white border-b border-stone-200 overflow-hidden relative">
      
      {/* Soft Background Warm Wave Accents */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-amber-50/40 to-transparent pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Compact) */}
        <div className="text-center max-w-2xl mx-auto space-y-1 mb-5 sm:mb-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fef9ee] border border-[#fde68a] text-[#78350f] text-[10.5px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Academic Support</span>
          </div>

          {/* Heading with Decorative Flourishes */}
          <div className="relative inline-block pt-0.5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-500 font-serif text-base sm:text-xl tracking-tighter">⇶</span>
              <h2 className="text-xl sm:text-2xl lg:text-[2rem] font-serif font-black text-slate-900 tracking-tight leading-snug">
                Support for Learning Kannada
              </h2>
              <span className="text-amber-500 font-serif text-base sm:text-xl tracking-tighter">⇶</span>
            </div>

            {/* Curved Golden-Orange Smile Underline */}
            <div className="flex justify-center -mt-1">
              <svg
                width="160"
                height="10"
                viewBox="0 0 200 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-28 sm:w-36"
              >
                <path
                  d="M4 9C55 1.5 145 1.5 196 9"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            Comprehensive learning support that helps students understand, practise, and excel in Kannada.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3 FEATURE CARDS (Compact Desktop & Mobile)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 max-w-5xl mx-auto items-stretch">
          
          {/* ────────────────────────────────────────────────────────
              CARD 1: English Translations
             ──────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group">
            
            {/* Top: Icon + Copy */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-amber-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200 mt-0.5">
                <Languages className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug mb-0.5">
                  English Translations
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  Help students understand Kannada words, sentences and lessons.
                </p>
              </div>
            </div>

            {/* Desktop Illustration: Open Book (Compact ~60px height) */}
            <div className="hidden md:flex items-center justify-center mt-3 pt-2 border-t border-stone-100">
              <div className="relative w-40 h-16 sm:h-18 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-100/35 rounded-full blur-md pointer-events-none" />

                <svg width="135" height="65" viewBox="0 0 170 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 70C8 60 14 50 24 54C28 64 22 74 12 70Z" fill="#86efac" />
                  <path d="M158 70C162 60 156 50 146 54C142 64 148 74 158 70Z" fill="#86efac" />
                  <path d="M20 72C50 68 80 72 85 78C90 72 120 68 150 72L152 76C120 72 90 76 85 82C80 76 50 72 18 76L20 72Z" fill="#d97706" />
                  <path d="M22 28C52 24 82 28 85 34V76C82 70 52 66 22 70V28Z" fill="#fffdfa" stroke="#f59e0b" strokeWidth="2.5" />
                  <path d="M148 28C118 24 88 28 85 34V76C88 70 118 66 148 70V28Z" fill="#fffdfa" stroke="#f59e0b" strokeWidth="2.5" />
                  <text x="44" y="55" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="900" fill="#1e293b">ಕ</text>
                  <text x="105" y="55" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="900" fill="#9a3412">Ka</text>
                  <path d="M68 22C75 14 95 14 102 22" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
                  <polygon points="102,18 106,24 100,24" fill="#ea580c" />
                </svg>
              </div>
            </div>

          </div>

          {/* ────────────────────────────────────────────────────────
              CARD 2: Lesson and Exercise Support (FEATURED)
             ──────────────────────────────────────────────────────── */}
          <div className="bg-[#fffefb] rounded-2xl p-4 sm:p-4.5 border-2 border-amber-400 shadow-xs hover:shadow-md hover:border-amber-500 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
            
            {/* Top: Icon + Copy */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all duration-200 mt-0.5">
                <BookCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-serif font-black text-amber-950 leading-snug mb-0.5">
                  Lesson and Exercise Support
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  Reinforce learning alongside prescribed textbooks, according to each book&apos;s contents.
                </p>
              </div>
            </div>

            {/* Desktop Illustration: Checklist (Compact ~60px height) */}
            <div className="hidden md:flex items-center justify-center mt-3 pt-2 border-t border-amber-100">
              <div className="relative w-40 h-16 sm:h-18 flex items-center justify-center">
                <div className="absolute inset-0 bg-orange-100/35 rounded-full blur-md pointer-events-none" />

                <svg width="135" height="65" viewBox="0 0 170 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="25" y="58" width="55" height="15" rx="3" fill="#3b82f6" />
                  <rect x="22" y="60" width="58" height="12" rx="2" fill="#60a5fa" />
                  <rect x="22" y="63" width="56" height="6" fill="#f8fafc" />
                  <rect x="28" y="44" width="52" height="15" rx="3" fill="#ea580c" />
                  <rect x="25" y="46" width="55" height="12" rx="2" fill="#fb923c" />
                  <rect x="25" y="49" width="53" height="6" fill="#f8fafc" />
                  <rect x="80" y="20" width="52" height="68" rx="6" fill="white" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="87" y="32" width="9" height="9" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                  <path d="M89 36.5L91 38.5L94 34.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="100" y1="36.5" x2="124" y2="36.5" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="87" y="46" width="9" height="9" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                  <path d="M89 50.5L91 52.5L94 48.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="100" y1="50.5" x2="124" y2="50.5" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="87" y="60" width="9" height="9" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                  <path d="M89 64.5L91 66.5L94 62.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="100" y1="64.5" x2="120" y2="64.5" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                  <g transform="rotate(35 125 55)">
                    <rect x="122" y="32" width="7" height="32" rx="1.5" fill="#f59e0b" />
                    <polygon points="122,64 129,64 125.5,70" fill="#fed7aa" />
                    <polygon points="124.5,68 126.5,68 125.5,70" fill="#0f172a" />
                  </g>
                </svg>
              </div>
            </div>

          </div>

          {/* ────────────────────────────────────────────────────────
              CARD 3: Learning Like a Teacher
             ──────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group">
            
            {/* Top: Icon + Copy */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-amber-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200 mt-0.5">
                <HeartHandshake className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug mb-0.5">
                  Learning Like a Teacher
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  Help parents support their children&apos;s Kannada studies.
                </p>
              </div>
            </div>

            {/* Desktop Illustration: Laptop & Cap (Compact ~60px height) */}
            <div className="hidden md:flex items-center justify-center mt-3 pt-2 border-t border-stone-100">
              <div className="relative w-40 h-16 sm:h-18 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-50/40 rounded-full blur-md pointer-events-none" />

                <svg width="135" height="65" viewBox="0 0 170 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="52" y="73" width="70" height="5" rx="2.5" fill="#334155" />
                  <rect x="60" y="28" width="54" height="46" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                  <rect x="63" y="31" width="48" height="40" rx="2" fill="#f0f9ff" />
                  <path d="M87 40L73 47L87 53L101 47L87 40Z" fill="#1e293b" />
                  <path d="M78 50V56C78 59 96 59 96 56V50" fill="#1e293b" />
                  <path d="M98 48V56" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="98" cy="57" r="1.5" fill="#f59e0b" />
                  <rect x="25" y="68" width="26" height="7" rx="1.5" fill="#eab308" />
                  <rect x="27" y="61" width="24" height="7" rx="1.5" fill="#22c55e" />
                  <rect x="127" y="65" width="16" height="12" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                  <path d="M135 65C132 55 125 50 122 55C124 63 133 64 135 65Z" fill="#4ade80" />
                  <path d="M135 65C138 52 145 46 149 52C147 61 137 63 135 65Z" fill="#22c55e" />
                </svg>
              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4-PILLAR VALUE STRIP (Compact)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="mt-5 sm:mt-6 p-3 sm:p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 items-center">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/80">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug">
              Aligned with School Syllabus
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug">
              Builds Strong Understanding
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/80">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug">
              Helpful for Students &amp; Parents
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200/80">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug">
              Improves Learning Outcomes
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
