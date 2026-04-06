'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import StarSelector from '@/components/StarSelector';
import { Sparkles, Compass, ArrowRight, Info, MapPin, TrendingUp } from 'lucide-react';

export default function YearlyDirectionPage() {
  const [selectedHonmei, setSelectedHonmei] = useState(1);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">
        
        {/* ヘッダーセクション */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> Annual Luck Directions
          </div>
          <h1 className="text-4xl font-black font-serif text-slate-800 tracking-tight">
            今年の吉方位
          </h1>
          <p className="text-slate-600 font-medium text-lg">
            {currentYear}年 の年間総合開運方位
          </p>
        </header>

        {/* 本命星選択セクション */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-100/50 space-y-6">
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

        {/* 年間メッセージ */}
        <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 group-hover:w-2.5 transition-all duration-500" />
           <div className="flex flex-col md:flex-row gap-8 items-center">
             <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center text-4xl shrink-0">
               ✨
             </div>
             <div className="space-y-3">
               <h3 className="font-black font-serif text-slate-800 text-2xl tracking-widest flex items-center gap-3">
                 {currentYear}年の展望
               </h3>
               <p className="text-slate-500 leading-relaxed font-serif">
                 {STAR_NAMES[selectedHonmei]}の方にとって、今年は「変化と躍進」の周期に入ります。年盤の配置からは、特に北と南東の方位に強い守護エネルギーが流れています。
               </p>
             </div>
           </div>
        </section>

        {/* 月命星ごとの年間吉方位 (八雲院スタイル) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((monthStar) => {
            return (
              <div 
                key={monthStar}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">月命星</span>
                    <h3 className="text-xl font-bold text-slate-800 font-serif">{STAR_NAMES[monthStar]}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" /> 年間の最重要吉方位
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[10px] font-black">
                        北
                      </span>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[10px] font-black">
                        南東
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Fortune Factor</div>
                    <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-400 w-4/5" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50">
                  <Link 
                    href={`/knowledge?star=${selectedHonmei}`}
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    年間詳細バイオリズムを見る <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 警告/注意点 */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 flex gap-4 items-start">
           <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
             ⚠️
           </div>
           <div>
             <h4 className="text-sm font-bold text-slate-800 mb-1">今年特に注意すべき凶方位（万人共通）</h4>
             <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
               五黄殺（西）、暗剣殺（東）、歳破（西北）は、すべての方にとって大きな移動（引っ越し、海外旅行）を避けるべき方位です。
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
