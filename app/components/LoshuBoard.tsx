'use client';

import React from 'react';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import { DIRECTIONS, PALACE_NAMES } from '@/lib/fortune/directional/constants';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import type { FlyingStarChart } from '@/lib/fortune/directional/flying-star-data';

interface LoshuBoardProps {
  layout: Record<DirectionKey, number>;
  title: string;
  selectedDirection?: DirectionKey | null;
  onDirectionClick?: (direction: DirectionKey) => void;
  flyingStarChart?: FlyingStarChart | null;
}

const STAR_STYLES: Record<number, { text: string; bg: string; border: string }> = {
  1: { text: 'text-blue-900', bg: 'bg-blue-50/50', border: 'border-blue-200' },
  2: { text: 'text-stone-900', bg: 'bg-stone-50/50', border: 'border-stone-200' },
  3: { text: 'text-green-900', bg: 'bg-green-50/50', border: 'border-green-200' },
  4: { text: 'text-emerald-900', bg: 'bg-emerald-50/50', border: 'border-emerald-200' },
  5: { text: 'text-amber-900', bg: 'bg-amber-50/50', border: 'border-amber-200' },
  6: { text: 'text-slate-800', bg: 'bg-slate-50/50', border: 'border-slate-200' },
  7: { text: 'text-rose-900', bg: 'bg-rose-50/50', border: 'border-rose-200' },
  8: { text: 'text-orange-900', bg: 'bg-orange-50/50', border: 'border-orange-200' },
  9: { text: 'text-purple-900', bg: 'bg-purple-50/50', border: 'border-purple-200' },
};

export default function LoshuBoard({ layout, title, selectedDirection, onDirectionClick, flyingStarChart }: LoshuBoardProps) {
  const renderCell = (direction: DirectionKey) => {
    const star = layout[direction];
    const isSelected = selectedDirection === direction;
    const flyingStars = flyingStarChart?.stars[direction];
    
    // プレミアムな和柄の背景テクスチャを演出
    const cellBaseClass = `
      relative p-3 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-between min-h-[110px]
      backdrop-blur-sm shadow-sm border
      ${isSelected ? 'bg-white ring-2 ring-amber-400 shadow-xl scale-105 z-10' : 'bg-stone-50/80 border-stone-200 hover:bg-white/90 hover:shadow-md'}
    `;

    return (
      <div className={cellBaseClass} onClick={() => onDirectionClick?.(direction)}>
        {/* 方位と宮名 */}
        <div className="flex justify-between w-full text-[10px] font-bold text-stone-500 font-serif">
          <span>{DIRECTIONS[direction]}</span>
          <span>{PALACE_NAMES[direction]}</span>
        </div>

        {/* 玄空飛星の表示 (山星・向星) */}
        {flyingStars ? (
          <div className="flex justify-between w-full items-start px-1 mt-1">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-stone-400">山</span>
              <span className="text-sm font-bold text-red-700">{flyingStars.mountain}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-stone-400">向</span>
              <span className="text-sm font-bold text-blue-700">{flyingStars.facing}</span>
            </div>
          </div>
        ) : <div className="h-6" />}

        {/* 九星気学のメイン星 */}
        <div className="flex flex-col items-center py-1">
          <div className="text-2xl font-black font-serif text-stone-800 drop-shadow-sm leading-tight">
            {star}
          </div>
          <div className="text-[9px] text-stone-500 font-medium">
            {STAR_NAMES[star]}
          </div>
        </div>

        {/* 玄空飛星の表示 (運星) */}
        {flyingStars && (
          <div className="absolute bottom-2 right-2 text-[10px] bg-white/50 px-1.5 rounded border border-stone-100 font-bold text-stone-600">
            {flyingStars.base}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-stone-100 to-stone-200 border-2 border-stone-300 shadow-2xl">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-200 to-amber-600 opacity-80" />
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold font-serif tracking-widest text-stone-800 border-b border-stone-300 pb-2 inline-block">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Row 1 */}
          {renderCell('SE')}
          {renderCell('S')}
          {renderCell('SW')}

          {/* Row 2 */}
          {renderCell('E')}
          {renderCell('CENTER')}
          {renderCell('W')}

          {/* Row 3 */}
          {renderCell('NE')}
          {renderCell('N')}
          {renderCell('NW')}
        </div>

        <div className="mt-4 flex justify-center items-center gap-4 text-[10px] text-stone-500 font-serif font-bold">
           <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-700 rounded-full"/> 山：人間関係</div>
           <div className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-700 rounded-full"/> 向：財運・成功</div>
        </div>
      </div>
    </div>
  );
}
