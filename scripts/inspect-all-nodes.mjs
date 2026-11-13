import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sjqccpysjxkmnfttoqgf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I';

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const FLOW_ID = 'b78ec1f5-5bf3-4c43-89ac-34f503ccba6d';

async function checkAll() {
  const { data: nodes, error } = await sb.from('flow_nodes').select('node_key, node_type, config').eq('flow_id', FLOW_ID);
  if (error) throw error;

  console.log(`Total nodes in flow: ${nodes.length}`);
  for (const n of nodes) {
    const raw = JSON.stringify(n.config);
    if (raw.includes('http') || raw.includes('.in') || raw.includes('belesu')) {
      console.log(`\n--- Node: ${n.node_key} (${n.node_type}) ---`);
      if (n.config.text) {
        console.log(`Text Length: ${n.config.text.length} chars`);
        console.log(n.config.text);
      }
    }
  }
}

checkAll().catch(console.error);

