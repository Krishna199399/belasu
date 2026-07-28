'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TUITION_COURSES } from '@/data/tuitionData';
import {
  ChevronRight, Users, Clock, Video, Star, BookOpen,
  CheckCircle, ArrowLeft, Calendar, User, Zap,
} from 'lucide-react';

const SERIES_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; light: string }> = {
  Savi:  { bg: 'bg-amber-500',   text: 'text-amber-700',   border: 'border-amber-200',  badge: 'bg-amber-500',   light: 'bg-amber-50'  },
  Kali:  { bg: 'bg-rose-500',    text: 'text-rose-700',    border: 'border-rose-200',   badge: 'bg-rose-500',    light: 'bg-rose-50'   },
  Siri:  { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200',badge: 'bg-emerald-500', light: 'bg-emerald-50'},
  Tili:  { bg: 'bg-violet-500',  text: 'text-violet-700',  border: 'border-violet-200', badge: 'bg-violet-500',  light: 'bg-violet-50' },
};

export default function CoursePage() {
  const params = useParams();
  const slug = params?.courseSlug as string;
  const course = TUITION_COURSES.find(c => c.slug === slug);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'term'>('monthly');

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Course Not Found</h1>
        <p className="text-slate-500 text-sm">The course you are looking for does not exist.</p>
        <Link href="/tuition" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to All Courses
        </Link>
      </div>
    );
  }

  const colors = SERIES_COLORS[course.series] || SERIES_COLORS.Savi;
  const urgency = course.slotsLeft <= 2;

  return (
    <div className="bg-white min-h-screen">

      {/* ── BREADCRUMB ── */}
      <div className="bg-stone-50 border-b border-stone-200 py-3">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-amber-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/tuition" className="hover:text-amber-600 transition">Tuition</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800">{course.title}</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className={`py-12 md:py-16 ${colors.light} border-b ${colors.border}`}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <Link href="/tuition" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> All Courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left: Course Info (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} px-2 py-0.5 rounded-full ${colors.light} border ${colors.border}`}>
                  {course.series} Kannada
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  Class {course.gradeClass}
                </span>
                {course.badge && (
                  <span className={`text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {course.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">{course.description}</p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Clock className="w-4 h-4" />, label: 'Duration', value: `${course.durationMonths} Months` },
                  { icon: <Users className="w-4 h-4" />, label: 'Batch Size', value: `Max ${course.batchSize}` },
                  { icon: <Video className="w-4 h-4" />, label: 'Platform', value: course.platform },
                  { icon: <Star className="w-4 h-4 text-amber-500" />, label: 'Teacher', value: course.teacherName.split(' ')[0] },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center shadow-sm">
                    <div className={`${colors.text} flex justify-center mb-1`}>{s.icon}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{s.label}</div>
                    <div className="text-xs font-extrabold text-slate-800">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm w-fit">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{course.schedule}</span>
              </div>
            </div>

            {/* Right: Enroll Card (1 col) */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xl overflow-hidden">
              <div className={`${colors.badge} px-5 py-3`}>
                <p className="text-white text-xs font-black uppercase tracking-wider">Enrollment</p>
              </div>

              {/* Pricing toggle */}
              <div className="p-5 space-y-4">
                <div className="flex rounded-xl overflow-hidden border border-stone-200">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`flex-1 py-2 text-xs font-black transition ${selectedPlan === 'monthly' ? `${colors.badge} text-white` : 'bg-stone-50 text-slate-600 hover:bg-stone-100'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan('term')}
                    className={`flex-1 py-2 text-xs font-black transition relative ${selectedPlan === 'term' ? `${colors.badge} text-white` : 'bg-stone-50 text-slate-600 hover:bg-stone-100'}`}
                  >
                    3-Month Term
                    <span className="absolute -top-2 -right-1 bg-emerald-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full">SAVE 10%</span>
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-4xl font-black text-slate-900">
                    ₹{selectedPlan === 'monthly' ? course.monthlyFee : course.termFee}
                  </span>
                  <span className="text-slate-500 text-sm ml-1">
                    {selectedPlan === 'monthly' ? '/month' : ' for 3 months'}
                  </span>
                </div>

                {/* Urgency */}
                <div className={`flex items-center gap-2 text-xs font-bold rounded-lg px-3 py-2 ${urgency ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${urgency ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                  {urgency ? `Only ${course.slotsLeft} slots left!` : `${course.slotsLeft} seats still available`}
                </div>

                <Link
                  href={`/tuition/enroll?course=${course.id}`}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider text-white transition transform active:scale-95 ${colors.badge} hover:opacity-90`}
                >
                  <Zap className="w-4 h-4" /> Enroll Now
                </Link>
                <p className="text-center text-[10px] text-slate-400">
                  Our team will contact you via WhatsApp within 24 hours to confirm your seat.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: Syllabus + Highlights */}
            <div className="lg:col-span-2 space-y-10">

              {/* Syllabus */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 ${colors.text}`} /> 12-Week Syllabus
                </h2>
                <div className="space-y-2">
                  {course.syllabus.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full text-white text-[10px] font-black flex items-center justify-center ${colors.badge}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Highlights */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">What You Get</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                      <span className="text-sm text-slate-600">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Guidebook */}
              <div className={`rounded-2xl ${colors.light} border ${colors.border} p-6 flex items-center gap-5`}>
                <img src={course.coverImage} alt="Guidebook" className="h-20 w-14 object-cover rounded-lg shadow-md flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">This class uses the guidebook</p>
                  <h3 className={`text-sm font-extrabold ${colors.text} mb-2`}>{course.title.replace('Live Tuition', 'Guidebook')}</h3>
                  <Link
                    href={`/books/${course.linkedBookSlug}`}
                    className={`text-xs font-black ${colors.text} inline-flex items-center gap-1 hover:underline`}
                  >
                    View Guidebook <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Right: Teacher Profile */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className={`h-1.5 ${colors.badge}`} />
                <div className="p-6 space-y-4">
                  <h3 className="font-extrabold text-slate-900">Your Teacher</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={course.teacherImage}
                      alt={course.teacherName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 shadow"
                    />
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{course.teacherName}</p>
                      <p className={`text-[10px] font-bold ${colors.text}`}>{course.series} Kannada Expert</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.teacherBio}</p>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm">Quick FAQ</h3>
                {[
                  { q: 'What platform are classes on?', a: course.platform },
                  { q: 'Can I get a recording?', a: 'Yes — all sessions are recorded and shared.' },
                  { q: 'Is the guidebook required?', a: 'Recommended but not mandatory.' },
                  { q: 'How do I get the class link?', a: 'Via WhatsApp after enrollment confirmation.' },
                ].map(faq => (
                  <div key={faq.q} className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">{faq.q}</p>
                    <p className="text-xs text-slate-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
