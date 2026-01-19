import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// .env.local を読み込む
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase認証情報が見つかりません');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(filePath: string, name: string) {
  console.log(`\n🚀 ${name}を実行中...`);

  try {
    const sql = fs.readFileSync(filePath, 'utf-8');

    // Supabaseではanon keyで直接SQLを実行できないため、
    // SQL文を個別のクエリに分割して実行する必要があります
    // ただし、これは制限があるため、代わりにRPC関数を使用します

    console.log(`📄 SQLファイルを読み込みました: ${path.basename(filePath)}`);
    console.log(`📊 SQLの長さ: ${sql.length} 文字`);

    // 注意: anon keyでは直接SQL実行ができない可能性があります
    // その場合は、service_role keyが必要です
    console.log('⚠️  注意: anon keyではデータベース構造の変更ができない可能性があります');
    console.log('💡 代わりに、Supabase Dashboardで手動実行することをお勧めします');
    console.log('   URL: https://supabase.com/dashboard/project/btafdbulmuiptriafeln/sql/new');

    return false;
  } catch (error) {
    console.error(`❌ ${name}の実行に失敗:`, error);
    return false;
  }
}

async function main() {
  console.log('🎯 マイグレーション実行スクリプト');
  console.log('=====================================\n');

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

  const migration1 = path.join(migrationsDir, '20260103000000_extend_personality_traits.sql');
  const migration2 = path.join(migrationsDir, '20260103000001_full_seed_data.sql');

  console.log('⚠️  重要な注意事項:');
  console.log('=====================================');
  console.log('anon keyではデータベースのスキーマ変更（ALTER TABLE等）ができません。');
  console.log('マイグレーションを実行するには、以下のいずれかの方法を使用してください：');
  console.log('');
  console.log('【推奨】方法1: Supabase Dashboardで手動実行');
  console.log('  1. https://supabase.com/dashboard/project/btafdbulmuiptriafeln/sql/new にアクセス');
  console.log('  2. マイグレーションファイルの内容をコピー&ペースト');
  console.log('  3. 「Run」をクリック');
  console.log('');
  console.log('方法2: service_role keyを使用');
  console.log('  1. Supabase Dashboard > Settings > API');
  console.log('  2. \"service_role\" keyをコピー（⚠️ 秘密情報！本番環境では使用注意）');
  console.log('  3. .env.localに SUPABASE_SERVICE_ROLE_KEY として追加');
  console.log('');
  console.log('📁 マイグレーションファイルの場所:');
  console.log(`  1. ${migration1}`);
  console.log(`  2. ${migration2}`);
  console.log('');
}

main().catch(console.error);
