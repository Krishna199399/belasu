import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sjqccpysjxkmnfttoqgf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcWNjcHlzanhrbW5mdHRvcWdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjA4MzM2MSwiZXhwIjoyMTA3NjU5MzYxfQ.9i6uceidgK58udlIkjT9-mwC5m6JyzOu5s9i5m_qw5I';

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const FLOW_ID = 'b78ec1f5-5bf3-4c43-89ac-34f503ccba6d';

async function audit() {
  const { data: nodes } = await sb.from('flow_nodes').select('node_key, node_type, config').eq('flow_id', FLOW_ID);
  
  console.log(`Auditing ${nodes.length} nodes in flow ${FLOW_ID}:`);
  const allUrls = [];

  for (const n of nodes) {
    const text = JSON.stringify(n.config);
    const matches = text.match(/https?:\/\/[^\s"'\\)]+/g) || [];
    if (matches.length > 0) {
      console.log(`\nNode: ${n.node_key} (${n.node_type})`);
      for (const raw of matches) {
        // Clean trailing punctuation if any
        const cleaned = raw.replace(/[.,;:]$/, '');
        const hasTrailingSlash = cleaned.endsWith('/');
        console.log(`  ${hasTrailingSlash ? '✅' : '❌'} ${cleaned}`);
        allUrls.push({ node_key: n.node_key, url: cleaned, hasTrailingSlash });
      }
    }
  }

  const missing = allUrls.filter(u => !u.hasTrailingSlash);
  console.log(`\nSummary: Found ${allUrls.length} URLs across nodes.`);
  console.log(`Missing trailing slash: ${missing.length}`);
  if (missing.length > 0) {
    missing.forEach(m => console.log(`  - [${m.node_key}] ${m.url}`));
  }
}

audit().catch(console.error);

