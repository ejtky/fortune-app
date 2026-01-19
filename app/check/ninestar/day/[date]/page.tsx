"use client";

import { use, useState, useMemo } from "react";
import { generateNineStarKiReading } from "@/lib/fortune/nine-star-ki/calculator";
import { generateDirectionalReading } from "@/lib/fortune/directional/calculator";
import type { DirectionKey } from "@/lib/fortune/directional/constants";
import LoshuBoard from "../../../../components/LoshuBoard";
import DirectionList from "../../../../components/DirectionList";
import NineStarDetailedProfile from "../../../../components/NineStarDetailedProfile";
import Link from "next/link";

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function NineStarDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const dateStr = resolvedParams.date;

  const [activeBoard, setActiveBoard] = useState<"year" | "month" | "day">(
    "day"
  );
  const [selectedDirection, setSelectedDirection] =
    useState<DirectionKey | null>(null);

  // useMemoを使用して計算結果をメモ化
  const reading = useMemo(() => {
    if (!dateStr) return null;

    // YYYYMMDD 形式をパース
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const date = new Date(year, month, day);

    if (isNaN(date.getTime())) return null;

    return generateNineStarKiReading(date);
  }, [dateStr]);

  const directionalReading = useMemo(() => {
    if (!reading) return null;
    return generateDirectionalReading(new Date(), reading.honmei);
  }, [reading]);

  if (!reading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-0 bg-[#FCFAF2]">
      {/* ヘッダーセクション */}
      <header className="bg-[#533D5B] transition-colors py-10 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {dateStr.substring(0, 4)}年{dateStr.substring(4, 6)}月{dateStr.substring(6, 8)}日 生まれ
          </h1>
          <p className="text-purple-100 text-lg md:text-xl">
            あなたの本質と今日の方位運を詳しく解説します
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-8 px-2">
          <Link href="/" className="hover:text-purple-600 transition-colors">TOP</Link>
          <span className="mx-2">/</span>
          <span>九星詳細</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">
            {dateStr.substring(0, 4)}年{dateStr.substring(4, 6)}月{dateStr.substring(6, 8)}日
          </span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* 左カラム: 九星プロフィール */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-[#4A225D] mb-6 border-b-2 border-purple-100 pb-2">
                宿命の九星プロフィール
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-purple-50 p-6 md:p-10 leading-relaxed text-lg">
                <NineStarDetailedProfile reading={reading} />
              </div>
            </section>

            <section className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border border-purple-100 shadow-sm">
              <h3 className="text-2xl font-bold text-[#5D4264] mb-6 flex items-center">
                <span className="mr-3 text-3xl">💡</span> 今日のアドバイス
              </h3>
              <div className="text-lg text-gray-700 leading-loose space-y-4">
                <p>
                  九星気学では、自身の性質（宿命）を知るだけでなく、日々変化するエネルギー（運気）の流れに乗ることが重要です。
                </p>
                <p className="bg-white/60 p-4 rounded-xl border border-purple-50">
                  今日は特に 
                  <strong className="text-purple-700 text-xl mx-2">
                    {directionalReading?.summary.match(/吉方位は(.*?)[。]/)?.[1] || "東"}
                  </strong> 
                  の方位にパワーが宿っています。この方位を意識して行動することで、良運を引き寄せることができるでしょう。
                </p>
              </div>
            </section>
          </div>

          {/* 右カラム: 今日の方位盤 */}
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#4A225D] mb-6 flex items-center">
                <span className="mr-2">🧭</span> 後天定位盤上の位置
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-purple-50 p-6">
                {directionalReading && (
                  <div className="space-y-8">
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                      {(["year", "month", "day"] as const).map((b) => (
                        <button
                          key={b}
                          onClick={() => setActiveBoard(b)}
                          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                            activeBoard === b
                              ? "bg-white text-[#4A225D] shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {b === "year" ? "年盤" : b === "month" ? "月盤" : "日盤"}
                        </button>
                      ))}
                    </div>

                    <LoshuBoard
                      layout={directionalReading.loshuBoards[activeBoard]}
                      title={`${activeBoard === "year" ? "年" : activeBoard === "month" ? "月" : "日"}の盤面`}
                      selectedDirection={selectedDirection}
                      onDirectionClick={(dir) => setSelectedDirection(dir as DirectionKey)}
                    />

                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <h4 className="font-bold text-gray-800 mb-4 px-2">方位の判定結果</h4>
                      <DirectionList
                        directions={directionalReading.directions}
                        honmeiStar={reading.honmei}
                        boardType={activeBoard}
                        onDirectionSelect={(dir) => setSelectedDirection(dir as DirectionKey)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
