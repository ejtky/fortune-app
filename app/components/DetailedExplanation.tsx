'use client';

import React from 'react';
import type { DirectionAnalysis } from '@/lib/fortune/directional/calculator';
import { generateDetailedExplanation, BOARD_EXPLANATIONS } from '@/lib/fortune/directional/explanations';

interface DetailedExplanationProps {
  analysis: DirectionAnalysis;
  honmeiStar: number;
  boardType?: 'year' | 'month' | 'day';
}

export default function DetailedExplanation({ analysis, honmeiStar, boardType = 'year' }: DetailedExplanationProps) {
  const explanation = generateDetailedExplanation(analysis, honmeiStar);
  const boardInfo = BOARD_EXPLANATIONS[boardType];

  return (
    <div className="space-y-6">
      {/* 見出し */}
      <div className="border-b-2 border-purple-200 pb-4">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">
          {analysis.directionName}方位の詳細解説
        </h2>
        <p className="text-sm text-gray-600">
          伝統的な九星気学の教えに基づく本質的な解説
        </p>
      </div>

      {/* 盤の説明 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          {boardInfo.title}について
        </h3>
        <p className="text-sm text-gray-700 mb-3">{boardInfo.meaning}</p>
        <div className="bg-white bg-opacity-60 p-3 rounded">
          <p className="text-sm font-semibold text-indigo-800 mb-2">重要性: {boardInfo.importance}</p>
          <p className="text-xs text-gray-600 mb-2">有効期間: {boardInfo.duration}</p>
          <div className="text-xs text-gray-700">
            <p className="font-semibold mb-1">主な用途:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {boardInfo.usage.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs italic text-indigo-700 mt-3 border-t border-indigo-200 pt-2">
            {boardInfo.traditional}
          </p>
        </div>
      </div>

      {/* 方位の本質 */}
      <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">🌟</span>
          方位の本質
        </h3>
        <p className="text-sm text-gray-800 leading-relaxed">{explanation.essence}</p>
        <p className="text-sm text-gray-700 mt-3 italic border-l-4 border-purple-400 pl-3">
          {explanation.traditionalWisdom}
        </p>
      </div>

      {/* 五行の関係分析 */}
      <div className="bg-white p-5 rounded-lg border-2 border-blue-200 shadow-sm">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">☯️</span>
          五行の関係性
        </h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {explanation.elementAnalysis}
          </p>
        </div>
      </div>

      {/* 吉方位の場合 */}
      {explanation.luckyAspect && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-2 border-green-300">
          <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            吉方位のエネルギー
          </h3>
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {explanation.luckyAspect}
          </p>
        </div>
      )}

      {/* 殺の詳細説明 */}
      {explanation.satsuExplanation && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-lg border-2 border-red-300">
          <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            凶殺の詳細
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {explanation.satsuExplanation}
            </p>
          </div>
        </div>
      )}

      {/* 推奨事項 */}
      <div className={`p-5 rounded-lg border-2 ${
        analysis.score >= 60
          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'
          : analysis.score >= 40
          ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300'
          : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300'
      }`}>
        <h3 className={`text-lg font-bold mb-3 flex items-center ${
          analysis.score >= 60 ? 'text-blue-900' : analysis.score >= 40 ? 'text-yellow-900' : 'text-orange-900'
        }`}>
          <span className="text-2xl mr-2">💡</span>
          推奨事項
        </h3>
        <p className="text-sm text-gray-800 leading-relaxed font-semibold">
          {explanation.recommendation}
        </p>
      </div>

      {/* スコア表示 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-purple-900">総合スコア</h3>
          <div className="text-4xl font-bold" style={{
            color: analysis.score >= 80 ? '#10b981' :
                   analysis.score >= 60 ? '#3b82f6' :
                   analysis.score >= 40 ? '#6b7280' :
                   analysis.score >= 20 ? '#f59e0b' : '#ef4444'
          }}>
            {analysis.score}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${analysis.score}%`,
              backgroundColor:
                analysis.score >= 80 ? '#10b981' :
                analysis.score >= 60 ? '#3b82f6' :
                analysis.score >= 40 ? '#6b7280' :
                analysis.score >= 20 ? '#f59e0b' : '#ef4444'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>凶</span>
          <span>中</span>
          <span>吉</span>
        </div>
      </div>

      {/* 伝統的な教え */}
      <div className="bg-amber-50 p-5 rounded-lg border border-amber-300">
        <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">📜</span>
          古典の教え
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed italic">
          方位学は古来より「吉方取り」として重視されてきました。吉方位への移動は運気を高め、
          凶方位への移動は災いを招くとされています。特に人生の重要な決断においては、
          年盤の吉凶を慎重に見極めることが肝要です。
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3 border-t border-amber-200 pt-3">
          「吉方に向かえば天の助けあり、凶方に向かえば天の咎めあり」- 九星気学の古典より
        </p>
      </div>
    </div>
  );
}
