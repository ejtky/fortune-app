-- 占いデータの網羅的データベース化スキーマ

-- 1. stars テーブル (九星の基本データ)
CREATE TABLE IF NOT EXISTS stars (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    element TEXT NOT NULL,
    home_direction TEXT NOT NULL,
    symbolic_meanings TEXT[]
);

-- 2. personality_traits テーブル (性格診断)
CREATE TABLE IF NOT EXISTS personality_traits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id INT REFERENCES stars(id),
    trait_type TEXT NOT NULL, -- honmei / getsumei / keishaku
    title TEXT,
    description TEXT,
    career_advice TEXT,
    love_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. fortune_patterns テーブル (運勢解説)
CREATE TABLE IF NOT EXISTS fortune_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id INT REFERENCES stars(id),
    palace_id INT NOT NULL, -- 1-9 (回座する場所)
    luck_level INT CHECK (luck_level >= 1 AND luck_level <= 5),
    base_text TEXT,
    advice_business TEXT,
    advice_love TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(star_id, palace_id)
);

-- 4. direction_effects テーブル (方位効果)
CREATE TABLE IF NOT EXISTS direction_effects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id INT REFERENCES stars(id), -- その方位にいる星
    effect_title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS設定 (読み取りは全公開、書き込みは制限)
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE direction_effects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access for stars" ON stars FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for personality_traits" ON personality_traits FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for fortune_patterns" ON fortune_patterns FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for direction_effects" ON direction_effects FOR SELECT USING (true);
