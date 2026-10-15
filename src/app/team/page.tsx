'use client';

import React from 'react';
import { TEAM_MEMBERS } from '@/data/mockData';
import Link from 'next/link';
import { BookOpen, ChevronRight, Building2 } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Page Header */}
      <section className="pt-12 pb-8 text-center bg-stone-50/50 border-b border-stone-200">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-bold text-amber-800 tracking-tight mb-3">
          Belesu Team
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
          <span>Home</span>
          <span>•</span>
          <span className="text-amber-700">Team</span>
        </div>
      </section>

      {/* 2. Team Members Showcase Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 gap-12 sm:gap-16 max-w-md mx-auto">
            
            {/* Member 1: Roopa Sanjiv P */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-stone-200 shadow-2xl p-1 bg-white">
                <img
                  src={TEAM_MEMBERS[0].imageUrl}
                  alt="Roopa Sanjiv P"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900">
                  Roopa Sanjiv P
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-1">
                  Belesu – Founder and Director
                </p>
              </div>

              <div className="w-full max-w-md border-t border-amber-800/30 pt-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  Roopa has been volunteering for Kannada language for Teaching and Research. She has done extensive research on the issues that children, Parents, and school face for Kannada subject.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Research Section */}
      <section className="py-16 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-5 space-y-10">
          
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-bold text-amber-800 tracking-tight">
              The Research
            </h2>
          </div>

          {/* Left-Bordered Editorial Text Block */}
          <div className="border-l-2 border-amber-700/80 pl-6 sm:pl-8 space-y-4 text-xs sm:text-sm text-slate-700 font-serif leading-relaxed">
            <p>
              With demographic change to continue due to rapid urbanization in the cities like Bengaluru and other parts of Karnataka, Kannada as a mandatory subject in school has become challenging for non-Kannadiga parents and their children.
            </p>
            <p>
              With limited to No knowledge of Kannada, Parents are unable to guide their children and strengthen the Kannada language for speaking, writing and reading abilities.
            </p>
            <p>
              Parents are dependent on the translation tools and internet channels to help their child learn Kannada subject, leading to increase in the screen time and consuming more efforts.
            </p>
            <p className="font-semibold text-slate-800">
              These are not the right medium to learn the subject and language.
            </p>
            <p>
              Schools and Teachers on the other hand put lot of effort for their students to build expertise on Kannada language. However, there is no proper connect medium between School, Parents and the child because whatever taught in the school, Parents have to understand it before guiding their child at home.
            </p>
            <p className="italic text-slate-600">
              The efforts that Teachers put is not yielding required results.
            </p>
            <p>
              The impact of Covid with online classes impacted a lot for the children in 2019 to 2022 where a Grade 8th child was not able to read Kannada text properly of Grade 3rd book.
            </p>
            <p>
              Belesu collaboratively discussed this issue with few Professors at <strong>Azim Premji University</strong>, as a part of their language research.
            </p>
            <p>
              To solve this problem, Roopa, Belesu Founder, performed a <strong>pilot run</strong> on few students by writing Belesu translated books. It was found that such English to Kannada translated books helped child and Parents at home to connect on this language, while Teachers at school continued to build the stronger language ecosystem. Belesu made it easier, and the children were able to read, write, speak and understand properly in one academic year securing better marks in the Kannada exam.
            </p>
            <p>
              To simplify learning Kannada, with a mammoth effort, Roopa authored and introduced Belesu colorful books by translating Savi, Siri, Kali Kannada school textbooks to Kannada-English for pronunciation and meaningfully connecting to English for understanding.
            </p>
            <p className="font-semibold text-amber-900">
              Belesu Innovative Guidebooks removed the gap between Parents, Child, and Teachers.
            </p>
            <p>
              Interestingly, the books have reduced screen time for children and have been receiving great feedback from Parents stating – <em>We too are learning Kannada</em>. The overall objective is to simplify the learning and build the confidence primarily for the students for reading, writing, understanding, and speaking with a target to increase 18% Kannada speaking population by 2030.
            </p>
            <p className="text-base font-bold text-amber-800 pt-2 italic">
              Many of our customers say, this is not a Business, it is Service!! And so do, we believe..
            </p>
          </div>

        </div>
      </section>

      {/* 4. Corporate Footer Card */}
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
