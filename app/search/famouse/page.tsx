'use client';

import { useState } from 'react';
import { FAMOUS_PEOPLE } from '@/lib/data/famous-people';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';
import Link from 'next/link';

export default function FamousSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  
  const filteredPeople = FAMOUS_PEOPLE.filter(person => {
    const matchesQuery = person.name.includes(searchQuery) || person.tags.some(tag => tag.includes(searchQuery));
    const matchesStar = selectedStar === null || person.honmei === selectedStar;
    return matchesQuery && matchesStar;
  });

  const starColors: Record<number, string> = {
    1: 'bg-blue-500', 2: 'bg-stone-600', 3: 'bg-emerald-500',
    4: 'bg-green-500', 5: 'bg-amber-600', 6: 'bg-gray-400',
    7: 'bg-red-500', 8: 'bg-brown-600', 9: 'bg-purple-600'
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-800 mb-2">有名人検索</h1>
        <p className="text-slate-500">九星の繋がりから、あの人との共通点を見つける</p>
      </div>

      {/* 検索・フィルタエリア */}
      <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">キーワード</label>
            <input 
              type="text" 
              placeholder="名前やジャンル（俳優、芸人など）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">本命星で絞り込む</label>
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6,7,8,9].map(star => (
                 <button 
                  key={star}
                  onClick={() => setSelectedStar(selectedStar === star ? null : star)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedStar === star 
                      ? 'border-purple-600 bg-purple-600 text-white shadow-md' 
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                 >
                  {STAR_NAMES[star]}
                 </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 結果一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map(person => (
          <div key={person.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${starColors[person.honmei]}`} />
              <span className="text-[10px] font-bold text-slate-300 tracking-widest">{person.birthDate.replace(/-/g, '.')}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">{person.name}</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {person.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">#{tag}</span>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">{STAR_NAMES[person.honmei]}</span>
              <Link 
                href={`/check/ninestar/day/${person.birthDate.replace(/-/g, '')}`}
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                詳しく見る →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">条件に合う有名人が見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
