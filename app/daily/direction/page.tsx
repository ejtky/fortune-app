'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import StarSelector from '@/components/StarSelector';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Calendar, Info, MapPin, ArrowRight } from 'lucide-react';

export default function DailyDirectionPage() {
  const [selectedHonmei, setSelectedHonmei] = useState(1);
  const [today, setToday] = useState(new Date());

  // 日付のフォーマット (YYYY年M月D日)
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 指定した本命星と月命星（1-9）の組み合わせについて、本日の方位を計算
  const getDirectionStatus = (honmei: number, monthStar: number) => {
    const reading = generateDirectionalReading(today, honmei);
    // 月命星の影響を考慮した詳細ロジックは本来あるが、
    // ここでは簡易的に本命星ベースの吉方位情報を表示
    const luckyOnes = reading.directions.filter(d => d.isLucky && !d.satsu);
    return luckyOnes;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">
        
        {/* ヘッダーセクション */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-black tracking-widest uppercase">
            <Calendar className="w-3 h-3" /> Daily Luck Directions
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-slate-800 tracking-tight">
            今日の吉方位
          </h1>
          <p className="text-slate-500 font-medium text-base sm:text-lg">
            {formatDate(today)} の運勢と開運方位
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
            const luckyOnes = getDirectionStatus(selectedHonmei, monthStar);
            
            return (
              <Link 
                key={monthStar}
                href={`/check/ninestar/day/${today.toISOString().split('T')[0].replace(/-/g, '')}`}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">月命星</span>
                    <h3 className="text-xl font-bold text-slate-800 font-serif">{STAR_NAMES[monthStar]}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 今日の吉方位
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {luckyOnes.length > 0 ? (
                      luckyOnes.map((dir, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black"
                        >
                          {dir.directionName}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-300 italic font-medium">本日は凶方位を避けてお過ごしください</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 下部ナビゲーション */}
        <div className="pt-12 text-center">
          <Link 
            href="/search/direction"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors"
          >
            <span>期間を指定して占う（吉方位サーチ）</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
