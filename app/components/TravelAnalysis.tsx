'use client';

import React, { useState } from 'react';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import { DIRECTIONS } from '@/lib/fortune/directional/constants';

interface TravelAnalysisProps {
  directionalReading: DirectionalReading;
}

export default function TravelAnalysis({ directionalReading }: TravelAnalysisProps) {
  const [purpose, setPurpose] = useState<'move' | 'travel' | 'business'>('move');
  const [selectedDirection, setSelectedDirection] = useState<DirectionKey | null>(null);

  const purposeLabels = {
    move: '引っ越し',
    travel: '旅行',
    business: '出張・ビジネス'
  };

  const getRecommendation = () => {
    if (!selectedDirection) {
      return {
        title: '方位を選択してください',
        message: '診断したい方位を選んでください。',
        level: 'neutral' as const
      };
    }

    const analysis = directionalReading.directions.find(d => d.direction === selectedDirection);
    if (!analysis) {
      return {
        title: 'エラー',
        message: '方位情報が見つかりません。',
        level: 'neutral' as const
      };
    }

    // 目的別のアドバイス生成
    let title = '';
    let message = '';
    let level: 'excellent' | 'good' | 'caution' | 'avoid' | 'neutral' = 'neutral';

    if (analysis.quality === 'excellent' || analysis.quality === 'good') {
      level = analysis.quality;
      title = `${DIRECTIONS[selectedDirection]}への${purposeLabels[purpose]}は吉`;
      message = `この方位は${analysis.quality === 'excellent' ? '大吉' : '吉'}方位です。${analysis.reason}\n\n`;

      if (purpose === 'move') {
        message += '引っ越しには最適な方位です。新しい環境で良いスタートを切れるでしょう。';
      } else if (purpose === 'travel') {
        message += '旅行には良い方位です。楽しく充実した時間を過ごせるでしょう。';
      } else {
        message += '出張やビジネスには良い方位です。成果が期待できます。';
      }
    } else if (analysis.quality === 'avoid' || analysis.satsu) {
      level = 'avoid';
      title = `${DIRECTIONS[selectedDirection]}への${purposeLabels[purpose]}は避けるべき`;
      message = `この方位は凶方位です。${analysis.reason}\n\n`;

      if (analysis.satsu) {
        message += `${analysis.satsu.name}にあたります。${analysis.satsu.description}\n\n`;
      }

      if (purpose === 'move') {
        message += '引っ越しは避けた方が良いでしょう。どうしても必要な場合は、方位除けの対策を検討してください。';
      } else if (purpose === 'travel') {
        message += '旅行は別の方位を選ぶか、時期をずらすことをお勧めします。';
      } else {
        message += '出張は可能な限り別の方位を選ぶか、最小限の滞在にとどめてください。';
      }
    } else {
      level = 'caution';
      title = `${DIRECTIONS[selectedDirection]}への${purposeLabels[purpose]}は普通`;
      message = `この方位は${analysis.quality === 'neutral' ? '平凡' : '注意が必要'}です。${analysis.reason}\n\n`;

      if (purpose === 'move') {
        message += '引っ越しは可能ですが、特別な利益は期待できません。慎重に検討してください。';
      } else if (purpose === 'travel') {
        message += '旅行は可能です。特に問題はありませんが、注意深く行動してください。';
      } else {
        message += '出張は可能です。通常通りの対応で問題ありません。';
      }
    }

    return { title, message, level };
  };

  const recommendation = getRecommendation();

  const levelColors = {
    excellent: 'bg-green-50 border-green-500 text-green-900',
    good: 'bg-blue-50 border-blue-500 text-blue-900',
    caution: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    avoid: 'bg-red-50 border-red-500 text-red-900',
    neutral: 'bg-gray-50 border-gray-500 text-gray-900'
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">🧭 引っ越し・旅行診断</h3>
        <p className="text-sm text-gray-600 mb-4">
          特定の方位への移動について、九星気学の観点から診断します。
        </p>
      </div>

      {/* 目的選択 */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">目的を選択</label>
        <div className="flex gap-2">
          {(Object.keys(purposeLabels) as Array<keyof typeof purposeLabels>).map((p) => (
            <button
              key={p}
              onClick={() => setPurpose(p)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                purpose === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {purposeLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* 方位選択 */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">方位を選択</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(DIRECTIONS) as DirectionKey[]).map((dir) => {
            const analysis = directionalReading.directions.find(d => d.direction === dir);
            const isSelected = selectedDirection === dir;

            return (
              <button
                key={dir}
                onClick={() => setSelectedDirection(dir)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-700 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow'
                }`}
              >
                <div className="font-bold text-sm">{DIRECTIONS[dir]}</div>
                {analysis && (
                  <div className="text-xs mt-1">
                    スコア: {analysis.score}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 診断結果 */}
      <div className={`p-6 border-2 rounded-lg ${levelColors[recommendation.level]}`}>
        <h4 className="text-lg font-bold mb-3">{recommendation.title}</h4>
        <p className="whitespace-pre-line text-sm leading-relaxed">{recommendation.message}</p>
      </div>

      {/* 補足情報 */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h5 className="font-semibold text-purple-900 mb-2">📌 補足情報</h5>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• 吉方位への移動は、運気を高める効果があるとされています</li>
          <li>• 凶方位への移動は避けるか、方位除けを検討してください</li>
          <li>• 重要な移動は、複数の要素を総合的に判断することをお勧めします</li>
          <li>• 伝統的な九星気学の教えに基づいた診断です</li>
        </ul>
      </div>
    </div>
  );
}
