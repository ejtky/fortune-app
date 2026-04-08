'use client'

import React, { useState, useEffect } from 'react'
import { getYearStar, getMonthStar, KYUSEI_NAMES, isAfterSetsuiri } from '@/lib/fortune/nine-star-ki/kyusei-calc-taisho13'
import { PRECISE_SETSUIRI_DATA } from '@/lib/fortune/nine-star-ki/setsuiri-precise-data'
import { Calendar, Clock, Star, Info, ChevronRight } from 'lucide-react'

export default function KyuseiCheckPage() {
  const [birthDate, setBirthDate] = useState('1977-11-15')
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    calculate()
  }, [birthDate])

  const calculate = () => {
    const d = new Date(birthDate)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = 12 // 時刻入力削除に伴い、デフォルトで正午(12:00)として計算
    const minute = 0

    const yStar = getYearStar(year, month, day, hour, minute)
    const mStar = getMonthStar(yStar, year, month, day, hour, minute)
    
    // 判定の詳細情報を生成
    const annualSetsuiri = PRECISE_SETSUIRI_DATA[year]
    const risshun = annualSetsuiri ? annualSetsuiri[2] : { day: 4, hour: 0, minute: 0 }
    const monthSetsuiri = annualSetsuiri ? annualSetsuiri[month] : { day: 5, hour: 0, minute: 0 }
    
    const isAfterRisshun = isAfterSetsuiri(year, 2, day, hour, minute)
    const isAfterMonthSetsuiri = isAfterSetsuiri(year, month, day, hour, minute)

    let group = ''
    if ([1, 4, 7].includes(yStar)) group = 'Aグループ (開始: 八白)'
    else if ([2, 5, 8].includes(yStar)) group = 'Bグループ (開始: 二黒)'
    else group = 'Cグループ (開始: 五黄)'

    setResults({
      year, month, day, hour, minute,
      yStar,
      yStarName: KYUSEI_NAMES[yStar],
      mStar,
      mStarName: KYUSEI_NAMES[mStar],
      group,
      details: {
        risshun,
        monthSetsuiri,
        isAfterRisshun,
        isAfterMonthSetsuiri
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* ヘッダー */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            九星気学 精密判定
          </h1>
          <p className="text-slate-500 font-medium">大正13年説（11引き）完全準拠</p>
        </header>

        {/* 入力セクション */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="space-y-2 text-center max-w-sm mx-auto">
            <label className="text-sm font-semibold flex items-center justify-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" /> 生年月日を入力してください
            </label>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-4 text-center text-xl font-bold rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-inner"
            />
          </div>
        </section>

        {/* 結果表示 */}
        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 本命星カード */}
              <div className="bg-white rounded-2xl p-6 border-l-8 border-l-blue-500 shadow-sm border border-slate-200 flex flex-col justify-center min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">本命星 (年)</span>
                  <Star className="w-5 h-5 text-blue-500" />
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-800">{results.yStarName}</div>
                <div className="mt-1 text-slate-500 text-sm font-medium">{results.group}</div>
              </div>

              {/* 月命星カード */}
              <div className="bg-white rounded-2xl p-6 border-l-8 border-l-purple-500 shadow-sm border border-slate-200 flex flex-col justify-center min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">月命星 (月)</span>
                  <Star className="w-5 h-5 text-purple-500" />
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-800">{results.mStarName}</div>
                <div className="mt-1 text-slate-500 text-sm font-medium">精密算出アルゴリズム</div>
              </div>
            </div>

            {/* 判定の詳細根拠 */}
            <section className="bg-slate-100 rounded-2xl p-6 space-y-4 border border-slate-200">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-widest">
                <Info className="w-4 h-4" /> 判定の根拠
              </h3>
              
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">年の判定:</span> {results.year}年の桁和から算出。
                    {results.details.isAfterRisshun 
                      ? `立春(${results.details.risshun.day}日 ${results.details.risshun.hour}:${results.details.risshun.minute})を過ぎているため当年です。` 
                      : `立春(${results.details.risshun.day}日 ${results.details.risshun.hour}:${results.details.risshun.minute})以前のため前年扱いです。`}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 mt-1 text-purple-500 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">月の判定:</span> {results.month}月の節入り({results.details.monthSetsuiri.day}日 {results.details.monthSetsuiri.hour}:${results.details.monthSetsuiri.minute})を基準。
                    {results.details.isAfterMonthSetsuiri 
                      ? "節入り後のため当月の九星を適用しました。" 
                      : "節入り前のため前月の九星を適用しました。"}
                  </div>
                </li>
              </ul>
            </section>
          </div>
        )}

        <footer className="text-center text-slate-400 text-xs pt-8">
          &copy; 2026 九星気学 精密算出システム — 大正13年説 完全準拠版
        </footer>
      </div>
    </div>
  )
}
