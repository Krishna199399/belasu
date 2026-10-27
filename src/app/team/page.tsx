import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Target,
  GraduationCap,
  Sparkles,
  Quote,
  Lightbulb,
  School,
  TrendingUp,
  BookOpen,
  HeartHandshake,
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meet the Belesu Team | Kannada Learning Initiative',
  description:
    'Meet Roopa Sanjiv P, Founder and Director of Belesu, and learn about the research and purpose behind its English-translated Kannada guidebooks.',
  alternates: {
    canonical: '/team',
  },
};

export default function TeamPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* ── Breadcrumb ── */}
      <div className="bg-stone-50 border-b border-stone-200 py-2.5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold" aria-current="page">Belesu Team</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO HEADER (H1: Belesu Team)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-10 sm:py-12 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white border-b border-stone-200 overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Leadership & Research</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Belesu Team
            </h1>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. FOUNDER SPOTLIGHT (H2: Roopa Sanjiv P)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-stone-50 via-amber-50/30 to-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-md relative overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Corner ambient glow accent */}
            <div className="absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-br from-amber-400/20 to-orange-400/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
              
              {/* Portrait Showcase */}
              <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/30 to-orange-400/20 rounded-3xl blur-md group-hover:blur-lg transition-all" />
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-amber-300/90 shadow-md bg-white">
                    <img
                      src="/team-Roopa.png"
                      alt="Roopa Sanjiv P"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Founder Narrative */}
              <div className="md:col-span-8 lg:col-span-9 space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
                  <span>Belesu | Founder and Director</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
                  Roopa Sanjiv P
                </h2>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-1 max-w-2xl">
                  Roopa has been volunteering in Kannada language teaching and research. She has conducted extensive research into the challenges children, parents, and schools face in learning and teaching Kannada as a subject.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. H2: The Research
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-stone-50/60 border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Academic Investigation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
              The Research
            </h2>
          </div>

          {/* Opening Paragraph Callout */}
          <div className="p-6 rounded-2xl bg-white border-l-4 border-l-amber-500 border border-stone-200/90 shadow-2xs">
            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
              Rapid urbanisation in Bengaluru and other parts of Karnataka has made learning Kannada as a mandatory school subject challenging for many non-Kannada-speaking parents and their children.
            </p>
          </div>

          {/* 2-Column Insight Cards: Parents & Schools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Parents Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-amber-300 transition-all duration-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Parents with limited or no knowledge of Kannada often struggle to support their children&apos;s reading, writing, and speaking skills. Many rely on translation tools and online resources, which can increase screen time and require considerable effort without always providing structured support for learning the subject.
              </p>
            </div>

            {/* Schools & Teachers Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:border-amber-300 transition-all duration-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center justify-center shadow-2xs">
                <School className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Schools and teachers work hard to develop students&apos; Kannada language skills. However, a gap can remain between schools, parents, and children, as parents need to understand classroom lessons to support their children at home.
              </p>
            </div>

          </div>

          {/* Research Discoveries: COVID Impact & Azim Premji University Collaboration */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            
            {/* COVID-19 Grade 8 Case Study */}
            <div className="md:col-span-7 bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white rounded-2xl p-6 border border-amber-300/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                The impact of online schooling during the COVID-19 pandemic further highlighted these challenges. One example was a Grade 8 student who struggled to read Kannada text from a Grade 3 textbook.
              </p>
            </div>

            {/* Azim Premji University Consultation */}
            <div className="md:col-span-5 bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-white rounded-2xl p-6 border border-emerald-300/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                As part of its language research, Belesu discussed these challenges with professors at Azim Premji University.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. H3: From Research to a Practical Learning Solution
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Applied Methodology</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
              From Research to a Practical Learning Solution
            </h3>
          </div>

          {/* Opening Pilot Lead Statement */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 shadow-2xs">
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              To address this problem, Roopa conducted a pilot with a small group of students using English-translated Kannada books developed for this purpose.
            </p>
          </div>

          {/* 3 Process / Solution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: 1-Year Academic Leap */}
            <div className="bg-stone-50/60 rounded-2xl p-6 border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  The pilot indicated that these books helped children and parents engage with Kannada lessons more effectively at home, while teachers continued supporting learning at school. Within one academic year, the participating children improved their reading, writing, speaking, and understanding of Kannada, and achieved better marks in their Kannada examinations.
                </p>
              </div>
            </div>

            {/* Card 2: Authoring the Guidebooks */}
            <div className="bg-stone-50/60 rounded-2xl p-6 border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Building on this approach, Roopa authored colourful Belesu guidebooks based on the Savi, Siri, and Kali Kannada school textbooks. These books connect Kannada text with English translations to help students understand meanings and learn pronunciation.
                </p>
              </div>
            </div>

            {/* Card 3: Bridging the Gap */}
            <div className="bg-stone-50/60 rounded-2xl p-6 border border-stone-200/90 hover:border-amber-400 hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Belesu&apos;s innovative guidebooks aim to bridge the gap between parents, children, and teachers, making Kannada lessons easier to understand and practise at home.
                </p>
              </div>
            </div>

          </div>

          {/* Testimonial & Screen Time Reduction Banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/15 via-amber-100/50 to-orange-50/30 border border-amber-300 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <Quote className="w-5 h-5 fill-slate-950" />
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal text-center sm:text-left">
              The books have also helped reduce children&apos;s screen time. Parents have shared positive feedback, including comments such as, &ldquo;We too are learning Kannada.&rdquo;
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. H2: Our Objective
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-gradient-to-b from-stone-50/60 via-amber-50/20 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Long-Term Mission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
              Our Objective
            </h2>
          </div>

          {/* 2 Showstopping Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Objective 1: Population Coverage Target Card (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all duration-200">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Target Ambition
                </span>
                <span className="text-xl sm:text-2xl font-serif font-black text-amber-600">
                  18% by 2030
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Belesu aims to simplify Kannada learning and build students&apos; confidence in reading, writing, understanding, and speaking the language. Its long-term goal is to contribute towards increasing Kannada-speaking population coverage by 18% by 2030.
              </p>
            </div>

            {/* Objective 2: Service Ethos Dark Card (5 cols) */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shadow-2xs">
                <Quote className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-amber-100 leading-relaxed font-normal">
                Many of our customers tell us, &ldquo;This is not a business; it is a service.&rdquo; We share that belief and remain committed to making Kannada learning more accessible to children and families.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
