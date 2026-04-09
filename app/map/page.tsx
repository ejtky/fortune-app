'use client';

import { useState } from 'react';
import { generateNineStarKiReading } from '@/lib/fortune/nine-star-ki/calculator';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import LoshuBoard from '../components/LoshuBoard';

// 八雲院風の開運マップ
// 地図と方位盤を連動させて吉凶方位をチェック

export default function FortuneMap() {
  const [birthDate, setBirthDate] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 35.6762, lng: 139.6503 }); // 東京駅
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [direction, setDirection] = useState<DirectionKey | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeLoshuBoard, setActiveLoshuBoard] = useState<'year' | 'month' | 'day'>('month');
  const [honmeiStar, setHonmeiStar] = useState<number | null>(null);

  // 方位計算
  const calculateDirection = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    const dLon = to.lng - from.lng;
    const y = Math.sin(dLon * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180);
    const x = Math.cos(from.lat * Math.PI / 180) * Math.sin(to.lat * Math.PI / 180) -
              Math.sin(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.cos(dLon * Math.PI / 180);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;

    // 方位の判定（8方位）
    if (bearing >= 337.5 || bearing < 22.5) return '北';
    if (bearing >= 22.5 && bearing < 67.5) return '北東';
    if (bearing >= 67.5 && bearing < 112.5) return '東';
    if (bearing >= 112.5 && bearing < 157.5) return '南東';
    if (bearing >= 157.5 && bearing < 202.5) return '南';
    if (bearing >= 202.5 && bearing < 247.5) return '南西';
    if (bearing >= 247.5 && bearing < 292.5) return '西';
    return '北西';
  };

  // 距離計算（ハバーサイン公式）
  const calculateDistance = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLon = (to.lng - from.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 生年月日から本命星を計算
  const handleCalculate = () => {
    if (!birthDate) return;
    const result = generateNineStarKiReading(new Date(birthDate));
    setHonmeiStar(result.honmei);
  };

  // 目的地設定（デモ用の主要都市）
  const setDemoDestination = (city: string) => {
    const cities = {
      '札幌': { lat: 43.0642, lng: 141.3469 },
      '仙台': { lat: 38.2682, lng: 140.8694 },
      '東京': { lat: 35.6762, lng: 139.6503 },
      '名古屋': { lat: 35.1815, lng: 136.9066 },
      '大阪': { lat: 34.6937, lng: 135.5023 },
      '広島': { lat: 34.3853, lng: 132.4553 },
      '福岡': { lat: 33.5904, lng: 130.4017 },
      '那覇': { lat: 26.2124, lng: 127.6809 },
    };

    const target = cities[city as keyof typeof cities];
    if (target) {
      setTargetLocation(target);
      setDirection(calculateDirection(userLocation, target) as DirectionKey);
      setDistance(calculateDistance(userLocation, target));
    }
  };

  const directionalReading = honmeiStar
    ? generateDirectionalReading(new Date(selectedDate), honmeiStar)
    : null;

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 text-purple-900">🗺️ 開運マップ</h1>
        <p className="text-center text-gray-600 mb-6">地図と方位盤を連動させて吉凶方位をチェック</p>

        {/* 生年月日入力 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">あなたの生年月日</h2>
          <div className="flex gap-4">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleCalculate}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              計算
            </button>
          </div>
        </div>

        {honmeiStar && directionalReading && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 地図エリア */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">地図（デモ版）</h2>

                {/* 現在地設定 */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    現在地（基準点）
                  </label>
                  <select
                    value={`${userLocation.lat},${userLocation.lng}`}
                    onChange={(e) => {
                      const [lat, lng] = e.target.value.split(',').map(Number);
                      setUserLocation({ lat, lng });
                      if (targetLocation) {
                        setDirection(calculateDirection({ lat, lng }, targetLocation) as DirectionKey);
                        setDistance(calculateDistance({ lat, lng }, targetLocation));
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="43.0642,141.3469">札幌</option>
                    <option value="38.2682,140.8694">仙台</option>
                    <option value="35.6762,139.6503">東京</option>
                    <option value="35.1815,136.9066">名古屋</option>
                    <option value="34.6937,135.5023">大阪</option>
                    <option value="34.3853,132.4553">広島</option>
                    <option value="33.5904,130.4017">福岡</option>
                    <option value="26.2124,127.6809">那覇</option>
                  </select>
                </div>

                {/* 目的地選択 */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    目的地を選択
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['札幌', '仙台', '東京', '名古屋', '大阪', '広島', '福岡', '那覇'].map((city) => (
                      <button
                        key={city}
                        onClick={() => setDemoDestination(city)}
                        className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 rounded-lg transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 地図プレースホルダー */}
                <div className="relative bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <p className="text-lg font-semibold mb-2">🗺️ 地図表示エリア</p>
                    <p className="text-sm">Leaflet.jsまたはGoogle Maps APIで実装予定</p>
                    {targetLocation && (
                      <div className="mt-4 bg-white p-4 rounded-lg inline-block">
                        <p className="font-semibold">方位: {direction}</p>
                        <p className="text-sm">距離: {distance?.toFixed(1)} km</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 結果表示 */}
              {direction && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">方位の吉凶</h3>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xl font-bold text-purple-900 mb-2">
                      {direction}方向
                    </p>
                    <p className="text-sm text-gray-700">
                      距離: {distance?.toFixed(1)} km
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      {activeLoshuBoard === 'year' && '年盤での吉凶を確認してください →'}
                      {activeLoshuBoard === 'month' && '月盤での吉凶を確認してください →'}
                      {activeLoshuBoard === 'day' && '日盤での吉凶を確認してください →'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 方位盤エリア */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">方位盤</h2>

                {/* 日付選択 */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    日付
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* 盤の種類選択 */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    {(['year', 'month', 'day'] as const).map((board) => (
                      <button
                        key={board}
                        onClick={() => setActiveLoshuBoard(board)}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          activeLoshuBoard === board
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {board === 'year' && '年盤'}
                        {board === 'month' && '月盤'}
                        {board === 'day' && '日盤'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 洛書盤表示 */}
                <LoshuBoard
                  layout={directionalReading.loshuBoards[activeLoshuBoard]}
                  title={
                    activeLoshuBoard === 'year' ? '年盤' :
                    activeLoshuBoard === 'month' ? '月盤' : '日盤'
                  }
                  selectedDirection={direction}
                  onDirectionClick={(dir) => setDirection(dir as DirectionKey)}
                />

                {/* 使い方ガイド */}
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 使い方</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. 現在地（基準点）を選択</li>
                    <li>2. 目的地をクリック</li>
                    <li>3. 方位盤で吉凶を確認</li>
                    <li>4. 年盤・月盤・日盤を切り替えて最適な時期を探す</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {!honmeiStar && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              生年月日を入力して「計算」ボタンを押してください
            </p>
          </div>
        )}

        {/* 次のステップ */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">🚧 開発中の機能</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✅ 基本的な方位計算と距離計算</li>
            <li>🔨 Leaflet.jsまたはGoogle Maps APIによる本格的な地図表示</li>
            <li>🔨 お気に入り地点の登録・管理</li>
            <li>🔨 メンバー管理（家族・友人の生年月日保存）</li>
            <li>🔨 神社仏閣検索機能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
