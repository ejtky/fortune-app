'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';

// Leafletのデフォルトアイコン設定を修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DirectionMapProps {
  center: { lat: number; lng: number };
  directionalReading: DirectionalReading;
}

// 方位の角度を取得（北を0度として時計回り）
const DIRECTION_ANGLES: Record<DirectionKey, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};


// 方位の名前（日本語）
const DIRECTION_NAMES: Record<DirectionKey, string> = {
  N: '北',
  NE: '北東',
  E: '東',
  SE: '南東',
  S: '南',
  SW: '南西',
  W: '西',
  NW: '北西',
};


export default function DirectionMap({ center, directionalReading }: DirectionMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // 地図を初期化
    const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], 10);

    // OpenStreetMapタイルを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // 現在地マーカーを追加
    const homeIcon = L.divIcon({
      html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([center.lat, center.lng], { icon: homeIcon })
      .addTo(map)
      .bindPopup('<strong>現在地</strong>');

    // 各方位にマーカーと扇形を追加
    const distance = 100000; // 100km（メートル単位）

    Object.entries(directionalReading.directions).forEach(([index, info]) => {
      const direction = info.direction;
      const angle = DIRECTION_ANGLES[direction];
      const isGood = info.quality === 'excellent' || info.quality === 'good';
      const isBad = info.quality === 'avoid' || info.quality === 'caution';

      // 方位の色を決定
      const color = isGood ? '#10b981' : isBad ? '#ef4444' : '#9ca3af';
      const fillColor = isGood ? '#d1fae5' : isBad ? '#fee2e2' : '#f3f4f6';

      // 扇形を描画（45度の範囲）
      const startAngle = angle - 22.5;
      const endAngle = angle + 22.5;

      // 扇形のポリゴンを作成
      const sectorPoints: L.LatLngExpression[] = [[center.lat, center.lng]];
      for (let a = startAngle; a <= endAngle; a += 5) {
        const rad = (a * Math.PI) / 180;
        const lat = center.lat + (distance / 111000) * Math.cos(rad);
        const lng = center.lng + (distance / (111000 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(rad);
        sectorPoints.push([lat, lng]);
      }
      sectorPoints.push([center.lat, center.lng]);

      L.polygon(sectorPoints, {
        color: color,
        fillColor: fillColor,
        fillOpacity: 0.3,
        weight: 2,
      }).addTo(map).bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: ${color};">
            ${DIRECTION_NAMES[direction]}（${info.directionName}）
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; background-color: ${isGood ? '#d1fae5' : isBad ? '#fee2e2' : '#f3f4f6'}; color: ${isGood ? '#047857' : isBad ? '#b91c1c' : '#6b7280'};">
              ${isGood ? '吉方位' : isBad ? '凶方位' : '平方位'}
            </span>
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            <strong>理由:</strong><br/>
            ${info.reason}
          </div>
        </div>
      `);

      // 方位の端にマーカーを追加
      const rad = (angle * Math.PI) / 180;
      const markerLat = center.lat + (distance / 111000) * Math.cos(rad);
      const markerLng = center.lng + (distance / (111000 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(rad);

      const markerIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            ${DIRECTION_NAMES[direction]}
          </div>
        `,
        className: '',
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      L.marker([markerLat, markerLng], { icon: markerIcon }).addTo(map);
    });


    // 75km圏の円を追加（方位の影響を受ける最小距離）
    L.circle([center.lat, center.lng], {
      radius: 75000,
      color: '#6366f1',
      fillColor: '#6366f1',
      fillOpacity: 0.05,
      weight: 2,
      dashArray: '5, 10',
    }).addTo(map).bindPopup('<strong>75km圏</strong><br/>この距離以上で方位の影響を受けます');

    mapRef.current = map;

    // クリーンアップ
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, directionalReading]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[600px] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg"
      />
      <div className="absolute top-4 right-4 bg-white/95 rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
        <h4 className="font-bold text-sm mb-2 text-gray-800">凡例</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
            <span className="text-gray-700">吉方位（推奨）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
            <span className="text-gray-700">凶方位（注意）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-500 rounded"></div>
            <span className="text-gray-700">平方位（普通）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">現在地</span>
          </div>
        </div>
      </div>
    </div>
  );
}
