const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkKnowledge() {
  console.log('=== Knowledge Database Check ===\n');

  // Check five_elements
  const { data: elements, error: elementsError } = await client
    .from('five_elements')
    .select('element, essence, direction, season')
    .order('element');

  if (elementsError) {
    console.error('❌ Five Elements Error:', elementsError.message);
  } else {
    console.log(`✅ Five Elements: ${elements?.length || 0} entries`);
    if (elements && elements.length > 0) {
      elements.forEach(e => {
        console.log(`  - ${e.element} (${e.direction}, ${e.season}): ${e.essence.substring(0, 40)}...`);
      });
    }
  }

  console.log('\n');

  // Check knowledge_categories
  const { data: categories, error: categoriesError } = await client
    .from('knowledge_categories')
    .select('name, description')
    .order('sort_order');

  if (categoriesError) {
    console.error('❌ Categories Error:', categoriesError.message);
  } else {
    console.log(`✅ Categories: ${categories?.length || 0} entries`);
    if (categories && categories.length > 0) {
      categories.forEach(c => console.log(`  - ${c.name}: ${c.description}`));
    }
  }

  console.log('\n');

  // Check knowledge_entries
  const { data: entries, error: entriesError } = await client
    .from('knowledge_entries')
    .select('title, summary, importance_level')
    .order('created_at');

  if (entriesError) {
    console.error('❌ Knowledge Entries Error:', entriesError.message);
  } else {
    console.log(`✅ Knowledge Entries: ${entries?.length || 0} entries`);
    if (entries && entries.length > 0) {
      entries.forEach(e => {
        console.log(`  - [${e.importance_level}★] ${e.title}`);
        console.log(`    ${e.summary?.substring(0, 80)}...`);
      });
    }
  }

  console.log('\n');

  // Check knowledge_tags
  const { data: tags, error: tagsError } = await client
    .from('knowledge_tags')
    .select('name, color')
    .order('name');

  if (tagsError) {
    console.error('❌ Tags Error:', tagsError.message);
  } else {
    console.log(`✅ Tags: ${tags?.length || 0} entries`);
    if (tags && tags.length > 0) {
      tags.forEach(t => console.log(`  - ${t.name} (${t.color})`));
    }
  }

  console.log('\n=== Check Complete ===');
}

checkKnowledge().catch(console.error);
