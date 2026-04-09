'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import {
  calculateYearFortune,
  calculateYearStar,
  getFortuneLevelColor,
  getFortuneLevelLabel,
  type YearFortune,
  type FortuneLevel
} from '@/lib/fortune/nine-star-ki/year-month-fortune';

export default function YearFortunePage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [userStar, setUserStar] = useState<number>(1);
  const [yearFortune, setYearFortune] = useState<YearFortune | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = useCallback(() => {
    try {
      setIsCalculating(true);
      console.log('=== handleCalculate called ===');
      console.log('Calculating fortune for year:', selectedYear, 'star:', userStar);
      const fortune = calculateYearFortune(selectedYear, userStar);
      console.log('Fortune calculated:', fortune);
      setYearFortune(fortune);
      setExpandedMonth(null);
      alert(`計算完了: ${selectedYear}年, ${STAR_NAMES[userStar]}`);
    } catch (error) {
      console.error('Error calculating fortune:', error);
      alert('エラー: ' + error);
    } finally {
      setIsCalculating(false);
    }
  }, [selectedYear, userStar]);

  useEffect(() => {
    // 初回表示時に計算
    handleCalculate();
  }, [handleCalculate]);

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <main className="min-h-screen p-0 bg-[#FCFAF2]">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📅 年運・月運カレンダー
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl">
            九星気学で見る一年の運勢
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">TOP</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">年運・月運</span>
        </nav>

        {/* 説明 */}
        <div className="bg-white p-6 rounded-lg border-2 border-indigo-100 mb-8">
          <h2 className="text-xl font-bold text-indigo-900 mb-3">年運・月運とは？</h2>
          <p className="text-gray-700 leading-relaxed">
            九星気学では、毎年・毎月ごとに中宮（中心）に入る星が変わり、それに伴って各方位の吉凶が変化します。
            あなたの本命星と各月の中宮星の関係から、その月の運勢や吉方位を知ることができます。
            引っ越しや旅行、新規事業の開始など、重要な決断の際の参考にしてください。
          </p>
        </div>

        {/* 設定パネル */}
        <div className="bg-white p-8 rounded-lg border-2 border-indigo-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">設定</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 年選択 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                診断する年
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>

            {/* 本命星選択 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                あなたの本命星
              </label>
              <select
                value={userStar}
                onChange={(e) => setUserStar(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {STAR_NAMES[num]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? '計算中...' : '年運を診断する'}
          </button>
        </div>

        {/* 結果表示 */}
        {yearFortune && (
          <div className="space-y-6 animate-slideInUp">
            {/* 年運総合 */}
            <div className={`p-8 rounded-lg border-2 shadow-lg ${getFortuneLevelColor(yearFortune.overallLevel)}`}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-3">{selectedYear}年の運勢</h2>
                <div className="mb-4">
                  <div className="text-5xl font-bold mb-2">{yearFortune.centerStarName}</div>
                  <div className="text-xl text-gray-700">が中宮に入る年</div>
                </div>
                <div className="inline-block px-6 py-3 bg-white rounded-full shadow-sm">
                  <div className="text-3xl font-bold">{getFortuneLevelLabel(yearFortune.overallLevel)}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">年のテーマ</h3>
                <p className="text-lg">{yearFortune.yearTheme}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">年間のアドバイス</h3>
                <p className="text-lg leading-relaxed">{yearFortune.annualAdvice}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">🌟 運気の良い月</h3>
                  <div className="flex flex-wrap gap-2">
                    {yearFortune.luckyMonths.map((month) => (
                      <span key={month} className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                        {month}月
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">⚠️ 注意が必要な月</h3>
                  <div className="flex flex-wrap gap-2">
                    {yearFortune.cautionMonths.map((month) => (
                      <span key={month} className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">
                        {month}月
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 月運カレンダー */}
            <div className="bg-white p-6 rounded-lg border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">📆 月ごとの運勢</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {yearFortune.monthlyFortunes.map((monthFortune) => (
                  <div
                    key={monthFortune.month}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                      expandedMonth === monthFortune.month
                        ? 'ring-2 ring-indigo-500'
                        : ''
                    } ${getFortuneLevelColor(monthFortune.overallLevel)}`}
                    onClick={() => setExpandedMonth(
                      expandedMonth === monthFortune.month ? null : monthFortune.month
                    )}
                  >
                    <div className="text-center mb-2">
                      <div className="text-2xl font-bold">{monthFortune.month}月</div>
                      <div className="text-sm font-semibold">{monthFortune.centerStarName}</div>
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-bold shadow-sm">
                        {getFortuneLevelLabel(monthFortune.overallLevel)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 選択した月の詳細 */}
              {expandedMonth && yearFortune.monthlyFortunes[expandedMonth - 1] && (
                <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-300 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                    {expandedMonth}月の詳細
                  </h3>

                  {(() => {
                    const mf = yearFortune.monthlyFortunes[expandedMonth - 1];
                    return (
                      <>
                        <div className="mb-4">
                          <div className="text-lg font-semibold text-gray-800 mb-2">月のテーマ</div>
                          <p className="text-gray-700">{mf.keyTheme}</p>
                        </div>

                        <div className="mb-4">
                          <div className="text-lg font-semibold text-gray-800 mb-2">アドバイス</div>
                          <p className="text-gray-700">{mf.advice}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-lg font-semibold text-gray-800 mb-2">✨ 吉方位</div>
                            <div className="flex flex-wrap gap-2">
                              {mf.luckyDirections.map((dir) => (
                                <span key={dir} className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                                  {dir}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-800 mb-2">⚠️ 凶方位</div>
                            <div className="flex flex-wrap gap-2">
                              {mf.cautionDirections.map((dir) => (
                                <span key={dir} className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">
                                  {dir}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 方位別詳細 */}
                        <div className="mt-6">
                          <div className="text-lg font-semibold text-gray-800 mb-3">🧭 方位別の運勢</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {mf.directionalFortunes.map((df) => (
                              <div
                                key={df.direction}
                                className={`p-3 rounded-lg border ${getFortuneLevelColor(df.level)}`}
                              >
                                <div className="text-center font-bold mb-1">{df.direction}</div>
                                <div className="text-xs text-center mb-1">{df.starName}</div>
                                <div className="text-center">
                                  <span className="text-xs px-2 py-1 bg-white rounded-full">
                                    {getFortuneLevelLabel(df.level)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* 年間方位チャート情報 */}
            <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                方位の見方
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">●</span>
                  <span><strong>大吉・吉：</strong>積極的に活用できる方位です。旅行や引っ越しに最適。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">●</span>
                  <span><strong>中吉：</strong>通常の行動で問題ありません。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">●</span>
                  <span><strong>小凶：</strong>できれば避けたい方位。やむを得ない場合は慎重に。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">●</span>
                  <span><strong>凶：</strong>重要な決断や移動は避けましょう。</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        <div className="mt-12 pt-8 border-t border-indigo-100 flex justify-between items-center text-sm">
          <Link href="/" className="text-[#4A225D] font-bold hover:underline transition-all">
            ← TOPに戻る
          </Link>
          <p className="text-gray-400">© 2026 Antigravity Fortune App</p>
        </div>
      </div>
    </main>
  );
}
