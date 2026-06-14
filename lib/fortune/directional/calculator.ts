/**
 * 方位学の統合計算システム
 * Directional Studies Main Calculator
 */

import type { DirectionKey, DirectionQuality } from './constants';
import { BASE_LOSHU_LAYOUT, DIRECTIONS, LEGACY_DIRECTION_QUALITY } from './constants';
import type { DirectionCategory } from './colors';
import {
  CATEGORY_PRIORITY,
  DIRECTION_CATEGORY_LABEL,
  getDirectionColorClass,
  isKippouCategory,
  isKyouCategory,
  pickTopCategory,
} from './colors';
import { classifyHouiShin, type HouiShinName } from './houi-shin';
import type { LoshuBoards, LoshuLayout } from './loshu';
import {
  calculateAllLoshuBoards,
  getStarAtDirection
} from './loshu';
import {
  getEtoBranchName,
  getEtoDirection,
  getYearEtoBranch,
  getYearTenkanName,
  oppositeEto,
} from './eto-tables';
import { calculateMaxKippou } from '../nine-star-ki/calculator';
import {
  type SatsuInfo,
  calculateAllSatsu,
  calculateAnkenSatsu,
  calculateGetsuhaSatsu,
  calculateGoohSatsu,
  calculateHonmeiSatsu,
  calculateHonmeiTekiSatsu,
  calculateNippaSatsu,
  calculateSaihaSatsu,
  calculateTsukimeiSatsu,
  calculateTsukimeitekiSatsu,
  getOppositeDirection,
  getSatsuAtDirection,
} from './satsu';

export type DirectionBoardType = 'year' | 'month' | 'day' | 'time';
export type DirectionClassification = DirectionCategory[] & { houiShinNames: HouiShinName[] };

/**
 * 方位の分析結果
 */
export interface DirectionAnalysis {
  direction: DirectionKey;
  directionName: string;
  categories: DirectionCategory[];
  topCategory: DirectionCategory;
  colorClass: string;
  quality: DirectionQuality;
  score: number; // 0-100（既存UIの並び替え用）
  yearStar: number;
  monthStar: number;
  dayStar: number;
  satsu: SatsuInfo | null;
  satsuList: SatsuInfo[];
  houiShinNames: HouiShinName[];
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

export function classifyDirection(args: {
  direction: DirectionKey;
  honmei: number;
  getsumei: number;
  layout: LoshuLayout;
  boardType: DirectionBoardType;
  year?: number;
  yearEto?: string;
  yearTenkan?: string;
  month?: number;
  day?: number;
}): DirectionClassification {
  const cats = Object.assign([] as DirectionCategory[], {
    houiShinNames: [] as HouiShinName[],
  }) as DirectionClassification;
  const add = (cat: DirectionCategory) => {
    if (!cats.includes(cat)) cats.push(cat);
  };
  const addSatsu = (satsu: SatsuInfo | null) => {
    if (satsu?.direction === args.direction) add(satsu.type);
  };

  addSatsu(calculateGoohSatsu(args.layout));
  addSatsu(calculateAnkenSatsu(args.layout));

  if (args.boardType === 'year') {
    if (args.yearEto) {
      const saihaDirection = getEtoDirection(oppositeEto(args.yearEto) ?? '');
      if (saihaDirection === args.direction) add('saiha');
    } else if (args.year !== undefined) {
      addSatsu(calculateSaihaSatsu(args.year));
    }
  } else if (args.boardType === 'month' && args.month !== undefined) {
    addSatsu(calculateGetsuhaSatsu(args.year ?? new Date().getFullYear(), args.month));
  } else if (args.boardType === 'day' && args.month !== undefined && args.day !== undefined) {
    addSatsu(calculateNippaSatsu(args.year ?? new Date().getFullYear(), args.month, args.day));
  }

  addSatsu(calculateHonmeiSatsu(args.layout, args.honmei));
  addSatsu(calculateHonmeiTekiSatsu(args.layout, args.honmei));

  if (isStarNumber(args.getsumei)) {
    addSatsu(calculateTsukimeiSatsu(args.layout, args.getsumei));
    addSatsu(calculateTsukimeitekiSatsu(args.layout, args.getsumei));
  }

  if (args.boardType === 'year' && isTeiiTaichu(args.layout, args.direction)) {
    add('teii_taichu');
  }

  const targetStar = getStarAtDirection(args.layout, args.direction);
  if (isStarNumber(args.getsumei) && calculateMaxKippou(args.honmei, args.getsumei).includes(targetStar)) {
    add('max_kippou');
  } else if (targetStar !== 5 && isLuckyDirection(args.honmei, targetStar)) {
    add('kichi');
  }

  if (cats.length === 0) add('normal');
  if (args.boardType === 'year' && args.yearEto && args.yearTenkan) {
    cats.houiShinNames = classifyHouiShin(args.yearEto, args.yearTenkan, DIRECTIONS[args.direction]);
  }

  return cats;
}

/**
 * 方位の吉凶を評価
 */
export function analyzeDirection(
  direction: DirectionKey,
  loshuBoards: LoshuBoards,
  honmeiStar: number,
  satsuList: SatsuInfo[],
  boardType: DirectionBoardType,
  options: {
    tsukimeiStar?: number;
    year: number;
    month: number;
    day: number;
  }
): DirectionAnalysis {
  const targetLayout = loshuBoards[boardType];
  const targetStar = getStarAtDirection(targetLayout, direction);
  const yearStar = getStarAtDirection(loshuBoards.year, direction);
  const monthStar = getStarAtDirection(loshuBoards.month, direction);
  const dayStar = getStarAtDirection(loshuBoards.day, direction);
  const yearEto = getEtoBranchName(getYearEtoBranch(options.year));
  const yearTenkan = getYearTenkanName(options.year);

  const categories = classifyDirection({
    direction,
    honmei: honmeiStar,
    getsumei: options.tsukimeiStar ?? 0,
    layout: targetLayout,
    boardType,
    year: options.year,
    yearEto,
    yearTenkan,
    month: options.month,
    day: options.day,
  });
  const topCategory = pickTopCategory(categories);
  const satsu = getSatsuAtDirection(satsuList, direction);
  const directionSatsuList = satsuList.filter(item => item.direction === direction);
  const score = scoreCategories(categories);
  const isLucky = isKippouCategory(categories) && !isKyouCategory(categories);
  const reason = generateReason(direction, categories, satsu, targetStar);

  return {
    direction,
    directionName: DIRECTIONS[direction],
    categories,
    topCategory,
    colorClass: getDirectionColorClass(categories),
    quality: toLegacyQuality(categories),
    score,
    yearStar,
    monthStar,
    dayStar,
    satsu,
    satsuList: directionSatsuList,
    houiShinNames: categories.houiShinNames,
    isLucky,
    reason
  };
}

/**
 * 吉方位かどうかを判定
 */
function isLuckyDirection(
  honmeiStar: number,
  targetStar: number
): boolean {
  return isElementGenerating(honmeiStar, targetStar);
}

/**
 * 五行の相生関係をチェック
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

  return generating[element2] === element1 || generating[element1] === element2 || element1 === element2;
}

function isStarNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 9;
}

function isTeiiTaichu(layout: LoshuLayout, direction: DirectionKey): boolean {
  if (direction === 'CENTER') return false;

  const opposite = getOppositeDirection(direction);
  if (opposite === 'CENTER') return false;

  return layout[direction] === BASE_LOSHU_LAYOUT[opposite];
}

function scoreCategories(cats: DirectionCategory[]): number {
  const top = pickTopCategory(cats);

  if (CATEGORY_PRIORITY[top] >= 100) return 0;
  if (top === 'honmei' || top === 'tsukimei') return 20;
  if (top === 'honmeiteki' || top === 'tsukimeiteki') return 30;
  if (top === 'teii_taichu') return 40;
  if (top === 'max_kippou') return 90;
  if (top === 'kichi') return 70;
  return 50;
}

function toLegacyQuality(cats: DirectionCategory[]): DirectionQuality {
  const top = pickTopCategory(cats);

  if (CATEGORY_PRIORITY[top] >= 100) return LEGACY_DIRECTION_QUALITY.AVOID;
  if (CATEGORY_PRIORITY[top] >= 80) return LEGACY_DIRECTION_QUALITY.CAUTION;
  if (top === 'teii_taichu') return LEGACY_DIRECTION_QUALITY.CAUTION;
  if (top === 'max_kippou') return LEGACY_DIRECTION_QUALITY.EXCELLENT;
  if (top === 'kichi') return LEGACY_DIRECTION_QUALITY.GOOD;
  return LEGACY_DIRECTION_QUALITY.NEUTRAL;
}

/**
 * 理由を生成
 */
function generateReason(
  direction: DirectionKey,
  cats: DirectionCategory[],
  satsu: SatsuInfo | null,
  targetStar: number
): string {
  const starNames: Record<number, string> = {
    1: '一白水星', 2: '二黒土星', 3: '三碧木星',
    4: '四緑木星', 5: '五黄土星', 6: '六白金星',
    7: '七赤金星', 8: '八白土星', 9: '九紫火星'
  };

  const top = pickTopCategory(cats);
  let reason = `${DIRECTIONS[direction]}には${starNames[targetStar]}が回座しています。`;

  if (satsu) {
    reason += `${satsu.name}にあたり、${satsu.description}`;
  } else if (CATEGORY_PRIORITY[top] >= 80) {
    reason += `${DIRECTION_CATEGORY_LABEL[top]}にあたるため、重要な移動や新規事業は慎重に判断してください。`;
  } else if (top === 'max_kippou') {
    reason += `最大吉方です。移動や開運行動に活用しやすい方位です。`;
  } else if (top === 'kichi') {
    reason += `吉方位です。通常の移動や活動に向いています。`;
  } else {
    reason += `普通の方位です。大きな吉凶は見られません。`;
  }

  return reason;
}

/**
 * 完全な方位学の読み取りを生成
 */
export function generateDirectionalReading(
  date: Date,
  honmeiStar: number,
  tsukimeiStar?: number,
  boardType: DirectionBoardType = 'month'
): DirectionalReading {
  const loshuBoards = calculateAllLoshuBoards(date);
  const targetLoshuLayout = loshuBoards[boardType];
  const dateParts = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  const satsuList = calculateAllSatsu(targetLoshuLayout, honmeiStar, tsukimeiStar, {
    boardType,
    ...dateParts,
  });

  const directions = (Object.keys(DIRECTIONS) as DirectionKey[]).map(direction =>
    analyzeDirection(direction, loshuBoards, honmeiStar, satsuList, boardType, {
      tsukimeiStar,
      ...dateParts,
    })
  );

  const sortedByScore = [...directions].sort((a, b) => b.score - a.score);
  const bestDirections = sortedByScore.slice(0, 3).map(d => d.direction);
  const worstDirections = sortedByScore.slice(-3).map(d => d.direction);
  const luckyDirections = directions
    .filter(d => d.isLucky && !d.satsu)
    .map(d => d.direction);
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
