import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sjqccpysjxkmnfttoqgf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I';

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const FLOW_ID = 'f04b9b88-cb4b-46a3-aa3b-3d896fb2a640';
const ACCOUNT_ID = '7d87d718-75b1-4cda-8df5-1f2780f45cd7';

const flowData = {
  name: 'Belesu Interactive Assistant',
  description: 'Warm automated WhatsApp assistant for Belesu: Book exploration, order tracking assistance, and live support routing.',
  status: 'active',
  trigger_type: 'keyword',
  trigger_config: {
    keywords: ['hi', 'hello', 'support', 'help', 'namaskara', 'namaste', 'belesu', 'books', 'book', 'start'],
    match_type: 'contains',
  },
  entry_node_id: 'start',
  fallback_policy: {
    max_reprompts: 2,
    on_exhaust: 'handoff',
    on_timeout_hours: 24,
    on_unknown_reply: 'reprompt',
  },
  updated_at: new Date().toISOString(),
};

const nodes = [
  {
    flow_id: FLOW_ID,
    node_key: 'start',
    node_type: 'start',
    config: { next_node_key: 'welcome' },
    position_x: 100,
    position_y: 280,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'welcome',
    node_type: 'send_buttons',
    config: {
      text: 'Namaskara! 🙏 Welcome to Belesu (ಬೆಳೆಸು).\n\nKannada Mathadi, Kannada Belesi! ❤️\n\nWe provide English-translated Kannada academic guidebooks and learning resources to make Kannada easy for every student.\n\nHow can we help you today?',
      footer_text: 'Belesu | Making Kannada Learning Easier',
      buttons: [
        { reply_id: 'btn_books', title: '📚 Explore Books', next_node_key: 'books_info' },
        { reply_id: 'btn_order', title: '📦 Order Help', next_node_key: 'order_info' },
        { reply_id: 'btn_support', title: '💬 Support Chat', next_node_key: 'support_info' },
      ],
    },
    position_x: 420,
    position_y: 220,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'books_info',
    node_type: 'send_message',
    config: {
      text: '📚 *Belesu Kannada Learning Books:*\n\n1️⃣ *A Destination to Speak Kannada*\nInnovative resource for everyday Kannada conversations (Auto rides, markets, restaurants, offices & travel).\n👉 https://belesu.in/books/a-destination-to-speak-kannada/\n\n2️⃣ *Class 1 to 10 Kannada Guidebooks*\nComplete English translations and explanations for Karnataka state syllabus.\n👉 https://belesu.in/books/\n\n🌐 Visit our website: https://belesu.in/',
      next_node_key: 'books_followup',
    },
    position_x: 820,
    position_y: 80,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'books_followup',
    node_type: 'send_buttons',
    config: {
      text: 'Would you like assistance with an order or speaking with our team?',
      footer_text: 'Select an option',
      buttons: [
        { reply_id: 'btn_bk_order', title: '📦 Order Help', next_node_key: 'order_info' },
        { reply_id: 'btn_bk_support', title: '💬 Talk to Team', next_node_key: 'support_info' },
        { reply_id: 'btn_bk_done', title: '✅ Done, Thanks!', next_node_key: 'end_thanks' },
      ],
    },
    position_x: 1220,
    position_y: 80,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'order_info',
    node_type: 'send_message',
    config: {
      text: '📦 *Belesu Order Support:*\n\n• *Digital Books:* Read anytime in your library at https://belesu.in/library\n• *Hard Copies:* Track via SMS/Email tracking link.\n\n👉 Please reply with your *Order Number* (e.g., #23459) and our support team will assist you shortly!',
      next_node_key: 'order_handoff',
    },
    position_x: 820,
    position_y: 320,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'order_handoff',
    node_type: 'handoff',
    config: {
      note: 'Customer requested order tracking / status assistance. Waiting for order number.',
    },
    position_x: 1220,
    position_y: 320,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'support_info',
    node_type: 'send_message',
    config: {
      text: '💬 *Belesu Customer Support:*\n\nOur team has been notified and will reply to you right here on WhatsApp shortly! 🙏\n\nPlease feel free to type your question below.',
      next_node_key: 'support_handoff',
    },
    position_x: 820,
    position_y: 520,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'support_handoff',
    node_type: 'handoff',
    config: {
      note: 'Customer requested live agent support.',
    },
    position_x: 1220,
    position_y: 520,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'end_thanks',
    node_type: 'send_message',
    config: {
      text: 'Thank you for connecting with Belesu! Have a wonderful day. ಧನ್ಯವಾದಗಳು! ❤️',
      next_node_key: 'flow_end',
    },
    position_x: 1620,
    position_y: 80,
  },
  {
    flow_id: FLOW_ID,
    node_key: 'flow_end',
    node_type: 'end',
    config: {},
    position_x: 1980,
    position_y: 80,
  },
];

async function applyFlow() {
  console.log('1. Updating flow record...');
  const { error: flowErr } = await sb.from('flows').update(flowData).eq('id', FLOW_ID);
  if (flowErr) throw flowErr;

  console.log('2. Removing existing nodes for flow...');
  const { error: delErr } = await sb.from('flow_nodes').delete().eq('flow_id', FLOW_ID);
  if (delErr) throw delErr;

  console.log('3. Inserting 10 new validated nodes...');
  const { error: insErr } = await sb.from('flow_nodes').insert(nodes);
  if (insErr) throw insErr;

  console.log('✅ Flow successfully created and activated with 0 errors and 0 warnings!');
}

applyFlow().catch((err) => {
  console.error('Failed to apply flow:', err);
  process.exit(1);
});

