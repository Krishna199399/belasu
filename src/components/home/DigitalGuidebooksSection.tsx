'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Laptop,
  Tablet,
  Smartphone,
  Lock,
  Languages,
  BookMarked,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const DigitalGuidebooksSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-gradient-to-b from-stone-50 via-amber-50/20 to-white relative overflow-hidden border-b border-stone-200">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN (7 cols): Editorial, Value Pillars & Action CTAs
          ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Classes 6 to 10 Digital Learning</span>
            </div>

            {/* H2 Title matching Belesu - Contents.md verbatim */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                Explore Belesu Digital Kannada Guidebooks
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Belesu is extending its academic learning resources through digital Kannada
                guidebooks for Classes 6 to 10. These resources bring translated Kannada learning
                support to a digital reading experience, helping students access their guidebooks
                through a compatible mobile device or computer.
              </p>
            </div>

            {/* Preview Feature Box */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
              
              {/* H3 Heading matching Belesu - Contents.md */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Featured Edition
                  </span>
                  <span className="text-xs font-bold text-slate-500">Karnataka State Syllabus</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                  Class 6 Kannada Guidebook: Digital Preview
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Explore the Class 6 digital Kannada guidebook preview to see how translated
                  lessons and academic support are presented in the digital reader. The preview
                  offers a closer look at the digital learning experience. Visit the product page to
                  review the available chapters, translations, exercise support, and purchase terms.
                </p>
              </div>

              {/* H4 Subheading: What to Explore in the Digital Guidebook */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>What to Explore in the Digital Guidebook</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Item 1 */}
                  <div className="bg-stone-50/80 hover:bg-amber-50/50 p-4 rounded-2xl border border-stone-200/80 transition-all duration-200 group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Languages className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                          English-translated content
                        </div>
                        <p className="text-xs text-slate-600 leading-snug mt-1">
                          Explore the translations and explanations included in the digital edition.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-stone-50/80 hover:bg-amber-50/50 p-4 rounded-2xl border border-stone-200/80 transition-all duration-200 group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <BookMarked className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                          Chapter and lesson support
                        </div>
                        <p className="text-xs text-slate-600 leading-snug mt-1">
                          Review the chapter summaries and academic guidance available in the specific product.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-stone-50/80 hover:bg-amber-50/50 p-4 rounded-2xl border border-stone-200/80 transition-all duration-200 group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Tablet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                          Digital reading experience
                        </div>
                        <p className="text-xs text-slate-600 leading-snug mt-1">
                          Access the guidebook through the supported web reader on a compatible device.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="bg-stone-50/80 hover:bg-amber-50/50 p-4 rounded-2xl border border-stone-200/80 transition-all duration-200 group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-900 transition-colors">
                          Purchase and access details
                        </div>
                        <p className="text-xs text-slate-600 leading-snug mt-1">
                          Check the current price, access conditions, and product terms before purchasing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs matching Belesu - Contents.md */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                <Link
                  href="/digital"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Digital Guidebooks</span>
                </Link>

                <Link
                  href="/reader/kannada-class-6-guide?preview=true"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Class 6 Preview</span>
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                </Link>
              </div>

            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN (5 cols): Apple-Grade Tablet Web Reader Mockup
          ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Tablet Hardware Frame */}
            <div className="w-full max-w-[460px] bg-slate-900 rounded-[2.5rem] p-3.5 sm:p-4 shadow-2xl shadow-slate-900/25 ring-1 ring-slate-800 relative group">
              
              {/* Tablet Top Camera Notch Pill */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-slate-950 flex items-center justify-center gap-1 z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <div className="w-1 h-1 rounded-full bg-slate-900" />
              </div>

              {/* Tablet Display Screen */}
              <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 text-white relative">
                
                {/* Browser App Bar */}
                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-full text-[10px] text-slate-300 font-mono border border-slate-800">
                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                    <span>belesu.org/reader/class-6</span>
                  </div>

                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Web Reader
                  </span>
                </div>

                {/* Reader Document Top Bar */}
                <div className="bg-stone-900/95 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-[11px] text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Class 6 Savi Kannada</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">Free Preview</span>
                  </div>
                  <span className="text-stone-400 text-[10px]">Page 12 of 180</span>
                </div>

                {/* Simulated High-Res Bilingual Reader Content */}
                <div className="p-5 sm:p-6 bg-[#FAF7F2] text-slate-900 min-h-[300px] flex flex-col justify-between space-y-4 select-none">
                  
                  {/* Chapter Header */}
                  <div className="border-b border-amber-200/80 pb-3 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                      ಪದ್ಯಭಾಗ - ೧ (Poetry Section - 1)
                    </div>
                    <div className="text-lg font-serif font-black text-slate-900 mt-0.5">
                      ಹೊಸ ಬೆಳಕು — Hosa Belaku (New Light)
                    </div>
                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                      Poet: Dr. Kayyara Kinhanna Rai · Line-by-Line Translation
                    </div>
                  </div>

                  {/* Parallel Bilingual Stanza Card */}
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-xs space-y-1.5">
                      <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                        <span>ಕನ್ನಡ ಮೂಲ ಪದ್ಯ (Kannada Text)</span>
                        <span className="text-[10px] font-normal text-slate-400">Stanza 1</span>
                      </div>
                      <p className="text-xs font-serif text-slate-800 leading-relaxed font-bold">
                        ಬೆಳಕು ಹರಿಯಿತು, ಕತ್ತಲೆ ಸರಿಯಿತು, ಜಗವೆಲ್ಲ ನಕ್ಕಿತು ಹಸನ್ಮುಖದಿ.
                      </p>
                      <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50 mt-1">
                        <span className="font-bold text-slate-800">English Translation: </span>
                        The light dawned, darkness faded away, and the entire world smiled with joy.
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
                      <div className="text-[11px] font-bold text-indigo-900">
                        ಪದಗಳ ಅರ್ಥ (Vocabulary & Pronunciation Guide)
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 pt-0.5">
                        <div className="bg-stone-50 p-1.5 rounded border border-stone-200">
                          <span className="font-bold">ಬೆಳಕು (Belaku):</span> Light / Dawn
                        </div>
                        <div className="bg-stone-50 p-1.5 rounded border border-stone-200">
                          <span className="font-bold">ಹಸನ್ಮುಖ (Hasanmukha):</span> Smiling Face
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reader Bottom Navigation Simulator */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-stone-200">
                    <span>100% Zoom · Mobile Responsive</span>
                    <span className="text-amber-800 font-bold">Interactive Web Reader</span>
                  </div>

                </div>

                {/* Floating Preview Launcher Overlay */}
                <div className="bg-slate-900/95 p-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white">₹199</span>
                      <span className="text-xs text-slate-400 line-through">₹349</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Save 43%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Lifetime Digital Cloud Access
                    </div>
                  </div>

                  <Link
                    href="/reader/kannada-class-6-guide?preview=true"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <span>Launch Reader</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>

            {/* Device Compatibility & Upcoming Classes Banner */}
            <div className="w-full max-w-[460px] mt-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Laptop className="w-4 h-4 text-amber-600" />
                <Tablet className="w-4 h-4 text-indigo-600" />
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Compatible with Phone, Tablet & PC</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Classes 7–10: <span className="font-bold text-amber-700">Launching shortly</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
