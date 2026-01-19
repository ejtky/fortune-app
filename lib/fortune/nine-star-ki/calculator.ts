/**
 * 九星気学の計算エンジン
 * 本命星・月命星・日命星・傾斜宮・同会星を計算
 */

import {
  STAR_NAMES,
  ELEMENT_MAP,
  LUCKY_COLORS,
  LUCKY_DIRECTIONS,
  CHARACTERISTICS,
  KEISHAKYU_MAP,
  MONTH_STAR_TABLES,
  SETSUIRI_DATES,
  BASE_YEAR,
  LOSHU_POSITIONS
} from './constants';
import { NineStarKiProfile, NineStarKiReading } from '@/types/fortune';

/**
 * 立春の調整
 * 九星気学では立春（2月4日頃）が年の変わり目
 * @param date 生年月日
 * @returns 調整された年
 */
export function adjustYearForRisshun(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript は 0始まり
  const day = date.getDate();

  // 2月4日より前は前年扱い
  if (month < 2 || (month === 2 && day < 4)) {
    return year - 1;
  }

  return year;
}

/**
 * 本命星（年命星）を計算
 * @param birthDate 生年月日
 * @returns 本命星（1-9）
 */
export function calculateHonmeiStar(birthDate: Date): number {
  // 立春調整
  const adjustedYear = adjustYearForRisshun(birthDate);

  // 基準年からの年数を計算
  const yearsSince = adjustedYear - BASE_YEAR;

  // 九星は9年周期で逆順に回る
  let star = 11 - (yearsSince % 9);
  if (star > 9) star -= 9;
  if (star <= 0) star += 9;

  return star;
}

/**
 * 節入り日を考慮した月の調整
 * @param month 月
 * @param day 日
 * @returns 調整された月（0-11）
 */
function adjustMonthBySetsuiri(month: number, day: number): number {
  // 節入り日を取得
  const setsuiri = SETSUIRI_DATES[month - 1];

  // 節入り日より前の場合、前月扱い
  if (day < setsuiri.day) {
    return month - 1 === 0 ? 12 : month - 1;
  }

  return month;
}

/**
 * 月命星（月生命）を計算
 * @param birthDate 生年月日
 * @param honmeiStar 本命星
 * @returns 月命星（1-9）
 */
export function calculateMonthStar(birthDate: Date, honmeiStar: number): number {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // 節入り日を考慮した月の調整
  const adjustedMonth = adjustMonthBySetsuiri(month, day);

  // 本命星の月命星テーブルを取得
  const monthStarTable = MONTH_STAR_TABLES[honmeiStar];

  // 月命星を返す（配列は0始まりなので-1）
  return monthStarTable[adjustedMonth - 1];
}

/**
 * 立春の日付を取得
 * @param year 年
 * @returns 立春の日付
 */
function getRisshunDate(year: number): Date {
  // 簡略化: 2月4日を立春とする
  // 実際には天文計算が必要だが、ここでは固定値を使用
  return new Date(year, 1, 4); // 月は0始まりなので1=2月
}

/**
 * 2つの日付間の日数を計算
 * @param date1 開始日
 * @param date2 終了日
 * @returns 日数
 */
function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // ミリ秒
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * 日命星を計算
 * @param birthDate 生年月日
 * @returns 日命星（1-9）
 */
export function calculateDayStar(birthDate: Date): number {
  // 生年の立春を取得
  const birthYear = birthDate.getFullYear();
  const risshunDate = getRisshunDate(birthYear);

  // 立春からの経過日数
  const daysSinceRisshun = getDaysBetween(risshunDate, birthDate);

  // 立春の日の日命星を計算（年によって変わる）
  // 簡略化: 本命星を基準に計算
  const honmeiStar = calculateHonmeiStar(birthDate);
  const risshunDayStar = honmeiStar;

  // 9日周期で循環
  let dayStar = ((daysSinceRisshun % 9) + risshunDayStar) % 9;
  if (dayStar <= 0) dayStar += 9;

  return dayStar;
}

/**
 * 傾斜宮を計算
 * 本命星の定位置を返す
 * @param honmeiStar 本命星
 * @returns 傾斜宮（1-9）
 */
export function calculateKeishakyu(honmeiStar: number): number {
  return KEISHAKYU_MAP[honmeiStar];
}

/**
 * 年の中宮星を計算
 * @param year 年
 * @returns 中宮星（1-9）
 */
function calculateYearCenterStar(year: number): number {
  // 立春調整後の年で計算
  const adjustedYear = year;
  const yearsSince = adjustedYear - BASE_YEAR;

  // 中宮星は本命星と同じ計算方法
  let star = 11 - (yearsSince % 9);
  if (star > 9) star -= 9;
  if (star <= 0) star += 9;

  return star;
}

/**
 * 洛書盤上の指定位置にある星を計算
 * @param centerStar 中宮の星
 * @param position 位置（1-9, 5=中宮）
 * @returns その位置にある星
 */
function calculateStarAtPosition(centerStar: number, position: number): number {
  // 中宮の場合
  if (position === 5) {
    return centerStar;
  }

  // 洛書の配置を取得
  const positions = LOSHU_POSITIONS[centerStar];

  // 位置から星を計算
  // position: 1=北, 2=北東, 3=東, 4=南東, 5=中宮, 6=南, 7=南西, 8=西, 9=北西
  const positionIndex = [1, 2, 3, 4, 6, 7, 8, 9].indexOf(position);

  if (positionIndex === -1) {
    return centerStar; // エラー時は中宮を返す
  }

  return positions[positionIndex];
}

/**
 * 同会星を計算
 * 生まれた年の本命星の定位置に回座している星
 * @param birthYear 生年（立春調整済み）
 * @param honmeiStar 本命星
 * @returns 同会星（1-9）
 */
export function calculateDokaisei(birthYear: number, honmeiStar: number): number {
  // 生まれた年の中宮星を計算
  const yearCenterStar = calculateYearCenterStar(birthYear);

  // 本命星の定位置（傾斜宮）を取得
  const keishakyu = calculateKeishakyu(honmeiStar);

  // その位置に回座している星を計算
  const dokaisei = calculateStarAtPosition(yearCenterStar, keishakyu);

  return dokaisei;
}

/**
 * 九星気学の完全なプロフィールを計算
 * @param birthDate 生年月日
 * @returns 九星気学プロフィール
 */
export function calculateNineStarKiProfile(birthDate: Date): NineStarKiProfile {
  // 本命星を計算
  const honmei = calculateHonmeiStar(birthDate);

  // 月命星を計算
  const getsumesei = calculateMonthStar(birthDate, honmei);

  // 日命星を計算
  const nichisei = calculateDayStar(birthDate);

  // 傾斜宮を計算
  const keishakyu = calculateKeishakyu(honmei);

  // 同会星を計算
  const adjustedYear = adjustYearForRisshun(birthDate);
  const dokaisei = calculateDokaisei(adjustedYear, honmei);

  return {
    honmei,
    getsumesei,
    nichisei,
    keishakyu,
    dokaisei
  };
}

/**
 * 詳細な九星気学の解釈を生成
 * @param birthDate 生年月日
 * @returns 詳細な九星気学の読み取り結果
 */
export function generateNineStarKiReading(birthDate: Date): NineStarKiReading {
  const profile = calculateNineStarKiProfile(birthDate);

  return {
    ...profile,
    starName: STAR_NAMES[profile.honmei],
    element: ELEMENT_MAP[profile.honmei],
    characteristics: CHARACTERISTICS[profile.honmei],
    luckyColors: LUCKY_COLORS[profile.honmei],
    luckyDirections: LUCKY_DIRECTIONS[profile.honmei],
    monthStarName: STAR_NAMES[profile.getsumesei],
    dayStarName: STAR_NAMES[profile.nichisei],
    interpretation: {
      personality: `あなたの本命星は${STAR_NAMES[profile.honmei]}です。${ELEMENT_MAP[profile.honmei]}の性質を持ち、${CHARACTERISTICS[profile.honmei].slice(0, 3).join('、')}という特徴があります。`,
      talents: `月命星は${STAR_NAMES[profile.getsumesei]}で、内面には${ELEMENT_MAP[profile.getsumesei]}の才能が秘められています。`,
      tendencies: `日命星は${STAR_NAMES[profile.nichisei]}で、日常的には${ELEMENT_MAP[profile.nichisei]}の性質が表れやすい傾向にあります。`
    }
  };
}

/**
 * テスト用エクスポート
 */
export const _test = {
  adjustYearForRisshun,
  adjustMonthBySetsuiri,
  getRisshunDate,
  getDaysBetween,
  calculateYearCenterStar,
  calculateStarAtPosition
};
