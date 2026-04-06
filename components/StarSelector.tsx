'use client';

import React from 'react';

interface StarSelectorProps {
  selected: number;
  onChange: (star: number) => void;
  layout?: 'tabs' | 'grid' | 'dropdown';
}

/**
 * 九星を選択するためのコンポーネント
 * 八雲院のUIパターンに基づき、タブ表示、グリッド表示、ドロップダウンをサポート
 */
const StarSelector: React.FC<StarSelectorProps> = ({ selected, onChange, layout = 'tabs' }) => {
  const stars = [
    { id: 1, name: '一白水星', color: '#3B82F6', emoji: '💧' },
    { id: 2, name: '二黒土星', color: '#000000', emoji: '🌍' },
    { id: 3, name: '三碧木星', color: '#10B981', emoji: '🌲' },
    { id: 4, name: '四緑木星', color: '#34D399', emoji: '🍃' },
    { id: 5, name: '五黄土星', color: '#F59E0B', emoji: '👑' },
    { id: 6, name: '六白金星', color: '#9CA3AF', emoji: '⚪' },
    { id: 7, name: '七赤金星', color: '#EF4444', emoji: '🔴' },
    { id: 8, name: '八白土星', color: '#78350F', emoji: '⛰️' },
    { id: 9, name: '九紫火星', color: '#A855F7', emoji: '🔥' },
  ];

  if (layout === 'tabs') {
    return (
      <div className="flex flex-nowrap overflow-x-auto pb-2 scrollbar-none gap-2">
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => onChange(star.id)}
            className={`flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${
              selected === star.id
                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {star.name}
          </button>
        ))}
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => onChange(star.id)}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
              selected === star.id
                ? 'bg-white border-slate-800 shadow-lg ring-2 ring-slate-800/10'
                : 'bg-white/50 border-slate-100 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <span className="text-2xl">{star.emoji}</span>
            <span
              className={`text-[10px] font-bold ${
                selected === star.id ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {star.name.substring(0, 2)}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={selected}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 font-bold text-slate-700"
    >
      {stars.map((star) => (
        <option key={star.id} value={star.id}>
          {star.name}
        </option>
      ))}
    </select>
  );
};

export default StarSelector;
