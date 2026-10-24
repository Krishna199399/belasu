import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Headphones,
  MessageSquare,
  Sparkles,
  Compass,
  Target,
  Users,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Layers,
  HeartHandshake,
  Laptop,
  GraduationCap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Belesu | Kannada Academic Learning Initiative',
  description:
    'Discover Belesu’s vision, mission, and thoughtful approach to Kannada academic learning through English-translated guidebooks and language development.',
  keywords: [
    'Kannada academic guidebooks',
    'English-translated Kannada guidebooks',
    'Kannada academic learning',
    'Kannada learning initiative',
    'Kannada guidebooks for school students',
  ],
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  // Static book preview gallery items (as requested: displayed without links)
  const previewBooks = [
    {
      title: 'Savi Kannada Guidebook',
      classes: 'Class 1 to 4',
      badge: 'Printed Edition',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      cover: '/covers/savi-4.png',
      description: 'Parallel English translation, word meanings & solved exercises.',
    },
    {
      title: 'Kali Kannada Guidebook',
      classes: 'Class 1 to 4',
      badge: 'Printed Edition',
      tagColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      cover: '/covers/kali-1.png',
      description: 'Foundational script, pronunciation & transliteration support.',
    },
    {
      title: 'Siri Kannada Guidebook',
      classes: 'Class 5',
      badge: 'Printed Edition',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
      cover: '/covers/siri-5.png',
      description: 'Middle school literature, grammar & model composition guides.',
    },
    {
      title: 'Tili Kannada Guidebook',
      classes: 'Class 5',
      badge: 'Printed Edition',
      tagColor: 'bg-teal-100 text-teal-900 border-teal-300',
      cover: '/covers/tili-5.png',
      description: 'Chapter takeaways, accurate translations & textbook solutions.',
    },
    {
      title: 'Siri Kannada Digital',
      classes: 'Class 6 & Classes 7–10',
      badge: 'Digital Reader',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      cover: '/covers/siri-5.png',
      description: 'Interactive digital access across smartphones, tablets & laptops.',
    },
    {
      title: 'Tili Kannada Digital',
      classes: 'Class 6 & Classes 7–10',
      badge: 'Digital Reader',
      tagColor: 'bg-sky-100 text-sky-900 border-sky-300',
      cover: '/covers/tili-5.png',
      description: 'High school state curriculum companion available anywhere.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO SECTION (H1) & BRAND PURPOSE
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-22 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white border-b border-stone-200 overflow-hidden">
        {/* Ambient decorative blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-300/20 via-orange-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Breadcrumb & Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kannada Academic Learning Initiative</span>
          </div>

          {/* H1 Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            About Belesu
          </h1>

          {/* Mottos & Cultural Script */}
          <div className="pt-4 pb-6 flex flex-col items-center gap-2">
            <span className="text-xl sm:text-2xl font-serif font-bold text-amber-800 italic">
              “Kannada Mathadi, Kannada Belesi”
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/90 border border-amber-200 shadow-2xs">
              <span className="text-sm font-bold text-amber-900">ಕನ್ನಡ ಮಾತಾಡಿ, ಕನ್ನಡ ಬೆಳೆಸಿ</span>
            </div>
          </div>

          {/* Core Introduction Copy */}
          <div className="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            <p>
              At Belesu, we believe that learning a language is about more than understanding words.
              It is about building confidence, creating connections, and feeling comfortable using the
              language in everyday life.
            </p>
            <p className="text-slate-600">
              Belesu is a Kannada learning initiative that brings together academic learning and language
              development. Through innovative guidebooks and learning approaches, we aim to help children
              understand Kannada better, support parents in their learning journey, and encourage a
              stronger connection with the language.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. OUR VISION & MISSION SECTION (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Vision Column (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-amber-300 transition-colors">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                  <Compass className="w-6 h-6" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                  Our Vision
                </h2>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Our vision is to elevate Kannada across Karnataka through innovative approaches that
                  connect academic growth with everyday communication.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We want children to see Kannada not simply as a subject they study in school, but as a
                  language they can understand, appreciate and use with confidence. By making Kannada
                  learning more accessible, we hope to nurture a lasting connection between young learners
                  and the language around them.
                </p>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Nurturing a lifelong connection with Kannada</span>
              </div>
            </div>

            {/* Mission Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-amber-300 transition-colors">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Target 2030 Goal
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                  Our Mission
                </h2>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Belesu’s mission is to focus on primary school children and help them develop their
                  Kannada language skills academically and in everyday communication.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We recognise that children learn languages in different environments. For some, Kannada
                  is spoken at home; for others, school may be their primary opportunity to learn the
                  language. We aim to make that learning experience more supportive through resources
                  that help children understand lessons, practise reading and writing, and gradually
                  become more confident in communicating in Kannada.
                </p>

                {/* Stated 2030 Long-Term Goal Highlight Box */}
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-orange-50/30 rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <span>Ambition: 18% Population Coverage by 2030</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    Our stated long-term goal is to expand the base and reach of Kannada-speaking
                    communities, with an ambition to increase Kannada-speaking population coverage to 18%
                    by 2030. This reflects our belief that supporting children in their early learning
                    years can contribute to a stronger connection with Kannada in the future.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Early primary school focus · Inclusive for non-Kannadiga homes</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. WHY BELESU MATTERS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>Bridging the Learning Gap</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                Why Belesu Matters
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Language learning becomes more meaningful when children receive support both at school
                and at home. However, when parents are unfamiliar with the language their children study,
                helping with lessons and homework can become difficult.
              </p>

              <div className="space-y-4 pt-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Bridging School & Home</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                      Belesu aims to bridge this gap. We believe that children should have the opportunity
                      to understand what they learn, while parents should have accessible ways to
                      participate in their progress, even when they are still learning the language themselves.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Learning Together as a Family</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                      By bringing Kannada and English together through learning resources, we hope to make
                      Kannada academic learning more approachable and encourage families to learn alongside
                      their children.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Card: School-Home Bridge Diagram */}
            <div className="lg:col-span-5 bg-gradient-to-br from-stone-50 via-amber-50/40 to-stone-100 p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-inner flex flex-col justify-center space-y-5">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  The Dual-Support Model
                </span>
                <h4 className="text-lg font-serif font-black text-slate-900">
                  Empowering Every Household
                </h4>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
                    🏫
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Classroom Instruction</span>
                    <span className="text-slate-500">Prescribed Karnataka State Syllabus</span>
                  </div>
                </div>

                <div className="flex justify-center text-amber-600 font-bold text-xs">
                  ↕ Belesu English-Translated Guidebook Bridge ↕
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                    🏡
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Home Learning & Revision</span>
                    <span className="text-slate-500">Non-Kannadiga parents teach with ease</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-500 italic">
                “When parents feel empowered to guide homework, children learn with joyful confidence.”
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. WHAT WE DO (H2) & STATIC BOOK PREVIEW SHOWCASE (WITHOUT LINKS)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/60 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Editorial Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Comprehensive Academic Curricula</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              What We Do
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Belesu develops innovative Kannada academic guidebooks to help students understand their
              lessons, strengthen their language skills, and approach their schoolwork with greater confidence.
            </p>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 pt-2 text-left sm:text-center">
              <p>
                Our printed guidebook series includes <strong>Savi Kannada</strong> and <strong>Kali Kannada</strong> for Classes 1 to 4,
                and <strong>Siri Kannada</strong> and <strong>Tili Kannada</strong> for Class 5. These books are designed to support students
                through English translations, chapter-wise explanations, pronunciation guidance and exercise support, depending on the individual book.
              </p>
              <p>
                As students progress to higher classes, Belesu is extending its learning resources through digital guidebooks.
                We offer a digital Siri Kannada guidebook for Class 6, along with Tili Kannada digital guidebooks for Class 6 and Classes 7 to 10,
                and Siri Kannada digital guidebooks for Classes 7 to 10.
              </p>
              <p className="text-slate-500 italic">
                Our English-translated learning resources help students connect Kannada text with familiar meanings,
                making lessons easier to follow and supporting independent learning. They are designed to supplement
                prescribed textbooks and give parents an additional resource to refer to when helping their children with Kannada studies at home.
              </p>
            </div>
          </div>

          {/* Book Preview Showcase Grid (Display Preview of the books WITHOUT links as specified) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Visual Catalog Preview
                </span>
                <h3 className="text-base sm:text-lg font-serif font-black text-slate-900">
                  Belesu Printed & Digital Guidebook Series
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-stone-200/80 px-2.5 py-1 rounded-full">
                6 Featured Series
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {previewBooks.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-200"
                >
                  <div>
                    {/* Top Tag & Class */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${item.tagColor}`}
                      >
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {item.classes}
                      </span>
                    </div>

                    {/* Book Mockup Stage (Static without link) */}
                    <div className="h-44 sm:h-48 flex items-center justify-center p-2 mb-3 bg-stone-50 rounded-xl">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="max-h-full w-auto object-contain drop-shadow-md rounded"
                      />
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2 pt-2 border-t border-stone-100">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-slate-500 pt-2">
              At Belesu, we believe language learning goes beyond memorising words or completing exercises.
              By combining academic support with accessible learning resources, we aim to help students develop
              their Kannada skills step by step and build a lasting connection with the language.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. BHASYA BELESU (H2) & MATRU BHASYA TECHNIQUE
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Matru Bhasya Technique</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Bhasya Belesu
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Bhasya Belesu is another concept within the Belesu initiative, based on the Matru Bhasya
              technique. It focuses on helping children engage with Kannada through familiar, real-life
              activities and a gradual approach to language learning.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We believe that language develops through meaningful engagement, not only through textbooks.
              Children need opportunities to hear a language, use it in conversation and gradually become
              comfortable reading it. Bhasya Belesu is designed around three important elements of language learning:
            </p>
          </div>

          {/* 3 Core Interactive Elements / Pillars (H3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pillar 1: Listening */}
            <div className="bg-stone-50/90 rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Step 1 · Auditory Immersion
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-0.5">
                    Listening
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Develop familiarity with Kannada by listening to the language in meaningful and everyday contexts.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Natural phonetics & tone recognition
              </div>
            </div>

            {/* Pillar 2: Speaking */}
            <div className="bg-stone-50/90 rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                    Step 2 · Conversational Expression
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-0.5">
                    Speaking
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Encourage children to practise expressing themselves in Kannada and build confidence through communication.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Fear-free daily verbal practice
              </div>
            </div>

            {/* Pillar 3: Reading */}
            <div className="bg-stone-50/90 rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Step 3 · Literacy & Comprehension
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-0.5">
                    Reading
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Help children develop their ability to recognise, read and understand Kannada words and text as they progress in their learning.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-200/80 text-[11px] font-bold text-slate-500">
                Script decoding & word association
              </div>
            </div>

          </div>

          <div className="text-center max-w-2xl mx-auto pt-2">
            <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
              “Together, these elements reflect Belesu’s broader belief that language learning should
              connect academic understanding with real-life communication.”
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. KANNADA MATHADI, KANNADA BELESI & DUAL CTAS (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 relative overflow-hidden">
        {/* Decorative circle glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
            <span>Our Living Cultural Manifesto</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Kannada Mathadi, Kannada Belesi
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 text-white/90 text-sm sm:text-base leading-relaxed">
            <p>
              For us, “Kannada Mathadi, Kannada Belesi” is more than a tagline. It expresses the purpose behind
              Belesu: encouraging people to learn Kannada, use it in their daily lives and help the language grow
              through every new generation.
            </p>
            <p>
              We believe that when children are given the right support early in life, they can build a more confident
              and meaningful relationship with Kannada. By supporting students, parents and educators, Belesu hopes
              to contribute to a future where more people can learn, understand and communicate in Kannada with confidence.
            </p>
          </div>

          {/* Dual Action CTAs matching about content.md verbatim */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Link
              href="/books"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore Our Kannada Guidebooks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-stone-100 text-slate-950 border border-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Contact Belesu</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. CORPORATE CREDIBILITY & REGISTERED OFFICE STRIP
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Registered Office:</strong> Deshpande Startups, Next to International Airport, Gokul Road Hubballi - 580030 Karnataka
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Full Book Catalog</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Get in Touch</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
