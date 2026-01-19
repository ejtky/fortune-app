/**
 * 九星気学マイグレーション実行スクリプト
 * 20260108000000_nine_star_knowledge.sql を実行
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ エラー: Supabase設定が見つかりません');
  process.exit(1);
}

async function executeMigration() {
  console.log('🚀 九星気学マイグレーション実行開始...\n');

  const migrationPath = path.join(
    __dirname,
    '..',
    'supabase',
    'migrations',
    '20260108000000_nine_star_knowledge.sql'
  );

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ マイグレーションファイルが見つかりません: ${migrationPath}`);
    return;
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📝 マイグレーションSQL:');
  console.log('=' .repeat(80));
  console.log(migrationSQL);
  console.log('=' .repeat(80));
  console.log('\n⚠️  このSQLを手動で実行する必要があります。\n');
  console.log('【実行手順】');
  console.log('1. https://supabase.com/dashboard にアクセス');
  console.log('2. プロジェクトを選択');
  console.log('3. 左メニューから「SQL Editor」を選択');
  console.log('4. 「New query」をクリック');
  console.log('5. 上記のSQLをコピー&ペーストして「Run」をクリック\n');
  console.log('✨ 実行後、http://localhost:3000/admin/knowledge で新しいエントリを確認できます！');
}

executeMigration().catch(console.error);
