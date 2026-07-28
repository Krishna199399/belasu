'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TUITION_COURSES } from '@/data/tuitionData';
import { ChevronRight, CheckCircle, User, Mail, Phone, BookOpen, Clock, MessageSquare } from 'lucide-react';

const SERIES_COLORS: Record<string, string> = {
  Savi: 'bg-amber-500',
  Kali: 'bg-rose-500',
  Siri: 'bg-emerald-500',
  Tili: 'bg-violet-500',
};

const GRADE_OPTIONS = [
  { value: 'class-1', label: 'Class 1' },
  { value: 'class-2', label: 'Class 2' },
  { value: 'class-3', label: 'Class 3' },
  { value: 'class-4', label: 'Class 4' },
  { value: 'class-5', label: 'Class 5' },
];

const BATCH_OPTIONS = [
  { value: 'Morning', label: '🌅 Morning (8:00 AM – 10:00 AM IST)' },
  { value: 'Evening', label: '🌆 Evening (5:30 PM – 7:00 PM IST)' },
  { value: 'Weekend', label: '📅 Weekend (Saturdays & Sundays)' },
];

export default function EnrollPage() {
  const searchParams = useSearchParams();
  const preSelectedCourseId = searchParams?.get('course') || '';

  const [form, setForm] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    courseId: preSelectedCourseId,
    gradeClass: '',
    batchPreference: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preSelectedCourseId) {
      const course = TUITION_COURSES.find(c => c.id === preSelectedCourseId);
      if (course) {
        setForm(f => ({ ...f, gradeClass: `class-${course.gradeClass}` }));
      }
    }
  }, [preSelectedCourseId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.parentName.trim()) e.parentName = 'Parent name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid 10-digit phone number is required';
    if (!form.courseId) e.courseId = 'Please select a course';
    if (!form.gradeClass) e.gradeClass = 'Please select a grade';
    if (!form.batchPreference) e.batchPreference = 'Please select a batch preference';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const selectedCourse = TUITION_COURSES.find(c => c.id === form.courseId);

  if (submitted && selectedCourse) {
    const badgeColor = SERIES_COLORS[selectedCourse.series] || 'bg-amber-500';
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden text-center">
          <div className="bg-emerald-500 px-6 py-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-white">Enrollment Submitted!</h1>
            <p className="text-emerald-100 text-sm mt-1">You are one step closer to mastering Kannada.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className={`rounded-xl ${badgeColor} text-white px-4 py-3`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Course Enrolled</p>
              <p className="font-extrabold text-sm">{selectedCourse.title}</p>
              <p className="text-xs opacity-90 mt-0.5">{selectedCourse.schedule}</p>
            </div>
            <div className="text-left space-y-2 text-xs text-slate-600 bg-stone-50 rounded-xl px-4 py-3">
              <p><span className="font-bold text-slate-800">Student:</span> {form.studentName}</p>
              <p><span className="font-bold text-slate-800">Parent:</span> {form.parentName}</p>
              <p><span className="font-bold text-slate-800">Email:</span> {form.email}</p>
              <p><span className="font-bold text-slate-800">Phone:</span> {form.phone}</p>
              <p><span className="font-bold text-slate-800">Batch Preference:</span> {form.batchPreference}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 font-medium leading-relaxed">
              📱 <strong>What's Next?</strong> Our team will contact you on <strong>{form.phone}</strong> via WhatsApp within 24 hours to confirm your seat and share the class link.
            </div>
            <div className="flex gap-3 pt-2">
              <Link href="/tuition" className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition text-center">
                Browse More
              </Link>
              <Link href="/" className="flex-1 py-2.5 bg-amber-500 rounded-xl text-xs font-black text-white hover:bg-amber-400 transition text-center">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-5 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" /> Online Tuition Enrollment
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Enroll Your Child<br />
            <span className="text-amber-400">in Live Kannada Classes</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Fill the form below. Our team will confirm your seat via WhatsApp within 24 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-14">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-5">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
            <div className="h-1.5 bg-amber-500 w-full" />
            <form onSubmit={handleSubmit} noValidate className="p-8 space-y-7">

              {/* Student Name */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                  <User className="inline w-3.5 h-3.5 mr-1" /> Student Name *
                </label>
                <input
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="Enter your child's full name"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.studentName ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                />
                {errors.studentName && <p className="text-rose-600 text-xs mt-1">{errors.studentName}</p>}
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                  <User className="inline w-3.5 h-3.5 mr-1" /> Parent / Guardian Name *
                </label>
                <input
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent or guardian name"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.parentName ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                />
                {errors.parentName && <p className="text-rose-600 text-xs mt-1">{errors.parentName}</p>}
              </div>

              {/* Email & Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                    <Mail className="inline w-3.5 h-3.5 mr-1" /> Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.email ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                  />
                  {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                    <Phone className="inline w-3.5 h-3.5 mr-1" /> WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9XXXXXXXXX"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.phone ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                  />
                  {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                  <BookOpen className="inline w-3.5 h-3.5 mr-1" /> Select Course *
                </label>
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-white ${errors.courseId ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                >
                  <option value="">-- Select a course --</option>
                  {TUITION_COURSES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} — ₹{c.monthlyFee}/month
                    </option>
                  ))}
                </select>
                {errors.courseId && <p className="text-rose-600 text-xs mt-1">{errors.courseId}</p>}
              </div>

              {/* Grade + Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                    Student Grade *
                  </label>
                  <select
                    name="gradeClass"
                    value={form.gradeClass}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-white ${errors.gradeClass ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                  >
                    <option value="">-- Select grade --</option>
                    {GRADE_OPTIONS.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  {errors.gradeClass && <p className="text-rose-600 text-xs mt-1">{errors.gradeClass}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                    <Clock className="inline w-3.5 h-3.5 mr-1" /> Batch Preference *
                  </label>
                  <select
                    name="batchPreference"
                    value={form.batchPreference}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-white ${errors.batchPreference ? 'border-rose-400 bg-rose-50' : 'border-stone-200'}`}
                  >
                    <option value="">-- Select preference --</option>
                    {BATCH_OPTIONS.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                  {errors.batchPreference && <p className="text-rose-600 text-xs mt-1">{errors.batchPreference}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                  <MessageSquare className="inline w-3.5 h-3.5 mr-1" /> Additional Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any special requirements, questions, or notes for our team..."
                  rows={3}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                />
              </div>

              {/* Preview selected course */}
              {selectedCourse && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1">
                  <p className="font-black text-amber-900">Selected: {selectedCourse.title}</p>
                  <p>📅 {selectedCourse.schedule}</p>
                  <p>💰 ₹{selectedCourse.monthlyFee}/month or ₹{selectedCourse.termFee} for 3 months</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm py-4 px-6 rounded-xl transition transform active:scale-95 uppercase tracking-wider shadow-lg shadow-amber-200"
              >
                Submit Enrollment <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[11px] text-slate-400">
                By submitting, you agree to be contacted by the Belesu team on WhatsApp to confirm your enrollment.
              </p>

            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
