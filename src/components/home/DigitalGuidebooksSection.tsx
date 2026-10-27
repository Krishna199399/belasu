'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Laptop,
  CheckCircle2,
  ExternalLink,
  ZoomIn,
} from 'lucide-react';

interface PreviewTab {
  id: string;
  label: string;
  sublabel: string;
  imageUrl: string;
  description: string;
}

const PREVIEW_TABS: PreviewTab[] = [
  {
    id: 'cover',
    label: 'Book Cover',
    sublabel: 'Official',
    imageUrl: '/digital/class-6-siri/cover.jpeg',
    description: 'Official Belesu Class 6 Siri Kannada Guidebook Cover (Includes Part 1 & Part 2)',
  },
  {
    id: 'poem',
    label: 'Poem Scan',
    sublabel: 'Page 46',
    imageUrl: '/digital/class-6-siri/poem.jpeg',
    description: 'Poem 1: Besige (Summer) — Kannada Stanzas with English line-by-line translation',
  },
  {
    id: 'lesson',
    label: 'Lesson Scan',
    sublabel: 'Page 12',
    imageUrl: '/digital/class-6-siri/lesson.jpeg',
    description: 'Lesson 2: Gandharva Sena — Complete English story explanation & word meanings',
  },
  {
    id: 'exercises',
    label: 'Exercises',
    sublabel: 'Page 03',
    imageUrl: '/digital/class-6-siri/exercises.jpeg',
    description: 'Solved Exercises — Fill in blanks and own sentences translated to English',
  },
];

export const DigitalGuidebooksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PreviewTab>(PREVIEW_TABS[0]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-stone-50 via-amber-50/15 to-white relative overflow-hidden border-b border-stone-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Section Header (Compact & Crisp) ── */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Classes 6 to 10 Digital Learning</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Explore Digital Kannada Guidebooks
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Read Belesu digital guidebooks through a web-based reader.
          </p>
        </div>

        {/* ── Consolidated Landscape Reader Studio Card (~380px Height) ── */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-sm p-4 sm:p-6 lg:p-7 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* ── Left Column (5 cols): Authentic Book & Interactive Preview Stage ── */}
            <div className="md:col-span-5 flex flex-col items-center">
              
              {/* Authentic Book Stage */}
              <div 
                onClick={() => setIsZoomed(true)}
                className="group relative cursor-pointer rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 flex items-center justify-center p-1 w-full max-w-[240px] sm:max-w-[260px] aspect-[3/4]"
              >
                <img
                  src={activeTab.imageUrl}
                  alt={activeTab.description}
                  className="w-full h-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-102"
                />

                {/* Hover Zoom Prompt */}
                <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-[11px] font-bold shadow-md flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                    <span>Click to Zoom</span>
                  </span>
                </div>

                {/* Subtitle Badge */}
                <div className="absolute bottom-2 left-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium text-center truncate pointer-events-none">
                  {activeTab.description}
                </div>
              </div>

              {/* Interactive Page Switcher Tabs */}
              <div className="grid grid-cols-4 gap-1.5 w-full max-w-[280px] mt-3 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
                {PREVIEW_TABS.map((tab) => {
                  const isActive = activeTab.id === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-1.5 py-1.5 rounded-lg text-center transition-all cursor-pointer min-h-[38px] flex flex-col items-center justify-center ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-stone-200/60'
                      }`}
                    >
                      <div className="text-[10px] leading-tight font-bold">{tab.label.split(' ')[0]}</div>
                      <div className="text-[8px] text-amber-400/90 leading-none mt-0.5">{tab.sublabel}</div>
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] text-slate-400 mt-1.5 text-center">
                Interactive preview · Authentic Belesu scans
              </span>
            </div>

            {/* ── Right Column (7 cols): Editorial Details, Features & Direct CTAs ── */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4">
              
              {/* Badges & Title */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Featured Edition
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Karnataka State Syllabus
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                  Class 6 Siri Kannada
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore the available digital guidebook, preview sample pages and review the purchase details.
                </p>
              </div>

              {/* Compact Value Highlights */}
              <div className="space-y-2 py-2 border-y border-stone-200/80">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>English-Translated Content:</strong> Line-by-line translation for every poem & lesson.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Chapter & Lesson Support:</strong> Full solved textbook exercises & grammar notes.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Digital Reading Experience:</strong> Accessible anytime on Phone, Tablet & PC web reader.</span>
                </div>
              </div>

              {/* Direct CTAs matching home page.md verbatim */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href="/digital/kannada-class-6-guide"
                  className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Digital Guidebook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/reader/kannada-class-6-guide?preview=true"
                  className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>Preview 5 Free Pages</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                </Link>
              </div>

              {/* Coming Soon Notice */}
              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong className="text-slate-800">Coming Soon:</strong> Digital guidebooks for Classes 7, 8, 9 and 10.
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* ── Optional Fullscreen Zoom Modal ── */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl flex flex-col items-center"
          >
            <img
              src={activeTab.imageUrl}
              alt={activeTab.description}
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <div className="mt-2 text-xs font-bold text-slate-800 text-center">
              {activeTab.description}
            </div>
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="mt-3 px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold cursor-pointer min-h-[40px] flex items-center justify-center"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
