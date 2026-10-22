'use client';

import React, { useState } from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { AcademicSupportSection } from '@/components/home/AcademicSupportSection';
import { LearningNeedsSection } from '@/components/home/LearningNeedsSection';
import { CommunityCommitmentSection } from '@/components/home/CommunityCommitmentSection';
import { CurriculumExplorer } from '@/components/home/CurriculumExplorer';
import { QuickLookBookSection } from '@/components/home/QuickLookBookSection';
import { AcademicFeaturesSection } from '@/components/home/AcademicFeaturesSection';
import { DigitalGuidebooksSection } from '@/components/home/DigitalGuidebooksSection';
import { ElevatingKannadaSection } from '@/components/home/ElevatingKannadaSection';
import { WhyChooseBelesu } from '@/components/home/WhyChooseBelesu';
import { ParentFeedbackSection } from '@/components/home/ParentFeedbackSection';
import { VideoReelsSection } from '@/components/home/VideoReelsSection';
import { HomeBottomCtaSection } from '@/components/home/HomeBottomCtaSection';
import { BookPreviewModal } from '@/components/ui/BookPreviewModal';
import { BookProduct } from '@/types';

export default function HomePage() {
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);

  return (
    <div>
      {/* 1. Dynamic 7-Banner Light Hero Carousel (H1) */}
      <HeroCarousel onPreview={(book) => setPreviewBook(book)} />

      {/* 2. Making Kannada Learning Easier for Students and Parents (H2) */}
      <AcademicSupportSection />

      {/* 3. Designed for Different Kannada Learning Needs (H2) */}
      <LearningNeedsSection />

      {/* 4. Belesu's Commitment to Kannada and Its Community (H2) */}
      <CommunityCommitmentSection />

      {/* 5. State Syllabus Guidebooks (H2) */}
      <CurriculumExplorer onPreview={(book) => setPreviewBook(book)} />

      {/* 6. A Quick Look at the Book (H2) */}
      <QuickLookBookSection onPreview={(book) => setPreviewBook(book)} />

      {/* 7. How Belesu Guidebooks Support Kannada Academic Learning (H2) */}
      <AcademicFeaturesSection />

      {/* 8. Explore Belesu Digital Kannada Guidebooks (H2) */}
      <DigitalGuidebooksSection />

      {/* 9. Elevating Kannada Across Karnataka (H2) */}
      <ElevatingKannadaSection />

      {/* 10. Why Belesu? (H2) */}
      <WhyChooseBelesu />

      {/* 10. Parent Feedback / Testimonials */}
      <ParentFeedbackSection />

      {/* 11. Video Demonstration Reels */}
      <VideoReelsSection />

      {/* 13. Bottom CTA Banner: Make Kannada Academic Learning Easier at Home and School */}
      <HomeBottomCtaSection />

      {/* 12. Interactive Book Preview Modal */}
      {previewBook && <BookPreviewModal book={previewBook} onClose={() => setPreviewBook(null)} />}
    </div>
  );
}
