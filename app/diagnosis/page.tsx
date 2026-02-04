'use client';

import { useState } from 'react';
import { diagnoseNineStar, type NineStarDiagnosis } from '@/lib/fortune/nine-star-calculator';
import { getStarKnowledge, getRelatedStarEntries, type KnowledgeEntry } from '@/lib/fortune/admin-api';
import LoshuBoard from '@/app/components/LoshuBoard';
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

  const handleFengShuiCalculate = (period: number, sitting: DirectionKey, facing: DirectionKey) => {
    const chart = calculateFlyingStarChart(period, sitting, facing);
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
          <div className="lg:col-span-7 space-y-12">
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
                  className="flex-1 bg-white border-2 border-stone-200 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all"
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
                  <div className="bg-white border-t-4 border-amber-600 rounded-2xl p-6 shadow-md">
                    <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">本命星</span>
                    <h3 className="text-3xl font-black font-serif text-stone-800 mt-1">{diagnosis.mainStar.name}</h3>
                    <p className="text-sm text-stone-500 mt-4 leading-relaxed">{diagnosis.mainStar.description}</p>
                  </div>
                  <div className="bg-white border-t-4 border-stone-400 rounded-2xl p-6 shadow-md">
                    <span className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">月命星</span>
                    <h3 className="text-3xl font-black font-serif text-stone-800 mt-1">{diagnosis.monthlyStar.name}</h3>
                    <p className="text-sm text-stone-500 mt-4 leading-relaxed">{diagnosis.monthlyStar.description}</p>
                  </div>
                </div>

                {mainStarKnowledge && (
                  <div className="bg-stone-800 text-stone-100 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <h4 className="text-xl font-bold font-serif text-amber-200 mb-4">{mainStarKnowledge.title}</h4>
                    <p className="text-stone-300 leading-relaxed text-sm whitespace-pre-line">{mainStarKnowledge.content}</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* 右カラム：風水鑑定（玄空飛星） */}
          <div className="lg:col-span-5 space-y-8">
            <section className="sticky top-8">
              <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2 text-stone-800">
                <span className="w-1.5 h-6 bg-stone-800 rounded-full" />
                環境の鑑定（玄空飛星）
              </h2>
              
              <div className="space-y-8">
                <FengShuiForm onCalculate={handleFengShuiCalculate} />
                
                {flyingStarChart ? (
                  <div className="animate-in zoom-in duration-500">
                    <LoshuBoard 
                      layout={{
                        CENTER: 5, N: 1, SW: 2, E: 3, SE: 4, NW: 6, W: 7, NE: 8, S: 9 // 基本盤
                      }} 
                      title={`${flyingStarChart.period}運・${DIRECTIONS[flyingStarChart.facing]}向 飛星盤`}
                      flyingStarChart={flyingStarChart}
                    />
                  </div>
                ) : (
                  <div className="bg-stone-200/50 border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center">
                    <div className="text-4xl mb-4">🏠</div>
                    <p className="text-stone-500 font-serif text-sm">建物の情報を入力して<br/>風水盤を生成してください</p>
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
