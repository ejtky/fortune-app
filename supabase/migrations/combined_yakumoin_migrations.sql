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
-- yakumoin.infoから取得した知識データの投入

-- 1. 知識記事の投入
INSERT INTO knowledge_articles (slug, title, category, content, summary, order_index) VALUES
(
  'kyusei_kigaku',
  '九星気学とは',
  'about',
  E'九星気学は、人間が生まれた瞬間に受けたエネルギー「気」の影響によって個人の資質や運命が判明するという占術です。\n\n## 九つの星\n一白水星、二黒土星、三碧木星、四緑木星、五黄土星、六白金星、七赤金星、八白土星、九紫火星の9つの星があります。\n\n## 方位のエネルギー\n東西南北のような方位にもエネルギーが宿っており、自分の九星と各方位を組み合わせることで運勢が決定されます。\n\n## 暦の考え方\n年は「立春」から、月は「節入り」から始まり、一般的な暦とは異なります。\n\n## 核となる二つの星\n- **本命星**：生まれた年から算出\n- **月命星**：本命星と生まれた月を組み合わせて算出',
  '九星気学の基本概念と、九つの星、方位のエネルギー、本命星と月命星について',
  1
),
(
  'houiban',
  '方位盤について',
  'about',
  E'方位盤は九星気学の重要な要素で、8つの方位に九星が配置され、吉凶を判断します。\n\n## 5種類の方位盤\n\n1. **後天定位盤（こうてんじょういばん）**：九星の固定位置を示す基本配置\n2. **年盤（ねんばん）**：毎年変わる年間の方位盤\n3. **月盤（げつばん）**：毎月変わる月間の方位盤\n4. **日盤（にちばん）**：毎日変わる日々の方位盤\n5. **時盤（じばん）**：2時間ごとに変わる時間帯の方位盤\n\n「回座（かいざ）」とは、九星が中央の位置に移動することを指します。\n\n## 表示オプション\n\n- **8方位**：60度間隔での方位表示\n- **12方位**：30度刻みの詳細な方位表示（十二支に対応）\n\n## 八卦（はっけ）\n\n8つの卦は自然の要素を表し、中宮を除く各方位に対応しています。',
  '方位盤の5種類（後天定位盤、年盤、月盤、日盤、時盤）と表示オプション、八卦について',
  2
),
(
  'direction',
  '吉凶方位の種類',
  'about',
  E'九星気学における方位の吉凶を理解するための総合ガイド。良い方位を取り、運を開くことが目的です。\n\n## 凶方位の分類\n\n### 万人共通の凶方位\n\n**五黄殺（ごおうさつ）**：五黄土星が位置する方位。帝王の星とも呼ばれ、全てを土に返す腐敗作用をもたらします。どのような理由であっても避けるべき大凶方位です。\n\n**暗剣殺（あんけんさつ）**：五黄殺の対面方位。予期せぬ災いや突発的な病気・事故など防ぎようのないトラブルが特徴です。\n\n**破（歳破・月破・日破・時破）**：十二支の対面方位。積み重ねてきたものが崩れたり、体調不良をもたらします。\n\n**定位対冲（ていいたいちゅう）**：九星が本来の定位置と反対側に位置する状態。\n\n### 個人の九星による凶方位\n\n**本命殺（ほんめいさつ）**：本命星が位置する方位で、身体に関わる災いが起きやすい方位。\n\n**本命的殺（ほんめいてきさつ）**：本命星の対面方位で、精神に関わる災いが主となります。\n\n**月命殺・月命的殺**：月命星に関連する凶方位。\n\n### 子供に作用する凶方位\n\n**小児殺（しょうにさつ）**：月盤のみに存在し、12歳以下の子供にのみ影響します。\n\n## 吉方位\n\n**最大吉方**：本命星と月命星に共通して相性の良い九星の方位。\n\n**吉方**：本命星と相性の良い九星の方位。\n\n## 万人共通の吉方位\n\n**天道（てんどう）**：万人に吉となる方位。方位の効果をアップさせる力があり、凶運を吉運へと変える力を持ちます。ただし、五黄殺、暗剣殺、月破とは相互作用できません。',
  '吉凶方位の種類と詳細説明。凶方位（五黄殺、暗剣殺、破、本命殺など）と吉方位（最大吉方、吉方、天道）について',
  3
),
(
  'direction_effect',
  '方位取りの効果',
  'about',
  E'九星気学では、単に吉方位へ行くだけでなく、「目的に合った方位を取る」ことが重要です。各方位には九星の「象意」（特定の意味や象徴）があり、その象意に沿った効果が現れます。\n\n## 効果を最大化する条件\n\n- **定位優先**：複数の吉方位がある場合、定位（固定位置）を優先します\n- **方位盤の重なり**：月盤と日盤が重なる日を「開運日」、年盤・月盤・日盤が重なる日を「大開運日」とし、効果が倍増します\n\n## 各方位の効果一覧\n\n### 北（一白水星）\n- 吉方位：新規事業成功、援助、良い出会い、交友拡大\n- 凶方位：失敗、損失、裏切り、散財\n\n### 南西（二黒土星）\n- 吉方位：勤労意欲、忍耐力、不動産運\n- 凶方位：意欲喪失、中途半端、不動産損失\n\n### 東（三碧木星）\n- 吉方位：進展、活力向上、交渉成功\n- 凶方位：停滞、やる気喪失、電子機器故障\n\n### 南東（四緑木星）\n- 吉方位：結果獲得、信用獲得、良い出会い、結婚\n- 凶方位：停滞、信用喪失、別れ、離婚\n\n### 中央（五黄土星）\n- 吉方位：なし\n- 凶方位：財産喪失、事故、怪我、病気\n\n### 北西（六白金星）\n- 吉方位：昇進、事業成功、投資成功、リーダーシップ\n- 凶方位：空回り、反感、投資失敗、頭痛\n\n### 西（七赤金星）\n- 吉方位：金運上昇、援助、話術向上、結婚\n- 凶方位：散財、金融失敗、口論、別れ\n\n### 北東（八白土星）\n- 吉方位：好転、財産増加、就職成功、良い引越し\n- 凶方位：財産喪失、転職失敗、関節痛\n\n### 南（九紫火星）\n- 吉方位：昇進、名誉獲得、勉強進展、試験合格\n- 凶方位：評価低下、地位喪失、試験落第',
  '各方位の吉凶効果の詳細。9つの方位それぞれの象意と、吉方位・凶方位としての効果',
  4
),
(
  'gogyou_and_kyusei',
  '五行と九星',
  'about',
  E'五行は「木」「火」「土」「金」「水」の5つの性質で構成されます。これらの組み合わせにより、良好な相互作用と悪い相互作用が生じます。\n\n## 相生（そうしょう）の関係\n\n良い影響をもたらす関係を相生と呼びます。「木を擦り合わせて火をおこす」「水が木を育てる」といった自然現象に基づいています。\n\n### 相生の種類\n- **生気**：相手から良い影響を受ける関係\n- **退気**：相手に良い影響を与える関係\n- **比和**：同じ種類の五行との関係（ただし九星では同じ星同士は除外）\n\n五行の流れ：木→火→土→金→水（循環）\n\n## 相剋（そうこく）の関係\n\n悪影響をもたらす関係を相剋と呼びます。「金属工具が木を切る」といった対立的な自然現象が例です。\n\n### 相剋の種類\n- **殺気**：相手から悪い影響を受ける\n- **死気**：相手に悪い影響を与える\n\n## 方位利用時の特例\n\n方位として用いる場合、五黄土星との関係や同じ星との関係に特別なルールが適用され、良好な相生関係でも「五黄殺」「本命殺」として大凶方位となります。',
  '五行（木火土金水）の相生相剋関係。生気・退気・比和・殺気・死気の説明',
  5
),
(
  'unsei',
  '運勢について',
  'about',
  E'九星気学における運勢判断の中核となる「同会判断法」の説明。2つの方位盤を上下に重ねることが同会の定義で、上の盤の本命星の位置を基準として、下の盤の方位と九星から運勢を解釈します。\n\n## 運勢レベルごとの適用方法\n\n- **年運**：年盤を上に、後天定位盤を下に配置\n- **月運**：月盤を上に、年盤を下に配置\n- **日運**：日盤を上に、月盤を下に配置\n\n## 9つの同会パターンと運勢\n\n各方位に対応する9つの星には異なる運勢特性があります。例えば、一白水星同会は「運気が落ち込み物事がスムーズに運ばない停滞期」、四緑木星同会は「運気の波が最高潮に達する発展の時期」と解釈されます。\n\n実際の判断には「同会する九星との相性（相生・相剋）」や「本命星の回座している方位の吉凶」も加味する必要があります。',
  '同会判断法による運勢判断の方法。年運・月運・日運の判断方法',
  6
),
(
  'keisha',
  '傾斜について',
  'about',
  E'傾斜とは「性格や運勢など様々な判断に用いることができる考え方」です。本命星が表す表面的性質に対し、傾斜は「人の内面に存在する性質」を判断するために使用されます。\n\n## 計算方法\n\n**本命星と月命星が異なる場合：**\n生まれた月の月盤上で本命星がどの宮に位置するかで傾斜が決まります。\n\n**本命星と月命星が同じ場合（中宮傾斜）：**\n本命星と月命星の組み合わせごとに傾斜宮が決まっています。五黄土星の場合のみ性別で異なります。\n\n## 8つの傾斜宮\n\n- 坎宮傾斜（一白水星）\n- 坤宮傾斜（二黒土星）\n- 震宮傾斜（三碧木星）\n- 巽宮傾斜（四緑木星）\n- 乾宮傾斜（六白金星）\n- 兌宮傾斜（七赤金星）\n- 艮宮傾斜（八白土星）\n- 離宮傾斜（九紫火星）\n\n## 方位神との組み合わせ\n\n傾斜宮の方位に吉神（天道・天徳など）が存在する場合、周囲の助けや良い出会いに恵まれるなど、様々な場面で幸運や福徳を授かる機会が多い傾向があります。反対に凶神がある場合は波乱が多くなります。',
  '傾斜（内面の性格）の計算方法と8つの傾斜宮の説明',
  7
),
(
  'distance_and_span',
  '吉凶の距離と期間',
  'about',
  E'九星気学では「吉凶は動より生ず」という考えに基づいており、行動を起こすことで良い結果（方徳）または悪い結果（方災）が生じます。効果を高めるには「できるだけ遠くへ行き、その場所で長時間過ごす」ことが重要です。\n\n## 方位盤と距離・期間の関係\n\n### 年盤の対象\n- 3泊4日以上の国内旅行\n- 500km以上の旅行\n- 海外旅行\n- 引越し\n\n### 月盤の対象\n- 1泊2日～2泊3日程度の国内旅行\n- 200～500kmの国内旅行\n- 500km以上の国内日帰り旅行\n\n### 日盤の対象\n- 200km以内の日帰り旅行\n- 日常的行動（買い物、散歩等）\n\n### 時盤の対象\n- 約20km範囲内の行動\n\n## 優先順位\n\n「滞在期間の長い方、移動距離の長い方を優先」します。例えば20km短距離でも2泊する場合は月盤を用います。\n\n## 吉凶効果の持続期間\n\n- 年盤：60年\n- 月盤：60ヶ月\n- 日盤：60日\n- 時盤：120時間\n\n## 「4、7、10、13の法則」\n\n効果が現れやすいタイミングは、年盤なら当年・4年後・7年後・10年後・13年後となります。\n\n## 引越し後の根付け\n\n新居で60日間、22時30分までに帰宅し、十分な睡眠を確保してエネルギー吸収を促進する儀式です。\n\n## グループ旅行\n\n主体者（家長や幹事）の方位盤を優先し、天道吉方を活用します。',
  '方位盤ごとの距離と期間の基準、効果の持続期間、4・7・10・13の法則',
  8
);
-- yakumoin.infoから取得した参照データの投入

-- 1. 方位盤の種類
INSERT INTO direction_board_types (name, name_ja, description, period, rotation_rule, display_order) VALUES
(
  'koten_joi_ban',
  '後天定位盤',
  '九星の固定位置を示す基本配置。全ての方位盤の基準となる。',
  'fixed',
  '固定（変化しない）',
  1
),
(
  'nen_ban',
  '年盤',
  '毎年変わる年間の方位盤。3泊4日以上の旅行、500km以上の移動、海外旅行、引越しに適用。',
  'annual',
  '毎年立春に九星が回座',
  2
),
(
  'getsu_ban',
  '月盤',
  '毎月変わる月間の方位盤。1泊2日～2泊3日の旅行、200～500kmの移動に適用。',
  'monthly',
  '毎月節入りに九星が回座',
  3
),
(
  'nichi_ban',
  '日盤',
  '毎日変わる日々の方位盤。200km以内の日帰り旅行、日常的行動に適用。',
  'daily',
  '毎日九星が回座',
  4
),
(
  'ji_ban',
  '時盤',
  '2時間ごとに変わる時間帯の方位盤。約20km範囲内の行動に適用。',
  'hourly',
  '2時間ごとに九星が回座',
  5
);

-- 2. 吉凶方位の種類（凶方位）
INSERT INTO direction_types (name, name_ja, category, scope, description, detailed_effects, severity_level, is_opposite_direction, applies_to_boards) VALUES
(
  'goo_satsu',
  '五黄殺',
  'inauspicious',
  'universal',
  '五黄土星が位置する方位。帝王の星とも呼ばれ、全てを土に返す腐敗作用をもたらす。',
  'どのような理由であっても避けるべき大凶方位。強い長期的災いを招く。',
  5,
  false,
  ARRAY['year', 'month', 'day', 'time']
),
(
  'anken_satsu',
  '暗剣殺',
  'inauspicious',
  'universal',
  '五黄殺の対面方位。五黄殺とともに二大凶方位と呼ばれる。',
  '予期せぬ災いや突発的な病気・事故など防ぎようのないトラブルが特徴。',
  5,
  true,
  ARRAY['year', 'month', 'day', 'time']
),
(
  'saiha',
  '歳破',
  'inauspicious',
  'universal',
  '十二支の対面方位（年盤）。積み重ねてきたものが崩れたり、体調不良をもたらす。',
  '破壊作用があり、努力が水泡に帰す。',
  4,
  true,
  ARRAY['year']
),
(
  'geppa',
  '月破',
  'inauspicious',
  'universal',
  '十二支の対面方位（月盤）。積み重ねてきたものが崩れたり、体調不良をもたらす。',
  '破壊作用があり、計画が頓挫する。',
  4,
  true,
  ARRAY['month']
),
(
  'nip_pa',
  '日破',
  'inauspicious',
  'universal',
  '十二支の対面方位（日盤）。小さな障害や不調をもたらす。',
  '日常的な小さなトラブルが発生しやすい。',
  2,
  true,
  ARRAY['day']
),
(
  'jiha',
  '時破',
  'inauspicious',
  'universal',
  '十二支の対面方位（時盤）。一時的な障害をもたらす。',
  '短時間の不運や小さな妨げ。',
  1,
  true,
  ARRAY['time']
),
(
  'teii_taichuu',
  '定位対冲',
  'inauspicious',
  'universal',
  '九星が本来の定位置と反対側に位置する状態。',
  '流派による解釈の違いがあるが、八雲院では万全を期するため考慮する。',
  3,
  true,
  ARRAY['year', 'month', 'day']
),
(
  'honmei_satsu',
  '本命殺',
  'inauspicious',
  'personal',
  '本命星が位置する方位。身体に関わる災いが起きやすい。',
  '突然の体調不良や怪我に注意が必要。健康面でのトラブルが発生しやすい。',
  4,
  false,
  ARRAY['year', 'month', 'day']
),
(
  'honmei_teki_satsu',
  '本命的殺',
  'inauspicious',
  'personal',
  '本命星の対面方位。精神に関わる災いが主となる。',
  '悩みやストレスが身体にも影響する。メンタル面での不調。',
  4,
  true,
  ARRAY['year', 'month', 'day']
),
(
  'getsumei_satsu',
  '月命殺',
  'inauspicious',
  'personal',
  '月命星が位置する方位。本命殺よりも影響が弱いながらも注意が必要。',
  '身体的な小さなトラブルが起こりやすい。',
  3,
  false,
  ARRAY['month', 'day']
),
(
  'getsumei_teki_satsu',
  '月命的殺',
  'inauspicious',
  'personal',
  '月命星の対面方位。精神面での小さな不調をもたらす。',
  '気分の落ち込みや小さなストレスが生じやすい。',
  3,
  true,
  ARRAY['month', 'day']
),
(
  'shoni_satsu',
  '小児殺',
  'inauspicious',
  'children',
  '月盤のみに存在し、12歳以下の子供にのみ影響する。',
  '突発的な病気や事故をもたらす。子供連れの旅行では特に注意。',
  4,
  false,
  ARRAY['month']
);

-- 3. 吉方位の種類
INSERT INTO direction_types (name, name_ja, category, scope, description, detailed_effects, severity_level, applies_to_boards) VALUES
(
  'saidai_kichihō',
  '最大吉方',
  'auspicious',
  'personal',
  '本命星と月命星に共通して相性の良い九星の方位。',
  '最も強力な吉作用をもたらす。ただし凶方位と重なると凶作用が優先される。',
  5,
  ARRAY['year', 'month', 'day']
),
(
  'kichihō',
  '吉方',
  'auspicious',
  'personal',
  '本命星と相性の良い九星の方位。',
  '吉作用をもたらすが、最大吉方には劣る。凶方位が優先される。',
  4,
  ARRAY['year', 'month', 'day']
),
(
  'tendō',
  '天道',
  'auspicious',
  'universal',
  '万人に吉となる方位。年盤と月盤に存在し、月盤の天道が重要視される。',
  '方位の効果をアップさせる力があり、凶運を吉運へと変える力を持つ。ただし五黄殺、暗剣殺、月破とは相互作用できない（凶運が増幅）。集団行動時の共通吉方位として機能。',
  5,
  ARRAY['year', 'month']
);

-- 4. 五行の相生相剋関係
INSERT INTO element_relations (from_element, to_element, relation_type, relation_subtype, description, natural_phenomenon_example, effect_in_direction) VALUES
-- 相生関係（木→火→土→金→水→木）
('wood', 'fire', 'sojo', 'seiki', '木が火を生む。木から良い影響を受ける。', '木を擦り合わせて火をおこす', '吉方位として使用可能（生気）'),
('fire', 'wood', 'sojo', 'taiki', '火が木に良い影響を与える（逆方向）。', '木を擦り合わせて火をおこす', '吉方位として使用可能（退気）'),
('fire', 'earth', 'sojo', 'seiki', '火が土を生む。火から良い影響を受ける。', '火が燃えて灰（土）になる', '吉方位として使用可能（生気）'),
('earth', 'fire', 'sojo', 'taiki', '土が火に良い影響を与える（逆方向）。', '火が燃えて灰（土）になる', '吉方位として使用可能（退気）'),
('earth', 'metal', 'sojo', 'seiki', '土が金を生む。土から良い影響を受ける。', '土の中から金属が採れる', '吉方位として使用可能（生気）'),
('metal', 'earth', 'sojo', 'taiki', '金が土に良い影響を与える（逆方向）。', '土の中から金属が採れる', '吉方位として使用可能（退気）'),
('metal', 'water', 'sojo', 'seiki', '金が水を生む。金から良い影響を受ける。', '金属の表面に水滴が結露する', '吉方位として使用可能（生気）'),
('water', 'metal', 'sojo', 'taiki', '水が金に良い影響を与える（逆方向）。', '金属の表面に水滴が結露する', '吉方位として使用可能（退気）'),
('water', 'wood', 'sojo', 'seiki', '水が木を生む。水から良い影響を受ける。', '水が木を育てる', '吉方位として使用可能（生気）'),
('wood', 'water', 'sojo', 'taiki', '木が水に良い影響を与える（逆方向）。', '水が木を育てる', '吉方位として使用可能（退気）'),

-- 相剋関係（木→土→水→火→金→木）
('wood', 'earth', 'sokoku', 'sakki', '木が土を剋す。木から悪い影響を受ける。', '木の根が土を侵食する', '凶方位（殺気）'),
('earth', 'wood', 'sokoku', 'shiki', '土が木に悪い影響を与える（逆方向）。', '木の根が土を侵食する', '凶方位（死気）'),
('earth', 'water', 'sokoku', 'sakki', '土が水を剋す。土から悪い影響を受ける。', '土が水を吸収し、塞き止める', '凶方位（殺気）'),
('water', 'earth', 'sokoku', 'shiki', '水が土に悪い影響を与える（逆方向）。', '土が水を吸収し、塞き止める', '凶方位（死気）'),
('water', 'fire', 'sokoku', 'sakki', '水が火を剋す。水から悪い影響を受ける。', '水が火を消す', '凶方位（殺気）'),
('fire', 'water', 'sokoku', 'shiki', '火が水に悪い影響を与える（逆方向）。', '水が火を消す', '凶方位（死気）'),
('fire', 'metal', 'sokoku', 'sakki', '火が金を剋す。火から悪い影響を受ける。', '火が金属を溶かす', '凶方位（殺気）'),
('metal', 'fire', 'sokoku', 'shiki', '金が火に悪い影響を与える（逆方向）。', '火が金属を溶かす', '凶方位（死気）'),
('metal', 'wood', 'sokoku', 'sakki', '金が木を剋す。金から悪い影響を受ける。', '金属工具が木を切る', '凶方位（殺気）'),
('wood', 'metal', 'sokoku', 'shiki', '木が金に悪い影響を与える（逆方向）。', '金属工具が木を切る', '凶方位（死気）'),

-- 比和関係
('wood', 'wood', 'hiwa', NULL, '同じ木同士の関係。力が増幅される。', '木が集まると森になる', '同じ星同士は九星では除外されるが、基本的には吉'),
('fire', 'fire', 'hiwa', NULL, '同じ火同士の関係。力が増幅される。', '火が集まると大火になる', '同じ星同士は九星では除外されるが、基本的には吉'),
('earth', 'earth', 'hiwa', NULL, '同じ土同士の関係。力が増幅される。', '土が集まると山になる', '同じ星同士は九星では除外されるが、基本的には吉'),
('metal', 'metal', 'hiwa', NULL, '同じ金同士の関係。力が増幅される。', '金属が集まると強固になる', '同じ星同士は九星では除外されるが、基本的には吉'),
('water', 'water', 'hiwa', NULL, '同じ水同士の関係。力が増幅される。', '水が集まると海になる', '同じ星同士は九星では除外されるが、基本的には吉');

-- 5. 傾斜宮の詳細
INSERT INTO inclination_types (palace_name, palace_name_en, associated_star_id, inner_nature, strengths, weaknesses, detailed_characteristics, with_lucky_god, with_unlucky_god) VALUES
(
  '坎宮傾斜',
  'Kan Palace',
  1,
  '流れる水のように穏やかで、どのようなところにも収まる高い順応性を持つ。',
  ARRAY['順応性が高い', '柔軟性がある', '洞察力が深い', '秘密を守る'],
  ARRAY['気疲れが多い', '執着心が強い', '嫉妬心が強い', '孤独を感じやすい'],
  '表面は穏やかだが、内面には深い感情と執着を秘めている。水のように形を変えて適応するが、その分ストレスを溜めやすい。一度心を開いた相手には非常に献身的だが、裏切られると深い恨みを持つ。',
  '周囲の助けや良い出会いに恵まれ、様々な場面で幸運や福徳を授かる機会が多い。',
  '波乱が多く、予期せぬトラブルや人間関係の問題に巻き込まれやすい。'
),
(
  '坤宮傾斜',
  'Kon Palace',
  2,
  '穏やかで真面目、優しく相手を受け止める包容力を備えた縁の下の力持ちタイプ。',
  ARRAY['真面目', '誠実', '包容力がある', '献身的', '忍耐強い'],
  ARRAY['野心がない', '自己主張が弱い', '優柔不断', '尽くしすぎる'],
  '大地のように全てを受け入れる寛容さを持つが、自分の意見を主張することが苦手。他者のために尽くすことに喜びを感じるが、時に自己犠牲が過ぎる。大成功よりも安定と平和を求める。',
  '信頼と安定が得られ、長期的な成功への基盤が築かれる。',
  '苦労が増え、報われない努力が続く傾向がある。'
),
(
  '震宮傾斜',
  'Shin Palace',
  3,
  '積極的で行動力があり、若々しくエネルギーに溢れた気質。',
  ARRAY['行動力がある', '積極的', 'エネルギッシュ', '明るい', '社交的'],
  ARRAY['興味が薄れるのが早い', '中途半端になりやすい', '飽きっぽい', '計画性がない'],
  '雷のように突然動き出し、強いエネルギーで物事を進める。新しいことに挑戦する意欲は高いが、持続力に欠ける。瞬発力はあるが、地道な努力は苦手。',
  '活力と行動力が増し、新しい機会やチャンスに恵まれる。',
  '衝動的な行動が裏目に出て、トラブルが増える。'
),
(
  '巽宮傾斜',
  'Son Palace',
  4,
  'コミュニケーション力が高く、気配り上手で調和を重視する。',
  ARRAY['コミュニケーション力が高い', '気配りができる', '調和を重視', '社交的', '柔軟'],
  ARRAY['自己主張が控えめ', '八方美人', '優柔不断', '流されやすい'],
  '風のように柔軟で、周囲と調和を保つことを重視する。人間関係を円滑にする能力に長けているが、自分の意見を押し通すことが苦手。全員に好かれようとして疲れることも。',
  '良い人間関係と協力者に恵まれ、円滑なコミュニケーションができる。',
  '人間関係のトラブルや誤解が生じやすい。'
),
(
  '乾宮傾斜',
  'Ken Palace',
  6,
  '責任感が強く真面目で、物事を完遂する粘り強さを持つ。',
  ARRAY['責任感が強い', '真面目', '粘り強い', 'リーダーシップがある', '完璧主義'],
  ARRAY['融通がきかない', '頑固', 'プライドが高い', '完璧主義すぎる'],
  '天のように高い理想と強いプライドを持つ。リーダーシップがあり、責任を持って物事を完遂するが、融通が利かず、他者の意見を聞き入れにくい。完璧を求めるあまり、自分にも他人にも厳しい。',
  '権威と信頼が得られ、リーダーとしての地位が確立される。',
  'プライドが傷つく出来事や、権威の失墜が起こりやすい。'
),
(
  '兌宮傾斜',
  'Da Palace',
  7,
  '愛嬌があり、コミュニケーション力に優れたムードメーカー。',
  ARRAY['愛嬌がある', 'コミュニケーション力が高い', '明るい', '社交的', '楽しい'],
  ARRAY['楽観的すぎる', 'ハングリー精神に欠ける', '浪費しやすい', '深刻さが足りない'],
  '湖のように穏やかで楽しい雰囲気を作り出す。人を楽しませることが得意で、社交の場で輝く。しかし、深刻な問題に向き合うことが苦手で、楽観的すぎる面がある。',
  '楽しい出会いや良い機会に恵まれ、金運も上昇する。',
  '浪費や軽率な判断による失敗が増える。'
),
(
  '艮宮傾斜',
  'Gon Palace',
  8,
  '意思が強く一途な努力家で、ギャンブルや散財には無縁。',
  ARRAY['意思が強い', '一途', '努力家', '堅実', '貯蓄家'],
  ARRAY['協調性に欠ける', '頑固', '融通がきかない', '変化を嫌う'],
  '山のようにどっしりと構え、一度決めたことは曲げない強い意志を持つ。コツコツと努力を積み重ね、確実に成果を上げる。変化を嫌い、安定を好む。協調性に欠けると見られることも。',
  '安定と財産の蓄積が進み、長期的な成功が得られる。',
  '頑固さが裏目に出て、孤立や停滞が生じる。'
),
(
  '離宮傾斜',
  'Ri Palace',
  9,
  '優れた直感力と決断力を持ち、物事に没頭する。',
  ARRAY['直感力がある', '決断力がある', '没頭力がある', '美的センスがある', '華やかさ'],
  ARRAY['飽きっぽい', '感情的', '打算的な面を嫌う', '冷めやすい'],
  '火のように情熱的で、興味を持ったことには深く没頭する。直感が鋭く、美しいものや華やかなものを好む。しかし、相手の打算的な面や下心を感じ取るといっきに冷めてしまう。感情の起伏が激しい。',
  '名誉と評価が得られ、華やかな活躍ができる。',
  '感情的なトラブルや評判の低下が起こりやすい。'
);

-- 6. 旅行・移動ルール
INSERT INTO travel_rules (board_type, min_distance_km, max_distance_km, min_nights, max_nights, applies_to, effect_duration, effect_timing_rule, priority_rule) VALUES
(
  'year',
  500,
  NULL,
  3,
  NULL,
  ARRAY['travel', 'relocation', 'overseas'],
  '60年',
  '当年、4年後、7年後、10年後、13年後に効果が現れやすい',
  '最も強力。引越しや長期旅行、海外旅行に適用'
),
(
  'month',
  200,
  500,
  1,
  2,
  ARRAY['travel'],
  '60ヶ月（5年）',
  '当月、4ヶ月後、7ヶ月後、10ヶ月後、13ヶ月後に効果が現れやすい',
  '中期的な旅行に適用。500km以上の日帰り旅行も含む'
),
(
  'day',
  0,
  200,
  0,
  0,
  ARRAY['travel', 'daily_activity'],
  '60日',
  '当日、4日後、7日後、10日後、13日後に効果が現れやすい',
  '日帰り旅行や日常的な移動に適用'
),
(
  'time',
  0,
  20,
  0,
  0,
  ARRAY['daily_activity'],
  '120時間（5日）',
  '短時間での効果',
  '近距離の移動に適用。優先度は低い'
);
