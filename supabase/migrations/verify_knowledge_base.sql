-- ========================================
-- 知識ベース検証クエリ
-- Knowledge Base Verification Query
-- ========================================

-- 1. 九星マスターデータの確認
SELECT '=== 九星マスターデータ ===' AS section;
SELECT
    id,
    name,
    name_en,
    element,
    direction,
    season,
    array_length(color, 1) as color_count
FROM stars
ORDER BY id;

-- 2. 九星詳細プロフィールの確認
SELECT '=== 九星詳細プロフィール ===' AS section;
SELECT
    sp.star_id,
    s.name,
    LEFT(sp.core_essence, 50) || '...' as core_essence_preview,
    array_length(sp.strengths, 1) as strengths_count,
    array_length(sp.suitable_jobs, 1) as jobs_count,
    array_length(sp.traditional_wisdom, 1) as wisdom_count
FROM star_profiles sp
JOIN stars s ON sp.star_id = s.id
ORDER BY sp.star_id;

-- 3. 旅行ルールの確認
SELECT '=== 旅行ルール ===' AS section;
SELECT
    board_type,
    min_distance_km,
    max_distance_km,
    min_nights,
    max_nights,
    effect_duration
FROM travel_rules
ORDER BY
    CASE board_type
        WHEN 'year' THEN 1
        WHEN 'month' THEN 2
        WHEN 'day' THEN 3
        WHEN 'time' THEN 4
    END;

-- 4. 五行関係の確認
SELECT '=== 五行相生相剋関係 ===' AS section;
SELECT
    from_element,
    to_element,
    relation_type,
    relation_subtype,
    LEFT(description, 40) || '...' as description_preview
FROM element_relations
ORDER BY from_element, to_element;

-- 5. 傾斜宮の確認
SELECT '=== 傾斜宮 ===' AS section;
SELECT
    palace_name,
    palace_name_en,
    associated_star_id,
    LEFT(inner_nature, 40) || '...' as inner_nature_preview,
    array_length(strengths, 1) as strengths_count
FROM inclination_types
ORDER BY associated_star_id;

-- 6. 同会パターンの確認
SELECT '=== 同会パターン ===' AS section;
SELECT
    dp.star_id,
    s.name,
    dp.palace_position,
    dp.fortune_level,
    dp.period_description,
    LEFT(dp.general_fortune, 40) || '...' as fortune_preview
FROM doukai_patterns dp
JOIN stars s ON dp.star_id = s.id
ORDER BY dp.star_id, dp.palace_position;

-- 7. 全体サマリー
SELECT '=== データ投入サマリー ===' AS section;
SELECT
    'stars' as table_name,
    COUNT(*) as record_count
FROM stars
UNION ALL
SELECT 'star_profiles', COUNT(*) FROM star_profiles
UNION ALL
SELECT 'travel_rules', COUNT(*) FROM travel_rules
UNION ALL
SELECT 'element_relations', COUNT(*) FROM element_relations
UNION ALL
SELECT 'inclination_types', COUNT(*) FROM inclination_types
UNION ALL
SELECT 'doukai_patterns', COUNT(*) FROM doukai_patterns
ORDER BY table_name;

-- 8. 一白水星の完全データサンプル
SELECT '=== 一白水星 完全データサンプル ===' AS section;
SELECT
    s.name,
    s.name_en,
    s.element,
    s.direction,
    s.season,
    sp.core_essence,
    sp.life_theme,
    sp.strengths,
    sp.suitable_jobs,
    sp.lucky_colors,
    sp.traditional_wisdom
FROM stars s
LEFT JOIN star_profiles sp ON s.id = sp.star_id
WHERE s.id = 1;
