/**
 * 方位学の詳細説明システム
 * 伝統的な九星気学の本質的な教えに基づく解説
 */

import type { DirectionAnalysis } from './calculator';
import { STAR_NAMES, ELEMENT_MAP } from '../nine-star-ki/constants';

/**
 * 五行の本質的な意味
 */
export const ELEMENT_ESSENCE = {
  水: {
    nature: '水は万物の源、生命の根源',
    quality: '柔軟性、適応力、知恵、深淵',
    symbolism: '北の方位を象徴し、冬の季節、真夜中の静寂を表す',
    power: '水は上から下へ流れ、あらゆる隙間に浸透する。障害物を避けて迂回し、最終的には海に至る'
  },
  木: {
    nature: '木は成長と発展の象徴',
    quality: '成長力、伸展性、創造力、向上心',
    symbolism: '東の方位を象徴し、春の季節、朝の目覚めを表す',
    power: '木は地に根を張り、天に向かって伸びる。生命力に満ち、万物を育む'
  },
  火: {
    nature: '火は光と熱を放つ陽のエネルギー',
    quality: '情熱、直感力、華やかさ、変化',
    symbolism: '南の方位を象徴し、夏の季節、真昼の輝きを表す',
    power: '火は上昇し、明るく照らす。温かさと活気をもたらすが、制御を誤れば破壊的となる'
  },
  土: {
    nature: '土は万物を育む母なる大地',
    quality: '安定性、信頼性、包容力、生産力',
    symbolism: '中央と四隅を象徴し、季節の変わり目を表す',
    power: '土は全てを受け入れ、育み、実りをもたらす。基盤となり、安定をもたらす'
  },
  金: {
    nature: '金は収穫と完成の象徴',
    quality: '実行力、決断力、完璧性、正義',
    symbolism: '西の方位を象徴し、秋の季節、夕暮れの成熟を表す',
    power: '金は固く、形を変えず、価値を保つ。物事を結実させ、完成に導く'
  }
};

/**
 * 五行の相生関係の詳細説明
 */
export const GENERATION_EXPLANATIONS: Record<string, { relationship: string; effect: string; traditional: string }> = {
  '木→火': {
    relationship: '木生火',
    effect: '木は燃えて火となる。あなたの成長エネルギーが情熱と行動力を生み出します。',
    traditional: '「木は火を生ず」- 木材が燃えて火を起こすように、成長の力が新たな情熱を生み出す。この方位への移動は、停滞を打破し、新しい活力を得る助けとなります。'
  },
  '火→土': {
    relationship: '火生土',
    effect: '火は燃え尽きて灰（土）となる。あなたの情熱が具体的な成果を生み出します。',
    traditional: '「火は土を生ず」- 火が燃え尽きて灰となり、大地を豊かにするように、熱意と行動が実際の成果として結実する。この方位は、夢を現実化する力を与えてくれます。'
  },
  '土→金': {
    relationship: '土生金',
    effect: '土の中から金属が生まれる。あなたの努力が価値ある成果として結晶化します。',
    traditional: '「土は金を生ず」- 大地の中で鉱物が育つように、地道な努力が確実な成果を生む。この方位は、積み重ねてきたものが形となる時期を示します。'
  },
  '金→水': {
    relationship: '金生水',
    effect: '金属の表面に水滴が結ぶ。あなたの実行力が深い知恵を生み出します。',
    traditional: '「金は水を生ず」- 金属の冷たさが空気中の水分を凝結させるように、完成されたものから新たな知恵が生まれる。この方位は、経験を智慧に変える力を与えます。'
  },
  '水→木': {
    relationship: '水生木',
    effect: '水は木を育てる。あなたの知恵が新たな成長の源となります。',
    traditional: '「水は木を生ず」- 水が草木を育むように、深い洞察が新しい発展をもたらす。この方位は、内なる知恵を外に表現する力を与えてくれます。'
  }
};

/**
 * 五行の相剋関係の詳細説明
 */
export const CONTROLLING_EXPLANATIONS: Record<string, { relationship: string; effect: string; traditional: string }> = {
  '木→土': {
    relationship: '木剋土',
    effect: '木は土から養分を奪う。エネルギーの消耗が起こりやすい関係です。',
    traditional: '「木は土を剋す」- 樹木が大地の養分を吸い取るように、あなたのエネルギーが消耗される可能性があります。慎重な行動が求められます。'
  },
  '土→水': {
    relationship: '土剋水',
    effect: '土は水を堰き止める。流れが阻害される関係です。',
    traditional: '「土は水を剋す」- 土が水の流れを止めるように、計画や思考が停滞する恐れがあります。柔軟性を失わないよう注意が必要です。'
  },
  '水→火': {
    relationship: '水剋火',
    effect: '水は火を消す。情熱や活力が削がれる関係です。',
    traditional: '「水は火を剋す」- 水が火を消すように、あなたの情熱や行動力が抑制される可能性があります。慎重さが過度になり、チャンスを逃す恐れがあります。'
  },
  '火→金': {
    relationship: '火剋金',
    effect: '火は金属を溶かす。確実性や安定性が損なわれる関係です。',
    traditional: '「火は金を剋す」- 火が金属を溶かすように、計画的な行動が感情に流される恐れがあります。冷静さを保つことが重要です。'
  },
  '金→木': {
    relationship: '金剋木',
    effect: '金属は木を切る。成長や発展が阻害される関係です。',
    traditional: '「金は木を剋す」- 斧が樹木を切り倒すように、成長の芽が摘まれる可能性があります。新しい挑戦には不向きな方位です。'
  }
};

/**
 * 殺の詳細な説明
 */
export const SATSU_DETAILED_EXPLANATIONS: Record<string, {
  essence: string;
  mechanism: string;
  effects: string[];
  traditional: string;
  remedy: string;
}> = {
  gooh: {
    essence: '五黄殺は九星気学における最強の凶殺',
    mechanism: '五黄土星は中央に位置し、全てを統べる帝王の星。その強大なエネルギーが方位に出ると、周囲のバランスを崩し、予期せぬトラブルを引き起こします。',
    effects: [
      '突発的な災難や事故',
      '人間関係のトラブル、争い',
      '金銭的な損失',
      '健康面での悪化',
      '計画の頓挫や失敗'
    ],
    traditional: '古来より「五黄の方位は動くべからず」と伝えられています。五黄土星の破壊的なエネルギーは、腐敗を意味し、万物を枯らすとされています。',
    remedy: 'どうしてもこの方位に向かう必要がある場合は、方位除けの祈祷を受ける、または別の吉方位を経由して向かうなどの対策が必要です。'
  },
  anken: {
    essence: '暗剣殺は五黄殺の対極に位置する凶殺',
    mechanism: '五黄殺が「攻め」の凶であるのに対し、暗剣殺は「受け身」の凶。予期せぬ災難が降りかかるとされます。',
    effects: [
      '予期せぬトラブルや災難',
      '他者からの攻撃や裏切り',
      '突然の病気や怪我',
      '盗難や詐欺に遭う',
      '思わぬ障害や妨害'
    ],
    traditional: '「暗剣は闇より来たりて身を刺す」- 見えない場所から突然災いが襲ってくる象徴です。自分からは何もしなくても、向こうから災難がやってくる恐れがあります。',
    remedy: '慎重な行動を心がけ、契約や約束事は特に注意深く確認してください。信頼できる人からのアドバイスを求めることも大切です。'
  },
  honmei: {
    essence: '本命殺は自分の本命星がある方位で起こる個人的な凶殺',
    mechanism: '自分の星が回座する方位に向かうことは、自己のエネルギーと正面衝突することを意味します。',
    effects: [
      '判断力の低下',
      '体調不良や疲労の蓄積',
      '自信過剰による失敗',
      'ストレスの増大',
      '本来の実力が発揮できない'
    ],
    traditional: '「己の星に向かうは、鏡に映る己と対峙するが如し」- 自分自身との内面的な葛藤が生じやすくなります。',
    remedy: '重要な決断は避け、静かに過ごすことをお勧めします。自己を見つめ直す期間として捉えることもできます。'
  },
  honmeiteki: {
    essence: '本命的殺は本命殺の対極方位で起こる副次的な凶殺',
    mechanism: '本命殺ほど強くはありませんが、自分のエネルギーとの不調和が起こります。',
    effects: [
      '計画の遅延',
      '予期せぬ変更',
      '小さなトラブルの連続',
      '疲れやすさ',
      '集中力の欠如'
    ],
    traditional: '本命殺の影響が間接的に現れる方位。大きな災難ではないものの、小さな障害が重なりやすいとされています。',
    remedy: '余裕を持ったスケジュールを組み、無理をしないことが大切です。'
  },
  saiha: {
    essence: '歳破はその年特有の凶方位',
    mechanism: '年の中宮星の対極方位で、その年のエネルギーと反発します。',
    effects: [
      '計画の破綻',
      '関係の破壊',
      '金銭的な損失',
      '信用の失墜',
      '長期的な悪影響'
    ],
    traditional: '「歳破の方位は、その年の運気を破る」- 特に年単位の大きな計画（引っ越し、転職、結婚など）には不向きです。',
    remedy: '年が変わるまで待つか、別の方位を選択してください。どうしても必要な場合は、専門家に相談することをお勧めします。'
  }
};

/**
 * 年盤・月盤・日盤の意味と使い分け
 */
export const BOARD_EXPLANATIONS = {
  year: {
    title: '年盤（年命盤）',
    meaning: '1年間を通じての基本的な方位の吉凶を示します',
    importance: '最も重要な盤で、引っ越しや転職など人生の大きな決断に用います',
    duration: '立春から翌年の節分までの1年間有効',
    usage: [
      '引っ越し、転居の方位決定',
      '転職、就職の方向性',
      '結婚、開業などの重要決定',
      '長期的な運気の流れを見る'
    ],
    traditional: '「年の方位は命を左右す」- 年盤の凶方位への引っ越しは、数年にわたる影響を及ぼすとされています。'
  },
  month: {
    title: '月盤（月命盤）',
    meaning: '1ヶ月間の方位の吉凶を示します',
    importance: '中期的な行動計画に用い、年盤を補完します',
    duration: '節入り日から次の節入り日までの約1ヶ月間有効',
    usage: [
      '1ヶ月程度の旅行',
      '短期的な出張',
      '契約や商談の方向',
      '月単位のプロジェクト'
    ],
    traditional: '「月の方位は事を決す」- その月の活動において、月盤の吉方位を選ぶことで成功率が高まります。'
  },
  day: {
    title: '日盤（日命盤）',
    meaning: 'その日の方位の吉凶を示します',
    importance: '日常的な行動や短期的な移動に用います',
    duration: 'その日1日のみ有効',
    usage: [
      '日帰り旅行',
      '買い物や外出の方向',
      '重要な訪問の方位',
      '面接や商談の場所選び'
    ],
    traditional: '「日の方位は機を捉う」- 日盤の吉方位を活用することで、日々の運気を高めることができます。'
  }
};

/**
 * 方位の詳細説明を生成
 */
export function generateDetailedExplanation(
  analysis: DirectionAnalysis,
  honmeiStar: number
): {
  essence: string;
  elementAnalysis: string;
  satsuExplanation: string | null;
  luckyAspect: string | null;
  traditionalWisdom: string;
  recommendation: string;
} {
  const honmeiElement = ELEMENT_MAP[honmeiStar];
  const directionElement = ELEMENT_MAP[analysis.yearStar];

  // 五行の本質
  const essence = `${DIRECTIONS[analysis.direction]}方位には${STAR_NAMES[analysis.yearStar]}（${directionElement}）が回座しています。${ELEMENT_ESSENCE[directionElement].nature}。`;

  // 五行の関係分析
  let elementAnalysis = '';
  const elementKey = `${honmeiElement}→${directionElement}`;
  const reverseKey = `${directionElement}→${honmeiElement}`;

  if (GENERATION_EXPLANATIONS[elementKey]) {
    const gen = GENERATION_EXPLANATIONS[elementKey];
    elementAnalysis = `【相生の関係】\n${gen.relationship}: ${gen.effect}\n\n${gen.traditional}`;
  } else if (GENERATION_EXPLANATIONS[reverseKey]) {
    const gen = GENERATION_EXPLANATIONS[reverseKey];
    elementAnalysis = `【相生の関係（受ける）】\n${gen.relationship}: この方位のエネルギーがあなたを助けます。\n\n${gen.traditional}`;
  } else if (CONTROLLING_EXPLANATIONS[elementKey]) {
    const ctrl = CONTROLLING_EXPLANATIONS[elementKey];
    elementAnalysis = `【相剋の関係】\n${ctrl.relationship}: ${ctrl.effect}\n\n${ctrl.traditional}`;
  } else if (CONTROLLING_EXPLANATIONS[reverseKey]) {
    const ctrl = CONTROLLING_EXPLANATIONS[reverseKey];
    elementAnalysis = `【相剋の関係（受ける）】\n${ctrl.relationship}: この方位のエネルギーから圧力を受けます。\n\n${ctrl.traditional}`;
  } else if (honmeiElement === directionElement) {
    elementAnalysis = `【同じ五行】\n比和の関係: 同じ性質のエネルギーが集まります。適度であれば力となりますが、過度になると偏りが生じます。`;
  }

  // 殺の説明
  let satsuExplanation: string | null = null;
  if (analysis.satsu) {
    const satsuDetail = SATSU_DETAILED_EXPLANATIONS[analysis.satsu.type];
    if (satsuDetail) {
      satsuExplanation = `【${analysis.satsu.name}】\n${satsuDetail.essence}\n\n${satsuDetail.mechanism}\n\n影響:\n${satsuDetail.effects.map(e => `• ${e}`).join('\n')}\n\n${satsuDetail.traditional}\n\n対策: ${satsuDetail.remedy}`;
    }
  }

  // 吉方位の説明
  let luckyAspect: string | null = null;
  if (analysis.isLucky && !analysis.satsu) {
    luckyAspect = `この方位はあなたにとって吉方位です。${directionElement}のエネルギーがあなたの運気を高めてくれます。\n\n${ELEMENT_ESSENCE[directionElement].power}`;
  }

  // 伝統的な智慧
  const traditionalWisdom = ELEMENT_ESSENCE[directionElement].symbolism;

  // 推奨事項
  let recommendation = '';
  if (analysis.score >= 80) {
    recommendation = 'この方位への移動や新規事業の開始に最適です。積極的に活用してください。';
  } else if (analysis.score >= 60) {
    recommendation = 'この方位は良い選択です。通常の活動において問題ありません。';
  } else if (analysis.score >= 40) {
    recommendation = '普通の方位です。特別な利益は期待できませんが、大きな問題もありません。';
  } else if (analysis.score >= 20) {
    recommendation = '注意が必要な方位です。重要な決定は避け、慎重に行動してください。';
  } else {
    recommendation = 'この方位は避けるべきです。どうしても必要な場合は、十分な対策を講じてください。';
  }

  return {
    essence,
    elementAnalysis,
    satsuExplanation,
    luckyAspect,
    traditionalWisdom,
    recommendation
  };
}

// DirectionsをインポートするためのダミーConstant（実際はconstantsからインポート）
const DIRECTIONS: Record<string, string> = {
  N: '北', NE: '北東', E: '東', SE: '南東',
  S: '南', SW: '南西', W: '西', NW: '北西'
};
