import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Target,
  MonitorOff,
  School,
  AlertCircle,
  Award,
  Lightbulb,
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
    <div className="bg-white min-h-screen">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO HEADER (H1)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-14 pb-12 sm:pt-20 sm:pb-16 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white border-b border-stone-200 overflow-hidden text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-gradient-to-tr from-amber-300/20 via-orange-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Dedicated Educational Leadership</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-slate-900 tracking-tight leading-tight mb-4">
            Belesu Team
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the passion, ground-level research, and community commitment powering Belesu’s mission to make Kannada academic learning accessible to every child.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. FOUNDER SPOTLIGHT: ROOPA SANJIV P (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-stone-50 via-amber-50/30 to-white rounded-3xl border border-stone-200 p-8 sm:p-12 lg:p-14 shadow-lg relative overflow-hidden">
            {/* Corner badge accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-bl-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Portrait Showcase */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-amber-300 shadow-2xl p-1 bg-white">
                    <img
                      src="/team-Roopa.png"
                      alt="Roopa Sanjiv P - Founder and Director of Belesu"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-2.5 rounded-full shadow-md border-2 border-white">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                    Roopa Sanjiv P
                  </h2>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800">
                    Founder and Director, Belesu
                  </p>
                </div>
              </div>

              {/* Right Column: Narrative & Mission Focus */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                  <span>Language Teaching & Educational Research</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
                  Pioneering Accessible Kannada Learning for the Next Generation
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  Roopa has been volunteering in Kannada language teaching and research. She has
                  conducted extensive research into the challenges children, parents, and schools face
                  when learning and teaching Kannada as a subject.
                </p>

                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Key Leadership Highlights
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Conducted in-depth ground research on urbanization language hurdles</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Spearheaded academic pilots yielding proven 1-year fluency improvements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Authored complete English-translated guidebooks across Savi, Siri & Kali</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. THE RESEARCH (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Ground Reality & Academic Investigation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              The Research
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              As Bengaluru and other parts of Karnataka continue to urbanise rapidly, learning Kannada as a mandatory school subject has become challenging for many non-Kannada-speaking parents and their children.
            </p>
          </div>

          {/* Research Insight Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Non-Kannada Speaking Parents */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Parental Guidance Barriers
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Parents with little or no knowledge of Kannada often struggle to guide their children and support their reading, writing, and speaking skills.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-bold text-slate-500">
                Home revision becomes stressful
              </div>
            </div>

            {/* Card 2: Screen Time & Ineffective Tools */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-2xs">
                  <MonitorOff className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Translation Tools & Screen Fatigue
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Many parents depend on translation tools and online resources to help their children learn Kannada. This can increase screen time and require considerable effort from both parents and children. However, these resources may not provide the structured support children need to learn the subject and develop their language skills effectively.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-bold text-rose-700">
                Unstructured tools don’t build mastery
              </div>
            </div>

            {/* Card 3: School-Parent-Child Gap */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shadow-2xs">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  The Teacher-Parent Disconnect
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Schools and teachers, meanwhile, put considerable effort into helping students develop their Kannada language skills. However, there can be a gap between the school, the child and the parents. To guide their children at home, parents first need to understand what has been taught in school. As a result, the efforts made by teachers may not always translate into the expected learning outcomes.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-bold text-indigo-700">
                Missing the home-school link
              </div>
            </div>

          </div>

          {/* Real-World Case Study Box: COVID-19 Impact & Azim Premji University Collaboration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Case Study (7 cols) */}
            <div className="lg:col-span-7 bg-amber-500/10 rounded-3xl p-8 border border-amber-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-2xs font-black">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Real-World Case Study (2019 – 2022)
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                  The Lingering Impact of Pandemic Learning Disruptions
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The impact of online schooling during the COVID-19 period, from 2019 to 2022, further affected many children’s learning. One example that highlighted this challenge was a <strong>Grade 8 student who struggled to read Kannada text from a Grade 3 textbook</strong>.
                </p>
              </div>
            </div>

            {/* Right Academic Collaboration (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                  Academic Research Consultation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Belesu discussed these challenges with a few professors at <strong>Azim Premji University</strong> as part of language research.
                </p>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block">
                Pedagogical validation & linguistic methodology
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. FROM RESEARCH TO A PRACTICAL LEARNING SOLUTION (H3)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Transformative Outcomes
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              From Research to a Practical Learning Solution
            </h3>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              To address this problem, Roopa, the founder of Belesu, conducted a pilot with a small group of students using translated books developed for this purpose.
            </p>
          </div>

          {/* Timeline / 3-Step Journey */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Step 1: The Pilot Breakthrough */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200 inline-block">
                  Phase 1 · The Pilot Study
                </span>
                <h4 className="text-lg font-serif font-bold text-slate-900">
                  Proven 1-Year Academic Leap
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The pilot found that English-to-Kannada translated books helped children and parents connect more effectively with the language at home, while teachers continued to strengthen students’ learning at school.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The approach made Kannada learning easier, and the participating children were able to improve their reading, writing, speaking, and understanding within one academic year. They also secured better marks in their Kannada examinations.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Measurable fluency & exam success</span>
              </div>
            </div>

            {/* Step 2: Authoring the Guidebooks */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-200 inline-block">
                  Phase 2 · Curriculum Authoring
                </span>
                <h4 className="text-lg font-serif font-bold text-slate-900">
                  Comprehensive State Syllabus Editions
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To simplify Kannada learning, Roopa undertook the extensive work of authoring and introducing colourful Belesu guidebooks based on the <strong>Savi, Siri and Kali Kannada</strong> school textbooks.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  These books connect Kannada content with English translations, helping students understand meanings and learn pronunciation more effectively.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Line-by-line parallel translation</span>
              </div>
            </div>

            {/* Step 3: Screen-Time Drop & Family Learning */}
            <div className="bg-stone-50/80 rounded-3xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-200 inline-block">
                  Phase 3 · Family Transformation
                </span>
                <h4 className="text-lg font-serif font-bold text-slate-900">
                  Bridging the Home-School Gap
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Belesu’s innovative guidebooks aim to bridge the gap between parents, children and teachers by making Kannada lessons easier to understand and follow at home.
                </p>
                <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                  <p className="text-xs font-serif italic text-amber-900 font-bold">
                    “We too are learning Kannada.”
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    — Frequent feedback from non-Kannadiga parents
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-200/80 flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reduced screen time & joyful learning</span>
              </div>
            </div>

          </div>

          {/* Ambition Box: Target 2030 (18% Population Coverage) */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-orange-50/30 rounded-3xl p-8 sm:p-10 border border-amber-200/90 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>The Stated Long-Term Ambition</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                  18% Kannada-Speaking Population Coverage by 2030
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
                  The broader objective is to simplify Kannada learning and build students’ confidence in reading, writing, understanding, and speaking the language. Belesu’s long-term goal is to contribute towards increasing the Kannada-speaking population by 18% by 2030.
                </p>
              </div>
              <div className="shrink-0 bg-white px-5 py-3 rounded-2xl border border-amber-300 shadow-xs text-center">
                <span className="text-2xl font-black text-amber-600 block">18%</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">By 2030</span>
              </div>
            </div>
          </div>

          {/* Ethos Quote Manifesto Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Our Foundational Principle</span>
            </div>
            
            <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-100 max-w-3xl mx-auto leading-relaxed">
              “Many of our customers tell us, ‘This is not a business; it is a service.’ We share that belief and remain committed to making Kannada learning more accessible to children and families.”
            </p>
            
            <span className="text-xs text-slate-400 tracking-wider uppercase block">
              — Roopa Sanjiv P & The Belesu Academic Team
            </span>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. BOTTOM ACTION CTAS
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-16 bg-gradient-to-b from-stone-50 to-amber-50/30 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Join Hands in Elevating Kannada Academic Learning
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Whether you are a parent seeking homework guidance support or a school administrator looking to supplement classroom learning, explore our guidebooks or connect with our team today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/books"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Guidebooks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Contact Belesu Team</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. CORPORATE CREDIBILITY & REGISTERED OFFICE STRIP
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
