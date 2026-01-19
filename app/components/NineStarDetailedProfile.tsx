"use client";

import React, { useState, useEffect } from "react";
import type { NineStarKiReading } from "@/types/fortune";
import { getPersonalityTraits, getStarInfo, getStarProfile } from "@/lib/fortune/database";
import {
  analyzeHonmeiMonthRelationship,
  analyzeHonmeiDayRelationship,
  analyzeHonmeiMonthRelationshipEnhanced,
  analyzeHonmeiDayRelationshipEnhanced,
  generateKeishaTokaiExplanation,
  generateLifeInterpretation,
  generateLifeInterpretationEnhanced,
} from "@/lib/fortune/nine-star-ki/detailed-explanations";

import type { Database } from "@/lib/db/supabase";

type StarRow = Database["public"]["Tables"]["stars"]["Row"];
type TraitRow = Database["public"]["Tables"]["personality_traits"]["Row"];

// JSONB型の構造定義
interface LifeCycles {
  youth: string;
  middle: string;
  elder: string;
}

interface Remedies {
  colors: string[];
  directions: string[];
  items: string[];
  habits: string[];
  avoidances: string[];
}

interface NineStarDetailedProfileProps {
  reading: NineStarKiReading;
}

export default function NineStarDetailedProfile({
  reading,
}: NineStarDetailedProfileProps) {
  const [activeSection, setActiveSection] = useState<
    "essence" | "relationship" | "keisha" | "life"
  >("essence");
  const [dbKnowledge, setDbKnowledge] = useState<TraitRow | null>(null);
  const [starInfo, setStarInfo] = useState<StarRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 拡張された詳細プロフィールデータ
  const [honmeiProfile, setHonmeiProfile] = useState<TraitRow | null>(null);
  const [monthProfile, setMonthProfile] = useState<TraitRow | null>(null);
  const [dayProfile, setDayProfile] = useState<TraitRow | null>(null);

  useEffect(() => {
    async function loadDbData() {
      setIsLoading(true);
      try {
        const info = await getStarInfo(reading.honmei);
        const traits = await getPersonalityTraits(reading.honmei);
        setStarInfo(info as StarRow);
        setDbKnowledge(traits as TraitRow);

        // 詳細プロフィールデータを取得
        const honmeiProf = await getStarProfile(reading.honmei);
        const monthProf = await getStarProfile(reading.getsumesei);
        const dayProf = await getStarProfile(reading.nichisei);
        setHonmeiProfile(honmeiProf as TraitRow);
        setMonthProfile(monthProf as TraitRow);
        setDayProfile(dayProf as TraitRow);
      } catch (error) {
        console.error("Failed to load DB data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDbData();
  }, [reading.honmei, reading.getsumesei, reading.nichisei]);

  // 拡張版の関数を使用してより詳細で正確な説明を生成
  const monthRelation = analyzeHonmeiMonthRelationshipEnhanced(
    reading.honmei,
    reading.getsumesei,
    honmeiProfile,
    monthProfile
  );
  const dayRelation = analyzeHonmeiDayRelationshipEnhanced(
    reading.honmei,
    reading.nichisei,
    honmeiProfile,
    dayProfile
  );
  const keishaExplanation = generateKeishaTokaiExplanation(reading);
  const lifeInterpretation = generateLifeInterpretationEnhanced(reading, honmeiProfile);

  const sections = [
    { id: "essence" as const, label: "本質", icon: "🌟" },
    { id: "relationship" as const, label: "三命の関係", icon: "☯️" },
    { id: "keisha" as const, label: "傾斜宮・同会星", icon: "🎯" },
    { id: "life" as const, label: "人生の道", icon: "🛤️" },
  ];

  const getHarmonyColor = (harmony: string) => {
    switch (harmony) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "challenging":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* タブナビゲーション */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeSection === section.id
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* 本質 */}
      {activeSection === "essence" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* 核心的性質 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              {reading.starName}の本質
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed mb-4">
              {honmeiProfile?.core_essence || dbKnowledge?.core_essence}
            </p>
            {honmeiProfile && (
              <div className="space-y-3 text-sm text-gray-700">
                {honmeiProfile.cosmic_principle && (
                  <p>
                    <strong>宇宙原理:</strong> {honmeiProfile.cosmic_principle}
                  </p>
                )}
                {honmeiProfile.elemental_reason && (
                  <p>
                    <strong>五行の理由:</strong> {honmeiProfile.elemental_reason}
                  </p>
                )}
                {honmeiProfile.life_direction && (
                  <p>
                    <strong>人生の方向性:</strong> {honmeiProfile.life_direction}
                  </p>
                )}
                {honmeiProfile.inner_nature && (
                  <p>
                    <strong>内面の本質:</strong> {honmeiProfile.inner_nature}
                  </p>
                )}
                {honmeiProfile.spiritual_path && (
                  <p>
                    <strong>精神的な道:</strong> {honmeiProfile.spiritual_path}
                  </p>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white bg-opacity-60 p-4 rounded">
                <h4 className="font-semibold text-purple-800 mb-2">象意</h4>
                <div className="flex flex-wrap gap-2">
                  {(starInfo?.symbolic_meanings || []).map(
                    (s: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="bg-white bg-opacity-60 p-4 rounded">
                <h4 className="font-semibold text-purple-800 mb-2">元素</h4>
                <p className="text-sm text-gray-700">{dbKnowledge?.element}</p>
              </div>
            </div>
          </div>

          {/* アドバイス */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-pink-100 transition-transform hover:scale-[1.01]">
              <h4 className="font-bold text-pink-800 mb-3 flex items-center">
                <span className="mr-2">💼</span>キャリアアドバイス
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {dbKnowledge?.work_style}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-red-100 transition-transform hover:scale-[1.01]">
              <h4 className="font-bold text-red-800 mb-3 flex items-center">
                <span className="mr-2">❤️</span>恋愛アドバイス
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {dbKnowledge?.love_style}
              </p>
            </div>
          </div>

          {/* 性格の詳細 */}
          <div className="bg-white p-6 rounded-lg border-2 border-blue-200 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              性格の詳細分析
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">✨</span>
                  長所・強み
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(honmeiProfile?.strengths || dbKnowledge?.strengths || []).map((strength, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-50 text-green-800 border border-green-200 rounded-full text-sm"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  短所・注意点
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(honmeiProfile?.weaknesses || dbKnowledge?.weaknesses || []).map((weakness, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-full text-sm"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">💎</span>
                  隠れた才能
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(honmeiProfile?.hidden_talents || dbKnowledge?.hidden_talents || []).map((talent, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-sm"
                    >
                      {talent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">人生のテーマ</p>
              <p className="text-sm text-gray-700 italic">
                {honmeiProfile?.life_theme || dbKnowledge?.life_theme}
              </p>
            </div>
          </div>

          {/* 人生の分野別詳細 */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* 仕事 */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">💼</span>
                仕事・キャリア
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">適職:</p>
                  <p className="text-gray-600">
                    {(honmeiProfile?.suitable_jobs || dbKnowledge?.suitable_jobs || []).join("、")}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">働き方:</p>
                  <p className="text-gray-600">{honmeiProfile?.work_style || dbKnowledge?.work_style}</p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="font-semibold text-green-800 text-xs mb-1">
                    成功の秘訣
                  </p>
                  <p className="text-gray-700">{honmeiProfile?.career_success || dbKnowledge?.career_success}</p>
                </div>
              </div>
            </div>

            {/* 恋愛・人間関係 */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">❤️</span>
                恋愛・人間関係
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">恋愛スタイル:</p>
                  <p className="text-gray-600">{honmeiProfile?.love_style || dbKnowledge?.love_style}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">相性:</p>
                  <p className="text-gray-600">{dbKnowledge?.compatibility}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">家庭:</p>
                  <p className="text-gray-600">{honmeiProfile?.family_life || dbKnowledge?.family_life}</p>
                </div>
              </div>
            </div>

            {/* 健康 */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🏥</span>
                健康
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-red-700">注意すべき部位:</p>
                  <p className="text-gray-600">
                    {(honmeiProfile?.health_vulnerabilities || dbKnowledge?.health_vulnerabilities || []).join("、")}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-semibold text-blue-800 text-xs mb-1">
                    健康法
                  </p>
                  <ul className="text-gray-700 space-y-1">
                    {(honmeiProfile?.health_recommendations || dbKnowledge?.health_recommendations || []).map(
                      (rec, i) => (
                        <li key={i}>• {rec}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* 金運 */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">💰</span>
                金運・財運
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">金銭感覚:</p>
                  <p className="text-gray-600">{honmeiProfile?.money_attitude || dbKnowledge?.money_attitude}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="font-semibold text-yellow-800 text-xs mb-1">
                    財の築き方
                  </p>
                  <p className="text-gray-700">
                    {honmeiProfile?.wealth_building || dbKnowledge?.wealth_building}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 伝統的な教え */}
          <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-300">
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📜</span>
              伝統的な教え
            </h3>
            <div className="space-y-2">
              {(honmeiProfile?.traditional_wisdom || dbKnowledge?.traditional_wisdom || []).map((wisdom, i) => (
                <p
                  key={i}
                  className="text-sm text-gray-700 italic border-l-4 border-amber-400 pl-3 py-1"
                >
                  {wisdom}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 三命の関係 */}
      {activeSection === "relationship" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">
              三命の関係性
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              本命星（年命）・月命星・日命星の三つの星の関係性が、あなたの多面的な人格を形成しています。
              それぞれの星がどのように影響し合い、調和しているかを理解することで、より深く自分を知ることができます。
            </p>
          </div>

          <div
            className={`p-6 rounded-lg border-2 ${getHarmonyColor(
              monthRelation.harmony
            )}`}
          >
            <h4 className="text-xl font-bold mb-3">
              本命星 × 月命星: {monthRelation.combination}
            </h4>
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  monthRelation.harmony === "excellent"
                    ? "bg-green-200 text-green-900"
                    : monthRelation.harmony === "good"
                    ? "bg-blue-200 text-blue-900"
                    : monthRelation.harmony === "challenging"
                    ? "bg-orange-200 text-orange-900"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {monthRelation.harmony === "excellent"
                  ? "最高の調和"
                  : monthRelation.harmony === "good"
                  ? "良好な関係"
                  : monthRelation.harmony === "challenging"
                  ? "課題あり"
                  : "中立的"}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {monthRelation.interpretation}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-60 p-4 rounded">
                <h5 className="font-semibold text-green-800 mb-2">強み</h5>
                <ul className="text-sm space-y-1">
                  {monthRelation.strengths.map((s, i) => (
                    <li key={i} className="text-gray-700">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white bg-opacity-60 p-4 rounded">
                <h5 className="font-semibold text-orange-800 mb-2">課題</h5>
                <ul className="text-sm space-y-1">
                  {monthRelation.challenges.map((c, i) => (
                    <li key={i} className="text-gray-700">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white bg-opacity-80 rounded border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                アドバイス
              </p>
              <p className="text-sm text-gray-700">{monthRelation.advice}</p>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg border-2 ${getHarmonyColor(
              dayRelation.harmony
            )}`}
          >
            <h4 className="text-xl font-bold mb-3">
              本命星 × 日命星: {dayRelation.combination}
            </h4>
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  dayRelation.harmony === "excellent"
                    ? "bg-green-200 text-green-900"
                    : dayRelation.harmony === "good"
                    ? "bg-blue-200 text-blue-900"
                    : dayRelation.harmony === "challenging"
                    ? "bg-orange-200 text-orange-900"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {dayRelation.harmony === "excellent"
                  ? "最高の調和"
                  : dayRelation.harmony === "good"
                  ? "良好な関係"
                  : dayRelation.harmony === "challenging"
                  ? "課題あり"
                  : "中立的"}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {dayRelation.interpretation}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-60 p-4 rounded">
                <h5 className="font-semibold text-green-800 mb-2">強み</h5>
                <ul className="text-sm space-y-1">
                  {dayRelation.strengths.map((s, i) => (
                    <li key={i} className="text-gray-700">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white bg-opacity-60 p-4 rounded">
                <h5 className="font-semibold text-orange-800 mb-2">課題</h5>
                <ul className="text-sm space-y-1">
                  {dayRelation.challenges.map((c, i) => (
                    <li key={i} className="text-gray-700">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white bg-opacity-80 rounded border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                アドバイス
              </p>
              <p className="text-sm text-gray-700">{dayRelation.advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* 傾斜宮・同会星 */}
      {activeSection === "keisha" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
            <h3 className="text-2xl font-bold text-indigo-900 mb-3">
              傾斜宮と同会星
            </h3>
            <p className="text-sm text-gray-700">
              これらは九星気学において非常に重要な概念で、あなたの深層心理、潜在的な才能、
              そして人生の最終的な到達点を示すとされています。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-purple-200 shadow-sm">
            <h4 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              傾斜宮とは
            </h4>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              {keishaExplanation.keishakyuMeaning}
            </p>
            <div className="p-4 bg-purple-50 rounded border border-purple-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                {keishaExplanation.keishakyuEffect}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-pink-200 shadow-sm">
            <h4 className="text-xl font-bold text-pink-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">✨</span>
              同会星とは
            </h4>
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">
              {keishaExplanation.dokaiseiMeaning}
            </p>
            <div className="p-4 bg-pink-50 rounded border border-pink-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                {keishaExplanation.dokaiseiEffect}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-300">
            <h4 className="text-xl font-bold text-amber-900 mb-3">
              統合的解釈
            </h4>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">
              {keishaExplanation.combinedInterpretation}
            </p>
            <div className="p-4 bg-white bg-opacity-70 rounded border-l-4 border-amber-500">
              <p className="text-sm text-gray-700 italic leading-relaxed">
                {keishaExplanation.traditionalWisdom}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 人生の道 */}
      {activeSection === "life" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
            <h3 className="text-2xl font-bold text-green-900 mb-3">
              あなたの人生の道
            </h3>
            <p className="text-lg text-gray-800 font-semibold mb-2">
              {lifeInterpretation.lifeTheme}
            </p>
            <p className="text-sm text-gray-700">
              {lifeInterpretation.lifePath}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-blue-800 mb-3">青年期</h4>
              <p className="text-sm text-gray-700">
                {(honmeiProfile?.life_cycles as LifeCycles)?.youth || (dbKnowledge?.life_cycles as LifeCycles)?.youth}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-purple-800 mb-3">中年期</h4>
              <p className="text-sm text-gray-700">
                {(honmeiProfile?.life_cycles as LifeCycles)?.middle || (dbKnowledge?.life_cycles as LifeCycles)?.middle}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-lg text-amber-800 mb-3">晩年期</h4>
              <p className="text-sm text-gray-700">
                {(honmeiProfile?.life_cycles as LifeCycles)?.elder || (dbKnowledge?.life_cycles as LifeCycles)?.elder}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-lg text-orange-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                人生の課題
              </h4>
              <ul className="space-y-2">
                {lifeInterpretation.challenges.map(
                  (challenge: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="mr-2">•</span>
                      <span>{challenge}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-lg text-green-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🌈</span>
                人生の機会
              </h4>
              <ul className="space-y-2">
                {lifeInterpretation.opportunities.map(
                  (opportunity: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="mr-2">•</span>
                      <span>{opportunity}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-indigo-200 shadow-sm">
            <h4 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🌸</span>
              開運法
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-indigo-800 mb-2">
                  取り入れると良いもの
                </h5>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">カラー:</span>{" "}
                    {((honmeiProfile?.remedies as Remedies)?.colors || (dbKnowledge?.remedies as Remedies)?.colors || []).join(
                      "、"
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">方位:</span>{" "}
                    {((honmeiProfile?.remedies as Remedies)?.directions ||
                      (dbKnowledge?.remedies as Remedies)?.directions || []
                    ).join("、")}
                  </p>
                  <p>
                    <span className="font-semibold">アイテム:</span>{" "}
                    {((honmeiProfile?.remedies as Remedies)?.items || (dbKnowledge?.remedies as Remedies)?.items || []).join(
                      "、"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-indigo-800 mb-2">
                  おすすめの習慣
                </h5>
                <ul className="space-y-1 text-sm">
                  {((honmeiProfile?.remedies as Remedies)?.habits || (dbKnowledge?.remedies as Remedies)?.habits || []).map(
                    (habit: string, i: number) => (
                      <li key={i} className="text-gray-700">
                        • {habit}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
