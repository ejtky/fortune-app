'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import LeftSidebar from '@/app/components/map/LeftSidebar';
import RightSidebar from '@/app/components/map/RightSidebar';
import type { MapSettings, DirectionalReadingEntry, SearchResultMarker } from '@/app/components/map/MapCore';
import { calculateHonmeiStar, calculateMonthStar } from '@/lib/fortune/nine-star-ki/calculator';
import { generateDirectionalReading, type DirectionalReading } from '@/lib/fortune/directional/calculator';

type BoardType = 'year' | 'month' | 'day';
type BoardResult = { boardType: BoardType; reading: DirectionalReading };

const MapCore = dynamic(() => import('@/app/components/map/MapCore'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400">
      地図を読み込み中...
    </div>
  ),
});

const DEFAULT_SETTINGS: MapSettings = {
  showCompass: false,
  showTrackingLine: false,
  showControls: true,
  showColors: true,
  lineType: 'great',
  division: '45',
  compassDivision: '45',
  compassLineType: 'great',
  declinationDeg: 0,
  declinationMin: 0,
  declinationDir: 'west',
  showBoardOnMap: false,
};

function nowDateTimeLocal() {
  const now = new Date();
  // datetime-local の形式: YYYY-MM-DDTHH:MM
  return now.toISOString().slice(0, 16);
}

// 盤タイプ（年・月・日）の表示名と識別色
const BOARD_ORDER: BoardType[] = ['year', 'month', 'day'];
const BOARD_LABELS: Record<BoardType, string> = { year: '年盤', month: '月盤', day: '日盤' };
const BOARD_COLORS: Record<BoardType, string> = { year: '#6366f1', month: '#7c3aed', day: '#0d9488' };

export default function DirectionMapPage() {
  const [origin, setOrigin] = useState<{ lat: number; lng: number }>({ lat: 35.6762, lng: 139.6503 });
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [targetDateTime, setTargetDateTime] = useState(nowDateTimeLocal());
  const [selectedBoards, setSelectedBoards] = useState<BoardType[]>(['year']);
  const [settings, setSettings] = useState<MapSettings>(DEFAULT_SETTINGS);
  const [showMarkers, setShowMarkers] = useState(true);
  const [boardResults, setBoardResults] = useState<BoardResult[]>([]);
  const [honmeiStarNum, setHonmeiStarNum] = useState<number | null>(null);
  const [tsukimeiStarNum, setTsukimeiStarNum] = useState<number | null>(null);
  const [flyToOrigin, setFlyToOrigin] = useState(false);
  const [flyToDestination, setFlyToDestination] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'none' | 'left' | 'right'>('none');
  const [searchResultMarkers, setSearchResultMarkers] = useState<SearchResultMarker[]>([]);
  const [pinnedPoint, setPinnedPoint] = useState<{ lat: number; lng: number } | null>(null);

  // localStorage から生年月日を自動読み込み
  useEffect(() => {
    const saved = localStorage.getItem('kyusei_birthDate');
    if (saved) {
      setBirthDate(saved);
    }
    // 現在地を取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setOrigin({ lat: 35.6762, lng: 139.6503 }),
        { timeout: 5000 }
      );
    } else {
      setOrigin({ lat: 35.6762, lng: 139.6503 });
    }
  }, []);

  // 生年月日・選択した盤（年/月/日）が変わったら自動再計算
  // 各盤について本命・月命固定で reading を生成する（命星モードは廃止）
  const calculate = useCallback((bd: string, dt: string, boards: BoardType[]) => {
    if (!bd) return;
    try {
      const birth = new Date(bd);
      const honmei = calculateHonmeiStar(birth);
      const tsukimei = calculateMonthStar(birth, honmei);
      setHonmeiStarNum(honmei);
      setTsukimeiStarNum(tsukimei);
      const date = new Date(dt);
      const results: BoardResult[] = boards.map(board => ({
        boardType: board,
        reading: generateDirectionalReading(date, honmei, tsukimei, board),
      }));
      setBoardResults(results);
      localStorage.setItem('kyusei_birthDate', bd);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (birthDate && origin) {
      calculate(birthDate, targetDateTime, selectedBoards);
    }
  }, [birthDate, origin, selectedBoards]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCalculate = () => calculate(birthDate, targetDateTime, selectedBoards);

  const handleSetCurrentTime = () => {
    const now = nowDateTimeLocal();
    setTargetDateTime(now);
    calculate(birthDate, now, selectedBoards);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setFlyToOrigin(true);
        },
        () => alert('位置情報の取得に失敗しました')
      );
    }
  };

  const handleReset = () => {
    setOrigin({ lat: 35.6762, lng: 139.6503 });
    setDestination(null);
    setBirthDate('');
    setTargetDateTime(nowDateTimeLocal());
    setSettings(DEFAULT_SETTINGS);
    setBoardResults([]);
    setSelectedBoards(['year']);
    setShowMarkers(true);
    setPinnedPoint(null);
    localStorage.removeItem('kyusei_birthDate');
  };

  const handleSettingsChange = (partial: Partial<MapSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const handleBirthDateChange = (v: string) => {
    setBirthDate(v);
    calculate(v, targetDateTime, selectedBoards);
  };

  // 盤（年/月/日）の複数選択トグル。最低1つは残す。表示順は 年→月→日 に保つ
  const toggleBoard = (board: BoardType) => {
    setSelectedBoards(prev => {
      const isOn = prev.includes(board);
      if (isOn) {
        if (prev.length === 1) return prev;
        return prev.filter(b => b !== board);
      }
      return BOARD_ORDER.filter(b => b === board || prev.includes(b));
    });
  };

  const handleTargetDateTimeChange = (v: string) => {
    setTargetDateTime(v);
  };

  // boardResults から MapCore 用（カラーゾーン重ね表示）を派生
  const directionalReadings: DirectionalReadingEntry[] = useMemo(
    () => boardResults.map(r => ({
      modeName: BOARD_LABELS[r.boardType],
      modeColor: BOARD_COLORS[r.boardType],
      reading: r.reading,
    })),
    [boardResults]
  );

  // boardResults から LeftSidebar 用（方位盤を縦に複数枚並べる）を派生
  const boardEntries = useMemo(
    () => boardResults.map(r => ({
      modeName: BOARD_LABELS[r.boardType],
      modeColor: BOARD_COLORS[r.boardType],
      boardType: r.boardType,
      loshuBoards: r.reading.loshuBoards,
      directions: r.reading.directions,
    })),
    [boardResults]
  );

  const sidebarProps = {
    left: {
      onCurrentLocation: handleCurrentLocation,
      onFlyToOrigin: () => setFlyToOrigin(true),
      onFlyToDestination: () => setFlyToDestination(true),
      onSetOrigin: (pos: { lat: number; lng: number; label?: string }) => { setOrigin(pos); setFlyToOrigin(true); setMobilePanel('none'); },
      onSetDestination: (pos: { lat: number; lng: number; label?: string }) => { setDestination(pos); setFlyToDestination(true); setMobilePanel('none'); },
      onReset: handleReset,
      showMarkers,
      onToggleMarkers: setShowMarkers,
      hasOrigin: !!origin,
      hasDestination: !!destination,
      targetDateTime,
      onTargetDateTimeChange: handleTargetDateTimeChange,
      onCalculate: handleCalculate,
      onSetCurrentTime: handleSetCurrentTime,
      birthDate,
      onBirthDateChange: handleBirthDateChange,
      onSearchResults: setSearchResultMarkers,
      pinnedPoint,
      onSetPinAsOrigin: () => { if (pinnedPoint) { setOrigin(pinnedPoint); setFlyToOrigin(true); setPinnedPoint(null); } },
      onSetPinAsDestination: () => { if (pinnedPoint) { setDestination(pinnedPoint); setFlyToDestination(true); setPinnedPoint(null); } },
      selectedBoards,
      onToggleBoard: toggleBoard,
      boardEntries: boardEntries.length > 0 ? boardEntries : null,
    },
    right: {
      settings,
      onSettingsChange: handleSettingsChange,
    },
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-3 z-10 flex-shrink-0">
        <h1 className="font-bold font-serif text-slate-800 text-base sm:text-lg whitespace-nowrap">
          🧭 吉方位マップ
        </h1>
        {boardResults.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <span className="truncate font-bold text-indigo-600">
              本命: {honmeiStarNum ? getStarName(honmeiStarNum) : '-'}
            </span>
            <span>|</span>
            <span className="truncate font-bold text-violet-600">
              月命: {tsukimeiStarNum ? getStarName(tsukimeiStarNum) : '-'}
            </span>
            <span>|</span>
            <span className="truncate">
              {new Date(targetDateTime).toLocaleDateString('ja-JP')} {selectedBoards.map(b => BOARD_LABELS[b]).join('・')}
            </span>
          </div>
        )}
        {!birthDate && (
          <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 whitespace-nowrap">
            生年月日を入力
          </div>
        )}
        {/* モバイルパネルボタン */}
        <div className="lg:hidden ml-auto flex gap-2">
          <button
            onClick={() => setMobilePanel(v => v === 'left' ? 'none' : 'left')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mobilePanel === 'left' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            🔍 場所
          </button>
          <button
            onClick={() => setMobilePanel(v => v === 'right' ? 'none' : 'right')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mobilePanel === 'right' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            ⚙️ 設定
          </button>
        </div>
      </header>

      {/* 本体 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* PC: 左サイドバー常時表示 / モバイル: ドロワー */}
        <div className={`
          lg:static lg:flex lg:w-52 lg:flex-shrink-0
          ${mobilePanel === 'left'
            ? 'absolute inset-y-0 left-0 z-20 w-64 flex flex-col shadow-xl'
            : 'hidden lg:flex'}
        `}>
          <LeftSidebar {...sidebarProps.left} />
        </div>

        {/* 地図 */}
        <div className="flex-1 relative overflow-hidden">
          {origin && (
            <MapCore
              origin={origin}
              destination={destination}
              directionalReadings={directionalReadings}
              settings={settings}
              showMarkers={showMarkers}
              onMapClick={(lat, lng) => { setPinnedPoint({ lat, lng }); setMobilePanel('none'); }}
              pinnedPoint={pinnedPoint}
              onOriginChange={pos => { setOrigin(pos); }}
              flyToOrigin={flyToOrigin}
              flyToDestination={flyToDestination}
              onFlyDone={() => { setFlyToOrigin(false); setFlyToDestination(false); }}
              searchMarkers={searchResultMarkers}
              onSearchMarkerSelect={(marker, type) => {
                if (type === 'origin') {
                  setOrigin({ lat: marker.lat, lng: marker.lng });
                  setFlyToOrigin(true);
                } else {
                  setDestination({ lat: marker.lat, lng: marker.lng });
                  setFlyToDestination(true);
                }
                setSearchResultMarkers([]);
                setMobilePanel('none');
              }}
            />
          )}
          {!origin && (
            <div className="flex items-center justify-center bg-slate-100 h-full text-slate-400">
              位置情報を取得中...
            </div>
          )}
        </div>

        {/* PC: 右サイドバー常時表示 / モバイル: ドロワー */}
        <div className={`
          lg:static lg:flex lg:w-56 lg:flex-shrink-0
          ${mobilePanel === 'right'
            ? 'absolute inset-y-0 right-0 z-20 w-64 flex flex-col shadow-xl'
            : 'hidden lg:flex'}
        `}>
          <RightSidebar {...sidebarProps.right} />
        </div>

        {/* モバイルドロワー背景オーバーレイ */}
        {mobilePanel !== 'none' && (
          <div
            className="lg:hidden absolute inset-0 z-10 bg-black/30"
            onClick={() => setMobilePanel('none')}
          />
        )}
      </div>
    </div>
  );
}

const STAR_NAMES: Record<number, string> = {
  1: '一白水星', 2: '二黒土星', 3: '三碧木星', 4: '四緑木星', 5: '五黄土星',
  6: '六白金星', 7: '七赤金星', 8: '八白土星', 9: '九紫火星',
};
function getStarName(n: number) { return STAR_NAMES[n] ?? `${n}星`; }
