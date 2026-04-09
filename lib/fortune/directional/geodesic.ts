/**
 * 大圏線（Great Circle）・等角方位線（Rhumb Line）の計算
 * 方位線を地図上に描画するための座標計算
 */

// 二十四山（24方位）の定義
export const NIJUSHISAN: { label: string; angle: number; kana: string }[] = [
  { label: '壬', angle: 345, kana: 'じん' },
  { label: '子', angle: 0,   kana: 'ね' },
  { label: '癸', angle: 15,  kana: 'き' },
  { label: '丑', angle: 30,  kana: 'うし' },
  { label: '艮', angle: 45,  kana: 'ごん' },
  { label: '寅', angle: 60,  kana: 'とら' },
  { label: '甲', angle: 75,  kana: 'こう' },
  { label: '卯', angle: 90,  kana: 'う' },
  { label: '乙', angle: 105, kana: 'おつ' },
  { label: '辰', angle: 120, kana: 'たつ' },
  { label: '巽', angle: 135, kana: 'そん' },
  { label: '巳', angle: 150, kana: 'み' },
  { label: '丙', angle: 165, kana: 'へい' },
  { label: '午', angle: 180, kana: 'うま' },
  { label: '丁', angle: 195, kana: 'てい' },
  { label: '未', angle: 210, kana: 'ひつじ' },
  { label: '坤', angle: 225, kana: 'こん' },
  { label: '申', angle: 240, kana: 'さる' },
  { label: '庚', angle: 255, kana: 'こう' },
  { label: '酉', angle: 270, kana: 'とり' },
  { label: '辛', angle: 285, kana: 'しん' },
  { label: '戌', angle: 300, kana: 'いぬ' },
  { label: '乾', angle: 315, kana: 'けん' },
  { label: '亥', angle: 330, kana: 'い' },
];

// 分割方式ごとの方位角リスト
export const DIVISION_ANGLES: Record<'30_60' | '45' | '24', number[]> = {
  '30_60': [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
  '45':    [0, 45, 90, 135, 180, 225, 270, 315],
  '24':    NIJUSHISAN.map(m => m.angle),
};

const R = 6371000; // 地球半径（メートル）

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

/**
 * 大圏線の座標列を生成
 * @param lat 起点緯度
 * @param lng 起点経度
 * @param bearingDeg 方位角（度, 北=0, 時計回り）
 * @param distanceM 距離（メートル）
 * @param steps 分割数
 * @returns [lat, lng][] の座標列
 */
export function greatCircleLine(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceM: number,
  steps = 60
): [number, number][] {
  const points: [number, number][] = [];
  const lat1 = toRad(lat);
  const lng1 = toRad(lng);

  for (let i = 0; i <= steps; i++) {
    const d = (distanceM * i) / steps;
    const angular = d / R;
    const bearing = toRad(bearingDeg);

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(angular) +
      Math.cos(lat1) * Math.sin(angular) * Math.cos(bearing)
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angular) * Math.cos(lat1),
        Math.cos(angular) - Math.sin(lat1) * Math.sin(lat2)
      );

    points.push([toDeg(lat2), toDeg(lng2)]);
  }
  return points;
}

/**
 * 等角方位線（Rhumb Line）の座標列を生成
 * メルカトル投影で一定の方位角を保つ線
 */
export function rhumbLine(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceM: number,
  steps = 60
): [number, number][] {
  const points: [number, number][] = [];
  const bearing = toRad(bearingDeg);

  for (let i = 0; i <= steps; i++) {
    const d = (distanceM * i) / steps;
    const delta = d / R;

    const lat1 = toRad(lat);
    let lat2 = lat1 + delta * Math.cos(bearing);

    // 極超えで log(tan) が NaN になるのを防ぐ（±89.9° でクランプして打ち切り）
    const MAX_LAT = toRad(89.9);
    if (Math.abs(lat2) >= MAX_LAT) {
      lat2 = lat2 > 0 ? MAX_LAT : -MAX_LAT;
      const lng2 = toRad(lng) + (delta * Math.sin(bearing)) / Math.cos(lat1);
      points.push([toDeg(lat2), ((toDeg(lng2) + 540) % 360) - 180]);
      break; // 極に達したら終了
    }

    let deltaLat = lat2 - lat1;
    let q: number;
    if (Math.abs(deltaLat) < 1e-10) {
      q = Math.cos(lat1);
    } else {
      const deltaPsi =
        Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
      q = deltaLat / deltaPsi;
    }

    const deltaLng = (delta * Math.sin(bearing)) / q;
    const lng2 = toRad(lng) + deltaLng;

    points.push([toDeg(lat2), ((toDeg(lng2) + 540) % 360) - 180]);
  }
  return points;
}

/**
 * 2点間の方位角を計算（大圏線）
 */
export function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * 2点間の距離（メートル）を計算（Haversine公式）
 */
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 方位角に偏角を適用
 */
export function applyDeclination(
  bearingDeg: number,
  declination: number,
  direction: 'west' | 'east'
): number {
  const offset = direction === 'west' ? -declination : declination;
  return (bearingDeg + offset + 360) % 360;
}

/**
 * 方位角から九星の方位名を取得
 */
export function getDirectionLabel(bearingDeg: number, division: '30_60' | '45' | '24'): string {
  if (division === '24') {
    const sorted = [...NIJUSHISAN].sort((a, b) => {
      const da = Math.abs(((bearingDeg - a.angle + 180) % 360) - 180);
      const db = Math.abs(((bearingDeg - b.angle + 180) % 360) - 180);
      return da - db;
    });
    return sorted[0].label;
  }
  const labels8: Record<number, string> = {
    0: '北', 45: '北東', 90: '東', 135: '南東',
    180: '南', 225: '南西', 270: '西', 315: '北西',
  };
  const labels12: Record<number, string> = {
    0: '北', 30: '北北東', 60: '北東北', 90: '東',
    120: '東南東', 150: '南東南', 180: '南',
    210: '南南西', 240: '南西南', 270: '西',
    300: '西北西', 330: '北西北',
  };
  const labels = division === '45' ? labels8 : labels12;
  const angles = DIVISION_ANGLES[division];
  const closest = angles.reduce((prev, curr) => {
    const dp = Math.abs(((bearingDeg - prev + 180) % 360) - 180);
    const dc = Math.abs(((bearingDeg - curr + 180) % 360) - 180);
    return dc < dp ? curr : prev;
  });
  return labels[closest] ?? `${Math.round(bearingDeg)}°`;
}
