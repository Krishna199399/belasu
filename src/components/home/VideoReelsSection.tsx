'use client';

import React from 'react';
import { VIDEO_REELS } from '@/data/mockData';
import { Play, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const VideoReelsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 text-slate-900 overflow-hidden border-y border-slate-200">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold">
              <Video className="w-3.5 h-3.5 text-rose-600" /> Watch In Action
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-3">
              See How Belesu Books <span className="text-amber-600">Work In Real Life</span>
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Watch parent video reviews, chapter translation walkthroughs, and student study demonstrations.
            </p>
          </div>

          <Link
            href="/videos"
            className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition"
          >
            Explore Video Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIDEO_REELS.map((reel) => (
            <div
              key={reel.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Video Player / Container */}
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
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                    Video Reel
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{reel.duration}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-amber-600 transition">
                  {reel.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {reel.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
