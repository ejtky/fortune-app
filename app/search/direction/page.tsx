'use client';

import { useState } from 'react';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import { calculateHonmeiStar } from '@/lib/fortune/nine-star-ki/calculator';
import type { DirectionAnalysis } from '@/lib/fortune/directional/calculator';

// 初期値を計算する純粋な関数
const getInitialEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

interface SearchResult {
  date: string;
  luckyDirections: DirectionAnalysis[];
}

export default function DirectionSearchPage() {
  const [birthDate, setBirthDate] = useState('1977-12-06');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(getInitialEndDate);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // 短いディレイを入れてUIの反応を良くする
    setTimeout(() => {
      const birth = new Date(birthDate);
      const honmei = calculateHonmeiStar(birth);
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const searchResults = [];

      // 期間内の各日をループして吉方位を抽出
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const reading = generateDirectionalReading(new Date(d), honmei);
        const luckyOnes = reading.directions.filter(dir => dir.isLucky && !dir.satsu);
        
        if (luckyOnes.length > 0) {
          searchResults.push({
            date: new Date(d).toISOString().split('T')[0],
            luckyDirections: luckyOnes
          });
        }
      }
      
      setResults(searchResults);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-800 mb-2">吉方位サーチ</h1>
        <p className="text-slate-500">あなたの生年月日と期間から、最適な移動タイミングを見つけます</p>
      </div>

      {/* 検索フォーム */}
      <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">生年月日</label>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">開始日</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">終了日</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
        </div>
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full mt-6 bg-purple-700 text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition-all disabled:opacity-50"
        >
          {isSearching ? '検索中...' : '吉方位を検索する'}
        </button>
      </section>

      {/* 検索結果 */}
      <section className="space-y-4">
        {results.length > 0 ? (
          results.map((res, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-bold text-sm">
                  {res.date.replace(/-/g, '/')}
                </div>
                <h3 className="font-bold text-slate-700">の吉方位</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {res.luckyDirections.map((dir, j) => (
                  <div key={j} className="group relative">
                    <span className="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-bold cursor-help">
                      {dir.directionName}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {dir.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : !isSearching && results.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">検索条件を入力してボタンを押してください</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
