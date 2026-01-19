/**
 * 運勢予測システム
 * 九星盤の移動に基づいて運勢を判定
 */

import { calculateAllLoshuBoards, getDirectionOfStar, getHomeDirection } from './directional/loshu';
import { calculateAllSatsu } from './directional/satsu';
import { generateDirectionalReading } from './directional/calculator';
import type { NineStarNumber } from './nine-star-calculator';

/**
 * 運勢レベル
 */
export type FortuneLevel = 'excellent' | 'good' | 'normal' | 'caution' | 'bad';

/**
 * 運勢の詳細
 */
export interface FortuneDetail {
  level: FortuneLevel;
  score: number; // 0-100
  title: string;
  description: string;
  advice: string;
  luckyColor?: string;
  luckyDirection?: string;
  luckyNumber?: number;
}

/**
 * 期間別の運勢
 */
export interface FortunePrediction {
  date: Date;
  honmeiStar: NineStarNumber;
  daily: FortuneDetail;
  monthly: FortuneDetail;
  yearly: FortuneDetail;
  overall: FortuneDetail;
}

/**
 * 九星の定位置（本来の宮）
 */
const STAR_HOME_POSITIONS: Record<NineStarNumber, string> = {
  1: '北（坎宮）',
  2: '南西（坤宮）',
  3: '東（震宮）',
  4: '南東（巽宮）',
  5: '中央（中宮）',
  6: '北西（乾宮）',
  7: '西（兌宮）',
  8: '北東（艮宮）',
  9: '南（離宮）',
};

/**
 * 運勢レベルから色を取得
 */
function getLevelColor(level: FortuneLevel): string {
  const colors: Record<FortuneLevel, string> = {
    excellent: '#10b981',
    good: '#3b82f6',
    normal: '#6b7280',
    caution: '#f59e0b',
    bad: '#ef4444',
  };
  return colors[level];
}

/**
 * スコアから運勢レベルを算出
 */
function scoreToLevel(score: number): FortuneLevel {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'normal';
  if (score >= 20) return 'caution';
  return 'bad';
}

/**
 * 本命星の位置から運勢を判定
 */
function evaluateStarPosition(
  honmeiStar: NineStarNumber,
  currentPosition: string,
  boardType: 'year' | 'month' | 'day'
): { score: number; description: string; advice: string } {
  const homePosition = STAR_HOME_POSITIONS[honmeiStar];

  // 自分の定位置にいる場合
  if (currentPosition === homePosition || currentPosition === '中央（中宮）') {
    return {
      score: 85,
      description: `あなたの星が${currentPosition}にあり、本来の力を発揮できる時期です。`,
      advice: '自信を持って行動しましょう。新しいことにチャレンジする好機です。',
    };
  }

  // 位置による基本評価
  const positionScores: Record<string, number> = {
    '北（坎宮）': 60,
    '北東（艮宮）': 50,
    '東（震宮）': 75,
    '南東（巽宮）': 70,
    '南（離宮）': 80,
    '南西（坤宮）': 55,
    '西（兌宮）': 65,
    '北西（乾宮）': 70,
  };

  const baseScore = positionScores[currentPosition] || 50;

  return {
    score: baseScore,
    description: `あなたの星が${currentPosition}に回座しています。`,
    advice: baseScore >= 70
      ? '積極的に行動する良い時期です。'
      : baseScore >= 50
      ? '慎重に行動すれば良い結果が得られます。'
      : '無理をせず、準備期間と考えましょう。',
  };
}

/**
 * 五行の関係から運勢を評価
 */
function evaluateElementRelation(honmeiStar: NineStarNumber, centerStar: number): number {
  const elementMap: Record<number, string> = {
    1: '水', 2: '土', 3: '木', 4: '木',
    5: '土', 6: '金', 7: '金', 8: '土', 9: '火'
  };

  const element1 = elementMap[honmeiStar];
  const element2 = elementMap[centerStar];

  // 相生（相手が自分を生じる）
  const beingGenerated: Record<string, string> = {
    '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
  };

  // 相生（自分が相手を生じる）
  const generating: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  // 相剋（相手が自分を剋する）
  const beingControlled: Record<string, string> = {
    '木': '金', '火': '水', '土': '木', '金': '火', '水': '土'
  };

  if (beingGenerated[element1] === element2) {
    return 20; // 相手が自分を生じる（吉）
  } else if (generating[element1] === element2) {
    return -10; // 自分が相手を生じる（やや凶）
  } else if (beingControlled[element1] === element2) {
    return -20; // 相手が自分を剋する（凶）
  } else if (element1 === element2) {
    return 10; // 比和（吉）
  }

  return 0;
}

/**
 * 日運を計算（方位学の結果を使用）
 */
function calculateDailyFortune(
  date: Date,
  honmeiStar: NineStarNumber
): FortuneDetail {
  // カレンダーと同じロジックを使用
  const reading = generateDirectionalReading(date, honmeiStar);

  const goodDirs: string[] = [];
  const badDirs: string[] = [];

  reading.directions.forEach((dir) => {
    if (dir.quality === 'excellent' || dir.quality === 'good') {
      goodDirs.push(dir.directionName);
    } else if (dir.quality === 'avoid' || dir.quality === 'caution') {
      badDirs.push(dir.directionName);
    }
  });

  // カレンダーと同じスコア計算
  const score = goodDirs.length * 10 - badDirs.length * 5;
  const normalizedScore = Math.round(Math.max(0, Math.min(100, 50 + score)));
  const level = scoreToLevel(normalizedScore);

  const boards = calculateAllLoshuBoards(date);
  const position = getDirectionOfStar(boards.day, honmeiStar);
  const positionName = position === 'CENTER' ? '中央（中宮）' : STAR_HOME_POSITIONS[honmeiStar];

  return {
    level,
    score: normalizedScore,
    title: `今日の運勢: ${level === 'excellent' ? '大吉' : level === 'good' ? '吉' : level === 'normal' ? '平' : level === 'caution' ? '小凶' : '凶'}`,
    description: `吉方位が${goodDirs.length}方位、凶方位が${badDirs.length}方位あります。あなたの星は${positionName}に回座しています。`,
    advice: goodDirs.length >= 4
      ? '多くの方位が吉方位です。積極的に行動する良い日です。'
      : goodDirs.length >= 2
      ? '吉方位を活用して行動しましょう。'
      : badDirs.length >= 4
      ? '慎重に行動する日です。無理をせず、準備を整えましょう。'
      : '普通の日です。計画的に行動しましょう。',
    luckyColor: getLuckyColor(honmeiStar),
    luckyDirection: goodDirs.length > 0 ? goodDirs[0] : '中央',
    luckyNumber: (honmeiStar % 9) + 1,
  };
}

/**
 * 月運を計算
 */
function calculateMonthlyFortune(
  date: Date,
  honmeiStar: NineStarNumber
): FortuneDetail {
  // 月の最初の日から月末までの平均スコアを計算
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let totalScore = 0;
  let dayCount = 0;

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const reading = generateDirectionalReading(new Date(d), honmeiStar);
    const goodDirs = reading.directions.filter(dir => dir.quality === 'excellent' || dir.quality === 'good').length;
    const badDirs = reading.directions.filter(dir => dir.quality === 'avoid' || dir.quality === 'caution').length;
    const dayScore = goodDirs * 10 - badDirs * 5;
    totalScore += dayScore;
    dayCount++;
  }

  const avgScore = totalScore / dayCount;
  const normalizedScore = Math.round(Math.max(0, Math.min(100, 50 + avgScore)));
  const level = scoreToLevel(normalizedScore);

  const boards = calculateAllLoshuBoards(date);
  const position = getDirectionOfStar(boards.month, honmeiStar);
  const positionName = position === 'CENTER' ? '中央（中宮）' : STAR_HOME_POSITIONS[honmeiStar];

  return {
    level,
    score: normalizedScore,
    title: `今月の運勢: ${level === 'excellent' ? '大吉' : level === 'good' ? '吉' : level === 'normal' ? '平' : level === 'caution' ? '小凶' : '凶'}`,
    description: `月全体の吉凶バランスから判定しています。あなたの星は${positionName}に回座し、月の中宮星は${boards.month.CENTER}です。`,
    advice: normalizedScore >= 70
      ? '良い月です。積極的に行動して目標を達成しましょう。'
      : normalizedScore >= 50
      ? '安定した月です。計画的に進めましょう。'
      : '慎重な行動が求められる月です。無理をせず、準備を整えましょう。',
  };
}

/**
 * 年運を計算
 */
function calculateYearlyFortune(
  date: Date,
  honmeiStar: NineStarNumber
): FortuneDetail {
  // 各月の代表日（15日）で計算して平均を取る
  const year = date.getFullYear();
  let totalScore = 0;

  for (let month = 0; month < 12; month++) {
    const sampleDate = new Date(year, month, 15);
    const reading = generateDirectionalReading(sampleDate, honmeiStar);
    const goodDirs = reading.directions.filter(dir => dir.quality === 'excellent' || dir.quality === 'good').length;
    const badDirs = reading.directions.filter(dir => dir.quality === 'avoid' || dir.quality === 'caution').length;
    const monthScore = goodDirs * 10 - badDirs * 5;
    totalScore += monthScore;
  }

  const avgScore = totalScore / 12;
  const normalizedScore = Math.round(Math.max(0, Math.min(100, 50 + avgScore)));
  const level = scoreToLevel(normalizedScore);

  const boards = calculateAllLoshuBoards(date);
  const position = getDirectionOfStar(boards.year, honmeiStar);
  const positionName = position === 'CENTER' ? '中央（中宮）' : STAR_HOME_POSITIONS[honmeiStar];

  return {
    level,
    score: normalizedScore,
    title: `今年の運勢: ${level === 'excellent' ? '大吉' : level === 'good' ? '吉' : level === 'normal' ? '平' : level === 'caution' ? '小凶' : '凶'}`,
    description: `年全体の吉凶バランスから判定しています。あなたの星は${positionName}に回座し、年の中宮星は${boards.year.CENTER}です。`,
    advice: normalizedScore >= 70
      ? '良い年です。大きな目標に挑戦しましょう。'
      : normalizedScore >= 50
      ? '安定した年です。着実に進めましょう。'
      : '準備と基盤固めの年です。焦らず、地道に取り組みましょう。',
  };
}

/**
 * ラッキーカラーを取得
 */
function getLuckyColor(honmeiStar: NineStarNumber): string {
  const colors: Record<NineStarNumber, string> = {
    1: '白・黒',
    2: '黄色・茶色',
    3: '緑・青緑',
    4: '緑・青',
    5: '黄色・茶色',
    6: '白・金色',
    7: '赤・ピンク',
    8: '黄色・白',
    9: '赤・紫',
  };
  return colors[honmeiStar];
}

/**
 * 吉方位を取得
 */
function getLuckyDirectionName(honmeiStar: NineStarNumber, board: any): string {
  const elementMap: Record<number, string> = {
    1: '水', 2: '土', 3: '木', 4: '木',
    5: '土', 6: '金', 7: '金', 8: '土', 9: '火'
  };

  const generating: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  const element = elementMap[honmeiStar];
  const targetElement = generating[element];

  // 相生する星を探す
  for (let star = 1; star <= 9; star++) {
    if (elementMap[star] === targetElement) {
      const position = getDirectionOfStar(board, star);
      if (position === 'N') return '北';
      if (position === 'NE') return '北東';
      if (position === 'E') return '東';
      if (position === 'SE') return '南東';
      if (position === 'S') return '南';
      if (position === 'SW') return '南西';
      if (position === 'W') return '西';
      if (position === 'NW') return '北西';
      break;
    }
  }

  return '中央';
}

/**
 * 総合運勢を計算
 */
export function calculateFortunePrediction(
  date: Date,
  honmeiStar: NineStarNumber
): FortunePrediction {
  const daily = calculateDailyFortune(date, honmeiStar);
  const monthly = calculateMonthlyFortune(date, honmeiStar);
  const yearly = calculateYearlyFortune(date, honmeiStar);

  // 総合運勢（日運70%、月運20%、年運10%）- 日運を重視
  const overallScore = Math.round(
    daily.score * 0.7 + monthly.score * 0.2 + yearly.score * 0.1
  );
  const overallLevel = scoreToLevel(overallScore);

  const overall: FortuneDetail = {
    level: overallLevel,
    score: overallScore,
    title: '総合運勢',
    description: `日運・月運・年運を総合的に判断した運勢です。本日は${overallLevel === 'excellent' ? '大吉' : overallLevel === 'good' ? '吉' : overallLevel === 'normal' ? '平' : overallLevel === 'caution' ? '小凶' : '凶'}の日です。`,
    advice: overallScore >= 70
      ? '全体的に良い運気です。積極的に行動しましょう。特に吉方位への移動が効果的です。'
      : overallScore >= 50
      ? '安定した運気です。計画的に進めましょう。無理のない範囲で行動するのが良いでしょう。'
      : '慎重な行動が求められる時期です。凶方位への移動は避け、準備を整えましょう。',
    luckyColor: daily.luckyColor,
    luckyDirection: daily.luckyDirection,
    luckyNumber: daily.luckyNumber,
  };

  return {
    date,
    honmeiStar,
    daily,
    monthly,
    yearly,
    overall,
  };
}
