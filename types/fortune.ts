/**
 * 占いシステムの型定義
 */

// 九星気学の型定義
export interface NineStarKiProfile {
  honmei: number;        // 本命星（年命）- 基本性格
  getsumesei: number;    // 月命星（月生命）- 内面・才能
  nichisei: number;      // 日命星（日）- 行動パターン
  keishakyu: number;     // 傾斜宮 - 本命星の定位置
  dokaisei: number;      // 同会星 - 本命星と同居する星
}

export interface NineStarKiReading extends NineStarKiProfile {
  starName: string;              // 星の名前（一白水星など）
  element: '水' | '土' | '木' | '金' | '火';  // 五行
  characteristics: string[];      // 性格の特徴
  luckyColors: string[];         // ラッキーカラー
  luckyDirections: string[];     // ラッキー方位
  monthStarName: string;         // 月命星の名前
  dayStarName: string;           // 日命星の名前
  interpretation: {
    personality: string;          // 性格解釈
    talents: string;              // 才能解釈
    tendencies: string;           // 傾向解釈
  };
}

// 方位学の型定義
export type DirectionQuality = 'excellent' | 'good' | 'neutral' | 'caution' | 'avoid';

export interface DirectionReading {
  direction: string;  // N, NE, E, SE, S, SW, W, NW
  quality: DirectionQuality;
  reason: string;
  recommendations: string[];
}

export interface DirectionalFortune {
  daily: DirectionReading[];
  monthly: DirectionReading[];
  yearly: DirectionReading[];
}

// 風水の型定義
export interface FengShuiReading {
  sector: string;
  element: string;
  energyLevel: number;  // 1-100
  recommendations: {
    colors: string[];
    objects: string[];
    activities: string[];
    avoid: string[];
  };
}

export interface FengShuiAnalysis {
  yearlyEnergy: FengShuiReading[];
  personalEnergy: {
    wealth: number;       // 財運
    health: number;       // 健康運
    relationships: number; // 人間関係運
    career: number;       // 仕事運
  };
  recommendations: string[];
}

// 総合運勢の型定義
export interface DailyFortune {
  date: Date;
  nineStarReading: NineStarKiReading;
  directionalReading: DirectionalFortune;
  fengShuiReading: FengShuiAnalysis;
  overallScore: number;  // 0-100
  luckyDirection: string;
  luckyColor: string;
  advice: string;
}

// ユーザープロフィールの型定義
export interface UserProfile {
  id: string;
  fullName: string;
  birthDate: Date;
  birthTime?: Date;
  zodiacSign: string;  // 干支
  nineStarKi: NineStarKiProfile;
  createdAt: Date;
}
