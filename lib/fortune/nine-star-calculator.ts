/**
 * 九星気学の計算ロジック
 * 生年月日から本命星・月命星を計算
 */

export type NineStarNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const NINE_STARS = {
  1: '一白水星',
  2: '二黒土星',
  3: '三碧木星',
  4: '四緑木星',
  5: '五黄土星',
  6: '六白金星',
  7: '七赤金星',
  8: '八白土星',
  9: '九紫火星',
} as const;

export const FIVE_ELEMENTS = {
  1: '水',
  2: '土',
  3: '木',
  4: '木',
  5: '土',
  6: '金',
  7: '金',
  8: '土',
  9: '火',
} as const;

/**
 * 立春の日付を取得（簡易版）
 * 実際は天文計算が必要だが、ここでは2月4日で固定
 */
function getRissyunDate(year: number): Date {
  // 立春は通常2月4日頃（簡易版）
  return new Date(year, 1, 4); // 月は0始まりなので1=2月
}

/**
 * 節月の節入り日を取得（簡易版）
 * 各月の節入り日（おおよそ）
 */
const SEKKI_DATES = [
  6,  // 1月: 小寒（1/6頃）
  4,  // 2月: 立春（2/4頃）
  6,  // 3月: 啓蟄（3/6頃）
  5,  // 4月: 清明（4/5頃）
  6,  // 5月: 立夏（5/6頃）
  6,  // 6月: 芒種（6/6頃）
  7,  // 7月: 小暑（7/7頃）
  8,  // 8月: 立秋（8/8頃）
  8,  // 9月: 白露（9/8頃）
  8,  // 10月: 寒露（10/8頃）
  7,  // 11月: 立冬（11/7頃）
  7,  // 12月: 大雪（12/7頃）
];

/**
 * 節月を取得（二十四節気に基づく月）
 * @returns 節月インデックス（0=寅月、1=卯月、...、9=亥月、10=子月、11=丑月）
 */
function getSekkiMonth(date: Date): number {
  let month = date.getMonth(); // 0-11（暦月）
  const day = date.getDate();
  const sekkiDay = SEKKI_DATES[month];

  // 節入り日より前なら前月扱い
  if (day < sekkiDay) {
    month = month === 0 ? 11 : month - 1;
  }

  // 暦月インデックスを節月インデックスに変換
  // 暦月1（2月）→節月0（寅月）、暦月2（3月）→節月1（卯月）、...
  // 暦月10（11月）→節月9（亥月）、暦月11（12月）→節月10（子月）、暦月0（1月）→節月11（丑月）
  const sekkiMonth = (month + 11) % 12;

  return sekkiMonth;
}

/**
 * 本命星を計算
 * @param birthDate 生年月日
 * @returns 本命星の番号（1-9）
 */
export function calculateMainStar(birthDate: Date): NineStarNumber {
  let year = birthDate.getFullYear();
  const rissyun = getRissyunDate(year);

  // 立春より前の生まれは前年扱い
  if (birthDate < rissyun) {
    year -= 1;
  }

  // 西暦の各桁を足す
  const yearStr = year.toString();
  const digitSum = yearStr.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);

  // 9で割った余り
  const remainder = digitSum % 9;

  // 11から余りを引く
  let starNumber = 11 - remainder;

  // 10以上なら9を引く
  if (starNumber >= 10) {
    starNumber -= 9;
  }

  // 0以下なら9を足す
  if (starNumber <= 0) {
    starNumber += 9;
  }

  return starNumber as NineStarNumber;
}

/**
 * 月命星計算用のテーブル
 * 本命星と節月（十二支の月）から月命星を求める
 * インデックス: 0=寅月、1=卯月、2=辰月、3=巳月、4=午月、5=未月、
 *              6=申月、7=酉月、8=戌月、9=亥月、10=子月、11=丑月
 */
const MONTH_STAR_TABLE: Record<NineStarNumber, NineStarNumber[]> = {
  // 本命星が1,4,7の場合
  1: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
  4: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
  7: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],

  // 本命星が2,5,8の場合
  2: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
  5: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
  8: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],

  // 本命星が3,6,9の場合
  3: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
  6: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
  9: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
};

/**
 * 月命星を計算
 * @param birthDate 生年月日
 * @param mainStar 本命星
 * @returns 月命星の番号（1-9）
 */
export function calculateMonthlyStar(birthDate: Date, mainStar: NineStarNumber): NineStarNumber {
  // 節月を取得（二十四節気に基づく月）
  const sekkiMonth = getSekkiMonth(birthDate);

  // 月命星テーブルから取得
  return MONTH_STAR_TABLE[mainStar][sekkiMonth];
}

/**
 * 九星の詳細情報
 */
export interface NineStarInfo {
  number: NineStarNumber;
  name: string;
  element: string;
  description: string;
}

/**
 * 九星の基本情報を取得
 */
export function getNineStarInfo(starNumber: NineStarNumber): NineStarInfo {
  const descriptions: Record<NineStarNumber, string> = {
    1: '智慧と柔軟性を持つ水の星。深い洞察力と適応力が特徴です。',
    2: '母なる大地のように育成力に優れた土の星。忍耐強くサポート力があります。',
    3: '若木のような成長力と行動力を持つ木の星。エネルギッシュで前向きです。',
    4: '大樹のような調和力と柔軟性を持つ木の星。コミュニケーション力に優れます。',
    5: '帝王の星。最強のエネルギーと破壊・再生の力を持つ土の星です。',
    6: '天のような高いリーダーシップを持つ金の星。完璧主義で正義感が強いです。',
    7: '喜びと表現力に優れた金の星。社交的で人生を楽しむ力があります。',
    8: '山のような変革力を持つ土の星。独立心が強く転換点を迎えやすいです。',
    9: '太陽のような知性と華やかさを持つ火の星。芸術性と洞察力に優れます。',
  };

  return {
    number: starNumber,
    name: NINE_STARS[starNumber],
    element: FIVE_ELEMENTS[starNumber],
    description: descriptions[starNumber],
  };
}

/**
 * 生年月日から完全な九星診断を取得
 */
export interface NineStarDiagnosis {
  birthDate: Date;
  mainStar: NineStarInfo;
  monthlyStar: NineStarInfo;
  age: number;
}

/**
 * 九星診断を実行
 */
export function diagnoseNineStar(birthDate: Date): NineStarDiagnosis {
  const mainStarNumber = calculateMainStar(birthDate);
  const monthlyStarNumber = calculateMonthlyStar(birthDate, mainStarNumber);

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear() -
    (today.getMonth() < birthDate.getMonth() ||
     (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

  return {
    birthDate,
    mainStar: getNineStarInfo(mainStarNumber),
    monthlyStar: getNineStarInfo(monthlyStarNumber),
    age,
  };
}
