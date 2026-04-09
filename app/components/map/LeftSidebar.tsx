'use client';

import { useState, useRef } from 'react';

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
}

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
}: LeftSidebarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [pendingResult, setPendingResult] = useState<SearchResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      {/* 凡例 */}
      <div className="p-3 border-b border-slate-100">
        <div className="text-xs text-slate-500 mb-2 font-medium">凡例</div>
        <div className="space-y-1 text-xs">
          {[
            { color: '#10b981', label: '大吉' },
            { color: '#3b82f6', label: '吉' },
            { color: '#6b7280', label: '平' },
            { color: '#f59e0b', label: '小凶' },
            { color: '#ef4444', label: '凶' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <span className="text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

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
