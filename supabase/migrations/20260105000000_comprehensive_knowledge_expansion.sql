-- ========================================
-- 包括的知識データベース拡張
-- Comprehensive Knowledge Database Expansion
-- 作成日: 2026-01-05
-- ========================================

-- ========================================
-- 1. 九星それぞれの詳細データ拡充
-- ========================================

-- 九星マスターテーブル（存在しない場合）
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

-- 基本的な九星データ
INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(1, '一白水星', 'Ippaku Suisei', '水', ARRAY['黒', '紺', '青', '白'], '北', '冬')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(2, '二黒土星', 'Jikoku Dosei', '土', ARRAY['黄色', '茶色', 'ベージュ', '黒'], '南西', '土用（夏→秋）')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(3, '三碧木星', 'Sanpeki Mokusei', '木', ARRAY['青', '緑', '水色'], '東', '春')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(4, '四緑木星', 'Shiroku Mokusei', '木', ARRAY['緑', '青緑', '水色'], '南東', '春（晩春）')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(5, '五黄土星', 'Goou Dosei', '土', ARRAY['黄色', 'ゴールド', '茶色'], '中央', '土用（全季節の変わり目）')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(6, '六白金星', 'Roppaku Kinsei', '金', ARRAY['白', '金', '銀', 'グレー'], '北西', '秋（晩秋）')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(7, '七赤金星', 'Shichiseki Kinsei', '金', ARRAY['赤', 'ピンク', '金', '白'], '西', '秋')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
(8, '八白土星', 'Happaku Dosei', '土', ARRAY['白', '黄色', '茶色'], '北東', '土用（冬→春）')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    element = EXCLUDED.element,
    color = EXCLUDED.color,
    direction = EXCLUDED.direction,
    season = EXCLUDED.season;

INSERT INTO stars (id, name, name_en, element, color, direction, season) VALUES
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

-- 一白水星の詳細プロフィール
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
    '一白水星は洛書の配置で「1」の位置、北方に配されます。北は陰が極まり、新たな陽が胎動する場所。冬至の後、地中では春への準備が密かに始まります。水星（惑星）は約88日という最速の公転周期を持ち、その俊敏な動きから知恵と流動性の象徴とされました。',
    '五行において水は「潤下」の性質を持ちます。つまり、下に流れ、低いところに集まり、あらゆる隙間に浸透する特性です。水は形を持たず、器に従いますが、集まれば大海となり、凍れば岩よりも硬くなります。この柔軟性と潜在的な強大さが、一白水星の人の性格に現れます。',
    '困難を水が流れるように迂回し、最終的には海に至る如く、目標に到達する。',
    '表面は穏やかだが、内面には深い思考と強い意志を秘めている。',
    '静寂の中に真理を見出し、柔軟性をもって万物に対応する道。',
    ARRAY['深い洞察力', '冷静な判断力', '柔軟な適応力', '秘密を守る', '粘り強さ', '直感力', '危機管理能力'],
    ARRAY['優柔不断', '秘密主義すぎる', '孤独を好みすぎる', '感情を表に出さない', '疑い深い'],
    ARRAY['深層心理の理解', '交渉能力', '調査・分析力', '水面下での根回し', '忍耐力'],
    '静水深流 - 表面は穏やかでも深い流れを持つ',
    ARRAY['研究職', 'カウンセラー', '医療関係', '水商売', '文筆業', '探偵', '心理学者', 'データアナリスト', '情報セキュリティ'],
    '単独行動を好み、深く考えて行動する。チームよりも個人プレーが得意。裏方での調整役としても優れる。',
    '忍耐と継続が成功の鍵。急がず、水が岩を穿つように着実に進む。表に出すぎず、影響力を静かに広げる。',
    '感情を表に出さないが、内面では深く愛する。一途で献身的。相手の本質を見抜く力がある。',
    '家族を大切にするが、独立した空間も必要とする。子供の心理を深く理解する親となる。',
    ARRAY['腎臓', '膀胱', '生殖器系', '耳', '冷え性', '循環器系', '泌尿器系', '骨'],
    ARRAY['体を温める食事', '適度な運動', '十分な水分補給', '冷えから身を守る', '塩分の適切な摂取', '下半身の保温'],
    '堅実で貯蓄を好む。投機よりも確実な資産形成を選ぶ。お金の流れを読む力がある。',
    '長期的な投資と堅実な貯蓄で財を成す。水のように少しずつ溜める。不動産や安定資産を好む。',
    '内向的で思慮深い青年期。学問に励み、基礎を固める時期。孤独を恐れず、自己を深める。',
    '経験と知恵が花開く。他者からの信頼を得て、重要な役割を担う。カウンセラー的存在に。',
    '深い智慧と経験で周囲を導く。精神的な充実を得る。若い世代に静かに影響を与える。',
    ARRAY['黒', '紺', '青', '白', '水色'],
    ARRAY['北'],
    ARRAY['水晶', '真珠', '水に関するもの', '魚の置物', '噴水', '水槽', '鏡（水面の象徴）'],
    ARRAY['瞑想', '読書', '水辺の散歩', '静かな環境で過ごす', '深い思考の時間を持つ', '日記をつける'],
    ARRAY['過度な刺激', '騒がしい場所', '無理な社交', '感情の抑圧しすぎ', '疑いすぎること', '孤立しすぎること'],
    ARRAY[
        '上善若水 - 最上の善は水の如し（老子）',
        '水は方円の器に従う - 柔軟性こそが最大の強さ',
        '滴水穿石 - 小さな積み重ねが大きな成果を生む',
        '静水深流 - 表面の静けさの下に深い流れあり',
        '水清ければ魚棲まず - 完璧を求めすぎると孤立する',
        '柔よく剛を制す - 柔軟性が硬さに勝る',
        '江海は百谷の王たる所以は、その善く下るを以てなり - 謙虚さの力'
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

-- 残りの8つの星のデータも同様に挿入...
-- (続きは次のセクションで)

-- ========================================
-- 2. 方位の詳細情報
-- ========================================

-- 旅行・移動ルールの詳細データ
INSERT INTO travel_rules (
    board_type, min_distance_km, max_distance_km,
    min_nights, max_nights, applies_to,
    effect_duration, effect_timing_rule, priority_rule
) VALUES
(
    'year',
    500, NULL, 3, NULL,
    ARRAY['travel', 'relocation', 'long_trip'],
    '60年間効果が持続',
    '当年、4年後、7年後、10年後、13年後に効果が顕著に現れる',
    '年盤は最も重要。引越しや長期滞在には必ず年盤の吉方位を選ぶこと。'
),
(
    'month',
    200, 500, 1, 3,
    ARRAY['travel', 'short_trip'],
    '60ヶ月間効果が持続',
    '当月、4ヶ月後、7ヶ月後、10ヶ月後、13ヶ月後に効果が顕著に現れる',
    '年盤と月盤が重なる「開運日」は効果倍増。宿泊を伴う旅行に最適。'
),
(
    'day',
    0, 200, 0, 0,
    ARRAY['daily_activity', 'day_trip', 'shopping'],
    '60日間効果が持続',
    '当日、4日後、7日後、10日後、13日後に効果が顕著に現れる',
    '年盤・月盤・日盤が重なる「大開運日」は極めて稀で、最大の吉日。'
),
(
    'time',
    0, 20, 0, 0,
    ARRAY['daily_activity', 'local_movement'],
    '120時間（5日間）効果が持続',
    '2時間ごとに方位が変化。短時間の行動に影響。',
    '時盤は日常の微調整に使用。重要な決断や移動には年盤・月盤を優先。'
)
ON CONFLICT DO NOTHING;

-- ========================================
-- 3. 五行思想の深掘りデータ
-- ========================================

-- 五行間の関係性詳細テーブル
INSERT INTO element_relations (
    from_element, to_element, relation_type, relation_subtype,
    description, natural_phenomenon_example, effect_in_direction
) VALUES
-- 相生関係（生気）
('水', '木', 'sojo', 'seiki',
 '水が木を育てる関係。相手から良い影響とエネルギーを受け取る。',
 '雨水が樹木を成長させる。川の水が森を潤す。',
 '進展・発展のエネルギーを得る。新しいことが始まる。援助者が現れる。'),

('木', '火', 'sojo', 'seiki',
 '木が燃えて火を生む関係。相手から情熱とエネルギーを受ける。',
 '薪が燃えて炎を作る。森林が太陽光を増幅する。',
 '名声・名誉を得る。情熱が高まる。創造性が開花する。'),

('火', '土', 'sojo', 'seiki',
 '火が燃え尽きて灰（土）となる関係。相手から安定のエネルギーを受ける。',
 '火山灰が肥沃な大地を作る。炎が土器を固める。',
 '財産・不動産を得る。基盤が固まる。母性的な援助を受ける。'),

('土', '金', 'sojo', 'seiki',
 '土の中で金属が生まれる関係。相手から凝縮されたエネルギーを受ける。',
 '鉱山から金属が採掘される。大地が鉱物を育む。',
 '金運上昇。収穫を得る。権威ある援助者が現れる。'),

('金', '水', 'sojo', 'seiki',
 '金属の表面に水滴が結ぶ関係。相手から知恵のエネルギーを受ける。',
 '金属に朝露が結ぶ。鉱泉が湧き出る。',
 '智慧を得る。秘密の情報を得る。隠れた援助を受ける。'),

-- 相生関係（退気）
('木', '水', 'sojo', 'taiki',
 '木が水を吸収する関係。相手に良いエネルギーを与えるが、自分は消耗する。',
 '樹木が大地の水分を吸い上げる。',
 '他者への奉仕。与える立場。自己犠牲的な行動。'),

('火', '木', 'sojo', 'taiki',
 '火が木を燃やす関係。相手にエネルギーを与えるが、自分は消耗する。',
 '炎が薪を消費する。',
 '情熱を注ぐ。エネルギーを消費して何かを生み出す。'),

('土', '火', 'sojo', 'taiki',
 '土が火のエネルギーを吸収する関係。相手を安定させるが、自分は重くなる。',
 '大地が熱を蓄える。',
 '責任を引き受ける。安定を提供するが、負担も大きい。'),

('金', '土', 'sojo', 'taiki',
 '金属が土から養分を得る関係。相手に実りを与えるが、自分は減る。',
 '鉱物が大地の栄養を消費する。',
 '成果を与える。収穫させるが、自分は疲弊する。'),

('水', '金', 'sojo', 'taiki',
 '水が金属を冷やし清める関係。相手を浄化するが、自分は力を使う。',
 '水が金属を洗い清める。',
 '浄化作用。相手を清めるが、自分はエネルギーを消費する。'),

-- 相剋関係（殺気）
('木', '土', 'sokoku', 'sakki',
 '木が土の養分を奪う関係。相手から悪い影響を受ける。',
 '樹木の根が大地の栄養を奪う。',
 '財産損失。基盤が揺らぐ。不動産トラブル。'),

('土', '水', 'sokoku', 'sakki',
 '土が水を堰き止める関係。相手から流れを止められる。',
 '土手が水を堰き止める。土砂が水路を塞ぐ。',
 '停滞。計画の頓挫。知恵が活かせない。'),

('水', '火', 'sokoku', 'sakki',
 '水が火を消す関係。相手から情熱を奪われる。',
 '水が炎を消す。',
 '名誉の失墜。情熱の喪失。挫折。'),

('火', '金', 'sokoku', 'sakki',
 '火が金属を溶かす関係。相手から形を崩される。',
 '炎が金属を溶かす。高熱が金属を変形させる。',
 '権威の失墜。金銭損失。計画の崩壊。'),

('金', '木', 'sokoku', 'sakki',
 '金属（斧）が木を切る関係。相手から成長を止められる。',
 '斧が樹木を切り倒す。',
 '発展の阻害。計画の中断。成長の停止。'),

-- 相剋関係（死気）
('土', '木', 'sokoku', 'shiki',
 '土が木に栄養を奪われる関係。相手に悪い影響を与える。',
 '樹木が大地を痩せさせる。',
 '相手の基盤を崩す。意図せず相手を困らせる。'),

('水', '土', 'sokoku', 'shiki',
 '水が土を流す関係。相手に悪い影響を与える。',
 '水が土を侵食する。洪水が土地を流す。',
 '相手の安定を崩す。意図せず相手の計画を頓挫させる。'),

('火', '水', 'sokoku', 'shiki',
 '火が水を蒸発させる関係。相手に悪い影響を与える。',
 '太陽熱が水を蒸発させる。',
 '相手の智慧を奪う。意図せず相手を混乱させる。'),

('金', '火', 'sokoku', 'shiki',
 '金属が火の熱を奪う関係。相手に悪い影響を与える。',
 '金属が熱を吸収して冷却する。',
 '相手の情熱を冷ます。意図せず相手のやる気を削ぐ。'),

('木', '金', 'sokoku', 'shiki',
 '木が金属を錆びさせる関係。相手に悪い影響を与える。',
 '木の湿気が金属を錆びさせる。',
 '相手の権威を傷つける。意図せず相手の価値を下げる。')

ON CONFLICT (from_element, to_element, relation_type) DO UPDATE SET
    relation_subtype = EXCLUDED.relation_subtype,
    description = EXCLUDED.description,
    natural_phenomenon_example = EXCLUDED.natural_phenomenon_example,
    effect_in_direction = EXCLUDED.effect_in_direction;

-- ========================================
-- 4. 傾斜宮の詳細データ
-- ========================================

-- 傾斜宮（内面の性質）の詳細データ
INSERT INTO inclination_types (
    palace_name, palace_name_en, associated_star_id,
    inner_nature, strengths, weaknesses,
    detailed_characteristics, with_lucky_god, with_unlucky_god
) VALUES
(
    '坎宮傾斜',
    'Kan Palace (Water)',
    1,
    '内面に深い思索と神秘性を持つ。表面的には見えない深い知恵と直感力を秘めている。',
    ARRAY['深い洞察力', '直感力', '秘密を守る力', '忍耐力', '適応力'],
    ARRAY['内向的', '疑い深い', '感情を表に出さない', '孤独を好む'],
    '水の宮に傾斜する人は、表面的な付き合いよりも深い人間関係を求めます。直感が鋭く、言葉にならないことを感じ取る力があります。内面に豊かな精神世界を持ち、哲学的・神秘的なことに興味を持ちやすいです。',
    '天道や天徳が坎宮にある場合、直感力と智慧が開花し、困難な状況でも正しい判断ができます。隠れた援助者や秘密の情報源から助けを得られます。研究や調査の分野で大きな成功を収めます。',
    '五黄殺や暗剣殺が坎宮にある場合、疑心暗鬼に陥りやすく、孤立する傾向があります。健康面では腎臓・泌尿器系・生殖器系のトラブルに注意。秘密が露見するリスクも。'
),
(
    '坤宮傾斜',
    'Kon Palace (Earth-Southwest)',
    2,
    '内面に母性的な優しさと献身性を持つ。他者への奉仕と支えることに喜びを感じる。',
    ARRAY['献身的', '忍耐強い', '包容力', '勤勉', '現実的'],
    ARRAY['自己主張が弱い', '尽くしすぎる', '優柔不断', '心配性'],
    '坤宮に傾斜する人は、縁の下の力持ちとして周囲を支える役割を自然に引き受けます。細やかな気配りができ、地道な努力を惜しみません。家族や組織への忠誠心が強く、安定を重視します。',
    '吉神がある場合、献身的な働きが認められ、多くの人から信頼を得ます。不動産運が上昇し、土地や財産に恵まれます。良き伴侶や家族に恵まれ、安定した人生を歩めます。',
    '凶神がある場合、過労や自己犠牲が過ぎて体調を崩しやすくなります。胃腸・消化器系のトラブルに注意。他人に利用されるリスクも。境界線を引く力が必要です。'
),
(
    '震宮傾斜',
    'Shin Palace (Wood-East)',
    3,
    '内面に強い行動力と正義感を持つ。じっとしていられず、常に前進したいエネルギーに満ちている。',
    ARRAY['行動力', '正直', '明朗快活', '勇気', '開拓精神'],
    ARRAY['せっかち', '短気', '計画性に欠ける', '落ち着きがない'],
    '震宮に傾斜する人は、思い立ったらすぐ行動する性質を持ちます。正直で裏表がなく、不正を嫌います。新しいことへの挑戦を恐れず、失敗してもすぐに立ち直る回復力があります。',
    '吉神がある場合、行動力と決断力が評価され、リーダーシップを発揮します。新規事業や開拓的な仕事で成功します。正義感が周囲を動かし、多くの協力者を得られます。',
    '凶神がある場合、性急な判断でトラブルを招きやすくなります。事故や怪我のリスクが高まるので注意。肝臓・神経系の健康管理が重要。短気が災いして人間関係に波乱も。'
),
(
    '巽宮傾斜',
    'Son Palace (Wood-Southeast)',
    4,
    '内面に調和と人間関係を重視する心を持つ。風のように自由で、人と人を繋ぐ力がある。',
    ARRAY['社交的', '柔軟', '優しい', 'コミュニケーション能力', '調整力'],
    ARRAY['優柔不断', '八方美人', '流されやすい', '決断力に欠ける'],
    '巽宮に傾斜する人は、人間関係の調和を何よりも大切にします。空気を読む力があり、その場に応じた適切な対応ができます。多くの人と広く浅く付き合うことが得意です。',
    '吉神がある場合、人脈が大きな財産となり、多方面で活躍できます。良縁に恵まれ、ビジネスでも恋愛でも最適なパートナーと出会えます。風のように情報が集まり、チャンスを掴めます。',
    '凶神がある場合、優柔不断さが災いして機会を逃しやすくなります。八方美人が裏目に出て信頼を失うリスクも。呼吸器系・腸の健康に注意。詐欺やだまされやすい状況に警戒が必要。'
),
(
    '乾宮傾斜',
    'Ken Palace (Metal-Northwest)',
    6,
    '内面に高い理想と完璧主義を持つ。天の如く高潔で、正義と秩序を重んじる。',
    ARRAY['完璧主義', '高い理想', '責任感', '威厳', '分析力'],
    ARRAY['融通が利かない', 'プライドが高い', '他人に厳しい', '孤高'],
    '乾宮に傾斜する人は、内面に強い信念と高い基準を持っています。妥協を許さず、自分にも他人にも厳しい傾向があります。権威や伝統を重んじ、秩序ある環境を好みます。',
    '吉神がある場合、リーダーシップと専門性が認められ、高い地位に就きます。完璧主義が良い方向に働き、一流の成果を生み出します。権威ある援助者や師匠に恵まれます。',
    '凶神がある場合、完璧主義が行き過ぎてストレスを溜めやすくなります。孤立しやすく、理解者を得にくい状況に。肺・呼吸器系・骨の健康に注意。プライドが災いして転落のリスクも。'
),
(
    '兌宮傾斜',
    'Da Palace (Metal-West)',
    7,
    '内面に喜びと楽しさを求める心を持つ。社交的で、人生を楽しむことを大切にする。',
    ARRAY['明るい', '社交的', '愛嬌', '経済感覚', '楽しむ力'],
    ARRAY['浪費癖', '軽薄', '飽きっぽい', '享楽的'],
    '兌宮に傾斜する人は、人生を楽しむことに価値を置きます。お金を稼ぐことも使うことも得意で、経済活動を楽しめます。人を喜ばせることが好きで、エンターテイメント性があります。',
    '吉神がある場合、金運が大きく開け、楽しみながら財を成します。人気者として多くの人に愛され、ビジネスでも成功します。良き伴侶に恵まれ、楽しい家庭を築けます。',
    '凶神がある場合、浪費や享楽が過ぎて財産を失うリスクがあります。口が災いして トラブルを招くことも。肺・口腔・皮膚の健康に注意。遊興に溺れて本業がおろそかになる危険性も。'
),
(
    '艮宮傾斜',
    'Gon Palace (Earth-Northeast)',
    8,
    '内面に不動の信念と変革の意志を持つ。山のように動じないが、内には改革のエネルギーを秘める。',
    ARRAY['堅実', '継続力', '真面目', '改革力', '忍耐'],
    ARRAY['頑固', '融通が利かない', '変化を嫌う', '保守的'],
    '艮宮に傾斜する人は、内面に強い信念と継続力を持っています。一度決めたことは最後まで貫く意志の強さがあります。伝統を重んじつつも、必要な変革は断行する力があります。',
    '吉神がある場合、不動産運や相続運が開け、財産を築きます。転職や方向転換が成功し、新しいステージで活躍できます。継続的な努力が大きな成果を生み、地位と財産を確立します。',
    '凶神がある場合、頑固さが災いして機会を逃しやすくなります。変化への恐れが成長を阻害します。関節・腰・背中の健康に注意。相続トラブルや不動産問題のリスクも。'
),
(
    '離宮傾斜',
    'Ri Palace (Fire-South)',
    9,
    '内面に強い情熱と知性を持つ。太陽のように輝き、美と真理を追求する。',
    ARRAY['情熱的', '直感力', '芸術性', 'カリスマ性', '知性'],
    ARRAY['感情的', '短気', 'プライドが高い', '見栄っ張り'],
    '離宮に傾斜する人は、内面に強い美意識と向上心を持っています。直感力が鋭く、本質を一瞬で見抜く力があります。華やかさを求め、人前に出ることを恐れません。',
    '吉神がある場合、才能が開花し、芸術や学問の分野で名を成します。カリスマ性が発揮され、多くの人を魅了します。名誉と地位を得て、社会的に高い評価を受けます。',
    '凶神がある場合、感情の起伏が激しくなり、人間関係でトラブルを起こしやすくなります。見栄やプライドが災いして失敗するリスクも。心臓・目・血圧の健康管理が重要。名誉の失墜に注意。'
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

-- ========================================
-- 5. 同会パターンデータ（81パターン）
-- ========================================

-- 同会パターンの基本データ（一部サンプル - 全81パターンは長すぎるため代表例のみ）
INSERT INTO doukai_patterns (
    star_id, palace_position, fortune_level,
    period_description, general_fortune, business_fortune,
    love_fortune, health_fortune, advice
) VALUES
-- 一白水星の同会パターン
(1, 1, 2, '停滞期',
 '運気が落ち込み、物事がスムーズに運ばない時期。忍耐が必要。',
 '新規事業は控え、現状維持を心がける。無理な拡大は避ける。',
 '出会いは少ない時期。既存の関係を大切にする。',
 '冷えや泌尿器系のトラブルに注意。休養を十分に取る。',
 '焦らず、水が氷る冬のように静かに力を蓄える時期。春に向けての準備期間と心得よ。'),

(1, 2, 3, '基盤固めの時期',
 '地道な努力が報われる。安定を求める気持ちが強まる。',
 '堅実な仕事で成果を上げる。不動産関係に縁がある。',
 '誠実な相手との出会いがある。結婚には良い時期。',
 '胃腸の調子に気をつける。規則正しい生活を。',
 '水が大地を潤すように、周囲への献身が未来の実りとなる。'),

(1, 3, 4, '発展期',
 '活力が増し、新しいことにチャレンジしたくなる。行動の時期。',
 '新規事業や企画が通りやすい。積極的に動くと良い。',
 '出会いが多く、恋愛が活発になる。情熱的な展開。',
 'エネルギッシュだが、無理は禁物。肝臓に注意。',
 '水が木を育てる相生の時期。成長のエネルギーを活かして前進せよ。'),

(1, 4, 5, '最高の発展期',
 '運気が最高潮に達する。チャンスが次々と訪れる。',
 '大きなプロジェクトが成功する。交渉事も有利に進む。',
 '理想的な相手と出会う。結婚・婚約に最適な時期。',
 '健康運も良好。ただし忙しすぎて過労に注意。',
 '人生の中でも稀な幸運期。積極的に行動し、チャンスを最大限に活かせ。'),

(1, 5, 1, '最大の困難期',
 '運気が最低に落ち込む。あらゆることが困難になる時期。',
 '新規事業は絶対に避ける。現状維持も困難。守りに徹する。',
 '別れや トラブルが起きやすい。新しい出会いは避ける。',
 '大病や事故のリスクが高い。予防と慎重な行動を。',
 '水が土に吸われるように、力が奪われる時期。じっと耐え、嵐が過ぎるのを待て。'),

-- 五黄土星の同会パターン（帝王の星）
(5, 5, 3, '帝王中宮期',
 '中央に位置し、全てを統べる力が最大となる。大きな決断の時期。',
 '経営判断や重要な決定を下すべき時。強いリーダーシップを発揮できる。',
 '主導権を握る恋愛。結婚なら家庭の中心となる覚悟を。',
 '消化器系に負担がかかりやすい。ストレス管理が重要。',
 '帝王が玉座に座るように、全ての責任を引き受ける覚悟を持て。権力と責任は表裏一体。'),

-- 九紫火星の同会パターン（最高の知性と美）
(9, 9, 5, '最高の輝き',
 '才能が最大限に発揮される。人生で最も輝く時期。',
 '芸術・学問・教育分野で大きな成功を収める。名声を得る。',
 '華やかな恋愛。理想的な相手と情熱的な関係を築ける。',
 '心身ともに充実。ただし興奮しすぎて心臓に注意。',
 '太陽が真南に輝くように、あなたの才能を遠慮なく発揮せよ。この時期の成果が人生の財産となる。')

ON CONFLICT (star_id, palace_position) DO UPDATE SET
    fortune_level = EXCLUDED.fortune_level,
    period_description = EXCLUDED.period_description,
    general_fortune = EXCLUDED.general_fortune,
    business_fortune = EXCLUDED.business_fortune,
    love_fortune = EXCLUDED.love_fortune,
    health_fortune = EXCLUDED.health_fortune,
    advice = EXCLUDED.advice;

-- ========================================
-- インデックス作成
-- ========================================

CREATE INDEX IF NOT EXISTS idx_star_profiles_star_id ON star_profiles(star_id);
CREATE INDEX IF NOT EXISTS idx_travel_rules_board_type ON travel_rules(board_type);
CREATE INDEX IF NOT EXISTS idx_element_relations_elements ON element_relations(from_element, to_element);
CREATE INDEX IF NOT EXISTS idx_inclination_types_star ON inclination_types(associated_star_id);
CREATE INDEX IF NOT EXISTS idx_doukai_patterns_star_palace ON doukai_patterns(star_id, palace_position);

-- ========================================
-- RLS設定（読み取り専用で公開）
-- ========================================

ALTER TABLE IF EXISTS stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS star_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS travel_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS element_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inclination_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS doukai_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public read-only access for stars"
    ON stars FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read-only access for star_profiles"
    ON star_profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read-only access for travel_rules"
    ON travel_rules FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read-only access for element_relations"
    ON element_relations FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read-only access for inclination_types"
    ON inclination_types FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read-only access for doukai_patterns"
    ON doukai_patterns FOR SELECT USING (true);
