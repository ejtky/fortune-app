/**
 * マイグレーション直接実行スクリプト
 * Supabase REST APIを使用してSQLを実行
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ エラー: SUPABASE_SERVICE_ROLE_KEYが設定されていません');
  console.log('\n.env.localファイルに以下を追加してください:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

async function executeMigration() {
  console.log('🚀 マイグレーション実行開始...\n');

  // マイグレーションファイルを読み込み
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260104000000_yakumoin_knowledge_schema.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ マイグレーションファイルが見つかりません: ${migrationPath}`);
    return;
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  // SQL文を分割（セミコロンで区切る）
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 ${statements.length}個のSQL文を実行します...\n`);

  // Supabase Management APIを使用してSQLを実行
  const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    try {
      console.log(`[${i + 1}/${statements.length}] 実行中...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ query: statement }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ エラー: ${error}`);

        // RPC関数が存在しない場合の代替手段を提示
        if (error.includes('Could not find') || response.status === 404) {
          console.log('\n⚠️  直接実行できませんでした。以下の方法でマイグレーションを実行してください:\n');
          console.log('【方法1】Supabaseダッシュボードで実行（推奨）');
          console.log('1. https://supabase.com/dashboard にアクセス');
          console.log('2. プロジェクトを選択');
          console.log('3. SQL Editorを開く');
          console.log('4. 以下のコマンドでSQLを表示:');
          console.log('   npm run migration:show');
          console.log('5. 表示されたSQLをコピー&ペーストして実行\n');

          console.log('【方法2】Supabase CLIを使用');
          console.log('1. Supabaseプロジェクトをリンク:');
          console.log('   npx supabase link --project-ref YOUR_PROJECT_REF');
          console.log('2. マイグレーションを実行:');
          console.log('   npx supabase db push\n');

          return;
        }
      } else {
        console.log(`✅ 成功`);
      }

    } catch (error) {
      console.error(`❌ 実行エラー:`, error);
    }
  }

  console.log('\n✨ マイグレーション完了！');
}

executeMigration().catch(console.error);
