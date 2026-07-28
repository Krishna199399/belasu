'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, ShieldCheck, Star, Play, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative hero-gradient pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-amber-100/60">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-amber-600 animate-ping" />
              <span>Academic Kannada Guidebooks • Classes 1 to 5</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Master Academic Kannada with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600">English Translations</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Belesu creates research-backed, English-translated study guidebooks for <strong className="text-slate-900">Kali, Savi, Siri & Tili</strong> Kannada curricula. Empowering non-Kannadiga families and students across Karnataka to excel in school homework & exams with confidence.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Line-by-line English Translation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Pronunciation Transliteration Key</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>State Syllabus Solved Answer Keys</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Fast Delivery Across All Karnataka</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/books"
                className="w-full sm:w-auto py-4 px-8 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-base transition-transform active:scale-95"
              >
                <BookOpen className="w-5 h-5" /> Explore All Guidebooks <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/videos"
                className="w-full sm:w-auto py-4 px-6 rounded-2xl font-bold text-slate-800 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs flex items-center justify-center gap-2 text-sm transition"
              >
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-rose-600" />
                </div>
                Watch Video Demos
              </Link>
            </div>

            {/* Social Trust Ratings */}
            <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" alt="Parent Avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" alt="Parent Avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" alt="Parent Avatar" />
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 / 5 Rating
                  </div>
                  <span className="text-slate-500 font-medium">Loved by 5,000+ Families</span>
                </div>
              </div>

              <div className="hidden sm:block text-left text-xs pl-6 border-l border-slate-200">
                <span className="font-bold text-slate-900 block">100% Curriculum Aligned</span>
                <span className="text-slate-500">Classes 1, 2, 3, 4 & 5</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Book Showcase Stack */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white p-6 shadow-2xl border border-amber-100/80 flex flex-col justify-between overflow-hidden group">
              
              {/* Badge Overlay */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                Official Belesu Edition
              </div>

              <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                <img
                  src="https://belesu.in/wp-content/uploads/2024/04/1-1.png"
                  alt="Savi Kannada Class 1 Book"
                  className="max-h-72 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Card Detail */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Savi Kannada Guidebook</h4>
                  <p className="text-xs text-slate-500">Class 1 to 4 • Line-by-line English Translation</p>
                </div>
                <Link
                  href="/books/savi-kannada-class-4"
                  className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
                >
                  Buy ₹280
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
