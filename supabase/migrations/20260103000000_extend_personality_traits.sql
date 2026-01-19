-- 九星気学の完全なデータを格納するためのスキーマ拡張
-- personality_traits テーブルに新しいカラムを追加

-- trait_typeのNOT NULL制約を削除（古いスキーマとの互換性のため）
ALTER TABLE personality_traits ALTER COLUMN trait_type DROP NOT NULL;

-- 既存のテーブルを拡張
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS star_number INTEGER;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS star_name TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS element TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS core_essence TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS cosmic_principle TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS elemental_reason TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS life_direction TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS inner_nature TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS spiritual_path TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS strengths TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS weaknesses TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS hidden_talents TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS life_theme TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS suitable_jobs TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS work_style TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS career_success TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS love_style TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS compatibility TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS family_life TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS health_vulnerabilities TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS health_recommendations TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS money_attitude TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS wealth_building TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS health_advice TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS wealth_advice TEXT;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS life_cycles JSONB;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS remedies JSONB;
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS traditional_wisdom TEXT[];
ALTER TABLE personality_traits ADD COLUMN IF NOT EXISTS related_knowledge_ids UUID[];

-- コメントを追加（ドキュメンテーション）
COMMENT ON COLUMN personality_traits.health_advice IS '健康運のアドバイス';
COMMENT ON COLUMN personality_traits.wealth_advice IS '金運のアドバイス';
COMMENT ON COLUMN personality_traits.life_cycles IS '人生のサイクル { youth, middle, elder }';
COMMENT ON COLUMN personality_traits.remedies IS '開運法 { colors, directions, items, habits, avoidances }';
COMMENT ON COLUMN personality_traits.traditional_wisdom IS '伝統的な教えの配列';
COMMENT ON COLUMN personality_traits.related_knowledge_ids IS '関連する知識エントリのID配列（将来の拡張用）';

-- インデックスを追加（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_personality_traits_traditional_wisdom
  ON personality_traits USING GIN (traditional_wisdom);

-- JSONB型のフィールドにGINインデックスを追加
CREATE INDEX IF NOT EXISTS idx_personality_traits_life_cycles
  ON personality_traits USING GIN (life_cycles);

CREATE INDEX IF NOT EXISTS idx_personality_traits_remedies
  ON personality_traits USING GIN (remedies);
