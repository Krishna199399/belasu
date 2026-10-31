'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  HeartHandshake,
  Building2,
  BookOpen,
  ChevronRight,
  Users,
  GraduationCap,
  School,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  X,
} from 'lucide-react';

type TabType = 'videos' | 'social-impact' | 'csr';

export default function VideosMediaPage() {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'social-impact' || hash === 'social-impacts') return 'social-impact';
      if (hash === 'csr') return 'csr';
    }
    return 'videos';
  });

  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  // Listen to hash changes (e.g. back/forward navigation or hash links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'social-impact' || hash === 'social-impacts') {
        setActiveTab('social-impact');
      } else if (hash === 'csr') {
        setActiveTab('csr');
      } else if (hash === 'videos' || hash === 'video') {
        setActiveTab('videos');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  const extendedVideos = [
    {
      id: 'v1',
      title: 'Student Struggle Before Belesu',
      description: 'Understanding the gap students face in Grade 3rd to 8th Kannada reading skills.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel1.mp4',
      thumbnailUrl: '/mother-and-child.png',
      badgeText: 'BEFORE:',
      duration: '0:22'
    },
    {
      id: 'v2',
      title: 'Mother & Child Daily Study Routine',
      description: 'How non-Kannadiga mothers guide their children effortlessly using Belesu translated guidebooks.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel2.mp4',
      thumbnailUrl: '/mother-and-child.png',
      badgeText: 'AFTER:',
      duration: '0:21'
    },
    {
      id: 'v3',
      title: 'Parent-Teacher Ecosystem & Exam Prep',
      description: 'Building student confidence for reading, writing, and speaking in 1 academic year.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel3.mp4',
      thumbnailUrl: '/mother-and-child.png',
      badgeText: 'SUCCESS:',
      duration: '0:48'
    },
    {
      id: 'v4',
      title: 'Savi Kannada Class 1 to 4 Walkthrough',
      description: 'Line-by-line English translation breakdown of Savi Kannada stories & poems.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel1.mp4',
      thumbnailUrl: '/Savi-Class1-CoverPage.png',
      badgeText: 'CLASSROOM:',
      duration: '0:22'
    },
    {
      id: 'v5',
      title: 'Kali Kannada Beginner Series Demo',
      description: 'Phonetic script practice and word-by-word pronunciation guide.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel2.mp4',
      thumbnailUrl: '/savi-kannada-1st-1stpart.png',
      badgeText: 'TUTORIAL:',
      duration: '0:21'
    },
    {
      id: 'v6',
      title: 'Siri & Tili Class 5 Solved Exercises',
      description: 'Grammar rules, essay writing templates, and solved model exam question papers.',
      videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel3.mp4',
      thumbnailUrl: '/SV-5-2.png',
      badgeText: 'EXAM PREP:',
      duration: '0:48'
    }
  ];

  // Real Photos from public/social impacts
  const socialImpactImages = [
    {
      id: 1,
      src: '/social impacts/1.jpeg',
      alt: 'Founder Roopa Sanjiv P presenting Belesu Kali Kannada Class 4 to Union Minister Shri Pralhad Joshi',
      caption: 'Presenting Belesu Kali Kannada to Union Minister Shri Pralhad Joshi',
      tag: 'Union Minister Recognition',
    },
    {
      id: 2,
      src: '/social impacts/2.jpeg',
      alt: 'Receiving ELEVATE Winner Award from Shri Priyank Kharge, Minister for IT & BT, Govt of Karnataka',
      caption: 'ELEVATE Winner Award Presentation with IT & BT Minister Shri Priyank Kharge',
      tag: 'ELEVATE Winner',
    },
    {
      id: 3,
      src: '/social impacts/3.jpeg',
      alt: 'Roopa Sanjiv P with Shri Priyank Kharge holding the ELEVATE 2025 Trophy',
      caption: 'ELEVATE 2025 Winner — Startup Karnataka & Department of IT, BT & ST',
      tag: 'State Honors',
    },
    {
      id: 4,
      src: '/social impacts/4.jpeg',
      alt: 'Best Kannada Language Initiative Startup Bangalore Award',
      caption: 'Best Kannada Language Initiative Startup Award',
      tag: 'Excellence Award',
    },
    {
      id: 5,
      src: '/social impacts/5.jpeg',
      alt: 'Shri Tejasvi Surya (MP Bengaluru South) unveiling A Destination to Speak Kannada with Roopa Sanjiv P',
      caption: 'Official Book Unveiling with Shri Tejasvi Surya (MP Bengaluru South)',
      tag: 'Book Unveiling',
    },
  ];

  // Real Field CSR Photos from public/csr
  const csrGalleryImages = [
    {
      id: 1,
      src: '/csr/1.jpeg',
      alt: 'Founder & Director Roopa Sanjiv P presenting Belesu guidebooks to Karnataka government school students',
      caption: 'Founder & Director Roopa Sanjiv P Handing Over Guidebooks',
      tag: 'Direct Handover',
    },
    {
      id: 2,
      src: '/csr/2.jpeg',
      alt: 'Government school headmaster and faculty holding Belesu Savi Kannada books in classroom',
      caption: 'School Headmaster & Faculty Partnership',
      tag: 'Educator Support',
    },
    {
      id: 3,
      src: '/csr/3.jpeg',
      alt: 'Karnataka government school students gathered for the Belesu language orientation session',
      caption: 'Government School Student Assembly',
      tag: 'Field Outreach',
    },
    {
      id: 4,
      src: '/csr/4.jpeg',
      alt: 'Belesu team distributing free English-translated guidebooks to children seated in rows',
      caption: 'Classroom Guidebook Distribution Drive',
      tag: 'Free Book Drive',
    },
    {
      id: 5,
      src: '/csr/5.jpeg',
      alt: 'Happy primary students proudly displaying their new Savi Kannada guidebooks with Roopa Sanjiv P',
      caption: 'Building Confidence & Belonging in Young Learners',
      tag: 'Student Pride',
    },
  ];

  const csrFocusAreas = [
    {
      icon: School,
      title: 'Rural & Government School Textbook Drives',
      desc: 'Sponsoring bilingual guidebooks, vocabulary charts, and study toolkits for underprivileged government and rural schools across Karnataka taluks.',
      stats: 'Target: 50+ Rural Schools',
      highlight: 'Direct Student Kits'
    },
    {
      icon: Users,
      title: 'Migrant Children Language Inclusion',
      desc: 'Helping children of interstate migrant families integrate into Karnataka’s mainstream schooling system through beginner Kali Kannada foundation sets.',
      stats: '1,200+ Children Enrolled',
      highlight: 'Equity & Inclusion'
    },
    {
      icon: GraduationCap,
      title: 'Digital Portal & Tablet Sponsorship',
      desc: 'Equipping rural and community libraries with Belesu digital reader licenses and interactive audio-assisted learning material.',
      stats: 'Class 6 & Spoken Modules',
      highlight: 'E-Literacy'
    },
    {
      icon: ShieldCheck,
      title: 'Teacher Training & Pedagogical Workshops',
      desc: 'Funding capacity-building workshops for primary educators to effectively teach non-native speakers using modern phonetic methods.',
      stats: 'Quarterly Teacher Sessions',
      highlight: 'Educator Support'
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900">
      
      {/* ── 1. Page Header Banner & Tab Navigation ── */}
      <section className="pt-10 pb-8 text-center bg-stone-50 border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            <Link href="/" className="hover:text-amber-700 transition">Home</Link>
            <span>•</span>
            <span className="text-amber-800">
              {activeTab === 'videos' && 'Videos'}
              {activeTab === 'social-impact' && 'Social Impacts'}
              {activeTab === 'csr' && 'CSR Initiatives'}
            </span>
          </div>

          {/* Dynamic Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-amber-900 tracking-tight mb-3">
            {activeTab === 'videos' && 'Video Gallery'}
            {activeTab === 'social-impact' && 'Social Impacts'}
            {activeTab === 'csr' && 'Corporate Social Responsibility (CSR)'}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
            {activeTab === 'videos' && 'Watch classroom walkthroughs, parent-child study routines, and book demonstrations.'}
            {activeTab === 'social-impact' && 'State leadership recognitions, ELEVATE winner honors, and community impact gallery.'}
            {activeTab === 'csr' && 'Partnering with enterprises and institutions to sponsor Kannada literacy for underserved classrooms across Karnataka.'}
          </p>

          {/* 3 Interactive Tabs */}
          <div className="inline-flex flex-wrap items-center justify-center p-1.5 bg-stone-200/80 rounded-2xl gap-1.5 sm:gap-2 shadow-inner border border-stone-300 max-w-full">
            
            {/* Tab 1: Video */}
            <button
              type="button"
              onClick={() => handleTabChange('videos')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-amber-800 text-white shadow-md'
                  : 'bg-transparent text-slate-700 hover:text-amber-900 hover:bg-stone-300/60'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'videos' ? 'bg-amber-700 text-amber-100' : 'bg-stone-300 text-slate-700'
              }`}>
                6
              </span>
            </button>

            {/* Tab 2: Social Impacts */}
            <button
              type="button"
              onClick={() => handleTabChange('social-impact')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'social-impact'
                  ? 'bg-amber-800 text-white shadow-md'
                  : 'bg-transparent text-slate-700 hover:text-amber-900 hover:bg-stone-300/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Social Impacts</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'social-impact' ? 'bg-amber-700 text-amber-100' : 'bg-stone-300 text-slate-700'
              }`}>
                {socialImpactImages.length}
              </span>
            </button>

            {/* Tab 3: CSR */}
            <button
              type="button"
              onClick={() => handleTabChange('csr')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'csr'
                  ? 'bg-amber-800 text-white shadow-md'
                  : 'bg-transparent text-slate-700 hover:text-amber-900 hover:bg-stone-300/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>CSR</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'csr' ? 'bg-amber-700 text-amber-100' : 'bg-stone-300 text-slate-700'
              }`}>
                VTU-VRIF
              </span>
            </button>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: VIDEO GALLERY
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'videos' && (
        <section className="py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Video Gallery 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {extendedVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Video Player */}
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    <video
                      src={video.videoUrl}
                      controls
                      poster={video.thumbnailUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    
                    {/* Overlay Badge */}
                    {video.badgeText && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-[11px] uppercase px-2.5 py-1 rounded-md shadow-xs border border-stone-200">
                        {video.badgeText}
                      </div>
                    )}

                    {/* Belesu Watermark Overlay */}
                    <div className="absolute top-3 right-3 opacity-90 pointer-events-none">
                      <span className="text-[11px] font-black text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-md">
                        Belesu • +91 96066 36804
                      </span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6 space-y-2.5 bg-stone-50/50 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1.5">
                        <span className="uppercase tracking-wider">Duration: {video.duration}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug font-serif">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Videos Footer Help Card */}
            <div className="mt-12 p-6 sm:p-8 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif font-bold text-amber-950 text-lg sm:text-xl">
                  Looking for guidance on selecting the right guidebook?
                </h4>
                <p className="text-xs sm:text-sm text-slate-700">
                  Our academic advisors help non-Kannadiga parents match textbooks to their school syllabus (Savi, Kali, Siri, Tili).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/books"
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
                >
                  Browse 11 Books
                </Link>
                <a
                  href="https://wa.me/919606636804?text=Hello%20Belesu%20Team%2C%20I%20watched%20your%20videos%20and%20need%20help%20choosing%20the%20right%20Kannada%20guidebook%20for%20my%20child."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white border border-stone-300 hover:border-amber-400 text-slate-800 hover:text-amber-900 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-2xs"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: SOCIAL IMPACTS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'social-impact' && (
        <section className="py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {socialImpactImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedLightboxImage({ src: img.src, caption: img.caption })}
                  className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[3/4] sm:aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {img.tag && (
                      <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                        {img.tag}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                        Click to Expand Full Photo
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {img.caption}
                    </p>
                    <span className="text-[10px] font-black text-amber-700 uppercase ml-2 flex-shrink-0">
                      #{img.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: CSR INITIATIVES
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'csr' && (
        <section className="py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* ── Featured CSR Spotlight Card: A Little Book Can Open a World of Possibilities ── */}
            <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden">
              {/* Karnataka Red & Yellow Flag Accent Line */}
              <div className="h-2.5 bg-gradient-to-r from-red-600 via-amber-400 to-yellow-400 w-full" />

              <div className="p-6 sm:p-10 md:p-12 space-y-6">
                
                {/* Heading */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider">
                    <span>❤️💛</span>
                    <span>Karnataka Government Schools Initiative</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 tracking-tight leading-snug">
                    ❤️💛 A Little Book Can Open a World of Possibilities.
                  </h2>
                </div>

                {/* Narrative Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl font-normal">
                  <p className="font-semibold text-slate-900 text-base sm:text-lg">
                    Every child deserves the opportunity to learn and speak Kannada with confidence, no matter where they come from.
                  </p>

                  <p>
                    Through our Corporate Social Responsibility (CSR) initiative, we provide free English-translated Kannada guidebooks to students in Karnataka government schools. We aim to support children of families who move to Karnataka for work, including labourers and carpenters, by helping them understand Kannada and feel more connected to the language and culture of Karnataka.
                  </p>

                  <p>
                    Our Founder and Director, <strong className="text-slate-900 font-bold">Roopa Sanjiv P</strong>, brings her experience in Kannada language teaching and research to this initiative, helping us address the challenges children face while learning Kannada.
                  </p>

                  <p>
                    We believe that understanding a language builds more than knowledge. It builds confidence, connection, and a sense of belonging.
                  </p>

                  <div className="pt-2 text-base sm:text-lg font-serif font-bold text-amber-900 flex items-center gap-2">
                    <span>❤️💛</span>
                    <span>Speak Kannada. Help Kannada Flourish.</span>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200">
                  {[
                    '#Belesu',
                    '#KannadaMathadiKannadaBelesi',
                    '#KannadaLearning',
                    '#CSR',
                    '#SocialImpact'
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/90 shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CSR Field Impact Photo Gallery */}
                <div className="pt-8 border-t border-stone-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                        CSR Field Gallery (Karnataka Government Schools)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Real on-ground photos from our free guidebook distribution drives in Karnataka government schools.
                      </p>
                    </div>
                    <span className="self-start sm:self-auto text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {csrGalleryImages.length} Field Photos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                    {csrGalleryImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedLightboxImage({ src: img.src, caption: img.caption })}
                        className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col cursor-pointer"
                      >
                        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={640}
                            height={480}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {img.tag && (
                            <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                              {img.tag}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                              Click to Expand Full Photo
                            </span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">
                            {img.caption}
                          </p>
                          <span className="text-[10px] font-black text-amber-700 uppercase">#{img.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* CSR Intro Hero */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Section 135 Compliant CSR Programs</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  Empowering Regional Literacy &amp; Rural Classrooms
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Corporates operating in Karnataka can channel their Corporate Social Responsibility (CSR) funds to provide bilingual Kannada guidebooks, digital reading devices, and teacher support kits to underserved rural and government schools.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <a
                    href="https://wa.me/919606636804?text=Hello%20Belesu%20CSR%20Desk%2C%20our%20organization%20would%20like%20to%20explore%20CSR%20partnerships%20for%20Karnataka%20schools."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center px-6 py-3.5 sm:py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                  >
                    Partner With Our CSR Desk
                  </a>
                  <a
                    href="mailto:kannada@belesu.in?subject=CSR%20Partnership%20Proposal%20-%20CKelp%20Technologies"
                    className="w-full sm:w-auto text-center px-6 py-3.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition border border-slate-700"
                  >
                    Request CSR Proposal Deck
                  </a>
                </div>
              </div>

              {/* Decorative Background Glow */}
              <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* 4 CSR Impact Focus Areas */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                  Key Intervention Areas
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  Where Your CSR Sponsorship Creates Lasting Change
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {csrFocusAreas.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-7 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-stone-100 text-slate-700 border border-stone-200">
                            {item.highlight}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                        <span>{item.stats}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Partner With Us: VTU-VRIF Backing & Institutional Credibility */}
            <div className="bg-stone-50 rounded-3xl p-8 sm:p-10 border border-stone-200 space-y-8">
              <div className="max-w-2xl space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Institutional Integrity &amp; Governance
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  Backed by University Research &amp; Incubation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Belesu is developed under <strong>CKelp Technologies Private Limited</strong>, an enterprise incubated at the Visvesvaraya Technological University (VTU) Research and Innovation Foundation (VRIF).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-800">1. Audited Governance</div>
                  <h5 className="font-serif font-bold text-slate-900 text-base">Section 135 Compliance</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Formal utilization certificates, verifiable recipient lists, and full financial transparency for your company’s audit and CSR disclosures.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-800">2. VTU Campus Incubation</div>
                  <h5 className="font-serif font-bold text-slate-900 text-base">Academic Rigor &amp; Testing</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Operated out of VRIF at Visvesvaraya Technological University Belgaum, ensuring all learning frameworks adhere to pedagogical benchmarks.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-800">3. Direct Ground Impact</div>
                  <h5 className="font-serif font-bold text-slate-900 text-base">Zero Middleman Overhead</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct delivery of printed guidebooks, student practice materials, and teacher orientation directly into school classrooms.
                  </p>
                </div>
              </div>
            </div>

            {/* CSR Sponsorship Tiers */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-slate-900">
                  CSR Sponsorship Engagement Models
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Flexible participation structures designed for small, medium, and large corporate enterprises.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      Tier 1: Classroom Kit
                    </span>
                    <h4 className="text-xl font-serif font-bold text-slate-900">
                      Classroom Sponsor
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sponsor 25 to 50 primary students with full bilingual Kannada textbooks, phonetic charts, and writing workbooks.
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                      <li className="flex items-center gap-2">✓ Student textbook kits</li>
                      <li className="flex items-center gap-2">✓ Quarterly progress check</li>
                      <li className="flex items-center gap-2">✓ Co-branded donor labels</li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <a
                      href="https://wa.me/919606636804?text=Hello%20Belesu%2C%20we%20are%20interested%20in%20Tier%201%20Classroom%20Kit%20Sponsorship."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2.5 px-4 bg-stone-100 hover:bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Inquire for Tier 1
                    </a>
                  </div>
                </div>

                <div className="bg-amber-900 text-white p-7 rounded-2xl border border-amber-800 shadow-lg flex flex-col justify-between relative">
                  <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Popular
                  </div>
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded bg-amber-800 text-amber-200">
                      Tier 2: School Adoption
                    </span>
                    <h4 className="text-xl font-serif font-bold text-white">
                      Full School Program
                    </h4>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      Adopt an entire rural school’s primary section (Classes 1–5). Includes complete books, teacher kits, and digital reader licenses.
                    </p>
                    <ul className="text-xs text-amber-100 space-y-1.5 pt-2">
                      <li className="flex items-center gap-2">✓ Entire school primary wing</li>
                      <li className="flex items-center gap-2">✓ Educator workshops included</li>
                      <li className="flex items-center gap-2">✓ CSR Audit &amp; Impact Report</li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-amber-800/80">
                    <a
                      href="https://wa.me/919606636804?text=Hello%20Belesu%2C%20we%20are%20interested%20in%20Tier%202%20Full%20School%20Adoption%20Program."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                    >
                      Inquire for School Adoption
                    </a>
                  </div>
                </div>

                <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      Tier 3: District / Taluk
                    </span>
                    <h4 className="text-xl font-serif font-bold text-slate-900">
                      Regional Literacy Drive
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Comprehensive corporate-backed educational drive across multiple taluks in Karnataka for large foundations and PSUs.
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                      <li className="flex items-center gap-2">✓ Multi-school district rollout</li>
                      <li className="flex items-center gap-2">✓ Custom co-branded materials</li>
                      <li className="flex items-center gap-2">✓ Complete executive audit deck</li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <a
                      href="mailto:kannada@belesu.in?subject=Tier%203%20Regional%20Literacy%20CSR%20Partnership"
                      className="block text-center py-2.5 px-4 bg-stone-100 hover:bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Connect with CSR Desk
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct CSR Contact Box */}
            <div className="p-8 bg-stone-100 rounded-3xl border border-stone-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-800" />
                    <h4 className="font-serif font-bold text-slate-900 text-xl">
                      CKELP TECHNOLOGIES PRIVATE LIMITED
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Operations Office:</strong> VRIF, Visvesvaraya Technological University (VTU) Campus, Belgaum - 590018
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Direct Hotline:</strong> +91 96066 36804 &nbsp;|&nbsp; <strong>Email:</strong> kannada@belesu.in
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                  <a
                    href="https://wa.me/919606636804?text=Hello%20Belesu%20CSR%20Desk%2C%20our%20CSR%20committee%20would%20like%20to%20discuss%20a%20partnership%20proposal."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp CSR Desk
                  </a>
                  <a
                    href="mailto:kannada@belesu.in?subject=CSR%20Partnership%20Discussion"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-stone-300 hover:border-amber-400 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs"
                  >
                    <Mail className="w-4 h-4" />
                    Email Proposal
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── 3. Corporate Footer Card (Preserved) ── */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-base text-amber-400">
                  CKELP TECHNOLOGIES PRIVATE LIMITED
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Operations Office:</strong> VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018
              </p>
            </div>

            <div className="text-center md:text-right space-y-3">
              <Link
                href="/books"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 min-h-[44px] rounded-full font-black text-slate-900 bg-amber-400 hover:bg-amber-500 text-xs uppercase tracking-wider transition active:scale-98 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Explore Book Catalog <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Fullscreen Lightbox Modal for Photo Galleries ── */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[92vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 shrink-0">
              <h4 className="font-serif font-bold text-sm sm:text-lg text-slate-900 line-clamp-1 pr-2">
                {selectedLightboxImage.caption}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedLightboxImage(null)}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-stone-100 transition cursor-pointer shrink-0"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-[4/3] max-h-[60vh] bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                src={selectedLightboxImage.src}
                alt={selectedLightboxImage.caption}
                width={800}
                height={600}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
