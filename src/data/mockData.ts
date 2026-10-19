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
      'Line-by-line English translation for every Kannada lesson',
      'Word-by-word Kannada to English dictionary at chapter ends',
      'Pronunciation guide in English script (Transliteration)',
      'Colorful visual diagrams & solved textbook exercises'
    ],
    tableOfContents: [
      'Lesson 1: Alphabets & Vowels (ಅ - ಅಃ)',
      'Lesson 2: Consonants & Pronunciation (ಕ - ಳ)',
      'Lesson 3: Simple Words & Daily Greetings',
      'Lesson 4: Solved Textbook Exercises & Worksheets'
    ],
    coverImage: '/covers/savi-1.png',
    karnatakaTextbookCover: '/covers/textbook-savi-1.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Kannada Vowels with English Meaning',
        imageUrl: '/savi-kannada-1st-1stpart.png',
        kannadaText: 'ಅ - ಅರಸ (King), ಆ - ಆನೆ (Elephant), ಇ - ಇಲಿ (Mouse)',
        englishTranslation: 'A - Arasa (King), Aa - Aane (Elephant), I - Ili (Mouse)'
      },
      {
        pageNumber: 2,
        title: 'Daily Expressions & Greetings',
        imageUrl: '/savi-kannada-1st-2ndpart.png',
        kannadaText: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರ? (Hello, how are you?)',
        englishTranslation: 'Namaskara, neevu hegeeddeera? (Hello, how are you?)'
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
      'Complete English breakdown of Class 2 poems & prose',
      'Clear grammar explanations (Gunintagalu & Ottakshara)',
      'Doubt-solving exercise solutions aligned with State Syllabus',
      'Interactive picture-word association pages'
    ],
    tableOfContents: [
      'Chapter 1: Nanna Deha (My Body & Health)',
      'Chapter 2: Kaadu Pranigalu (Wild Animals)',
      'Chapter 3: Gunintagalu Master Guide',
      'Chapter 4: Class 2 Exercise Answer Key'
    ],
    coverImage: '/covers/savi-2.png',
    karnatakaTextbookCover: '/covers/textbook-savi-2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Poem Translation & Word Meanings',
        imageUrl: '/2nd-1stpart.png',
        kannadaText: 'ಬೆಳಗಾಯಿತು ಏಳಿರಿ, ಪಕ್ಷಿಗಳ ಹಾಡು ಕೇಳಿರಿ',
        englishTranslation: 'Belagayitu eeliri, paksheegala haadu keeliri (Morning has broken, arise and listen to the birds singing)'
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
      'Full Class 3 Karnataka State Board textbook solution',
      'Kannada sentence structure simplified in English',
      'Vocabulary bank with 500+ key academic words',
      'Self-assessment practice test papers'
    ],
    tableOfContents: [
      'Lesson 1: Kannada Naadu (Karnataka Land & Culture)',
      'Lesson 2: Parisara Kurihtu (Environment & Nature)',
      'Lesson 3: Grammar - Naamapada (Nouns) & Kriyapada (Verbs)',
      'Lesson 4: Model Examination Papers'
    ],
    coverImage: '/covers/savi-3.png',
    karnatakaTextbookCover: '/covers/textbook-savi-3.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Nouns & Verb Conjugation Guide',
        imageUrl: '/SV-3-2.png',
        kannadaText: 'ರಾಮನು ಶಾಲೆಗೆ ಹೋಗುತ್ತಾನೆ. (Ram goes to school.)',
        englishTranslation: 'Ramanu shalege hoguttaane. (Ram goes to school.)'
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
      'Complete English rendering of prose & poetry lessons',
      'Comprehensive Ottakshara (Compound letters) tutorial',
      'Step-by-step answers for all textbook exercise questions',
      'Bilingual glossary for easy parent verification'
    ],
    tableOfContents: [
      'Unit 1: Veerabaale Kitturu Chennamma',
      'Unit 2: Hasiru (Greenery & Nature Poem)',
      'Unit 3: Sandhigalu & Vibhakti Pratyayagalu',
      'Unit 4: Question & Answer Bank'
    ],
    coverImage: '/covers/savi-4.png',
    karnatakaTextbookCover: '/covers/textbook-savi-4.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Kitturu Chennamma Lesson Breakdown',
        imageUrl: '/SV-4-2.png',
        kannadaText: 'ಕಿತ್ತೂರಿನ ರಾಣಿ ಚೆನ್ನಮ್ಮ ಸ್ವಾತಂತ್ರ್ಯ ಪ್ರೇಮಿ.',
        englishTranslation: 'Kitturina Rani Chennamma svaatantrya premi. (Queen Chennamma of Kittur was a freedom lover.)'
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
      'Foundational phonetic pronunciation guide',
      'Dual script (Kannada + English transliteration)',
      'Visual flashcard style lesson layouts',
      'Parent assistance notes in English'
    ],
    tableOfContents: [
      'Module 1: Aksharamale Basics',
      'Module 2: Simple 2-Letter Words',
      'Module 3: Colours & Numbers in Kannada',
      'Module 4: Exercise Workbook'
    ],
    coverImage: '/covers/kali-1.png',
    karnatakaTextbookCover: '/covers/textbook-kali-1.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Colors & Basic Words',
        imageUrl: '/savi-kannada-1st-1stpart.png',
        kannadaText: 'ಕೆಂಪು (Red), ನೀಲಿ (Blue), ಹಸಿರು (Green)',
        englishTranslation: 'Kempu (Red), Neeli (Blue), Hasiru (Green)'
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
      'Sentence translation with grammar breakdown',
      'Interactive exercises with solved answer keys',
      'Pronunciation key for every new vocabulary word',
      'Visual story summaries'
    ],
    tableOfContents: [
      'Part 1: Story Lessons & Moral Tales',
      'Part 2: Rhymes & Poems with Translation',
      'Part 3: Basic Kannada Grammar',
      'Part 4: Textbook Solved Answers'
    ],
    coverImage: '/covers/kali-2.png',
    karnatakaTextbookCover: '/covers/textbook-kali-2.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Story Summary in English',
        imageUrl: '/2nd-2nd-part.png',
        kannadaText: 'ಒಂದಾನೊಂದು ಕಾಲದಲ್ಲಿ ಒಂದು ಕಾಡಿನಲ್ಲಿ ಸಿಂಹವಿತ್ತು.',
        englishTranslation: 'Ondaanondu kaaladalli ondu kaadinalli simhavittu. (Once upon a time, there was a lion in a forest.)'
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
      'Comprehensive prose & poem translation',
      'Key word meanings & synonyms in English',
      'Grammar concepts: Tenses & Gender',
      'Practice mock test papers'
    ],
    tableOfContents: [
      'Unit 1: Environment & Science Lessons',
      'Unit 2: Historical Figures of Karnataka',
      'Unit 3: Advanced Ottakshara Guide',
      'Unit 4: Exam Solved Questions'
    ],
    coverImage: '/covers/kali-3.png',
    karnatakaTextbookCover: '/covers/textbook-kali-3.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Exam Preparation Notes',
        imageUrl: '/SV-3-2.png',
        kannadaText: 'ಪ್ರಶ್ನೆ: ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಯಾವುದು? ಉತ್ತರ: ಬೆಂಗಳೂರು.',
        englishTranslation: 'Question: What is the capital of Karnataka? Answer: Bengaluru.'
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
      'Word-by-word parallel text in English',
      'Comprehensive question & answer repository',
      'Grammar section covering Sandhi and Samasa basics',
      'Revision worksheets for mid-term & final exams'
    ],
    tableOfContents: [
      'Chapter 1: Karnataka Heritage & Landmarks',
      'Chapter 2: Great Poets & Writers',
      'Chapter 3: Grammar Essentials',
      'Chapter 4: Question & Answer Solutions'
    ],
    coverImage: '/covers/kali-4.png',
    karnatakaTextbookCover: '/covers/textbook-kali-4.jpg',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Heritage Lesson Breakdown',
        imageUrl: '/SV-4-2.png',
        kannadaText: 'ಹಂಪಿ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯಾಗಿತ್ತು.',
        englishTranslation: 'Hampi Vijayanagara saamraajyada raajadhaaniyaagittu. (Hampi was the capital of the Vijayanagara Empire.)'
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
      'Complete Siri Kannada Class 5 syllabus solutions',
      'Essay writing & letter writing templates in Kannada & English',
      'Detailed poem summary & annotation guide',
      'Model question papers for board standard prep'
    ],
    tableOfContents: [
      'Unit 1: Sirivanta Kannada Literature',
      'Unit 2: Famous Stories of Tenali Rama & Birbal',
      'Unit 3: Formal & Informal Letter Writing',
      'Unit 4: Solved Model Test Papers'
    ],
    coverImage: '/covers/siri-5.png',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Letter Writing Template',
        imageUrl: '/SV-5-2.png',
        kannadaText: 'ರಜಾ ಪತ್ರ (Leave Letter Format & Example)',
        englishTranslation: 'Raja Patra (Leave Letter Format & English Translation)'
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
      'Full Tili Kannada Class 5 textbook English translation',
      'Advanced grammar guide: Alankara, Samasa, Tatsama-Tadbhava',
      'Chapter summaries & key thematic points',
      'Full question bank with model scoring guide'
    ],
    tableOfContents: [
      'Lesson 1: Kannada Sahitya Charitre (History of Literature)',
      'Lesson 2: Parisara Samrakshane (Environmental Conservation)',
      'Lesson 3: Advanced Grammar Masterclass',
      'Lesson 4: Comprehensive Answer Key'
    ],
    coverImage: '/covers/tili-5.png',
    samplePages: [
      {
        pageNumber: 1,
        title: 'Grammar Masterclass',
        imageUrl: '/SV-5-2.png',
        kannadaText: 'ತತ್ಸಮ - ತದ್ಭವ ಪಟ್ಟಿ (Tatsama - Tadbhava List)',
        englishTranslation: 'Tatsama - Tadbhava word list with English meanings.'
      }
    ],
    inStock: true,
    stockQuantity: 42,
    rating: 4.98,
    reviewCount: 78
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
