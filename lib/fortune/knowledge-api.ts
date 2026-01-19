/**
 * 知識記事（knowledge_articles）取得API
 * yakumoin.infoから収集したコンテンツを取得
 */

import { supabase } from '@/lib/db/supabase';

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  summary: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * 全記事を取得
 */
export async function getAllArticles(): Promise<KnowledgeArticle[]> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }

  return data || [];
}

/**
 * カテゴリ別に記事を取得
 */
export async function getArticlesByCategory(category: string): Promise<KnowledgeArticle[]> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .eq('category', category)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Failed to fetch articles by category:', error);
    return [];
  }

  return data || [];
}

/**
 * スラッグで記事を取得
 */
export async function getArticleBySlug(slug: string): Promise<KnowledgeArticle | null> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Failed to fetch article by slug:', error);
    return null;
  }

  return data;
}

/**
 * キーワードで記事を検索
 */
export async function searchArticles(keyword: string): Promise<KnowledgeArticle[]> {
  if (!keyword || keyword.trim().length === 0) {
    return getAllArticles();
  }

  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%,summary.ilike.%${keyword}%`)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Failed to search articles:', error);
    return [];
  }

  return data || [];
}

/**
 * 関連記事を取得（九星に関連する記事）
 */
export async function getRelatedArticles(starName: string): Promise<KnowledgeArticle[]> {
  const keywords = [
    starName,
    '九星',
    '方位',
    '運勢',
    '吉凶'
  ];

  const searchPattern = keywords.map(k => `content.ilike.%${k}%`).join(',');

  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .or(searchPattern)
    .limit(5)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Failed to fetch related articles:', error);
    return [];
  }

  return data || [];
}

/**
 * カテゴリ一覧を取得
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('category')
    .order('category');

  if (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }

  // ユニークなカテゴリのみを返す
  return [...new Set(data.map(item => item.category))];
}
