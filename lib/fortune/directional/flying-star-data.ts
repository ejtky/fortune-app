import { DirectionKey } from "./constants";

/**
 * 三元九運の定義
 */
export const FENG_SHUI_PERIODS = [
  { period: 1, start: 1864, end: 1883 },
  { period: 2, start: 1884, end: 1903 },
  { period: 3, start: 1904, end: 1923 },
  { period: 4, start: 1924, end: 1943 },
  { period: 5, start: 1944, end: 1963 },
  { period: 6, start: 1964, end: 1983 },
  { period: 7, start: 1984, end: 2003 },
  { period: 8, start: 2004, end: 2023 },
  { period: 9, start: 2024, end: 2043 }, // 現在の第9運
] as const;

/**
 * 現在の時運を取得（2024年は第9運）
 */
export function getCurrentPeriod(): number {
  const year = new Date().getFullYear();
  const period = FENG_SHUI_PERIODS.find(
    (p) => year >= p.start && year <= p.end,
  );
  return period ? period.period : 9;
}

/**
 * 二十四山（24山）の定義
 * 8方位をさらに3分割（地・天・人）したもの
 */
export interface MountainInfo {
  name: string;        // 山名（例：壬、子、癸）
  direction: DirectionKey; // 属する8方位
  yuan: 'earth' | 'heaven' | 'human'; // 三元（地・天・人）
  polarity: number;    // 陰陽（1: 陽、-1: 陰）
}

export const MOUNTAIN_DATA: Record<string, MountainInfo> = {
  // 北 (N)
  '壬': { name: '壬', direction: 'N', yuan: 'earth', polarity: 1 },
  '子': { name: '子', direction: 'N', yuan: 'heaven', polarity: -1 },
  '癸': { name: '癸', direction: 'N', yuan: 'human', polarity: -1 },
  // 北東 (NE)
  '丑': { name: '丑', direction: 'NE', yuan: 'earth', polarity: -1 },
  '艮': { name: '艮', direction: 'NE', yuan: 'heaven', polarity: 1 },
  '寅': { name: '寅', direction: 'NE', yuan: 'human', polarity: 1 },
  // 東 (E)
  '甲': { name: '甲', direction: 'E', yuan: 'earth', polarity: 1 },
  '卯': { name: '卯', direction: 'E', yuan: 'heaven', polarity: -1 },
  '乙': { name: '乙', direction: 'E', yuan: 'human', polarity: -1 },
  // 南東 (SE)
  '辰': { name: '辰', direction: 'SE', yuan: 'earth', polarity: -1 },
  '巽': { name: '巽', direction: 'SE', yuan: 'heaven', polarity: 1 },
  '巳': { name: '巳', direction: 'SE', yuan: 'human', polarity: 1 },
  // 南 (S)
  '丙': { name: '丙', direction: 'S', yuan: 'earth', polarity: 1 },
  '午': { name: '午', direction: 'S', yuan: 'heaven', polarity: -1 },
  '丁': { name: '丁', direction: 'S', yuan: 'human', polarity: -1 },
  // 南西 (SW)
  '未': { name: '未', direction: 'SW', yuan: 'earth', polarity: -1 },
  '坤': { name: '坤', direction: 'SW', yuan: 'heaven', polarity: 1 },
  '申': { name: '申', direction: 'SW', yuan: 'human', polarity: 1 },
  // 西 (W)
  '庚': { name: '庚', direction: 'W', yuan: 'earth', polarity: 1 },
  '酉': { name: '酉', direction: 'W', yuan: 'heaven', polarity: -1 },
  '辛': { name: '辛', direction: 'W', yuan: 'human', polarity: -1 },
  // 北西 (NW)
  '戌': { name: '戌', direction: 'NW', yuan: 'earth', polarity: -1 },
  '乾': { name: '乾', direction: 'NW', yuan: 'heaven', polarity: 1 },
  '亥': { name: '亥', direction: 'NW', yuan: 'human', polarity: 1 },
};

/**
 * 飛星の順逆判定用の陰陽テーブル
 * 運星（1-9）と三元（地・天・人）の組み合わせで決まる
 */
export const POLARITY_TABLE: Record<number, Record<'earth' | 'heaven' | 'human', number>> = {
  1: { earth: 1, heaven: -1, human: -1 }, // 一白
  2: { earth: -1, heaven: 1, human: 1 },  // 二黒
  3: { earth: 1, heaven: -1, human: -1 }, // 三碧
  4: { earth: -1, heaven: 1, human: 1 },  // 四緑
  5: { earth: 0, heaven: 0, human: 0 },   // 五黄（特殊：現在の運の陽か陰に従うが、基本は運星に準ずる）
  6: { earth: -1, heaven: 1, human: 1 },  // 六白
  7: { earth: 1, heaven: -1, human: -1 }, // 七赤
  8: { earth: -1, heaven: 1, human: 1 },  // 八白
  9: { earth: 1, heaven: -1, human: -1 }, // 九紫
};

/**
 * 玄空飛星派のチャートを拡張
 */
export interface FlyingStarChart {
  period: number;
  facing: DirectionKey;
  sitting: DirectionKey;
  facingMountain?: string; // 向の山
  sittingMountain?: string; // 座の山
  stars: Record<
    DirectionKey,
    {
      mountain: number;
      facing: number;
      base: number;
    }
  >;
}

/**
 * 方位と九星の対応（地盤）
 */
export const PALACE_BASE_STARS: Record<DirectionKey, number> = {
  CENTER: 5,
  N: 1,
  SW: 2,
  E: 3,
  SE: 4,
  NW: 6,
  W: 7,
  NE: 8,
  S: 9,
};

/**
 * 洛書（魔方陣）の軌跡（順行時）
 */
export const LOSHU_PATH: DirectionKey[] = [
  "CENTER",
  "NW",
  "W",
  "NE",
  "S",
  "N",
  "SW",
  "E",
  "SE",
];

/**
 * 吉凶アドバイスのテンプレート
 */
export const FLYING_STAR_ADVICE = {
  8: {
    title: "生気（せいき）",
    description:
      "第8運までは最強の吉星でしたが、現在は次第に衰退するエネルギーです。",
    colors: ["白", "黄色系"],
  },
  9: {
    title: "当旺（とうおう）",
    description:
      "現在（第9運）最強の吉星。財運、成功、繁栄をもたらす生命力に溢れた方位です。",
    colors: ["赤", "紫", "明るい色"],
  },
  1: {
    title: "進気（しんき）",
    description: "将来的に吉運を呼ぶ有望な星。知性や人脈の拡大に適しています。",
    colors: ["白", "青", "黒"],
  },
  2: {
    title: "病符（びょうふ）",
    description:
      "健康トラブルや停滞を招く凶星。静かに保ち、金属製のものを置くと良いでしょう。",
    colors: ["白", "銀", "金"],
  },
  5: {
    title: "五黄（ごおう）",
    description:
      "最も強い凶エネルギー。この方位でのリフォームや騒音は避けてください。",
    colors: ["白", "銀", "金"],
  },
} as const;
