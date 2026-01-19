const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  const { data, error } = await client
    .from('personality_traits')
    .select('*')
    .eq('star_number', 1)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  const fields = Object.keys(data);
  console.log('Total fields:', fields.length);

  const nullFields = fields.filter(f => !data[f] && data[f] !== false);
  console.log('\nNull/empty fields:', nullFields.join(', ') || 'None');

  console.log('\nSample data:');
  console.log('star_name:', data.star_name);
  console.log('element:', data.element);
  console.log('core_essence:', data.core_essence?.substring(0, 80) + '...');
  console.log('strengths:', data.strengths);
  console.log('life_cycles:', JSON.stringify(data.life_cycles, null, 2));
  console.log('remedies:', JSON.stringify(data.remedies, null, 2));
}

checkData().catch(console.error);
