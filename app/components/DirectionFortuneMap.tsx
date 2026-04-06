'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';

// Leafletのデフォルトアイコン設定を修正
// @ts-expect-error - Leaflet internal property access
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DirectionFortuneMapProps {
  center: { lat: number; lng: number };
  directionalReading: DirectionalReading;
  onLocationChange?: (lat: number, lng: number) => void;
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
  CENTER: 0,
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
  CENTER: '中宮',
};

/**
 * 物理的に名前を変更した新しいコンポーネント。キャッシュ問題を回避します。
 */
export default function DirectionFortuneMap({ center, directionalReading, onLocationChange }: DirectionFortuneMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // ピンのアニメーション用スタイルを注入
  useEffect(() => {
    if (!document.getElementById('map-ping-animation')) {
      const style = document.createElement('style');
      style.id = 'map-ping-animation';
      style.innerHTML = `
        @keyframes map-ping {
          75%, 100% { transform: scale(3); opacity: 0; }
        }
        .map-marker-ping {
          animation: map-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // 地図の初期化（一度だけ実行）
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // 空の依存配列で初期化時のみ実行

  // 基準地点マーカーと方位レイヤーの更新
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 既存のレイヤーをクリア（タイルレイヤー以外）
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // 中心位置を更新（アニメーション付きでスムーズに移動）
    map.panTo([center.lat, center.lng], { animate: true, duration: 0.5 });

    // 現在地マーカー（基準地点）
    const homeIcon = L.divIcon({
      html: `
        <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 20px rgba(0,0,0,0.6); cursor: move; z-index: 10;"></div>
          <div style="position: absolute; top: -15px; background: #3b82f6; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; white-space: nowrap; z-index: 11; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 1px solid white;">ココを移動</div>
          <div class="map-marker-ping" style="position: absolute; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #3b82f6; z-index: 1;"></div>
        </div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker([center.lat, center.lng], { 
      icon: homeIcon,
      draggable: true,
      zIndexOffset: 1000
    })
      .addTo(map)
      .bindPopup('<strong>基準地点</strong><br/>このピンをドラッグして移動できます');

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      if (onLocationChange) {
        onLocationChange(pos.lat, pos.lng);
      }
    });

    // 各方位にマーカーと扇形を追加
    const distance = 250000; // 250km

    Object.values(directionalReading.directions).forEach((info) => {
      const direction = info.direction;
      if (direction === 'CENTER') return; // 中宮は描画しない

      const angle = DIRECTION_ANGLES[direction];
      const isGood = info.quality === 'excellent' || info.quality === 'good';
      const isBad = info.quality === 'avoid' || info.quality === 'caution';

      const color = isGood ? '#059669' : isBad ? '#dc2626' : '#6b7280';
      const fillColor = isGood ? '#10b981' : isBad ? '#ef4444' : '#9ca3af';

      const startAngle = angle - 22.5;
      const endAngle = angle + 22.5;

      const sectorPoints: L.LatLngExpression[] = [[center.lat, center.lng]];
      for (let a = startAngle; a <= endAngle; a += 2) {
        const rad = (a * Math.PI) / 180;
        const lat = center.lat + (distance / 111000) * Math.cos(rad);
        const lng = center.lng + (distance / (111000 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(rad);
        sectorPoints.push([lat, lng]);
      }
      sectorPoints.push([center.lat, center.lng]);

      L.polygon(sectorPoints, {
        color: color,
        fillColor: fillColor,
        fillOpacity: 0.1,
        weight: 4,
        dashArray: '3, 7',
      }).addTo(map).bindPopup(`
        <div style="min-width: 200px; font-family: sans-serif;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: ${color}; font-size: 16px;">
            ${DIRECTION_NAMES[direction]}（${info.directionName}）
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; background-color: ${isGood ? '#d1fae5' : isBad ? '#fee2e2' : '#f3f4f6'}; color: ${isGood ? '#047857' : isBad ? '#b91c1c' : '#6b7280'};">
              ${isGood ? '吉方位' : isBad ? '凶方位' : '平方位'}
            </span>
          </div>
          <div style="font-size: 12px; color: #4b5563; line-height: 1.5;">
            <strong>理由:</strong><br/>
            ${info.reason}
          </div>
        </div>
      `);

      const rad = (angle * Math.PI) / 180;
      const markerLat = center.lat + (distance * 0.85 / 111000) * Math.cos(rad);
      const markerLng = center.lng + (distance * 0.85 / (111000 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(rad);

      const markerIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 13px;
            white-space: nowrap;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
            border: 2px solid white;
          ">
            ${DIRECTION_NAMES[direction]}
          </div>
        `,
        className: '',
        iconSize: [70, 30],
        iconAnchor: [35, 15],
      });

      L.marker([markerLat, markerLng], { icon: markerIcon }).addTo(map);
    });

    // 75km圏
    L.circle([center.lat, center.lng], {
      radius: 75000,
      color: '#4f46e5',
      fillColor: '#4f46e5',
      fillOpacity: 0.03,
      weight: 1,
      dashArray: '15, 15',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, directionalReading, onLocationChange]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[600px] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg"
      />
      <div className="absolute top-4 right-4 bg-white/95 rounded-lg shadow-lg p-4 max-w-xs z-[1000] border border-gray-200">
        <h4 className="font-bold text-sm mb-2 text-gray-800">凡例</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div style={{ width: '16px', height: '16px', backgroundColor: '#d1fae5', border: '2px solid #059669', borderStyle: 'dashed' }}></div>
            <span className="text-gray-700">吉方位</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '16px', height: '16px', backgroundColor: '#fee2e2', border: '2px solid #dc2626', borderStyle: 'dashed' }}></div>
            <span className="text-gray-700">凶方位</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '16px', height: '16px', backgroundColor: '#f3f4f6', border: '2px solid #6b7280', borderStyle: 'dashed' }}></div>
            <span className="text-gray-700">平方位</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%', border: '2px solid white' }}></div>
            <span className="text-gray-700">基準地点（ドラッグ可）</span>
          </div>
        </div>
      </div>
    </div>
  );
}
