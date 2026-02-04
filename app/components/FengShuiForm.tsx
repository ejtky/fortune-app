'use client';

import React, { useState } from 'react';
import { FENG_SHUI_PERIODS } from '@/lib/fortune/directional/flying-star-data';
import { DIRECTIONS, DirectionKey } from '@/lib/fortune/directional/constants';

interface FengShuiFormProps {
  onCalculate: (period: number, sitting: DirectionKey, facing: DirectionKey) => void;
}

export default function FengShuiForm({ onCalculate }: FengShuiFormProps) {
  const [period, setPeriod] = useState<number>(9);
  const [facing, setFacing] = useState<DirectionKey>('S');

  // 向（facing）から座（sitting）を計算する（180度反対）
  const getSitting = (f: DirectionKey): DirectionKey => {
    const opposites: Record<string, DirectionKey> = {
      N: 'S', S: 'N', E: 'W', W: 'E',
      NE: 'SW', SW: 'NE', SE: 'NW', NW: 'SE'
    };
    return opposites[f] || 'N';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(period, getSitting(facing), facing);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-lg space-y-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h4 className="text-stone-800 font-serif font-bold text-lg tracking-wider">玄空飛星 風水鑑定設定</h4>
        <p className="text-[10px] text-stone-500 mt-1">建物の建築年と正面方位を入力してください</p>
      </div>

      <div className="space-y-4">
        {/* 建築年（運）の選択 */}
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-2 font-serif">建築年（三元九運）</label>
          <select 
            value={period} 
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
          >
            {FENG_SHUI_PERIODS.map((p) => (
              <option key={p.period} value={p.period}>
                第{p.period}運 ({p.start}〜{p.end}) {p.period === 9 ? '※現在' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 向（正面方位）の選択 */}
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-2 font-serif">建物の正面方位（向）</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(DIRECTIONS) as DirectionKey[]).filter(d => d !== 'CENTER').map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setFacing(d)}
                className={`
                  py-2 rounded-lg text-xs font-bold transition-all border
                  ${facing === d 
                    ? 'bg-amber-600 text-white border-amber-700 shadow-inner' 
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}
                `}
              >
                {DIRECTIONS[d]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-stone-800 to-stone-700 text-amber-200 font-serif font-bold py-3 rounded-xl shadow-lg hover:from-stone-900 transition-all active:scale-95"
      >
        風水盤を生成する
      </button>

      <p className="text-[9px] text-stone-400 leading-relaxed text-center">
        ※飛星の順行・逆行は簡易計算ロジックに基づいています。<br/>
        本格的な鑑定には24山（詳細方位）の測定が必要です。
      </p>
    </form>
  );
}
