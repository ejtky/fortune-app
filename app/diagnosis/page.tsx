'use client';

import { useState } from 'react';
import { diagnoseNineStar, type NineStarDiagnosis } from '@/lib/fortune/nine-star-calculator';
import { getStarKnowledge, getRelatedStarEntries, type KnowledgeEntry } from '@/lib/fortune/admin-api';

export default function DiagnosisPage() {
  const [birthDate, setBirthDate] = useState('');
  const [diagnosis, setDiagnosis] = useState<NineStarDiagnosis | null>(null);
  const [mainStarKnowledge, setMainStarKnowledge] = useState<KnowledgeEntry | null>(null);
  const [monthlyStarKnowledge, setMonthlyStarKnowledge] = useState<KnowledgeEntry | null>(null);
  const [relatedKnowledge, setRelatedKnowledge] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async () => {
    if (!birthDate) {
      alert('生年月日を入力してください');
      return;
    }

    setLoading(true);

    try {
      // 九星診断を実行
      const date = new Date(birthDate);
      const result = diagnoseNineStar(date);
      setDiagnosis(result);

      // 知識ベースから情報を取得
      const mainKnowledge = await getStarKnowledge(result.mainStar.name);
      const monthlyKnowledge = await getStarKnowledge(result.monthlyStar.name);
      const related = await getRelatedStarEntries(result.mainStar.number);

      setMainStarKnowledge(mainKnowledge);
      setMonthlyStarKnowledge(monthlyKnowledge);
      setRelatedKnowledge(related);
    } catch (error) {
      console.error('診断エラー:', error);
      alert('診断中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            九星気学診断
          </h1>
          <p className="text-gray-600 text-lg">
            生年月日からあなたの本命星・月命星を診断します
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-lg">
              生年月日を入力してください
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all text-lg"
            />
          </div>

          <button
            onClick={handleDiagnose}
            disabled={loading || !birthDate}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? '診断中...' : '診断する'}
          </button>
        </div>

        {/* 診断結果 */}
        {diagnosis && (
          <div className="space-y-8">
            {/* 基本情報 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-purple-500 pb-3">
                診断結果
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 本命星 */}
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 border-2 border-purple-300">
                  <div className="text-sm text-purple-700 font-semibold mb-2">本命星</div>
                  <div className="text-4xl font-bold text-purple-900 mb-3">
                    {diagnosis.mainStar.name}
                  </div>
                  <div className="text-purple-700 mb-2">
                    五行：<span className="font-semibold">{diagnosis.mainStar.element}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {diagnosis.mainStar.description}
                  </p>
                </div>

                {/* 月命星 */}
                <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-6 border-2 border-pink-300">
                  <div className="text-sm text-pink-700 font-semibold mb-2">月命星</div>
                  <div className="text-4xl font-bold text-pink-900 mb-3">
                    {diagnosis.monthlyStar.name}
                  </div>
                  <div className="text-pink-700 mb-2">
                    五行：<span className="font-semibold">{diagnosis.monthlyStar.element}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {diagnosis.monthlyStar.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="text-blue-900 text-center">
                  <span className="font-semibold">現在の年齢：</span>
                  <span className="text-2xl font-bold ml-2">{diagnosis.age}歳</span>
                </div>
              </div>
            </div>

            {/* 本命星の詳細知識 */}
            {mainStarKnowledge && (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-purple-500 pb-3">
                  {mainStarKnowledge.title}
                </h2>

                {mainStarKnowledge.summary && (
                  <div className="bg-purple-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
                    <p className="text-lg text-gray-800 font-semibold">
                      {mainStarKnowledge.summary}
                    </p>
                  </div>
                )}

                <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {mainStarKnowledge.content}
                </div>

                {mainStarKnowledge.traditional_wisdom && (
                  <div className="mt-6 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                    <h3 className="text-xl font-bold text-amber-900 mb-3">伝統的知恵</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {mainStarKnowledge.traditional_wisdom}
                    </p>
                  </div>
                )}

                {mainStarKnowledge.keywords && mainStarKnowledge.keywords.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {mainStarKnowledge.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 関連知識 */}
            {relatedKnowledge.length > 0 && (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-500 pb-3">
                  関連する知識
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {relatedKnowledge.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-gradient-to-br from-blue-50 to-blue-25 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
                    >
                      <h3 className="text-xl font-bold text-blue-900 mb-3">
                        {entry.title}
                      </h3>
                      {entry.summary && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {entry.summary}
                        </p>
                      )}
                      <div className="mt-4 text-blue-600 text-sm font-semibold">
                        {'⭐'.repeat(entry.importance_level)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 初期メッセージ */}
        {!diagnosis && !loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">🔮</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              あなたの運命を診断します
            </h3>
            <p className="text-gray-600">
              生年月日を入力して、診断ボタンを押してください。
              <br />
              本命星・月命星から、あなたの本質と運勢をお伝えします。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
