'use client';

import React, { useState } from 'react';
import type { DirectionAnalysis } from '@/lib/fortune/directional/calculator';
import { QUALITY_COLORS } from '@/lib/fortune/directional/constants';
import DetailedExplanation from './DetailedExplanation';

interface DirectionListProps {
  directions: DirectionAnalysis[];
  honmeiStar: number;
  boardType?: 'year' | 'month' | 'day';
  onDirectionSelect?: (direction: string) => void;
}

export default function DirectionList({ directions, honmeiStar, boardType = 'year', onDirectionSelect }: DirectionListProps) {
  const [selectedDirection, setSelectedDirection] = useState<DirectionAnalysis | null>(null);

  // スコア順にソート
  const sortedDirections = [...directions].sort((a, b) => b.score - a.score);

  const getQualityBadge = (quality: DirectionAnalysis['quality']) => {
    const labels = {
      excellent: '大吉',
      good: '吉',
      neutral: '平',
      caution: '注意',
      avoid: '凶'
    };

    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      neutral: 'bg-gray-100 text-gray-800',
      caution: 'bg-yellow-100 text-yellow-800',
      avoid: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[quality]}`}>
        {labels[quality]}
      </span>
    );
  };

  const handleDirectionClick = (dir: DirectionAnalysis) => {
    setSelectedDirection(selectedDirection?.direction === dir.direction ? null : dir);
    onDirectionSelect?.(dir.direction);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-800 mb-4">方位別吉凶一覧</h3>
      {sortedDirections.map((dir) => (
        <div key={dir.direction}>
          <div
            className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
              selectedDirection?.direction === dir.direction ? 'ring-2 ring-purple-400' : ''
            }`}
            style={{ borderLeftColor: QUALITY_COLORS[dir.quality] }}
            onClick={() => handleDirectionClick(dir)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-lg text-gray-800">{dir.directionName}</h4>
                {getQualityBadge(dir.quality)}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold" style={{ color: QUALITY_COLORS[dir.quality] }}>
                  {dir.score}
                </div>
                <span className="text-sm text-gray-500">
                  {selectedDirection?.direction === dir.direction ? '▼' : '▶'}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              {dir.reason}
            </div>

            {dir.satsu && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <div className="text-xs font-semibold text-red-800">⚠️ {dir.satsu.name}</div>
                <div className="text-xs text-red-600">{dir.satsu.description}</div>
              </div>
            )}

            {dir.isLucky && !dir.satsu && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <div className="text-xs font-semibold text-green-800">✨ 吉方位</div>
                <div className="text-xs text-green-600">この方位への移動や新規事業に適しています</div>
              </div>
            )}

            {selectedDirection?.direction === dir.direction && (
              <div className="mt-2 text-xs text-purple-600 font-semibold">
                クリックして詳細を閉じる / 下にスクロールして詳細を表示
              </div>
            )}
          </div>

          {/* 詳細説明 */}
          {selectedDirection?.direction === dir.direction && (
            <div className="mt-4 bg-gray-50 p-6 rounded-lg border-2 border-purple-300 shadow-lg">
              <DetailedExplanation
                analysis={dir}
                honmeiStar={honmeiStar}
                boardType={boardType}
              />
            </div>
          )}
        </div>
      ))}

      {/* 説明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 ヒント:</span> 各方位をクリックすると、伝統的な九星気学に基づく詳細な解説が表示されます。
          五行の相生・相剋関係や、殺の本質的な意味を理解することで、より深い判断ができます。
        </p>
      </div>
    </div>
  );
}
