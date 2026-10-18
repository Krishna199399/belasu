'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, Building2, MapPin } from 'lucide-react';

export default function AboutPage() {
  const booksGallery = [
    { title: 'Savi Kannada Class 1', cover: '/Savi-Class1-CoverPage.png' },
    { title: 'Savi Kannada Class 2', cover: '/Savi-Class2-CoverPage.png' },
    { title: 'Savi Kannada Class 3', cover: '/SV-3-2.png' },
    { title: 'Savi Kannada Class 4', cover: '/cover-3.png' },
    { title: 'Siri Kannada Class 5', cover: '/SV-5-2.png' },
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Page Header */}
      <section className="pt-12 pb-8 text-center bg-stone-50/50 border-b border-stone-200">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-bold text-amber-800 tracking-tight mb-3">
          About Us
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
          <span>Home</span>
          <span>•</span>
          <span className="text-amber-700">About Us</span>
        </div>
      </section>

      {/* 2. Logo & Brand Motto */}
      <section className="py-10 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black tracking-tight text-amber-500">Belesu</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              ಬೆಳೆಸು
            </span>
          </div>
          <p className="text-xs font-extrabold tracking-widest text-rose-600 uppercase">
            Kannada Mathadi, Kannada Belesi
          </p>
        </div>
      </section>

      {/* 3. Vision & Mission Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image: Mother & Child Reading */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 aspect-[4/3]">
                <img
                  src="/mother-and-child.png"
                  alt="Mother and Child Reading Belesu Guidebook"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Text: Vision & Mission Copy */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Our Vision */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  Belesu is a Kannada initiative envisioned to elevate the Kannada language across the Karnataka state by using innovative methods for Academic growth and the Communication, using Kannada as a medium to speak for day to day activities.
                </p>
              </div>

              {/* Our Mission */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  Today we have 41% of Kannada speaking population in Bengaluru. Our Mission is to focus on Primary school children, enabling them for the Kannada Language academically and the communication with intent to increase the base and coverage of Kannada speaking population up to 18% by 2030.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  The key reason to focus on the Primary school children is to get them good exposure to the Kannada Language from Belesu, build fluency in Kannada in 12-18 months, grow academically and become confident in communication when they speak Kannada for the day to day activities.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. What We Do Section */}
      <section className="py-16 bg-stone-50 border-y border-stone-200">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-bold text-amber-800">
              What we do?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-serif">
              We, at Belesu, have systematically crafted Kannada Academic Books for 1st, 2nd, 3rd, 4th and 5th Standard to engage Kannada and Non-Kannadiga children more into Kannada by understanding the written text and an effort to enhance their capability to speak as they progress on their academic subjects.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-serif">
              The objective of this book is to meaningfully connect the academic Kannada content with an understandable English translated meaning, helps with accurate pronunciation for the young minds with limited support from their parents or tutors.
            </p>
          </div>

          {/* Book Showcase Gallery Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-6">
            {booksGallery.map((book, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-full aspect-[3/4] mb-3 flex items-center justify-center p-2 bg-stone-50 rounded-xl">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800">{book.title}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Bhasya Belesu Section */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy & Bullet Points */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-serif italic font-bold text-amber-800">
                Bhasya Belesu
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Another concept of Belesu is based on the Matru Bhasya technique.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                It is designed based on the real time activities performed by children, to learn Kannada methodically by engaging in tasks for:-
              </p>

              <ul className="space-y-3 font-bold text-sm text-slate-800 pl-4">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Listening
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Speaking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Reading
                </li>
              </ul>
            </div>

            {/* Right Mockup Sign */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-stone-50 border border-stone-300 rounded-2xl p-8 shadow-xl max-w-md w-full text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-amber-500">Belesu</h3>
                  <p className="text-xs font-bold text-rose-600 tracking-wide">
                    Kannada Mathadi, Kannada Belesi
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A Kannada Initiative for Academics and Communication
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Corporate Office & Registered Info Card */}
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
