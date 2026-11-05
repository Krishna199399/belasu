'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  Building2,
  BookOpen,
  ChevronRight,
  Phone,
  Mail,
  X,
  Camera,
  HeartHandshake,
} from 'lucide-react';

export default function VideosMediaPage() {
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  // Smooth scroll to section if URL contains hash (#videos, #gallery, #csr)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const targetId = hash === 'social-impact' || hash === 'social-impacts' ? 'gallery' : hash;
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  }, []);

  const extendedVideos = [
    {
      id: 'v1',
      title: 'How Belesu Helps Non-Kannada-Speaking Parents',
      description: 'Discover how English-translated Kannada learning resources can help parents follow school lessons and support academic learning at home.',
      videoUrl: '/videos/video%201.mp4',
      badgeText: 'PARENT SUPPORT',
      duration: '0:48'
    },
    {
      id: 'v2',
      title: 'Explore a Sample Kannada Lesson',
      description: 'See how translated content and lesson guidance appear in a guidebook, helping you understand the learning format before choosing a book.',
      videoUrl: '/videos/video%202.mp4',
      badgeText: 'LESSON PREVIEW',
      duration: '0:41'
    },
    {
      id: 'v3',
      title: 'Hear From Parents and Families',
      description: 'Explore authentic parent experiences and feedback to learn how Belesu resources are used to support Kannada learning at home.',
      videoUrl: '/videos/video%203.mp4',
      badgeText: 'FAMILY STORIES',
      duration: '0:39'
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
      src: '/social impacts/elevate-winner.jpg',
      alt: 'Receiving ELEVATE Winner Award from Shri Priyank Kharge, Minister for IT & BT, Govt of Karnataka',
      caption: 'ELEVATE Winner Award Presentation with IT & BT Minister Shri Priyank Kharge',
      tag: 'ELEVATE Winner',
    },
    {
      id: 3,
      src: '/social impacts/4.jpeg',
      alt: 'Best Kannada Language Initiative Startup Bangalore Award',
      caption: 'Best Kannada Language Initiative Startup Award',
      tag: 'Excellence Award',
    },
    {
      id: 4,
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

  return (
    <div className="bg-white min-h-screen text-slate-900 scroll-smooth">
      
      {/* ── 1. Page Header Banner (Clean, No Tab Buttons) ── */}
      <section className="pt-12 pb-10 text-center bg-stone-50 border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            <Link href="/" className="hover:text-amber-700 transition">Home</Link>
            <span>•</span>
            <span className="text-amber-800">Media, Gallery &amp; CSR</span>
          </div>

          {/* Unified Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-amber-900 tracking-tight mb-3">
            Video Gallery, Photos &amp; CSR Initiatives
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Explore our video demonstrations, state leadership recognitions, and university-incubated educational outreach across Karnataka on a single page.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: VIDEO GALLERY
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="videos" className="py-12 sm:py-16 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider border border-amber-300">
              <Video className="w-3.5 h-3.5" />
              <span>Section 1 • Video Demonstrations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 tracking-tight">
              Video Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Watch classroom walkthroughs, parent-child study routines, and guidebook demonstrations.
            </p>
          </div>

          {/* Video Gallery: Responsive 9:16 Vertical Reel Grid (Mobile 1-col, Desktop 3-col) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {extendedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-3xl border border-amber-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group max-w-sm sm:max-w-md md:max-w-none mx-auto w-full"
              >
                {/* Video Player — 9:16 Vertical Reel Aspect Ratio */}
                <div className="relative aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src={video.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain bg-black"
                  />
                  
                  {/* Overlay Badge */}
                  {video.badgeText && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-[11px] uppercase px-2.5 py-1 rounded-md shadow-xs border border-stone-200 pointer-events-none">
                      {video.badgeText}
                    </div>
                  )}

                  {/* Belesu Watermark Overlay */}
                  <div className="absolute top-3 right-3 opacity-90 pointer-events-none">
                    <span className="text-[10px] font-black text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded-md">
                      Belesu • +91 96066 36804
                    </span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 sm:p-5 space-y-2 bg-stone-50/70 flex-1 flex flex-col justify-between border-t border-stone-100">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
                      <span className="uppercase tracking-wider">Duration: {video.duration}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        9:16 HD Reel
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-serif">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: PHOTO GALLERY
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="gallery" className="py-12 sm:py-16 bg-stone-50/70 border-t border-stone-200 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider border border-amber-300">
              <Camera className="w-3.5 h-3.5" />
              <span>Section 2 • Community Recognition &amp; Honors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 tracking-tight">
              Photo Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              State leadership recognitions, ELEVATE winner honors, and community impact highlights.
            </p>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialImpactImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedLightboxImage({ src: img.src, caption: img.caption })}
                className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={600}
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

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: CSR ACTIVITIES (VTU-VRIP)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="csr" className="py-12 sm:py-16 border-t border-stone-200 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black uppercase tracking-wider border border-emerald-300">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
              <span>Section 3 • University-Incubated Outreach</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 tracking-tight">
              CSR Activities (VTU-VRIF)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Partnering with enterprises and institutions to sponsor Kannada literacy for underserved classrooms across Karnataka.
            </p>
          </div>

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

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 tracking-tight leading-snug">
                  ❤️💛 A Little Book Can Open a World of Possibilities.
                </h3>
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
                    <h4 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                      CSR Field Gallery (Karnataka Government Schools)
                    </h4>
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
                  <strong>Registered Office:</strong> Deshpande Startups, Gokul Road, Next to Hubballi International Airport, Hubballi - 580027
                </p>
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

      {/* ── 4. Corporate Footer Card (Preserved) ── */}
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
                <strong>Registered Office:</strong> Deshpande Startups, Gokul Road, Next to Hubballi International Airport, Hubballi - 580027
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Bangalore Office:</strong> #152, Sarjapur - Bagalur Road, Sarjapur, Bangalore - 562125
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Operations Office:</strong> VRIF, Visvesvaraya Technological University (VTU) campus, Belgaum - 590018
              </p>
            </div>

            <div className="text-center md:text-right space-y-3">
              <Link
                href="/books/"
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
