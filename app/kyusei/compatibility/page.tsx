'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import {
  calculateCompatibility,
  getCompatibilityColor,
  getCompatibilityBadgeColor,
  type CompatibilityResult
} from '@/lib/fortune/nine-star-ki/compatibility';

export default function CompatibilityPage() {
  const [star1, setStar1] = useState<number>(1);
  const [star2, setStar2] = useState<number>(5);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const handleCalculate = () => {
    const compatibility = calculateCompatibility(star1, star2);
    setResult(compatibility);
  };

  return (
    <main className="min-h-screen p-0 bg-[#FCFAF2]">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 py-10 px-4 text-center animate-slideInDown">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            💕 九星気学 相性診断
          </h1>
          <p className="text-purple-100 text-lg md:text-xl">
            五行の相生・相剋関係で相性をチェック
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">TOP</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">相性診断</span>
        </nav>

        {/* 説明 */}
        <div className="bg-white p-6 rounded-lg border-2 border-purple-100 mb-8 animate-slideInUp hover-lift">
          <h2 className="text-xl font-bold text-purple-900 mb-3">相性診断とは？</h2>
          <p className="text-gray-700 leading-relaxed">
            九星気学では、五行（木・火・土・金・水）の相生・相剋関係に基づいて相性を判断します。
            <strong>相生</strong>は互いを生み出し高め合う関係、<strong>相剋</strong>は互いを抑制し合う関係です。
            恋愛、友人、ビジネスパートナーなど、様々な人間関係の参考にしてください。
          </p>
        </div>

        {/* 星選択 */}
        <div className="bg-white p-8 rounded-lg border-2 border-purple-200 shadow-sm mb-8 animate-slideInUp hover-glow transition-smooth" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-purple-900 mb-6">星を選択してください</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* 1人目 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                1人目の星
              </label>
              <select
                value={star1}
                onChange={(e) => setStar1(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {STAR_NAMES[num]}
                  </option>
                ))}
              </select>
            </div>

            {/* 2人目 */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                2人目の星
              </label>
              <select
                value={star2}
                onChange={(e) => setStar2(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-bounce shadow-lg text-lg hover-lift active:scale-95"
          >
            相性を診断する
          </button>
        </div>

        {/* 結果表示 */}
        {result && (
          <div className="space-y-6">
            {/* 相性度 */}
            <div className={`p-8 rounded-lg border-2 ${getCompatibilityColor(result.level)} stagger-item shadow-lg`}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-3">{result.title}</h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-2xl font-bold">{result.star1Name}</span>
                  <span className="text-4xl">💫</span>
                  <span className="text-2xl font-bold">{result.star2Name}</span>
                </div>
                <div className="inline-block">
                  <div className="text-6xl font-bold mb-2">{result.percentage}%</div>
                  <div className={`inline-block px-4 py-2 rounded-full ${getCompatibilityBadgeColor(result.level)} text-sm font-semibold`}>
                    {result.relationship}の関係
                  </div>
                </div>
              </div>

              <p className="text-lg leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* 五行の説明 */}
            <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200 stagger-item hover-lift">
              <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">📖</span>
                五行的な解説
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {result.elementalExplanation}
              </p>
            </div>

            {/* 詳細分析 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 強み */}
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 stagger-item hover-lift">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  この相性の強み
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 課題 */}
              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 stagger-item hover-lift">
                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  注意すべき点
                </h3>
                <ul className="space-y-2">
                  {result.challenges.map((challenge, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* アドバイス */}
            <div className="bg-purple-50 p-8 rounded-lg border-2 border-purple-200 stagger-item hover-lift">
              <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                関係を良くするアドバイス
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {result.advice}
              </p>
            </div>

            {/* もう一度診断 */}
            <div className="text-center pt-6">
              <button
                onClick={() => setResult(null)}
                className="inline-block px-8 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-bounce font-medium hover-lift active:scale-95"
              >
                別の組み合わせを診断する
              </button>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        <div className="mt-12 pt-8 border-t border-purple-100 flex justify-between items-center text-sm">
          <Link href="/" className="text-[#4A225D] font-bold hover:underline transition-all">
            ← TOPに戻る
          </Link>
          <p className="text-gray-400">© 2026 Antigravity Fortune App</p>
        </div>
      </div>
    </main>
  );
}
