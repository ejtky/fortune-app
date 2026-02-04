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
 * 玄空飛星派の基本データ構造
 */
export interface FlyingStarChart {
  period: number; // 運
  facing: DirectionKey; // 向（建物の向き）
  sitting: DirectionKey; // 座（建物の背）
  stars: Record<
    DirectionKey,
    {
      mountain: number; // 山星（人の健康・人間関係）
      facing: number; // 向星（財運・ビジネス）
      base: number; // 運星（地盤となる時運）
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
