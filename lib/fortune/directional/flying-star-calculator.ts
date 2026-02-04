import { DirectionKey } from './constants';
import { 
  PALACE_BASE_STARS, 
  LOSHU_PATH, 
  FlyingStarChart, 
  MOUNTAIN_DATA, 
  POLARITY_TABLE 
} from './flying-star-data';

/**
 * 九星の順行・逆行を判定・配置するユーティリティ
 */

/**
 * 指定した星を中宮に置いて飛星させる（順行）
 */
function flyStarsForward(centerStar: number): Record<DirectionKey, number> {
  const result: any = {};
  LOSHU_PATH.forEach((dir, index) => {
    let star = (centerStar + index);
    while (star > 9) star -= 9;
    result[dir] = star;
  });
  return result;
}

/**
 * 指定した星を中宮に置いて飛星させる（逆行）
 */
function flyStarsBackward(centerStar: number): Record<DirectionKey, number> {
  const result: any = {};
  LOSHU_PATH.forEach((dir, index) => {
    let star = (centerStar - index);
    while (star < 1) star += 9;
    result[dir] = star;
  });
  return result;
}

/**
 * 洛書盤上の特定の方位に位置する「地盤」の九星に対応する24山（の三元）を考慮し、
 * その星が現在どのような陰陽（順逆）を持つかを判定する。
 */
function getPolarity(baseStar: number, mountainName: string, period: number): number {
  const mountain = MOUNTAIN_DATA[mountainName];
  if (!mountain) return 1;

  // 五黄土星の場合の処理（中宮に置かれた時期の運の陰陽に従う）
  if (baseStar === 5) {
    // 第9運なら九紫火星（陽）の性質に従うなど、時期の星の三元を確認
    return POLARITY_TABLE[period][mountain.yuan];
  }

  // それ以外の星は、その星が本来属する方位の三元（地天人）に基づく
  return POLARITY_TABLE[baseStar][mountain.yuan];
}

/**
 * 玄空飛星派のチャートを計算（24山対応版）
 */
export function calculateFlyingStarChart(
  period: number,
  sittingMountain: string,
  facingMountain: string
): FlyingStarChart {
  const sM = MOUNTAIN_DATA[sittingMountain];
  const fM = MOUNTAIN_DATA[facingMountain];
  
  if (!sM || !fM) {
    throw new Error(`Invalid mountain data: ${sittingMountain}, ${facingMountain}`);
  }

  // 1. 運星（地盤）の計算：時運を中心に順行飛星
  const periodStars = flyStarsForward(period);

  // 2. 山星の計算
  const sittingBaseStar = periodStars[sM.direction];
  const mountainPolarity = getPolarity(sittingBaseStar, sittingMountain, period);
  const mountainStars = mountainPolarity >= 0
    ? flyStarsForward(sittingBaseStar)
    : flyStarsBackward(sittingBaseStar);

  // 3. 向星の計算
  const facingBaseStar = periodStars[fM.direction];
  const facingPolarity = getPolarity(facingBaseStar, facingMountain, period);
  const facingStars = facingPolarity >= 0
    ? flyStarsForward(facingBaseStar)
    : flyStarsBackward(facingBaseStar);

  // 4. チャートの組み立て
  const stars: any = {};
  Object.keys(PALACE_BASE_STARS).forEach((dir) => {
    const d = dir as DirectionKey;
    stars[d] = {
      mountain: mountainStars[d],
      facing: facingStars[d],
      base: periodStars[d]
    };
  });

  return {
    period,
    facing: fM.direction,
    sitting: sM.direction,
    facingMountain,
    sittingMountain,
    stars: stars as Record<DirectionKey, { mountain: number; facing: number; base: number }>
  };
}
