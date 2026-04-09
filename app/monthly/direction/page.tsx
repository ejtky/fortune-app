'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import StarSelector from '@/components/StarSelector';
import { Calendar, Compass, ArrowRight, Info, MapPin } from 'lucide-react';

export default function MonthlyDirectionPage() {
  const [selectedHonmei, setSelectedHonmei] = useState(1);
  const today = new Date();
  const currentMonth = `${today.getFullYear()}年${today.getMonth() + 1}月`;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">
        
        {/* ヘッダーセクション */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black tracking-widest uppercase">
            <Calendar className="w-3 h-3" /> Monthly Luck Directions
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-slate-800 tracking-tight">
            今月の吉方位
          </h1>
          <p className="text-slate-500 font-medium text-base sm:text-lg">
            {currentMonth} の月間開運方位
          </p>
        </header>

        {/* 本命星選択セクション */}
        <section className="bg-white p-4 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4" /> 本命星を選択してください
            </h2>
          </div>
          <StarSelector 
            selected={selectedHonmei} 
            onChange={setSelectedHonmei} 
            layout="grid" 
          />
        </section>

        {/* 月命星ごとのリスト表示 (八雲院スタイル) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((monthStar) => {
            // 今月の月盤に基づいた簡易的な傾向表示
            return (
              <div 
                key={monthStar}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">月命星</span>
                    <h3 className="text-xl font-bold text-slate-800 font-serif">{STAR_NAMES[monthStar]}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 mb-1 font-bold">今月の運勢傾向</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      今月は{STAR_NAMES[selectedHonmei]}との相乗効果で、新たな始まりに適した月です。
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> 注目の吉方位
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-black">
                        東
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-black">
                        南西
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50">
                  <Link 
                    href={`/search/direction?star=${selectedHonmei}&month=${monthStar}`}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    月間詳細カレンダーを見る <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 下部メッセージ */}
        <div className="bg-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          <h3 className="font-black font-serif text-blue-200 mb-4 tracking-widest text-lg">月の智慧</h3>
          <p className="text-slate-300 leading-loose text-sm font-serif italic">
            月盤の影響は、数ヶ月から一年にわたる中長期的な運勢に作用します。良縁を求めるなら、今月の月吉方位を意識してみましょう。
          </p>
        </div>

      </div>
    </div>
  );
}
