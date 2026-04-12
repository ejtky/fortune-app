/**
 * 方位学の統合計算システム
 * Directional Studies Main Calculator
 */

import type { DirectionKey, DirectionQuality } from './constants';
import { DIRECTIONS, QUALITY_DESCRIPTIONS } from './constants';
import type { LoshuBoards } from './loshu';
import {
  calculateAllLoshuBoards,
  getStarAtDirection
} from './loshu';
import {
  type SatsuInfo,
  calculateAllSatsu,
  getSatsuAtDirection,
  evaluateDirectionDanger
} from './satsu';

/**
 * 方位の分析結果
 */
export interface DirectionAnalysis {
  direction: DirectionKey;
  directionName: string;
  quality: DirectionQuality;
  score: number; // 0-100（高いほど良い）
  yearStar: number;
  monthStar: number;
  dayStar: number;
  satsu: SatsuInfo | null;
  isLucky: boolean;
  reason: string;
}

/**
 * 方位学の完全な読み取り結果
 */
export interface DirectionalReading {
  date: Date;
  honmeiStar: number;
  tsukimeiStar?: number;
  loshuBoards: LoshuBoards;
  directions: DirectionAnalysis[];
  bestDirections: DirectionKey[];
  worstDirections: DirectionKey[];
  luckyDirections: DirectionKey[];
  summary: string;
}

/**
 * 方位の吉凶を評価
 *
 * @param direction 方位
 * @param loshuBoards 洛書盤
 * @param honmeiStar 本命星
 * @param satsuList 殺のリスト
 * @returns 方位の分析結果
 */
export function analyzeDirection(
  direction: DirectionKey,
  loshuBoards: LoshuBoards,
  honmeiStar: number,
  satsuList: SatsuInfo[],
  boardType: 'year' | 'month' | 'day'
): DirectionAnalysis {
  // 各盤でのこの方位の星を取得
  const targetStar = getStarAtDirection(loshuBoards[boardType], direction);
  const yearStar = getStarAtDirection(loshuBoards.year, direction);
  const monthStar = getStarAtDirection(loshuBoards.month, direction);
  const dayStar = getStarAtDirection(loshuBoards.day, direction);

  // 殺のチェック
  const satsu = getSatsuAtDirection(satsuList, direction);
  const dangerScore = evaluateDirectionDanger(satsuList, direction);

  // 吉方位かどうかの判定（選択された盤の星で判定）
  const isLucky = isLuckyDirection(honmeiStar, targetStar);

  // スコア計算（0-100）
  let score = 50; // 基本スコア

  // 殺がある場合は大幅減点（最優先）
  if (satsu) {
    score -= 50; // 殺がある方位は必ず凶方位になる
  }
  score -= dangerScore;

  // 吉方位なら加点
  if (isLucky && !satsu) {
    score += 40; // 殺がない吉方位のみ加点
  }

  // 五行の相性で調整
  const elementScore = evaluateElementCompatibility(honmeiStar, targetStar);
  score += elementScore;

  // スコアを 0-100 に正規化
  score = Math.max(0, Math.min(100, score));

  // 品質評価
  const quality = scoreToQuality(score);

  // 理由の生成
  const reason = generateReason(direction, quality, isLucky, satsu, targetStar);

  return {
    direction,
    directionName: DIRECTIONS[direction],
    quality,
    score,
    yearStar,
    monthStar,
    dayStar,
    satsu,
    isLucky,
    reason
  };
}

/**
 * 吉方位かどうかを判定
 *
 * @param honmeiStar 本命星（判定基準星）
 * @param targetStar 盤の星
 * @returns 吉方位かどうか
 */
function isLuckyDirection(
  honmeiStar: number,
  targetStar: number
): boolean {
  return isElementGenerating(honmeiStar, targetStar);
}

/**
 * 五行の相生関係（吉関係）をチェック
 *
 * @param star1 自分の星
 * @param star2 相手（盤）の星
 * @returns 吉関係（生気・退気・比和）か
 */
function isElementGenerating(star1: number, star2: number): boolean {
  const elementMap: Record<number, string> = {
    1: '水', 2: '土', 3: '木', 4: '木',
    5: '土', 6: '金', 7: '金', 8: '土', 9: '火'
  };

  const generating: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  const element1 = elementMap[star1];
  const element2 = elementMap[star2];

  // 相手が自分を生じる（生気）、自分が相手を生じる（退気）、同じ（比和）は吉
  return generating[element2] === element1 || generating[element1] === element2 || element1 === element2;
}

/**
 * 五行の相剋関係（凶関係）をチェック
 *
 * @param star1 自分の星
 * @param star2 相手（盤）の星
 * @returns 凶関係（死気・殺気）か
 */
function isElementControlling(star1: number, star2: number): boolean {
  const elementMap: Record<number, string> = {
    1: '水', 2: '土', 3: '木', 4: '木',
    5: '土', 6: '金', 7: '金', 8: '土', 9: '火'
  };

  const controlling: Record<string, string> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };

  const element1 = elementMap[star1];
  const element2 = elementMap[star2];

  // 自分が相手を剋する（死気）、相手が自分を剋する（殺気）
  return controlling[element1] === element2 || controlling[element2] === element1;
}

/**
 * 五行の相性を評価
 *
 * @param honmeiStar 本命星
 * @param directionStar 方位の星
 * @returns スコア調整値（-20 ~ +20）
 */
function evaluateElementCompatibility(honmeiStar: number, directionStar: number): number {
  const elementMap: Record<number, string> = {
    1: '水', 2: '土', 3: '木', 4: '木',
    5: '土', 6: '金', 7: '金', 8: '土', 9: '火'
  };

  const element1 = elementMap[honmeiStar];
  const element2 = elementMap[directionStar];

  // 相生（生じる）
  const generating: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  // 相剋（克する）
  const controlling: Record<string, string> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };

  if (generating[element2] === element1) {
    return 30; // 生気（大吉）
  } else if (generating[element1] === element2) {
    return 20; // 退気（吉）
  } else if (controlling[element2] === element1) {
    return -30; // 殺気（大凶）
  } else if (controlling[element1] === element2) {
    return -20; // 死気（凶）
  } else if (element1 === element2) {
    return 10; // 比和（吉）
  }

  return 0; // 普通
}

/**
 * スコアから品質評価を算出
 *
 * @param score スコア（0-100）
 * @returns 品質評価
 */
function scoreToQuality(score: number): DirectionQuality {
  if (score >= 75) return 'excellent';  // 大吉（75以上）
  if (score >= 55) return 'good';       // 吉（55-74）
  if (score >= 35) return 'neutral';    // 平（35-54）
  if (score >= 15) return 'caution';    // 小凶（15-34）
  return 'avoid';                       // 大凶（15未満）
}

/**
 * 理由を生成
 */
function generateReason(
  direction: DirectionKey,
  quality: DirectionQuality,
  isLucky: boolean,
  satsu: SatsuInfo | null,
  yearStar: number
): string {
  const starNames: Record<number, string> = {
    1: '一白水星', 2: '二黒土星', 3: '三碧木星',
    4: '四緑木星', 5: '五黄土星', 6: '六白金星',
    7: '七赤金星', 8: '八白土星', 9: '九紫火星'
  };

  let reason = `${DIRECTIONS[direction]}には${starNames[yearStar]}が回座しています。`;

  if (satsu) {
    reason += `${satsu.name}にあたり、${satsu.description}`;
  } else if (isLucky) {
    reason += `吉方位です。この方位への移動や新規事業に適しています。`;
  } else {
    reason += `${QUALITY_DESCRIPTIONS[quality]}`;
  }

  return reason;
}

/**
 * 完全な方位学の読み取りを生成
 *
 * @param date 日付
 * @param honmeiStar 本命星
 * @param tsukimeiStar 月命星（省略可。指定すると月命殺・月命的殺も計算）
 * @param boardType 評価対象の盤（year, month, day）
 * @returns 方位学の読み取り結果
 */
export function generateDirectionalReading(
  date: Date,
  honmeiStar: number,
  tsukimeiStar?: number,
  boardType: 'year' | 'month' | 'day' = 'month'
): DirectionalReading {
  // 洛書盤を計算
  const loshuBoards = calculateAllLoshuBoards(date);

  // 選択された盤タイプの殺のみを計算
  let targetLoshuLayout;
  if (boardType === 'year') {
    targetLoshuLayout = loshuBoards.year;
  } else if (boardType === 'month') {
    targetLoshuLayout = loshuBoards.month;
  } else {
    targetLoshuLayout = loshuBoards.day;
  }

  const satsuList = calculateAllSatsu(targetLoshuLayout, honmeiStar, tsukimeiStar);

  // 全方位を分析
  const directions = (Object.keys(DIRECTIONS) as DirectionKey[]).map(direction =>
    analyzeDirection(direction, loshuBoards, honmeiStar, satsuList, boardType)
  );

  // ベスト3とワースト3を抽出
  const sortedByScore = [...directions].sort((a, b) => b.score - a.score);
  const bestDirections = sortedByScore.slice(0, 3).map(d => d.direction);
  const worstDirections = sortedByScore.slice(-3).map(d => d.direction);

  // 吉方位のリスト
  const luckyDirections = directions
    .filter(d => d.isLucky && !d.satsu)
    .map(d => d.direction);

  // サマリー生成
  const summary = generateSummary(date, bestDirections, worstDirections, satsuList);

  return {
    date,
    honmeiStar,
    tsukimeiStar,
    loshuBoards,
    directions,
    bestDirections,
    worstDirections,
    luckyDirections,
    summary
  };
}

/**
 * 殺のseverityを数値に変換（比較用）
 */
function severityRank(severity: 'critical' | 'high' | 'medium'): number {
  return severity === 'critical' ? 3 : severity === 'high' ? 2 : 1;
}

/**
 * サマリーを生成
 */
function generateSummary(
  date: Date,
  bestDirections: DirectionKey[],
  worstDirections: DirectionKey[],
  satsuList: SatsuInfo[]
): string {
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  let summary = `${dateStr}の方位\n\n`;
  summary += `◎ 吉方位: ${bestDirections.map(d => DIRECTIONS[d]).join('、')}\n`;
  summary += `× 凶方位: ${worstDirections.map(d => DIRECTIONS[d]).join('、')}\n\n`;

  if (satsuList.length > 0) {
    summary += `【注意すべき殺】\n`;
    satsuList.forEach(satsu => {
      const dirName = satsu.direction === 'CENTER' ? '中央' : DIRECTIONS[satsu.direction as DirectionKey];
      summary += `• ${satsu.name}（${dirName}）: ${satsu.description}\n`;
    });
  }

  return summary;
}
