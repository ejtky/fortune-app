'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { diagnoseNineStar } from '@/lib/fortune/nine-star-calculator';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';

// Leaflet を動的インポート（SSR回避）
const MapWithNoSSR = dynamic(() => import('../components/DirectionMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">地図を読み込み中...</div>
    </div>
  ),
});

export default function DirectionMapPage() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directionalReading, setDirectionalReading] = useState<DirectionalReading | null>(null);
  const [loading, setLoading] = useState(false);

  // 現在地を取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('位置情報の取得に失敗:', error);
          // デフォルト位置（東京）
          setCurrentLocation({ lat: 35.6762, lng: 139.6503 });
        }
      );
    } else {
      // デフォルト位置（東京）
      setCurrentLocation({ lat: 35.6762, lng: 139.6503 });
    }
  }, []);

  const handleAnalyze = () => {
    if (!birthDate) {
      alert('生年月日を入力してください');
      return;
    }

    setLoading(true);

    try {
      const birth = new Date(birthDate);
      const diagnosis = diagnoseNineStar(birth);
      const target = new Date(targetDate);
      const reading = generateDirectionalReading(target, diagnosis.mainStar.number);

      setDirectionalReading(reading);
    } catch (error) {
      console.error('分析エラー:', error);
      alert('分析中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            吉方位マップ
          </h1>
          <p className="text-gray-600 text-lg">
            あなたの吉方位・凶方位を地図上で確認できます
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                生年月日
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                判定日（旅行・引越し予定日）
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !birthDate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? '分析中...' : '吉方位を表示'}
          </button>
        </div>

        {/* 地図表示 */}
        {currentLocation && directionalReading && (
          <div className="space-y-6">
            {/* 地図 */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-blue-500 pb-3">
                方位盤マップ
              </h2>
              <MapWithNoSSR
                center={currentLocation}
                directionalReading={directionalReading}
              />
            </div>

            {/* 方位別詳細情報 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-purple-500 pb-3">
                方位別詳細
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {directionalReading.directions.map((info) => {
                  const isGood = info.quality === 'excellent' || info.quality === 'good';
                  const isBad = info.quality === 'avoid' || info.quality === 'caution';


                  return (
                      <div
                        key={info.direction}

                      className={`rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
                        isGood
                          ? 'bg-gradient-to-br from-green-50 to-green-25 border-green-300'
                          : isBad
                          ? 'bg-gradient-to-br from-red-50 to-red-25 border-red-300'
                          : 'bg-gradient-to-br from-gray-50 to-gray-25 border-gray-300'
                      }`}
                    >
                      <div className="text-center mb-3">
                        <div className="text-3xl mb-2">{getDirectionEmoji(info.direction)}</div>
                        <div className="font-bold text-xl text-gray-800">{info.directionName}</div>
                      </div>


                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">総合判定:</span>
                          <span className={`font-bold px-3 py-1 rounded-full ${
                            isGood ? 'bg-green-200 text-green-800' :
                            isBad ? 'bg-red-200 text-red-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {isGood ? '吉' : isBad ? '凶' : '平'}
                          </span>
                        </div>

                        <div className="bg-white/80 rounded-lg p-3 mt-3">
                          <div className="text-xs text-gray-600 mb-2">九星:</div>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">年:{info.yearStar}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">月:{info.monthStar}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* アドバイス */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">💡 アドバイス</h2>
              <div className="space-y-3 text-gray-700">
                <p>• <strong>吉方位（緑色）</strong>：この方向への旅行や引越しは運気アップが期待できます</p>
                <p>• <strong>凶方位（赤色）</strong>：この方向への移動は避けるか、十分な準備が必要です</p>
                <p>• <strong>平方位（灰色）</strong>：特に大きな影響はありません</p>
                <p>• 75km以上離れた場所への移動で方位の影響を受けるとされています</p>
                <p>• 一泊二日以上の滞在で、方位のエネルギーを十分に取り入れられます</p>
              </div>
            </div>
          </div>
        )}

        {/* 初期メッセージ */}
        {!directionalReading && !loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">🧭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              吉方位を地図で確認
            </h3>
            <p className="text-gray-600">
              生年月日と判定日を入力してください。
              <br />
              あなたの吉方位・凶方位を地図上に表示します。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 方位の絵文字を取得
function getDirectionEmoji(direction: DirectionKey): string {
  const emojis: Record<DirectionKey, string> = {
    N: '⬆️',
    NE: '↗️',
    E: '➡️',
    SE: '↘️',
    S: '⬇️',
    SW: '↙️',
    W: '⬅️',
    NW: '↖️',
    CENTER: '🏠',
  };
  return emojis[direction] || '📍';
}
