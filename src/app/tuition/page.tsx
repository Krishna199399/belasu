'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TUITION_COURSES } from '@/data/tuitionData';
import { TuitionCourse } from '@/types';
import { ChevronRight, Users, Clock, Video, Star, BookOpen, CheckCircle, Zap } from 'lucide-react';

const SERIES_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Savi:  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  badge: 'bg-amber-500'  },
  Kali:  { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',   badge: 'bg-rose-500'   },
  Siri:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',badge: 'bg-emerald-500'},
  Tili:  { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200', badge: 'bg-violet-500' },
};

function CourseCard({ course }: { course: TuitionCourse }) {
  const colors = SERIES_COLORS[course.series] || SERIES_COLORS.Savi;
  const urgency = course.slotsLeft <= 2;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 ${colors.border} bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}
    >
      {/* Series colour top bar */}
      <div className={`h-1.5 w-full ${colors.badge}`} />

      {/* Header */}
      <div className={`${colors.bg} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest ${colors.text} mb-1`}>
              {course.series} Kannada · Class {course.gradeClass}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {course.title}
            </h3>
          </div>
          {course.badge && (
            <span className={`flex-shrink-0 text-[9px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${colors.badge}`}>
              {course.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{course.shortDescription}</p>
      </div>

      {/* Details */}
      <div className="px-5 py-4 flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{course.durationMonths}-Month Course</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{course.platform}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Max {course.batchSize} students</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-slate-700">{course.teacherName.split(' ')[0]}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2 font-medium">
          📅 {course.schedule}
        </div>

        {/* Slots remaining */}
        <div className={`flex items-center gap-2 text-xs font-bold ${urgency ? 'text-rose-600' : 'text-emerald-600'}`}>
          <div className={`w-2 h-2 rounded-full ${urgency ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
          {urgency ? `⚡ Only ${course.slotsLeft} slots left!` : `${course.slotsLeft} of ${course.batchSize} seats available`}
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-black text-slate-900">₹{course.monthlyFee}</span>
            <span className="text-xs text-slate-500 ml-1">/month</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 line-through">₹{course.monthlyFee * 3}</span>
            <div className="text-xs font-bold text-emerald-600">₹{course.termFee} for 3 months</div>
          </div>
        </div>
        <Link
          href={`/tuition/${course.slug}`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white transition transform active:scale-95 ${colors.badge} hover:opacity-90`}
        >
          View & Enroll <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

const SERIES_FILTERS = ['All', 'Savi', 'Kali', 'Siri', 'Tili'];

export default function TuitionPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? TUITION_COURSES
    : TUITION_COURSES.filter(c => c.series === activeFilter);

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f97316 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-[1100px] mx-auto px-3 sm:px-4 lg:px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            New · Online Live Classes
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Learn Kannada Online<br />
            <span className="text-amber-400">with Expert Teachers</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Live, interactive tuition classes for Classes 1–5. Small batches of max 8 students.
            Aligned with your Belesu guidebook. Taught in bilingual English-Kannada format.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#courses"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm px-8 py-3.5 rounded-xl transition transform active:scale-95 uppercase tracking-wider"
            >
              Browse Courses <ChevronRight className="w-4 h-4" />
            </a>
            <Link href="/tuition/enroll"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition"
            >
              Quick Enroll
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-[1100px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-sm text-slate-500 mt-1">Enroll in 3 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <BookOpen className="w-7 h-7" />,
                title: 'Choose Your Class',
                desc: 'Browse courses by series (Savi / Kali / Siri / Tili) and your child\'s grade level.',
                color: 'text-amber-500',
              },
              {
                step: '02',
                icon: <CheckCircle className="w-7 h-7" />,
                title: 'Fill Enrollment Form',
                desc: 'Submit basic details — student name, grade, preferred batch timing, and contact info.',
                color: 'text-emerald-500',
              },
              {
                step: '03',
                icon: <Video className="w-7 h-7" />,
                title: 'Attend Live Sessions',
                desc: 'Our team confirms your slot via WhatsApp. Join Google Meet / Zoom sessions as scheduled.',
                color: 'text-violet-500',
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center space-y-3">
                <div className={`w-16 h-16 rounded-2xl bg-white border-2 border-stone-200 flex items-center justify-center shadow-sm ${item.color}`}>
                  {item.icon}
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                  {item.step}
                </span>
                <h3 className="font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES GRID ── */}
      <section id="courses" className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">All Tuition Courses</h2>
              <p className="text-sm text-slate-500 mt-1">{filtered.length} courses available · ₹500/month</p>
            </div>

            {/* Series Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {SERIES_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition ${
                    activeFilter === f
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BELESU TUITION ── */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-stone-50 border-t border-stone-200">
        <div className="max-w-[1100px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Why Choose Belesu Online Tuition?
            </h2>
            <p className="text-sm text-slate-500">
              We built our tuition program to be the simplest, most effective way for your child to master Kannada.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '👩‍🏫',
                title: 'Expert Teachers',
                desc: 'All teachers are certified Kannada educators with 7–15 years of experience.',
              },
              {
                emoji: '🎯',
                title: 'Small Batches',
                desc: 'Max 8 students per class. Every child gets personal attention and doubt-solving.',
              },
              {
                emoji: '📚',
                title: 'Book-Aligned Syllabus',
                desc: 'Classes follow your Belesu guidebook chapter by chapter — no confusion, just clarity.',
              },
              {
                emoji: '📹',
                title: 'Recorded Sessions',
                desc: 'Missed a class? Every session is recorded and shared with enrolled students.',
              },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-stone-200 p-6 text-center shadow-sm hover:shadow-md transition space-y-3">
                <div className="text-4xl">{item.emoji}</div>
                <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-5 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to Enroll Your Child?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Limited seats available per batch. Submit your enrollment form and our team will contact you within 24 hours on WhatsApp to confirm your slot.
          </p>
          <Link
            href="/tuition/enroll"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm px-10 py-4 rounded-xl transition transform active:scale-95 uppercase tracking-wider"
          >
            Enroll Now — ₹500/month <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
