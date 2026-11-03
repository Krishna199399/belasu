'use client';

import React, { useState } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  XCircle,
  BookOpen,
  Sparkles,
  Languages,
  GraduationCap,
  ShoppingBag,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { BookProduct } from '@/types';

interface GovernmentBookCompareModalProps {
  book: BookProduct;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

export const GovernmentBookCompareModal: React.FC<GovernmentBookCompareModalProps> = ({
  book,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'matrix' | 'classCovers'>('visual');
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const comparisonRows = [
    {
      feature: 'Syllabus Alignment',
      description: 'Official school curriculum mapping',
      govt: 'Standard Karnataka State Syllabus (DSERT)',
      govtOk: true,
      belesu: '100% 1-to-1 Chapter Mapping to Govt Syllabus',
      belesuOk: true,
    },
    {
      feature: 'Pronunciation Guide (Transliteration)',
      description: 'Phonetic English reading for non-Kannadiga students',
      govt: 'Pure Kannada script only (No phonetic aid)',
      govtOk: false,
      belesu: 'Complete English Transliteration for every Kannada word',
      belesuOk: true,
    },
    {
      feature: 'Line-by-Line Translation',
      description: 'Meaningful English comprehension for lessons & poems',
      govt: 'No translations; raw Kannada prose and poetry',
      govtOk: false,
      belesu: 'Clear line-by-line English translation for all chapters',
      belesuOk: true,
    },
    {
      feature: 'Solved Exercises & Answers',
      description: 'End-of-chapter questions and workbook activities',
      govt: 'Unsolved exercise questions only',
      govtOk: false,
      belesu: 'Complete step-by-step solved question bank & model answers',
      belesuOk: true,
    },
    {
      feature: 'Parent Guidance at Home',
      description: 'Assisting non-Kannada speaking parents',
      govt: 'Requires a fluent Kannada-speaking tutor',
      govtOk: false,
      belesu: 'Empowers any English-speaking parent to teach and review homework',
      belesuOk: true,
    },
    {
      feature: 'Exam Preparation & Grammar',
      description: 'Vyakrana, sandhigalu, and exam scoring notes',
      govt: 'Limited explanations without practice keys',
      govtOk: false,
      belesu: 'Exam-oriented question keys, grammar rules & model papers',
      belesuOk: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Scale className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Curriculum Comparison
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  {book.series} Class {book.gradeClass}
                </span>
              </div>
              <h3 className="font-serif font-black text-slate-900 text-base sm:text-xl leading-tight">
                Government Textbook vs Belesu Guidebook
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close Comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="px-5 sm:px-7 pt-3 pb-2 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'visual'
                ? 'bg-amber-600 text-white shadow-xs font-black'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Side-by-Side Visual Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-amber-600 text-white shadow-xs font-black'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Feature-by-Feature Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('classCovers')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'classCovers'
                ? 'bg-amber-600 text-white shadow-xs font-black'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Class {book.gradeClass} Book Covers</span>
          </button>
        </div>

        {/* ── Modal Body Content (Scrollable) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">

          {/* TAB 1: VISUAL OVERVIEW */}
          {activeTab === 'visual' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Top Banner Message */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                      Same Lesson. English-Supported Understanding.
                    </h4>
                    <p className="text-xs text-slate-600">
                      Your child studies the exact Karnataka State syllabus taught in school, backed by pronunciation phonetics and full translations.
                    </p>
                  </div>
                </div>

                <span className="shrink-0 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
                  Karnataka DSERT Aligned
                </span>
              </div>

              {/* Graphic Container with Zoom / Fullscreen */}
              <div className="relative rounded-2xl border border-slate-200 bg-slate-900/5 p-2 sm:p-3 overflow-hidden shadow-inner group">
                <div className="relative flex items-center justify-center bg-white rounded-xl overflow-hidden min-h-[300px] sm:min-h-[420px]">
                  <img
                    src="/kannada-textbook-comparison.jpg"
                    alt="Karnataka Government Textbook vs Belesu Kannada Guide Book Comparison"
                    className={`transition-all duration-300 object-contain w-full max-h-[520px] ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />

                  {/* Zoom Hint Button */}
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-md cursor-pointer transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{isZoomed ? 'Zoom Out' : 'Click to Zoom'}</span>
                  </button>
                </div>
              </div>

              {/* 3 Quick Value Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Official Syllabus Mapped</h5>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Covers every chapter, story, poem, and exercise from the school textbook.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Phonetics & Translation</h5>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      English pronunciation removes reading anxiety for both child and parents.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">100% Solved Exercises</h5>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Step-by-step solved question banks eliminate homework confusion.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FEATURE-BY-FEATURE MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="text-center sm:text-left">
                <h4 className="font-serif font-black text-slate-900 text-base sm:text-lg">
                  Detailed Feature Breakdown
                </h4>
                <p className="text-xs text-slate-500">
                  How the Belesu bilingual guidebook complements the official state syllabus textbook.
                </p>
              </div>

              {/* Responsive Comparison Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800">
                      <th className="py-3 px-3 sm:px-4 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Core Learning Feature
                      </th>
                      <th className="py-3 px-3 sm:px-4 font-bold text-slate-700 uppercase tracking-wider text-[11px] w-[35%] bg-slate-50/80">
                        Karnataka Govt. Textbook
                      </th>
                      <th className="py-3 px-3 sm:px-4 font-bold text-amber-900 uppercase tracking-wider text-[11px] w-[38%] bg-amber-50/60">
                        Belesu Guidebook
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-3 sm:px-4 align-top">
                          <span className="font-bold text-slate-900 block text-xs sm:text-[13px]">
                            {row.feature}
                          </span>
                          <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                            {row.description}
                          </span>
                        </td>

                        {/* Govt Column */}
                        <td className="py-3.5 px-3 sm:px-4 align-top bg-slate-50/40 text-slate-700">
                          <div className="flex items-start gap-1.5">
                            {row.govtOk ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <span className="text-[11px] sm:text-xs leading-relaxed">
                              {row.govt}
                            </span>
                          </div>
                        </td>

                        {/* Belesu Column */}
                        <td className="py-3.5 px-3 sm:px-4 align-top bg-amber-50/20 text-slate-900 font-medium">
                          <div className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span className="text-[11px] sm:text-xs leading-relaxed text-slate-900 font-semibold">
                              {row.belesu}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CLASS-SPECIFIC COVERS */}
          {activeTab === 'classCovers' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center sm:text-left">
                <h4 className="font-serif font-black text-slate-900 text-base sm:text-lg">
                  {book.series} Kannada Class {book.gradeClass} Textbook & Guide Matching
                </h4>
                <p className="text-xs text-slate-500">
                  Direct pairing of the official government textbook with your Belesu academic guide.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Govt Part 1 */}
                {book.karnatakaTextbookCover && (
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                      Govt Textbook Part 1
                    </span>
                    <div className="w-full aspect-[3/4] bg-white rounded-xl p-2 border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={book.karnatakaTextbookCover}
                        alt="Government Textbook Part 1"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Official State Textbook</span>
                  </div>
                )}

                {/* 2. Govt Part 2 */}
                {book.karnatakaTextbookPart2Cover && (
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                      Govt Textbook Part 2
                    </span>
                    <div className="w-full aspect-[3/4] bg-white rounded-xl p-2 border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={book.karnatakaTextbookPart2Cover}
                        alt="Government Textbook Part 2"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Official State Textbook</span>
                  </div>
                )}

                {/* 3. Belesu Guidebook */}
                <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-200 flex flex-col items-center text-center">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                    Belesu Guidebook Cover
                  </span>
                  <div className="w-full aspect-[3/4] bg-white rounded-xl p-2 border border-amber-200 shadow-2xs flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{book.title}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Modal Footer ── */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Karnataka State Syllabus</span> • Available for Classes 1 to 5 (Savi, Siri, Kali, Tili)
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>

            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (₹{book.price})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

