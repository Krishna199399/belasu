/**
 * Belesu chat assistant — rule-based "brain".
 *
 * Free to run: no AI/API calls. Each user message is matched against keyword
 * intents (plus class / series detection) and answered from the real catalogue
 * (BOOKS_DATA / digital books), so prices and links stay in sync with the site.
 *
 * To add or change an answer, edit the INTENTS list below.
 */
import type { BookProduct, DigitalBook } from '@/types';
import { SHIPPING_FEE } from '@/lib/utils';

// ─── Contact constants ──────────────────────────────────────────────────────
export const SUPPORT_WHATSAPP = '919606636804';
export const SUPPORT_PHONE_DISPLAY = '+91 96066 36804';
export const SUPPORT_EMAIL = 'kannada@belesu.in';
export const SUPPORT_HOURS = 'Monday – Saturday, 9:00 AM – 7:00 PM IST';

export function whatsappLink(message: string): string {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ChatBookCard {
  id: string;
  kind: 'physical' | 'digital';
  title: string;
  price: number;
  originalPrice?: number;
  cover: string;
  href: string;
  inStock: boolean;
}

export interface ChatLink {
  label: string;
  href: string;
  /** Opens in a new tab (WhatsApp, phone, email). */
  external?: boolean;
  variant?: 'whatsapp' | 'default';
}

export interface BotReply {
  intent: string;
  /** Supports **bold**, line breaks and "• " bullet lines. */
  text: string;
  books?: ChatBookCard[];
  links?: ChatLink[];
  chips?: string[];
}

export interface ChatCatalog {
  physical: BookProduct[];
  digital: DigitalBook[];
}

// ─── Quick-reply chip labels (also matched exactly as user input) ───────────
export const CHIP = {
  findBook: "Find a book for my child's class",
  prices: 'Prices of all books',
  digital: 'Digital guidebooks',
  delivery: 'Delivery time & charges',
  track: 'Track my order',
  human: 'Talk to a person',
  saviVsKali: 'Savi or Kali – which one?',
  siriVsTili: 'Siri or Tili – which one?',
  returns: 'Returns & damaged books',
  payment: 'Payment options',
  spoken: 'Learn to speak Kannada (adults)',
  bulk: 'Bulk / school orders',
  syllabus: 'Is it for CBSE / ICSE?',
  samples: 'See sample pages',
} as const;

export const WELCOME_CHIPS = [
  CHIP.findBook,
  CHIP.prices,
  CHIP.digital,
  CHIP.delivery,
  CHIP.track,
  CHIP.human,
];

const CLASS_CHIPS = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'];

// ─── Helpers ────────────────────────────────────────────────────────────────
const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function shortPhysicalTitle(b: BookProduct): string {
  if (b.series === 'Spoken' || !b.gradeClass) return b.title;
  return `${b.series} Kannada – Class ${b.gradeClass}`;
}

function shortDigitalTitle(b: DigitalBook): string {
  const base = b.title.split('—')[0].trim();
  return `${base} (Digital)`;
}

function physicalCard(b: BookProduct): ChatBookCard {
  return {
    id: b.id,
    kind: 'physical',
    title: shortPhysicalTitle(b),
    price: b.price,
    originalPrice: b.originalPrice,
    cover: b.coverImage,
    href: `/books/${b.slug}/`,
    inStock: b.inStock !== false && b.stockQuantity > 0,
  };
}

function digitalCard(b: DigitalBook): ChatBookCard {
  return {
    id: b.id,
    kind: 'digital',
    title: shortDigitalTitle(b),
    price: b.price,
    originalPrice: b.originalPrice,
    cover: b.coverImage,
    href: `/digital/${b.slug}/`,
    inStock: true,
  };
}

const human = (question?: string): ChatLink => ({
  label: 'Chat on WhatsApp',
  href: whatsappLink(
    question
      ? `Hello Belesu Team, I have a question: ${question}`
      : 'Hello Belesu Team, I need help choosing a Kannada guidebook.'
  ),
  external: true,
  variant: 'whatsapp',
});

function normalize(text: string): string {
  return ` ${text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9ಀ-೿₹\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

const ORDINAL_WORDS: Record<string, number> = {
  first: 1, one: 1, second: 2, two: 2, third: 3, three: 3, fourth: 4, four: 4,
  fifth: 5, five: 5, sixth: 6, six: 6, seventh: 7, seven: 7, eighth: 8, eight: 8,
  ninth: 9, nine: 9, tenth: 10, ten: 10,
};

/** Detects "class 4", "grade 3", "4th std", "5th class", "class five", "1st". */
export function parseClass(norm: string): number | null {
  const direct = norm.match(/\b(?:class|grade|std|standard|cls)\s*(\d{1,2})\b/);
  if (direct) return Number(direct[1]);
  const ordinal = norm.match(/\b(\d{1,2})\s*(?:st|nd|rd|th)\b/);
  if (ordinal) return Number(ordinal[1]);
  const worded = norm.match(
    /\b(?:class|grade|std|standard)\s+(one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\b/
  );
  if (worded) return ORDINAL_WORDS[worded[1]];
  const wordedOrdinal = norm.match(
    /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+(?:class|grade|std|standard)\b/
  );
  if (wordedOrdinal) return ORDINAL_WORDS[wordedOrdinal[1]];
  return null;
}

type Series = 'Savi' | 'Kali' | 'Siri' | 'Tili' | 'Spoken';

function parseSeries(norm: string): Series[] {
  const found: Series[] = [];
  if (/\bsavi\b/.test(norm)) found.push('Savi');
  if (/\bkali\b/.test(norm)) found.push('Kali');
  if (/\bsiri\b/.test(norm)) found.push('Siri');
  if (/\btili\b/.test(norm)) found.push('Tili');
  return found;
}

const has = (norm: string, words: string[]) => words.some((w) => norm.includes(` ${w}`));

const DIGITAL_WORDS = ['digital', 'ebook', 'e book', 'pdf', 'online', 'reader', 'soft copy', 'softcopy'];

// ─── Book finder ────────────────────────────────────────────────────────────
function bookFinder(
  catalog: ChatCatalog,
  grade: number | null,
  series: Series[],
  wantsDigital: boolean,
  original: string
): BotReply {
  const physical = catalog.physical.filter((b) => b.series !== 'Spoken');
  const digitalForGrade = grade ? catalog.digital.filter((d) => d.gradeClass === grade) : [];

  // Asked to compare two series (e.g. "savi or kali")
  if (!grade && series.length > 1) {
    return series.includes('Siri') || series.includes('Tili') ? siriVsTili() : saviVsKali();
  }

  // Series + class → exact book
  if (grade && series.length === 1) {
    const exact = physical.find((b) => b.series === series[0] && b.gradeClass === grade);
    if (exact) {
      return {
        intent: 'book_exact',
        text: `Here's the **${shortPhysicalTitle(exact)}** guidebook. It has line-by-line English translation, pronunciation help, lesson synopsis in English and all exercises solved.`,
        books: [physicalCard(exact), ...digitalForGrade.map(digitalCard)],
        chips: [CHIP.delivery, CHIP.samples, CHIP.payment],
      };
    }
    const inSeries = physical.filter((b) => b.series === series[0]);
    return {
      intent: 'book_not_found',
      text: `We don't have a **${series[0]} Kannada Class ${grade}** guidebook yet. ${
        inSeries.length
          ? `${series[0]} Kannada is available for ${inSeries.map((b) => `Class ${b.gradeClass}`).join(', ')}:`
          : ''
      }`,
      books: inSeries.map(physicalCard),
      links: [human(original)],
      chips: [CHIP.findBook, CHIP.prices],
    };
  }

  // Series only
  if (!grade && series.length === 1) {
    const inSeries = physical.filter((b) => b.series === series[0]);
    const range = series[0] === 'Savi' || series[0] === 'Kali' ? 'Classes 1–4' : 'Class 5';
    return {
      intent: 'series',
      text: `**${series[0]} Kannada** guidebooks are available for ${range}. Pick your child's class:`,
      books: inSeries.map(physicalCard),
      chips: [CHIP.delivery, CHIP.digital],
    };
  }

  if (grade === null) return askClass();

  // Class only
  if (wantsDigital && digitalForGrade.length) {
    return {
      intent: 'digital_grade',
      text: `Here's the **digital guidebook for Class ${grade}**. You read it online in the Belesu reader on phone, tablet or computer. Access appears in **My Library** right after payment, with no delivery wait.`,
      books: digitalForGrade.map(digitalCard),
      chips: [CHIP.digital, CHIP.payment],
    };
  }

  if (grade >= 1 && grade <= 4) {
    const books = physical.filter((b) => b.gradeClass === grade);
    return {
      intent: 'book_class',
      text: `For **Class ${grade}** there are two guidebooks, one for each government Kannada textbook: **Savi Kannada** and **Kali Kannada**.\nPlease choose the one whose name matches the **cover of your child's Kannada textbook**.${
        digitalForGrade.length ? '\nA **digital edition** is also available for this class.' : ''
      }`,
      books: [...books.map(physicalCard), ...digitalForGrade.map(digitalCard)],
      chips: [CHIP.saviVsKali, CHIP.delivery, CHIP.samples],
    };
  }

  if (grade === 5) {
    const books = physical.filter((b) => b.gradeClass === 5);
    return {
      intent: 'book_class',
      text: `For **Class 5** there are two guidebooks: **Siri Kannada** and **Tili Kannada**.\nPlease choose the one whose name matches the **cover of your child's Kannada textbook**.`,
      books: books.map(physicalCard),
      chips: [CHIP.siriVsTili, CHIP.delivery, CHIP.samples],
    };
  }

  if (grade === 6) {
    const books = physical.filter((b) => b.gradeClass === 6);
    return {
      intent: 'book_class',
      text: books.length
        ? `Here are the **Class 6** guidebooks:`
        : `For **Class 6**, our complete English-translated guidebook is available as a **digital edition**. You can read it instantly online after payment. For a printed copy, please ask us on WhatsApp.`,
      books: [...books.map(physicalCard), ...digitalForGrade.map(digitalCard)],
      links: books.length ? undefined : [human('Is a printed Class 6 Kannada guidebook available?')],
      chips: [CHIP.digital, CHIP.payment],
    };
  }

  if (grade >= 7 && grade <= 9) {
    return {
      intent: 'book_upcoming',
      text: `Guidebooks for **Class ${grade}** are **coming soon** as digital editions. Message us on WhatsApp and we'll tell you as soon as it launches.`,
      links: [human(`Please notify me when the Class ${grade} Kannada guidebook is available.`)],
      chips: [CHIP.findBook, CHIP.spoken],
    };
  }

  return {
    intent: 'book_out_of_range',
    text: `Our guidebooks currently cover **Classes 1–6** (Classes 7–9 digital editions are coming soon). For adults and beginners we also have **A Destination to Speak Kannada**.`,
    chips: [CHIP.findBook, CHIP.spoken, CHIP.human],
  };
}

function askClass(): BotReply {
  return {
    intent: 'ask_class',
    text: 'Happy to help! Which class is your child in?',
    chips: CLASS_CHIPS,
  };
}

function saviVsKali(): BotReply {
  return {
    intent: 'savi_vs_kali',
    text: `**Savi Kannada** and **Kali Kannada** are two different Karnataka government Kannada textbooks for Classes 1–4. Schools choose one of them.\n\nThe easy way to decide: **look at the cover of your child's Kannada textbook**. If it says ಸವಿ ಕನ್ನಡ (Savi), choose Savi; if it says ಕಲಿ ಕನ್ನಡ (Kali), choose Kali.\n\nNot sure? Send us a photo of the textbook cover on WhatsApp and we'll tell you the right guide.`,
    links: [human("I'm not sure whether my child needs Savi or Kali Kannada. Here is the textbook cover:")],
    chips: CLASS_CHIPS.slice(0, 4),
  };
}

function siriVsTili(): BotReply {
  return {
    intent: 'siri_vs_tili',
    text: `**Siri Kannada** and **Tili Kannada** are two different government Kannada textbooks for the higher classes. Schools choose one of them.\n\nCheck the **cover of your child's Kannada textbook**: if it says ಸಿರಿ ಕನ್ನಡ choose Siri, if it says ತಿಳಿ ಕನ್ನಡ choose Tili.\n\nNot sure? Send us a photo of the cover on WhatsApp.`,
    links: [human("I'm not sure whether my child needs Siri or Tili Kannada. Here is the textbook cover:")],
    chips: ['Class 5', 'Class 6'],
  };
}

// ─── Keyword intents ────────────────────────────────────────────────────────
interface Intent {
  id: string;
  keywords: string[];
  chip?: string;
  reply: (catalog: ChatCatalog, original: string) => BotReply;
}

const INTENTS: Intent[] = [
  {
    id: 'human',
    chip: CHIP.human,
    keywords: ['human', 'person', 'agent', 'executive', 'customer care', 'customer support', 'talk to', 'speak to someone', 'call me', 'callback', 'whatsapp', 'real person'],
    reply: () => ({
      intent: 'human',
      text: `Sure! Our team is available **${SUPPORT_HOURS}**.\n• WhatsApp / Call: **${SUPPORT_PHONE_DISPLAY}**\n• Email: **${SUPPORT_EMAIL}**\nWhatsApp is usually the fastest.`,
      links: [
        human(),
        { label: `Call ${SUPPORT_PHONE_DISPLAY}`, href: `tel:+${SUPPORT_WHATSAPP}`, external: true },
      ],
    }),
  },
  {
    id: 'track',
    chip: CHIP.track,
    keywords: ['track', 'tracking', 'order status', 'my order', 'where is my', 'not received', 'not delivered', 'awb', 'consignment', 'order id', 'order number', 'when will i get'],
    reply: () => ({
      intent: 'track',
      text: `You can see all your orders and their status in **My Orders** (log in with the same mobile number you used to order).\n\nDigital guidebooks appear in **My Library** right after payment.\n\nIf your order hasn't arrived in the expected time, WhatsApp us with your **order number** and we'll check it for you.`,
      links: [
        { label: 'My Orders', href: '/profile?tab=orders' },
        { label: 'My Library', href: '/library/' },
        human('I would like to know the status of my order. Order number: '),
      ],
    }),
  },
  {
    id: 'returns',
    chip: CHIP.returns,
    keywords: ['return', 'refund', 'exchange', 'damaged', 'damage', 'defective', 'torn', 'missing page', 'wrong book', 'cancel', 'replace', 'replacement'],
    reply: () => ({
      intent: 'returns',
      text: `• **Damaged or defective book?** Tell us on WhatsApp within **48 hours** of delivery and we'll send a free replacement.\n• **Returns / exchanges** are accepted within **7 days** of delivery, if the book is unused and in its original packaging.\nTo start a return, contact us on **${SUPPORT_PHONE_DISPLAY}** with your order number.`,
      links: [
        human('I need help with a return / replacement. Order number: '),
        { label: 'Returns policy', href: '/returns/' },
      ],
    }),
  },
  {
    id: 'delivery',
    chip: CHIP.delivery,
    keywords: ['deliver', 'delivery', 'shipping', 'ship', 'courier', 'dispatch', 'how many days', 'how long', 'reach', 'charges', 'shipping fee', 'postal', 'pincode', 'outside karnataka', 'other state'],
    reply: () => ({
      intent: 'delivery',
      text: `• Orders are **dispatched within 24 hours**.\n• Delivery takes **2–4 business days** in major cities (Bengaluru, Mysuru, Hubballi, Mangaluru…) and **3–5 business days** for other pincodes.\n• Shipping charge is a flat **${rupees(SHIPPING_FEE)}** per order for printed books.\n• **Digital guidebooks** have no shipping charge; access is instant.\nFor delivery outside Karnataka, please check with us on WhatsApp.`,
      chips: [CHIP.findBook, CHIP.payment, CHIP.track],
    }),
  },
  {
    id: 'payment',
    chip: CHIP.payment,
    keywords: ['pay', 'payment', 'upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'card', 'net banking', 'netbanking', 'razorpay', 'cod', 'cash on delivery', 'emi'],
    reply: () => ({
      intent: 'payment',
      text: `We accept **UPI** (Google Pay, PhonePe, Paytm), **credit/debit cards**, **net banking** and **wallets** through the secure Razorpay checkout.\nFor any other payment option, please ask us on WhatsApp.`,
      links: [{ label: 'Go to cart', href: '/cart/' }],
      chips: [CHIP.delivery, CHIP.findBook],
    }),
  },
  {
    id: 'bulk',
    chip: CHIP.bulk,
    keywords: ['bulk', 'school order', 'schools', 'institution', 'teacher', 'wholesale', 'dealer', 'distributor', 'many copies', 'quantity', 'tuition', 'learning center', 'learning centre', 'quote'],
    reply: () => ({
      intent: 'bulk',
      text: `Yes, we offer **bulk academic discounts** for schools, tuition centres and institutions. Share the classes and number of copies, and we'll send a custom quote.\n• Phone / WhatsApp: **${SUPPORT_PHONE_DISPLAY}**\n• Email: **${SUPPORT_EMAIL}**`,
      links: [
        {
          label: 'Request a bulk quote',
          href: whatsappLink('Hello Belesu Team, I would like a bulk quote. School/Institution: , Classes: , Copies: '),
          external: true,
          variant: 'whatsapp',
        },
      ],
    }),
  },
  {
    id: 'digital',
    chip: CHIP.digital,
    keywords: DIGITAL_WORDS.concat(['library', 'instant access', 'download']),
    reply: (catalog) => ({
      intent: 'digital',
      text: `Our **digital guidebooks** are read online in the secure Belesu reader on any phone, tablet or computer.\n• Instant access in **My Library** after payment\n• No shipping charge\n• Free preview pages before you buy\nAvailable now:`,
      books: catalog.digital.map(digitalCard),
      links: [{ label: 'All digital books', href: '/digital/' }],
      chips: [CHIP.payment, CHIP.findBook],
    }),
  },
  {
    id: 'spoken',
    chip: CHIP.spoken,
    keywords: ['speak kannada', 'spoken', 'conversation', 'adult', 'beginner', 'learn kannada', 'myself', 'for me', 'colleague', 'auto driver', 'daily use', 'destination'],
    reply: (catalog) => {
      const book = catalog.physical.find((b) => b.series === 'Spoken');
      return {
        intent: 'spoken',
        text: `For adults and beginners who want to **speak everyday Kannada**, we have **A Destination to Speak Kannada**: a pictorial book with 23 practical conversation chapters (travel, auto & metro, shopping, food, family, numbers and more), each with an English pronunciation guide.`,
        books: book ? [physicalCard(book)] : undefined,
        chips: [CHIP.delivery, CHIP.payment],
      };
    },
  },
  {
    id: 'syllabus',
    chip: CHIP.syllabus,
    keywords: ['cbse', 'icse', 'igcse', 'state board', 'state syllabus', 'syllabus', 'kv', 'kendriya', 'aligned', 'board', 'curriculum', 'latest edition', 'new textbook'],
    reply: () => ({
      intent: 'syllabus',
      text: `Yes. Belesu guidebooks follow the **Karnataka government Kannada textbooks** (Savi, Kali, Siri, Tili), which are used in **CBSE, ICSE, IG, KV and State syllabus** schools across Karnataka.\nJust make sure the guide matches the name on your child's Kannada textbook cover.`,
      chips: [CHIP.findBook, CHIP.saviVsKali],
    }),
  },
  {
    id: 'parents',
    keywords: ['non kannadiga', 'dont know kannada', 'do not know kannada', 'dont speak kannada', 'cannot read kannada', 'cant read kannada', 'help my child', 'homework', 'pronunciation', 'transliteration', 'parents', 'not from karnataka', 'north indian'],
    reply: () => ({
      intent: 'parents',
      text: `Belesu guidebooks are made exactly for that! Every lesson has:\n• **Pronunciation in English letters**, so you can read Kannada aloud\n• **Line-by-line English translation**\n• **Lesson synopsis in English**\n• **All textbook exercises solved**\nSo even parents who don't know Kannada can help with homework and exam prep.`,
      chips: [CHIP.findBook, CHIP.samples],
    }),
  },
  {
    id: 'samples',
    chip: CHIP.samples,
    keywords: ['sample', 'preview', 'demo', 'look inside', 'see pages', 'inside pages', 'example page', 'video'],
    reply: () => ({
      intent: 'samples',
      text: `Each book page shows **sample pages** from inside the guide, and digital guidebooks include **free preview pages** in the reader. You can also watch how parents use the books in our video gallery.`,
      links: [
        { label: 'Browse books', href: '/books/' },
        { label: 'Video gallery', href: '/video-gallery/' },
      ],
      chips: [CHIP.findBook],
    }),
  },
  {
    id: 'contact',
    keywords: ['contact', 'phone number', 'mobile number', 'email', 'mail id', 'address', 'location', 'where are you', 'office', 'timing', 'working hours', 'hubballi', 'bangalore office', 'belgaum', 'belagavi'],
    reply: () => ({
      intent: 'contact',
      text: `• Phone / WhatsApp: **${SUPPORT_PHONE_DISPLAY}**\n• Email: **${SUPPORT_EMAIL}**\n• Hours: ${SUPPORT_HOURS}\n• Registered office: Deshpande Startups, Gokul Road, Hubballi – 580027\n• Bangalore office: #152, Sarjapur – Bagalur Road, Sarjapur – 562125\n• Operations: VRIF, VTU campus, Belagavi – 590018`,
      links: [human(), { label: 'Contact page', href: '/contact/' }],
    }),
  },
  {
    id: 'prices',
    chip: CHIP.prices,
    keywords: ['price', 'prices', 'cost', 'rate', 'how much', 'mrp', 'discount', 'offer', 'all books', 'catalogue', 'catalog', 'list of books', 'which books', 'books available', 'buy'],
    reply: (catalog) => {
      const lines = catalog.physical.map((b) => `• ${shortPhysicalTitle(b)}: **${rupees(b.price)}**`);
      const digitalLines = catalog.digital.map((d) => `• ${shortDigitalTitle(d)}: **${rupees(d.price)}**`);
      return {
        intent: 'prices',
        text: `**Printed guidebooks** (+ ${rupees(SHIPPING_FEE)} shipping per order):\n${lines.join('\n')}${
          digitalLines.length ? `\n\n**Digital guidebooks** (no shipping):\n${digitalLines.join('\n')}` : ''
        }\n\nTell me your child's class and I'll show the right book.`,
        links: [{ label: 'Shop all books', href: '/books/' }],
        chips: CLASS_CHIPS,
      };
    },
  },
  {
    id: 'about',
    keywords: ['about belesu', 'what is belesu', 'who are you', 'who made', 'author', 'publisher', 'company', 'team'],
    reply: () => ({
      intent: 'about',
      text: `**Belesu** (Kannada Mathadi, Kannada Belesi) publishes English-translated Kannada academic guidebooks that help students in Classes 1–6, and their parents, read, pronounce and understand Kannada easily.`,
      links: [
        { label: 'About us', href: '/about/' },
        { label: 'Parent reviews', href: '/reviews/' },
      ],
      chips: [CHIP.findBook, CHIP.prices],
    }),
  },
];

// ─── Small talk ─────────────────────────────────────────────────────────────
function smallTalk(norm: string, wordCount: number): BotReply | null {
  if (/\b(thank|thanks|thx|dhanyavada|dhanyavadagalu)/.test(norm)) {
    return {
      intent: 'thanks',
      text: "You're welcome! 😊 Is there anything else I can help you with?",
      chips: WELCOME_CHIPS.slice(0, 4),
    };
  }
  if (wordCount <= 4 && /\b(hi|hello|hey|hii+|namaskara|namaskar|namaste|good morning|good evening|good afternoon)\b/.test(norm)) {
    return {
      intent: 'greeting',
      text: 'Namaskara! 🙏 How can I help you today?',
      chips: WELCOME_CHIPS,
    };
  }
  if (wordCount <= 3 && /\b(ok|okay|fine|cool|great|nice|good)\b/.test(norm)) {
    return {
      intent: 'ack',
      text: 'Great! Anything else you would like to know?',
      chips: WELCOME_CHIPS.slice(0, 4),
    };
  }
  return null;
}

// ─── Public API ─────────────────────────────────────────────────────────────
export function welcomeReply(name?: string | null): BotReply {
  const first = name?.trim().split(/\s+/)[0];
  return {
    intent: 'welcome',
    text: `Namaskara${first ? `, **${first}**` : ''}! 🙏 I'm the Belesu guidebook assistant. I can help you find the right Kannada guidebook for your child, and answer questions about prices, delivery and orders.\nWhat would you like to know?`,
    chips: WELCOME_CHIPS,
  };
}

export function getBotReply(input: string, catalog: ChatCatalog): BotReply {
  const original = input.trim();
  const norm = normalize(original);
  const wordCount = norm.trim().split(' ').filter(Boolean).length;

  // 1. Exact chip click
  if (original === CHIP.findBook) return askClass();
  if (original === CHIP.saviVsKali) return saviVsKali();
  if (original === CHIP.siriVsTili) return siriVsTili();
  const chipIntent = INTENTS.find((i) => i.chip === original);
  if (chipIntent) return chipIntent.reply(catalog, original);

  // 2. Small talk
  const talk = smallTalk(norm, wordCount);
  if (talk) return talk;

  // 3. Book lookup by class / series. A bare number ("4") is read as a class.
  const grade = parseClass(norm) ?? (/^\s*\d{1,2}\s*$/.test(norm) ? Number(norm.trim()) : null);
  const series = parseSeries(norm);
  const wantsDigital = has(norm, DIGITAL_WORDS);
  const asksDifference = has(norm, ['difference', 'which one', 'or kali', 'or savi', 'or siri', 'or tili', 'confused', 'not sure']);

  if (asksDifference && (series.includes('Savi') || series.includes('Kali'))) return saviVsKali();
  if (asksDifference && (series.includes('Siri') || series.includes('Tili'))) return siriVsTili();

  // Service questions (delivery, returns, tracking…) win over book lookup,
  // e.g. "delivery time for class 4 book" should answer delivery.
  const scored = INTENTS.map((intent) => ({
    intent,
    score: intent.keywords.reduce((s, k) => (norm.includes(` ${k}`) ? s + (k.includes(' ') ? 3 : 1) : s), 0),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const SERVICE = new Set(['human', 'track', 'returns', 'delivery', 'payment', 'bulk', 'contact']);
  const top = scored[0];

  if (top && SERVICE.has(top.intent.id)) return top.intent.reply(catalog, original);
  if (grade !== null || series.length) {
    return bookFinder(catalog, grade, series, wantsDigital, original);
  }
  if (top) return top.intent.reply(catalog, original);

  // 4. Generic "book" questions
  if (has(norm, ['book', 'guide', 'guidebook', 'kannada'])) return askClass();

  // 5. Fallback → hand off to a human with the question pre-filled
  return {
    intent: 'fallback',
    text: `I'm not sure I understood that. Our team can answer it on WhatsApp (${SUPPORT_HOURS}), or you can pick a topic below.`,
    links: [human(original)],
    chips: WELCOME_CHIPS.slice(0, 5),
  };
}
