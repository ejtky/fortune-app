'use client';

import React from 'react';
import { DirectionKey } from '@/lib/fortune/directional/constants';
import { FlyingStarChart } from '@/lib/fortune/directional/flying-star-data';

interface FlyingStarBoardProps {
  chart: FlyingStarChart;
  title?: string;
}

const DIRECTIONS_LAYOUT: DirectionKey[][] = [
  ['SE', 'S', 'SW'],
  ['E', 'CENTER', 'W'],
  ['NE', 'N', 'NW']
];

const DIR_LABELS: Record<DirectionKey, string> = {
  N: '北', NE: '北東', E: '東', SE: '南東',
  S: '南', SW: '南西', W: '西', NW: '北西',
  CENTER: '中宮'
};

export default function FlyingStarBoard({ chart, title }: FlyingStarBoardProps) {
  const renderCell = (dir: DirectionKey) => {
    const star = chart.stars[dir];
    if (!star) return null;

    const isA旺 = star.facing === chart.period || star.mountain === chart.period;
    
    return (
      <div 
        key={dir}
        className={`relative aspect-square border-2 border-stone-200 p-2 flex flex-col items-center justify-between transition-all duration-500 hover:shadow-inner ${
          dir === 'CENTER' ? 'bg-amber-50/30' : 'bg-white'
        }`}
      >
        {/* 方位ラベル */}
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
          {dir === 'CENTER' ? '' : dir}
        </span>

        {/* 山星・向星（上部） */}
        <div className="flex justify-between w-full px-1">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400">山</span>
            <span className={`text-lg font-serif font-bold ${star.mountain === 5 ? 'text-red-600' : 'text-stone-800'}`}>
              {star.mountain}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400">向</span>
            <span className={`text-lg font-serif font-bold ${star.facing === 5 ? 'text-red-600' : 'text-amber-600'}`}>
              {star.facing}
            </span>
          </div>
        </div>

        {/* 運星（中央） */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-stone-100/60 font-serif">
            {star.base}
          </span>
        </div>

        {/* 漢字方位（下部） */}
        <span className={`text-xs font-bold ${dir === 'CENTER' ? 'text-amber-700' : 'text-stone-500'}`}>
          {DIR_LABELS[dir]}
        </span>

        {/* 装飾 */}
        {isA旺 && (
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-stone-50 p-6 rounded-2xl shadow-xl border border-stone-200">
      {title && (
        <h4 className="text-center text-stone-800 font-serif font-bold mb-6 text-xl tracking-widest">
          {title}
        </h4>
      )}
      
      <div className="grid grid-cols-3 gap-1 bg-stone-200 border-2 border-stone-200 overflow-hidden rounded-lg shadow-inner">
        {DIRECTIONS_LAYOUT.map(row => row.map(dir => renderCell(dir)))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-[11px] text-stone-500 leading-tight">
        <div className="flex items-start gap-2">
          <span className="font-bold text-stone-800">山星:</span>
          <span>健康・人間関係のエネルギー</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-600">向星:</span>
          <span>財運・チャンスのエネルギー</span>
        </div>
      </div>
    </div>
  );
}
