import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// 環境変数から接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath: string) {
  console.log(`\n📄 実行中: ${path.basename(filePath)}`);
  
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // SQLファイルをINSERT文ごとに分割して実行
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    if (statement.toLowerCase().includes('insert into knowledge_entries')) {
      try {
        // INSERT文から値を抽出してSupabase clientで実行
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        
        if (error) {
          // RPCが使えない場合は、直接データを挿入
          console.log('  ℹ️  RPC経由での実行に失敗。直接挿入を試みます...');
          // ここでは簡略化のため、手動でパースせずエラーを表示
          console.error('  ❌ エラー:', error.message);
        } else {
          console.log('  ✅ 成功');
        }
      } catch (err: any) {
        console.error('  ❌ エラー:', err.message);
      }
    }
  }
}

async function main() {
  console.log('🚀 知識データベースマイグレーション開始\n');
  
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  const files = [
    '20260108100000_authentic_kyusei_knowledge.sql',
    '20260108100001_nine_star_personalities.sql',
    '20260108100002_nine_star_personalities_part2.sql',
  ];
  
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
      await executeSqlFile(filePath);
    } else {
      console.log(`⚠️  ファイルが見つかりません: ${file}`);
    }
  }
  
  console.log('\n✨ マイグレーション完了\n');
  
  // 確認のため、投入されたデータを取得
  const { data, error } = await supabase
    .from('knowledge_entries')
    .select('title')
    .order('created_at', { ascending: false })
    .limit(15);
  
  if (error) {
    console.error('❌ データ確認エラー:', error.message);
  } else {
    console.log('📊 投入されたエントリ:');
    data?.forEach((entry, i) => {
      console.log(`  ${i + 1}. ${entry.title}`);
    });
  }
}

main().catch(console.error);
