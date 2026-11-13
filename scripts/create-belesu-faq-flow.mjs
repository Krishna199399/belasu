import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = 'https://sjqccpysjxkmnfttoqgf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I';

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ACCOUNT_ID = '7d87d718-75b1-4cda-8df5-1f2780f45cd7';
const USER_ID = '3cf5738d-05da-4118-a733-f08a943b9fb6';
const NEW_FLOW_ID = crypto.randomUUID();

const flowData = {
  id: NEW_FLOW_ID,
  account_id: ACCOUNT_ID,
  user_id: USER_ID,
  name: 'Belesu FAQ & Book Assistant',
  description: 'Complete automated assistant for Belesu: Grades 1-5 Savi/Kali/Siri/Tili books, prices, shipping, COD policy, and book identification.',
  status: 'draft', // Stored strictly as DRAFT per user request
  trigger_type: 'keyword',
  trigger_config: {
    keywords: ['hi', 'hello', 'price', 'books', 'savi', 'kali', 'siri', 'tili', 'delivery', 'order', 'cod', 'belesu', 'namaskara'],
    match_type: 'contains',
  },
  entry_node_id: 'start',
  fallback_policy: {
    max_reprompts: 2,
    on_exhaust: 'handoff',
    on_timeout_hours: 24,
    on_unknown_reply: 'reprompt',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const nodes = [
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'start',
    node_type: 'start',
    config: { next_node_key: 'welcome_menu' },
    position_x: 100,
    position_y: 350,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'welcome_menu',
    node_type: 'send_list',
    config: {
      text: 'Namaskara! 🙏 Welcome to Belesu (ಬೆಳೆಸು).\nKannada Mathadi, Kannada Belesi! ❤️\n\nWe provide English-translated Kannada academic guidebooks and learning resources.\n\nPlease choose an option from the menu below:',
      button_label: 'Tap to Choose',
      sections: [
        {
          title: '📚 Books & Guides',
          rows: [
            {
              reply_id: 'row_grades',
              title: 'Class 1 to 5 Books',
              description: 'Browse Savi, Kali, Siri and Tili guidebooks',
              next_node_key: 'grade_picker',
            },
            {
              reply_id: 'row_destination',
              title: 'Destination to Speak',
              description: 'Spoken Kannada for daily situations',
              next_node_key: 'destination_info',
            },
            {
              reply_id: 'row_photo',
              title: 'Identify My Textbook',
              description: 'Not sure? Share cover photo for guidance',
              next_node_key: 'photo_guide',
            },
            {
              reply_id: 'row_prices',
              title: 'Complete Price List',
              description: 'Prices from ₹250 to ₹295 for all classes',
              next_node_key: 'price_list',
            },
          ],
        },
        {
          title: '📦 Orders & Delivery',
          rows: [
            {
              reply_id: 'row_shipping',
              title: 'Shipping & Delivery',
              description: 'Dispatched at 7 PM, reaches in 1-3 days',
              next_node_key: 'shipping_info',
            },
            {
              reply_id: 'row_cod',
              title: 'Payment & COD Policy',
              description: 'Why prepaid only (UPI, GPay, Cards)',
              next_node_key: 'cod_info',
            },
            {
              reply_id: 'row_class6',
              title: 'Class 6 Release Info',
              description: 'Siri (mid-Aug) & Tili (late Oct) updates',
              next_node_key: 'class6_info',
            },
          ],
        },
        {
          title: '💬 Support',
          rows: [
            {
              reply_id: 'row_support',
              title: 'Talk to Belesu Team',
              description: 'Chat directly with our team',
              next_node_key: 'live_support',
            },
          ],
        },
      ],
    },
    position_x: 450,
    position_y: 300,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'grade_picker',
    node_type: 'send_buttons',
    config: {
      text: 'Which grade are you looking for?\n\n💡 Note: All Belesu guidebooks cover both Part 1 and Part 2 in a single book!',
      footer_text: 'Select grade group',
      buttons: [
        { reply_id: 'btn_c1_c3', title: '📚 Class 1 to 3', next_node_key: 'select_c1_c3' },
        { reply_id: 'btn_c4_c5', title: '📚 Class 4 & 5', next_node_key: 'select_c4_c5' },
        { reply_id: 'btn_menu', title: '🔙 Back to Menu', next_node_key: 'welcome_menu' },
      ],
    },
    position_x: 880,
    position_y: 100,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'select_c1_c3',
    node_type: 'send_buttons',
    config: {
      text: '📚 *Class 1 to 3 Belesu Guidebooks:*\n\n🔹 *Class 1:*\n• Savi (₹250): https://belesu.in/shop/books/savi-kannada-class-1/\n• Kali (₹280): https://belesu.in/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-1/\n\n🔹 *Class 2:*\n• Savi (₹260): https://belesu.in/shop/books/savi-kannada-class-2/\n• Kali (₹290): https://belesu.in/shop/books/kali-kannada-english-translated-innovative-guidebook-class-2/\n\n🔹 *Class 3:*\n• Savi (₹280): https://belesu.in/shop/books/savi-kannada-class-3/\n• Kali (₹290): https://belesu.in/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-3/\n\n✨ *Each book includes Kannada text + line-by-line English translation!*',
      footer_text: 'Both Part 1 & 2 in single book',
      buttons: [
        { reply_id: 'btn_c13_order', title: '📦 How to Order', next_node_key: 'order_steps' },
        { reply_id: 'btn_c13_photo', title: '📷 Not Sure of Book?', next_node_key: 'photo_guide' },
        { reply_id: 'btn_c13_menu', title: '🔙 Main Menu', next_node_key: 'welcome_menu' },
      ],
    },
    position_x: 1280,
    position_y: 0,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'select_c4_c5',
    node_type: 'send_buttons',
    config: {
      text: '📚 *Class 4 & 5 Belesu Guidebooks:*\n\n🔹 *Class 4:*\n• Savi (₹280): https://belesu.in/shop/books/savi-kannada-class-4/\n• Kali (₹295): https://belesu.in/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-4/\n\n🔹 *Class 5:*\n• Siri (₹290): https://belesu.in/product-category/siri/\n• Tili (₹295): https://belesu.in/product-category/tili/\n\n✨ *Our same single book covers both Part 1 and Part 2 together!*',
      footer_text: 'Both Part 1 & 2 in single book',
      buttons: [
        { reply_id: 'btn_c45_order', title: '📦 How to Order', next_node_key: 'order_steps' },
        { reply_id: 'btn_c45_photo', title: '📷 Not Sure of Book?', next_node_key: 'photo_guide' },
        { reply_id: 'btn_c45_menu', title: '🔙 Main Menu', next_node_key: 'welcome_menu' },
      ],
    },
    position_x: 1280,
    position_y: 200,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'destination_info',
    node_type: 'send_message',
    config: {
      text: '📖 *A Destination to Speak Kannada:*\n\nAn innovative, pictorially designed conversational resource for everyday Kannada situations:\n🛺 Auto Rides & Metro\n🥦 Vegetable Markets & Grocery Stores\n🥐 Bakeries & Darshini Restaurants\n🏛️ Government Offices & Banks\n🚌 Bus Travel & Neighborhoods\n\n👉 *Order here:*\nhttps://belesu.in/books/a-destination-to-speak-kannada/',
      next_node_key: 'post_action_buttons',
    },
    position_x: 880,
    position_y: 350,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'photo_guide',
    node_type: 'send_message',
    config: {
      text: "📷 *Need Help Identifying Your Child's Textbook?*\n\nIn Karnataka schools:\n• *Savi / Siri:* Standard 1st Language Kannada curriculum.\n• *Kali / Tili:* Designed to be simpler, often for 2nd or 3rd Language students.\n\n👉 *Please send a photo of your school textbook cover right here in this chat!*\nOur team will inspect it and send you the exact matching Belesu guidebook link. 😊",
      next_node_key: 'agent_handoff_cover',
    },
    position_x: 880,
    position_y: 550,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'agent_handoff_cover',
    node_type: 'handoff',
    config: {
      note: 'Customer requested help identifying their school textbook. Waiting for cover photo.',
    },
    position_x: 1280,
    position_y: 550,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'price_list',
    node_type: 'send_message',
    config: {
      text: '🏷️ *Belesu Books Official Price List:*\n\n📖 *Savi & Siri Series:*\n• Class 1 — ₹250\n• Class 2 — ₹260\n• Class 3 — ₹280\n• Class 4 — ₹280\n• Siri Class 5 — ₹290\n\n📖 *Kali & Tili Series:*\n• Kali Class 1 — ₹280\n• Kali Class 2 — ₹290\n• Kali Class 3 — ₹290\n• Kali Class 4 — ₹295\n• Tili Class 5 — ₹295\n\n💡 *Key Benefits:*\n✅ Includes *both Part 1 and Part 2* in a single book!\n✅ English translation alongside Kannada lessons for easy home revision.',
      next_node_key: 'post_action_buttons',
    },
    position_x: 880,
    position_y: 750,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'shipping_info',
    node_type: 'send_message',
    config: {
      text: '🚚 *Shipping & Courier Schedule:*\n\n• *Daily Dispatch:* Orders placed before cut-off are shipped *today at 7:00 PM* (otherwise next business day at 7:00 PM).\n• *Delivery Time:* *1 to 3 business days* across Karnataka & major Indian cities.\n• *Courier Partners:* DTDC, Delhivery, and ST Courier.\n• *Tracking:* Tracking link is sent automatically via SMS & Email upon dispatch.',
      next_node_key: 'post_action_buttons',
    },
    position_x: 880,
    position_y: 950,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'cod_info',
    node_type: 'send_message',
    config: {
      text: '💳 *Payment & Cash on Delivery (COD) Policy:*\n\n• *COD is not available:* Because parents purchase academic books once a year at term start, courier COD return rates make it unsustainable for academic publishing.\n• *100% Safe Online Payment:* We accept UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking on our secure SSL-certified store: https://belesu.in.',
      next_node_key: 'post_action_buttons',
    },
    position_x: 880,
    position_y: 1150,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'class6_info',
    node_type: 'send_message',
    config: {
      text: '📚 *Class 6 Kannada Guidebooks Update:*\n\nCurrently, we have Class 1 to Class 5 ready in stock.\n\nFor *Class 6*:\n• *Siri Kannada Class 6:* Publishing by *Mid-August*.\n• *Tili Kannada Class 6:* Publishing by *End of October*.\n\nReply here with your contact number if you would like us to notify you as soon as Class 6 is released!',
      next_node_key: 'post_action_buttons',
    },
    position_x: 880,
    position_y: 1350,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'order_steps',
    node_type: 'send_message',
    config: {
      text: '🛒 *How to Place Your Order:*\n\n1️⃣ Click the book link shared above (or visit https://belesu.in).\n2️⃣ Tap *Add to Cart* and view your cart.\n3️⃣ Enter your complete delivery address and mobile number.\n4️⃣ Complete payment via UPI / GPay / Card.\n5️⃣ You will immediately receive SMS & Email confirmation with your Order #!\n\nWe dispatch at 7:00 PM today! 🚚',
      next_node_key: 'post_action_buttons',
    },
    position_x: 1680,
    position_y: 100,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'post_action_buttons',
    node_type: 'send_buttons',
    config: {
      text: 'Is there anything else we can help you with today?',
      footer_text: 'Select an option',
      buttons: [
        { reply_id: 'btn_more_menu', title: '📚 Browse Books', next_node_key: 'welcome_menu' },
        { reply_id: 'btn_more_supp', title: '💬 Talk to Support', next_node_key: 'live_support' },
        { reply_id: 'btn_more_spread', title: '💛 Spread the Word', next_node_key: 'spread_word' },
      ],
    },
    position_x: 1280,
    position_y: 950,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'spread_word',
    node_type: 'send_message',
    config: {
      text: 'In case you liked Belesu Books, we kindly request you to spread the word about Belesu and share it with other parents who may find it helpful.\n\nYour support can help more children learn Kannada with better understanding and confidence! 💛📚\n\nWebsite: https://belesu.in\nHelpline: +91 96066 36804\n\nಧನ್ಯವಾದಗಳು! (Thank you!) 🙏',
      next_node_key: 'terminal_end',
    },
    position_x: 1680,
    position_y: 950,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'live_support',
    node_type: 'send_message',
    config: {
      text: '💬 *Belesu Support Desk:*\n\nOur support team has been notified and will assist you right here on WhatsApp!\n\nYou can also call us directly at *9606636804* (Mon–Sat, 10 AM – 7 PM).\n\nPlease type your question or order number below:',
      next_node_key: 'support_handoff_terminal',
    },
    position_x: 1280,
    position_y: 1250,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'support_handoff_terminal',
    node_type: 'handoff',
    config: {
      note: 'Customer requested live support chat / phone assistance.',
    },
    position_x: 1680,
    position_y: 1250,
  },
  {
    flow_id: NEW_FLOW_ID,
    node_key: 'terminal_end',
    node_type: 'end',
    config: {},
    position_x: 1980,
    position_y: 950,
  },
];

// Pre-flight validator
function validate() {
  const nodeKeys = new Set(nodes.map(n => n.node_key));
  if (nodeKeys.size !== nodes.length) throw new Error('Duplicate node_keys detected!');

  for (const n of nodes) {
    if (n.node_type === 'send_buttons') {
      if (n.config.buttons.length > 3) throw new Error(`Too many buttons in ${n.node_key}`);
      for (const b of n.config.buttons) {
        if (b.title.length > 20) throw new Error(`Button title "${b.title}" exceeds 20 chars!`);
        if (!nodeKeys.has(b.next_node_key)) throw new Error(`Missing next node "${b.next_node_key}" in ${n.node_key}`);
      }
    }
    if (n.node_type === 'send_list') {
      if (n.config.button_label.length > 20) throw new Error(`button_label exceeds 20 chars`);
      let count = 0;
      for (const sec of n.config.sections) {
        for (const r of sec.rows) {
          count++;
          if (r.title.length > 24) throw new Error(`List row title "${r.title}" exceeds 24 chars`);
          if (r.description && r.description.length > 72) throw new Error(`List row desc "${r.description}" exceeds 72 chars`);
          if (!nodeKeys.has(r.next_node_key)) throw new Error(`Missing next node "${r.next_node_key}" in ${n.node_key}`);
        }
      }
      if (count > 10) throw new Error(`Total list rows (${count}) exceeds 10!`);
    }
    if (n.node_type === 'send_message') {
      if (!n.config.next_node_key) throw new Error(`send_message ${n.node_key} missing next_node_key`);
      if (!nodeKeys.has(n.config.next_node_key)) throw new Error(`Missing next node "${n.config.next_node_key}" in ${n.node_key}`);
    }
    if (n.node_type === 'start') {
      if (!nodeKeys.has(n.config.next_node_key)) throw new Error(`Start missing next node`);
    }
  }

  // Reachability check
  const visited = new Set();
  const queue = [flowData.entry_node_id];
  while (queue.length > 0) {
    const k = queue.shift();
    if (visited.has(k)) continue;
    visited.add(k);
    const n = nodes.find(x => x.node_key === k);
    if (!n) continue;
    if (n.config.next_node_key) queue.push(n.config.next_node_key);
    if (n.config.buttons) n.config.buttons.forEach(b => queue.push(b.next_node_key));
    if (n.config.sections) n.config.sections.forEach(s => s.rows.forEach(r => queue.push(r.next_node_key)));
  }

  for (const n of nodes) {
    if (!visited.has(n.node_key)) throw new Error(`Unreachable node: ${n.node_key}`);
  }
  console.log(`Pre-flight PASS: ${nodes.length} nodes validated, 100% reachable, all WhatsApp limits satisfied.`);
}

async function run() {
  validate();

  console.log(`Creating new flow in DRAFT status (ID: ${NEW_FLOW_ID})...`);
  const { error: fErr } = await sb.from('flows').insert(flowData);
  if (fErr) throw fErr;

  console.log(`Inserting ${nodes.length} flow nodes...`);
  const { error: nErr } = await sb.from('flow_nodes').insert(nodes);
  if (nErr) throw nErr;

  console.log(`\n🎉 Successfully created flow "${flowData.name}" as DRAFT!`);
  console.log(`Flow ID: ${NEW_FLOW_ID}`);
  console.log(`URL to review in WACRM: https://crm.belesu.in/flows/${NEW_FLOW_ID}`);
}

run().catch(err => {
  console.error('Failed to create flow:', err);
  process.exit(1);
});

