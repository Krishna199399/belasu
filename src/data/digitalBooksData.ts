import { DigitalBook } from '@/types';

/**
 * Digital catalog activation flag.
 * Set to false now that Class 6 PDF is ready to be loaded.
 */
export const HIDE_DIGITAL_CLASS_6 = false;

export const CLASS_6_DIGITAL_BOOK: DigitalBook = {
  id: 'dbook-6-kn-01',
  slug: 'kannada-class-6-guide',
  title: 'Kannada Class 6 — Complete English-Translated Digital Guidebook',
  subject: 'Kannada',
  gradeClass: 6,
  sku: 'SD6-KN',
  price: 295,
  originalPrice: 349,
  badge: 'Bestseller',
  coverImage: '/digital/class-6-siri/cover.jpeg',
  totalPages: 166,
  isFreePreviewPages: 5,
  isPriceConfirmed: true,
  isComingSoon: false,
  rating: 4.8,
  reviewCount: 142,
  author: 'Belesu Academic Team',
  language: 'Kannada with English Translations',
  description:
    'Understand Class 6 Kannada lessons through English translations, solved textbook exercises and chapter summaries. Access your guidebook online through Belesu\'s digital reader.',
  features: [
    'Line-by-line English translations',
    'Kannada prose, poems and grammar',
    'Solved textbook exercises and model answers',
    'Chapter summaries in Kannada and English',
  ],
  tableOfContents: [
    { chapter: 'Curriculum Index & Syllabus Overview', startPage: 1 },
    { chapter: 'ಪಾಠ ೧: ಬೆಳಗು ಜಾತ್ರೆ (Prose Translation & Meanings)', startPage: 6 },
    { chapter: 'ಪಾಠ ೨: ಧನ್ಯವಾದಗಳು (Lesson Notes & English Translation)', startPage: 24 },
    { chapter: 'ಪಾಠ ೩: ಸಿದ್ದಗಂಗೆಯ ಶ್ರೀಗಳು (Biography & Analysis)', startPage: 42 },
    { chapter: 'ಪದ್ಯ ೪: ಕೃಷ್ಣನ ಪದ್ಯಗಳು (Poetry Breakdown)', startPage: 60 },
    { chapter: 'ಪಾಠ ೫: ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು (History & Glossary)', startPage: 78 },
    { chapter: 'ಪಾಠ ೬: ಪರಿಸರ ಸಂರಕ್ಷಣೆ (Ecology & Vocabulary)', startPage: 96 },
    { chapter: 'ವ್ಯಾಕರಣ: ಸಂಧಿ, ಸಮಾಸ ಮತ್ತು ವ್ಯಾಕರಣಾಂಶಗಳು (Grammar Rules)', startPage: 120 },
    { chapter: 'ಪಠ್ಯಪುಸ್ತಕ ಮಾದರಿ ಪ್ರಶ್ನೋತ್ತರಗಳು (Complete Model Answers)', startPage: 148 },
  ],
};

export const SAVI_4_DIGITAL_BOOK: DigitalBook = {
  id: 'dbook-4-savi-01',
  slug: 'savi-kannada-class-4-digital',
  title: 'Savi Kannada Class 4 — Digital Guidebook (Web Reader Edition)',
  subject: 'Kannada',
  gradeClass: 4,
  sku: 'SD4-SAVI',
  price: 199,
  originalPrice: 280,
  badge: 'Print & Digital',
  coverImage: '/covers/savi-4.png',
  totalPages: 117,
  isFreePreviewPages: 5,
  isPriceConfirmed: false, // Visible with placeholder; buy button staged pending client confirmation
  isComingSoon: true,
  rating: 4.9,
  reviewCount: 156,
  author: 'Belesu Academic Team',
  language: 'Kannada with English Translations',
  description:
    'Savi Kannada Class 4 digital edition with line-by-line English translations, syllable pronunciation guides, and solved textbook exercises. Read instantly on Belesu Web Reader.',
  features: [
    'Line-by-line English translations for all lessons',
    'Poem breakdowns with word-by-word meanings',
    'Full solved textbook exercise question bank',
    'Instant access on Mobile, Tablet, and Desktop',
    'Read anytime in Belesu Web Reader',
  ],
  tableOfContents: [
    { chapter: 'Curriculum Index & Lesson Plan', startPage: 1 },
    { chapter: 'ಪಾಠ ೧: ಕನ್ನಡ ನಾಡು ನುಡಿ (Kannada Land & Language)', startPage: 6 },
    { chapter: 'ಪಾಠ ೨: ನಾಯಿ ಮತ್ತು ತೋಳ (The Dog and The Wolf)', startPage: 22 },
    { chapter: 'ಪಾಠ ೩: ವೀರ ಮಹಿಳೆ ಕಿತ್ತೂರು ಚೆನ್ನಮ್ಮ (Queen Chennamma)', startPage: 40 },
    { chapter: 'ಪದ್ಯ ೪: ಗಿಡ ಮರಗಳ ಗೆಳೆತನ (Trees Friendship - Poem)', startPage: 58 },
    { chapter: 'ಪಾಠ ೫: ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ (Glory of Kannada)', startPage: 74 },
    { chapter: 'ಪಾಠ ೬: ಬುದ್ಧನ ಕರುಣೆ (Compassion of Buddha)', startPage: 92 },
    { chapter: 'ಪದ್ಯ ೭: ಮಕ್ಕಳ ಕನಸು (Children Dreams - Poem)', startPage: 110 },
    { chapter: 'ವ್ಯಾಕರಣ ಮತ್ತು ಭಾಷಾಭ್ಯಾಸ (Grammar & Language Practice)', startPage: 130 },
    { chapter: 'ಮಾದರಿ ಪ್ರಶ್ನೋತ್ತರಗಳು (Solved Exercise Solutions)', startPage: 154 },
  ],
};

export const SAVI_3_DIGITAL_BOOK: DigitalBook = {
  id: 'dbook-3-savi-01',
  slug: 'savi-kannada-class-3-digital',
  title: 'Savi Kannada Class 3 — Digital Guidebook (Web Reader Edition)',
  subject: 'Kannada',
  gradeClass: 3,
  sku: 'SD3-SAVI',
  price: 199,
  originalPrice: 280,
  badge: 'Print & Digital',
  coverImage: '/covers/savi-3.png',
  totalPages: 160,
  isFreePreviewPages: 5,
  isPriceConfirmed: false, // Visible with placeholder; buy button staged pending client confirmation
  isComingSoon: true,
  rating: 4.9,
  reviewCount: 138,
  author: 'Belesu Academic Team',
  language: 'Kannada with English Translations',
  description:
    'Savi Kannada Class 3 digital edition with parallel English translations, poem explanations, and solved textbook questions. Available for instant online reading.',
  features: [
    'Complete syllabus and unit translations in English',
    'Poetry translation with English notes',
    'Solved exercise questions and answers',
    'Instant access across all devices',
    'Read anytime in Belesu Web Reader',
  ],
  tableOfContents: [
    { chapter: 'Curriculum Index & Table of Contents', startPage: 1 },
    { chapter: 'ಪಾಠ ೧: ನಾವೆಲ್ಲರೂ ಒಂದೇ (We Are All One)', startPage: 6 },
    { chapter: 'ಪಾಠ ೨: ಕಾಡಿನ ಹಬ್ಬ (The Forest Festival)', startPage: 20 },
    { chapter: 'ಪದ್ಯ ೩: ಅಮ್ಮ (Mother - Poem Translation & Notes)', startPage: 38 },
    { chapter: 'ಪಾಠ ೪: ಬುದ್ಧಿವಂತ ಕಾಗೆ (The Clever Crow)', startPage: 54 },
    { chapter: 'ಪಾಠ ೫: ಹಬ್ಬ ಹರಿದಿನಗಳು (Festivals of Karnataka)', startPage: 72 },
    { chapter: 'ಪಾಠ ೬: ಸತ್ಯವಂತ ಬಾಲಕ (The Honest Boy)', startPage: 90 },
    { chapter: 'ಗುಣಿಂತಗಳು ಮತ್ತು ವ್ಯಾಕರಣ (Gunintagalu & Simple Grammar)', startPage: 108 },
    { chapter: 'ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಉತ್ತರಗಳು (Exercise Solutions)', startPage: 132 },
  ],
};

export const DIGITAL_BOOKS_DATA: DigitalBook[] = [
  CLASS_6_DIGITAL_BOOK,
  SAVI_4_DIGITAL_BOOK,
  SAVI_3_DIGITAL_BOOK,
];

// Preserved for upcoming launch as new books are completed
export const UPCOMING_DIGITAL_BOOKS_DATA: DigitalBook[] = [
  // ── CLASS 7 ──────────────────────────────────────────────────────────────
  {
    id: 'dbook-7-kn-01',
    slug: 'kannada-class-7-guide',
    title: 'Kannada Class 7 — Complete English-Translated Digital Guidebook',
    subject: 'Kannada',
    gradeClass: 7,
    sku: 'SD7-KN',
    price: 199,
    originalPrice: 349,
    badge: 'Popular',
    coverImage: '/digital-covers/kn-7.webp',
    totalPages: 192,
    isFreePreviewPages: 5,
    rating: 4.9,
    reviewCount: 203,
    author: 'Belesu Academic Team',
    language: 'Kannada with English Translations',
    description:
      'Class 7 Kannada decoded completely — every lesson broken down in simple English. Perfect for non-Kannadiga parents and students who want to score 100% in Kannada.',
    features: [
      'Every prose and poem translated line by line',
      'Grammar chapters with examples and exercises',
      'All solved textbook answers included',
      'Writing section tips and model answers',
      'Works on mobile, tablet and desktop',
    ],
    tableOfContents: [
      { chapter: 'Lesson 1: Chandamama Bandaaga (When the Moon Arrives)', startPage: 1 },
      { chapter: 'Lesson 2: Veeravara Sannajeeva (Brave Sannajeeva)', startPage: 16 },
      { chapter: 'Lesson 3: Saviradaru Baavigalu (A Thousand Wishes)', startPage: 31 },
      { chapter: 'Lesson 4: Jeevanadalli Saahasa (Courage in Life)', startPage: 46 },
      { chapter: 'Grammar: Naamapada, Kriyapada, Visheshana', startPage: 62 },
      { chapter: 'Lesson 5: Mana Mathu Mane', startPage: 80 },
      { chapter: 'Lesson 6: Kaadu Kaanana (Forest)', startPage: 96 },
      { chapter: 'Grammar: Avyaya, Sandhi Types', startPage: 112 },
      { chapter: 'Lesson 7: Vikramaaditya Kathegalu', startPage: 128 },
      { chapter: 'Model Papers', startPage: 175 },
    ],
  },

  // ── CLASS 8 ──────────────────────────────────────────────────────────────
  {
    id: 'dbook-8-kn-01',
    slug: 'kannada-class-8-guide',
    title: 'Kannada Class 8 — Complete English-Translated Digital Guidebook',
    subject: 'Kannada',
    gradeClass: 8,
    sku: 'SD8-KN',
    price: 219,
    originalPrice: 399,
    badge: 'Top Rated',
    coverImage: '/digital-covers/kn-8.webp',
    totalPages: 205,
    isFreePreviewPages: 5,
    rating: 4.9,
    reviewCount: 178,
    author: 'Belesu Academic Team',
    language: 'Kannada with English Translations',
    description:
      'Class 8 Kannada fully explained in English — ideal for students preparing for SA1 and SA2 exams.',
    features: [
      'Complete translation of all lessons',
      'In-depth grammar with solved examples',
      'Essay and letter writing model answers',
      'Oral Kannada pronunciation guide',
      'Karnataka Board 2024–25 aligned',
    ],
    tableOfContents: [
      { chapter: 'Lesson 1: Bhoomi Hadu (Song of the Earth)', startPage: 1 },
      { chapter: 'Lesson 2: Basavanna Vachana', startPage: 18 },
      { chapter: 'Grammar: Shabdalankara & Arthalankara', startPage: 33 },
      { chapter: 'Lesson 3: Karnataka Rajyotsava', startPage: 50 },
      { chapter: 'Lesson 4: Tipu Sultan Sahasa', startPage: 67 },
      { chapter: 'Grammar: Samasa, Nudi, Kriya', startPage: 84 },
      { chapter: 'Lesson 5: Shikshana Padhdhati', startPage: 100 },
      { chapter: 'Model Papers & Practice Sets', startPage: 185 },
    ],
  },

  // ── CLASS 9 ──────────────────────────────────────────────────────────────
  {
    id: 'dbook-9-kn-01',
    slug: 'kannada-class-9-guide',
    title: 'Kannada Class 9 — Complete English-Translated Digital Guidebook',
    subject: 'Kannada',
    gradeClass: 9,
    sku: 'SD9-KN',
    price: 249,
    originalPrice: 449,
    badge: 'Hot',
    coverImage: '/digital-covers/kn-9.webp',
    totalPages: 220,
    isFreePreviewPages: 5,
    rating: 4.8,
    reviewCount: 231,
    author: 'Belesu Academic Team',
    language: 'Kannada with English Translations',
    description:
      'Crack Class 9 Kannada with this comprehensive digital guide. Every question, poem, and grammar rule decoded in clear English.',
    features: [
      'All lessons translated and explained',
      'Grammar: Alankaras, Vachanagalu, Vibhakti',
      'Essay, letter and note writing templates',
      'SA1 + SA2 model papers',
      'Vachanas and Poems explained in detail',
    ],
    tableOfContents: [
      { chapter: 'Lesson 1: Kanaada Taayi (Mother Kanada)', startPage: 1 },
      { chapter: 'Lesson 2: Gandhijiyavara Geleya (Gandhi\'s Friend)', startPage: 18 },
      { chapter: 'Lesson 3: Maryade Prashna (Question of Dignity)', startPage: 36 },
      { chapter: 'Grammar: Alankaras', startPage: 54 },
      { chapter: 'Lesson 4: Ondu Hoo Kondu (One Flower Taken)', startPage: 72 },
      { chapter: 'Lesson 5: Thande Mane (Cool Home)', startPage: 90 },
      { chapter: 'Grammar: Sandhi, Samasa, Kruya', startPage: 108 },
      { chapter: 'Model Papers SA1', startPage: 160 },
      { chapter: 'Model Papers SA2', startPage: 190 },
    ],
  },

  // ── CLASS 10 ─────────────────────────────────────────────────────────────
  {
    id: 'dbook-10-kn-01',
    slug: 'kannada-class-10-guide',
    title: 'Kannada Class 10 — Complete English-Translated Digital Guidebook',
    subject: 'Kannada',
    gradeClass: 10,
    sku: 'SD10-KN',
    price: 279,
    originalPrice: 499,
    badge: 'SSLC Exam Ready',
    coverImage: '/digital-covers/kn-10.webp',
    totalPages: 240,
    isFreePreviewPages: 5,
    rating: 4.9,
    reviewCount: 389,
    author: 'Belesu Academic Team',
    language: 'Kannada with English Translations',
    description:
      'The ultimate SSLC Kannada companion. Every lesson, poem, grammar topic and essay explained in English. Includes full SSLC model papers with answers.',
    features: [
      'Complete SSLC Kannada syllabus covered',
      'Previous year SSLC questions solved',
      '5 full model papers with answers',
      'Grammar: All Alankara, Sandhi, Samasa types',
      'Letter, Essay and Speech writing models',
    ],
    tableOfContents: [
      { chapter: 'Lesson 1: Baagilanu Teredu (Open the Door)', startPage: 1 },
      { chapter: 'Lesson 2: Kabbigana Kaipidi (Poet\'s Grip)', startPage: 18 },
      { chapter: 'Lesson 3: Mane (Home)', startPage: 36 },
      { chapter: 'Lesson 4: Chilipili Haada (Bird\'s Song)', startPage: 54 },
      { chapter: 'Grammar: Alankaras (All Types)', startPage: 72 },
      { chapter: 'Lesson 5: Karnataka Saahitya (Karnataka Literature)', startPage: 90 },
      { chapter: 'Grammar: Sandhi, Samasa', startPage: 108 },
      { chapter: 'Lesson 6: Swachha Bharata', startPage: 126 },
      { chapter: 'Vachanas and Keertanes', startPage: 144 },
      { chapter: 'Writing: Essays, Letters, Speeches', startPage: 162 },
      { chapter: 'SSLC Model Paper 1', startPage: 180 },
      { chapter: 'SSLC Model Paper 2', startPage: 195 },
      { chapter: 'SSLC Model Paper 3', startPage: 210 },
      { chapter: 'SSLC Model Paper 4', startPage: 220 },
      { chapter: 'SSLC Model Paper 5', startPage: 230 },
    ],
  },
];

export function getDigitalBookBySlug(slug: string): DigitalBook | undefined {
  return (
    DIGITAL_BOOKS_DATA.find((b) => b.slug === slug || b.id === slug || `${b.slug}-digital` === slug || b.slug.replace(/-digital$/, '') === slug) ||
    UPCOMING_DIGITAL_BOOKS_DATA.find((b) => b.slug === slug || b.id === slug)
  );
}

export function getDigitalBooksByGrade(grade: number): DigitalBook[] {
  return DIGITAL_BOOKS_DATA.filter((b) => b.gradeClass === grade);
}

export function getDigitalBooksBySubject(subject: string): DigitalBook[] {
  return DIGITAL_BOOKS_DATA.filter((b) => b.subject === subject);
}

export const DIGITAL_GRADES = [3, 4, 6] as const;
export const DIGITAL_SUBJECTS = ['Kannada'] as const;
export const digitalBooks = DIGITAL_BOOKS_DATA;
