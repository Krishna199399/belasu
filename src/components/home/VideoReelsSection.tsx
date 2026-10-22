'use client';

import React from 'react';
import { VIDEO_REELS } from '@/data/mockData';
import { Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const VideoReelsSection: React.FC = () => {
  const videoDetails = [
    {
      title: 'How Belesu Helps Non-Kannada-Speaking Parents',
      description:
        'Discover how English-translated Kannada learning resources can help parents follow school lessons and support academic learning at home.',
      tag: 'Parent Support',
    },
    {
      title: 'Explore a Sample Kannada Lesson',
      description:
        'See how translated content and lesson guidance appear in a guidebook, helping you understand the learning format before choosing a book.',
      tag: 'Lesson Preview',
    },
    {
      title: 'Hear From Parents and Families',
      description:
        'Explore authentic parent experiences and feedback to learn how Belesu resources are used to support Kannada learning at home.',
      tag: 'Family Stories',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white text-slate-900 overflow-hidden border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Video className="w-3.5 h-3.5 text-rose-600" /> Watch In Action
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              See How Belesu Guidebooks Support Kannada Learning
            </h2>
            <p className="text-base text-slate-700 leading-relaxed font-normal">
              Explore videos that introduce Belesu’s learning approach, demonstrate the guidebooks,
              and share experiences from families.
            </p>
          </div>

          <Link
            href="/videos"
            className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition shrink-0 uppercase tracking-wider"
          >
            Explore Belesu Videos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Cards Grid with exact H3 headings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIDEO_REELS.map((reel, idx) => {
            const meta = videoDetails[idx] || {
              title: reel.title,
              description: reel.description,
              tag: 'Demonstration',
            };
            return (
              <div
                key={reel.id}
                className="bg-stone-50/70 rounded-2xl border border-stone-200/90 overflow-hidden group hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                  <video
                    src={reel.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                </div>

                {/* Video Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md">
                      {meta.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{reel.duration}</span>
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-amber-700 transition">
                    {meta.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
