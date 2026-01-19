'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface FortuneMapProps {
  center: [number, number];
  zoom?: number;
}

export default function FortuneMap({ center, zoom = 13 }: FortuneMapProps) {
  // Leafletのデフォルトアイコン設定の修正（クライアントサイドのみ）
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // 方位線の生成（メモ化して不必要な再レンダリングを防止）
  const directions = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) - 22.5;
        const rad = (angle - 90) * (Math.PI / 180);
        const endPos: [number, number] = [
            center[0] + Math.cos(rad) * 0.5,
            center[1] + Math.sin(rad) * 0.5
        ];
        lines.push(endPos);
    }
    return lines;
  }, [center]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border-4 border-white">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>現在の基準地点</Popup>
        </Marker>
        
        {directions.map((endPos, idx) => (
          <Polyline 
            key={idx} 
            positions={[center, endPos]} 
            pathOptions={{ color: 'red', weight: 2, dashArray: '5, 10', opacity: 0.5 }} 
          />
        ))}
      </MapContainer>
    </div>
  );
}
