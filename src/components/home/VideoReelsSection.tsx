'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Video, ArrowRight, Play, X, MessageCircle } from 'lucide-react';

interface VideoReelItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export const VideoReelsSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoReelItem | null>(null);
  const [videoError, setVideoError] = useState(false);

  // Bulletproof background freeze: locks body + html scroll completely on mobile & desktop
  useEffect(() => {
    if (!activeVideo) return;

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Compensate for scrollbar disappearing on desktop to avoid layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Freeze body & html in place at current scroll position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      // Revert styles
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;

      // Restore scroll position seamlessly
      window.scrollTo(0, scrollY);
    };
  }, [activeVideo]);

  // 3 Official Belesu Video Reels
  const videoItems: VideoReelItem[] = [
    {
      id: 'v1',
      title: 'How Belesu Helps Non-Kannada-Speaking Parents',
      description:
        'Discover how English-translated Kannada learning resources can help parents follow school lessons and support academic learning at home.',
      tag: 'PARENT SUPPORT',
      duration: '0:48',
      thumbnailUrl: '/videos/reel-1.jpg',
      videoUrl: '/videos/video%201.mp4',
    },
    {
      id: 'v2',
      title: 'Explore a Sample Kannada Lesson',
      description:
        'See how translated content and lesson guidance appear in a guidebook, helping you understand the learning format before choosing a book.',
      tag: 'LESSON PREVIEW',
      duration: '0:41',
      thumbnailUrl: '/videos/reel-2.jpg',
      videoUrl: '/videos/video%202.mp4',
    },
    {
      id: 'v3',
      title: 'Hear From Parents and Families',
      description:
        'Explore authentic parent experiences and feedback to learn how Belesu resources are used to support Kannada learning at home.',
      tag: 'FAMILY STORIES',
      duration: '0:39',
      thumbnailUrl: '/videos/reel-3.jpg',
      videoUrl: '/videos/video%203.mp4',
    },
  ];

  const handleOpenVideo = (video: VideoReelItem) => {
    setVideoError(false);
    setActiveVideo(video);
  };

  return (
    <section className="relative py-4 sm:py-5 lg:py-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF2] to-[#FFF8EA] text-slate-900 overflow-hidden border-b border-amber-100/70">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ══════════════════════════════════════════════════════════════════
            HEADER (Compact and reduced height)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-2xl mx-auto space-y-1 mb-3.5 sm:mb-4.5">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#BE185D] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs">
            <Video className="w-3 h-3 text-[#BE185D]" />
            <span>Watch In Action</span>
          </div>

          {/* Heading with Decorative Radiant Rays & Curved Wave Underline */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-0.5">
            {/* Left Radiant Rays */}
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="5" y1="5" x2="10" y2="9" />
              <line x1="5" y1="19" x2="10" y2="15" />
            </svg>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-black text-slate-900 tracking-tight leading-tight relative inline-block">
              <span>Explore Belesu Videos</span>
              {/* Curved decorative underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full h-1.5 text-amber-400 select-none"
                viewBox="0 0 100 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 5.5C25 2 75 2 99 5.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </h2>

            {/* Right Radiant Rays */}
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="21" y1="12" x2="15" y2="12" />
              <line x1="19" y1="5" x2="14" y2="9" />
              <line x1="19" y1="19" x2="14" y2="15" />
            </svg>
          </div>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            See our guidebooks and learning resources in action.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            3 VIDEO CARDS: Responsive Stack (Mobile) & 3-Column Grid (Desktop)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-5xl mx-auto">
          {videoItems.map((video) => (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="bg-white rounded-2xl border border-[#FDE68A] p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5 select-none"
            >
              {/* Thumbnail Container with Play Overlay & Duration Badge (9:16 Vertical Reel Fit) */}
              <div className="relative aspect-[9/16] max-h-[360px] sm:max-h-[400px] rounded-xl overflow-hidden bg-slate-950 mb-2.5 shadow-2xs flex items-center justify-center">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Centered Translucent Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-slate-900 shadow-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#EA580C] group-hover:text-white transition-all duration-200">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge (Bottom-Right) */}
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  {video.duration}
                </div>
              </div>

              {/* Video Info Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Category Pill Tag */}
                  <div className="mb-1.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-900 bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded">
                      {video.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-black text-slate-900 text-xs sm:text-[13px] leading-snug mb-1 group-hover:text-amber-800 transition-colors">
                    {video.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                    {video.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CTA BUTTON: Centered Pill Button with Play Icon (Compact)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex justify-center mt-3 sm:mt-4">
          <Link
            href="/video-gallery/"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch More Videos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RESILIENT VIDEO MODAL: 9:16 Vertical Reel Player (Zero Side Bars)
      ══════════════════════════════════════════════════════════════════ */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 touch-none overscroll-contain animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          {/* Reel Card Container: Exactly 9:16 aspect ratio matching the video */}
          <div
            className="relative aspect-[9/16] max-h-[86vh] sm:max-h-[90vh] w-auto max-w-[95vw] bg-black rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex items-center justify-center mx-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gradient Overlay with Title & Close Button (Overlaid so it never stretches the card) */}
            <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-3.5 sm:p-4 flex items-start justify-between gap-3 pointer-events-auto">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block drop-shadow-sm">
                  {activeVideo.tag} • {activeVideo.duration}
                </span>
                <h4 className="text-white font-bold text-xs sm:text-sm truncate drop-shadow-sm">
                  {activeVideo.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer shrink-0 border border-white/20 backdrop-blur-xs"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewport / Graceful Fallback Handler */}
            {videoError ? (
              <div className="p-6 text-center max-w-xs mx-auto space-y-3 z-10">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1">
                  <Video className="w-6 h-6" />
                </div>
                <h5 className="text-white font-bold text-sm sm:text-base">
                  Video Walkthrough Available
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This video demonstration is being optimized for high-speed streaming. You can watch the full demonstration instantly via WhatsApp!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/919606636804?text=Hi%2C%20please%20share%20the%20video%3A%20${encodeURIComponent(
                      activeVideo.title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Request on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                playsInline
                onError={() => setVideoError(true)}
                className="w-full h-full object-contain bg-black"
              />
            )}
          </div>
        </div>
      )}

    </section>
  );
};
