'use client';

import { useState, useRef, useEffect } from 'react';

import DirectionBoard from '@/app/components/DirectionBoard';
import DirectionBoardModeToggle from '@/app/components/DirectionBoardModeToggle';
import type { DirectionAnalysis } from '@/lib/fortune/directional/calculator';
import {
  getEtoBranchName,
  getYearEtoBranch,
  getYearTenkanName,
} from '@/lib/fortune/directional/eto-tables';
import { calculateDayLoshu, type LoshuBoards } from '@/lib/fortune/directional/loshu';
import { calculateHonmeiStar, calculateMonthStar } from '@/lib/fortune/nine-star-ki/calculator';
import type { SearchResultMarker } from './MapCore';

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    country?: string;
    city?: string;
    state?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    type?: string;
    osm_type?: string;
  };
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    road?: string;
    amenity?: string;
  };
}

function nominatimToFeature(r: NominatimResult): PhotonFeature {
  const addr = r.address ?? {};
  return {
    geometry: { coordinates: [parseFloat(r.lon), parseFloat(r.lat)] },
    properties: {
      name: r.name || r.display_name.split(',')[0],
      city: addr.city ?? addr.town ?? addr.village,
      state: addr.state,
      country: addr.country,
      type: r.type,
    },
  };
}

function photonIcon(type?: string): string {
  switch (type) {
    case 'city': case 'town': case 'village': return '🏙️';
    case 'railway': case 'station': return '🚉';
    case 'bus_stop': return '🚌';
    case 'airport': return '✈️';
    case 'hotel': case 'hostel': return '🏨';
    case 'restaurant': case 'cafe': case 'fast_food': return '🍽️';
    case 'hospital': case 'clinic': return '🏥';
    case 'school': case 'university': return '🏫';
    case 'park': case 'nature_reserve': return '🌳';
    case 'street': case 'road': return '🛣️';
    case 'house': case 'building': return '🏠';
    default: return '📍';
  }
}

function photonSubtext(p: PhotonFeature['properties']): string {
  const parts: string[] = [];
  if (p.city && p.city !== p.name) parts.push(p.city);
  if (p.state && p.state !== p.city && p.state !== p.name) parts.push(p.state);
  if (p.country) parts.push(p.country);
  return parts.slice(0, 3).join(', ');
}

type BoardType = 'year' | 'month' | 'day' | 'time';

interface LeftSidebarProps {
  onCurrentLocation: () => void;
  onFlyToOrigin: () => void;
  onFlyToDestination: () => void;
  onSetOrigin: (pos: { lat: number; lng: number; label?: string }) => void;
  onSetDestination: (pos: { lat: number; lng: number; label?: string }) => void;
  pinnedPoint?: { lat: number; lng: number } | null;
  onSetPinAsOrigin?: () => void;
  onSetPinAsDestination?: () => void;
  onReset: () => void;
  showMarkers: boolean;
  onToggleMarkers: (v: boolean) => void;
  hasOrigin: boolean;
  hasDestination: boolean;
  targetDateTime: string;
  onTargetDateTimeChange: (v: string) => void;
  birthDate?: string;
  onCalculate: () => void;
  onSetCurrentTime: () => void;
  onSearchResults?: (markers: SearchResultMarker[]) => void;
  selectedBoards?: Array<'year' | 'month' | 'day'>;
  onToggleBoard?: (v: 'year' | 'month' | 'day') => void;
  boardEntries?: Array<{
    modeName: string;
    modeColor: string;
    boardType: BoardType;
    loshuBoards: LoshuBoards;
    directions: DirectionAnalysis[];
  }> | null;
  onClose?: () => void;
}

const BOARD_LABELS: Record<BoardType, string> = {
  year: '年盤', month: '月盤', day: '日盤', time: '時盤',
};

type BirthProfile = {
  honmei: number;
  getsumei: number;
  nichimei: number;
};

function formatBoardLabel(date: Date, boardType: BoardType): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (boardType === 'year') return `${year}年 ${BOARD_LABELS[boardType]}`;
  if (boardType === 'month') return `${year}年${month}月 ${BOARD_LABELS[boardType]}`;
  if (boardType === 'day') return `${year}年${month}月${day}日 ${BOARD_LABELS[boardType]}`;

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes} ${BOARD_LABELS[boardType]}`;
}

function formatBoardRange(date: Date, boardType: BoardType): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (boardType === 'year') return `${year}/2/4 - ${year + 1}/2/3`;
  if (boardType === 'month') return `${year}/${month}`;
  if (boardType === 'day') return `${year}/${month}/${day}`;

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function getBirthProfile(birthDate?: string): BirthProfile | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const honmei = calculateHonmeiStar(birth);
  return {
    honmei,
    getsumei: calculateMonthStar(birth, honmei),
    nichimei: calculateDayLoshu(birth).CENTER,
  };
}

export default function LeftSidebar({
  onCurrentLocation,
  onFlyToOrigin,
  onFlyToDestination,
  onSetOrigin,
  onSetDestination,
  pinnedPoint,
  onSetPinAsOrigin,
  onSetPinAsDestination,
  onReset,
  showMarkers,
  onToggleMarkers,
  hasOrigin,
  hasDestination,
  targetDateTime,
  onTargetDateTimeChange,
  birthDate,
  onCalculate,
  onSetCurrentTime,
  onSearchResults,
  selectedBoards,
  onToggleBoard,
  boardEntries,
  onClose,
}: LeftSidebarProps) {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [searching, setSearching] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<PhotonFeature | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const birthProfile = getBirthProfile(birthDate);
  const targetDate = new Date(targetDateTime);
  const safeTargetDate = Number.isNaN(targetDate.getTime()) ? new Date() : targetDate;
  const targetYear = safeTargetDate.getFullYear();
  const yearEto = getEtoBranchName(getYearEtoBranch(targetYear));
  const yearTenkan = getYearTenkanName(targetYear);

  useEffect(() => {
    onSearchResults?.(
      results.map(f => ({
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        name: f.properties.name ?? '不明',
        subtext: photonSubtext(f.properties) || undefined,
      }))
    );
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps

  const search = async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=7&accept-language=ja`,
        { headers: { 'Accept-Language': 'ja' } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data.map(nominatimToFeature));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedFeature(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSelectedFeature(null);
    onSearchResults?.([]);
    inputRef.current?.focus();
  };

  const handleSelect = (f: PhotonFeature) => {
    setQuery(f.properties.name ?? '');
    setResults([]);
    setSelectedFeature(f);
  };

  const handleSetAsOrigin = () => {
    if (!selectedFeature) return;
    const [lng, lat] = selectedFeature.geometry.coordinates;
    onSetOrigin({ lat, lng, label: selectedFeature.properties.name });
    setSelectedFeature(null);
    setQuery('');
  };

  const handleSetAsDestination = () => {
    if (!selectedFeature) return;
    const [lng, lat] = selectedFeature.geometry.coordinates;
    onSetDestination({ lat, lng, label: selectedFeature.properties.name });
    setSelectedFeature(null);
    setQuery('');
  };

  return (
    <aside className="w-full flex-1 min-h-0 bg-white border-r border-slate-200 flex flex-col text-sm overflow-y-auto">
      {/* モバイル：閉じるボタン */}
      {onClose && (
        <div className="lg:hidden flex items-center justify-between px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <span className="text-sm font-bold text-slate-700">🔍 場所・日時</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 text-base leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      )}
      {/* ナビゲーションボタン */}
      <div className="p-3 space-y-2 border-b border-slate-100">
        <button
          onClick={onCurrentLocation}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
        >
          <span>🎯</span> 現在地
        </button>
        <button
          onClick={onFlyToOrigin}
          disabled={!hasOrigin}
          className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>🏠</span> 起点へ
        </button>
        <button
          onClick={onFlyToDestination}
          disabled={!hasDestination}
          className="w-full flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>⛳</span> 目的地へ
        </button>
      </div>

      {/* 地図で選択した地点（クリックで立てた印） */}
      {pinnedPoint && (
        <div className="p-3 border-b border-slate-100 bg-amber-50">
          <div className="text-xs font-bold text-amber-700 mb-1">📍 地図で選択した地点</div>
          <div className="text-[11px] text-slate-500 mb-2">
            緯度 {pinnedPoint.lat.toFixed(4)} / 経度 {pinnedPoint.lng.toFixed(4)}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onSetPinAsOrigin}
              className="flex-1 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-medium transition-colors"
            >
              🏠 起点に
            </button>
            <button
              onClick={onSetPinAsDestination}
              className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-medium transition-colors"
            >
              ⛳ 目的地に
            </button>
          </div>
        </div>
      )}

      {/* 場所を検索 */}
      <div className="border-b border-slate-100">
        {/* 入力欄 */}
        <div className="relative px-3 py-2">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="場所を検索"
            className="w-full pl-7 pr-7 py-2 bg-slate-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm leading-none"
            >
              ✕
            </button>
          )}
          {searching && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-400 text-xs animate-pulse">…</span>
          )}
        </div>

        {/* 候補リスト */}
        {results.length > 0 && (
          <ul className="border-t border-slate-100">
            {results.map((f, i) => {
              const p = f.properties;
              const sub = photonSubtext(p);
              return (
                <li key={i} className="border-b border-slate-50 last:border-b-0">
                  <button
                    onClick={() => handleSelect(f)}
                    className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{photonIcon(p.type)}</span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-slate-800 truncate">{p.name ?? '—'}</span>
                      {sub && <span className="block text-[10px] text-slate-400 truncate mt-0.5">{sub}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* 選択済み → 起点/目的地ボタン */}
        {selectedFeature && (
          <div className="px-3 pb-3 pt-1 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
              <span>{photonIcon(selectedFeature.properties.type)}</span>
              <span className="font-medium truncate">{selectedFeature.properties.name}</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleSetAsOrigin}
                className="flex-1 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                🏠 起点に設定
              </button>
              <button
                onClick={handleSetAsDestination}
                className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                ⛳ 目的地に設定
              </button>
            </div>
          </div>
        )}
      </div>

      {/* マーカー表示 */}
      <div className="p-3 border-b border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={e => onToggleMarkers(e.target.checked)}
            className="rounded accent-blue-500"
          />
          <span className="text-slate-600">マーカー表示</span>
        </label>
      </div>

      {/* 診断日時 */}
      <div className="p-3 border-b border-slate-100">
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-500 block mb-0.5">診断日時</label>
            <input
              type="datetime-local"
              value={targetDateTime}
              onChange={e => onTargetDateTimeChange(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onCalculate}
              className="flex-1 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 font-medium"
            >
              表示
            </button>
            <button
              onClick={onSetCurrentTime}
              className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200"
            >
              現時刻へ
            </button>
          </div>
        </div>
      </div>

      {/* 方位盤（命星別） */}
      {boardEntries && boardEntries.length > 0 && birthProfile && (
        <div className="p-3 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">🧭 方位盤</span>
            <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white">北・上</span>
          </div>
          <DirectionBoardModeToggle />

          {/* 盤タイプ切替（年/月/日 複数選択可・重複タップで重ね表示） */}
          {selectedBoards && onToggleBoard && (
            <div className="flex gap-1">
              {(['year', 'month', 'day'] as const).map(bt => (
                <button
                  key={bt}
                  onClick={() => onToggleBoard(bt)}
                  className={`flex-1 px-2 py-1 text-[11px] font-bold rounded border transition-colors ${
                    selectedBoards.includes(bt)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'text-slate-500 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {BOARD_LABELS[bt]}
                </button>
              ))}
            </div>
          )}

          {boardEntries.map((entry, idx) => {
            const layout = entry.loshuBoards[entry.boardType];

            return (
              <div key={`${entry.boardType}-${idx}`} className="space-y-2">
                {/* 盤ヘッダー（本命・月命は固定） */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.modeColor }} />
                  <span className="text-xs font-bold" style={{ color: entry.modeColor }}>{entry.modeName}</span>
                </div>

                <DirectionBoard
                  board={layout}
                  honmei={birthProfile.honmei}
                  getsumei={birthProfile.getsumei}
                  yearEto={yearEto}
                  yearTenkan={yearTenkan}
                  yearLabel={formatBoardLabel(safeTargetDate, entry.boardType)}
                  yearRange={formatBoardRange(safeTargetDate, entry.boardType)}
                />
              </div>
            );
          })}

        </div>
      )}

      {/* 地図クリックの説明 */}
      <div className="p-3 border-b border-slate-100">
        <div className="text-xs text-slate-400 leading-relaxed">
          📍 地図をクリックすると起点・目的地を設定できます
        </div>
      </div>

      {/* ユーティリティ */}
      <div className="p-3 space-y-2 mt-auto">
        <button
          onClick={() => setShowHint(!showHint)}
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"
        >
          💡 使い方のヒント
        </button>
        {showHint && (
          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 space-y-1 leading-relaxed">
            <p>• 地図をクリック→起点/目的地を設定</p>
            <p>• 現在地ボタン→GPS取得</p>
            <p>• 右パネルで方位線・盤を切替</p>
            <p>• 二十四山で精密方位を確認</p>
          </div>
        )}
        <button
          onClick={onReset}
          className="w-full text-xs px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
        >
          🔄 すべて初期化
        </button>
      </div>
    </aside>
  );
}
