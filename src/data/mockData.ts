import { BookProduct, ParentReview, TeamMember, VideoReel } from '@/types';

export const BOOKS_DATA: BookProduct[] = [
  {
    id: '15926',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 1',
    slug: 'savi-kannada-class-1',
    series: 'Savi',
    gradeClass: 1,
    sku: 'SK1',
    price: 250,
    originalPrice: 299,
    badge: 'Bestseller',
    description: 'First Grade English-translated Savi Kannada guide designed specifically to build strong foundational Kannada vocabulary, alphabet pronunciation, and simple sentence formation for Class 1 students.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Lesson 1: Alphabets & Vowels (ಅ - ಅಃ)',
      'Lesson 2: Consonants & Pronunciation (ಕ - ಳ)',
      'Lesson 3: Simple Words & Daily Greetings',
      'Lesson 4: Solved Textbook Exercises & Worksheets'
    ],
    coverImage: '/covers/savi-1.png',
    karnatakaTextbookCover: '/government-covers/savi-1.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/savi-1-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Curriculum & Lesson Index',
        imageUrl: '/previews/Savi Kannada class 1/Index.jpeg',
        category: 'Index',
        kannadaText: 'ವಿಷಯ ಸೂಚಿ - ಪಠ್ಯಕ್ರಮ ವಿವರ (Table of Contents)',
        englishTranslation: 'Complete lesson list matching Karnataka School Textbook Class 1.'
      },
      {
        pageNumber: 2,
        title: 'Sample Lesson with English Translation',
        imageUrl: '/previews/Savi Kannada class 1/Lesson.jpeg',
        category: 'Poem',
        kannadaText: 'ಪಾಠ ವಿವರಣೆ ಮತ್ತು ಅರ್ಥ (Lesson Breakdown)',
        englishTranslation: 'Line-by-line English transliteration and word meanings for easy home learning.'
      },
      {
        pageNumber: 3,
        title: 'Solved Exercises & Worksheets',
        imageUrl: '/previews/Savi Kannada class 1/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಅಭ್ಯಾಸ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಉತ್ತರಗಳು (Exercise Answers)',
        englishTranslation: 'Step-by-step solved textbook questions and activity solutions.'
      }
    ],
    inStock: true,
    stockQuantity: 45,
    rating: 4.9,
    reviewCount: 28
  },
  {
    id: '15849',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 2',
    slug: 'savi-kannada-class-2',
    series: 'Savi',
    gradeClass: 2,
    sku: 'SK2',
    price: 260,
    originalPrice: 310,
    badge: 'Popular',
    description: 'Comprehensive Class 2 Savi Kannada guidebook breaking down complex stories, poems, and grammar into easily digestible English translations for non-Kannadiga parents and young learners.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Chapter 1: Nanna Deha (My Body & Health)',
      'Chapter 2: Kaadu Pranigalu (Wild Animals)',
      'Chapter 3: Gunintagalu Master Guide',
      'Chapter 4: Class 2 Exercise Answer Key'
    ],
    coverImage: '/covers/savi-2.png',
    karnatakaTextbookCover: '/government-covers/savi-2.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/savi-2-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Curriculum & Chapter Index',
        imageUrl: '/previews/Savi Kannada class 2/index.jpeg',
        category: 'Index',
        kannadaText: 'ವಿಷಯ ಸೂಚಿ (Table of Contents)',
        englishTranslation: 'Full Karnataka School Textbook Class 2 Savi Kannada syllabus overview.'
      },
      {
        pageNumber: 2,
        title: 'Poem Breakdown & Word Meanings',
        imageUrl: '/previews/Savi Kannada class 2/poem.jpeg',
        category: 'Poem',
        kannadaText: 'ಪದ್ಯ ಅನುವಾದ ಮತ್ತು ಪದಗಳ ಅರ್ಥ (Poem Translation & Meanings)',
        englishTranslation: 'Stanza-by-stanza English translation and bilingual glossary.'
      },
      {
        pageNumber: 3,
        title: 'Solved Textbook Exercises',
        imageUrl: '/previews/Savi Kannada class 2/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಪ್ರಶ್ನೋತ್ತರಗಳು ಮತ್ತು ಅಭ್ಯಾಸ (Exercise Solutions)',
        englishTranslation: 'Complete answers for all textbook question-answer exercises.'
      }
    ],
    inStock: true,
    stockQuantity: 60,
    rating: 4.85,
    reviewCount: 34
  },
  {
    id: '16142',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 3',
    slug: 'savi-kannada-class-3',
    series: 'Savi',
    gradeClass: 3,
    sku: 'SK3',
    price: 280,
    originalPrice: 330,
    badge: 'Must Have',
    description: 'Class 3 Savi Kannada study aid engineered to eliminate language anxiety. Includes exact chapter-wise English translations, vocabulary keys, and step-by-step solved question banks.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Lesson 1: Kannada Naadu (Karnataka Land & Culture)',
      'Lesson 2: Parisara Kurihtu (Environment & Nature)',
      'Lesson 3: Grammar - Naamapada (Nouns) & Kriyapada (Verbs)',
      'Lesson 4: Model Examination Papers'
    ],
    coverImage: '/covers/savi-3.png',
    karnatakaTextbookCover: '/government-covers/savi-3.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/savi-3-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Annual Syllabus & Chapter Index',
        imageUrl: '/previews/Savi Kannada class 3/Index.jpeg',
        category: 'Index',
        kannadaText: 'ಪಠ್ಯಕ್ರಮ ಸೂಚಿ (Curriculum Index)',
        englishTranslation: 'Complete unit breakdown aligned to the Karnataka School Textbook Class 3 syllabus.'
      },
      {
        pageNumber: 2,
        title: 'Poetry Translation & English Notes',
        imageUrl: '/previews/Savi Kannada class 3/Poem.jpeg',
        category: 'Poem',
        kannadaText: 'ಪದ್ಯ ಭಾಗ - ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ (Poem & Translation)',
        englishTranslation: 'Parallel English notes helping non-Kannadiga parents teach poetry.'
      },
      {
        pageNumber: 3,
        title: 'Solved Exercise Questions',
        imageUrl: '/previews/Savi Kannada class 3/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು (Solved Exercises)',
        englishTranslation: 'Thorough solved question bank for homework and exam prep.'
      }
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.92,
    reviewCount: 41
  },
  {
    id: '16351',
    title: 'Savi Kannada English Translated Innovative Guidebook Class 4',
    slug: 'savi-kannada-class-4',
    series: 'Savi',
    gradeClass: 4,
    sku: 'SK4',
    price: 280,
    originalPrice: 340,
    badge: 'Top Seller',
    description: 'Empowering Class 4 students to excel in written and oral Kannada exams. Features in-depth paragraph translations, detailed question-answer keys, and contextual grammar rules.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Unit 1: Veerabaale Kitturu Chennamma',
      'Unit 2: Hasiru (Greenery & Nature Poem)',
      'Unit 3: Sandhigalu & Vibhakti Pratyayagalu',
      'Unit 4: Question & Answer Bank'
    ],
    coverImage: '/covers/savi-4.png',
    karnatakaTextbookCover: '/government-covers/savi-4.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/savi-4-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Complete Syllabus & Unit Index',
        imageUrl: '/previews/Savi Kannada class 4/Index.jpeg',
        category: 'Index',
        kannadaText: 'ವಿಷಯಾನುಕ್ರಮಣಿಕೆ (Comprehensive Index)',
        englishTranslation: 'Class 4 Karnataka School Textbook chapters, prose, poetry, and grammar mapping.'
      },
      {
        pageNumber: 2,
        title: 'Poem Translation & Word Breakdown',
        imageUrl: '/previews/Savi Kannada class 4/Poem.jpeg',
        category: 'Poem',
        kannadaText: 'ಪದ್ಯ ಭಾಗ ಮತ್ತು ಸರಳ ಇಂಗ್ಲಿಷ್ ಅನುವಾದ (Poetry & Translation)',
        englishTranslation: 'Detailed line-by-line translation and vocabulary key.'
      },
      {
        pageNumber: 3,
        title: 'Solved Question Banks & Grammar',
        imageUrl: '/previews/Savi Kannada class 4/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಅಭ್ಯಾಸ ಪತ್ರಿಕೆ ಮತ್ತು ಉತ್ತರಗಳು (Exercise Key)',
        englishTranslation: 'Step-by-step answers for all textbook exercise questions.'
      }
    ],
    inStock: true,
    stockQuantity: 38,
    rating: 4.95,
    reviewCount: 52
  },
  {
    id: '19570',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 1',
    slug: 'kali-kannada-english-translated-innovative-guidebook-class-1',
    series: 'Kali',
    gradeClass: 1,
    sku: 'KK1',
    price: 280,
    originalPrice: 330,
    badge: 'New Edition',
    description: 'Designed specifically for beginner learners under the Kali Kannada curriculum. Bridges phonetics, basic script practice, and simple everyday conversations.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Module 1: Aksharamale Basics',
      'Module 2: Simple 2-Letter Words',
      'Module 3: Colours & Numbers in Kannada',
      'Module 4: Exercise Workbook'
    ],
    coverImage: '/covers/kali-1.png',
    karnatakaTextbookCover: '/government-covers/kali-1.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Alphabet & Module Index',
        imageUrl: '/previews/Kali Kannada class 1/Index.jpeg',
        category: 'Index',
        kannadaText: 'ಅಕ್ಷರಮಾಲೆ ಮತ್ತು ಪಾಠ ಸೂಚಿ (Alphabet & Module Index)',
        englishTranslation: 'Foundational learning roadmap for beginner Kannada students.'
      },
      {
        pageNumber: 2,
        title: 'Script Practice & Solved Exercises',
        imageUrl: '/previews/Kali Kannada class 1/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಅಭ್ಯಾಸ ಮತ್ತು ಬರವಣಿಗೆ (Writing Practice & Exercises)',
        englishTranslation: 'Phonetic alphabet drills and guided letter tracing.'
      },
      {
        pageNumber: 3,
        title: 'Workbook Activities & Solutions',
        imageUrl: '/previews/Kali Kannada class 1/Exercises (2).jpeg',
        category: 'Exercises',
        kannadaText: 'ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಉತ್ತರಗಳು (Workbook Activities)',
        englishTranslation: 'Complete answers for primary workbook exercises.'
      }
    ],
    inStock: true,
    stockQuantity: 40,
    rating: 4.88,
    reviewCount: 19
  },
  {
    id: '19577',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 2',
    slug: 'kali-kannada-english-translated-innovative-guidebook-class-2',
    series: 'Kali',
    gradeClass: 2,
    sku: 'KK2',
    price: 290,
    originalPrice: 350,
    badge: 'Recommended',
    description: 'Step-by-step English translation guidebook for Class 2 Kali Kannada curriculum, easing homework stress for non-native speaking families.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Part 1: Story Lessons & Moral Tales',
      'Part 2: Rhymes & Poems with Translation',
      'Part 3: Basic Kannada Grammar',
      'Part 4: Textbook Solved Answers'
    ],
    coverImage: '/covers/kali-2.png',
    karnatakaTextbookCover: '/government-covers/kali-2.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/kali-2-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Curriculum & Story Index',
        imageUrl: '/previews/Kali Kannada class 2/Index.jpeg',
        category: 'Index',
        kannadaText: 'ಪಾಠಗಳ ಪಟ್ಟಿ (Lesson & Story Index)',
        englishTranslation: 'Overview of stories and grammar modules for Class 2.'
      },
      {
        pageNumber: 2,
        title: 'Poem Translation & English Meaning',
        imageUrl: '/previews/Kali Kannada class 2/Poem.jpeg',
        category: 'Poem',
        kannadaText: 'ಕವಿತೆ ಮತ್ತು ಸರಳ ಅನುವಾದ (Poem & Translation)',
        englishTranslation: 'Accurate English translation alongside prescribed Kannada rhymes.'
      },
      {
        pageNumber: 3,
        title: 'Solved Textbook Answers',
        imageUrl: '/previews/Kali Kannada class 2/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಪಠ್ಯಪುಸ್ತಕದ ಪ್ರಶ್ನೋತ್ತರಗಳು (Textbook Solutions)',
        englishTranslation: 'Complete answers to workbook questions for stress-free homework.'
      }
    ],
    inStock: true,
    stockQuantity: 30,
    rating: 4.86,
    reviewCount: 22
  },
  {
    id: '19571',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 3',
    slug: 'kali-kannada-english-translated-innovative-guidebook-class-3',
    series: 'Kali',
    gradeClass: 3,
    sku: 'KK3',
    price: 290,
    originalPrice: 350,
    badge: 'Popular',
    description: 'Advanced Kali Kannada Class 3 guide helping students master reading comprehension, dictation, and exam readiness with ease.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Unit 1: Environment & Science Lessons',
      'Unit 2: Historical Figures of Karnataka',
      'Unit 3: Advanced Ottakshara Guide',
      'Unit 4: Exam Solved Questions'
    ],
    coverImage: '/covers/kali-3.png',
    karnatakaTextbookCover: '/government-covers/kali-3.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Syllabus & Chapter Index',
        imageUrl: '/previews/Kali Kannada class 3/Index.jpeg',
        category: 'Index',
        kannadaText: 'ವಿಷಯ ಸೂಚಿ (Class 3 Syllabus Index)',
        englishTranslation: 'Complete listing of chapters and grammar topics for Class 3.'
      },
      {
        pageNumber: 2,
        title: 'Lesson Translation & Vocabulary Key',
        imageUrl: '/previews/Kali Kannada class 3/Lesson.jpeg',
        category: 'Poem',
        kannadaText: 'ಪಾಠ ಅನುವಾದ ಮತ್ತು ಶಬ್ದಾರ್ಥ (Lesson & Vocabulary)',
        englishTranslation: 'Detailed passage translation with English word-by-word meanings.'
      },
      {
        pageNumber: 3,
        title: 'Solved Question Bank',
        imageUrl: '/previews/Kali Kannada class 3/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಪ್ರಶ್ನೋತ್ತರ ಕೋಶ (Solved Question Bank)',
        englishTranslation: 'Step-by-step solved exercises aligned to state standards.'
      }
    ],
    inStock: true,
    stockQuantity: 25,
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: '19757',
    title: 'Kali Kannada English Translated Innovative Guidebook Class 4',
    slug: 'kali-kannada-english-translated-innovative-guidebook-class-4',
    series: 'Kali',
    gradeClass: 4,
    sku: 'KK4',
    price: 295,
    originalPrice: 360,
    badge: 'Essential',
    description: 'Complete academic companion for Class 4 Kali Kannada textbook. Eliminates the need for expensive home tutors by empowering parents to teach at home.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Chapter 1: Karnataka Heritage & Landmarks',
      'Chapter 2: Great Poets & Writers',
      'Chapter 3: Grammar Essentials',
      'Chapter 4: Question & Answer Solutions'
    ],
    coverImage: '/covers/kali-4.png',
    karnatakaTextbookCover: '/government-covers/kali-4.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/kali-4-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Unit & Chapter Index',
        imageUrl: '/previews/Kali Kannada class 4/Index.jpeg',
        category: 'Index',
        kannadaText: 'ಅಧ್ಯಾಯ ಸೂಚಿ (Chapter Index)',
        englishTranslation: 'Full syllabus overview for Class 4 Kali Kannada curriculum.'
      },
      {
        pageNumber: 2,
        title: 'Lesson Translation with Parallel English',
        imageUrl: '/previews/Kali Kannada class 4/Lesson.jpeg',
        category: 'Poem',
        kannadaText: 'ಪಾಠ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ವಿವರಣೆ (Lesson & Parallel English)',
        englishTranslation: 'Full lesson text accompanied by parallel English translation.'
      },
      {
        pageNumber: 3,
        title: 'Solved Exercises & Model Answers',
        imageUrl: '/previews/Kali Kannada class 4/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಅಭ್ಯಾಸ ಪರಿಹಾರಗಳು (Exercise Solutions)',
        englishTranslation: 'Comprehensive model answers for all chapter-end questions.'
      }
    ],
    inStock: true,
    stockQuantity: 35,
    rating: 4.93,
    reviewCount: 46
  },
  {
    id: '17548',
    title: 'Siri Kannada English Translated Guidebook Class 5',
    slug: 'siri-kannada-english-translated-guidebook-class-5',
    series: 'Siri',
    gradeClass: 5,
    sku: 'SR5',
    price: 290,
    originalPrice: 350,
    badge: 'Top Rated',
    description: 'Class 5 Siri Kannada comprehensive guidebook bridging middle school Kannada literature with clear English explanations, essay writing aids, and grammar rules.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Unit 1: Sirivanta Kannada Literature',
      'Unit 2: Famous Stories of Tenali Rama & Birbal',
      'Unit 3: Formal & Informal Letter Writing',
      'Unit 4: Solved Model Test Papers'
    ],
    coverImage: '/covers/siri-5.png',
    karnatakaTextbookCover: '/government-covers/siri-5.jpg',
    karnatakaTextbookPart2Cover: '/government-covers/siri-5-part2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Class 5 Siri Kannada Comprehensive Index',
        imageUrl: '/previews/Siri Kannada class 5/Index.jpeg',
        category: 'Index',
        kannadaText: 'ಪರಿವಿಡಿ - ಸಿರಿ ಕನ್ನಡ ತರಗತಿ ೫ (Class 5 Index)',
        englishTranslation: 'Middle school literature, grammar, and letter writing roadmap.'
      },
      {
        pageNumber: 2,
        title: 'Poem Translation & Stanza Breakdown',
        imageUrl: '/previews/Siri Kannada class 5/Poem.jpeg',
        category: 'Poem',
        kannadaText: 'ಪದ್ಯ ಭಾಗ ಮತ್ತು ಕವಿತಾ ಸಾರಾಂಶ (Poetry Translation)',
        englishTranslation: 'Detailed stanza analysis with parallel English meaning.'
      },
      {
        pageNumber: 3,
        title: 'Model Exam Paper Answer Keys',
        imageUrl: '/previews/Siri Kannada class 5/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಮಾದರಿ ಪ್ರಶ್ನೋತ್ತರಗಳು (Exam Answer Keys)',
        englishTranslation: 'Full question-and-answer solutions for school exam preparation.'
      }
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.96,
    reviewCount: 64
  },
  {
    id: '20049',
    title: 'Tili Kannada English Translated Innovative Guidebook Class 5',
    slug: 'tili-kannada-english-translated-innovative-guidebook-class-5',
    series: 'Tili',
    gradeClass: 5,
    sku: 'TL5',
    price: 295,
    originalPrice: 360,
    badge: 'Bestseller',
    description: 'High-level Class 5 Tili Kannada guidebook designed to build deep reading comprehension, vocabulary mastery, and high exam performance for 5th graders.',
    features: [
      'Kannada to English conversation for Pronunciation',
      'Kannada text meaningfully translated to English',
      'Covers all Exercises with Answers',
      'Synopsis in English for Lessons',
      'Aligned with Karnataka School Textbook for CBSE, ICSE, State, IG, KV.'
    ],
    tableOfContents: [
      'Lesson 1: Kannada Sahitya Charitre (History of Literature)',
      'Lesson 2: Parisara Samrakshane (Environmental Conservation)',
      'Lesson 3: Advanced Grammar Masterclass',
      'Lesson 4: Comprehensive Answer Key'
    ],
    coverImage: '/covers/tili-5.png',
    karnatakaTextbookCover: '/government-covers/tili-5.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Class 5 Tili Kannada Syllabus Index',
        imageUrl: '/previews/Tili Kannada class 5/Index.jpeg',
        category: 'Index',
        kannadaText: 'ಅಧ್ಯಾಯ ಪಟ್ಟಿ (Tili Kannada Chapter Index)',
        englishTranslation: 'Comprehensive Class 5 curriculum syllabus structure.'
      },
      {
        pageNumber: 2,
        title: 'Prose & Poetry Translation',
        imageUrl: '/previews/Tili Kannada class 5/Poem.jpeg',
        category: 'Poem',
        kannadaText: 'ಪಾಠ ಅನುವಾದ ಮತ್ತು ಶಬ್ದ ಭಂಡಾರ (Translation & Vocabulary)',
        englishTranslation: 'Chapter translations and advanced grammar rules in English.'
      },
      {
        pageNumber: 3,
        title: 'Comprehensive Solved Exercise Bank',
        imageUrl: '/previews/Tili Kannada class 5/Exercises.jpeg',
        category: 'Exercises',
        kannadaText: 'ಅಭ್ಯಾಸ ಕೋಶ ಮತ್ತು ಉತ್ತರಗಳು (Solved Exercise Bank)',
        englishTranslation: 'Complete answers for all textbook exercise and evaluation sections.'
      }
    ],
    inStock: true,
    stockQuantity: 42,
    rating: 4.98,
    reviewCount: 78
  },
  {
    id: '21500',
    title: 'A Destination to Speak Kannada',
    slug: 'a-destination-to-speak-kannada',
    series: 'Spoken',
    gradeClass: 0,
    sku: 'DSK',
    price: 295,
    originalPrice: 350,
    badge: 'Illustrated Edition',
    description: 'Pictorially and innovatively crafted book to speak and learn Kannada for beginners and non-Kannada speakers across 23 practical conversation chapters.',
    features: [
      '23 chapters covering everyday situations and conversations',
      'Pictorial approach connecting Kannada words to real-life scenarios',
      'Practical Kannada vocabulary for travel, shopping, family and services',
      'Language basics: numbers, pronouns, tenses and Gunithakshara'
    ],
    tableOfContents: [
      'Part 1: Kannada Introductions & Family Conversations',
      'Part 2: Questions, Pronouns, Numbers & Descriptions',
      'Part 3: Travel, Transport, Shopping & Local Services',
      'Part 4: Language Basics, Tenses & Everyday Vocabulary'
    ],
    coverImage: '/covers/a-destination-to-speak-kannada.png',
    samplePages: [],
    inStock: true,
    stockQuantity: 50,
    rating: 4.95,
    reviewCount: 86
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Roopa Sanjiv P',
    role: 'Founder & Director',
    bio: 'Roopa has been volunteering extensively for Kannada language teaching and academic research across Karnataka. Through her in-depth field research, she identified the exact struggles faced by children, parents, and schools in learning Kannada as a second or third language, inspiring the creation of Belesu guidebooks.',
    imageUrl: '/team-Roopa.png',
    highlights: [
      'Pioneered English-translated curriculum aids for Karnataka state syllabus',
      'Researched academic hurdles faced by 5,000+ non-Kannadiga families',
      'Dedicated advocate for language preservation & accessible education'
    ]
  },
  {
    id: '2',
    name: 'Anjali Sharma',
    role: 'Digital & Visual Content Consultant',
    bio: 'Anjali plays a pivotal role in shaping the visual and digital content framework at Belesu. She builds intuitive design systems that ensure visual learning content feels natural, balanced, and easy to connect with across both digital platforms and physical print workbooks.',
    imageUrl: '/Anjali-Sharma-430x430.png',
    highlights: [
      'Architected visual learning frameworks for primary school workbooks',
      'Streamlined print and digital UI layout standards',
      'Spearheads content clarity & parent-child UX research'
    ]
  }
];

export const PARENT_REVIEWS: ParentReview[] = [
  {
    id: 'r1',
    parentName: 'Irin Gladia',
    location: 'Bengaluru, Karnataka',
    childGrade: 'Class 4 Parent',
    rating: 5,
    reviewText: 'This book is a true blessing for non-Kannadiga families like us! As parents, we can now easily understand the lessons along with our child and help with homework without any stress. The English translations are crystal clear!',
    date: 'July 5, 2026',
    verifiedPurchase: true,
    bookTitle: 'Savi Kannada English Translated Guidebook Class 4'
  },
  {
    id: 'r2',
    parentName: 'Priya Mukherjee',
    location: 'Whitefield, Bengaluru',
    childGrade: 'Class 3 Parent',
    rating: 5,
    reviewText: 'We were struggling for 3 years to teach Kannada to our son. After buying Belesu’s Savi Kannada Class 3 book, his marks jumped from 50% to 88%! The word-by-word English dictionary is amazing.',
    date: 'June 18, 2026',
    verifiedPurchase: true,
    bookTitle: 'Savi Kannada English Translated Guidebook Class 3'
  },
  {
    id: 'r3',
    parentName: 'Siddharth Nair',
    location: 'Mysuru, Karnataka',
    childGrade: 'Class 5 Parent',
    rating: 5,
    reviewText: 'Tili Kannada Class 5 book saved our daughter during final exams. The letter writing and grammar sections are explained in simple English. Highly recommended for all parents in Karnataka!',
    date: 'May 24, 2026',
    verifiedPurchase: true,
    bookTitle: 'Tili Kannada English Translated Guidebook Class 5'
  },
  {
    id: 'r4',
    parentName: 'Kavitha R.',
    location: 'Hubballi, Karnataka',
    childGrade: 'Class 2 Parent',
    rating: 5,
    reviewText: 'It feels like a community service rather than just a book! The quality of paper, clarity of Kannada script, and English explanations are 10/10.',
    date: 'April 12, 2026',
    verifiedPurchase: true,
    bookTitle: 'Kali Kannada English Translated Guidebook Class 2'
  },
  {
    id: 'r5',
    parentName: 'Rajeshwar Sen',
    location: 'Electronic City, Bengaluru',
    childGrade: 'Class 1 Parent',
    rating: 5,
    reviewText: 'Moving from Kolkata, we were anxious about Kannada as a compulsory subject. The Kali Kannada Class 1 guidebook with phonetic English transliteration made early alphabet and word formation effortless for our daughter!',
    date: 'March 28, 2026',
    verifiedPurchase: true,
    bookTitle: 'Kali Kannada English Translated Guidebook Class 1'
  },
  {
    id: 'r6',
    parentName: 'Dr. Archana Rao',
    location: 'Mangaluru, Karnataka',
    childGrade: 'Class 4 Parent',
    rating: 5,
    reviewText: 'The word-by-word Kannada to English dictionary and chapter-wise solved question answers are brilliant. It builds self-reliance so children can complete school homework without hesitation.',
    date: 'March 15, 2026',
    verifiedPurchase: true,
    bookTitle: 'Savi Kannada English Translated Guidebook Class 4'
  },
  {
    id: 'r7',
    parentName: 'Deepak Mehta',
    location: 'Sarjapur Road, Bengaluru',
    childGrade: 'Class 3 Parent',
    rating: 5,
    reviewText: 'Clear grammar explanations for Gunintagalu and Ottakshara gave us tremendous confidence. This is the single best academic companion for CBSE and State Syllabus Kannada.',
    date: 'February 22, 2026',
    verifiedPurchase: true,
    bookTitle: 'Savi Kannada English Translated Guidebook Class 3'
  },
  {
    id: 'r8',
    parentName: 'Sneha Joshi',
    location: 'Belagavi, Karnataka',
    childGrade: 'Class 5 Parent',
    rating: 5,
    reviewText: 'Siri Kannada Class 5 guidebook explains middle school poetry stanza by stanza. My son went from fearing Kannada exams to scoring 92%! Heartfelt gratitude to the Belesu team.',
    date: 'February 04, 2026',
    verifiedPurchase: true,
    bookTitle: 'Siri Kannada English Translated Guidebook Class 5'
  }
];

export const VIDEO_REELS: VideoReel[] = [
  {
    id: 'v1',
    title: 'How Belesu Helps Non-Kannadiga Parents',
    description: 'Watch how Belesu guidebooks make daily Kannada homework easy and fun for parents & children.',
    videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel1.mp4',
    thumbnailUrl: '/savi-kannada-1st-1stpart.png',
    duration: '0:45'
  },
  {
    id: 'v2',
    title: 'Sample Chapter Walkthrough (Savi Kannada)',
    description: 'A close look at line-by-line translations, vocabulary keys, and solved question papers.',
    videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel2.mp4',
    thumbnailUrl: '/2nd-1stpart.png',
    duration: '1:10'
  },
  {
    id: 'v3',
    title: 'Parent Feedback & Student Success Stories',
    description: 'Real stories from families across Bengaluru, Mysuru, and Mangaluru.',
    videoUrl: 'https://belesu.in/wp-content/uploads/2025/07/Belesu-Ad-Reel3.mp4',
    thumbnailUrl: '/SV-3-2.png',
    duration: '0:55'
  }
];

