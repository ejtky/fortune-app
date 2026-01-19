'use client';

import { useState } from 'react';
import { diagnoseNineStar, NINE_STARS, type NineStarNumber } from '@/lib/fortune/nine-star-calculator';
import { calculateFortunePrediction, type FortuneLevel } from '@/lib/fortune/fortune-prediction';
import type { FortunePrediction } from '@/lib/fortune/fortune-prediction';

export default function FortunePage() {
  const [birthDate, setBirthDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [prediction, setPrediction] = useState<FortunePrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    if (!birthDate) {
      alert('生年月日を入力してください');
      return;
    }

    setLoading(true);

    try {
      const birth = new Date(birthDate);
      const diagnosis = diagnoseNineStar(birth);
      const target = new Date(selectedDate);
      const result = calculateFortunePrediction(target, diagnosis.mainStar.number);

      setPrediction(result);
    } catch (error) {
      console.error('運勢予測エラー:', error);
      alert('運勢予測中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // レベルに応じた色を取得
  const getLevelColor = (level: FortuneLevel) => {
    const colors: Record<FortuneLevel, string> = {
      excellent: 'from-green-500 to-green-600',
      good: 'from-blue-500 to-blue-600',
      normal: 'from-gray-500 to-gray-600',
      caution: 'from-orange-500 to-orange-600',
      bad: 'from-red-500 to-red-600',
    };
    return colors[level];
  };

  const getLevelBg = (level: FortuneLevel) => {
    const colors: Record<FortuneLevel, string> = {
      excellent: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300',
      good: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300',
      normal: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300',
      caution: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300',
      bad: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300',
    };
    return colors[level];
  };

  const getLevelEmoji = (level: FortuneLevel) => {
    const emojis: Record<FortuneLevel, string> = {
      excellent: '🌟',
      good: '😊',
      normal: '😐',
      caution: '⚠️',
      bad: '💀',
    };
    return emojis[level];
  };

  const getLevelLabel = (level: FortuneLevel) => {
    const labels: Record<FortuneLevel, string> = {
      excellent: '大吉',
      good: '吉',
      normal: '平',
      caution: '小凶',
      bad: '凶',
    };
    return labels[level];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            運勢予測
          </h1>
          <p className="text-gray-600 text-lg">
            今日・今月・今年の運勢を九星気学で占います
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                占う日付
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || !birthDate}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? '占い中...' : '運勢を占う'}
          </button>
        </div>

        {/* 運勢結果 */}
        {prediction && (
          <div className="space-y-6">
            {/* 総合運勢 */}
            <div className={`rounded-2xl shadow-2xl p-8 border-2 ${getLevelBg(prediction.overall.level)}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {getLevelEmoji(prediction.overall.level)} {prediction.overall.title}
                  </h2>
                  <div className="text-sm text-gray-600">
                    本命星: {NINE_STARS[prediction.honmeiStar]}
                  </div>
                </div>
                <div className={`text-5xl font-bold bg-gradient-to-r ${getLevelColor(prediction.overall.level)} bg-clip-text text-transparent`}>
                  {prediction.overall.score}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">{prediction.overall.description}</p>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="font-semibold text-gray-800 mb-2">💡 アドバイス</div>
                  <p className="text-gray-700">{prediction.overall.advice}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/80 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">ラッキーカラー</div>
                    <div className="font-bold text-gray-800">{prediction.overall.luckyColor}</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">ラッキー方位</div>
                    <div className="font-bold text-gray-800">{prediction.overall.luckyDirection}</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1">ラッキーナンバー</div>
                    <div className="font-bold text-gray-800">{prediction.overall.luckyNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 日運・月運・年運 */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* 日運 */}
              <div className={`rounded-xl shadow-lg p-6 border-2 ${getLevelBg(prediction.daily.level)}`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getLevelEmoji(prediction.daily.level)}</div>
                  <h3 className="text-xl font-bold text-gray-800">{prediction.daily.title}</h3>
                  <div className={`text-3xl font-bold mt-2 bg-gradient-to-r ${getLevelColor(prediction.daily.level)} bg-clip-text text-transparent`}>
                    {prediction.daily.score}
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">{prediction.daily.description}</p>
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="font-semibold text-gray-800 text-xs mb-1">アドバイス</div>
                    <p className="text-gray-700">{prediction.daily.advice}</p>
                  </div>
                </div>
              </div>

              {/* 月運 */}
              <div className={`rounded-xl shadow-lg p-6 border-2 ${getLevelBg(prediction.monthly.level)}`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getLevelEmoji(prediction.monthly.level)}</div>
                  <h3 className="text-xl font-bold text-gray-800">{prediction.monthly.title}</h3>
                  <div className={`text-3xl font-bold mt-2 bg-gradient-to-r ${getLevelColor(prediction.monthly.level)} bg-clip-text text-transparent`}>
                    {prediction.monthly.score}
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">{prediction.monthly.description}</p>
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="font-semibold text-gray-800 text-xs mb-1">アドバイス</div>
                    <p className="text-gray-700">{prediction.monthly.advice}</p>
                  </div>
                </div>
              </div>

              {/* 年運 */}
              <div className={`rounded-xl shadow-lg p-6 border-2 ${getLevelBg(prediction.yearly.level)}`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getLevelEmoji(prediction.yearly.level)}</div>
                  <h3 className="text-xl font-bold text-gray-800">{prediction.yearly.title}</h3>
                  <div className={`text-3xl font-bold mt-2 bg-gradient-to-r ${getLevelColor(prediction.yearly.level)} bg-clip-text text-transparent`}>
                    {prediction.yearly.score}
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">{prediction.yearly.description}</p>
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="font-semibold text-gray-800 text-xs mb-1">アドバイス</div>
                    <p className="text-gray-700">{prediction.yearly.advice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 説明 */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-orange-900 mb-4">📖 運勢の見方</h3>
              <div className="space-y-3 text-gray-700">
                <p>• <strong>総合運勢</strong>：日運・月運・年運を総合的に判断した運勢です（日運70%、月運20%、年運10%）</p>
                <p>• <strong>日運</strong>：今日一日の運勢。短期的な行動の参考にしてください</p>
                <p>• <strong>月運</strong>：今月全体の運勢。月間の計画に役立てましょう</p>
                <p>• <strong>年運</strong>：今年一年の運勢。長期的な目標設定の参考にしてください</p>
                <p>• <strong>運勢レベル</strong>：大吉（80点以上）、吉（60-79点）、平（40-59点）、小凶（20-39点）、凶（20点未満）</p>
                <p>• スコアは0-100で表示され、高いほど運気が良いことを示します</p>
                <p>• 九星盤の移動に基づいて、吉方位と凶方位の数から判定しています</p>
              </div>
            </div>
          </div>
        )}

        {/* 初期メッセージ */}
        {!prediction && !loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">🔮</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              あなたの運勢を占います
            </h3>
            <p className="text-gray-600">
              生年月日と占いたい日付を入力してください。
              <br />
              九星気学に基づいて、詳しい運勢をお伝えします。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
