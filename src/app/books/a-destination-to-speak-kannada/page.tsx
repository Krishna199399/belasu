'use client';

import React, { useState } from 'react';
import { BOOKS_DATA } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  BookOpen,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  HelpCircle,
  ChevronDown,
  Building2,
  Phone,
  Compass,
  Home,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  MapPin,
  ShoppingBag as CartIcon,
  Navigation,
} from 'lucide-react';
import Link from 'next/link';
import { BookProduct } from '@/types';
import toast from 'react-hot-toast';

export default function DestinationToSpeakKannadaPage() {
  const { addToCart, openCart } = useCart();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Find book in BOOKS_DATA or fallback
  const book: BookProduct =
    BOOKS_DATA.find((b) => b.slug === 'a-destination-to-speak-kannada') || BOOKS_DATA[BOOKS_DATA.length - 1];

  const handleBuyNow = () => {
    addToCart(book, 'physical', 1);
    toast.success('Added A Destination to Speak Kannada to cart!');
    openCart();
  };

  const learningPillars = [
    {
      num: '01',
      title: 'Kannada Introductions',
      desc: 'Getting to know Kannada and introducing yourself.',
      icon: <Users className="w-5 h-5 text-amber-600" />,
    },
    {
      num: '02',
      title: 'Family and Home Conversations',
      desc: 'Everyday communication at home and with family.',
      icon: <Home className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '03',
      title: 'Questions, Pronouns and Numbers',
      desc: 'Common questions, pronouns and Kannada numbers.',
      icon: <HelpCircle className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '04',
      title: 'Colours and Descriptions',
      desc: 'Learning colours and descriptive vocabulary.',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    },
    {
      num: '05',
      title: 'Travel and Transport',
      desc: 'Conversations involving auto rides, buses, cabs, taxis and metro journeys.',
      icon: <Navigation className="w-5 h-5 text-orange-600" />,
    },
    {
      num: '06',
      title: 'Shopping, Food and Services',
      desc: 'Kannada for groceries, bakeries, pharmacies, educational institutions, banks and post offices.',
      icon: <CartIcon className="w-5 h-5 text-teal-600" />,
    },
    {
      num: '07',
      title: 'Everyday Vocabulary',
      desc: 'Fruits, flowers, animals, body and mind, seasons and Karnataka.',
      icon: <Heart className="w-5 h-5 text-rose-600" />,
    },
    {
      num: '08',
      title: 'Kannada Language Basics',
      desc: 'Gunithakshara, singular and plural forms, and present, past and future tenses.',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
    },
  ];

  const personas = [
    {
      title: 'Beginners learning Kannada',
      desc: 'For those starting from the basics.',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      title: 'Non-Kannada speakers',
      desc: 'For people living, studying or working in Karnataka.',
      icon: <Compass className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Students and young adults',
      desc: 'For those looking to develop practical conversation skills.',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Working professionals',
      desc: 'For people who want to communicate more comfortably in everyday situations.',
      icon: <Briefcase className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Families and new residents',
      desc: 'For those looking to interact with local communities.',
      icon: <Home className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-50 border-rose-200',
    },
    {
      title: 'Kannada language enthusiasts',
      desc: 'For anyone interested in everyday Kannada words, phrases and conversations.',
      icon: <Heart className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200',
    },
  ];

  const faqs = [
    {
      q: 'Where can I buy A Destination to Speak Kannada?',
      a: 'You can order A Destination to Speak Kannada directly from Belesu through the Buy Now option on this page.',
    },
    {
      q: 'Is this Kannada learning book suitable for beginners?',
      a: 'Yes. It introduces basic conversations, vocabulary and foundational language concepts for people beginning to learn Kannada.',
    },
    {
      q: 'Can non-Kannada speakers use this book?',
      a: 'Yes. The book is intended for people who want to learn Kannada for everyday communication, including those living, studying or working in Karnataka.',
    },
    {
      q: 'What topics are covered in the book?',
      a: 'It covers introductions, family conversations, travel, shopping, food, essential services, everyday vocabulary and Kannada language foundations.',
    },
    {
      q: 'What is the price of A Destination to Speak Kannada?',
      a: 'The physical book costs ₹295, with free shipping and an estimated delivery time of 3–5 business days.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. BREADCRUMB STRIP
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-stone-50 border-b border-stone-200 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <Link href="/books" className="hover:text-amber-600 flex items-center gap-1.5 transition">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Books
              </Link>
              <span>/</span>
              <span className="text-slate-400">Spoken Kannada</span>
              <span>/</span>
              <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
                A Destination to Speak Kannada
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Illustrated Spoken Kannada</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. HERO SECTION (H1)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 py-10 lg:py-16 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Book Details & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Pictorially & Innovatively Crafted
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Physical Book • Free Shipping
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-200 text-slate-700">
                  SKU: DSK
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  A Destination to Speak Kannada
                </h1>
                <p className="text-base sm:text-lg font-bold text-amber-700 leading-snug">
                  Pictorially and Innovatively Crafted Book to Speak and Learn Kannada
                </p>
              </div>

              {/* Price & Delivery Card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm inline-flex flex-wrap items-baseline gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">₹295</span>
                  <span className="text-base text-slate-400 line-through">₹350</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Save ₹55
                  </span>
                </div>
                <div className="h-4 w-px bg-stone-200 hidden sm:block"></div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Physical book • Free shipping • Estimated delivery: 3–5 business days</span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Learn Kannada for everyday communication with <em>A Destination to Speak Kannada</em> by Belesu. This illustrated book introduces practical conversations, useful vocabulary and essential language concepts through familiar situations such as talking with family, travelling, shopping and interacting with local services.
                </p>
                <p className="font-medium text-slate-900">
                  Designed for beginners and non-Kannada speakers, it offers a practical starting point for learning Kannada and building everyday conversation skills.
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-black bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all transform active:scale-[0.99] shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-slate-950" />
                  <span>Buy Now for ₹295</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Illustrated 23 Chapters
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-600" /> Doorstep Delivery across Karnataka & India
                </span>
              </div>

            </div>

            {/* Right: Book Visual Presentation */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[360px]">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

                {/* Cover Presentation Box */}
                <div className="relative rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4">
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex flex-col justify-between p-6 text-white shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="bg-white/95 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        Spoken Kannada
                      </span>
                      <span className="bg-black/30 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        23 Chapters
                      </span>
                    </div>

                    <div className="text-center py-6 z-10">
                      <div className="text-5xl mb-3">🗣️</div>
                      <h3 className="text-2xl font-black tracking-tight leading-tight">
                        A Destination to Speak Kannada
                      </h3>
                      <p className="text-xs text-amber-100 font-medium mt-2">
                        Pictorial Spoken Kannada for Beginners
                      </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur rounded-xl p-2.5 text-center text-xs text-amber-200 font-semibold z-10">
                      Everyday Conversations • Useful Vocabulary
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-semibold">
                    <span>Illustrated Practical Guide</span>
                    <span className="text-amber-700 font-bold">Price: ₹295</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. WHY CHOOSE A DESTINATION TO SPEAK KANNADA? (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Core Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Why Choose A Destination to Speak Kannada?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Engineered with a practical, visual approach that makes everyday Kannada easy to grasp, retain, and speak with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* H3: Learn Through Everyday Conversations */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Learn Through Everyday Conversations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Explore Kannada conversations based on common situations, from speaking with family to interacting with people while travelling or shopping.
              </p>
            </div>

            {/* H3: Understand Through Illustrations */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Understand Through Illustrations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Learn with a pictorial approach that connects Kannada words and conversations to familiar everyday situations.
              </p>
            </div>

            {/* H3: Build Practical Kannada Skills */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Build Practical Kannada Skills
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Explore useful expressions, vocabulary and sentence patterns that can support everyday communication.
              </p>
            </div>

            {/* H3: Learn the Language Foundations */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Learn the Language Foundations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Build familiarity with numbers, pronouns, colours, singular and plural forms, and tenses.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. WHAT YOU WILL LEARN FROM THIS BOOK (H2 & 8 PILLARS)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Comprehensive 23-Chapter Syllabus
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              What You Will Learn from This Book
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The book covers 23 chapters, organised around practical conversation and foundational Kannada learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {learningPillars.map((pillar) => (
              <div
                key={pillar.num}
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-stone-100 text-slate-800 font-black text-xs flex items-center justify-center border border-stone-200">
                      {pillar.num}
                    </span>
                    <div className="p-2 rounded-lg bg-stone-50">{pillar.icon}</div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. WHO CAN BENEFIT FROM THIS BOOK? (H2 & 6 PERSONAS)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Inclusive Learning Audience
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Who Can Benefit from This Book?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Crafted to empower every learner navigating daily life, work, and community across Karnataka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {personas.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-md transition space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-xs">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. BUY ONLINE CONVERSION BANNER (H2)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4 text-amber-400" />
            Free Shipping Included
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-950 tracking-tight max-w-3xl mx-auto leading-tight">
            Buy A Destination to Speak Kannada Online
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Start your Kannada learning journey with an illustrated book built around everyday conversations, useful vocabulary and essential language concepts.
          </p>

          <div className="p-3 bg-slate-950/10 rounded-2xl max-w-xs mx-auto">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 block">Price: ₹295</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-black bg-slate-950 hover:bg-slate-900 text-white transition-all transform active:scale-95 shadow-xl cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>Buy Now for ₹295</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-900 pt-2 italic">
            Learn Kannada. Speak with confidence. Connect with your surroundings.
          </p>

          <p className="text-xs font-semibold text-slate-800">
            Free shipping • Estimated delivery: 3–5 business days.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. FREQUENTLY ASKED QUESTIONS (H2 & H3s)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about A Destination to Speak Kannada.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50/80 transition cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. CORPORATE CREDIBILITY STRIP
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
                <strong>Operations Office:</strong> VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>All Guidebooks</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Support</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
