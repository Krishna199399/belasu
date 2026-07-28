'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { VIDEO_REELS } from '@/data/mockData';
import Link from 'next/link';
import { BookOpen, ChevronRight, Building2, Play } from 'lucide-react';

export default function VideoGalleryPage() {
  const extendedVideos = [
    {
      id: 'v1',
      title: 'Student Struggle Before Belesu',
      description: 'Understanding the gap students face in Grade 3rd to 8th Kannada reading skills.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel1.mp4',
      thumbnailUrl: '/mother-and-child.png',
      badgeText: 'BEFORE:',
      duration: '0:22'
    },
    {
      id: 'v2',
      title: 'Mother & Child Daily Study Routine',
      description: 'How non-Kannadiga mothers guide their children effortlessly using Belesu translated guidebooks.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel2.mp4',
      thumbnailUrl: '/mother-and-child.png',
      badgeText: 'AFTER:',
      duration: '0:21'
    },
    {
      id: 'v3',
      title: 'Parent-Teacher Ecosystem & Exam Prep',
      description: 'Building student confidence for reading, writing, and speaking in 1 academic year.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel3.mp4',
      thumbnailUrl: '/mother-and-child.png',
      badgeText: 'SUCCESS:',
      duration: '0:48'
    },
    {
      id: 'v4',
      title: 'Savi Kannada Class 1 to 4 Walkthrough',
      description: 'Line-by-line English translation breakdown of Savi Kannada stories & poems.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel1.mp4',
      thumbnailUrl: '/Savi-Class1-CoverPage.png',
      badgeText: 'CLASSROOM:',
      duration: '0:22'
    },
    {
      id: 'v5',
      title: 'Kali Kannada Beginner Series Demo',
      description: 'Phonetic script practice and word-by-word pronunciation guide.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel2.mp4',
      thumbnailUrl: '/savi-kannada-1st-1stpart.png',
      badgeText: 'TUTORIAL:',
      duration: '0:21'
    },
    {
      id: 'v6',
      title: 'Siri & Tili Class 5 Solved Exercises',
      description: 'Grammar rules, essay writing templates, and solved model exam question papers.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel3.mp4',
      thumbnailUrl: '/SV-5-2.png',
      badgeText: 'EXAM PREP:',
      duration: '0:48'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Page Header Banner */}
      <section className="pt-12 pb-8 text-center bg-stone-50/50 border-b border-stone-200">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-bold text-amber-800 tracking-tight mb-3">
          Video Gallery
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
          <Link href="/" className="hover:text-amber-700">Home</Link>
          <span>•</span>
          <span className="text-amber-700">Video Gallery</span>
        </div>
      </section>

      {/* 2. Video Gallery 3-Column Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {extendedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src={video.videoUrl}
                    controls
                    poster={video.thumbnailUrl}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  
                  {/* Overlay Badge */}
                  {video.badgeText && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded-sm shadow-xs border border-stone-200">
                      {video.badgeText}
                    </div>
                  )}

                  {/* Belesu Watermark Overlay */}
                  <div className="absolute top-3 right-3 opacity-80 pointer-events-none">
                    <span className="text-[10px] font-black text-amber-500 bg-slate-900/80 px-2 py-0.5 rounded">
                      Belesu • +91 99023 83451
                    </span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-5 space-y-2 bg-stone-50/40">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-700">
                    <span className="uppercase tracking-wider">Duration: {video.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug font-serif">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Corporate Footer Card */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore- 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>

            <div className="text-center md:text-right space-y-3">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full font-black text-slate-900 bg-amber-400 hover:bg-amber-500 text-xs uppercase tracking-wider transition"
              >
                <BookOpen className="w-4 h-4" /> Explore Book Catalog <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
