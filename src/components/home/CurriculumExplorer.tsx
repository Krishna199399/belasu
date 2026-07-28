'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, BookMarked, Award, Star } from 'lucide-react';
import { BOOKS_DATA } from '@/data/mockData';
import { BookProduct } from '@/types';
import Link from 'next/link';

interface CurriculumExplorerProps {
  onPreview: (book: BookProduct) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({ onPreview }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(4);

  const gradeInfo: Record<number, { title: string; subtitle: string; syllabus: string; targetSkills: string[] }> = {
    1: {
      title: 'Class 1 Kannada Curriculum',
      subtitle: 'Building Foundational Script & Alphabets',
      syllabus: 'Savi Kannada Class 1 & Kali Kannada Class 1',
      targetSkills: ['Kannada Aksharamale Vowels & Consonants', 'Phonetic Pronunciation Transliteration', 'Basic Everyday Words (Colors, Animals, Family)']
    },
    2: {
      title: 'Class 2 Kannada Curriculum',
      subtitle: 'Sentence Construction & Compound Letters',
      syllabus: 'Savi Kannada Class 2 & Kali Kannada Class 2',
      targetSkills: ['Gunintagalu & Ottakshara Master Key', 'Line-by-line Moral Story Translations', 'Picture-Word Association Exercises']
    },
    3: {
      title: 'Class 3 Kannada Curriculum',
      subtitle: 'Reading Comprehension & Grammar Foundations',
      syllabus: 'Savi Kannada Class 3 & Kali Kannada Class 3',
      targetSkills: ['Nouns (Naamapada) & Verbs (Kriyapada)', 'Prose & Rhyme Chapter Breakdown', 'State Syllabus Solved Answer Keys']
    },
    4: {
      title: 'Class 4 Kannada Curriculum',
      subtitle: 'Advanced Prose, History & Exam Prep',
      syllabus: 'Savi Kannada Class 4 & Kali Kannada Class 4',
      targetSkills: ['Kitturu Chennamma & Historical Figures', 'Sandhigalu & Vibhakti Pratyayagalu', 'Full Question & Answer Exam Repository']
    },
    5: {
      title: 'Class 5 Middle School Curriculum',
      subtitle: 'Literature, Essays & Formal Grammar',
      syllabus: 'Siri Kannada Class 5 & Tili Kannada Class 5',
      targetSkills: ['Formal & Informal Letter Writing Templates', 'Poem Annotations & Literature History', 'Advanced Alankara & Samasa Rules']
    }
  };

  const activeGradeData = gradeInfo[selectedGrade];
  const activeGradeBooks = BOOKS_DATA.filter((b) => b.gradeClass === selectedGrade);

  return (
    <section className="py-20 bg-white border-b border-slate-200/60 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Interactive Curriculum Explorer
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Select Your Child's Grade to <span className="text-amber-600">Explore Syllabi</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Choose your child’s class below to see how Belesu guidebooks break down state board lessons into simple English translations.
          </p>
        </div>

        {/* Grade Selector Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {[1, 2, 3, 4, 5].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`py-3 px-6 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${
                selectedGrade === grade
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookMarked className="w-4 h-4" /> Class {grade}
            </button>
          ))}
        </div>

        {/* Dynamic Grade Content Showcase */}
        <div className="bg-slate-50/80 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Grade Details & Skills */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  {activeGradeData.syllabus}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {activeGradeData.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {activeGradeData.subtitle}
                </p>
              </div>

              <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Academic Skills Built:
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-semibold">
                  {activeGradeData.targetSkills.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={`/books?grade=${selectedGrade}`}
                  className="py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition shadow-md flex items-center gap-2"
                >
                  View All Class {selectedGrade} Books <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>

            {/* Right Column: Book Card Showcase for this Grade */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeGradeBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 uppercase">
                        {book.series} Series
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {book.rating}
                      </div>
                    </div>

                    <div className="h-40 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center mb-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug mb-2">
                      {book.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => onPreview(book)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-800 hover:text-amber-700 font-bold text-xs transition flex items-center justify-center gap-1.5 mt-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Preview Inside
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
