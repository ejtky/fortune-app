import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkKnowledgeEntries() {
  console.log('📊 知識エントリの確認中...\n');
  
  const { data, error, count } = await supabase
    .from('knowledge_entries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ エラー:', error.message);
    return;
  }
  
  console.log(`✅ 合計 ${count} 件のエントリが見つかりました\n`);
  
  if (data && data.length > 0) {
    console.log('📋 最新のエントリ:');
    data.slice(0, 15).forEach((entry, i) => {
      console.log(`  ${i + 1}. ${entry.title}`);
      if (entry.related_stars) {
        console.log(`     関連九星: ${entry.related_stars.join(', ')}`);
      }
    });
  } else {
    console.log('⚠️  エントリが見つかりません。');
    console.log('\nSupabaseダッシュボードから以下のSQLファイルを実行してください:');
    console.log('  1. supabase/migrations/20260108100000_authentic_kyusei_knowledge.sql');
    console.log('  2. supabase/migrations/20260108100001_nine_star_personalities.sql');
    console.log('  3. supabase/migrations/20260108100002_nine_star_personalities_part2.sql');
  }
}

checkKnowledgeEntries().catch(console.error);
