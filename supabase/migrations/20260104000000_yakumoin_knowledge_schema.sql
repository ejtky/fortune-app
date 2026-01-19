-- yakumoin.infoから取得した知識データベーススキーマ

-- 1. 知識記事テーブル（一般的な説明文）
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- URL識別子 (例: kyusei_kigaku, houiban)
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- about, guide, reference
    content TEXT NOT NULL,
    summary TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 方位盤の種類テーブル
CREATE TABLE IF NOT EXISTS direction_board_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ja TEXT NOT NULL,
    description TEXT NOT NULL,
    period TEXT, -- annual, monthly, daily, hourly
    rotation_rule TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 吉凶方位の種類テーブル
CREATE TABLE IF NOT EXISTS direction_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_ja TEXT NOT NULL,
    category TEXT NOT NULL, -- auspicious, inauspicious, universal
    scope TEXT NOT NULL, -- universal, personal, children
    description TEXT NOT NULL,
    detailed_effects TEXT,
    severity_level INT, -- 1-5 (1=weak, 5=extreme)
    base_star_id INT REFERENCES stars(id), -- 関連する九星（該当する場合）
    is_opposite_direction BOOLEAN DEFAULT FALSE, -- 対面方位かどうか
    applies_to_boards TEXT[], -- ['year', 'month', 'day', 'time']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 五行相生相剋関係テーブル
CREATE TABLE IF NOT EXISTS element_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_element TEXT NOT NULL, -- wood, fire, earth, metal, water
    to_element TEXT NOT NULL,
    relation_type TEXT NOT NULL, -- sojo (相生), sokoku (相剋), hiwa (比和)
    relation_subtype TEXT, -- seiki (生気), taiki (退気), sakki (殺気), shiki (死気)
    description TEXT,
    natural_phenomenon_example TEXT, -- 自然現象の例
    effect_in_direction TEXT, -- 方位利用時の効果
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_element, to_element, relation_type)
);

-- 5. 傾斜宮テーブル
CREATE TABLE IF NOT EXISTS inclination_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palace_name TEXT NOT NULL, -- 坎宮、坤宮、震宮、etc.
    palace_name_en TEXT,
    associated_star_id INT REFERENCES stars(id),
    inner_nature TEXT NOT NULL,
    strengths TEXT[],
    weaknesses TEXT[],
    detailed_characteristics TEXT,
    with_lucky_god TEXT, -- 吉神がある場合の効果
    with_unlucky_god TEXT, -- 凶神がある場合の効果
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 旅行・移動ルールテーブル
CREATE TABLE IF NOT EXISTS travel_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_type TEXT NOT NULL, -- year, month, day, time
    min_distance_km INT,
    max_distance_km INT,
    min_nights INT,
    max_nights INT,
    applies_to TEXT[], -- ['travel', 'relocation', 'daily_activity']
    effect_duration TEXT NOT NULL, -- 60 years, 60 months, etc.
    effect_timing_rule TEXT, -- 4,7,10,13の法則
    priority_rule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 同会パターンテーブル（運勢判断）
CREATE TABLE IF NOT EXISTS doukai_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id INT REFERENCES stars(id),
    palace_position INT NOT NULL, -- 1-9
    fortune_level INT CHECK (fortune_level >= 1 AND fortune_level <= 5),
    period_description TEXT NOT NULL, -- 停滞期、発展期、など
    general_fortune TEXT,
    business_fortune TEXT,
    love_fortune TEXT,
    health_fortune TEXT,
    advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(star_id, palace_position)
);

-- RLS設定 (全て読み取り専用で公開)
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE direction_board_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE direction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE element_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inclination_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE doukai_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access for knowledge_articles" ON knowledge_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for direction_board_types" ON direction_board_types FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for direction_types" ON direction_types FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for element_relations" ON element_relations FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for inclination_types" ON inclination_types FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for travel_rules" ON travel_rules FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for doukai_patterns" ON doukai_patterns FOR SELECT USING (true);

-- インデックス作成
CREATE INDEX idx_knowledge_articles_slug ON knowledge_articles(slug);
CREATE INDEX idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX idx_direction_types_category ON direction_types(category);
CREATE INDEX idx_element_relations_from_to ON element_relations(from_element, to_element);
CREATE INDEX idx_inclination_types_star ON inclination_types(associated_star_id);
CREATE INDEX idx_travel_rules_board_type ON travel_rules(board_type);
CREATE INDEX idx_doukai_patterns_star ON doukai_patterns(star_id);
