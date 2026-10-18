'use client';

import React, { useState } from 'react';
import { BookOpen, Eye, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const QuickLookBookSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('class2');

  const tabs = [
    { id: 'class1', label: 'SAVI KANNADA CLASS 1', title: 'Savi Kannada Class 1 Guide Book for Reference' },
    { id: 'class2', label: 'SAVI KANNADA CLASS 2', title: 'Savi Kannada Class 2 Guide Book for Reference' },
    { id: 'class3', label: 'SAVI KANNADA CLASS 3', title: 'Savi Kannada Class 3 Guide Book for Reference' },
    { id: 'class4', label: 'SAVI KANNADA CLASS 4', title: 'Savi Kannada Class 4 Guide Book for Reference' },
    { id: 'class5', label: 'SIRI KANNADA CLASS 5', title: 'Siri Kannada Class 5 Guide Book for Reference' },
  ];

  const sampleGallery: Record<string, Array<{ id: string; title: string; image: string }>> = {
    class1: [
      { id: '1-1', title: 'State Part-1 Textbook Cover', image: '/savi-kannada-1st-1stpart.png' },
      { id: '1-2', title: 'State Part-2 Textbook Cover', image: '/savi-kannada-1st-2ndpart.png' },
      { id: '1-3', title: 'Belesu English Translation Guide Cover', image: '/Savi-Class1-CoverPage.png' },
      { id: '1-4', title: 'Sample Lesson Translation Page', image: '/SV1-1-1.png' },
    ],
    class2: [
      { id: '2-1', title: 'State Part-1 Textbook Cover', image: '/2nd-1stpart.png' },
      { id: '2-2', title: 'State Part-2 Textbook Cover', image: '/2nd-2nd-part.png' },
      { id: '2-3', title: 'Belesu English Translation Guide Cover', image: '/Savi-Class2-CoverPage.png' },
      { id: '2-4', title: 'Sample Lesson Translation Page', image: '/SV-2-2.png' },
      { id: '2-5', title: 'Answer Keys & Solved Question Bank', image: '/17.png' },
    ],
    class3: [
      { id: '3-1', title: 'Belesu Class 3 Guide Cover', image: '/SV-3-2.png' },
      { id: '3-2', title: 'Part-1 State Textbook Cover', image: '/2nd-1stpart.png' },
      { id: '3-3', title: 'Sample Lesson Translation Page', image: '/22.png' },
      { id: '3-4', title: 'Grammar & Dictation Key Page', image: '/17.png' },
    ],
    class4: [
      { id: '4-1', title: 'Belesu Class 4 Guide Cover', image: '/cover-3.png' },
      { id: '4-2', title: 'Sample Lesson Translation Page', image: '/SV-4-2.png' },
      { id: '4-3', title: 'Ottakshara Notes & Solved Exercises', image: '/17.png' },
    ],
    class5: [
      { id: '5-1', title: 'Belesu Class 5 Siri Guide Cover', image: '/SV-5-2.png' },
      { id: '5-2', title: 'Sample Literature & Letter Writing Page', image: '/22.png' },
      { id: '5-3', title: 'Model Exam Paper Answer Key', image: '/17.png' },
    ],
  };

  const currentTabInfo = tabs.find((t) => t.id === activeTab) || tabs[1];
  const currentImages = sampleGallery[activeTab] || sampleGallery.class2;

  return (
    <section className="bg-slate-50 py-16 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header Titles */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif italic font-bold text-amber-800 tracking-tight">
            A Quick Look at the Book
          </h2>
          <p className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 tracking-tight">
            Savi & Siri Kannada Guide Book from 1-5 for Reference
          </p>
        </div>

        {/* Grade Class Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Class Subheading */}
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {currentTabInfo.title}
          </h3>
        </div>

        {/* Sample Pages Showcase Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentImages.map((imgItem) => (
            <div
              key={imgItem.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center"
            >
              <div className="w-full aspect-[3/4] bg-stone-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 border border-stone-100">
                <img
                  src={imgItem.image}
                  alt={imgItem.title}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold text-slate-900 text-center leading-tight">
                {imgItem.title}
              </span>
            </div>
          ))}
        </div>

        {/* Store CTA Footer */}
        <div className="text-center pt-10">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide rounded-full shadow-lg transition transform active:scale-95"
          >
            <BookOpen className="w-4 h-4" /> Order Complete Guidebook Series <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
