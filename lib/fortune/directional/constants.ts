/**
 * 方位学の定数定義
 * Directional Studies Constants
 */

// 8方位の定義
export const DIRECTIONS = {
  N: '北',
  NE: '北東',
  E: '東',
  SE: '南東',
  S: '南',
  SW: '南西',
  W: '西',
  NW: '北西'
} as const;

export type DirectionKey = keyof typeof DIRECTIONS;

// 方位の角度範囲（真北を0度として時計回り）
export const DIRECTION_DEGREES: Record<DirectionKey, { min: number; max: number }> = {
  N: { min: 337.5, max: 22.5 },
  NE: { min: 22.5, max: 67.5 },
  E: { min: 67.5, max: 112.5 },
  SE: { min: 112.5, max: 157.5 },
  S: { min: 157.5, max: 202.5 },
  SW: { min: 202.5, max: 247.5 },
  W: { min: 247.5, max: 292.5 },
  NW: { min: 292.5, max: 337.5 }
};

// 方位と九星の対応（洛書の定位置）
// 九星の各星が本来属する方位
export const STAR_DIRECTION_MAP: Record<number, DirectionKey | 'CENTER'> = {
  1: 'N',      // 一白水星 → 北（坎宮）
  2: 'SW',     // 二黒土星 → 南西（坤宮）
  3: 'E',      // 三碧木星 → 東（震宮）
  4: 'SE',     // 四緑木星 → 南東（巽宮）
  5: 'CENTER', // 五黄土星 → 中央（中宮）
  6: 'NW',     // 六白金星 → 北西（乾宮）
  7: 'W',      // 七赤金星 → 西（兌宮）
  8: 'NE',     // 八白土星 → 北東（艮宮）
  9: 'S'       // 九紫火星 → 南（離宮）
};

// 洛書の宮名（九宮）
export const PALACE_NAMES: Record<DirectionKey | 'CENTER', string> = {
  N: '坎宮',
  NE: '艮宮',
  E: '震宮',
  SE: '巽宮',
  S: '離宮',
  SW: '坤宮',
  W: '兌宮',
  NW: '乾宮',
  CENTER: '中宮'
};

// 洛書の基本配置（中宮が5の時の配置）
// この配置を基準に、中宮の星が変わると全体が回転する
export const BASE_LOSHU_LAYOUT = {
  N: 1,
  NE: 8,
  E: 3,
  SE: 4,
  S: 9,
  SW: 2,
  W: 7,
  NW: 6,
  CENTER: 5
};

// 方位の吉凶を表す評価
export type DirectionQuality = 'excellent' | 'good' | 'neutral' | 'caution' | 'avoid';

// 方位の評価の説明
export const QUALITY_DESCRIPTIONS: Record<DirectionQuality, string> = {
  excellent: '大吉方位 - 最も良い方位です',
  good: '吉方位 - 良い方位です',
  neutral: '平凡 - 普通の方位です',
  caution: '注意 - 慎重に行動してください',
  avoid: '凶方位 - 避けるべき方位です'
};

// 方位の評価の色（UI用）
export const QUALITY_COLORS: Record<DirectionQuality, string> = {
  excellent: '#10b981', // 緑
  good: '#3b82f6',      // 青
  neutral: '#6b7280',   // グレー
  caution: '#f59e0b',   // オレンジ
  avoid: '#ef4444'      // 赤
};
