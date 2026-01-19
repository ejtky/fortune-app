/**
 * Supabase クライアント設定
 * データベースとの接続を管理
 */

import { createClient } from '@supabase/supabase-js';

// 環境変数の検証
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase の環境変数が設定されていません。' +
    '.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。'
  );
}

// Supabase クライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * データベース型定義
 */
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          birth_date: string;
          birth_time: string | null;
          zodiac_sign: string | null;
          honmei_star: number;
          getsumesei_star: number;
          nichisei_star: number;
          keishakyu: number;
          dokaisei: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          birth_date: string;
          birth_time?: string | null;
          zodiac_sign?: string | null;
          honmei_star: number;
          getsumesei_star: number;
          nichisei_star: number;
          keishakyu: number;
          dokaisei: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          birth_date?: string;
          birth_time?: string | null;
          zodiac_sign?: string | null;
          honmei_star?: number;
          getsumesei_star?: number;
          nichisei_star?: number;
          keishakyu?: number;
          dokaisei?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_fortunes: {
        Row: {
          id: string;
          user_id: string;
          fortune_date: string;
          nine_star_reading: Record<string, unknown>;
          directional_reading: Record<string, unknown> | null;
          feng_shui_reading: Record<string, unknown> | null;
          combined_score: number | null;
          lucky_direction: string | null;
          lucky_color: string | null;
          advice: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          fortune_date: string;
          nine_star_reading: Record<string, unknown>;
          directional_reading?: Record<string, unknown> | null;
          feng_shui_reading?: Record<string, unknown> | null;
          combined_score?: number | null;
          lucky_direction?: string | null;
          lucky_color?: string | null;
          advice?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          fortune_date?: string;
          nine_star_reading?: Record<string, unknown>;
          directional_reading?: Record<string, unknown> | null;
          feng_shui_reading?: Record<string, unknown> | null;
          combined_score?: number | null;
          lucky_direction?: string | null;
          lucky_color?: string | null;
          advice?: string | null;
          created_at?: string;
        };
      };
      chat_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      stars: {
        Row: {
          id: number;
          name: string;
          element: string;
          home_direction: string;
          symbolic_meanings: string[];
        };
        Insert: {
          id: number;
          name: string;
          element: string;
          home_direction: string;
          symbolic_meanings?: string[];
        };
        Update: {
          id?: number;
          name?: string;
          element?: string;
          home_direction?: string;
          symbolic_meanings?: string[];
        };
      };
      personality_traits: {
        Row: {
          id?: string;
          star_number: number;
          star_name: string;
          element: string;
          // 本質
          core_essence: string;
          cosmic_principle: string;
          elemental_reason: string;
          life_direction: string;
          inner_nature: string;
          spiritual_path: string;
          // 性格
          strengths: string[];
          weaknesses: string[];
          hidden_talents: string[];
          life_theme: string;
          // キャリア
          suitable_jobs: string[];
          work_style: string;
          career_success: string;
          // 恋愛・人間関係
          love_style: string;
          compatibility: string;
          family_life: string;
          // 健康
          health_vulnerabilities: string[];
          health_recommendations: string[];
          health_advice: string;
          // 金運
          money_attitude: string;
          wealth_building: string;
          wealth_advice: string;
          // 人生のサイクル
          life_cycles: {
            youth: string;
            middle: string;
            elder: string;
          };
          // 開運法
          remedies: {
            colors: string[];
            directions: string[];
            items: string[];
            habits: string[];
            avoidances: string[];
          };
          // 伝統的教え
          traditional_wisdom: string[];
          related_knowledge_ids?: string[];
          created_at?: string;
        };
        Insert: {
          id?: string;
          star_number: number;
          star_name: string;
          element: string;
          core_essence: string;
          cosmic_principle: string;
          elemental_reason: string;
          life_direction: string;
          inner_nature: string;
          spiritual_path: string;
          strengths: string[];
          weaknesses: string[];
          hidden_talents: string[];
          life_theme: string;
          suitable_jobs: string[];
          work_style: string;
          career_success: string;
          love_style: string;
          compatibility: string;
          family_life: string;
          health_vulnerabilities: string[];
          health_recommendations: string[];
          health_advice: string;
          money_attitude: string;
          wealth_building: string;
          wealth_advice: string;
          life_cycles: {
            youth: string;
            middle: string;
            elder: string;
          };
          remedies: {
            colors: string[];
            directions: string[];
            items: string[];
            habits: string[];
            avoidances: string[];
          };
          traditional_wisdom: string[];
          related_knowledge_ids?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          star_number?: number;
          star_name?: string;
          element?: string;
          core_essence?: string;
          cosmic_principle?: string;
          elemental_reason?: string;
          life_direction?: string;
          inner_nature?: string;
          spiritual_path?: string;
          strengths?: string[];
          weaknesses?: string[];
          hidden_talents?: string[];
          life_theme?: string;
          suitable_jobs?: string[];
          work_style?: string;
          career_success?: string;
          love_style?: string;
          compatibility?: string;
          family_life?: string;
          health_vulnerabilities?: string[];
          health_recommendations?: string[];
          health_advice?: string;
          money_attitude?: string;
          wealth_building?: string;
          wealth_advice?: string;
          life_cycles?: {
            youth: string;
            middle: string;
            elder: string;
          };
          remedies?: {
            colors: string[];
            directions: string[];
            items: string[];
            habits: string[];
            avoidances: string[];
          };
          traditional_wisdom?: string[];
          related_knowledge_ids?: string[];
          created_at?: string;
        };
      };
      fortune_patterns: {
        Row: {
          id: string;
          star_id: number;
          palace_id: number;
          luck_level: number | null;
          base_text: string | null;
          advice_business: string | null;
          advice_love: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          star_id: number;
          palace_id: number;
          luck_level?: number | null;
          base_text?: string | null;
          advice_business?: string | null;
          advice_love?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          star_id?: number;
          palace_id?: number;
          luck_level?: number | null;
          base_text?: string | null;
          advice_business?: string | null;
          advice_love?: string | null;
          created_at?: string;
        };
      };
      direction_effects: {
        Row: {
          id: string;
          star_id: number;
          effect_title: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          star_id: number;
          effect_title?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          star_id?: number;
          effect_title?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      knowledge_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_entries: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          content: string;
          summary: string | null;
          essence: string | null;
          historical_context: string | null;
          traditional_wisdom: string | null;
          lost_knowledge: string | null;
          related_stars: number[] | null;
          keywords: string[] | null;
          references: string[] | null;
          importance_level: number;
          is_verified: boolean;
          is_published: boolean;
          author: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          content: string;
          summary?: string | null;
          essence?: string | null;
          historical_context?: string | null;
          traditional_wisdom?: string | null;
          lost_knowledge?: string | null;
          related_stars?: number[] | null;
          keywords?: string[] | null;
          references?: string[] | null;
          importance_level?: number;
          is_verified?: boolean;
          is_published?: boolean;
          author?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          title?: string;
          content?: string;
          summary?: string | null;
          essence?: string | null;
          historical_context?: string | null;
          traditional_wisdom?: string | null;
          lost_knowledge?: string | null;
          related_stars?: number[] | null;
          keywords?: string[] | null;
          references?: string[] | null;
          importance_level?: number;
          is_verified?: boolean;
          is_published?: boolean;
          author?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_tags: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
      knowledge_entry_tags: {
        Row: {
          knowledge_entry_id: string;
          tag_id: string;
        };
        Insert: {
          knowledge_entry_id: string;
          tag_id: string;
        };
        Update: {
          knowledge_entry_id?: string;
          tag_id?: string;
        };
      };
      five_elements: {
        Row: {
          id: string;
          element: string;
          essence: string;
          cosmic_principle: string | null;
          natural_manifestation: string | null;
          human_manifestation: string | null;
          spiritual_meaning: string | null;
          generates: string | null;
          controls: string | null;
          direction: string | null;
          season: string | null;
          color: string[] | null;
          organs: string[] | null;
          emotions: string[] | null;
          ancient_wisdom: string | null;
          modern_interpretation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          element: string;
          essence: string;
          cosmic_principle?: string | null;
          natural_manifestation?: string | null;
          human_manifestation?: string | null;
          spiritual_meaning?: string | null;
          generates?: string | null;
          controls?: string | null;
          direction?: string | null;
          season?: string | null;
          color?: string[] | null;
          organs?: string[] | null;
          emotions?: string[] | null;
          ancient_wisdom?: string | null;
          modern_interpretation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          element?: string;
          essence?: string;
          cosmic_principle?: string | null;
          natural_manifestation?: string | null;
          human_manifestation?: string | null;
          spiritual_meaning?: string | null;
          generates?: string | null;
          controls?: string | null;
          direction?: string | null;
          season?: string | null;
          color?: string[] | null;
          organs?: string[] | null;
          emotions?: string[] | null;
          ancient_wisdom?: string | null;
          modern_interpretation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
