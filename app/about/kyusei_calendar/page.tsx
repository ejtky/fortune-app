'use client';

import { useState } from 'react';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import { calculateDayStar } from '@/lib/fortune/nine-star-ki/calculator';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function KyuseiCalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day();
  const days = [];

  // 前月の埋め
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // 今月の日付
  for (let i = 1; i <= daysInMonth; i++) {
    const date = currentDate.date(i).toDate();
    const dayStar = calculateDayStar(date);
    days.push({ day: i, star: dayStar, date: currentDate.date(i).format('YYYYMMDD') });
  }

  const starColors: Record<number, string> = {
    1: 'bg-blue-500', 2: 'bg-stone-600', 3: 'bg-emerald-500',
    4: 'bg-green-500', 5: 'bg-amber-600', 6: 'bg-gray-400',
    7: 'bg-red-500', 8: 'bg-brown-600', 9: 'bg-purple-600'
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold font-serif text-slate-800 mb-2">九星カレンダー</h1>
          <p className="text-slate-500">毎日の九星を確認して運勢をチェック</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="p-3 hover:bg-slate-50 rounded-lg transition-colors text-slate-600">←</button>
          <span className="font-bold text-lg text-slate-800 w-32 text-center font-serif">{currentDate.format('YYYY年 MM月')}</span>
          <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="p-3 hover:bg-slate-50 rounded-lg transition-colors text-slate-600">→</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
          {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
            <div key={d} className={`py-3 text-center text-xs font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-500'}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => (
            <div key={i} className={`min-h-[100px] p-2 border-b border-r border-slate-100 transition-colors hover:bg-purple-50/50 group relative ${!d ? 'bg-slate-50/30' : ''}`}>
              {d && (
                <>
                  <span className={`text-sm font-bold ${i % 7 === 0 ? 'text-red-500' : i % 7 === 6 ? 'text-blue-500' : 'text-slate-700'}`}>{d.day}</span>
                  <div className="mt-2 text-center">
                    <div className={`inline-block w-2.5 h-2.5 rounded-full mb-1.5 ${starColors[d.star]}`} />
                    <div className="text-[10px] font-bold text-slate-400 leading-none">{STAR_NAMES[d.star]}</div>
                  </div>
                  <Link 
                    href={`/check/ninestar/day/${d.date}`}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/60 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300"
                  >
                    <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-purple-700 shadow-sm border border-purple-100 transform scale-90 group-hover:scale-100 transition-transform">詳細</span>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400">※ 日盤の九星を表示しています。節入り日は考慮済みです。</p>
      </div>
    </div>
  );
}
