import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  essence: string | null;
  related_stars: number[] | null;
  keywords: string[] | null;
  importance_level: number;
  score: number; // 関連度スコア
}

export interface SearchOptions {
  honmei?: number;
  limit?: number;
  minScore?: number;
}

/**
 * 知識ベースから関連エントリを検索
 */
export async function searchKnowledgeBase(
  query: string,
  options: SearchOptions = {}
): Promise<KnowledgeSearchResult[]> {
  const { honmei, limit = 5, minScore = 0.3 } = options;

  try {
    // クエリからキーワードを抽出
    const keywords = extractKeywords(query);
    
    // Supabaseクエリを構築
    let supabaseQuery = supabase
      .from('knowledge_entries')
      .select('*')
      .eq('is_published', true);

    // 本命星でフィルタリング（該当する場合）
    if (honmei) {
      supabaseQuery = supabaseQuery.or(
        `related_stars.cs.{${honmei}},related_stars.is.null`
      );
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Knowledge search error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // スコアリング
    const scoredResults = data.map((entry) => ({
      ...entry,
      score: calculateRelevanceScore(entry, query, keywords, honmei),
    }));

    // スコアでソートし、最小スコア以上のものを返す
    return scoredResults
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Knowledge search error:', error);
    return [];
  }
}

/**
 * クエリからキーワードを抽出
 */
function extractKeywords(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  
  const keywordMap: Record<string, string[]> = {
    性格: ['性格', '特徴', 'どんな人', '本質'],
    仕事: ['仕事', '職業', 'キャリア', '適職', '働き方'],
    恋愛: ['恋愛', '結婚', '相性', 'パートナー', '家庭'],
    健康: ['健康', '病気', '体調', '注意'],
    金運: ['金運', 'お金', '財運', '貯金', '収入'],
    開運: ['開運', '運気', '上げる', '高める', 'ラッキー'],
    方位: ['方位', '吉方位', '凶方位', '方角', '方向'],
    五行: ['五行', '陰陽', '相生', '相剋', '木火土金水'],
    歴史: ['歴史', '起源', '伝統', '由来'],
    風水: ['風水', '気の流れ', '環境'],
  };

  const extractedKeywords: string[] = [];
  
  for (const [category, patterns] of Object.entries(keywordMap)) {
    if (patterns.some((pattern) => lowerQuery.includes(pattern))) {
      extractedKeywords.push(category);
    }
  }

  return extractedKeywords.length > 0 ? extractedKeywords : ['一般'];
}

/**
 * 関連度スコアを計算
 */
function calculateRelevanceScore(
  entry: any,
  query: string,
  keywords: string[],
  honmei?: number
): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  const lowerTitle = entry.title.toLowerCase();
  const lowerContent = entry.content.toLowerCase();

  // タイトルマッチ（高スコア）
  if (lowerTitle.includes(lowerQuery)) {
    score += 1.5; // スコアを上げる
  }

  // キーワードマッチ
  if (entry.keywords) {
    const matchedKeywords = keywords.filter((kw) =>
      entry.keywords.some((ek: string) => ek.includes(kw) || kw.includes(ek))
    );
    score += matchedKeywords.length * 0.5;
  }

  // 内容への完全一致/部分一致
  if (lowerContent.includes(lowerQuery)) {
    score += 0.8;
  }

  // キーワードが本文に含まれるか
  keywords.forEach((keyword) => {
    if (lowerContent.includes(keyword) && keyword !== '一般') {
      score += 0.3;
    }
  });

  // 本命星マッチ（ボーナス）
  if (honmei && entry.related_stars?.includes(honmei)) {
    score += 0.4;
  }

  // 重要度による重み付け
  score *= (entry.importance_level || 3) / 5;

  return score;
}

/**
 * 特定の九星に関する知識を取得
 */
export async function getStarKnowledge(starNumber: number): Promise<KnowledgeSearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('knowledge_entries')
      .select('*')
      .contains('related_stars', [starNumber])
      .eq('is_published', true)
      .order('importance_level', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Star knowledge error:', error);
      return [];
    }

    return (data || []).map((entry) => ({
      ...entry,
      score: 1.0,
    }));
  } catch (error) {
    console.error('Star knowledge error:', error);
    return [];
  }
}

/**
 * カテゴリ別の知識を取得
 */
export async function getKnowledgeByCategory(category: string): Promise<KnowledgeSearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('knowledge_entries')
      .select('*')
      .contains('keywords', [category])
      .eq('is_published', true)
      .order('importance_level', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Category knowledge error:', error);
      return [];
    }

    return (data || []).map((entry) => ({
      ...entry,
      score: 1.0,
    }));
  } catch (error) {
    console.error('Category knowledge error:', error);
    return [];
  }
}
