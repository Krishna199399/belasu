import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sjqccpysjxkmnfttoqgf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I';

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const FLOW_IDS = [
  'b78ec1f5-5bf3-4c43-89ac-34f503ccba6d', // Active Flow: Belesu FAQ & Book Assistant
  'f04b9b88-cb4b-46a3-aa3b-3d896fb2a640', // Draft Flow: Belesu Interactive Assistant
];

// Exact URL mapping: Legacy/Inconsistent URL -> Canonical trailing-slashed URL
const URL_REPLACEMENTS = [
  // Class 1 to 4 Savi
  ['https://belesu.in/shop/books/savi-kannada-class-1/', 'https://belesu.in/books/savi-kannada-class-1/'],
  ['https://belesu.in/shop/books/savi-kannada-class-2/', 'https://belesu.in/books/savi-kannada-class-2/'],
  ['https://belesu.in/shop/books/savi-kannada-class-3/', 'https://belesu.in/books/savi-kannada-class-3/'],
  ['https://belesu.in/shop/books/savi-kannada-class-4/', 'https://belesu.in/books/savi-kannada-class-4/'],
  ['https://belesu.in/books/savi-kannada-class-1 ', 'https://belesu.in/books/savi-kannada-class-1/ '],
  ['https://belesu.in/books/savi-kannada-class-2 ', 'https://belesu.in/books/savi-kannada-class-2/ '],
  ['https://belesu.in/books/savi-kannada-class-3 ', 'https://belesu.in/books/savi-kannada-class-3/ '],
  ['https://belesu.in/books/savi-kannada-class-4 ', 'https://belesu.in/books/savi-kannada-class-4/ '],
  ['https://belesu.in/books/savi-kannada-class-1\n', 'https://belesu.in/books/savi-kannada-class-1/\n'],
  ['https://belesu.in/books/savi-kannada-class-2\n', 'https://belesu.in/books/savi-kannada-class-2/\n'],
  ['https://belesu.in/books/savi-kannada-class-3\n', 'https://belesu.in/books/savi-kannada-class-3/\n'],
  ['https://belesu.in/books/savi-kannada-class-4\n', 'https://belesu.in/books/savi-kannada-class-4/\n'],

  // Class 1 to 4 Kali
  ['https://belesu.in/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-1/', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1/'],
  ['https://belesu.in/shop/books/kali-kannada-english-translated-innovative-guidebook-class-2/', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2/'],
  ['https://belesu.in/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-3/', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3/'],
  ['https://belesu.in/shop/kali/kali-kannada-english-translated-innovative-guidebook-class-4/', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4/'],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1 ', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1/ '],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2 ', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2/ '],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3 ', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3/ '],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4 ', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4/ '],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1\n', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-1/\n'],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2\n', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-2/\n'],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3\n', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-3/\n'],
  ['https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4\n', 'https://belesu.in/books/kali-kannada-english-translated-innovative-guidebook-class-4/\n'],

  // Class 5 Siri & Tili
  ['https://belesu.in/product-category/siri/', 'https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5/'],
  ['https://belesu.in/product-category/tili/', 'https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5/'],
  ['https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5 ', 'https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5/ '],
  ['https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5 ', 'https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5/ '],
  ['https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5\n', 'https://belesu.in/books/siri-kannada-english-translated-guidebook-class-5/\n'],
  ['https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5\n', 'https://belesu.in/books/tili-kannada-english-translated-innovative-guidebook-class-5/\n'],

  // Class 6 Siri Digital
  ['https://belesu.in/digital/kannada-class-6-guide\n', 'https://belesu.in/digital/kannada-class-6-guide/\n'],
  ['https://belesu.in/digital/kannada-class-6-guide ', 'https://belesu.in/digital/kannada-class-6-guide/ '],
  ['https://belesu.in/digital/kannada-class-6-guide"', 'https://belesu.in/digital/kannada-class-6-guide/"'],
  ['https://belesu.in/digital/kannada-class-6-guide\\n', 'https://belesu.in/digital/kannada-class-6-guide/\\n'],

  // Destination to Speak Kannada
  ['https://belesu.in/books/a-destination-to-speak-kannada\n', 'https://belesu.in/books/a-destination-to-speak-kannada/\n'],
  ['https://belesu.in/books/a-destination-to-speak-kannada ', 'https://belesu.in/books/a-destination-to-speak-kannada/ '],

  // Base root domain belesu.in
  ['visit https://belesu.in)', 'visit https://belesu.in/)'],
  ['store: https://belesu.in.', 'store: https://belesu.in/.'],
  ['Website: https://belesu.in\n', 'Website: https://belesu.in/\n'],
  ['Website: https://belesu.in\\n', 'Website: https://belesu.in/\\n'],
];

async function updateFlow(flowId) {
  console.log(`\n=== Processing Flow: ${flowId} ===`);
  const { data: nodes, error } = await sb.from('flow_nodes').select('*').eq('flow_id', flowId);
  if (error) throw error;

  let count = 0;
  for (const node of nodes) {
    let jsonStr = JSON.stringify(node.config);
    let changed = false;

    for (const [from, to] of URL_REPLACEMENTS) {
      if (jsonStr.includes(from)) {
        jsonStr = jsonStr.replaceAll(from, to);
        changed = true;
      }
    }

    if (changed) {
      const newConfig = JSON.parse(jsonStr);
      // Double check any length limits for buttons
      if (node.node_type === 'send_buttons' && newConfig.text && newConfig.text.length > 1024) {
        throw new Error(`Node ${node.node_key} exceeds 1024 char limit: ${newConfig.text.length}`);
      }

      const { error: uErr } = await sb.from('flow_nodes').update({ config: newConfig }).eq('id', node.id);
      if (uErr) {
        console.error(`Failed to update ${node.node_key}:`, uErr);
      } else {
        console.log(`✅ Updated node [${node.node_key}] (${node.node_type}) - text length: ${newConfig.text ? newConfig.text.length : 'N/A'}`);
        count++;
      }
    }
  }

  console.log(`Flow ${flowId}: ${count} nodes updated.`);
}

async function run() {
  for (const f of FLOW_IDS) {
    await updateFlow(f);
  }
}

run().catch(console.error);
