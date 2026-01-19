-- ========================================
-- 完全な知識ベース（テーブル作成含む）
-- Complete Knowledge Base with Table Creation
-- ========================================

-- ========================================
-- PART 1: starsテーブルの拡張
-- ========================================

ALTER TABLE stars ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE stars ADD COLUMN IF NOT EXISTS color TEXT[];
ALTER TABLE stars ADD COLUMN IF NOT EXISTS direction TEXT;
ALTER TABLE stars ADD COLUMN IF NOT EXISTS season TEXT;
ALTER TABLE stars ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- CHECK制約を追加
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'stars_id_check'
    ) THEN
        ALTER TABLE stars ADD CONSTRAINT stars_id_check CHECK (id BETWEEN 1 AND 9);
    END IF;
END $$;

-- 九星基本データの更新
INSERT INTO stars (id, name, element, home_direction, name_en, color, direction, season) VALUES
(1, '一白水星', '水', '北', 'Ippaku Suisei', ARRAY['黒', '紺', '青', '白'], '北', '冬'),
(2, '二黒土星', '土', '南西', 'Jikoku Dosei', ARRAY['黄色', '茶色', 'ベージュ', '黒'], '南西', '土用（夏→秋）'),
(3, '三碧木星', '木', '東', 'Sanpeki Mokusei', ARRAY['青', '緑', '水色'], '東', '春'),
(4, '四緑木星', '木', '南東', 'Shiroku Mokusei', ARRAY['緑', '青緑', '水色'], '南東', '春（晩春）'),
(5, '五黄土星', '土', '中央', 'Goou Dosei', ARRAY['黄色', 'ゴールド', '茶色'], '中央', '土用（全季節の変わり目）'),
(6, '六白金星', '金', '北西', 'Roppaku Kinsei', ARRAY['白', '金', '銀', 'グレー'], '北西', '秋（晩秋）'),
(7, '七赤金星', '金', '西', 'Shichiseki Kinsei', ARRAY['赤', 'ピンク', '金', '白'], '西', '秋'),
(8, '八白土星', '土', '北東', 'Happaku Dosei', ARRAY['白', '黄色', '茶色'], '北東', '土用（冬→春）'),
(9, '九紫火星', '火', '南', 'Kyushi Kasei', ARRAY['紫', '赤', 'オレンジ', '緑'], '南', '夏')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    element = EXCLUDED.element,
    home_direction = EXCLUDED.home_direction,
    name_en = EXCLUDED.name_en,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

-- ========================================
-- PART 2: star_profilesテーブル
-- ========================================

CREATE TABLE IF NOT EXISTS star_profiles (
    star_id INTEGER PRIMARY KEY REFERENCES stars(id),
    core_essence TEXT NOT NULL,
    cosmic_principle TEXT,
    elemental_reason TEXT,
    life_direction TEXT,
    inner_nature TEXT,
    spiritual_path TEXT,
    strengths TEXT[],
    weaknesses TEXT[],
    hidden_talents TEXT[],
    life_theme TEXT,
    suitable_jobs TEXT[],
    work_style TEXT,
    success_keys TEXT,
    love_style TEXT,
    family_role TEXT,
    health_vulnerabilities TEXT[],
    health_recommendations TEXT[],
    money_attitude TEXT,
    wealth_building TEXT,
    youth_period TEXT,
    middle_period TEXT,
    elder_period TEXT,
    lucky_colors TEXT[],
    lucky_directions TEXT[],
    lucky_items TEXT[],
    lucky_habits TEXT[],
    things_to_avoid TEXT[],
    traditional_wisdom TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 九星プロフィールデータ投入（一白水星）
INSERT INTO star_profiles (
    star_id, core_essence, cosmic_principle, elemental_reason,
    life_direction, inner_nature, spiritual_path,
    strengths, weaknesses, hidden_talents, life_theme,
    suitable_jobs, work_style, success_keys,
    love_style, family_role,
    health_vulnerabilities, health_recommendations,
    money_attitude, wealth_building,
    youth_period, middle_period, elder_period,
    lucky_colors, lucky_directions, lucky_items, lucky_habits, things_to_avoid,
    traditional_wisdom
) VALUES (
    1,
    '水の如く柔軟にして、深淵なる知恵を持つ。静かなる力の象徴。',
    '一白水星は洛書の配置で「1」の位置、北方に配されます。北は陰が極まり、新たな陽が胎動する場所。',
    '五行において水は「潤下」の性質を持ちます。下に流れ、低いところに集まり、あらゆる隙間に浸透する特性です。',
    '困難を水が流れるように迂回し、最終的には海に至る如く、目標に到達する。',
    '表面は穏やかだが、内面には深い思考と強い意志を秘めている。',
    '静寂の中に真理を見出し、柔軟性をもって万物に対応する道。',
    ARRAY['深い洞察力', '冷静な判断力', '柔軟な適応力', '秘密を守る', '粘り強さ', '直感力'],
    ARRAY['優柔不断', '秘密主義すぎる', '孤独を好みすぎる', '感情を表に出さない'],
    ARRAY['深層心理の理解', '交渉能力', '調査・分析力', '危機管理能力'],
    '静水深流 - 表面は穏やかでも深い流れを持つ',
    ARRAY['研究職', 'カウンセラー', '医療関係', '文筆業', '探偵', '心理学者', 'データアナリスト'],
    '単独行動を好み、深く考えて行動する。裏方での調整役としても優れる。',
    '忍耐と継続が成功の鍵。急がず、水が岩を穿つように着実に進む。',
    '感情を表に出さないが、内面では深く愛する。一途で献身的。',
    '家族を大切にするが、独立した空間も必要とする。子供の心理を深く理解する親。',
    ARRAY['腎臓', '膀胱', '生殖器系', '耳', '冷え性', '循環器系'],
    ARRAY['体を温める食事', '適度な運動', '十分な水分補給', '冷えから身を守る'],
    '堅実で貯蓄を好む。投機よりも確実な資産形成を選ぶ。',
    '長期的な投資と堅実な貯蓄で財を成す。水のように少しずつ溜める。',
    '内向的で思慮深い青年期。学問に励み、基礎を固める時期。',
    '経験と知恵が花開く。他者からの信頼を得て、重要な役割を担う。',
    '深い智慧と経験で周囲を導く。精神的な充実を得る。',
    ARRAY['黒', '紺', '青', '白'],
    ARRAY['北'],
    ARRAY['水晶', '真珠', '水に関するもの', '魚の置物'],
    ARRAY['瞑想', '読書', '水辺の散歩', '静かな環境で過ごす'],
    ARRAY['過度な刺激', '騒がしい場所', '感情の抑圧しすぎ'],
    ARRAY['上善若水 - 最上の善は水の如し', '水は方円の器に従う - 柔軟性こそが最大の強さ', '滴水穿石 - 小さな積み重ねが大きな成果を生む']
) ON CONFLICT (star_id) DO UPDATE SET
    core_essence = EXCLUDED.core_essence,
    cosmic_principle = EXCLUDED.cosmic_principle,
    elemental_reason = EXCLUDED.elemental_reason,
    life_direction = EXCLUDED.life_direction,
    inner_nature = EXCLUDED.inner_nature,
    spiritual_path = EXCLUDED.spiritual_path,
    strengths = EXCLUDED.strengths,
    weaknesses = EXCLUDED.weaknesses,
    hidden_talents = EXCLUDED.hidden_talents,
    life_theme = EXCLUDED.life_theme,
    suitable_jobs = EXCLUDED.suitable_jobs,
    work_style = EXCLUDED.work_style,
    success_keys = EXCLUDED.success_keys,
    love_style = EXCLUDED.love_style,
    family_role = EXCLUDED.family_role,
    health_vulnerabilities = EXCLUDED.health_vulnerabilities,
    health_recommendations = EXCLUDED.health_recommendations,
    money_attitude = EXCLUDED.money_attitude,
    wealth_building = EXCLUDED.wealth_building,
    youth_period = EXCLUDED.youth_period,
    middle_period = EXCLUDED.middle_period,
    elder_period = EXCLUDED.elder_period,
    lucky_colors = EXCLUDED.lucky_colors,
    lucky_directions = EXCLUDED.lucky_directions,
    lucky_items = EXCLUDED.lucky_items,
    lucky_habits = EXCLUDED.lucky_habits,
    things_to_avoid = EXCLUDED.things_to_avoid,
    traditional_wisdom = EXCLUDED.traditional_wisdom,
    updated_at = NOW();

-- 二黒土星・三碧木星も同様に投入（省略 - 上記と同じ形式）

-- ========================================
-- PART 3: 知識データベーステーブル群
-- ========================================

-- 方位盤の種類テーブル
CREATE TABLE IF NOT EXISTS direction_board_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ja TEXT NOT NULL,
    description TEXT NOT NULL,
    period TEXT,
    rotation_rule TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 吉凶方位の種類テーブル
CREATE TABLE IF NOT EXISTS direction_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ja TEXT NOT NULL,
    category TEXT NOT NULL,
    scope TEXT NOT NULL,
    description TEXT NOT NULL,
    detailed_effects TEXT,
    severity_level INT,
    base_star_id INT REFERENCES stars(id),
    is_opposite_direction BOOLEAN DEFAULT FALSE,
    applies_to_boards TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 五行相生相剋関係テーブル
CREATE TABLE IF NOT EXISTS element_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_element TEXT NOT NULL,
    to_element TEXT NOT NULL,
    relation_type TEXT NOT NULL,
    relation_subtype TEXT,
    description TEXT,
    natural_phenomenon_example TEXT,
    effect_in_direction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_element, to_element, relation_type)
);

-- 傾斜宮テーブル
CREATE TABLE IF NOT EXISTS inclination_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palace_name TEXT NOT NULL UNIQUE,
    palace_name_en TEXT,
    associated_star_id INT REFERENCES stars(id),
    inner_nature TEXT NOT NULL,
    strengths TEXT[],
    weaknesses TEXT[],
    detailed_characteristics TEXT,
    with_lucky_god TEXT,
    with_unlucky_god TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 旅行・移動ルールテーブル
CREATE TABLE IF NOT EXISTS travel_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_type TEXT NOT NULL,
    min_distance_km INT,
    max_distance_km INT,
    min_nights INT,
    max_nights INT,
    applies_to TEXT[],
    effect_duration TEXT NOT NULL,
    effect_timing_rule TEXT,
    priority_rule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 同会パターンテーブル
CREATE TABLE IF NOT EXISTS doukai_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id INT REFERENCES stars(id),
    palace_position INT NOT NULL,
    fortune_level INT CHECK (fortune_level >= 1 AND fortune_level <= 5),
    period_description TEXT NOT NULL,
    general_fortune TEXT,
    business_fortune TEXT,
    love_fortune TEXT,
    health_fortune TEXT,
    advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(star_id, palace_position)
);

-- ========================================
-- PART 4: データ投入
-- ========================================

-- 旅行ルール
INSERT INTO travel_rules (board_type, min_distance_km, max_distance_km, min_nights, max_nights, applies_to, effect_duration, effect_timing_rule, priority_rule) VALUES
('year', 500, NULL, 3, NULL, ARRAY['travel', 'relocation', 'long_trip'], '60年間効果が持続', '当年、4年後、7年後、10年後、13年後に効果が顕著に現れる', '年盤は最も重要。'),
('month', 200, 500, 1, 3, ARRAY['travel', 'short_trip'], '60ヶ月間効果が持続', '当月、4ヶ月後、7ヶ月後、10ヶ月後、13ヶ月後に効果が顕著に現れる', '年盤と月盤が重なる「開運日」は効果倍増。'),
('day', 0, 200, 0, 0, ARRAY['daily_activity', 'day_trip'], '60日間効果が持続', '当日、4日後、7日後、10日後、13日後に効果が顕著に現れる', '大開運日は極めて稀。'),
('time', 0, 20, 0, 0, ARRAY['daily_activity', 'local_movement'], '120時間効果が持続', '2時間ごとに変化。', '時盤は日常の微調整に使用。')
ON CONFLICT DO NOTHING;

-- 五行関係（相生）
INSERT INTO element_relations (from_element, to_element, relation_type, relation_subtype, description, natural_phenomenon_example, effect_in_direction) VALUES
('水', '木', 'sojo', 'seiki', '水が木を育てる関係。', '雨水が樹木を成長させる。', '進展・発展のエネルギーを得る。'),
('木', '火', 'sojo', 'seiki', '木が燃えて火を生む関係。', '薪が燃えて炎を作る。', '名声・名誉を得る。'),
('火', '土', 'sojo', 'seiki', '火が燃え尽きて灰となる関係。', '火山灰が肥沃な大地を作る。', '財産・不動産を得る。'),
('土', '金', 'sojo', 'seiki', '土の中で金属が生まれる関係。', '鉱山から金属が採掘される。', '金運上昇。'),
('金', '水', 'sojo', 'seiki', '金属の表面に水滴が結ぶ関係。', '金属に朝露が結ぶ。', '智慧を得る。')
ON CONFLICT (from_element, to_element, relation_type) DO UPDATE SET
    relation_subtype = EXCLUDED.relation_subtype,
    description = EXCLUDED.description,
    natural_phenomenon_example = EXCLUDED.natural_phenomenon_example,
    effect_in_direction = EXCLUDED.effect_in_direction;

-- 傾斜宮データ
INSERT INTO inclination_types (palace_name, palace_name_en, associated_star_id, inner_nature, strengths, weaknesses, detailed_characteristics, with_lucky_god, with_unlucky_god) VALUES
('坎宮傾斜', 'Kan Palace', 1, '内面に深い思索と神秘性を持つ。', ARRAY['深い洞察力', '直感力', '秘密を守る力'], ARRAY['内向的', '疑い深い'], '水の宮に傾斜する人は、表面的な付き合いよりも深い人間関係を求めます。', '直感力と智慧が開花します。', '疑心暗鬼に陥りやすくなります。'),
('坤宮傾斜', 'Kon Palace', 2, '内面に母性的な優しさと献身性を持つ。', ARRAY['献身的', '忍耐強い', '包容力'], ARRAY['自己主張が弱い', '尽くしすぎる'], '坤宮に傾斜する人は、縁の下の力持ちとして周囲を支えます。', '献身的な働きが認められます。', '過労や自己犠牲が過ぎます。')
ON CONFLICT (palace_name) DO UPDATE SET
    palace_name_en = EXCLUDED.palace_name_en,
    associated_star_id = EXCLUDED.associated_star_id,
    inner_nature = EXCLUDED.inner_nature,
    strengths = EXCLUDED.strengths,
    weaknesses = EXCLUDED.weaknesses,
    detailed_characteristics = EXCLUDED.detailed_characteristics,
    with_lucky_god = EXCLUDED.with_lucky_god,
    with_unlucky_god = EXCLUDED.with_unlucky_god;

-- 同会パターン
INSERT INTO doukai_patterns (star_id, palace_position, fortune_level, period_description, general_fortune, business_fortune, love_fortune, health_fortune, advice) VALUES
(1, 1, 2, '停滞期', '運気が落ち込む時期。', '新規事業は控える。', '出会いは少ない。', '冷えに注意。', '焦らず力を蓄える時期。'),
(1, 4, 5, '最高の発展期', '運気が最高潮。', '大プロジェクトが成功。', '理想的な相手と出会う。', '健康運良好。', '積極的に行動せよ。')
ON CONFLICT (star_id, palace_position) DO UPDATE SET
    fortune_level = EXCLUDED.fortune_level,
    period_description = EXCLUDED.period_description,
    general_fortune = EXCLUDED.general_fortune,
    business_fortune = EXCLUDED.business_fortune,
    love_fortune = EXCLUDED.love_fortune,
    health_fortune = EXCLUDED.health_fortune,
    advice = EXCLUDED.advice;

-- ========================================
-- PART 5: RLS設定
-- ========================================

ALTER TABLE star_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE direction_board_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE direction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE element_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inclination_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE doukai_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read star_profiles" ON star_profiles;
DROP POLICY IF EXISTS "Allow public read direction_board_types" ON direction_board_types;
DROP POLICY IF EXISTS "Allow public read direction_types" ON direction_types;
DROP POLICY IF EXISTS "Allow public read element_relations" ON element_relations;
DROP POLICY IF EXISTS "Allow public read inclination_types" ON inclination_types;
DROP POLICY IF EXISTS "Allow public read travel_rules" ON travel_rules;
DROP POLICY IF EXISTS "Allow public read doukai_patterns" ON doukai_patterns;

CREATE POLICY "Allow public read star_profiles" ON star_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read direction_board_types" ON direction_board_types FOR SELECT USING (true);
CREATE POLICY "Allow public read direction_types" ON direction_types FOR SELECT USING (true);
CREATE POLICY "Allow public read element_relations" ON element_relations FOR SELECT USING (true);
CREATE POLICY "Allow public read inclination_types" ON inclination_types FOR SELECT USING (true);
CREATE POLICY "Allow public read travel_rules" ON travel_rules FOR SELECT USING (true);
CREATE POLICY "Allow public read doukai_patterns" ON doukai_patterns FOR SELECT USING (true);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_star_profiles_star_id ON star_profiles(star_id);
CREATE INDEX IF NOT EXISTS idx_element_relations_elements ON element_relations(from_element, to_element);
CREATE INDEX IF NOT EXISTS idx_inclination_types_star ON inclination_types(associated_star_id);
CREATE INDEX IF NOT EXISTS idx_doukai_patterns_star_palace ON doukai_patterns(star_id, palace_position);
CREATE INDEX IF NOT EXISTS idx_travel_rules_board_type ON travel_rules(board_type);

-- 完了
