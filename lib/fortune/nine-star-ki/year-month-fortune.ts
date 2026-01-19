/**
 * 九星気学の年運・月運計算
 * Year and Month Fortune Calculation
 */

import { STAR_NAMES, ELEMENT_MAP, LOSHU_POSITIONS } from './constants';

export type FortuneLevel = 'excellent' | 'good' | 'neutral' | 'caution' | 'challenging';

export interface DirectionalFortune {
  direction: string;
  star: number;
  starName: string;
  element: string;
  level: FortuneLevel;
  description: string;
  advice: string;
}

export interface MonthFortune {
  year: number;
  month: number;
  centerStar: number;
  centerStarName: string;
  overallLevel: FortuneLevel;
  overallDescription: string;
  keyTheme: string;
  luckyDirections: string[];
  cautionDirections: string[];
  advice: string;
  directionalFortunes: DirectionalFortune[];
}

export interface YearFortune {
  year: number;
  centerStar: number;
  centerStarName: string;
  overallLevel: FortuneLevel;
  overallDescription: string;
  yearTheme: string;
  luckyMonths: number[];
  cautionMonths: number[];
  annualAdvice: string;
  monthlyFortunes: MonthFortune[];
}

/**
 * 年の中宮星を計算
 * Calculate the center star for a given year
 */
export function calculateYearStar(year: number): number {
  // 九星気学では、年の九星は9年周期で巡る
  // 基準: 2026年 = 七赤金星
  const baseYear = 2026;
  const baseStar = 7;

  const yearDiff = year - baseYear;

  // 年が進むと星は逆行する（9→8→7...→1→9）
  // JavaScriptの%演算子は負の数に対して負の結果を返すので調整が必要
  let centerStar = baseStar - yearDiff;

  // 1-9の範囲に収める
  while (centerStar > 9) {
    centerStar -= 9;
  }
  while (centerStar < 1) {
    centerStar += 9;
  }

  return centerStar;
}

/**
 * 月の中宮星を計算
 * Calculate the center star for a given month
 */
export function calculateMonthStar(year: number, month: number): number {
  // 月の九星は年の九星によって決まる
  // 2月(立春)から始まる
  const yearStar = calculateYearStar(year);

  // 2月を起点として、月ごとに星が変わる
  // 年星によって月星の配列が異なる
  const monthStarSequence = getMonthStarSequence(yearStar);

  // monthStarSequenceが取得できない場合のエラーハンドリング
  if (!monthStarSequence) {
    console.error(`Invalid yearStar: ${yearStar}`);
    return 5; // デフォルトとして五黄土星を返す
  }

  // 2月=index 0, 3月=index 1, ... 1月=index 11
  const monthIndex = month >= 2 ? month - 2 : month + 10;

  return monthStarSequence[monthIndex];
}

/**
 * 年星に基づく月星の配列を取得
 */
function getMonthStarSequence(yearStar: number): number[] {
  // 各年星に対応する2月から始まる月星の配列
  const sequences: Record<number, number[]> = {
    1: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
    2: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
    3: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
    4: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
    5: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
    6: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9],
    7: [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6],
    8: [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3],
    9: [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9]
  };

  return sequences[yearStar];
}

/**
 * 方位ごとの運勢を計算
 */
function calculateDirectionalFortunes(
  centerStar: number,
  userStar: number
): DirectionalFortune[] {
  const positions = LOSHU_POSITIONS[centerStar];
  const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];

  return directions.map((direction, index) => {
    const star = positions[index];
    const starName = STAR_NAMES[star];
    const element = ELEMENT_MAP[star];

    // ユーザーの本命星との関係で吉凶を判定
    const { level, description, advice } = evaluateDirectionalRelationship(
      userStar,
      star,
      direction
    );

    return {
      direction,
      star,
      starName,
      element,
      level,
      description,
      advice
    };
  });
}

/**
 * 方位の吉凶を評価
 */
function evaluateDirectionalRelationship(
  userStar: number,
  directionStar: number,
  direction: string
): { level: FortuneLevel; description: string; advice: string } {
  const userElement = ELEMENT_MAP[userStar];
  const dirElement = ELEMENT_MAP[directionStar];

  // 本命星と同じ星 - 本命殺（凶方位）
  if (userStar === directionStar) {
    return {
      level: 'challenging',
      description: `${direction}は本命殺の方位です。自分自身の星があるため、エネルギーが強すぎて不調和を起こす可能性があります。`,
      advice: 'この方位への移動や重要な決断は避けましょう。特に引っ越しや新規事業の開始には不向きです。'
    };
  }

  // 五行の相生関係をチェック
  const generationMap: Record<string, string> = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };

  // 相生（吉方位）
  if (generationMap[userElement] === dirElement) {
    return {
      level: 'excellent',
      description: `${direction}はあなたのエネルギーを高める吉方位です。${userElement}が${dirElement}を生じる相生の関係にあります。`,
      advice: '積極的に活用できる方位です。この方位への旅行や引っ越し、商談などは良い結果をもたらします。'
    };
  }

  if (generationMap[dirElement] === userElement) {
    return {
      level: 'good',
      description: `${direction}はサポートを受けられる方位です。${dirElement}があなたの${userElement}を育ててくれます。`,
      advice: '助けや協力を得られる方位です。人との出会いや新しい学びに適しています。'
    };
  }

  // 相剋関係をチェック
  const controllingMap: Record<string, string> = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };

  if (controllingMap[userElement] === dirElement) {
    return {
      level: 'caution',
      description: `${direction}はあなたが抑制する方位です。エネルギーを消耗しやすい傾向があります。`,
      advice: '長期滞在や重要な決断は避けた方が無難です。短期的な用事程度に留めましょう。'
    };
  }

  if (controllingMap[dirElement] === userElement) {
    return {
      level: 'challenging',
      description: `${direction}はあなたを抑制する方位です。プレッシャーを感じたり、思うように進まないことがあります。`,
      advice: 'できるだけ避けたい方位です。やむを得ない場合は、十分な準備と慎重な行動を心がけてください。'
    };
  }

  // その他（中立）
  return {
    level: 'neutral',
    description: `${direction}は中立的な方位です。特別な吉凶はありません。`,
    advice: '通常通りの行動で問題ありません。ただし、慎重さは忘れずに。'
  };
}

/**
 * 月運を計算
 */
export function calculateMonthFortune(
  year: number,
  month: number,
  userStar: number
): MonthFortune {
  const centerStar = calculateMonthStar(year, month);
  const centerStarName = STAR_NAMES[centerStar];
  const directionalFortunes = calculateDirectionalFortunes(centerStar, userStar);

  // 吉方位と凶方位を抽出
  const luckyDirections = directionalFortunes
    .filter(d => d.level === 'excellent' || d.level === 'good')
    .map(d => d.direction);

  const cautionDirections = directionalFortunes
    .filter(d => d.level === 'challenging' || d.level === 'caution')
    .map(d => d.direction);

  // 総合運勢レベルを判定
  const excellentCount = directionalFortunes.filter(d => d.level === 'excellent').length;
  const challengingCount = directionalFortunes.filter(d => d.level === 'challenging').length;

  let overallLevel: FortuneLevel = 'neutral';
  if (excellentCount >= 3) overallLevel = 'excellent';
  else if (excellentCount >= 2) overallLevel = 'good';
  else if (challengingCount >= 3) overallLevel = 'challenging';
  else if (challengingCount >= 2) overallLevel = 'caution';

  const monthThemes: Record<number, string> = {
    1: '新年の計画と準備',
    2: '新しいスタートの時期',
    3: '成長と発展',
    4: '調和とバランス',
    5: '活動と拡大',
    6: '調整と見直し',
    7: '収穫と実り',
    8: '変化と転換',
    9: '整理と準備',
    10: '深化と充実',
    11: '内省と学び',
    12: '締めくくりと感謝'
  };

  return {
    year,
    month,
    centerStar,
    centerStarName,
    overallLevel,
    overallDescription: `${month}月は${centerStarName}が中宮に入る月です。`,
    keyTheme: monthThemes[month],
    luckyDirections,
    cautionDirections,
    advice: `${month}月は${monthThemes[month]}の時期です。吉方位（${luckyDirections.join('、')}）を活用して、積極的に行動しましょう。`,
    directionalFortunes
  };
}

/**
 * 年運を計算
 */
export function calculateYearFortune(year: number, userStar: number): YearFortune {
  const centerStar = calculateYearStar(year);
  const centerStarName = STAR_NAMES[centerStar];

  // 12ヶ月分の月運を計算
  const monthlyFortunes = Array.from({ length: 12 }, (_, i) =>
    calculateMonthFortune(year, i + 1, userStar)
  );

  // 吉月と凶月を判定
  const luckyMonths = monthlyFortunes
    .filter(m => m.overallLevel === 'excellent' || m.overallLevel === 'good')
    .map(m => m.month);

  const cautionMonths = monthlyFortunes
    .filter(m => m.overallLevel === 'challenging' || m.overallLevel === 'caution')
    .map(m => m.month);

  // 年全体の運勢レベル
  const excellentMonthCount = monthlyFortunes.filter(m => m.overallLevel === 'excellent').length;
  const challengingMonthCount = monthlyFortunes.filter(m => m.overallLevel === 'challenging').length;

  let overallLevel: FortuneLevel = 'neutral';
  if (excellentMonthCount >= 4) overallLevel = 'excellent';
  else if (excellentMonthCount >= 2) overallLevel = 'good';
  else if (challengingMonthCount >= 4) overallLevel = 'challenging';
  else if (challengingMonthCount >= 2) overallLevel = 'caution';

  const yearThemes: Record<number, string> = {
    1: '静かな知恵と準備の年',
    2: '堅実な基盤作りの年',
    3: '成長と発展の年',
    4: '調和と人脈の年',
    5: '中心となって活躍する年',
    6: '責任と完成の年',
    7: '収穫と喜びの年',
    8: '変化と継承の年',
    9: '完成と新たな始まりの年'
  };

  return {
    year,
    centerStar,
    centerStarName,
    overallLevel,
    overallDescription: `${year}年は${centerStarName}が中宮に入る年です。`,
    yearTheme: yearThemes[centerStar],
    luckyMonths,
    cautionMonths,
    annualAdvice: `${year}年は${yearThemes[centerStar]}となります。特に${luckyMonths.slice(0, 3).join('月、')}月が運気の高い時期です。計画的に行動しましょう。`,
    monthlyFortunes
  };
}

/**
 * 運勢レベルに応じた色を取得
 */
export function getFortuneLevelColor(level: FortuneLevel): string {
  switch (level) {
    case 'excellent':
      return 'bg-green-100 border-green-300 text-green-900';
    case 'good':
      return 'bg-blue-100 border-blue-300 text-blue-900';
    case 'neutral':
      return 'bg-gray-100 border-gray-300 text-gray-900';
    case 'caution':
      return 'bg-yellow-100 border-yellow-400 text-yellow-900';
    case 'challenging':
      return 'bg-red-100 border-red-300 text-red-900';
  }
}

/**
 * 運勢レベルのラベルを取得
 */
export function getFortuneLevelLabel(level: FortuneLevel): string {
  switch (level) {
    case 'excellent':
      return '大吉';
    case 'good':
      return '吉';
    case 'neutral':
      return '中吉';
    case 'caution':
      return '小凶';
    case 'challenging':
      return '凶';
  }
}
