'use client';

import React from 'react';
import type { LoshuLayout } from '@/lib/fortune/directional/loshu';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import { DIRECTIONS, PALACE_NAMES } from '@/lib/fortune/directional/constants';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';

interface LoshuBoardProps {
  layout: LoshuLayout;
  title: string;
  selectedDirection?: DirectionKey | null;
  onDirectionClick?: (direction: DirectionKey) => void;
}

// 9星のスタイル定義
const STAR_STYLES: Record<number, { text: string; bg: string; border: string }> = {
  1: { text: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' }, // 一白水星 (白/水)
  2: { text: 'text-stone-800', bg: 'bg-stone-50', border: 'border-stone-200' }, // 二黒土星 (黒/土)
  3: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },    // 三碧木星 (碧/木)
  4: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' }, // 四緑木星 (緑/木)
  5: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },// 五黄土星 (黄/土)
  6: { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },    // 六白金星 (白/金)
  7: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },       // 七赤金星 (赤/金)
  8: { text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' }, // 八白土星 (白/土)
  9: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },// 九紫火星 (紫/火)
};

export default function LoshuBoard({ layout, title, selectedDirection, onDirectionClick }: LoshuBoardProps) {
  const getCellClass = (direction: DirectionKey, star: number) => {
    const baseClass = "p-2 rounded-lg cursor-pointer transition-all flex flex-col justify-center items-center min-h-[90px] relative overflow-hidden";
    const styles = STAR_STYLES[star] || { text: 'text-gray-800', bg: 'bg-gray-50', border: 'border-gray-200' };
    const isSelected = selectedDirection === direction;

    if (isSelected) {
      return `${baseClass} bg-white ring-2 ring-purple-500 shadow-lg scale-105 z-10`;
    }
    return `${baseClass} ${styles.bg} border ${styles.border} hover:shadow-md hover:-translate-y-0.5`;
  };

  const getStarStyle = (star: number) => {
     return STAR_STYLES[star] || { text: 'text-gray-800' };
  };

  const renderCell = (direction: DirectionKey) => {
    const star = layout[direction];
    const style = getStarStyle(star);
    
    return (
      <div
        className={getCellClass(direction, star)}
        onClick={() => onDirectionClick?.(direction)}
      >
        <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-medium">{DIRECTIONS[direction]}</div>
        <div className={`font-bold text-lg md:text-xl font-serif ${style.text} my-1`}>{STAR_NAMES[star]}</div>
        <div className="text-[10px] text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">{PALACE_NAMES[direction]}</div>
      </div>
    );
  }

  const centerStar = layout.CENTER;
  const centerStyle = getStarStyle(centerStar);

  return (
    <div className="w-full font-sans">
      <div className="bg-slate-800 text-white py-2 px-4 rounded-t-xl text-center shadow-sm">
        <h3 className="text-lg font-bold font-serif tracking-wider">{title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-b-xl shadow border-x border-b border-slate-200 max-w-md mx-auto aspect-square">
        {/* Row 1 */}
        {renderCell('SE')}
        {renderCell('S')}
        {renderCell('SW')}

        {/* Row 2 */}
        {renderCell('E')}
        {/* Center */}
        <div className={`p-2 rounded-lg flex flex-col justify-center items-center min-h-[90px] border-2 border-double ${centerStyle.border} ${centerStyle.bg}`}>
          <div className="text-[10px] text-gray-500 mb-1">中宮</div>
          <div className={`font-bold text-2xl font-serif ${centerStyle.text}`}>{STAR_NAMES[centerStar]}</div>
        </div>
        {renderCell('W')}

        {/* Row 3 */}
        {renderCell('NE')}
        {renderCell('N')}
        {renderCell('NW')}
      </div>
      <div className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-2">
         <span>💡 タップで方位の詳細を表示</span>
      </div>
    </div>
  );
}
