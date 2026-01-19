/**
 * 管理画面用APIユーティリティ
 * Knowledge Database Admin API
 */

import { supabase, type Database } from '../db/supabase';

export type KnowledgeCategory = Database['public']['Tables']['knowledge_categories']['Row'];
export type KnowledgeEntry = Database['public']['Tables']['knowledge_entries']['Row'];
export type KnowledgeEntryInsert = Database['public']['Tables']['knowledge_entries']['Insert'];
export type KnowledgeEntryUpdate = Database['public']['Tables']['knowledge_entries']['Update'];
export type KnowledgeTag = Database['public']['Tables']['knowledge_tags']['Row'];
export type FiveElement = Database['public']['Tables']['five_elements']['Row'];

/**
 * 全てのカテゴリを取得
 */
export async function getCategories(): Promise<KnowledgeCategory[]> {
  const { data, error } = await supabase
    .from('knowledge_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  return data || [];
}

/**
 * 全てのエントリを取得
 */
export async function getEntries(): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabase
    .from('knowledge_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
  return data || [];
}

/**
 * 新しいエントリを作成
 */
export async function createEntry(entry: KnowledgeEntryInsert): Promise<KnowledgeEntry> {
  const { data, error } = await supabase
    .from('knowledge_entries')
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.error('Error creating entry:', error);
    throw error;
  }
  return data;
}

/**
 * エントリを更新
 */
export async function updateEntry(id: string, entry: KnowledgeEntryUpdate): Promise<KnowledgeEntry> {
  const { data, error } = await supabase
    .from('knowledge_entries')
    .update(entry)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
  return data;
}

/**
 * エントリを削除
 */
export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('knowledge_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}

/**
 * 全てのタグを取得
 */
export async function getTags(): Promise<KnowledgeTag[]> {
  const { data, error } = await supabase
    .from('knowledge_tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
  return data || [];
}

/**
 * 全ての五行要素を取得
 */
export async function getFiveElements(): Promise<FiveElement[]> {
  const { data, error } = await supabase
    .from('five_elements')
    .select('*')
    .order('element', { ascending: true });

  if (error) {
    console.error('Error fetching five elements:', error);
    throw error;
  }
  return data || [];
}

/**
 * キーワード検索
 */
export async function searchEntries(keyword: string): Promise<KnowledgeEntry[]> {
  if (!keyword.trim()) {
    return getEntries();
  }

  const { data, error } = await supabase
    .from('knowledge_entries')
    .select('*')
    .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%,summary.ilike.%${keyword}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching entries:', error);
    throw error;
  }
  return data || [];
}

/**
 * 特定の九星の知識エントリを取得
 * @param starName 九星の名前（例：「一白水星」）
 */
export async function getStarKnowledge(starName: string): Promise<KnowledgeEntry | null> {
  const { data, error } = await supabase
    .from('knowledge_entries')
    .select('*')
    .ilike('title', `${starName}%`)
    .single();

  if (error) {
    console.error(`Error fetching star knowledge for ${starName}:`, error);
    return null;
  }
  return data;
}

/**
 * related_starsで特定の九星番号を含むエントリを取得
 * @param starNumber 九星の番号（1-9）
 */
export async function getRelatedStarEntries(starNumber: number): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabase
    .from('knowledge_entries')
    .select('*')
    .contains('related_stars', [starNumber])
    .order('importance_level', { ascending: false });

  if (error) {
    console.error(`Error fetching related entries for star ${starNumber}:`, error);
    throw error;
  }
  return data || [];
}
