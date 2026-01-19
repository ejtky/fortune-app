/**
 * マイグレーション実行スクリプト
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase設定（サービスロールキーが必要）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase環境変数が設定されていません');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 マイグレーション実行開始...\n');

  // マイグレーションファイルを読み込み
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260104000000_yakumoin_knowledge_schema.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ マイグレーションファイルが見つかりません: ${migrationPath}`);
    return;
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 マイグレーションSQL:');
  console.log('─'.repeat(80));
  console.log(migrationSQL);
  console.log('─'.repeat(80));
  console.log('\n⚠️  このSQLをSupabaseダッシュボードのSQL Editorで実行してください。\n');
  console.log('手順:');
  console.log('1. Supabaseダッシュボード (https://supabase.com/dashboard) にアクセス');
  console.log('2. プロジェクトを選択');
  console.log('3. 左メニューから「SQL Editor」をクリック');
  console.log('4. 上記のSQLをコピー&ペースト');
  console.log('5. 「Run」ボタンをクリック\n');
}

runMigration().catch(console.error);
