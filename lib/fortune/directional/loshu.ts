/**
 * 洛書（Lo Shu Square / 魔方陣）システム
 * 方位に配置される九星を計算
 */

import type { DirectionKey } from './constants';
import { STAR_DIRECTION_MAP } from './constants';

/**
 * 洛書の配置（各方位に配置される星）
 */
export interface LoshuLayout {
  N: number;
  NE: number;
  E: number;
  SE: number;
  S: number;
  SW: number;
  W: number;
  NW: number;
  CENTER: number;
}

/**
 * 年・月・日の洛書盤
 */
export interface LoshuBoards {
  year: LoshuLayout;
  month: LoshuLayout;
  day: LoshuLayout;
}

/**
 * 中宮星から洛書の配置を計算
 *
 * 洛書は中宮の星によって全体が回転する
 * 基本配置（中宮5）から、中宮星に応じて数値を調整
 *
 * @param centerStar 中宮の星（1-9）
 * @returns 洛書の配置
 */
export function calculateLoshuLayout(centerStar: number): LoshuLayout {
  // 中宮からの差分を計算
  const offset = 5 - centerStar;

  // 各方位の星を計算（基本配置に offset を加算）
  const calculate = (baseStar: number): number => {
    let star = baseStar + offset;

    // 1-9 の範囲に正規化
    while (star > 9) star -= 9;
    while (star < 1) star += 9;

    return star;
  };

  return {
    N: calculate(1),
    NE: calculate(8),
    E: calculate(3),
    SE: calculate(4),
    S: calculate(9),
    SW: calculate(2),
    W: calculate(7),
    NW: calculate(6),
    CENTER: centerStar
  };
}

/**
 * 年の洛書盤を計算
 *
 * 年の中宮星は、その年の本命星と同じ
 *
 * @param year 年（西暦）
 * @returns 年の洛書配置
 */
export function calculateYearLoshu(year: number): LoshuLayout {
  // 立春調整（2月4日より前は前年扱い）
  // ここでは簡略化のため年単位で計算

  // 基準年（1917年）からの年数を計算
  const BASE_YEAR = 1917;
  const yearsSince = year - BASE_YEAR;

  // 年の中宮星を計算
  let centerStar = 11 - (yearsSince % 9);
  if (centerStar > 9) centerStar -= 9;
  if (centerStar <= 0) centerStar += 9;

  return calculateLoshuLayout(centerStar);
}

/**
 * 月の洛書盤を計算
 *
 * 月の中宮星は年の中宮星と月によって決まる
 *
 * @param year 年（西暦）
 * @param month 月（1-12）
 * @returns 月の洛書配置
 */
export function calculateMonthLoshu(year: number, month: number): LoshuLayout {
  // 年の中宮星を取得
  const yearCenterStar = calculateYearLoshu(year).CENTER;

  // 月の中宮星テーブル（年の中宮星ごとに異なる）
  const monthCenterStarTables: Record<number, number[]> = {
    1: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],  // 一白水星の年
    2: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],  // 二黒土星の年
    3: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],  // 三碧木星の年
    4: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],  // 四緑木星の年
    5: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],  // 五黄土星の年
    6: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],  // 六白金星の年
    7: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],  // 七赤金星の年
    8: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],  // 八白土星の年
    9: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9]   // 九紫火星の年
  };

  const monthCenterStar = monthCenterStarTables[yearCenterStar][month - 1];

  return calculateLoshuLayout(monthCenterStar);
}

/**
 * 日の洛書盤を計算
 *
 * 日の中宮星は立春からの日数で決まる
 *
 * @param date 日付
 * @returns 日の洛書配置
 */
export function calculateDayLoshu(date: Date): LoshuLayout {
  let year = date.getFullYear();
  const startOfYear = new Date(year, 1, 4); // 立春（2月4日）

  // 立春より前なら前年の立春を基準にする
  let rissyun = startOfYear;
  if (date < startOfYear) {
    year -= 1;
    rissyun = new Date(year, 1, 4);
  }

  const daysDiff = Math.floor((date.getTime() - rissyun.getTime()) / (1000 * 60 * 60 * 24));

  // 日の中宮星（9日周期で循環）
  // 冬至（12月22日頃）の日の中宮星を基準に計算
  // 冬至から9日ごとに星が変わる
  const yearCenterStar = calculateYearLoshu(year).CENTER;

  // 冬至からの経過日数を考慮（簡略化）
  const winterSolstice = new Date(year - 1, 11, 22); // 前年の冬至
  const daysFromWinterSolstice = Math.floor((date.getTime() - winterSolstice.getTime()) / (1000 * 60 * 60 * 24));

  // 日の中宮星を計算
  let dayCenterStar = yearCenterStar - (daysFromWinterSolstice % 9);
  while (dayCenterStar <= 0) dayCenterStar += 9;
  while (dayCenterStar > 9) dayCenterStar -= 9;

  return calculateLoshuLayout(dayCenterStar);
}

/**
 * 指定日の年・月・日の洛書盤を全て計算
 *
 * @param date 日付
 * @returns 年・月・日の洛書盤
 */
export function calculateAllLoshuBoards(date: Date): LoshuBoards {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return {
    year: calculateYearLoshu(year),
    month: calculateMonthLoshu(year, month),
    day: calculateDayLoshu(date)
  };
}

/**
 * 指定方位にある星を取得
 *
 * @param layout 洛書配置
 * @param direction 方位
 * @returns その方位にある星
 */
export function getStarAtDirection(
  layout: LoshuLayout,
  direction: DirectionKey | 'CENTER'
): number {
  return layout[direction];
}

/**
 * 指定の星がある方位を取得
 *
 * @param layout 洛書配置
 * @param star 星（1-9）
 * @returns その星がある方位
 */
export function getDirectionOfStar(
  layout: LoshuLayout,
  star: number
): DirectionKey | 'CENTER' | null {
  for (const [direction, directionStar] of Object.entries(layout)) {
    if (directionStar === star) {
      return direction as DirectionKey | 'CENTER';
    }
  }
  return null;
}

/**
 * 本命星の定位置（傾斜宮）を取得
 *
 * @param honmeiStar 本命星（1-9）
 * @returns 本命星の定位置
 */
export function getHomeDirection(honmeiStar: number): DirectionKey | 'CENTER' {
  return STAR_DIRECTION_MAP[honmeiStar];
}
