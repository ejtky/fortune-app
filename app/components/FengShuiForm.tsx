'use client';

import React, { useState } from 'react';
import { FENG_SHUI_PERIODS, MOUNTAIN_DATA } from '@/lib/fortune/directional/flying-star-data';
import { DIRECTIONS, DirectionKey } from '@/lib/fortune/directional/constants';

interface FengShuiFormProps {
  onCalculate: (period: number, sittingMountain: string, facingMountain: string) => void;
}

export default function FengShuiForm({ onCalculate }: FengShuiFormProps) {
  const [period, setPeriod] = useState<number>(9);
  const [facingMountain, setFacingMountain] = useState<string>('午'); // デフォルトは「午」（南の中心）

  // 向（facingMountain）から座（sittingMountain）を計算する（180度反対）
  const getSittingMountain = (fName: string): string => {
    const mountains = Object.values(MOUNTAIN_DATA);
    const facingIndex = mountains.findIndex(m => m.name === fName);
    if (facingIndex === -1) return '子';
    
    // 24山の反対側は (index + 12) % 24
    const sittingIndex = (facingIndex + 12) % 24;
    return mountains[sittingIndex].name;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(period, getSittingMountain(facingMountain), facingMountain);
  };

  // 8方位ごとに24山をグループ化
  const mountainsByDirection: Record<DirectionKey, string[]> = {
    N: ['壬', '子', '癸'],
    NE: ['丑', '艮', '寅'],
    E: ['甲', '卯', '乙'],
    SE: ['辰', '巽', '巳'],
    S: ['丙', '午', '丁'],
    SW: ['未', '坤', '申'],
    W: ['庚', '酉', '辛'],
    NW: ['戌', '乾', '亥'],
    CENTER: []
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-lg space-y-6 max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h4 className="text-stone-800 font-serif font-bold text-lg tracking-wider">玄空飛星 高度鑑定設定</h4>
        <p className="text-[10px] text-stone-500 mt-1">建物の建築年と精密な方位（二十四山）を選択してください</p>
      </div>

      <div className="space-y-6">
        {/* 建築年（運）の選択 */}
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-2 font-serif uppercase tracking-widest">1. 建築時期（三元九運）</label>
          <select 
            value={period} 
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-amber-200 outline-none transition-all shadow-sm"
          >
            {FENG_SHUI_PERIODS.map((p) => (
              <option key={p.period} value={p.period}>
                第{p.period}運 ({p.start}〜{p.end}) {p.period === 9 ? '★現在は第9運' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 向（二十四山）の選択 */}
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-2 font-serif uppercase tracking-widest">2. 建物の正面方位（向：二十四山）</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(mountainsByDirection) as DirectionKey[]).filter(d => d !== 'CENTER').map((d) => (
              <div key={d} className="space-y-1">
                <span className="text-[9px] font-black text-stone-400 block ml-1">{DIRECTIONS[d]}</span>
                <div className="flex flex-col gap-1">
                  {mountainsByDirection[d].map(mName => (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setFacingMountain(mName)}
                      className={`
                        py-1.5 rounded-md text-xs font-bold transition-all border
                        ${facingMountain === mName 
                          ? 'bg-amber-600 text-white border-amber-700 shadow-md transform scale-105 z-10' 
                          : 'bg-white text-stone-600 border-stone-100 hover:border-amber-200'}
                      `}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-stone-800 text-amber-200 font-serif font-bold py-4 rounded-xl shadow-xl hover:bg-stone-900 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>精密飛星盤を生成する</span>
          <span className="text-xl">✨</span>
        </button>
      </div>

      <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 italic">
        <p className="text-[9px] text-amber-800 leading-relaxed text-center font-medium">
          現在選択中の向（正面）: <span className="text-stone-900 font-black">{facingMountain}</span> 山
          <span className="mx-2">→</span>
          座（背面）: <span className="text-stone-900 font-black">{getSittingMountain(facingMountain)}</span> 山
        </p>
      </div>
    </form>
  );
}
