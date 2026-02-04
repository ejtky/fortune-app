import { DirectionKey } from './constants';
import { PALACE_BASE_STARS, LOSHU_PATH, FlyingStarChart } from './flying-star-data';

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
 * 陽か陰かを判定（順行か逆行かを決めるため）
 * 簡易版：三元九運の各星の陰陽
 */
function isPositive(star: number, direction: DirectionKey): boolean {
  // 実際には地、天、人の三元（24山）で決まるが、ここでは簡易ロジック
  // 奇数は陽（順行）、偶数は陰（逆行）をベースとする
  return star % 2 !== 0;
}

/**
 * 玄空飛星派のチャートを計算
 * @param period 建築年が属する運（1-9）
 * @param sitting 座（建物の背面方位）
 * @param facing 向（建物の正面方位）
 */
export function calculateFlyingStarChart(
  period: number,
  sitting: DirectionKey,
  facing: DirectionKey
): FlyingStarChart {
  // 1. 運星（地盤）の計算：時運を中心に順行飛星
  const periodStars = flyStarsForward(period);

  // 2. 山星の計算
  // 座の方位にある運星を中宮に入れる
  const sittingBaseStar = periodStars[sitting];
  const mountainStars = isPositive(sittingBaseStar, sitting)
    ? flyStarsForward(sittingBaseStar)
    : flyStarsBackward(sittingBaseStar);

  // 3. 向星の計算
  // 向の方位にある運星を中宮に入れる
  const facingBaseStar = periodStars[facing];
  const facingStars = isPositive(facingBaseStar, facing)
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
    facing,
    sitting,
    stars: stars as Record<DirectionKey, { mountain: number; facing: number; base: number }>
  };
}
