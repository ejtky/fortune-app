'use client';

import { useState, useRef, useEffect } from 'react';

import type { DirectionAnalysis } from '@/lib/fortune/directional/calculator';
import type { LoshuBoards } from '@/lib/fortune/directional/loshu';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LeftSidebarProps {
  onCurrentLocation: () => void;
  onFlyToOrigin: () => void;
  onFlyToDestination: () => void;
  onSetOrigin: (pos: { lat: number; lng: number; label?: string }) => void;
  onSetDestination: (pos: { lat: number; lng: number; label?: string }) => void;
  onReset: () => void;
  showMarkers: boolean;
  onToggleMarkers: (v: boolean) => void;
  hasOrigin: boolean;
  hasDestination: boolean;
  targetDateTime: string;
  onTargetDateTimeChange: (v: string) => void;
  onCalculate: () => void;
  onSetCurrentTime: () => void;
  birthDate: string;
  onBirthDateChange: (v: string) => void;
  onBoardTypeChange?: (v: 'year' | 'month' | 'day' | 'time') => void;
  boardData?: {
    boardType: 'year' | 'month' | 'day' | 'time';
    loshuBoards: LoshuBoards;
    directions: DirectionAnalysis[];
  } | null;
}

const KANJI_STARS: Record<number, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九'
};

const COMPASS_LAYOUT = [
  'NW', 'N', 'NE',
  'W', 'CENTER', 'E',
  'SW', 'S', 'SE'
] as const;

const BOARD_LABELS: Record<'year' | 'month' | 'day' | 'time', string> = {
  year: '年盤', month: '月盤', day: '日盤', time: '時盤',
};

export default function LeftSidebar({
  onCurrentLocation,
  onFlyToOrigin,
  onFlyToDestination,
  onSetOrigin,
  onSetDestination,
  onReset,
  showMarkers,
  onToggleMarkers,
  hasOrigin,
  hasDestination,
  targetDateTime,
  onTargetDateTimeChange,
  onCalculate,
  onSetCurrentTime,
  birthDate,
  onBirthDateChange,
  onBoardTypeChange,
  boardData,
}: LeftSidebarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [pendingResult, setPendingResult] = useState<SearchResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [localBirthDate, setLocalBirthDate] = useState(birthDate);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalBirthDate(birthDate);
  }, [birthDate]);

  const search = async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=ja`
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 500);
  };

  const handleSelect = (r: SearchResult) => {
    setQuery(r.display_name.split(',')[0]);
    setResults([]);
    setPendingResult(r);
  };

  const handleSetAsOrigin = () => {
    if (!pendingResult) return;
    onSetOrigin({ lat: parseFloat(pendingResult.lat), lng: parseFloat(pendingResult.lon), label: pendingResult.display_name.split(',')[0] });
    setPendingResult(null);
    setQuery('');
  };

  const handleSetAsDestination = () => {
    if (!pendingResult) return;
    onSetDestination({ lat: parseFloat(pendingResult.lat), lng: parseFloat(pendingResult.lon), label: pendingResult.display_name.split(',')[0] });
    setPendingResult(null);
    setQuery('');
  };

  return (
    <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col text-sm overflow-y-auto">
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

      {/* キーワード検索 */}
      <div className="p-3 border-b border-slate-100">
        <div className="text-xs text-slate-500 mb-1.5 font-medium">🔍 場所を検索</div>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="地名・住所を入力"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {searching && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 text-xs">…</div>
          )}
        </div>
        {results.length > 0 && (
          <ul className="mt-1 border border-slate-200 rounded-lg overflow-hidden text-xs shadow-lg">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-2.5 py-2 hover:bg-blue-50 text-slate-700 border-b border-slate-100 last:border-b-0"
                >
                  {r.display_name.split(',').slice(0, 2).join(', ')}
                </button>
              </li>
            ))}
          </ul>
        )}
        {pendingResult && (
          <div className="mt-2 p-2 bg-slate-50 rounded-lg space-y-1.5">
            <div className="text-xs text-slate-600 truncate">{query}</div>
            <div className="flex gap-1.5">
              <button
                onClick={handleSetAsOrigin}
                className="flex-1 px-2 py-1 bg-indigo-500 text-white rounded text-xs hover:bg-indigo-600"
              >
                🏠 起点
              </button>
              <button
                onClick={handleSetAsDestination}
                className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                ⛳ 目的地
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

      {/* 生年月日 */}
      <div className="p-3 border-b border-slate-100">
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-500 block mb-0.5">生年月日</label>
            <input
              type="date"
              value={localBirthDate}
              onChange={e => setLocalBirthDate(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => onBirthDateChange(localBirthDate)}
              className="flex-1 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 font-medium"
            >
              設定・表示
            </button>
            <button
              onClick={() => {
                setLocalBirthDate('');
                onBirthDateChange('');
              }}
              className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200"
            >
              クリア
            </button>
          </div>
        </div>
      </div>

      {/* 方位盤（九星配置図） */}
      {boardData && (
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">🧭 方位盤</span>
            <span className="text-[10px] text-slate-400 font-normal border border-slate-200 px-1 rounded-sm bg-white">北・上</span>
          </div>

          <div className="flex gap-1 mb-2 bg-slate-200/50 p-1 rounded-lg">
            {(['year', 'month', 'day', 'time'] as const).map(bt => (
              <button
                key={bt}
                onClick={() => onBoardTypeChange && onBoardTypeChange(bt)}
                className={`flex-1 py-1 text-[10px] font-bold rounded ${boardData.boardType === bt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
              >
                {BOARD_LABELS[bt].replace('盤','')}
              </button>
            ))}
          </div>
          
          <div className="relative w-full aspect-square bg-slate-200 shadow-inner p-0.5" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5 relative">
              {COMPASS_LAYOUT.map(dir => {
                const layout = boardData.loshuBoards[boardData.boardType];
                const star = layout[dir as keyof typeof layout];
                const directionsMap = new Map(boardData.directions.map(d => [d.direction, d]));
                const info = dir !== 'CENTER' ? directionsMap.get(dir) : null;
                
                let bgColor = 'bg-white';
                let borderColor = 'border-slate-100';
                let isLucky = false;
                let satsuName = null;

                if (info) {
                  if (info.satsu) {
                    bgColor = 'bg-slate-300/40';
                    satsuName = info.satsu.name.replace('殺','').replace('的','').replace('破','');
                    borderColor = 'border-slate-300';
                  } else if (info.isLucky) {
                    bgColor = 'bg-rose-100';
                    borderColor = 'border-rose-200';
                    isLucky = true;
                  }
                }

                // 中心矢印のためのスタイル分け
                const isCenter = dir === 'CENTER';

                return (
                  <div key={dir} className={`relative flex flex-col items-center justify-center ${bgColor} border ${borderColor} ${isCenter ? 'z-10' : ''}`}>
                    {dir === 'N' && <div className="absolute top-1 text-[9px] text-slate-400 font-bold">北</div>}
                    {dir === 'S' && <div className="absolute bottom-1 text-[9px] text-slate-400 font-bold">南</div>}
                    {dir === 'E' && <div className="absolute right-1 text-[9px] text-slate-400 font-bold" style={{ writingMode: 'vertical-rl' }}>東</div>}
                    {dir === 'W' && <div className="absolute left-1 text-[9px] text-slate-400 font-bold" style={{ writingMode: 'vertical-rl' }}>西</div>}
                    
                    {isCenter && <div className="absolute top-1 text-red-500 text-xs mt-0.5">▲</div>}

                    <span className={`text-xl font-bold font-serif ${isLucky ? 'text-rose-700' : 'text-slate-700'}`}>
                      {KANJI_STARS[star as number]}
                    </span>
                    
                    {!isCenter && (
                      <div className="absolute bottom-0.5 left-0 w-full text-center tracking-tighter">
                        {isLucky && <span className="text-[10px] text-rose-600 font-bold bg-white/50 px-0.5 rounded leading-none inline-block">吉方</span>}
                        {satsuName && <span className="text-[9px] text-slate-500 font-bold leading-none inline-block">{satsuName}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
