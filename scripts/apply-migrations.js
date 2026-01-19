const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function applyMigration(filename) {
  const filepath = path.join(__dirname, '..', 'supabase', 'migrations', filename);

  if (!fs.existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    return false;
  }

  const sql = fs.readFileSync(filepath, 'utf-8');

  console.log(`\nApplying migration: ${filename}...`);

  try {
    const { error } = await client.rpc('exec_sql', { sql_string: sql });

    if (error) {
      console.error(`Error: ${error.message}`);
      return false;
    }

    console.log(`✓ Successfully applied: ${filename}`);
    return true;
  } catch (err) {
    console.error(`Exception: ${err.message}`);
    return false;
  }
}

async function main() {
  const migrations = [
    '20260102000001_initial_knowledge_data.sql'
  ];

  console.log('=== Applying Knowledge Base Migrations ===');

  for (const migration of migrations) {
    await applyMigration(migration);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between migrations
  }

  console.log('\n=== Verifying Data ===');

  // Verify knowledge entries
  const { data: entries, error } = await client
    .from('knowledge_entries')
    .select('id, title')
    .limit(5);

  if (error) {
    console.error('Verification error:', error);
  } else {
    console.log(`\nKnowledge entries found: ${entries?.length || 0}`);
    if (entries && entries.length > 0) {
      entries.forEach(e => console.log(`  - ${e.title}`));
    }
  }
}

main().catch(console.error);
