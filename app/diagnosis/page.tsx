'use client';

import { useState } from 'react';
import { diagnoseNineStar, type NineStarDiagnosis } from '@/lib/fortune/nine-star-calculator';
import { getStarKnowledge, getRelatedStarEntries, type KnowledgeEntry } from '@/lib/fortune/admin-api';
import FlyingStarBoard from '@/app/components/FlyingStarBoard';
import FengShuiForm from '@/app/components/FengShuiForm';
import { calculateFlyingStarChart } from '@/lib/fortune/directional/flying-star-calculator';
import type { FlyingStarChart } from '@/lib/fortune/directional/flying-star-data';
import { DIRECTIONS, type DirectionKey } from '@/lib/fortune/directional/constants';

export default function DiagnosisPage() {
  const [birthDate, setBirthDate] = useState('');
  const [diagnosis, setDiagnosis] = useState<NineStarDiagnosis | null>(null);
  const [mainStarKnowledge, setMainStarKnowledge] = useState<KnowledgeEntry | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 玄空飛星関連の状態
  const [flyingStarChart, setFlyingStarChart] = useState<FlyingStarChart | null>(null);

  const handleDiagnose = async () => {
    if (!birthDate) return;
    setLoading(true);
    try {
      const date = new Date(birthDate);
      const result = diagnoseNineStar(date);
      setDiagnosis(result);
      const mainKnowledge = await getStarKnowledge(result.mainStar.name);
      setMainStarKnowledge(mainKnowledge);
    } catch (error) {
      console.error('診断エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFengShuiCalculate = (period: number, sittingMountain: string, facingMountain: string) => {
    const chart = calculateFlyingStarChart(period, sittingMountain, facingMountain);
    setFlyingStarChart(chart);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF2] text-stone-900 font-sans selection:bg-amber-100">
      {/* プレミアムな背景装飾 */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* 和風モダンヘッダー */}
        <header className="text-center mb-16">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-black font-serif tracking-[0.2em] text-stone-800 mb-4 px-8 py-2 border-y-2 border-stone-800">
              九星気学 × 玄空飛星
            </h1>
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500 opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500 opacity-50" />
          </div>
          <p className="text-stone-500 font-serif mt-6 tracking-widest text-sm">
            千年の智慧が導く、あなただけの運命と住まいの調和
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* 左カラム：入力と主要診断 */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
            {/* 生年月日入力セクション */}
            <section className="bg-white/60 backdrop-blur-sm border border-stone-200 rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2 text-stone-800">
                <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
                宿命の鑑定（生年月日）
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="flex-1 bg-white border-2 border-stone-200 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all shadow-sm font-medium"
                />
                <button
                  onClick={handleDiagnose}
                  disabled={loading || !birthDate}
                  className="bg-stone-800 text-amber-200 px-8 py-3 rounded-xl font-bold font-serif hover:bg-stone-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? '鑑定中...' : '宿命を読み解く'}
                </button>
              </div>
            </section>

            {/* 九星診断結果 */}
            {diagnosis && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border-t-4 border-amber-600 rounded-2xl p-7 shadow-md">
                    <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase mb-2 block">本命星</span>
                    <h3 className="text-3xl font-black font-serif text-stone-800">{diagnosis.mainStar.name}</h3>
                    <p className="text-sm text-stone-500 mt-4 leading-relaxed font-medium">{diagnosis.mainStar.description}</p>
                  </div>
                  <div className="bg-white border-t-4 border-stone-400 rounded-2xl p-7 shadow-md">
                    <span className="text-[10px] font-bold text-stone-400 tracking-widest uppercase mb-2 block">月命星</span>
                    <h3 className="text-3xl font-black font-serif text-stone-800">{diagnosis.monthlyStar.name}</h3>
                    <p className="text-sm text-stone-500 mt-4 leading-relaxed font-medium">{diagnosis.monthlyStar.description}</p>
                  </div>
                </div>

                {mainStarKnowledge && (
                  <div className="bg-stone-800 text-stone-100 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-amber-500/10" />
                    <h4 className="text-2xl font-bold font-serif text-amber-200 mb-6 border-b border-amber-200/20 pb-4 tracking-wider">{mainStarKnowledge.title}</h4>
                    <p className="text-stone-300 leading-relaxed text-base whitespace-pre-line font-serif">{mainStarKnowledge.content}</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* 右カラム：風水鑑定（玄空飛星） */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <section className="sticky top-8">
              <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2 text-stone-800">
                <span className="w-1.5 h-6 bg-stone-800 rounded-full" />
                環境の鑑定（玄空飛星）
              </h2>
              
              <div className="space-y-10">
                <FengShuiForm onCalculate={handleFengShuiCalculate} />
                
                {flyingStarChart ? (
                  <div className="animate-in zoom-in duration-700">
                    <FlyingStarBoard 
                      chart={flyingStarChart}
                      title={`${flyingStarChart.period}運 ${flyingStarChart.facingMountain}山向`}
                    />
                    
                    <div className="bg-white/60 p-6 rounded-2xl border border-stone-200 mt-6 shadow-sm">
                      <h5 className="text-stone-800 font-bold text-xs font-serif mb-3 flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-500 rounded-full" />
                        現在の運気：第{flyingStarChart.period}運
                      </h5>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        第9運（2024–2043）において、中宮に位置する九紫火星が支配的なエネルギーを持ちます。
                        向星に9を持つ方位は「当旺」と呼ばれ、最も財運を活性化させる重要なスペースです。
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-100 border-2 border-dashed border-stone-300 rounded-3xl p-16 text-center shadow-inner">
                    <div className="text-5xl mb-6 opacity-40">🏯</div>
                    <p className="text-stone-500 font-serif text-sm tracking-widest">
                      建物の二十四山を選択して<br/>高精度な風水盤を生成してください
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
