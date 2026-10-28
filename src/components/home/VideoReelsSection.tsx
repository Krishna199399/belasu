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
    <section className="py-8 sm:py-10 lg:py-12 bg-white text-slate-900 overflow-hidden border-b border-stone-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Belesu - Contents.md verbatim (Compact) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
              <Video className="w-3 h-3 text-rose-600" />
              <span>Watch In Action</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Explore Belesu Videos
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              See our guidebooks and learning resources in action.
            </p>
          </div>

          <Link
            href="/videos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition shrink-0 uppercase tracking-wider min-h-[44px]"
          >
            <span>Watch Videos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Video Cards Grid with exact H3 headings (Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {VIDEO_REELS.map((reel, idx) => {
            const meta = videoDetails[idx] || {
              title: reel.title,
              description: reel.description,
              tag: 'Demonstration',
            };
            return (
              <div
                key={reel.id}
                className="bg-stone-50/70 rounded-xl sm:rounded-2xl border border-stone-200/90 overflow-hidden group hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
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
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded">
                      {meta.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{reel.duration}</span>
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1.5 group-hover:text-amber-800 transition">
                    {meta.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
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
