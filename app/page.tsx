'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateNineStarKiReading } from '@/lib/fortune/nine-star-ki/calculator';
import { searchKnowledge } from '@/lib/fortune/nine-star-ki/knowledge-base';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import type { NineStarKiReading } from '@/types/fortune';
import type { DirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import LoshuBoard from './components/LoshuBoard';
import DirectionList from './components/DirectionList';
import DateSelector from './components/DateSelector';
import TravelAnalysis from './components/TravelAnalysis';
import NineStarDetailedProfile from './components/NineStarDetailedProfile';

type TabType = 'profile' | 'direction' | 'travel' | 'flyingstar';

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [reading, setReading] = useState<NineStarKiReading | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{
    role: string, 
    content: string, 
    usedAI?: boolean, 
    sources?: Array<{title: string, summary: string | null}>
  }>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // 方位学用の状態
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [directionalReading, setDirectionalReading] = useState<DirectionalReading | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<DirectionKey | null>(null);
  const [activeLoshuBoard, setActiveLoshuBoard] = useState<'year' | 'month' | 'day'>('year');
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);

  // 飛星風水用の状態
  const [flyingStarChart, setFlyingStarChart] = useState<any>(null);

  const handleCalculate = () => {
    if (!birthDate) return;
    const date = new Date(birthDate);
    const result = generateNineStarKiReading(date);
    setReading(result);
    setChatMessages([{
      role: 'assistant',
      content: result.starName + 'の方ですね！伝統的な九星気学の教えに基づいて、あなたの運勢について詳しくお答えします。仕事、恋愛、健康、金運、開運法など、何でもお聞きください。'
    }]);

    // 方位学の計算も実行
    const dirReading = generateDirectionalReading(new Date(selectedDate), result.honmei);
    setDirectionalReading(dirReading);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !reading || chatLoading) return;
    
    setChatLoading(true);
    setChatError(null);
    
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);
    setUserMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          honmei: reading.honmei,
          starName: reading.starName,
          conversationHistory: chatMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('回答の取得に失敗しました');
      }

      const data = await response.json();
      
      setChatMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: data.response,
          usedAI: data.usedAI,
          sources: data.retrievedKnowledge
        }
      ]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setChatError(error.message || 'エラーが発生しました');
      
      // エラー時はフォールバック
      const fallbackResponse = searchKnowledge(reading.honmei, userMessage);
      setChatMessages([
        ...newMessages,
        { role: 'assistant', content: fallbackResponse }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (reading) {
      const dirReading = generateDirectionalReading(new Date(date), reading.honmei);
      setDirectionalReading(dirReading);
    }
  };

  const handleDirectionClick = (direction: DirectionKey) => {
    setSelectedDirection(direction);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'profile', label: '九星プロフィール', icon: '⭐' },
    { id: 'direction', label: '方位学', icon: '🧭' },
    { id: 'travel', label: '引っ越し・旅行診断', icon: '✈️' },
    { id: 'flyingstar', label: '飛星風水', icon: '🏠' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-slate-800 tracking-wider">
          九星気学 八雲院
          <span className="block text-sm md:text-base font-sans font-normal text-slate-500 mt-4 tracking-normal">
            伝統と信頼の九星気学・方位学鑑定
          </span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
          生年月日から本命星と月命星を導き出し、<br className="hidden md:inline"/>
          吉方位や運勢、詳細な性格分析を提供する無料の総合占いツールです。
        </p>
      </section>

      {/* Feature Navigation Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🔮', title: '九星診断', desc: '本命星・月命星を知る', href: '/diagnosis' },
          { icon: '🌟', title: '運勢予測', desc: '今日・今月・今年の運勢', href: '/fortune' },
          { icon: '📅', title: '九星カレンダー', desc: '吉日・凶日を確認', href: '/calendar' },
          { icon: '🗺️', title: '吉方位マップ', desc: '地図で吉凶を確認', href: '/direction-map' },
          { icon: '📆', title: '旅行日程最適化', desc: '最適な旅行日を探す', href: '/travel-optimizer' },
          { icon: '📚', title: '知識ベース', desc: '九星の詳細情報検索', href: '/knowledge' },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="stagger-item group bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center hover-lift hover-glow transition-smooth"
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
            <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* Nine Stars Character Profiles */}
      <section className="space-y-6 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            九星キャラクター図鑑
          </h2>
          <p className="text-slate-600">各星の詳細な性格分析と開運法をご覧いただけます</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
          {[
            { id: 1, name: '一白水星', color: 'from-blue-500 to-blue-600', emoji: '💧' },
            { id: 2, name: '二黒土星', color: 'from-yellow-600 to-yellow-700', emoji: '🌍' },
            { id: 3, name: '三碧木星', color: 'from-green-500 to-green-600', emoji: '🌲' },
            { id: 4, name: '四緑木星', color: 'from-emerald-500 to-emerald-600', emoji: '🍃' },
            { id: 5, name: '五黄土星', color: 'from-amber-500 to-amber-600', emoji: '👑' },
            { id: 6, name: '六白金星', color: 'from-gray-400 to-gray-500', emoji: '⚪' },
            { id: 7, name: '七赤金星', color: 'from-red-500 to-red-600', emoji: '🔴' },
            { id: 8, name: '八白土星', color: 'from-stone-500 to-stone-600', emoji: '⛰️' },
            { id: 9, name: '九紫火星', color: 'from-purple-500 to-purple-600', emoji: '🔥' },
          ].map((star) => (
            <Link
              key={star.id}
              href={`/knowledge?star=${star.id}`}
              className="stagger-item group relative bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-center text-center hover-lift transition-smooth overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${star.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{star.emoji}</span>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm relative z-10">{star.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Calculation Form */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transform transition-all hover:shadow-xl">
          <div className="bg-slate-50 border-b border-slate-100 p-6 text-center">
            <h2 className="text-xl font-bold font-serif text-slate-800">
              あなたの星と吉方位を調べる
            </h2>
            <p className="text-sm text-slate-500 mt-2">生年月日を入力して鑑定を開始</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">生年月日</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleCalculate}
              disabled={!birthDate}
              className="w-full py-4 bg-purple-700 text-white rounded-xl font-bold text-lg hover:bg-purple-800 focus:ring-4 focus:ring-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              鑑定する
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {reading && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 min-h-[600px]">
             
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg">
                   <h3 className="font-bold text-purple-900">詳細プロフィールの表示</h3>
                   <button
                    onClick={() => setShowDetailedProfile(!showDetailedProfile)}
                    className="text-sm px-4 py-2 border border-purple-200 rounded-lg bg-white text-purple-700 hover:bg-purple-50 transition-colors"
                   >
                     {showDetailedProfile ? '簡易表示へ' : '詳細表示へ'}
                   </button>
                </div>

                {showDetailedProfile ? (
                  <NineStarDetailedProfile reading={reading} />
                ) : (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Basic Info */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {[
                           { label: '本命星', val: reading.starName, color: 'text-purple-700', bg: 'bg-purple-50' },
                           { label: '月命星', val: reading.monthStarName, color: 'text-pink-600', bg: 'bg-pink-50' },
                           { label: '傾斜', val: reading.keishakyu, color: 'text-teal-600', bg: 'bg-teal-50' },
                         ].map((s, i) => (
                           <div key={i} className={`p-4 rounded-xl ${s.bg} text-center`}>
                             <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                             <div className={`font-bold text-lg ${s.color}`}>{s.val}</div>
                           </div>
                         ))}
                      </div>

                      <div className="bg-slate-50 rounded-xl p-6">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <span className="text-xl">✨</span> 性格の特徴
                         </h3>
                         <div className="flex flex-wrap gap-2">
                           {reading.characteristics.map((char, index) => (
                             <span key={index} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm shadow-sm">
                               {char}
                             </span>
                           ))}
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                         <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                           <h3 className="font-bold text-purple-900 mb-3">ラッキーカラー</h3>
                           <div className="flex flex-wrap gap-2">
                             {reading.luckyColors.map((c, i) => (
                               <span key={i} className="px-3 py-1 bg-white/80 text-purple-700 text-sm rounded border border-purple-100">{c}</span>
                             ))}
                           </div>
                         </div>
                         <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                           <h3 className="font-bold text-blue-900 mb-3">ラッキー方位</h3>
                           <div className="flex flex-wrap gap-2">
                             {reading.luckyDirections.map((d, i) => (
                               <span key={i} className="px-3 py-1 bg-white/80 text-blue-700 text-sm rounded border border-blue-100">{d}</span>
                             ))}
                           </div>
                         </div>
                      </div>
                    </div>

                    {/* Chat Bot */}
                    <div className="lg:col-span-1 border-l border-slate-100 pl-8">
                       <div className="bg-slate-50 rounded-xl p-4 h-[500px] flex flex-col border border-slate-200">
                          <h3 className="font-bold text-center mb-4 text-slate-700 font-serif">九星気学AI相談</h3>
                          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                            {chatMessages.length === 0 ? (
                               <div className="text-center text-slate-400 text-sm py-8">
                                 気になることを質問してください<br/>
                                 「今年の運勢は？」「適職は？」
                               </div>
                            ) : (
                               chatMessages.map((msg, i) => (
                                 <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                   <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-100'}`}>
                                     {msg.content}
                                   </div>
                                   {msg.role === 'assistant' && msg.content && !msg.content.includes('の方ですね！') && (
                                     <div className="mt-1 flex flex-col gap-1 px-1">
                                       <div className="flex items-center gap-2">
                                         {msg.usedAI && (
                                           <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold">
                                             AI回答
                                           </span>
                                         )}
                                         {msg.sources && msg.sources.length > 0 && (
                                           <span className="text-[10px] text-slate-400">
                                             参照: {msg.sources.map(s => s.title).join(', ')}
                                           </span>
                                         )}
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               ))
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={userMessage}
                              onChange={(e) => setUserMessage(e.target.value)}
                              placeholder="質問を入力..."
                              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!userMessage.trim()}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
                            >
                              送信
                            </button>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Direction Tab */}
            {activeTab === 'direction' && directionalReading && (
              <div className="space-y-8">
                 <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <DateSelector
                      selectedDate={selectedDate}
                      onDateChange={handleDateChange}
                      label="診断する日付"
                    />
                 </div>

                 <div className="grid lg:grid-cols-2 gap-12">
                   <div>
                     <h3 className="font-bold text-slate-700 mb-4 text-lg">盤面 (Loshu Board)</h3>
                     <div className="inline-flex bg-slate-100 p-1 rounded-lg mb-6">
                        {['year', 'month', 'day'].map((apiBoard: any) => (
                          <button
                            key={apiBoard}
                            onClick={() => setActiveLoshuBoard(apiBoard)}
                            className={`px-4 py-1.5 rounded-md text-sm transition-all ${activeLoshuBoard === apiBoard ? 'bg-white shadow text-purple-700 font-bold' : 'text-slate-500'}`}
                          >
                            {apiBoard === 'year' ? '年盤' : apiBoard === 'month' ? '月盤' : '日盤'}
                          </button>
                        ))}
                     </div>
                     <LoshuBoard
                        layout={directionalReading.loshuBoards[activeLoshuBoard]}
                        title={activeLoshuBoard === 'year' ? '年盤' : activeLoshuBoard === 'month' ? '月盤' : '日盤'}
                        selectedDirection={selectedDirection}
                        onDirectionClick={handleDirectionClick}
                     />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-700 mb-4 text-lg">方位の吉凶</h3>
                     <DirectionList
                        directions={directionalReading.directions}
                        honmeiStar={reading.honmei}
                        boardType={activeLoshuBoard}
                        onDirectionSelect={(dir) => setSelectedDirection(dir as DirectionKey)}
                     />
                   </div>
                 </div>

                 <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
                    <h3 className="font-bold text-purple-800 mb-2">鑑定コメント</h3>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">{directionalReading.summary}</p>
                 </div>
              </div>
            )}

            {/* Travel Tab */}
            {activeTab === 'travel' && directionalReading && (
              <TravelAnalysis directionalReading={directionalReading} />
            )}

            {/* Flying Star Tab */}
            {activeTab === 'flyingstar' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                  <h3 className="text-xl font-bold font-serif text-stone-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
                    玄空飛星鑑定（住まいの風水）
                  </h3>
                  <p className="text-stone-600 mb-6 text-sm">
                    建物の建築時期（運）と、正面の方位（向）から、家全体のエネルギー配置を読み解きます。
                  </p>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center justify-center min-h-[300px]">
                      <div className="text-4xl mb-4">🏠</div>
                      <p className="text-stone-500 text-center italic">
                        ※ メインページへの飛星計算フォーム統合を準備中です。<br/>
                        詳細な鑑定は「九星診断」メニューからご利用いただけます。
                      </p>
                      <Link 
                        href="/diagnosis" 
                        className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-md"
                      >
                        九星診断（玄空飛星対応）へ移動
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </section>
      )}
    </div>
  );
}
