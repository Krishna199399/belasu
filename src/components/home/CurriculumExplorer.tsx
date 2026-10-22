'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ShoppingBag,
  Eye,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Star,
  LayoutGrid,
  Layers,
} from 'lucide-react';
import { BOOKS_DATA } from '@/data/mockData';
import { BookProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface CurriculumExplorerProps {
  onPreview: (book: BookProduct) => void;
}

type SeriesId = 'Savi' | 'Kali' | 'Siri' | 'Tili';

interface SeriesData {
  id: SeriesId;
  tabLabel: string;
  title: string;
  classesLabel: string;
  grades: number[];
  defaultGrade: number;
  description: string;
  theme: {
    accentColor: string;
    gradientBg: string;
    glowColor: string;
    borderActive: string;
    btnBg: string;
    btnHover: string;
    btnText: string;
    tagBg: string;
    tagText: string;
    dotColor: string;
  };
  features: string[];
}

const seriesList: SeriesData[] = [
  {
    id: 'Savi',
    tabLabel: 'Savi Kannada',
    title: 'Savi Kannada Guidebooks | Classes 1–4',
    classesLabel: 'Classes 1–4',
    grades: [1, 2, 3, 4],
    defaultGrade: 4,
    description:
      'Savi Kannada English-translated innovative guidebooks help primary school students understand Kannada lessons and work through their academic exercises. Explore the book for your child’s class to review its translation and learning support features.',
    theme: {
      accentColor: 'text-amber-600',
      gradientBg: 'from-amber-500/10 via-amber-100/30 to-orange-50/20',
      glowColor: 'shadow-amber-500/20',
      borderActive: 'border-amber-400',
      btnBg: 'bg-amber-500',
      btnHover: 'hover:bg-amber-600',
      btnText: 'text-slate-950',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-900',
      dotColor: 'bg-amber-500',
    },
    features: [
      'Line-by-line parallel English translation for every prose & poem',
      'End-of-chapter Kannada-to-English vocabulary & pronunciation keys',
      'Step-by-step solved textbook exercise question banks',
      'Grammar fundamentals explained in simple, clear English',
    ],
  },
  {
    id: 'Kali',
    tabLabel: 'Kali Kannada',
    title: 'Kali Kannada Guidebooks | Classes 1–4',
    classesLabel: 'Classes 1–4',
    grades: [1, 2, 3, 4],
    defaultGrade: 1,
    description:
      'Discover Kali Kannada guidebooks for primary school learners. Review the available book details to understand how each title supports Kannada learning and schoolwork.',
    theme: {
      accentColor: 'text-indigo-600',
      gradientBg: 'from-indigo-500/10 via-indigo-100/30 to-purple-50/20',
      glowColor: 'shadow-indigo-500/20',
      borderActive: 'border-indigo-500',
      btnBg: 'bg-indigo-600',
      btnHover: 'hover:bg-indigo-700',
      btnText: 'text-white',
      tagBg: 'bg-indigo-100',
      tagText: 'text-indigo-900',
      dotColor: 'bg-indigo-600',
    },
    features: [
      'Foundational Kannada script & alphabet pronunciation guides',
      'Transliteration support in English script for every sentence',
      'Solved state board exercises & workbook activity answers',
      'Specially designed for non-Kannada speaking families',
    ],
  },
  {
    id: 'Siri',
    tabLabel: 'Siri Kannada',
    title: 'Siri Kannada Guidebook | Class 5',
    classesLabel: 'Class 5',
    grades: [5],
    defaultGrade: 5,
    description:
      'Explore the Siri Kannada guidebook for Class 5 and discover the learning support available to help students understand their Kannada lessons and revise academic content.',
    theme: {
      accentColor: 'text-rose-600',
      gradientBg: 'from-rose-500/10 via-rose-100/30 to-pink-50/20',
      glowColor: 'shadow-rose-500/20',
      borderActive: 'border-rose-500',
      btnBg: 'bg-rose-600',
      btnHover: 'hover:bg-rose-700',
      btnText: 'text-white',
      tagBg: 'bg-rose-100',
      tagText: 'text-rose-900',
      dotColor: 'bg-rose-600',
    },
    features: [
      'Middle school literature & poetry stanza-by-stanza translations',
      'Formal letter writing templates & model essay compositions',
      'Advanced Sandhi, Samasa, and Vibhakti Pratyaya grammar rules',
      'Complete model question paper answer keys for exam revision',
    ],
  },
  {
    id: 'Tili',
    tabLabel: 'Tili Kannada',
    title: 'Tili Kannada Guidebook | Class 5',
    classesLabel: 'Class 5',
    grades: [5],
    defaultGrade: 5,
    description:
      'Discover the Tili Kannada guidebook for Class 5. Review its contents and learning features to find out how it can supplement your child’s Kannada textbook.',
    theme: {
      accentColor: 'text-teal-600',
      gradientBg: 'from-teal-500/10 via-teal-100/30 to-emerald-50/20',
      glowColor: 'shadow-teal-500/20',
      borderActive: 'border-teal-500',
      btnBg: 'bg-teal-600',
      btnHover: 'hover:bg-teal-700',
      btnText: 'text-white',
      tagBg: 'bg-teal-100',
      tagText: 'text-teal-900',
      dotColor: 'bg-teal-600',
    },
    features: [
      'Comprehensive chapter summaries & core moral takeaways',
      'Accurate English translations alongside prescribed Kannada text',
      'Thorough answers for all textbook question-answer sections',
      'Ideal companion study resource for classroom revision',
    ],
  },
];

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({ onPreview }) => {
  const { addToCart, openCart } = useCart();

  // Concept switcher: defaults to Concept 2 as requested by the user
  const [designConcept, setDesignConcept] = useState<'concept2' | 'concept1'>('concept2');

  // Concept 2 state
  const [activeSeriesId, setActiveSeriesId] = useState<SeriesId>('Savi');
  const [activeGrade, setActiveGrade] = useState<number>(4);

  // Concept 1 grade states for multi-grade cards
  const [concept1SaviGrade, setConcept1SaviGrade] = useState<number>(4);
  const [concept1KaliGrade, setConcept1KaliGrade] = useState<number>(1);

  const activeSeries = seriesList.find((s) => s.id === activeSeriesId) || seriesList[0];

  const handleSelectSeries = (id: SeriesId) => {
    setActiveSeriesId(id);
    const targetSeries = seriesList.find((s) => s.id === id);
    if (targetSeries) {
      setActiveGrade(targetSeries.defaultGrade);
    }
  };

  const currentBook =
    BOOKS_DATA.find((b) => b.series === activeSeriesId && b.gradeClass === activeGrade) ||
    BOOKS_DATA.find((b) => b.series === activeSeriesId) ||
    BOOKS_DATA[0];

  const seriesBooks = BOOKS_DATA.filter((b) => b.series === activeSeriesId);

  const handleAddToCart = (book: BookProduct) => {
    addToCart(book, 'physical', 1);
    toast.success(`Added ${book.title} to cart`);
    openCart();
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-stone-50/80 via-white to-amber-50/20 border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Belesu - Contents.md verbatim */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>State Syllabus Curriculum</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            State Syllabus Guidebooks
          </h2>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-900 tracking-tight">
            Find the Right Kannada Academic Guidebook for Your Class
          </h3>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal pt-1">
            Explore Belesu’s Kannada guidebook series for primary school students. Each book offers
            supplementary academic support, with features such as English translations, lesson
            explanations, and exercise guidance depending on the title.
          </p>

          {/* Design Concept Switcher Pill */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex p-1 bg-stone-200/80 rounded-xl border border-stone-300 shadow-inner">
              <button
                type="button"
                onClick={() => setDesignConcept('concept2')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  designConcept === 'concept2'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Concept 2: Interactive Studio (Active)</span>
              </button>
              <button
                type="button"
                onClick={() => setDesignConcept('concept1')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  designConcept === 'concept1'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Concept 1: 4-Column Deck</span>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            CONCEPT 2: APPLE-STYLE INTERACTIVE STUDIO
        ══════════════════════════════════════════════════════════════════════ */}
        {designConcept === 'concept2' && (
          <div>
            {/* Apple-Style Segmented Series Switcher Bar */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1.5 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner max-w-full overflow-x-auto scrollbar-none">
                {seriesList.map((series) => {
                  const isActive = activeSeriesId === series.id;
                  return (
                    <button
                      key={series.id}
                      type="button"
                      onClick={() => handleSelectSeries(series.id)}
                      className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-md shadow-stone-900/5 ring-1 ring-stone-900/5 scale-102 font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive ? `${series.theme.dotColor} animate-pulse` : 'bg-stone-300'
                        }`}
                      />
                      <span>{series.tabLabel}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                          isActive
                            ? series.theme.tagBg + ' ' + series.theme.tagText
                            : 'bg-stone-200 text-slate-600'
                        }`}
                      >
                        {series.classesLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Immersive Split Interactive Studio */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden transition-all duration-500 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Left Column (55%): Series Editorial, Details & Purchasing CTAs */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    
                    {/* Series Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${activeSeries.theme.tagBg} ${activeSeries.theme.tagText} border border-black/5`}
                      >
                        ★ {activeSeries.classesLabel} Curriculum
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-stone-100 px-3 py-1 rounded-full">
                        {activeSeries.id} Kannada Series
                      </span>
                    </div>

                    {/* H3 Heading matching Belesu - Contents.md */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-snug">
                      {activeSeries.title}
                    </h3>

                    {/* Description matching Belesu - Contents.md */}
                    <p className="text-base text-slate-700 leading-relaxed font-normal">
                      {activeSeries.description}
                    </p>

                    {/* Multi-Grade Selector (for Savi & Kali) */}
                    {activeSeries.grades.length > 1 && (
                      <div className="pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                          Choose Your Child&apos;s Class Edition:
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {activeSeries.grades.map((grade) => {
                            const isGradeSelected = activeGrade === grade;
                            return (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => setActiveGrade(grade)}
                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                                  isGradeSelected
                                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-200'
                                }`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Class {grade}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Academic Highlights Checklist */}
                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        What This Guidebook Delivers:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeSeries.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Purchasing Actions & Guarantee Strip */}
                  <div className="pt-6 border-t border-stone-200 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-xs text-slate-500">Class {activeGrade} Complete Guidebook</div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-3xl font-black text-slate-900">
                            ₹{currentBook.price}
                          </span>
                          {currentBook.originalPrice && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{currentBook.originalPrice}
                            </span>
                          )}
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            In Stock · Ready to Ship
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dual CTAs matching Belesu - Contents.md */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => onPreview(currentBook)}
                        className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl font-bold text-sm bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 shadow-2xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-amber-600" />
                        <span>Explore Book</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(currentBook)}
                        className={`w-full sm:w-1/2 py-3.5 px-6 rounded-xl font-bold text-sm ${activeSeries.theme.btnBg} ${activeSeries.theme.btnHover} ${activeSeries.theme.btnText} shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer uppercase tracking-wider`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" /> Fast delivery in 3-5 days across Karnataka
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Authentic State Syllabus
                      </span>
                    </div>
                  </div>

                </div>

                {/* Right Column (45%): 3D Hero Stage & Book Showcase */}
                <div
                  className={`lg:col-span-5 bg-gradient-to-br ${activeSeries.theme.gradientBg} p-8 sm:p-10 lg:p-12 flex flex-col justify-between items-center border-t lg:border-t-0 lg:border-l border-stone-200 relative overflow-hidden`}
                >
                  {/* Radial Blur Backdrop */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full bg-white/70 blur-3xl" />
                  </div>

                  {/* Status Header */}
                  <div className="w-full flex items-center justify-between z-10 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200">
                      Karnataka State Board Companion
                    </span>
                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 border border-stone-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Central 3D Elevated Hero Book Mockup */}
                  <div
                    key={currentBook.id}
                    className="relative z-10 my-4 transform transition-transform duration-500 hover:scale-105 hover:-translate-y-2 drop-shadow-2xl"
                  >
                    <img
                      src={currentBook.coverImage}
                      alt={currentBook.title}
                      className="max-h-72 sm:max-h-80 w-auto object-contain rounded-xl shadow-2xl"
                    />
                    <div className="text-center mt-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-xs shadow-md">
                        Class {activeGrade} · {activeSeries.id} Kannada
                      </span>
                    </div>
                  </div>

                  {/* Series Thumbnail Strip */}
                  {seriesBooks.length > 1 && (
                    <div className="w-full z-10 pt-4 border-t border-black/5">
                      <div className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                        Other Available Editions in {activeSeries.id}:
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        {seriesBooks.map((b) => {
                          const isThumbActive = b.gradeClass === activeGrade;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setActiveGrade(b.gradeClass)}
                              className={`relative p-1.5 rounded-xl bg-white border transition-all duration-200 cursor-pointer ${
                                isThumbActive
                                  ? `ring-2 ring-amber-500 shadow-md scale-105 border-amber-400`
                                  : 'border-stone-200 hover:border-amber-300 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={b.coverImage}
                                alt={b.title}
                                className="h-14 w-auto object-contain rounded-md"
                              />
                              <span className="block text-[10px] font-bold text-center mt-1 text-slate-700">
                                Cl {b.gradeClass}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            CONCEPT 1: 4-COLUMN 3D CARDS DECK
        ══════════════════════════════════════════════════════════════════════ */}
        {designConcept === 'concept1' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {seriesList.map((series) => {
              // Determine active book for this card in Concept 1
              let cardGrade = series.defaultGrade;
              if (series.id === 'Savi') cardGrade = concept1SaviGrade;
              if (series.id === 'Kali') cardGrade = concept1KaliGrade;

              const bookForCard =
                BOOKS_DATA.find((b) => b.series === series.id && b.gradeClass === cardGrade) ||
                BOOKS_DATA.find((b) => b.series === series.id) ||
                BOOKS_DATA[0];

              return (
                <div
                  key={series.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  {/* Card Header & Book Mockup Stage */}
                  <div className={`p-6 bg-gradient-to-b ${series.theme.gradientBg} border-b border-stone-100 relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md ${series.theme.tagBg} ${series.theme.tagText}`}
                      >
                        {series.classesLabel}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-stone-200">
                        Class {cardGrade}
                      </span>
                    </div>

                    {/* Book Mockup */}
                    <div className="h-56 flex items-center justify-center my-2 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                      <img
                        src={bookForCard.coverImage}
                        alt={bookForCard.title}
                        className="max-h-full w-auto object-contain rounded-lg shadow-lg"
                      />
                    </div>

                    {/* Class Selector Pills for Multi-Grade Series */}
                    {series.grades.length > 1 && (
                      <div className="flex items-center justify-center gap-1.5 pt-3">
                        {series.grades.map((grade) => {
                          const isSel = cardGrade === grade;
                          return (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => {
                                if (series.id === 'Savi') setConcept1SaviGrade(grade);
                                if (series.id === 'Kali') setConcept1KaliGrade(grade);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-slate-900 text-white shadow-xs'
                                  : 'bg-white/80 hover:bg-white text-slate-700 border border-stone-200'
                              }`}
                            >
                              Cl {grade}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Card Body: Title, Description & Highlights */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-serif font-black text-slate-900 leading-snug">
                        {series.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {series.description}
                      </p>

                      <div className="space-y-1.5 pt-2">
                        {series.features.slice(0, 2).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Dual CTAs */}
                    <div className="pt-4 border-t border-stone-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-slate-900">
                            ₹{bookForCard.price}
                          </span>
                          {bookForCard.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{bookForCard.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          In Stock
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onPreview(bookForCard)}
                          className="w-full py-2.5 px-3 rounded-lg font-bold text-xs bg-stone-100 hover:bg-stone-200 text-slate-900 border border-stone-200 flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Explore</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(bookForCard)}
                          className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs ${series.theme.btnBg} ${series.theme.btnHover} ${series.theme.btnText} shadow-xs flex items-center justify-center gap-1 transition cursor-pointer`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Action: Browse Full Catalog Button */}
        <div className="text-center pt-10 sm:pt-14">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-2 sm:p-2 sm:pr-3 rounded-2xl sm:rounded-full bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-xs sm:text-sm text-slate-700 font-medium px-3 sm:px-4 text-center sm:text-left">
              Looking for all books and class combos?
            </span>
            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer whitespace-nowrap"
            >
              <span>Browse Complete Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
