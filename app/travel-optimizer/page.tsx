'use client';

import { useState } from 'react';
import { diagnoseNineStar } from '@/lib/fortune/nine-star-calculator';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';

interface DayAnalysis {
  date: string;
  reading: DirectionalReading;
  goodDirections: string[];
  badDirections: string[];
  score: number;
}

export default function TravelOptimizerPage() {
  const [birthDate, setBirthDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferredDirections, setPreferredDirections] = useState<DirectionKey[]>([]);
  const [analysis, setAnalysis] = useState<DayAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  const directions: { key: DirectionKey; label: string }[] = [
    { key: 'N', label: '北' },
    { key: 'NE', label: '北東' },
    { key: 'E', label: '東' },
    { key: 'SE', label: '南東' },
    { key: 'S', label: '南' },
    { key: 'SW', label: '南西' },
    { key: 'W', label: '西' },
    { key: 'NW', label: '北西' },

  ];

  const toggleDirection = (dir: DirectionKey) => {
    setPreferredDirections(prev =>
      prev.includes(dir) ? prev.filter(d => d !== dir) : [...prev, dir]
    );
  };

  const handleOptimize = () => {
    if (!birthDate || !startDate || !endDate) {
      alert('すべての項目を入力してください');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('開始日は終了日より前である必要があります');
      return;
    }

    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 90) {
      alert('期間は90日以内にしてください');
      return;
    }

    setLoading(true);

    try {
      const birth = new Date(birthDate);
      const diagnosis = diagnoseNineStar(birth);
      const results: DayAnalysis[] = [];

      // 各日付を分析
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const reading = generateDirectionalReading(new Date(d), diagnosis.mainStar.number);

        const goodDirs: string[] = [];
        const badDirs: string[] = [];

        reading.directions.forEach((info) => {
          const isGood = info.quality === 'excellent' || info.quality === 'good';
          const isBad = info.quality === 'avoid' || info.quality === 'caution';
          if (isGood) {
            goodDirs.push(info.directionName);
          } else if (isBad) {
            badDirs.push(info.directionName);
          }
        });


        // スコア計算
        let score = goodDirs.length * 10 - badDirs.length * 5;

        // 希望方位が吉方位ならボーナス
        if (preferredDirections.length > 0) {
          preferredDirections.forEach(prefDir => {
            const info = reading.directions.find(d => d.direction === prefDir);
            if (info && (info.quality === 'excellent' || info.quality === 'good')) {
              score += 20;
            }
          });
        }


        results.push({
          date: d.toISOString().split('T')[0],
          reading,
          goodDirections: goodDirs,
          badDirections: badDirs,
          score,
        });
      }

      // スコア順にソート
      results.sort((a, b) => b.score - a.score);
      setAnalysis(results);
    } catch (error) {
      console.error('最適化エラー:', error);
      alert('最適化中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            旅行日程最適化
          </h1>
          <p className="text-gray-600 text-lg">
            指定期間内で最も吉方位が多い日を見つけます
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                生年月日
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  開始日
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  終了日
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                希望方位（任意：選択すると優先的に表示）
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {directions.map((dir) => (
                  <button
                    key={dir.key}
                    onClick={() => toggleDirection(dir.key)}
                    className={`py-2 px-4 rounded-lg border-2 transition-all ${
                      preferredDirections.includes(dir.key)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleOptimize}
              disabled={loading || !birthDate || !startDate || !endDate}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? '分析中...' : '最適な日を探す'}
            </button>
          </div>
        </div>

        {/* 分析結果 */}
        {analysis.length > 0 && (
          <div className="space-y-6">
            {/* トップ3のおすすめ日 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-indigo-500 pb-3">
                🌟 おすすめトップ3
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {analysis.slice(0, 3).map((day, idx) => (
                  <div
                    key={day.date}
                    className={`rounded-xl p-6 border-2 ${
                      idx === 0
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-25 border-yellow-400'
                        : idx === 1
                        ? 'bg-gradient-to-br from-gray-50 to-gray-25 border-gray-400'
                        : 'bg-gradient-to-br from-orange-50 to-orange-25 border-orange-400'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {new Date(day.date).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        スコア: <span className="font-bold text-lg">{day.score}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {day.goodDirections.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <div className="text-xs text-green-800 font-semibold mb-2">
                            吉方位 ({day.goodDirections.length}方位)
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {day.goodDirections.map((dir, i) => (
                              <span key={i} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                {dir}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {day.badDirections.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <div className="text-xs text-red-800 font-semibold mb-2">
                            凶方位 ({day.badDirections.length}方位)
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {day.badDirections.map((dir, i) => (
                              <span key={i} className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                                {dir}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 全期間のカレンダー */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-purple-500 pb-3">
                📅 全期間の分析結果
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.map((day) => (
                  <div
                    key={day.date}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-semibold text-gray-800">
                        {new Date(day.date).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full font-bold ${
                        day.score >= 30 ? 'bg-green-200 text-green-800' :
                        day.score >= 10 ? 'bg-blue-200 text-blue-800' :
                        day.score >= 0 ? 'bg-gray-200 text-gray-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {day.score}pt
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-600">
                          吉: {day.goodDirections.length}方位
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">✗</span>
                        <span className="text-gray-600">
                          凶: {day.badDirections.length}方位
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* アドバイス */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border-l-4 border-indigo-500">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">💡 旅行計画のアドバイス</h2>
              <div className="space-y-3 text-gray-700">
                <p>• <strong>高スコアの日</strong>を選ぶと、多くの方位が吉方位になります</p>
                <p>• 希望方位を選択すると、その方位が吉になる日が優先表示されます</p>
                <p>• 75km以上の移動で方位の影響を受けるとされています</p>
                <p>• 一泊二日以上の滞在が理想的です</p>
                <p>• 凶方位への旅行は避けるか、お祓いなどの対策を検討しましょう</p>
              </div>
            </div>
          </div>
        )}

        {/* 初期メッセージ */}
        {analysis.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">📆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              最適な旅行日を見つけましょう
            </h3>
            <p className="text-gray-600">
              生年月日と旅行予定期間を入力してください。
              <br />
              最も吉方位が多い日をランキング形式で表示します。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
