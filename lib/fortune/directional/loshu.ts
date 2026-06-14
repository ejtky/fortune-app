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
  [key: string]: number;
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
 * 年・月・日・時の洛書盤
 */
export interface LoshuBoards {
  year: LoshuLayout;
  month: LoshuLayout;
  day: LoshuLayout;
  time: LoshuLayout;
}

/**
 * 2000年1月1日(UTC)からの経過日数を計算
 */
function getDaysSince2000(date: Date): number {
  const d2000 = new Date(Date.UTC(2000, 0, 1));
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return Math.floor((utcDate.getTime() - d2000.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 任意の日の干支番号を計算 (0=甲子 ～ 59=癸亥)
 * 2000年1月1日は 戊午 (54)
 */
function getKanshiIndex(daysSince2000: number): number {
  let k = (54 + (daysSince2000 % 60)) % 60;
  if (k < 0) k += 60;
  return k;
}

/**
 * 指定日に最も近い甲子（きのえね = 0）の日の経過日数を取得
 */
function getNearestKoshi(targetDate: Date): number {
  const days = getDaysSince2000(targetDate);
  const k = getKanshiIndex(days);
  if (k <= 30) {
    return days - k;
  } else {
    return days + (60 - k);
  }
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
  // 定位置盤（五黄中宮）の星をベース(baseStar)とする
  // 中宮が centerStar に変わった時、各宮に入る星は centerStar + (baseStar - 5) となる
  const calculate = (baseStar: number): number => {
    let star = centerStar + (baseStar - 5);

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
 * @param date 日付
 * @returns 年の洛書配置
 */
export function calculateYearLoshu(date: Date): LoshuLayout {
  // 立春調整（2月4日より前は前年扱い）
  let year = date.getFullYear();
  if (date.getMonth() === 0 || (date.getMonth() === 1 && date.getDate() < 4)) {
    year -= 1;
  }

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
 * 月の中宮星は年の中宮星と月ごとに決まる（正月＝寅月始まり）
 *
 * @param date 日付
 * @returns 月の洛書配置
 */
export function calculateMonthLoshu(date: Date): LoshuLayout {
  let y = date.getFullYear();
  let m = date.getMonth() + 1; // 1-12
  const d = date.getDate();

  // 節替わりを簡易的に毎月4日とする
  if (d < 4) {
    m -= 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
  }

  // 気学上の年を求める（立春 2/4 基準）
  let kigakuYear = date.getFullYear();
  if (date.getMonth() === 0 || (date.getMonth() === 1 && date.getDate() < 4)) {
    kigakuYear -= 1;
  }
  
  // 年の中宮星を取得（グループ分けに使う）
  const BASE_YEAR = 1917;
  const yearsSince = kigakuYear - BASE_YEAR;
  let yearCenterStar = 11 - (yearsSince % 9);
  if (yearCenterStar > 9) yearCenterStar -= 9;
  if (yearCenterStar <= 0) yearCenterStar += 9;

  // 月の中宮星の基準（正月＝気学上の1月（カレンダーの2月））
  let startStar = 8;
  if ([3, 6, 9].includes(yearCenterStar)) startStar = 5;
  if ([2, 5, 8].includes(yearCenterStar)) startStar = 2;

  // カレンダーの月m から気学の月インデックス(1-12)を算出 (カレンダー2月 => 気学1月)
  let kigakuMonth = m - 1;
  if (kigakuMonth <= 0) kigakuMonth += 12;

  // 1月(正月)が startStar で、毎月逆行（-1）する
  let monthCenterStar = startStar - (kigakuMonth - 1);
  while (monthCenterStar <= 0) monthCenterStar += 9;
  while (monthCenterStar > 9) monthCenterStar -= 9;

  return calculateLoshuLayout(monthCenterStar);
}

/**
 * 日の洛書盤を計算
 *
 * 日盤は陰遁と陽遁を考慮して計算
 * 夏至付近の甲子から陰遁（9,8,7...）
 * 冬至付近の甲子から陽遁（1,2,3...）
 *
 * @param date 日付
 * @returns 日の洛書配置
 */
export function calculateDayLoshu(date: Date): LoshuLayout {
  const y = date.getFullYear();
  const days = getDaysSince2000(date);
  
  // 基準となる甲子の日
  const prevTojiKoshi = getNearestKoshi(new Date(y - 1, 11, 22)); // 前年冬至
  const geshiKoshi = getNearestKoshi(new Date(y, 5, 21));         // 今年夏至
  const tojiKoshi = getNearestKoshi(new Date(y, 11, 22));         // 今年冬至
  
  let centerStar = 1;
  let isYonton = true;
  let diffKoshi = 0;
  
  if (days >= prevTojiKoshi && days < geshiKoshi) {
    // 陽遁 (前年冬至〜今年夏至)
    diffKoshi = days - prevTojiKoshi;
    isYonton = true;
  } else if (days >= geshiKoshi && days < tojiKoshi) {
    // 陰遁 (今年夏至〜今年冬至)
    diffKoshi = days - geshiKoshi;
    isYonton = false;
  } else {
    // 陽遁 (今年冬至〜来年夏至)
    let base = tojiKoshi;
    if (days < prevTojiKoshi) {
      // 稀なケース: 日付が前年冬至甲子よりも前（前々年冬至から前年夏至の陽遁/陰遁の末尾）
      base = getNearestKoshi(new Date(y - 1, 5, 21));
      diffKoshi = days - base;
      isYonton = false; // 前年夏至の陰遁期間とみなす
    } else {
      diffKoshi = days - base;
      isYonton = true;
    }
  }

  // 陽遁：甲子一白スタート (1 + diff)
  // 陰遁：甲子九紫スタート (9 - diff)
  if (isYonton) {
    centerStar = (1 + (diffKoshi % 9));
  } else {
    centerStar = (9 - (diffKoshi % 9));
  }

  while (centerStar > 9) centerStar -= 9;
  while (centerStar < 1) centerStar += 9;

  return calculateLoshuLayout(centerStar);
}

/**
 * 時の洛書盤を計算
 *
 * 時盤は日盤の陽遁・陰遁と日の干支によって決まる
 *
 * @param date 日付（時間を含む）
 * @returns 時の洛書配置
 */
export function calculateTimeLoshu(date: Date): LoshuLayout {
  // 1. 日の干支インデックスと陽遁/陰遁の判定
  const days = getDaysSince2000(date);
  const kanshiIndex = getKanshiIndex(days); // 日の干支(0-59)
  
  const y = date.getFullYear();
  const prevTojiKoshi = getNearestKoshi(new Date(y - 1, 11, 22)); 
  const geshiKoshi = getNearestKoshi(new Date(y, 5, 21));         
  const tojiKoshi = getNearestKoshi(new Date(y, 11, 22));         
  
  let isYonton = true;
  if (days >= prevTojiKoshi && days < geshiKoshi) {
    isYonton = true;
  } else if (days >= geshiKoshi && days < tojiKoshi) {
    isYonton = false;
  } else {
    isYonton = (days >= tojiKoshi);
    if (days < prevTojiKoshi) isYonton = false;
  }

  // 2. 日の干支グループから子の刻(23-1時)のベース星を特定
  const dayGroup = kanshiIndex % 12; 
  // 子(0)午(6)卯(3)酉(9), 辰(4)戌(10)丑(1)未(7), 寅(2)申(8)巳(5)亥(11)
  let startStar = 1;
  if (isYonton) {
    if ([0, 3, 6, 9].includes(dayGroup)) startStar = 1;
    else if ([1, 4, 7, 10].includes(dayGroup)) startStar = 4;
    else startStar = 7;
  } else {
    if ([0, 3, 6, 9].includes(dayGroup)) startStar = 9;
    else if ([1, 4, 7, 10].includes(dayGroup)) startStar = 6;
    else startStar = 3;
  }

  // 3. 現在時刻の十二支インデックスをプラス/マイナス
  const hour = date.getHours();
  // 子(23-1時 = 0), 丑(1-3時 = 1)...
  const zhiIndex = Math.floor(((hour + 1) % 24) / 2);
  
  let timeStar = isYonton ? (startStar + zhiIndex) : (startStar - zhiIndex);
  
  while (timeStar > 9) timeStar -= 9;
  while (timeStar < 1) timeStar += 9;

  return calculateLoshuLayout(timeStar);
}

/**
 * 指定日の年・月・日・時の洛書盤を全て計算
 *
 * @param date 日付
 * @returns 年・月・日・時の洛書盤
 */
export function calculateAllLoshuBoards(date: Date): LoshuBoards {
  return {
    year: calculateYearLoshu(date),
    month: calculateMonthLoshu(date),
    day: calculateDayLoshu(date),
    time: calculateTimeLoshu(date)
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
