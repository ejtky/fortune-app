-- ========================================
-- 完全な知識ベース拡張マイグレーション
-- Complete Knowledge Base Expansion Migration
-- 作成日: 2026-01-06
-- ========================================

-- ========================================
-- PART 1: 九星マスターデータとプロフィール
-- ========================================

-- 九星マスターテーブル
CREATE TABLE IF NOT EXISTS stars (
    id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 9),
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    element TEXT NOT NULL,
    color TEXT[],
    direction TEXT,
    season TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 九星基本データ投入
INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(1, '一白水星', 'Ippaku Suisei', '水', ARRAY['黒', '紺', '青', '白'], '北', '冬'),
(2, '二黒土星', 'Jikoku Dosei', '土', ARRAY['黄色', '茶色', 'ベージュ', '黒'], '南西', '土用（夏→秋）'),
(3, '三碧木星', 'Sanpeki Mokusei', '木', ARRAY['青', '緑', '水色'], '東', '春'),
(4, '四緑木星', 'Shiroku Mokusei', '木', ARRAY['緑', '青緑', '水色'], '南東', '春（晩春）'),
(5, '五黄土星', 'Goou Dosei', '土', ARRAY['黄色', 'ゴールド', '茶色'], '中央', '土用（全季節の変わり目）'),
(6, '六白金星', 'Roppaku Kinsei', '金', ARRAY['白', '金', '銀', 'グレー'], '北西', '秋（晩秋）'),
(7, '七赤金星', 'Shichiseki Kinsei', '金', ARRAY['赤', 'ピンク', '金', '白'], '西', '秋'),
(8, '八白土星', 'Happaku Dosei', '土', ARRAY['白', '黄色', '茶色'], '北東', '土用（冬→春）'),
(9, '九紫火星', 'Kyushi Kasei', '火', ARRAY['紫', '赤', 'オレンジ', '緑'], '南', '夏')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

-- 九星詳細プロフィールテーブル
CREATE TABLE IF NOT EXISTS star_profiles (
    star_id INTEGER PRIMARY KEY REFERENCES stars(id),

    -- 本質
    core_essence TEXT NOT NULL,
    cosmic_principle TEXT,
    elemental_reason TEXT,
    life_direction TEXT,
    inner_nature TEXT,
    spiritual_path TEXT,

    -- 性格
    strengths TEXT[],
    weaknesses TEXT[],
    hidden_talents TEXT[],
    life_theme TEXT,

    -- 人生の各分野
    suitable_jobs TEXT[],
    work_style TEXT,
    success_keys TEXT,
    love_style TEXT,
    family_role TEXT,
    health_vulnerabilities TEXT[],
    health_recommendations TEXT[],
    money_attitude TEXT,
    wealth_building TEXT,

    -- 人生サイクル
    youth_period TEXT,
    middle_period TEXT,
    elder_period TEXT,

    -- 開運法
    lucky_colors TEXT[],
    lucky_directions TEXT[],
    lucky_items TEXT[],
    lucky_habits TEXT[],
    things_to_avoid TEXT[],

    -- 伝統的教え
    traditional_wisdom TEXT[],

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PART 2: 九星詳細プロフィールデータ投入
-- ========================================

-- 一白水星
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
    '一白水星は洛書の配置で「1」の位置、北方に配されます。北は陰が極まり、新たな陽が胎動する場所。冬至の後、地中では春への準備が密かに始まります。',
    '五行において水は「潤下」の性質を持ちます。下に流れ、低いところに集まり、あらゆる隙間に浸透する特性です。水は形を持たず、器に従いますが、集まれば大海となります。',
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
    ARRAY[
        '上善若水 - 最上の善は水の如し',
        '水は方円の器に従う - 柔軟性こそが最大の強さ',
        '滴水穿石 - 小さな積み重ねが大きな成果を生む'
    ]
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

-- 二黒土星
INSERT INTO star_profiles (
    star_id, core_essence, life_direction, inner_nature, spiritual_path,
    strengths, weaknesses, hidden_talents, life_theme,
    suitable_jobs, work_style, success_keys,
    love_style, family_role,
    health_vulnerabilities, health_recommendations,
    money_attitude, wealth_building,
    youth_period, middle_period, elder_period,
    lucky_colors, lucky_directions, lucky_items, lucky_habits, things_to_avoid,
    traditional_wisdom
) VALUES (
    2,
    '大地の如く全てを受け入れ、育む母なる存在。献身と奉仕の象徴。',
    '他者を支え、育てることで自らも成長する。縁の下の力持ちとして価値を発揮。',
    '誠実で真面目。責任感が強く、コツコツと努力を積み重ねる。',
    '無私の奉仕を通じて、真の豊かさと満足を得る道。',
    ARRAY['誠実', '勤勉', '責任感が強い', '世話好き', '忍耐力', '現実的'],
    ARRAY['優柔不断', '頑固', '心配性', '自己主張が弱い', '他人に尽くしすぎる'],
    ARRAY['組織運営能力', '細部への注意力', '人を育てる力', '粘り強さ'],
    '厚徳載物 - 厚い徳をもって万物を載せる',
    ARRAY['農業', '不動産', '介護・福祉', '教育', '事務職', '経理', '公務員'],
    '地道にコツコツと。縁の下の力持ちとして組織を支える。',
    '努力と忍耐が実を結ぶ。急がず、確実に基盤を固めることが成功への道。',
    '献身的で尽くすタイプ。派手さはないが、誠実で安定した愛情を提供。',
    '家族を第一に考え、家庭を守ることに喜びを感じる。',
    ARRAY['胃腸', '脾臓', '消化器系', '皮膚', '過労'],
    ARRAY['規則正しい食事', '適度な休息', '趣味を持つ', 'ストレス解消'],
    '堅実な貯蓄家。無駄遣いせず、コツコツと財を築く。',
    '不動産投資や長期的な資産形成が向く。地道な努力が財を成す。',
    '真面目で勤勉。早くから責任を負い、苦労を経験することも。',
    '努力が実を結び、安定と信頼を得る。家庭と仕事の両立に成功。',
    '蓄積された経験と信頼で、周囲から頼りにされる存在に。',
    ARRAY['黄色', '茶色', 'ベージュ', '黒'],
    ARRAY['南西'],
    ARRAY['陶器', '土に関するもの', '植物', '四角い物'],
    ARRAY['園芸', '料理', '整理整頓', '早寝早起き'],
    ARRAY['過労', '自己犠牲のしすぎ', '完璧主義', '心配しすぎ'],
    ARRAY[
        '地厚く徳を載せる - 大地のように厚い徳で万物を支える',
        '積善の家には必ず余慶あり',
        '勤勉は富の母'
    ]
) ON CONFLICT (star_id) DO UPDATE SET
    core_essence = EXCLUDED.core_essence,
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

-- 三碧木星
INSERT INTO star_profiles (
    star_id, core_essence, life_direction, inner_nature, spiritual_path,
    strengths, weaknesses, hidden_talents, life_theme,
    suitable_jobs, work_style, success_keys,
    love_style, family_role,
    health_vulnerabilities, health_recommendations,
    money_attitude, wealth_building,
    youth_period, middle_period, elder_period,
    lucky_colors, lucky_directions, lucky_items, lucky_habits, things_to_avoid,
    traditional_wisdom
) VALUES (
    3,
    '春の若木の如く、成長と発展のエネルギーに満ちている。行動と挑戦の象徴。',
    '常に前進し、新しいことに挑戦する。失敗を恐れず、経験から学ぶ。',
    '明朗快活で正直。エネルギッシュで、じっとしていられない性格。',
    '行動を通じて成長し、正直さと誠実さで道を切り開く。',
    ARRAY['行動力', '明朗快活', '正直', '素直', '発展性', 'ポジティブ'],
    ARRAY['せっかち', '短気', '計画性に欠ける', '飽きっぽい', '落ち着きがない'],
    ARRAY['企画力', 'コミュニケーション能力', '新規事業開拓', '瞬発力'],
    '雷声震動 - 雷のように行動し、世界を震わせる',
    ARRAY['営業', '広告', 'マスコミ', 'IT', 'スポーツ', '音楽', '起業家'],
    '行動第一。フットワーク軽く、新しいことにどんどん挑戦。',
    '若いうちに行動し、多くの経験を積むことが成功への道。失敗を恐れない。',
    '情熱的で素直。好きになったら一直線。恋愛は派手で激しい。',
    '明るく賑やかな家庭を作る。子供っぽい一面も。',
    ARRAY['肝臓', '神経系', '事故', '怪我', 'ストレス'],
    ARRAY['適度な運動', '十分な睡眠', '深呼吸', 'リラックス時間の確保'],
    '入るのも早いが出るのも早い。計画的な貯蓄が苦手。',
    '収入の一部を自動的に貯蓄する仕組みを作る。投資よりも事業で。',
    'エネルギッシュで何事にも積極的。多くの経験を積み、基礎を作る。',
    '若さのエネルギーを社会で発揮。リーダーシップを発揮する時期。',
    '経験を活かし、若い世代を導く。活発さは変わらない。',
    ARRAY['青', '緑', '水色'],
    ARRAY['東'],
    ARRAY['観葉植物', '木製品', '音を出すもの', '楽器'],
    ARRAY['朝の運動', '音楽を聴く', '新しいことへの挑戦', '外出'],
    ARRAY['じっとしていること', '過度の飲酒', '無計画な行動', '短気な対応'],
    ARRAY[
        '雷は速やかにして動く - 即断即決の力',
        '百聞は一見に如かず',
        '失敗は成功の母'
    ]
) ON CONFLICT (star_id) DO UPDATE SET
    core_essence = EXCLUDED.core_essence,
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

-- ========================================
-- PART 3: 方位・五行・傾斜宮・同会パターン
-- ========================================

-- 旅行ルールデータ（既存テーブルに追加）
INSERT INTO travel_rules (
    board_type, min_distance_km, max_distance_km,
    min_nights, max_nights, applies_to,
    effect_duration, effect_timing_rule, priority_rule
) VALUES
(
    'year', 500, NULL, 3, NULL,
    ARRAY['travel', 'relocation', 'long_trip'],
    '60年間効果が持続',
    '当年、4年後、7年後、10年後、13年後に効果が顕著に現れる',
    '年盤は最も重要。引越しや長期滞在には必ず年盤の吉方位を選ぶこと。'
),
(
    'month', 200, 500, 1, 3,
    ARRAY['travel', 'short_trip'],
    '60ヶ月間効果が持続',
    '当月、4ヶ月後、7ヶ月後、10ヶ月後、13ヶ月後に効果が顕著に現れる',
    '年盤と月盤が重なる「開運日」は効果倍増。'
),
(
    'day', 0, 200, 0, 0,
    ARRAY['daily_activity', 'day_trip', 'shopping'],
    '60日間効果が持続',
    '当日、4日後、7日後、10日後、13日後に効果が顕著に現れる',
    '年盤・月盤・日盤が重なる「大開運日」は極めて稀で、最大の吉日。'
),
(
    'time', 0, 20, 0, 0,
    ARRAY['daily_activity', 'local_movement'],
    '120時間（5日間）効果が持続',
    '2時間ごとに方位が変化。短時間の行動に影響。',
    '時盤は日常の微調整に使用。'
)
ON CONFLICT DO NOTHING;

-- 五行関係データ（相生・相剋の詳細）
INSERT INTO element_relations (
    from_element, to_element, relation_type, relation_subtype,
    description, natural_phenomenon_example, effect_in_direction
) VALUES
('水', '木', 'sojo', 'seiki',
 '水が木を育てる関係。相手から良い影響とエネルギーを受け取る。',
 '雨水が樹木を成長させる。',
 '進展・発展のエネルギーを得る。新しいことが始まる。'),
('木', '火', 'sojo', 'seiki',
 '木が燃えて火を生む関係。',
 '薪が燃えて炎を作る。',
 '名声・名誉を得る。情熱が高まる。'),
('火', '土', 'sojo', 'seiki',
 '火が燃え尽きて灰（土）となる関係。',
 '火山灰が肥沃な大地を作る。',
 '財産・不動産を得る。基盤が固まる。'),
('土', '金', 'sojo', 'seiki',
 '土の中で金属が生まれる関係。',
 '鉱山から金属が採掘される。',
 '金運上昇。収穫を得る。'),
('金', '水', 'sojo', 'seiki',
 '金属の表面に水滴が結ぶ関係。',
 '金属に朝露が結ぶ。',
 '智慧を得る。秘密の情報を得る。')
ON CONFLICT (from_element, to_element, relation_type) DO UPDATE SET
    relation_subtype = EXCLUDED.relation_subtype,
    description = EXCLUDED.description,
    natural_phenomenon_example = EXCLUDED.natural_phenomenon_example,
    effect_in_direction = EXCLUDED.effect_in_direction;

-- 傾斜宮データ
INSERT INTO inclination_types (
    palace_name, palace_name_en, associated_star_id,
    inner_nature, strengths, weaknesses,
    detailed_characteristics, with_lucky_god, with_unlucky_god
) VALUES
(
    '坎宮傾斜', 'Kan Palace (Water)', 1,
    '内面に深い思索と神秘性を持つ。',
    ARRAY['深い洞察力', '直感力', '秘密を守る力'],
    ARRAY['内向的', '疑い深い', '感情を表に出さない'],
    '水の宮に傾斜する人は、表面的な付き合いよりも深い人間関係を求めます。',
    '直感力と智慧が開花し、困難な状況でも正しい判断ができます。',
    '疑心暗鬼に陥りやすく、孤立する傾向があります。'
),
(
    '坤宮傾斜', 'Kon Palace (Earth-Southwest)', 2,
    '内面に母性的な優しさと献身性を持つ。',
    ARRAY['献身的', '忍耐強い', '包容力'],
    ARRAY['自己主張が弱い', '尽くしすぎる', '優柔不断'],
    '坤宮に傾斜する人は、縁の下の力持ちとして周囲を支える役割を自然に引き受けます。',
    '献身的な働きが認められ、多くの人から信頼を得ます。',
    '過労や自己犠牲が過ぎて体調を崩しやすくなります。'
)
ON CONFLICT (palace_name) DO UPDATE SET
    palace_name_en = EXCLUDED.palace_name_en,
    associated_star_id = EXCLUDED.associated_star_id,
    inner_nature = EXCLUDED.inner_nature,
    strengths = EXCLUDED.strengths,
    weaknesses = EXCLUDED.weaknesses,
    detailed_characteristics = EXCLUDED.detailed_characteristics,
    with_lucky_god = EXCLUDED.with_lucky_god,
    with_unlucky_god = EXCLUDED.with_unlucky_god;

-- 同会パターンデータ
INSERT INTO doukai_patterns (
    star_id, palace_position, fortune_level,
    period_description, general_fortune, business_fortune,
    love_fortune, health_fortune, advice
) VALUES
(1, 1, 2, '停滞期',
 '運気が落ち込み、物事がスムーズに運ばない時期。',
 '新規事業は控え、現状維持を心がける。',
 '出会いは少ない時期。既存の関係を大切に。',
 '冷えや泌尿器系のトラブルに注意。',
 '焦らず、水が氷る冬のように静かに力を蓄える時期。'),
(1, 4, 5, '最高の発展期',
 '運気が最高潮に達する。チャンスが次々と訪れる。',
 '大きなプロジェクトが成功する。',
 '理想的な相手と出会う。結婚・婚約に最適。',
 '健康運も良好。ただし忙しすぎて過労に注意。',
 '人生の中でも稀な幸運期。積極的に行動し、チャンスを最大限に活かせ。')
ON CONFLICT (star_id, palace_position) DO UPDATE SET
    fortune_level = EXCLUDED.fortune_level,
    period_description = EXCLUDED.period_description,
    general_fortune = EXCLUDED.general_fortune,
    business_fortune = EXCLUDED.business_fortune,
    love_fortune = EXCLUDED.love_fortune,
    health_fortune = EXCLUDED.health_fortune,
    advice = EXCLUDED.advice;

-- ========================================
-- インデックスとRLS設定
-- ========================================

CREATE INDEX IF NOT EXISTS idx_star_profiles_star_id ON star_profiles(star_id);

ALTER TABLE IF EXISTS stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS star_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-only access for stars" ON stars;
DROP POLICY IF EXISTS "Allow public read-only access for star_profiles" ON star_profiles;

CREATE POLICY "Allow public read-only access for stars"
    ON stars FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for star_profiles"
    ON star_profiles FOR SELECT USING (true);

-- 完了
