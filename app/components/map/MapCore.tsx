'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import { QUALITY_COLORS } from '@/lib/fortune/directional/constants';
import {
  greatCircleLine,
  rhumbLine,
  DIVISION_ANGLES,
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
  showDirectionLines: boolean;
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
}: MapCoreProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const trackLineRef = useRef<L.Polyline | null>(null);
  const contextMenuRef = useRef<L.Popup | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const applyDecl = useCallback((angle: number) => {
    const decl = settings.declinationDeg + settings.declinationMin / 60;
    return applyDeclination(angle, decl, settings.declinationDir);
  }, [settings.declinationDeg, settings.declinationMin, settings.declinationDir]);

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

    // 地図クリックでコンテキストメニュー
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (contextMenuRef.current) {
        map.closePopup(contextMenuRef.current);
      }
      const popup = L.popup({ className: 'kyusei-popup' })
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-size:13px;padding:2px;">
            <div style="font-weight:bold;margin-bottom:8px;color:#374151;">📍 この地点を設定</div>
            <button id="set-origin-btn" style="display:block;width:100%;padding:6px 8px;margin-bottom:6px;background:#6366f1;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">🏠 起点に設定</button>
            <button id="set-dest-btn" style="display:block;width:100%;padding:6px 8px;background:#10b981;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">⛳ 目的地に設定</button>
          </div>
        `)
        .openOn(map);
      contextMenuRef.current = popup;

      setTimeout(() => {
        document.getElementById('set-origin-btn')?.addEventListener('click', () => {
          onOriginChange({ lat, lng });
          map.closePopup(popup);
        });
        document.getElementById('set-dest-btn')?.addEventListener('click', () => {
          onMapClick(lat, lng);
          map.closePopup(popup);
        });
      }, 100);
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

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // 方位ゾーン・線・マーカーの描画
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !origin) return;

    layersRef.current.forEach(l => l.remove());
    layersRef.current = [];

    const sectorDist = 5000000;
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
      // 分割設定からセクター角度リストと幅を算出
      const sectorAngles = DIVISION_ANGLES[settings.division];
      const sectorWidth  = 360 / sectorAngles.length;

      directionalReadings.forEach(({ modeName, modeColor, reading }, readingIdx) => {
        const directions = reading.directions.filter(d => d.direction !== 'CENTER');
        const dashArray = LINE_DASHES[readingIdx % LINE_DASHES.length];

        // ① カラーゾーン
        sectorAngles.forEach(bearingDeg => {
          const nearest = directions.reduce((prev, curr) => {
            const dp = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[prev.direction] + 180) % 360) - 180);
            const dc = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[curr.direction] + 180) % 360) - 180);
            return dc < dp ? curr : prev;
          });
          const color = settings.showColors ? QUALITY_COLORS[nearest.quality] : '#9ca3af';
          const dirLabel = settings.division === '24'
            ? NIJUSHISAN.find(m => m.angle === bearingDeg)?.label ?? `${bearingDeg}°`
            : nearest.directionName;

          const startAngle = bearingDeg - sectorWidth / 2;
          const endAngle   = bearingDeg + sectorWidth / 2;
          const sideSteps  = 20;
          const arcSteps   = Math.max(8, Math.round(sectorWidth * 2));
          const sectorLineFunc = settings.lineType === 'rhumb' ? rhumbLine : greatCircleLine;

          const leftSide = sectorLineFunc(origin.lat, origin.lng, applyDecl(startAngle), sectorDist, sideSteps);
          const arcPts: L.LatLngExpression[] = [];
          for (let i = 0; i <= arcSteps; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / arcSteps);
            const pts = sectorLineFunc(origin.lat, origin.lng, applyDecl(angle), sectorDist, 1);
            arcPts.push(pts[pts.length - 1]);
          }
          const rightSide = sectorLineFunc(origin.lat, origin.lng, applyDecl(endAngle), sectorDist, sideSteps);
          const sectorPts: L.LatLngExpression[] = [
            ...leftSide,
            ...arcPts.slice(1, -1),
            ...[...rightSide].reverse(),
          ];

          const sector = L.polygon(
            sectorPts,
            { color: 'rgba(0,0,0,0.15)', fillColor: color, fillOpacity: 0.10, weight: 0.6, bubblingMouseEvents: true }
          );

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

        // ③ 方位線
        if (settings.showDirectionLines) {
          const lineFunc = settings.lineType === 'rhumb' ? rhumbLine : greatCircleLine;
          sectorAngles.forEach(bearingDeg => {
            const adjustedBearing = applyDecl(bearingDeg);
            const pts = lineFunc(origin.lat, origin.lng, adjustedBearing, lineDist);
            const nearest = directions.reduce((prev, curr) => {
              const dp = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[prev.direction] + 180) % 360) - 180);
              const dc = Math.abs(((bearingDeg - DIRECTION_CENTER_ANGLES[curr.direction] + 180) % 360) - 180);
              return dc < dp ? curr : prev;
            });
            const lineColor = settings.showColors ? QUALITY_COLORS[nearest.quality] : '#9ca3af';
            addLayer(L.polyline(pts, {
              color: lineColor,
              weight: 1.5,
              opacity: 0.7,
              dashArray: dashArray,
              interactive: false,
            }));

            // ラベルは最初の reading のみ表示
            if (readingIdx === 0) {
              const labelPts = lineFunc(origin.lat, origin.lng, adjustedBearing, 96000, 2);
              const labelPos = labelPts[labelPts.length - 1];
              const labelText = settings.division === '24'
                ? NIJUSHISAN.find(m => m.angle === bearingDeg)?.label ?? `${bearingDeg}°`
                : `${bearingDeg}°`;
              addLayer(L.marker(labelPos, {
                icon: L.divIcon({
                  html: `<div style="font-size:10px;font-weight:bold;color:${lineColor};white-space:nowrap;text-shadow:0 0 3px #fff,0 0 3px #fff;">${labelText}</div>`,
                  className: '', iconAnchor: [10, 8],
                }),
                interactive: false,
              }));
            }
          });
        }
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
