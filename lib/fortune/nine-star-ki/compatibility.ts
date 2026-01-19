/**
 * 九星気学の相性診断
 * 五行の相生・相剋関係に基づく相性分析
 */

import { ELEMENT_MAP, STAR_NAMES } from './constants';

export type CompatibilityLevel = 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';

export interface CompatibilityResult {
  star1: number;
  star2: number;
  star1Name: string;
  star2Name: string;
  level: CompatibilityLevel;
  percentage: number;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  relationship: '相生' | '相剋' | '比和' | '独立';
  elementalExplanation: string;
}

/**
 * 五行の相生関係マップ
 * 木→火→土→金→水→木
 */
const GENERATION_MAP: Record<string, string> = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木'
};

/**
 * 五行の相剋関係マップ
 * 木→土、土→水、水→火、火→金、金→木
 */
const CONTROLLING_MAP: Record<string, string> = {
  '木': '土',
  '土': '水',
  '水': '火',
  '火': '金',
  '金': '木'
};

/**
 * 2つの星の相性を計算
 */
export function calculateCompatibility(star1: number, star2: number): CompatibilityResult {
  const element1 = ELEMENT_MAP[star1];
  const element2 = ELEMENT_MAP[star2];
  const name1 = STAR_NAMES[star1];
  const name2 = STAR_NAMES[star2];

  let level: CompatibilityLevel = 'neutral';
  let percentage = 60;
  let title = '';
  let description = '';
  let strengths: string[] = [];
  let challenges: string[] = [];
  let advice = '';
  let relationship: CompatibilityResult['relationship'] = '独立';
  let elementalExplanation = '';

  // 相生関係の判定
  if (GENERATION_MAP[element1] === element2) {
    // star1がstar2を生じる（支援関係）
    level = 'excellent';
    percentage = 95;
    relationship = '相生';
    title = '最高の相性 - 支援関係';
    description = `${name1}（${element1}）が${name2}（${element2}）を生み出す、理想的な関係です。${name1}の方が自然に${name2}の方を支え、${name2}の方は${name1}の方から大きな恩恵を受けます。`;
    elementalExplanation = `五行において、${element1}は${element2}を生じます。${element1}の性質が${element2}を育て、強めるため、非常に良好な関係が築けます。`;
    strengths = [
      `${name1}が${name2}を自然にサポートできる`,
      '互いの長所が引き出される',
      '協力すると大きな成果が出る',
      `${name2}は${name1}の恩恵を受けて成長する`
    ];
    challenges = [
      `${name2}が${name1}に依存しすぎる可能性`,
      `${name1}が支えすぎて疲弊することも`,
      'バランスを保つ工夫が必要'
    ];
    advice = `${name1}の方は、${name2}の方を支えつつも自立を促すこと。${name2}の方は、感謝の気持ちを忘れず、自分も成長すること。`;

  } else if (GENERATION_MAP[element2] === element1) {
    // star2がstar1を生じる（被支援関係）
    level = 'good';
    percentage = 90;
    relationship = '相生';
    title = '良好な相性 - 被支援関係';
    description = `${name2}（${element2}）が${name1}（${element1}）を支える関係です。${name2}の方が自然に${name1}の方をサポートし、${name1}の方は${name2}の方から力を得ます。`;
    elementalExplanation = `五行において、${element2}は${element1}を生じます。${name1}の方は${name2}の方の支援を受けて力を発揮できます。`;
    strengths = [
      `${name2}が${name1}を支えてくれる`,
      `${name1}は${name2}のおかげで力を発揮できる`,
      '安定した関係が築ける',
      '互いに補完し合える'
    ];
    challenges = [
      `${name1}が${name2}の恩恵を当たり前と思わないこと`,
      `${name2}の負担が大きくなりすぎないよう注意`,
      '対等な関係を意識する'
    ];
    advice = `${name1}の方は、${name2}の方への感謝を忘れずに。${name2}の方は、無理のない範囲でサポートすること。`;

  } else if (CONTROLLING_MAP[element1] === element2) {
    // star1がstar2を剋する（抑制関係）
    level = 'challenging';
    percentage = 45;
    relationship = '相剋';
    title = '課題のある相性 - 抑制関係';
    description = `${name1}（${element1}）が${name2}（${element2}）を抑制する関係です。${name1}の方の存在が、${name2}の方の力を制限してしまう傾向があります。`;
    elementalExplanation = `五行において、${element1}は${element2}を剋します。${name1}の性質が${name2}の性質を抑え込む関係です。`;
    strengths = [
      `${name1}が${name2}を導く機会がある`,
      '緊張感のある刺激的な関係',
      `${name2}の成長を促すこともある`,
      '互いに学び合える'
    ];
    challenges = [
      `${name2}が本来の力を発揮しにくい`,
      `${name1}が支配的になりやすい`,
      '対立や摩擦が生じやすい',
      `${name2}がストレスを感じることも`
    ];
    advice = `${name1}の方は、${name2}の方の個性を尊重し、抑圧しないよう意識を。${name2}の方は、自分らしさを大切にしながら、${name1}の方から学ぶ姿勢を。意識的に互いを理解し合う努力が必要です。`;

  } else if (CONTROLLING_MAP[element2] === element1) {
    // star2がstar1を剋する（被抑制関係）
    level = 'difficult';
    percentage = 40;
    relationship = '相剋';
    title = '困難な相性 - 被抑制関係';
    description = `${name2}（${element2}）が${name1}（${element1}）を抑制する関係です。${name2}の方の存在が、${name1}の方の力を制限してしまいます。`;
    elementalExplanation = `五行において、${element2}は${element1}を剋します。${name1}の方は${name2}の方から圧力を感じやすい関係です。`;
    strengths = [
      `${name1}の成長を促す試練となる`,
      `${name2}から学ぶことが多い`,
      '克服すれば強くなれる',
      '緊張感が成長につながる'
    ];
    challenges = [
      `${name1}が本来の力を発揮しにくい`,
      `${name2}の影響が強すぎることも`,
      '自信を失いやすい',
      'ストレスが溜まりやすい'
    ];
    advice = `${name1}の方は、自分の軸を持ち、${name2}の方に流されすぎないこと。${name2}の方は、${name1}の方を尊重し、圧倒しないよう配慮を。互いの違いを認め合うことが重要です。`;

  } else if (element1 === element2) {
    // 同じ五行（比和）
    level = 'good';
    percentage = 85;
    relationship = '比和';
    title = '良好な相性 - 同じ性質';
    description = `${name1}と${name2}は同じ${element1}の性質を持ちます。価値観や考え方が似ており、理解し合いやすい関係です。`;
    elementalExplanation = `同じ五行同士の「比和」の関係です。似た性質を持つため、共感し合いやすく、協力しやすい関係です。`;
    strengths = [
      '価値観が似ている',
      '理解し合いやすい',
      '協力すると大きな力になる',
      '一体感が生まれやすい',
      '安心できる関係'
    ];
    challenges = [
      '似すぎて刺激が少ない',
      '同じ欠点を持つことも',
      '偏った方向に進みやすい',
      '互いに甘えすぎることも'
    ];
    advice = `似た性質を持つ強みを活かしながら、他の五行の要素も意識的に取り入れることで、よりバランスの取れた関係になります。お互いを高め合う意識を持ちましょう。`;

  } else {
    // その他の関係（独立）
    level = 'neutral';
    percentage = 70;
    relationship = '独立';
    title = '中立的な相性 - 独立関係';
    description = `${name1}（${element1}）と${name2}（${element2}）は、互いに直接的な影響を与え合わない関係です。それぞれが独立した個性を持ちます。`;
    elementalExplanation = `五行において、直接的な相生・相剋関係にはありません。互いに独立した性質を持ち、干渉し合いません。`;
    strengths = [
      '互いの個性を尊重できる',
      '自由な関係を築ける',
      '多様性が生まれる',
      '新しい発見がある'
    ];
    challenges = [
      '理解し合うのに時間がかかる',
      '価値観の違いに戸惑うことも',
      'コミュニケーションの工夫が必要',
      '共通点を見つけにくい'
    ];
    advice = `違いを楽しみ、互いから学ぶ姿勢を持ちましょう。それぞれの個性を活かしながら、共通の目標を見つけることで、素晴らしい関係が築けます。`;
  }

  return {
    star1,
    star2,
    star1Name: name1,
    star2Name: name2,
    level,
    percentage,
    title,
    description,
    strengths,
    challenges,
    advice,
    relationship,
    elementalExplanation
  };
}

/**
 * 相性レベルに応じた色を取得
 */
export function getCompatibilityColor(level: CompatibilityLevel): string {
  switch (level) {
    case 'excellent':
      return 'bg-green-100 border-green-300 text-green-900';
    case 'good':
      return 'bg-blue-100 border-blue-300 text-blue-900';
    case 'neutral':
      return 'bg-gray-100 border-gray-300 text-gray-900';
    case 'challenging':
      return 'bg-orange-100 border-orange-300 text-orange-900';
    case 'difficult':
      return 'bg-red-100 border-red-300 text-red-900';
  }
}

/**
 * 相性レベルに応じたバッジ色を取得
 */
export function getCompatibilityBadgeColor(level: CompatibilityLevel): string {
  switch (level) {
    case 'excellent':
      return 'bg-green-500 text-white';
    case 'good':
      return 'bg-blue-500 text-white';
    case 'neutral':
      return 'bg-gray-500 text-white';
    case 'challenging':
      return 'bg-orange-500 text-white';
    case 'difficult':
      return 'bg-red-500 text-white';
  }
}
