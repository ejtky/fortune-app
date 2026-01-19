/**
 * 殺（Satsu）の計算
 * 凶方位の判定システム
 */

import type { DirectionKey } from './constants';
import type { LoshuLayout } from './loshu';
import { getDirectionOfStar, getHomeDirection } from './loshu';

/**
 * 殺の種類
 */
export type SatsuType =
  | 'gooh'        // 五黄殺 - 五黄土星のある方位（最凶）
  | 'anken'       // 暗剣殺 - 五黄殺の対極方位
  | 'honmei'      // 本命殺 - 本命星のある方位
  | 'honmeiteki'  // 本命的殺 - 本命殺の対極方位
  | 'saiha';      // 歳破 - 年の対極方位

/**
 * 殺の情報
 */
export interface SatsuInfo {
  type: SatsuType;
  name: string;
  direction: DirectionKey | 'CENTER';
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

/**
 * 対極方位を取得
 *
 * @param direction 方位
 * @returns 対極の方位
 */
export function getOppositeDirection(direction: DirectionKey | 'CENTER'): DirectionKey | 'CENTER' {
  const oppositeMap: Record<DirectionKey | 'CENTER', DirectionKey | 'CENTER'> = {
    N: 'S',
    NE: 'SW',
    E: 'W',
    SE: 'NW',
    S: 'N',
    SW: 'NE',
    W: 'E',
    NW: 'SE',
    CENTER: 'CENTER'
  };

  return oppositeMap[direction];
}

/**
 * 五黄殺を計算
 *
 * 五黄土星のある方位は最も凶とされる
 *
 * @param layout 洛書配置
 * @returns 五黄殺の情報
 */
export function calculateGoohSatsu(layout: LoshuLayout): SatsuInfo | null {
  const direction = getDirectionOfStar(layout, 5); // 五黄土星

  if (!direction || direction === 'CENTER') {
    return null;
  }

  return {
    type: 'gooh',
    name: '五黄殺',
    direction,
    severity: 'critical',
    description: '五黄土星のある方位。最も強力な凶方位です。この方位への移動や新規事業の開始は避けてください。'
  };
}

/**
 * 暗剣殺を計算
 *
 * 五黄殺の対極方位
 *
 * @param layout 洛書配置
 * @returns 暗剣殺の情報
 */
export function calculateAnkenSatsu(layout: LoshuLayout): SatsuInfo | null {
  const goohDirection = getDirectionOfStar(layout, 5);

  if (!goohDirection || goohDirection === 'CENTER') {
    return null;
  }

  const ankenDirection = getOppositeDirection(goohDirection);

  if (ankenDirection === 'CENTER') {
    return null;
  }

  return {
    type: 'anken',
    name: '暗剣殺',
    direction: ankenDirection,
    severity: 'critical',
    description: '五黄殺の対極方位。突発的なトラブルや事故の暗示があります。慎重な行動が必要です。'
  };
}

/**
 * 本命殺を計算
 *
 * 自分の本命星のある方位
 *
 * @param layout 洛書配置
 * @param honmeiStar 本命星
 * @returns 本命殺の情報
 */
export function calculateHonmeiSatsu(
  layout: LoshuLayout,
  honmeiStar: number
): SatsuInfo | null {
  const direction = getDirectionOfStar(layout, honmeiStar);

  if (!direction || direction === 'CENTER') {
    return null;
  }

  return {
    type: 'honmei',
    name: '本命殺',
    direction,
    severity: 'high',
    description: 'あなたの本命星のある方位。個人的な凶方位です。重要な決断や移動は避けた方が良いでしょう。'
  };
}

/**
 * 本命的殺を計算
 *
 * 本命殺の対極方位
 *
 * @param layout 洛書配置
 * @param honmeiStar 本命星
 * @returns 本命的殺の情報
 */
export function calculateHonmeiTekiSatsu(
  layout: LoshuLayout,
  honmeiStar: number
): SatsuInfo | null {
  const honmeiDirection = getDirectionOfStar(layout, honmeiStar);

  if (!honmeiDirection || honmeiDirection === 'CENTER') {
    return null;
  }

  const tekiDirection = getOppositeDirection(honmeiDirection);

  if (tekiDirection === 'CENTER') {
    return null;
  }

  return {
    type: 'honmeiteki',
    name: '本命的殺',
    direction: tekiDirection,
    severity: 'medium',
    description: '本命殺の対極方位。本命殺ほどではありませんが、注意が必要な方位です。'
  };
}

/**
 * 歳破を計算
 *
 * 年の中宮星の対極方位
 *
 * @param layout 洛書配置
 * @returns 歳破の情報
 */
export function calculateSaiha(layout: LoshuLayout): SatsuInfo | null {
  const centerStar = layout.CENTER;
  const homeDirection = getHomeDirection(centerStar);

  if (homeDirection === 'CENTER') {
    return null;
  }

  const saihaDirection = getOppositeDirection(homeDirection);

  if (saihaDirection === 'CENTER') {
    return null;
  }

  return {
    type: 'saiha',
    name: '歳破',
    direction: saihaDirection,
    severity: 'medium',
    description: 'その年特有の凶方位。年間を通じて注意が必要です。'
  };
}

/**
 * 全ての殺を計算
 *
 * @param layout 洛書配置
 * @param honmeiStar 本命星
 * @returns 全ての殺のリスト
 */
export function calculateAllSatsu(
  layout: LoshuLayout,
  honmeiStar: number
): SatsuInfo[] {
  const satsuList: SatsuInfo[] = [];

  const gooh = calculateGoohSatsu(layout);
  if (gooh) satsuList.push(gooh);

  const anken = calculateAnkenSatsu(layout);
  if (anken) satsuList.push(anken);

  const honmei = calculateHonmeiSatsu(layout, honmeiStar);
  if (honmei) satsuList.push(honmei);

  const honmeiteki = calculateHonmeiTekiSatsu(layout, honmeiStar);
  if (honmeiteki) satsuList.push(honmeiteki);

  const saiha = calculateSaiha(layout);
  if (saiha) satsuList.push(saiha);

  return satsuList;
}

/**
 * 指定方位に殺があるかチェック
 *
 * @param satsuList 殺のリスト
 * @param direction 方位
 * @returns その方位の殺（なければnull）
 */
export function getSatsuAtDirection(
  satsuList: SatsuInfo[],
  direction: DirectionKey | 'CENTER'
): SatsuInfo | null {
  return satsuList.find(satsu => satsu.direction === direction) || null;
}

/**
 * 方位の危険度を評価
 *
 * @param satsuList 殺のリスト
 * @param direction 方位
 * @returns 危険度（0-100、高いほど危険）
 */
export function evaluateDirectionDanger(
  satsuList: SatsuInfo[],
  direction: DirectionKey | 'CENTER'
): number {
  const satsu = getSatsuAtDirection(satsuList, direction);

  if (!satsu) {
    return 0;
  }

  // 危険度の重み付け
  const severityWeights = {
    critical: 100,
    high: 70,
    medium: 40
  };

  return severityWeights[satsu.severity];
}
