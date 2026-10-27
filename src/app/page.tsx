'use client';

import React, { useState } from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CurriculumExplorer } from '@/components/home/CurriculumExplorer';
import { AcademicFeaturesSection } from '@/components/home/AcademicFeaturesSection';
import { DigitalGuidebooksSection } from '@/components/home/DigitalGuidebooksSection';
import { QuickLookBookSection } from '@/components/home/QuickLookBookSection';
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
      {/* 1. H1: Kannada to English Translated Academic Guidebooks for School Children */}
      <HeroCarousel onPreview={(book) => setPreviewBook(book)} />

      {/* 2. H2: Find the Right Kannada Guidebook */}
      <CurriculumExplorer onPreview={(book) => setPreviewBook(book)} />

      {/* 3. H2: Support for Learning Kannada */}
      <AcademicFeaturesSection />

      {/* 4. H2: Explore Digital Kannada Guidebooks */}
      <DigitalGuidebooksSection />

      {/* 5. H2: A Quick Look Inside Our Books */}
      <QuickLookBookSection />

      {/* 6. H2: Why Belesu? */}
      <WhyChooseBelesu />

      {/* 7. H2: What Parents Say About Belesu */}
      <ParentFeedbackSection />

      {/* 8. H2: Explore Belesu Videos */}
      <VideoReelsSection />

      {/* 9. H2: Find the Right Book for Your Child */}
      <HomeBottomCtaSection />

      {/* Interactive Book Preview Modal */}
      {previewBook && <BookPreviewModal book={previewBook} onClose={() => setPreviewBook(null)} />}
    </div>
  );
}
