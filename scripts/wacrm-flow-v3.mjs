/**
 * Belesu WhatsApp bot — v3 flow set for the WACRM flow engine.
 *
 * Generates every v3 flow from ONE shared node library, validates each flow
 * with WACRM's own activation validator, and (optionally) writes them to
 * Supabase. Edit text here and re-run — do not hand-edit the generated flows
 * in the WACRM builder, or the next run will overwrite those edits.
 *
 * WHY SEVERAL FLOWS?
 *   WACRM has no in-flow keyword router: a keyword only decides which flow
 *   STARTS. To send "price" straight to the price list (and "track" straight
 *   to order tracking, etc.) each keyword group is its own small flow whose
 *   start node points into the shared library. When several active flows
 *   match, WACRM starts the OLDEST one (flows.created_at ascending), so this
 *   script sets created_at to encode priority: specific groups first, the
 *   "hi / menu" catch-all and first-message flows last.
 *
 * USAGE
 *   node scripts/wacrm-flow-v3.mjs                  dry run: build + validate + summary
 *   node scripts/wacrm-flow-v3.mjs --export=FILE    also write the generated flows as JSON
 *   node scripts/wacrm-flow-v3.mjs --apply          create/update all v3 flows as DRAFT
 *   node scripts/wacrm-flow-v3.mjs --activate       v3 flows -> active, legacy flow -> archived
 *   node scripts/wacrm-flow-v3.mjs --rollback       v3 flows -> draft,  legacy flow -> active
 *
 * ENV (.env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *                   WACRM_PATH (optional, default d:/wacrm) — used to load the validator
 */

import dotenv from 'dotenv';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { createJiti } from 'jiti';

dotenv.config({ path: '.env.local', quiet: true });

const args = new Set(process.argv.slice(2).filter((a) => !a.startsWith('--export=')));
const exportArg = process.argv.find((a) => a.startsWith('--export='));
const MODE = args.has('--apply') ? 'apply' : args.has('--activate') ? 'activate' : args.has('--rollback') ? 'rollback' : 'dry-run';

const ACCOUNT_ID = '7d87d718-75b1-4cda-8df5-1f2780f45cd7';
const LEGACY_FLOW_NAME = 'Belesu FAQ & Book Assistant';
const FLOW_PREFIX = 'Belesu v3 ·';
const WAITLIST_TAG_NAME = 'Tili 6 waitlist';
/** Fixed base so re-running keeps the same priority order. */
const PRIORITY_BASE = Date.parse('2026-11-24T00:00:00Z');

/* ═══════════════════════════════ CATALOG ═══════════════════════════════ */

const C = {
  phone: '9606636804',
  hours: 'Mon–Sat, 10 AM – 7 PM', // EDIT if team hours change
  allBooks: 'https://belesu.in/books/',
  dispatch: '4 PM',
  courier: 'DTDC',
  transit: '1–3 working days',
};

const BOOKS = {
  savi_1: { name: 'Savi Kannada – Class 1', price: 250, url: 'https://belesu.in/books/savi-kannada-class-1/' },
  savi_2: { name: 'Savi Kannada – Class 2', price: 260, url: 'https://belesu.in/books/savi-kannada-class-2/' },
  savi_3: { name: 'Savi Kannada – Class 3', price: 280, url: 'https://belesu.in/books/savi-kannada-class-3/' },
  savi_4: { name: 'Savi Kannada – Class 4', price: 280, url: 'https://belesu.in/books/savi-kannada-class-4/' },
  siri_5: { name: 'Siri Kannada – Class 5', price: 290, url: 'https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5/' },
  kali_1: { name: 'Kali Kannada – Class 1', price: 280, url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1/' },
  kali_2: { name: 'Kali Kannada – Class 2', price: 290, url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2/' },
  kali_3: { name: 'Kali Kannada – Class 3', price: 290, url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3/' },
  kali_4: { name: 'Kali Kannada – Class 4', price: 295, url: 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4/' },
  tili_5: { name: 'Tili Kannada – Class 5', price: 295, url: 'https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5/' },
};

const SIRI6 = {
  url: 'https://belesu.in/digital/kannada-class-6-guide/',
  preview: 'https://belesu.in/reader/kannada-class-6-guide?preview=true',
};
const SPEAK = { url: 'https://belesu.in/books/a-destination-to-speak-kannada/' };

/* ═══════════════════════════════ NODE HELPERS ═══════════════════════════════ */

const send = (key, text, next) => ({ node_key: key, node_type: 'send_message', config: { text, next_node_key: next } });

const buttons = (key, { header, text, footer, options }) => ({
  node_key: key,
  node_type: 'send_buttons',
  config: {
    ...(header ? { header_text: header } : {}),
    text,
    ...(footer ? { footer_text: footer } : {}),
    buttons: options.map(([reply_id, title, next_node_key]) => ({ reply_id, title, next_node_key })),
  },
});

const list = (key, { header, text, footer, button, sections }) => ({
  node_key: key,
  node_type: 'send_list',
  config: {
    ...(header ? { header_text: header } : {}),
    text,
    ...(footer ? { footer_text: footer } : {}),
    button_label: button,
    sections: sections.map(([title, rows]) => ({
      title,
      rows: rows.map(([reply_id, rowTitle, description, next_node_key]) => ({
        reply_id,
        title: rowTitle,
        ...(description ? { description } : {}),
        next_node_key,
      })),
    })),
  },
});

const handoff = (key, note) => ({ node_key: key, node_type: 'handoff', config: { note } });

/** Shared buttons under every book card */
const AFTER_BOOK = [
  ['bk_order', 'How to order', 'how_to_order'],
  ['bk_delivery', 'Delivery time', 'delivery_payment'],
  ['bk_menu', 'Main menu', 'main_menu'],
];

/* ═══════════════════════════════ NODE LIBRARY ═══════════════════════════════ */

function buildLibrary(waitlistTagId) {
  const nodes = [
    /* ── Main menu ── */
    list('main_menu', {
      header: 'Belesu Books 📚',
      text: 'Namaskara 🙏\nWe help children understand their school Kannada textbook in English.\n\nPlease choose an option 👇',
      footer: 'Type *menu* anytime to start again',
      button: 'Choose option',
      sections: [
        ['School Kannada books', [
          ['m_buy', 'Buy book (Class 1–6)', 'Savi, Kali, Siri, Tili guidebooks', 'class_picker'],
          ['m_prices', 'Price list', 'Books from ₹250 to ₹295', 'price_list'],
          ['m_choose', 'Which book do I need?', 'We help you pick the right one', 'not_sure'],
        ]],
        ['New', [
          ['m_speak', 'Learn to speak Kannada', 'New book for beginners & adults', 'speak_kannada'],
        ]],
        ['Help', [
          ['m_delivery', 'Delivery & payment', 'We ship worldwide 🌍 · how to pay', 'delivery_payment'],
          ['m_track', 'Track my order', 'Already ordered? Check status', 'track_order'],
          ['m_agent', 'Talk to our team', 'Chat with a person', 'talk_to_team'],
        ]],
      ],
    }),

    /* ── Class picker ── */
    list('class_picker', {
      text: 'Which class is your child in?',
      button: 'Select class',
      sections: [
        ['Class', [
          ['cls_1', 'Class 1', null, 'variant_c1'],
          ['cls_2', 'Class 2', null, 'variant_c2'],
          ['cls_3', 'Class 3', null, 'variant_c3'],
          ['cls_4', 'Class 4', null, 'variant_c4'],
          ['cls_5', 'Class 5', null, 'variant_c5'],
          ['cls_6', 'Class 6', 'Siri – digital book, print at home', 'class6'],
          ['cls_7', 'Class 7 and above', 'Coming soon', 'not_yet_class'],
        ]],
      ],
    }),

    /* ── Series picker per class (no per-parent memory in WACRM → one node per class) ── */
    ...[1, 2, 3, 4].map((n) =>
      buttons(`variant_c${n}`, {
        text: `Class ${n} 👍\nWhich Kannada textbook does the school give?\n\nIt is written on the cover: *Savi* or *Kali*.`,
        options: [
          [`c${n}_savi`, 'Savi Kannada', `book_savi_${n}`],
          [`c${n}_kali`, 'Kali Kannada', `book_kali_${n}`],
          [`c${n}_not_sure`, 'Not sure', 'not_sure'],
        ],
      })
    ),
    buttons('variant_c5', {
      text: 'Class 5 👍\nWhich Kannada textbook does the school give?\n\nIt is written on the cover: *Siri* or *Tili*.',
      options: [
        ['c5_siri', 'Siri Kannada', 'book_siri_5'],
        ['c5_tili', 'Tili Kannada', 'book_tili_5'],
        ['c5_not_sure', 'Not sure', 'not_sure'],
      ],
    }),

    /* ── Book cards (link in body: WACRM has no cta_url node; WhatsApp auto-links URLs) ── */
    ...Object.entries(BOOKS).map(([key, b]) =>
      buttons(`book_${key}`, {
        header: b.name,
        text:
          `📘 English translation of your school textbook\n✔ Kannada text also included\n✔ Part 1 + Part 2 in one book\n\n` +
          `Price: *₹${b.price}*\n\n👉 See sample pages & order:\n${b.url}`,
        footer: 'Online payment only (UPI / card)',
        options: AFTER_BOOK,
      })
    ),

    /* ── Class 6 ── */
    buttons('class6', {
      text: '*Class 6 this year*\n\n✅ *Siri Kannada* – digital book: read online, or print / save as PDF\n⏳ *Tili Kannada* – coming next year\n\nWhich textbook does the school give?',
      options: [
        ['c6_siri', 'Siri Kannada', 'siri6_digital'],
        ['c6_tili', 'Tili Kannada', 'tili6_coming'],
        ['c6_not_sure', 'Not sure', 'not_sure'],
      ],
    }),
    buttons('siri6_digital', {
      header: 'Siri Kannada – Class 6',
      text:
        '📱 Read online on phone, tablet or computer\n🖨️ Print at home – or choose *Save as PDF* in the print screen\n' +
        '✔ English translation + Kannada text\n✔ Part 1 + Part 2 (180 pages)\n✔ One-time payment, lifetime access\n\n' +
        'Price: *₹295* (MRP ₹349)\n\n' +
        `👀 See 5 pages free:\n${SIRI6.preview}\n\n👉 Buy now:\n${SIRI6.url}\n\n` +
        'After payment the book opens right away. Later, log in on belesu.in with your phone number and open *My Library* → *Print Book*.',
      footer: 'No courier – get it instantly',
      options: [
        ['s6_team', 'Talk to our team', 'talk_to_team'],
        ['s6_menu', 'Main menu', 'main_menu'],
      ],
    }),
    buttons('tili6_coming', {
      text: 'Sorry 🙏 Tili Kannada Class 6 is coming *next year*.\n\nShall we send you a message here when it is ready?',
      options: [
        ['t6_yes', 'Yes, tell me', 'tili6_tag'],
        ['t6_menu', 'Main menu', 'main_menu'],
      ],
    }),
    {
      node_key: 'tili6_tag',
      node_type: 'set_tag',
      config: { mode: 'add', tag_id: waitlistTagId, next_node_key: 'tili6_saved' },
    },
    send('tili6_saved', 'Done ✅ We will message you here when Tili Kannada Class 6 is ready.', 'end'),

    /* ── New book ── */
    buttons('speak_kannada', {
      header: '🆕 A Destination to Speak Kannada',
      text:
        'Our new book to *speak Kannada in daily life*.\n\n' +
        '👤 For beginners – students, working people and families new to Karnataka\n' +
        '📖 23 easy chapters: greetings, family, numbers, travel (auto, bus, metro), shopping, food and more\n' +
        '🔤 Basics: gunithakshara and tenses\n\n' +
        `Price: *₹295* (MRP ₹350) · Printed book\n\n👉 See book & order:\n${SPEAK.url}`,
      footer: 'Great gift for friends & colleagues',
      options: AFTER_BOOK,
    }),

    /* ── Helping parents choose (photo → team; hand off BEFORE the photo arrives) ── */
    buttons('not_sure', {
      text:
        "No problem 😊 We'll help you pick the right book.\n\nDo you have your child's Kannada *school textbook* with you?\n\n" +
        'Tip: Kali is a little easier than Savi, but most schools use Savi.',
      options: [
        ['ns_have', 'Yes, I have it', 'cover_photo_ask'],
        ['ns_none', 'No textbook yet', 'no_textbook_yet'],
        ['ns_team', 'Talk to our team', 'talk_to_team'],
      ],
    }),
    send(
      'cover_photo_ask',
      `Great 👍 Please send a *photo of the front cover* of the textbook now.\n\nOur team will check it and send you the right book link here (${C.hours}).`,
      'handoff_cover'
    ),
    handoff('handoff_cover', 'Parent is sending a textbook cover photo — reply with the matching book link.'),
    buttons('no_textbook_yet', {
      text:
        'The school usually gives the textbook (they get it from the Government).\n\n' +
        'You can buy our book now – it has the *Kannada text too*, so your child can start learning until the school textbook arrives.\n\n' +
        'Please ask the class teacher: *Savi or Kali?* (Class 5–6: *Siri or Tili?*)',
      options: [
        ['nt_buy', 'Buy a book', 'class_picker'],
        ['nt_team', 'Talk to our team', 'talk_to_team'],
      ],
    }),

    /* ── Prices, ordering, delivery ── */
    send(
      'price_list',
      '*Belesu Books – Prices* 📚\n\n' +
        '*Savi / Siri*\nClass 1 – ₹250\nClass 2 – ₹260\nClass 3 – ₹280\nClass 4 – ₹280\nClass 5 (Siri) – ₹290\nClass 6 (Siri, digital) – ₹295\n\n' +
        '*Kali / Tili*\nClass 1 – ₹280\nClass 2 – ₹290\nClass 3 – ₹290\nClass 4 – ₹295\nClass 5 (Tili) – ₹295\nClass 6 (Tili) – next year\n\n' +
        '*New:* Speak Kannada book – ₹295\n\n✔ One book = Part 1 + Part 2',
      'class_picker'
    ),
    send(
      'how_to_order',
      'How to order – 4 easy steps 😊\n\n1️⃣ Open the book link we sent\n2️⃣ Tap *Add to cart*\n3️⃣ Enter your full delivery address\n4️⃣ Pay online (UPI or card)\n\n' +
        `That's it! We dispatch every day at ${C.dispatch}.\n\nAll books: ${C.allBooks}\n\nType *menu* to see more options.`,
      'end'
    ),
    buttons('delivery_payment', {
      text:
        '🚚 *Delivery – all over the world* 🌍\n' +
        `Order before ${C.dispatch} → we ship the *same day*. After ${C.dispatch} → next working day.\n` +
        `🇮🇳 India: ${C.courier}, *${C.transit}*\n✈️ Outside India: tap *Outside India* below\n\n` +
        '📱 Class 6 Siri is digital – read or print it from any country. No delivery needed.\n\n' +
        "💳 *Payment*\nOnline only: UPI or card.\nSorry, no Cash on Delivery – most parents order once a year, so COD doesn't work for us.",
      options: [
        ['dp_intl', 'Outside India', 'international'],
        ['dp_order', 'How to order', 'how_to_order'],
        ['dp_buy', 'Buy a book', 'class_picker'],
      ],
    }),
    send(
      'international',
      'Yes 😊 We deliver all over the world 🌍\n\nPlease tell us:\n1️⃣ Your country and city\n2️⃣ Which book(s) you need\n\n' +
        `Our team will reply with the delivery time and shipping cost (${C.hours}).\n\n` +
        `Tip: Class 6 Siri is digital – buy it from any country and start right away:\n${SIRI6.url}`,
      'handoff_international'
    ),
    handoff('handoff_international', 'International delivery enquiry — reply with delivery time and shipping cost.'),

    /* ── Order tracking ── */
    {
      node_key: 'track_order',
      node_type: 'collect_input',
      config: {
        prompt_text: 'Please send your *order number* (it is in your order email / SMS). We will check and tell you.',
        var_key: 'order_number',
        next_node_key: 'track_ack',
      },
    },
    send('track_ack', `Thank you 🙏 Our team will check order *{{vars.order_number}}* and reply here soon (${C.hours}).`, 'handoff_track'),
    handoff('handoff_track', 'Order status enquiry — order number is in the chat / run vars.order_number.'),

    /* ── Short answers ── */
    send(
      'not_yet_class',
      'Sorry 🙏 This year we have books for Class 1 to 6 only.\nClass 7 and above are coming soon.\n\nType *menu* to see our books.',
      'end'
    ),
    send('not_available', 'Sorry 🙏 We only make Kannada books with English translation.\n\nType *menu* to see them.', 'end'),
    send(
      'thanks',
      'Welcome 🙏\n\nIf you like Belesu Books, please share it with other parents. It helps more children learn Kannada with confidence 💛',
      'end'
    ),

    /* ── Human handoff ── */
    send('talk_to_team', `Sure 🙏 Our team will reply here soon (${C.hours}).\nOr call us: ${C.phone}`, 'handoff_team'),
    handoff('handoff_team', 'Parent asked to talk to the team.'),

    { node_key: 'end', node_type: 'end', config: {} },
  ];

  return new Map(nodes.map((n) => [n.node_key, n]));
}

/* ═══════════════════════════════ FLOWS (priority order) ═══════════════════════════════ */

/**
 * Order = priority. WACRM starts the oldest matching active flow, so specific
 * phrases come first and the "hi" catch-all + first-message flows come last.
 * Keywords are lowercase "contains" matches — keep them specific; short words
 * match inside longer ones (e.g. "cod" would match "pincode").
 */
const FLOWS = [
  {
    slug: 'Track order',
    entry: 'track_order',
    keywords: ['track', 'where is my order', 'not received', 'not yet received', 'order status', 'status of my order', 'not delivered', "didn't receive", 'did not receive'],
  },
  {
    slug: 'No textbook yet',
    entry: 'no_textbook_yet',
    keywords: ['no textbook', 'no text book', 'not given', "didn't give", 'did not give', 'not yet given', 'textbook not'],
  },
  {
    slug: 'International',
    entry: 'international',
    keywords: ['abroad', 'international', 'outside india', 'overseas', 'other country', 'usa', 'america', ' uk', 'london', 'canada', 'australia', 'new zealand', 'dubai', 'uae', 'qatar', 'kuwait', 'saudi', 'singapore', 'germany'],
  },
  {
    slug: 'Delivery & payment',
    entry: 'delivery_payment',
    keywords: ['cash on delivery', 'cod?', 'cod available', 'cod option', 'is cod', 'cash', 'gpay', 'google pay', 'phonepe', 'upi', 'payment', 'pay online', 'how to pay', 'ship', 'deliver', 'courier', 'dtdc', 'dispatch', 'when will', 'how many days'],
  },
  {
    slug: 'Talk to team',
    entry: 'talk_to_team',
    keywords: ['agent', 'human', 'talk to', 'speak to', 'call me', 'call back', 'callback', 'customer care', 'real person'],
  },
  {
    slug: 'Class 7 and above',
    entry: 'not_yet_class',
    keywords: ['class 7', 'class 8', 'class 9', 'class 10', ' 7th', ' 8th', ' 9th', ' 10th', '7th std', '8th std', '9th std', '10th std', '7th class', '8th class', '9th class', '10th class', 'grade 7', 'grade 8', 'grade 9', 'grade 10'],
  },
  {
    slug: 'Class 6',
    entry: 'class6',
    keywords: ['class 6', ' 6th', '6th std', '6th standard', '6th class', 'std 6', 'grade 6', 'pdf', 'digital', 'online book', 'read online', 'ebook', 'e-book'],
  },
  {
    slug: 'Speak Kannada',
    entry: 'speak_kannada',
    keywords: ['speak', 'spoken', 'learn kannada', 'adult', 'destination', 'new book', 'conversation'],
  },
  {
    slug: 'Price list',
    entry: 'price_list',
    keywords: ['price', 'cost', 'how much', ' rate', 'rate?', 'mrp', 'rupees'],
  },
  // Other subjects + Thanks sit ABOVE "Buy a book" because that flow matches the very common
  // words "book" / "guide" ("Hindi book?", "Received the book, thanks").
  {
    slug: 'Other subjects',
    entry: 'not_available',
    keywords: ['hindi', 'maths', 'mathematics', 'math book', 'science', 'social', 'evs', 'other subject'],
  },
  {
    slug: 'Thanks',
    entry: 'thanks',
    keywords: ['thank', 'thx', 'received', 'got it', 'got the book', 'dhanyavad'],
  },
  {
    slug: 'Buy a book',
    entry: 'class_picker',
    keywords: ['savi', 'kali', 'siri', 'tili', 'buy', 'order', 'book', 'class', 'guide', 'std', 'standard', 'grade'],
  },
  {
    slug: 'Main menu',
    entry: 'main_menu',
    // "hi" as a contains-match also catches many unmatched questions ("which…", "this…") → menu,
    // which is the template's FALLBACK behaviour for anything the other flows don't recognise.
    keywords: ['hi', 'hello', 'hey', 'hai', 'menu', 'start', 'namaskara', 'namaskar', 'namaste', 'belesu', 'help', 'support', 'info'],
  },
  {
    slug: 'First message',
    entry: 'main_menu',
    trigger_type: 'first_inbound_message',
  },
];

/**
 * Fallback (WACRM supports reprompt/handoff only — no "sorry + menu" message):
 *   1st unrecognised reply → re-send the same buttons/list
 *   2nd                    → hand off to the team
 * Short timeout so a parent who walks away isn't stuck in an old run — while a run
 * is active, typed keywords like "menu" are treated as unknown replies.
 */
const FALLBACK_POLICY = { on_unknown_reply: 'reprompt', max_reprompts: 1, on_exhaust: 'handoff', on_timeout_hours: 2 };

/* ═══════════════════════════════ BUILD ═══════════════════════════════ */

function outgoing(node) {
  const c = node.config;
  const keys = [];
  if (c.next_node_key) keys.push(c.next_node_key);
  for (const b of c.buttons || []) keys.push(b.next_node_key);
  for (const s of c.sections || []) for (const r of s.rows) keys.push(r.next_node_key);
  return keys;
}

/** Only the nodes reachable from this flow's entry (WACRM warns on unreachable nodes). */
function buildFlowNodes(library, entry) {
  const start = { node_key: 'start', node_type: 'start', config: { next_node_key: entry } };
  const all = new Map([['start', start], ...library]);
  const depth = new Map([['start', 0]]);
  const order = ['start'];
  for (let i = 0; i < order.length; i++) {
    const node = all.get(order[i]);
    if (!node) throw new Error(`Missing node "${order[i]}"`);
    for (const next of outgoing(node)) {
      if (!depth.has(next)) {
        depth.set(next, depth.get(order[i]) + 1);
        order.push(next);
      }
    }
  }
  // Simple left-to-right layout by BFS depth for the WACRM canvas
  const rowAtDepth = new Map();
  return order.map((key) => {
    const d = depth.get(key);
    const row = rowAtDepth.get(d) || 0;
    rowAtDepth.set(d, row + 1);
    return { ...all.get(key), position_x: 100 + d * 380, position_y: 100 + row * 240 };
  });
}

function buildFlows(waitlistTagId) {
  const library = buildLibrary(waitlistTagId);
  return FLOWS.map((f, i) => {
    const trigger_type = f.trigger_type || 'keyword';
    return {
      name: `${FLOW_PREFIX} ${String(i + 1).padStart(2, '0')} ${f.slug}`,
      description: `Belesu bot v3 — ${trigger_type === 'keyword' ? `keywords → ${f.entry}` : 'first message from a new contact → main menu'}. Generated by scripts/wacrm-flow-v3.mjs; edit the script, not this flow.`,
      trigger_type,
      trigger_config: trigger_type === 'keyword' ? { keywords: f.keywords, match_type: 'contains' } : {},
      entry_node_id: 'start',
      fallback_policy: FALLBACK_POLICY,
      created_at: new Date(PRIORITY_BASE + i * 1000).toISOString(),
      nodes: buildFlowNodes(library, f.entry),
    };
  });
}

async function loadWacrmValidator() {
  const wacrm = process.env.WACRM_PATH || 'd:/wacrm';
  const jiti = createJiti(pathToFileURL(path.resolve('package.json')).href, {
    alias: { '@': path.join(wacrm, 'src') },
  });
  const mod = await jiti.import(path.join(wacrm, 'src/lib/flows/validate.ts'));
  return mod.validateFlowForActivation;
}

function validateAll(flows, validate) {
  let errors = 0;
  for (const f of flows) {
    const issues = validate(f, f.nodes);
    for (const issue of issues) {
      if (issue.severity === 'error') errors++;
      console.log(`  ${issue.severity.toUpperCase()} [${f.name}] ${issue.node_key || issue.scope}${issue.field ? '.' + issue.field : ''}: ${issue.message}`);
    }
  }
  return errors;
}

/* ═══════════════════════════════ SUPABASE ═══════════════════════════════ */

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function getLegacyFlow(sb) {
  const { data, error } = await sb.from('flows').select('id, user_id, status').eq('account_id', ACCOUNT_ID).eq('name', LEGACY_FLOW_NAME).maybeSingle();
  if (error) throw error;
  return data;
}

async function getV3Flows(sb) {
  const { data, error } = await sb.from('flows').select('id, name, status').eq('account_id', ACCOUNT_ID).like('name', `${FLOW_PREFIX}%`);
  if (error) throw error;
  return data || [];
}

async function ensureWaitlistTag(sb, userId) {
  const { data: existing, error } = await sb.from('tags').select('id').eq('account_id', ACCOUNT_ID).eq('name', WAITLIST_TAG_NAME).maybeSingle();
  if (error) throw error;
  if (existing) return existing.id;
  const { data, error: insErr } = await sb
    .from('tags')
    .insert({ account_id: ACCOUNT_ID, user_id: userId, name: WAITLIST_TAG_NAME, color: '#f59e0b' })
    .select('id')
    .single();
  if (insErr) throw insErr;
  console.log(`  created tag "${WAITLIST_TAG_NAME}"`);
  return data.id;
}

async function applyFlows(sb, flows, userId) {
  const existing = new Map((await getV3Flows(sb)).map((f) => [f.name, f]));
  for (const f of flows) {
    const { nodes, ...header } = f;
    const row = { ...header, account_id: ACCOUNT_ID, user_id: userId, updated_at: new Date().toISOString() };
    let flowId;
    const prev = existing.get(f.name);
    if (prev) {
      if (prev.status === 'active') console.log(`  ⚠ "${f.name}" is ACTIVE — nodes are replaced live`);
      const { error } = await sb.from('flows').update(row).eq('id', prev.id);
      if (error) throw error;
      flowId = prev.id;
    } else {
      const { data, error } = await sb.from('flows').insert({ ...row, status: 'draft' }).select('id').single();
      if (error) throw error;
      flowId = data.id;
    }
    const { error: delErr } = await sb.from('flow_nodes').delete().eq('flow_id', flowId);
    if (delErr) throw delErr;
    const { error: insErr } = await sb.from('flow_nodes').insert(nodes.map((n) => ({ ...n, flow_id: flowId })));
    if (insErr) throw insErr;
    console.log(`  ${prev ? 'updated' : 'created'} ${f.name} (${nodes.length} nodes)`);
  }
}

async function setStatuses(sb, v3Status, legacyStatus) {
  const v3 = await getV3Flows(sb);
  if (v3.length !== FLOWS.length) throw new Error(`Expected ${FLOWS.length} v3 flows in the database, found ${v3.length}. Run --apply first.`);
  const { error } = await sb.from('flows').update({ status: v3Status, updated_at: new Date().toISOString() }).in('id', v3.map((f) => f.id));
  if (error) throw error;
  const legacy = await getLegacyFlow(sb);
  if (legacy) {
    const { error: lErr } = await sb.from('flows').update({ status: legacyStatus, updated_at: new Date().toISOString() }).eq('id', legacy.id);
    if (lErr) throw lErr;
  }
  console.log(`  ${v3.length} v3 flows → ${v3Status}; "${LEGACY_FLOW_NAME}" → ${legacy ? legacyStatus : '(not found)'}`);
}

/* ═══════════════════════════════ MAIN ═══════════════════════════════ */

async function main() {
  console.log(`Mode: ${MODE}`);
  const validate = await loadWacrmValidator();

  if (MODE === 'activate' || MODE === 'rollback') {
    const sb = db();
    // Re-validate what is actually stored before going live
    if (MODE === 'activate') {
      const stored = await getV3Flows(sb);
      for (const f of stored) {
        const { data: full } = await sb.from('flows').select('*').eq('id', f.id).single();
        const { data: nodes } = await sb.from('flow_nodes').select('node_key, node_type, config').eq('flow_id', f.id);
        const issues = validate(full, nodes || []).filter((i) => i.severity === 'error');
        if (issues.length) throw new Error(`"${f.name}" fails WACRM validation: ${issues.map((i) => i.message).join('; ')}`);
      }
      await setStatuses(sb, 'active', 'archived');
    } else {
      await setStatuses(sb, 'draft', 'active');
    }
    return;
  }

  let sb = null;
  let userId = null;
  let tagId = '00000000-0000-0000-0000-000000000000'; // placeholder for dry runs
  if (MODE === 'apply') {
    sb = db();
    const legacy = await getLegacyFlow(sb);
    if (!legacy) throw new Error(`Legacy flow "${LEGACY_FLOW_NAME}" not found — needed for the account owner user_id`);
    userId = legacy.user_id;
    tagId = await ensureWaitlistTag(sb, userId);
  }

  const flows = buildFlows(tagId);
  const errors = validateAll(flows, validate);

  console.log(`\n${flows.length} flows (priority order — oldest matching active flow wins):`);
  for (const f of flows) {
    const trig = f.trigger_type === 'keyword' ? `${f.trigger_config.keywords.length} keywords` : f.trigger_type;
    console.log(`  ${f.name.padEnd(36)} ${String(f.nodes.length).padStart(2)} nodes · ${trig}`);
  }
  if (exportArg) {
    const file = exportArg.slice('--export='.length);
    writeFileSync(file, JSON.stringify(flows, null, 2));
    console.log(`\nExported to ${file}`);
  }
  if (errors > 0) throw new Error(`${errors} validation error(s) — nothing written`);
  console.log('\nWACRM validation: PASS');

  if (MODE === 'apply') {
    console.log('\nWriting flows as DRAFT…');
    await applyFlows(sb, flows, userId);
    console.log('\nDone. Review them in WACRM → Flows, then run with --activate.');
  }
}

main().catch((err) => {
  console.error('\nFAILED:', err.message || err);
  process.exit(1);
});
