'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LeftSidebar from '@/app/components/map/LeftSidebar';
import RightSidebar from '@/app/components/map/RightSidebar';
import type { MapSettings } from '@/app/components/map/MapCore';
import { calculateMainStar } from '@/lib/fortune/nine-star-calculator';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';

const MapCore = dynamic(() => import('@/app/components/map/MapCore'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400">
      地図を読み込み中...
    </div>
  ),
});

const DEFAULT_SETTINGS: MapSettings = {
  showDirectionLines: true,
  showCompass: false,
  showTrackingLine: false,
  showControls: true,
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

export default function DirectionMapPage() {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [targetDateTime, setTargetDateTime] = useState(nowDateTimeLocal());
  const [boardType, setBoardType] = useState<'year' | 'month' | 'day'>('month');
  const [settings, setSettings] = useState<MapSettings>(DEFAULT_SETTINGS);
  const [showMarkers, setShowMarkers] = useState(true);
  const [directionalReading, setDirectionalReading] = useState<DirectionalReading | null>(null);
  const [flyToOrigin, setFlyToOrigin] = useState(false);
  const [flyToDestination, setFlyToDestination] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'none' | 'left' | 'right'>('none');

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
        () => setOrigin({ lat: 35.6762, lng: 139.6503 })
      );
    } else {
      setOrigin({ lat: 35.6762, lng: 139.6503 });
    }
  }, []);

  // 生年月日が設定されたら自動計算
  useEffect(() => {
    if (birthDate && origin) {
      calculate(birthDate, targetDateTime);
    }
  }, [birthDate, origin]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculate = useCallback((bd: string, dt: string) => {
    if (!bd) return;
    try {
      const birth = new Date(bd);
      const honmei = calculateMainStar(birth);
      const date = new Date(dt);
      const reading = generateDirectionalReading(date, honmei);
      setDirectionalReading(reading);
      // localStorage に保存
      localStorage.setItem('kyusei_birthDate', bd);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCalculate = () => calculate(birthDate, targetDateTime);

  const handleSetCurrentTime = () => {
    const now = nowDateTimeLocal();
    setTargetDateTime(now);
    calculate(birthDate, now);
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
    setDirectionalReading(null);
    setShowMarkers(true);
    localStorage.removeItem('kyusei_birthDate');
  };

  const handleSettingsChange = (partial: Partial<MapSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const handleBirthDateChange = (v: string) => {
    setBirthDate(v);
    calculate(v, targetDateTime);
  };

  const handleTargetDateTimeChange = (v: string) => {
    setTargetDateTime(v);
  };

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
    },
    right: {
      settings,
      onSettingsChange: handleSettingsChange,
      birthDate,
      onBirthDateChange: handleBirthDateChange,
      targetDateTime,
      onTargetDateTimeChange: handleTargetDateTimeChange,
      boardType,
      onBoardTypeChange: setBoardType,
      onCalculate: handleCalculate,
      onSetCurrentTime: handleSetCurrentTime,
    },
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-3 z-10 flex-shrink-0">
        <h1 className="font-bold font-serif text-slate-800 text-base sm:text-lg whitespace-nowrap">
          🧭 吉方位マップ
        </h1>
        {directionalReading && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <span className="truncate">本命星: <strong className="text-indigo-600">{getStarName(directionalReading.honmeiStar)}</strong></span>
            <span>|</span>
            <span className="truncate">{new Date(targetDateTime).toLocaleDateString('ja-JP')} {boardType === 'year' ? '年盤' : boardType === 'month' ? '月盤' : '日盤'}</span>
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
              directionalReading={directionalReading}
              settings={settings}
              showMarkers={showMarkers}
              onMapClick={(lat, lng) => { setDestination({ lat, lng }); setMobilePanel('none'); }}
              onOriginChange={pos => { setOrigin(pos); }}
              flyToOrigin={flyToOrigin}
              flyToDestination={flyToDestination}
              onFlyDone={() => { setFlyToOrigin(false); setFlyToDestination(false); }}
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
