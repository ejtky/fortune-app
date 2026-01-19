/**
 * Yakumoin.info コンテンツ収集スクリプト
 *
 * yakumoin.infoのコンテンツを取得してデータベースに格納します
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase環境変数が設定されていません');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 収集対象のURL定義
interface PageInfo {
  url: string;
  slug: string;
  title: string;
  category: 'about' | 'guide' | 'reference' | 'search' | 'support';
  orderIndex: number;
}

const pages: PageInfo[] = [
  // 九星気学について（About）
  { url: 'https://yakumoin.info/about/kyusei_kigaku', slug: 'kyusei_kigaku', title: '九星気学について', category: 'about', orderIndex: 1 },
  { url: 'https://yakumoin.info/about/houiban', slug: 'houiban', title: '方位盤について', category: 'about', orderIndex: 2 },
  { url: 'https://yakumoin.info/about/direction', slug: 'direction', title: '吉凶方位の種類', category: 'about', orderIndex: 3 },
  { url: 'https://yakumoin.info/about/distance_and_span', slug: 'distance_and_span', title: '吉凶の距離と期間', category: 'about', orderIndex: 4 },
  { url: 'https://yakumoin.info/about/direction_effect', slug: 'direction_effect', title: '方位取りの効果', category: 'about', orderIndex: 5 },
  { url: 'https://yakumoin.info/about/gogyou_and_kyusei', slug: 'gogyou_and_kyusei', title: '五行と九星', category: 'about', orderIndex: 6 },
  { url: 'https://yakumoin.info/about/unsei', slug: 'unsei', title: '運勢について', category: 'about', orderIndex: 7 },
  { url: 'https://yakumoin.info/about/keisha', slug: 'keisha', title: '傾斜について', category: 'about', orderIndex: 8 },
  { url: 'https://yakumoin.info/about/kyusei_calendar', slug: 'kyusei_calendar', title: '九星気学カレンダー', category: 'about', orderIndex: 9 },

  // サポート（Support）
  { url: 'https://yakumoin.info/support/beginner', slug: 'beginner', title: '初めての方へ', category: 'support', orderIndex: 101 },
  { url: 'https://yakumoin.info/support/how_to_use', slug: 'how_to_use', title: '八雲院の使い方', category: 'support', orderIndex: 102 },
  { url: 'https://yakumoin.info/support/how_to_use_map', slug: 'how_to_use_map', title: '開運マップの使い方', category: 'support', orderIndex: 103 },
  { url: 'https://yakumoin.info/support/best_use_of_map', slug: 'best_use_of_map', title: '開運マップの活用方法', category: 'support', orderIndex: 104 },
  { url: 'https://yakumoin.info/support/member_feature', slug: 'member_feature', title: '会員機能について', category: 'support', orderIndex: 105 },
  { url: 'https://yakumoin.info/support/site', slug: 'site_about', title: '八雲院について', category: 'support', orderIndex: 106 },

  // 検索・ツール（Reference）
  { url: 'https://yakumoin.info/search/doyou', slug: 'doyou', title: '土用と間日', category: 'reference', orderIndex: 201 },
];

/**
 * HTMLコンテンツからメインテキストを抽出
 */
function extractMainContent(html: string): { content: string; summary: string } {
  const $ = cheerio.load(html);

  // 不要な要素を削除
  $('script').remove();
  $('style').remove();
  $('nav').remove();
  $('header').remove();
  $('footer').remove();
  $('.sns-share').remove();
  $('.advertisement').remove();

  // メインコンテンツを取得（サイトの構造に応じて調整）
  const mainContent = $('main').html() || $('article').html() || $('.main-content').html() || $('body').html() || '';

  // HTMLタグを除去してプレーンテキストに
  const plainText = $('<div>').html(mainContent).text().trim();

  // 要約を作成（最初の300文字）
  const summary = plainText.substring(0, 300).trim() + (plainText.length > 300 ? '...' : '');

  return { content: plainText, summary };
}

/**
 * URLからコンテンツを取得
 */
async function fetchContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

/**
 * データベースに保存
 */
async function saveToDatabase(pageInfo: PageInfo, content: string, summary: string) {
  const { error } = await supabase
    .from('knowledge_articles')
    .upsert({
      slug: pageInfo.slug,
      title: pageInfo.title,
      category: pageInfo.category,
      content: content,
      summary: summary,
      order_index: pageInfo.orderIndex,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'slug'
    });

  if (error) {
    console.error(`Failed to save ${pageInfo.slug}:`, error);
    throw error;
  }

  console.log(`✅ Saved: ${pageInfo.title} (${pageInfo.slug})`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Yakumoin.info コンテンツ収集開始...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const pageInfo of pages) {
    try {
      console.log(`📥 Fetching: ${pageInfo.title} (${pageInfo.url})`);

      // コンテンツ取得
      const html = await fetchContent(pageInfo.url);

      // コンテンツ抽出
      const { content, summary } = extractMainContent(html);

      // データベース保存
      await saveToDatabase(pageInfo, content, summary);

      successCount++;

      // レート制限対策（1秒待機）
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Failed: ${pageInfo.title}`, error);
      failureCount++;
    }
  }

  console.log('\n📊 結果:');
  console.log(`   成功: ${successCount} ページ`);
  console.log(`   失敗: ${failureCount} ページ`);
  console.log('\n✨ 完了しました！');
}

// スクリプト実行
main().catch(console.error);
