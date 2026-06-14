'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import L from 'leaflet';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import { QUALITY_COLORS } from '@/lib/fortune/directional/constants';
import { DIRECTION_COLOR_HEX } from '@/lib/fortune/directional/colors';
import {
  greatCircleLine,
  rhumbLine,
  DIVISION_ANGLES,
  DIVISION_HALF_WIDTHS,
  NIJUSHISAN,
  getBearing,
  getDistance,
  applyDeclination,
  getDirectionLabel,
} from '@/lib/fortune/directional/geodesic';

// Leafletデフォルトアイコン修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export type LineType = 'great' | 'rhumb';
export type DivisionType = '30_60' | '45' | '24';

export interface DirectionalReadingEntry {
  modeName: string;   // '本命', '月命', '日命'
  modeColor: string;  // ヘッダーバッジの色
  reading: DirectionalReading;
}

export interface MapSettings {
  showCompass: boolean;
  showTrackingLine: boolean;
  showControls: boolean;
  showColors: boolean;
  lineType: LineType;
  division: DivisionType;
  compassDivision: DivisionType;
  compassLineType: LineType;
  declinationDeg: number;
  declinationMin: number;
  declinationDir: 'west' | 'east';
  showBoardOnMap: boolean;
}

export interface SearchResultMarker {
  lat: number;
  lng: number;
  name: string;
  subtext?: string;
}

export interface MapCoreProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  directionalReadings: DirectionalReadingEntry[];
  settings: MapSettings;
  showMarkers: boolean;
  onMapClick: (lat: number, lng: number) => void;
  onOriginChange: (pos: { lat: number; lng: number }) => void;
  flyToOrigin?: boolean;
  flyToDestination?: boolean;
  onFlyDone?: () => void;
  searchMarkers?: SearchResultMarker[];
  onSearchMarkerSelect?: (marker: SearchResultMarker, type: 'origin' | 'destination') => void;
  pinnedPoint?: { lat: number; lng: number } | null;
}

const DIRECTION_CENTER_ANGLES: Record<DirectionKey, number> = {
  N: 0, NE: 45, E: 90, SE: 135,
  S: 180, SW: 225, W: 270, NW: 315, CENTER: 0,
};

// 複数命星モードを重ねるときの線種（本命=実線、月命=破線、日命=点線）
const LINE_DASHES: (string | undefined)[] = [undefined, '8 4', '2 4'];

interface HoverEntry {
  modeName: string;
  modeColor: string;
  qualityColor: string;
  qualityLabel: string;
  reason: string;
}

interface HoverInfo {
  dirLabel: string;
  entries: HoverEntry[];
}

export default function MapCore({
  origin,
  destination,
  directionalReadings,
  settings,
  showMarkers,
  onMapClick,
  onOriginChange,
  flyToOrigin,
  flyToDestination,
  onFlyDone,
  searchMarkers,
  onSearchMarkerSelect,
  pinnedPoint,
}: MapCoreProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const searchMarkerLayersRef = useRef<L.Layer[]>([]);
  const trackLineRef = useRef<L.Polyline | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const compassCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const applyDecl = useCallback((angle: number) => {
    const decl = settings.declinationDeg + settings.declinationMin / 60;
    return applyDeclination(angle, decl, settings.declinationDir);
  }, [settings.declinationDeg, settings.declinationMin, settings.declinationDir]);

  // 最初のreadingから方位品質情報を取得（ローカルで）
  const getDirectionsData = useCallback(() => {
    if (directionalReadings.length === 0) return null;
    return directionalReadings[0].reading.directions;
  }, [directionalReadings]);

  // デバイスの方位角取得
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const heading = event.alpha; // 0-360度
        setDeviceHeading(heading);
      }
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && (DeviceOrientationEvent as any).requestPermission) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch {
          // ユーザーがいずれにしても拒否できるため、リスナーを追加
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      } else {
        // 古いブラウザはそのままリスナー追加
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // 地図初期化
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const map = L.map(containerRef.current, {
      zoomControl: settings.showControls,
    }).setView([35.6762, 139.6503], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // 地図クリックは「印（ピン）」を立てるだけ。起点/目的地の決定は左カラムで行う
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    });

    // 追っかけ線（マウス移動）
    map.on('mousemove', (e) => {
      if (!settings.showTrackingLine || !origin) return;
      const bearing = getBearing(origin.lat, origin.lng, e.latlng.lat, e.latlng.lng);
      const adjustedBearing = applyDecl(bearing);
      const pts = greatCircleLine(origin.lat, origin.lng, adjustedBearing, 3000000, 30);
      if (trackLineRef.current) {
        (trackLineRef.current as any).setLatLngs(pts);
      } else {
        trackLineRef.current = L.polyline(pts, {
          color: '#f59e0b', weight: 1.5, dashArray: '6,4', opacity: 0.8,
        }).addTo(map);
      }
    });

    // 地図移動でコンパスの現在地ドット更新
    map.on('moveend', () => {
      const c = map.getCenter();
      setMapCenter({ lat: c.lat, lng: c.lng });
    });
    // 初期値をセット
    setMapCenter({ lat: map.getCenter().lat, lng: map.getCenter().lng });

    // コンパスコントロール追加
    const CompassControl = L.Control.extend({
      onAdd(map: L.Map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        canvas.style.display = 'block';
        canvas.style.borderRadius = '50%';
        canvas.style.boxShadow = '0 3px 10px rgba(0,0,0,.35)';
        compassCanvasRef.current = canvas;
        container.appendChild(canvas);

        container.style.cursor = 'default';
        container.style.backgroundColor = 'transparent';
        container.style.border = 'none';

        return container;
      },
    });

    const compass = new (CompassControl as any)({ position: 'bottomright' });
    compass.addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // コンパス描画（方位盤オーバービュー）
  useEffect(() => {
    const canvas = compassCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;   // 150
    const H = canvas.height;  // 150
    const cx = W / 2;
    const cy = H / 2;
    const outerR = 66;  // セクター外径

    ctx.clearRect(0, 0, W, H);

    // 背景（円形クリップ）
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerR + 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.97)';
    ctx.fill();
    ctx.restore();

    // 方位データ取得
    const directions = directionalReadings.length > 0
      ? directionalReadings[0].reading.directions.filter(d => d.direction !== 'CENTER')
      : [];

    // 8方位セクター（45°ずつ）
    const SECTOR_BEARINGS = [0, 45, 90, 135, 180, 225, 270, 315];
    const SECTOR_WIDTH = 45;

    SECTOR_BEARINGS.forEach(bearingDeg => {
      let fillColor = '#e2e8f0';
      if (directions.length > 0) {
        const nearest = directions.reduce((prev, curr) => {
          const dp = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[prev.direction] + 180) % 360) - 180);
          const dc = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[curr.direction] + 180) % 360) - 180);
          return dc < dp ? curr : prev;
        });
        fillColor = settings.showColors ? QUALITY_COLORS[nearest.quality] : '#cbd5e1';
      }

      const startRad = ((bearingDeg - SECTOR_WIDTH / 2) - 90) * (Math.PI / 180);
      const endRad   = ((bearingDeg + SECTOR_WIDTH / 2) - 90) * (Math.PI / 180);

      // セクター塗り
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startRad, endRad);
      ctx.closePath();
      ctx.fillStyle = fillColor + 'bb'; // 73% opacity
      ctx.fill();

      // セクター境界線
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startRad, endRad);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(30,30,30,0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // 外枠円
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // N/S/E/W ラベル
    const cardinals = [
      { label: 'N', bearing: 0,   color: '#ef4444', bold: true },
      { label: 'E', bearing: 90,  color: '#374151', bold: false },
      { label: 'S', bearing: 180, color: '#374151', bold: false },
      { label: 'W', bearing: 270, color: '#374151', bold: false },
    ];
    cardinals.forEach(({ label, bearing, color, bold }) => {
      const rad = (bearing - 90) * (Math.PI / 180);
      const x = cx + Math.cos(rad) * (outerR + 6);
      const y = cy + Math.sin(rad) * (outerR + 6);
      ctx.fillStyle = color;
      ctx.font = `${bold ? 'bold ' : ''}12px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    });

    // デバイス方位の細い補助線
    if (deviceHeading !== 0) {
      const headRad = (deviceHeading - 90) * (Math.PI / 180);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(headRad) * outerR, cy + Math.sin(headRad) * outerR);
      ctx.strokeStyle = 'rgba(99,102,241,0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.restore();
    }

    // 現在地ドット（地図中心の方位）
    if (mapCenter && origin) {
      const bearing = getBearing(origin.lat, origin.lng, mapCenter.lat, mapCenter.lng);
      const dotRad = (bearing - 90) * (Math.PI / 180);
      const dotR   = outerR * 0.58;
      const dotX   = cx + Math.cos(dotRad) * dotR;
      const dotY   = cy + Math.sin(dotRad) * dotR;

      // 方向線（起点→現在地）
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(dotX, dotY);
      ctx.strokeStyle = 'rgba(99,102,241,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();

      // ドット本体
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // 起点（中心）
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [directionalReadings, settings.showColors, mapCenter, origin, deviceHeading]);

  // 地図コントロール表示切替
  useEffect(() => {
    if (!mapRef.current) return;
    if (settings.showControls) {
      (mapRef.current as any).zoomControl?.addTo(mapRef.current);
    } else {
      (mapRef.current as any).zoomControl?.remove();
    }
  }, [settings.showControls]);

  // 追っかけ線の表示切替
  useEffect(() => {
    if (!settings.showTrackingLine && trackLineRef.current && mapRef.current) {
      trackLineRef.current.remove();
      trackLineRef.current = null;
    }
  }, [settings.showTrackingLine]);

  useEffect(() => {
    if (flyToOrigin && origin && mapRef.current) {
      mapRef.current.flyTo([origin.lat, origin.lng], 8, { duration: 1.2 });
      onFlyDone?.();
    }
  }, [flyToOrigin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (flyToDestination && destination && mapRef.current) {
      mapRef.current.flyTo([destination.lat, destination.lng], 8, { duration: 1.2 });
      onFlyDone?.();
    }
  }, [flyToDestination]); // eslint-disable-line react-hooks/exhaustive-deps

  // 検索結果ピンの描画
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 既存の検索ピンをクリア
    searchMarkerLayersRef.current.forEach(l => l.remove());
    searchMarkerLayersRef.current = [];

    if (!searchMarkers || searchMarkers.length === 0) return;

    searchMarkers.forEach((sm, i) => {
      const marker = L.marker([sm.lat, sm.lng], {
        icon: L.divIcon({
          html: `<div style="
            background:#4285f4;color:#fff;
            width:28px;height:28px;border-radius:50%;
            border:2.5px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.4);
            display:flex;align-items:center;justify-content:center;
            font-size:11px;font-weight:bold;
          ">${i + 1}</div>`,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
        zIndexOffset: 800,
      });

      marker.bindPopup(`
        <div style="font-size:13px;padding:2px;min-width:160px;">
          <div style="font-weight:bold;margin-bottom:4px;color:#1e293b;">${sm.name}</div>
          ${sm.subtext ? `<div style="color:#94a3b8;font-size:11px;margin-bottom:8px;">${sm.subtext}</div>` : ''}
          <button id="sm-origin-${i}" style="display:block;width:100%;padding:6px 8px;margin-bottom:5px;background:#6366f1;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">🏠 起点に設定</button>
          <button id="sm-dest-${i}" style="display:block;width:100%;padding:6px 8px;background:#10b981;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">⛳ 目的地に設定</button>
        </div>
      `);

      marker.on('popupopen', () => {
        setTimeout(() => {
          document.getElementById(`sm-origin-${i}`)?.addEventListener('click', () => {
            onSearchMarkerSelect?.(sm, 'origin');
            map.closePopup();
          });
          document.getElementById(`sm-dest-${i}`)?.addEventListener('click', () => {
            onSearchMarkerSelect?.(sm, 'destination');
            map.closePopup();
          });
        }, 100);
      });

      marker.addTo(map);
      searchMarkerLayersRef.current.push(marker);
    });

    // 全ピンが見えるようにフィット
    if (searchMarkers.length > 1) {
      const bounds = L.latLngBounds(searchMarkers.map(sm => [sm.lat, sm.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    } else if (searchMarkers.length === 1) {
      map.flyTo([searchMarkers[0].lat, searchMarkers[0].lng], 13, { duration: 1 });
    }
  }, [searchMarkers]); // eslint-disable-line react-hooks/exhaustive-deps

  // 地図クリックで立てた印（ピン）の描画
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }
    if (pinnedPoint) {
      pinMarkerRef.current = L.marker([pinnedPoint.lat, pinnedPoint.lng], {
        icon: L.divIcon({
          html: `<div style="background:#f59e0b;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>`,
          className: '', iconSize: [16, 16], iconAnchor: [8, 16],
        }),
        zIndexOffset: 900,
      }).addTo(map);
    }
  }, [pinnedPoint]);

  // 方位ゾーン・線・マーカーの描画
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !origin) return;

    layersRef.current.forEach(l => l.remove());
    layersRef.current = [];

    // 扇形塗りが北極（東京から約6,100km）を越えると、メルカトル地図で経度反転して横線（弦）として現れる
    // これを防ぐため扇形・境界線とも極の手前で打ち切る
    const sectorDist = 5800000;
    const lineDist   = 9000000;

    const addLayer = (layer: L.Layer) => {
      layer.addTo(map);
      layersRef.current.push(layer);
    };

    // 起点マーカー
    if (showMarkers) {
      addLayer(L.marker([origin.lat, origin.lng], {
        icon: L.divIcon({
          html: `<div style="background:#6366f1;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>`,
          className: '', iconSize: [18, 18], iconAnchor: [9, 9],
        }), zIndexOffset: 1000,
      }).bindPopup('<strong>🏠 起点</strong>'));
    }

    // 目的地マーカー
    if (destination && showMarkers) {
      const bearing = getBearing(origin.lat, origin.lng, destination.lat, destination.lng);
      const label = getDirectionLabel(bearing, settings.division);
      addLayer(L.marker([destination.lat, destination.lng], {
        icon: L.divIcon({
          html: `<div style="background:#10b981;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>`,
          className: '', iconSize: [18, 18], iconAnchor: [9, 9],
        }), zIndexOffset: 900,
      }).bindPopup(`<strong>⛳ 目的地</strong><br/>方位: ${label}（${Math.round(bearing)}°）`));
    }

    const sectorAngles = DIVISION_ANGLES[settings.division];
    const sectorWidth = 360 / sectorAngles.length;
    const LINE_DASHES: (string | undefined)[] = [undefined, '8,4', '2,4'];

    const toQualityLabel = (q: string) =>
      q === 'excellent' ? '大吉' : q === 'good' ? '吉' : q === 'neutral' ? '平' : q === 'caution' ? '小凶' : '凶';

    // ① 各 reading のカラーゾーン + 方位線を順に描画
    if (directionalReadings.length > 0) {
      // 分割設定からセクター角度リストと各セクターの半幅を算出
      // 30_60 は N/E/S/W=半幅15°、四隅=半幅30° の非対称8分割
      const sectorAngles = DIVISION_ANGLES[settings.division];
      const halfWidths   = DIVISION_HALF_WIDTHS[settings.division];

      directionalReadings.forEach(({ modeName, modeColor, reading }, readingIdx) => {
        const directions = reading.directions.filter(d => d.direction !== 'CENTER');
        const dashArray = LINE_DASHES[readingIdx % LINE_DASHES.length];

        // ① カラーゾーン
        sectorAngles.forEach((bearingDeg, sectorIdx) => {
          const nearest = directions.reduce((prev, curr) => {
            const dp = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[prev.direction] + 180) % 360) - 180);
            const dc = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[curr.direction] + 180) % 360) - 180);
            return dc < dp ? curr : prev;
          });
          // 方位盤と同じ分類カテゴリだが、マップは半透明オーバーレイなので濃い側のパレット(DIRECTION_COLOR_HEX)を使う
          const color = DIRECTION_COLOR_HEX[nearest.topCategory];
          // カラーオーバーレイ off／普通カテゴリ（吉でも凶でもない方位）は塗りを描画しない
          const isNormal = nearest.topCategory === 'normal';
          const fillOp = (settings.showColors && !isNormal) ? (directionalReadings.length > 1 ? 0.09 : 0.14) : 0;
          const dirLabel = settings.division === '24'
            ? NIJUSHISAN.find(m => m.angle === bearingDeg)?.label ?? `${bearingDeg}°`
            : nearest.directionName;

          const halfWidth  = halfWidths[sectorIdx];
          const startAngle = bearingDeg - halfWidth;
          const endAngle   = bearingDeg + halfWidth;
          const sideSteps  = 20;
          const sectorLineFunc = settings.lineType === 'rhumb' ? rhumbLine : greatCircleLine;

          // 外側のアーク（円弧）は描かず、左右の放射線の外端を直線で結んで閉じる
          // （地図上に「丸の外周」が出ないようにする）
          const leftSide = sectorLineFunc(origin.lat, origin.lng, applyDecl(startAngle), sectorDist, sideSteps);
          const rightSide = sectorLineFunc(origin.lat, origin.lng, applyDecl(endAngle), sectorDist, sideSteps);
          const sectorPts: L.LatLngExpression[] = [
            ...leftSide,
            ...[...rightSide].reverse(),
          ];

          // 塗りつぶしのみ（外周＝外端どうしを結ぶ輪郭線は描かない）
          const sector = L.polygon(
            sectorPts,
            { stroke: false, fillColor: color, fillOpacity: fillOp, bubblingMouseEvents: true }
          );

          // 境界線（中心→外への放射線）は扇形塗りと同じ leftSide/rightSide を使う
          addLayer(L.polyline(leftSide, { color: 'rgba(0,0,0,0.45)', weight: 1.2, interactive: false }));
          addLayer(L.polyline(rightSide, { color: 'rgba(0,0,0,0.45)', weight: 1.2, interactive: false }));

          sector.on('mouseover', () => {
            // ホバー時に全 reading の情報を収集
            const entries: HoverEntry[] = directionalReadings.map(({ modeName: mn, modeColor: mc, reading: r }) => {
              const dirs = r.directions.filter(d => d.direction !== 'CENTER');
              const near = dirs.reduce((p, c) => {
                const dp = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[p.direction] + 180) % 360) - 180);
                const dc = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[c.direction] + 180) % 360) - 180);
                return dc < dp ? c : p;
              });
              return {
                modeName: mn,
                modeColor: mc,
                qualityColor: settings.showColors ? QUALITY_COLORS[near.quality] : '#9ca3af',
                qualityLabel: toQualityLabel(near.quality),
                reason: near.reason,
              };
            });
            setHoverInfo({ dirLabel, entries });
          });
          sector.on('mouseout', () => setHoverInfo(null));
          addLayer(sector);
        });


      });
    }

    // ④ コンパス方位線
    if (settings.showCompass) {
      const compassFunc = settings.compassLineType === 'rhumb' ? rhumbLine : greatCircleLine;
      DIVISION_ANGLES[settings.compassDivision].forEach(bearingDeg => {
        const pts = compassFunc(origin.lat, origin.lng, applyDecl(bearingDeg), lineDist);
        addLayer(L.polyline(pts, {
          color: '#1e3a8a', weight: 1, opacity: 0.4, dashArray: '3,6', interactive: false,
        }));
      });
    }

    // ⑤ 起点→目的地の線
    if (destination) {
      const pts = greatCircleLine(
        origin.lat, origin.lng,
        getBearing(origin.lat, origin.lng, destination.lat, destination.lng),
        getDistance(origin.lat, origin.lng, destination.lat, destination.lng) * 1.05
      );
      addLayer(L.polyline(pts, {
        color: '#1e293b', weight: 2, opacity: 0.9, dashArray: '6,4',
      }));
    }

  }, [origin, destination, directionalReadings, settings, showMarkers, applyDecl]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
      <div ref={containerRef} className="w-full h-full" />

      {/* 方位情報パネル（左下固定） */}
      {hoverInfo && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 p-3 w-56 pointer-events-none">
          <div className="font-bold text-sm text-slate-700 mb-2">{hoverInfo.dirLabel}</div>
          {hoverInfo.entries.map((entry, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
              <div className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0" style={{ background: entry.modeColor }} />
              <div className="min-w-0">
                <span className="text-xs font-bold" style={{ color: entry.qualityColor }}>
                  {entry.modeName}: {entry.qualityLabel}
                </span>
                <p className="text-[10px] text-slate-400 leading-snug">{entry.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
