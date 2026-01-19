/**
 * 占いデータ取得ユーティリティ (Supabase版)
 */

import { supabase, type Database } from '../db/supabase';

// 型エイリアスを定義
export type PersonalityTraits = Database['public']['Tables']['personality_traits']['Row'];
export type StarInfo = Database['public']['Tables']['stars']['Row'];
export type FortunePattern = Database['public']['Tables']['fortune_patterns']['Row'];
export type DirectionEffect = Database['public']['Tables']['direction_effects']['Row'];

/**
 * 九星の基本情報を取得
 */
export async function getStarInfo(starId: number): Promise<StarInfo | null> {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('id', starId)
    .single();

  if (error) {
    console.error(`Error fetching star info for ID ${starId}:`, error);
    return null;
  }
  return data;
}

/**
 * 九星の性格・特徴を完全取得（新スキーマ対応）
 * すべてのフィールドを取得：本質、性格、キャリア、恋愛、健康、金運、開運法、人生サイクル等
 */
export async function getPersonalityTraits(starNumber: number): Promise<PersonalityTraits | null> {
  const { data, error } = await supabase
    .from('personality_traits')
    .select('*')
    .eq('star_number', starNumber)
    .single();

  if (error) {
    console.error(`Error fetching personality traits for star ${starNumber}:`, error);
    return null;
  }
  return data;
}

/**
 * 九星の詳細プロフィールを取得（拡充された知識ベース）
 * 30以上のフィールドを含む包括的なプロフィール：
 * - 本質的要素: core_essence, cosmic_principle, elemental_reason, life_direction
 * - 内面と精神: inner_nature, spiritual_path, life_theme
 * - 性格分析: strengths, weaknesses, hidden_talents
 * - キャリア: suitable_jobs, work_style, career_success
 * - 人間関係: love_style, family_life, compatibility
 * - 健康: health_vulnerabilities, health_recommendations
 * - 金運: money_attitude, wealth_building
 * - 人生サイクル: life_cycles (youth, middle, elder)
 * - 開運要素: remedies (colors, directions, items, habits, avoidances)
 * - 伝統的教え: traditional_wisdom
 *
 * Note: この関数はgetPersonalityTraitsと同じデータを返します（互換性のため）
 */
export async function getStarProfile(starNumber: number): Promise<PersonalityTraits | null> {
  return getPersonalityTraits(starNumber);
}

/**
 * 特定の場所（宮）に回座した際の運勢を取得
 */
export async function getFortuneReading(starId: number, palaceId: number): Promise<FortunePattern | null> {
  const { data, error } = await supabase
    .from('fortune_patterns')
    .select('*')
    .eq('star_id', starId)
    .eq('palace_id', palaceId)
    .single();

  if (error) {
    // 81パターン全てが埋まっていない可能性があるため、エラーログのみ出力して null を返す
    console.warn(`Reading not found for Star ${starId} in Palace ${palaceId}`);
    return null;
  }
  return data;
}

/**
 * 特定の方位（星）の移動効果を取得
 */
export async function getDirectionEffect(starId: number): Promise<DirectionEffect | null> {
  const { data, error } = await supabase
    .from('direction_effects')
    .select('*')
    .eq('star_id', starId)
    .single();

  if (error) {
    console.error(`Error fetching direction effect for star ${starId}:`, error);
    return null;
  }
  return data;
}
