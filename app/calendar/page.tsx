'use client';

import { useState } from 'react';
import { NINE_STARS, type NineStarNumber } from '@/lib/fortune/nine-star-calculator';
import { generateDirectionalReading } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  goodDirections: string[];
  badDirections: string[];
  score: number;
}

export default function CalendarPage() {
  const [selectedStar, setSelectedStar] = useState<NineStarNumber | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<DayInfo[]>([]);

  // 九星の選択肢
  const starOptions: { value: NineStarNumber; label: string }[] = [
    { value: 1, label: '一白水星' },
    { value: 2, label: '二黒土星' },
    { value: 3, label: '三碧木星' },
    { value: 4, label: '四緑木星' },
    { value: 5, label: '五黄土星' },
    { value: 6, label: '六白金星' },
    { value: 7, label: '七赤金星' },
    { value: 8, label: '八白土星' },
    { value: 9, label: '九紫火星' },
  ];

  // カレンダーを生成
  const generateCalendar = (star: NineStarNumber, date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 月の最初の日と最後の日
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // カレンダーの開始日（前月の日曜日から）
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // カレンダーの終了日（次月の土曜日まで）
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: DayInfo[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const reading = generateDirectionalReading(new Date(current), star);

      const goodDirs: string[] = [];
      const badDirs: string[] = [];

      // directions は配列なのでそのまま forEach
      reading.directions.forEach((dir) => {
        // quality が 'excellent' または 'good' なら吉方位
        if (dir.quality === 'excellent' || dir.quality === 'good') {
          goodDirs.push(dir.directionName);
        }
        // quality が 'avoid' または 'caution' なら凶方位
        else if (dir.quality === 'avoid' || dir.quality === 'caution') {
          badDirs.push(dir.directionName);
        }
      });

      // スコア計算（運勢予測と同じロジック）
      const rawScore = goodDirs.length * 10 - badDirs.length * 5;
      const score = Math.max(0, Math.min(100, 50 + rawScore));

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        goodDirections: goodDirs,
        badDirections: badDirs,
        score,
      });

      current.setDate(current.getDate() + 1);
    }

    setCalendarData(days);
  };

  // 九星が選択されたら
  const handleStarSelect = (star: NineStarNumber) => {
    setSelectedStar(star);
    generateCalendar(star, currentDate);
  };

  // 月を変更
  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
    if (selectedStar) {
      generateCalendar(selectedStar, newDate);
    }
  };

  // 今月に戻る
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (selectedStar) {
      generateCalendar(selectedStar, today);
    }
  };

  // 日付のスタイルを取得
  const getDayStyle = (day: DayInfo) => {
    if (!day.isCurrentMonth) {
      return 'bg-gray-50 text-gray-400';
    }

    if (day.score >= 75) {
      return 'bg-gradient-to-br from-green-100 to-green-50 border-green-300';
    } else if (day.score >= 55) {
      return 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300';
    } else if (day.score >= 35) {
      return 'bg-white border-gray-200';
    } else if (day.score >= 15) {
      return 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-300';
    } else {
      return 'bg-gradient-to-br from-red-100 to-red-50 border-red-300';
    }
  };

  // 今日かどうか
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            九星カレンダー
          </h1>
          <p className="text-gray-600 text-lg">
            あなたの九星で吉日・凶日を確認できます
          </p>
        </div>

        {/* 九星選択 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-purple-500 pb-3">
            🌟 あなたの本命星を選択
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {starOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStarSelect(option.value)}
                className={`py-4 px-2 rounded-xl border-2 transition-all font-bold text-sm ${
                  selectedStar === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:shadow-md'
                }`}
              >
                <div className="text-xs mb-1">{option.value}</div>
                <div className="text-xs leading-tight">{option.label}</div>
              </button>
            ))}
          </div>

          {!selectedStar && (
            <div className="mt-6 text-center text-gray-500 text-sm">
              ↑ あなたの本命星を選択してください
            </div>
          )}
        </div>

        {/* カレンダー */}
        {selectedStar && calendarData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* カレンダーヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                ← 前月
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  本命星: {NINE_STARS[selectedStar]}
                </div>
              </div>

              <button
                onClick={() => changeMonth(1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                次月 →
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={goToToday}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                今月に戻る
              </button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['日', '月', '火', '水', '木', '金', '土'].map((day, idx) => (
                <div
                  key={day}
                  className={`text-center font-bold py-2 ${
                    idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダーグリッド */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-2">
              {calendarData.map((day, idx) => (
                <div
                  key={idx}
                  className={`border rounded-md sm:rounded-lg p-1 sm:p-3 min-h-[60px] sm:min-h-[120px] transition-all hover:shadow-lg ${getDayStyle(
                    day
                  )} ${isToday(day.date) ? 'ring-2 sm:ring-4 ring-purple-400' : ''}`}
                >
                  {/* 日付 */}
                  <div
                    className={`text-xs sm:text-lg font-bold mb-0.5 sm:mb-2 ${
                      isToday(day.date)
                        ? 'text-purple-600'
                        : day.isCurrentMonth
                        ? 'text-gray-800'
                        : 'text-gray-400'
                    }`}
                  >
                    {day.date.getDate()}
                    {isToday(day.date) && (
                      <span className="hidden sm:inline ml-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        今日
                      </span>
                    )}
                  </div>

                  {/* スコア */}
                  {day.isCurrentMonth && (
                    <div className="space-y-0.5 sm:space-y-1">
                      <div
                        className={`text-[9px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-center font-bold ${
                          day.score >= 75
                            ? 'bg-green-200 text-green-800'
                            : day.score >= 55
                            ? 'bg-blue-200 text-blue-800'
                            : day.score >= 35
                            ? 'bg-gray-200 text-gray-800'
                            : day.score >= 15
                            ? 'bg-orange-200 text-orange-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {day.score >= 75
                          ? '大吉'
                          : day.score >= 55
                          ? '吉'
                          : day.score >= 35
                          ? '平'
                          : day.score >= 15
                          ? '小凶'
                          : '凶'}
                      </div>

                      {/* 吉方位 */}
                      {day.goodDirections.length > 0 && (
                        <div className="hidden sm:block text-xs text-green-700 font-semibold">吉: {day.goodDirections.length}</div>
                      )}
                      {/* 凶方位 */}
                      {day.badDirections.length > 0 && (
                        <div className="hidden sm:block text-xs text-red-700 font-semibold">凶: {day.badDirections.length}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 凡例 */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-900 mb-4">📖 カレンダーの見方</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded"></div>
                    <span><strong>大吉（75点以上）</strong>: 多くの方位が吉方位の日</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded"></div>
                    <span><strong>吉（55-74点）</strong>: いくつかの吉方位がある日</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white border-2 border-gray-200 rounded"></div>
                    <span><strong>平（35-54点）</strong>: 普通の日</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300 rounded"></div>
                    <span><strong>小凶（15-34点）</strong>: やや注意が必要な日</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-300 rounded"></div>
                    <span><strong>凶（15点未満）</strong>: 凶方位が多い日は注意</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <p>• <strong>スコア計算</strong>：吉方位の数×10 - 凶方位の数×5 + 基本点50</p>
                <p>• 大吉や吉の日は、旅行や引越しに適した日です</p>
                <p>• 小凶・凶の日は、重要な移動は避けるか、十分な準備をしましょう</p>
                <p>• 75km以上離れた場所への移動で方位の影響を受けます</p>
              </div>
            </div>
          </div>
        )}

        {/* 初期メッセージ */}
        {!selectedStar && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              九星カレンダーで吉日を確認
            </h3>
            <p className="text-gray-600">
              あなたの本命星を選択すると、月間カレンダーで吉日・凶日を確認できます。
              <br />
              旅行や引越しの計画に役立ててください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
