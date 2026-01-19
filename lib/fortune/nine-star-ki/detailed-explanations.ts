/**
 * 九星気学の詳細説明システム
 * 伝統的な教えに基づく本質的な解説
 * データベースの詳細な知識ベース（star_profiles）を活用
 */

import type { NineStarKiReading } from '@/types/fortune';
import { STAR_NAMES, ELEMENT_MAP } from './constants';
import type { PersonalityTraits } from '@/lib/fortune/database';

/**
 * 本命星・月命星・日命星の関係性の説明
 */
export interface StarRelationship {
  combination: string;
  harmony: 'excellent' | 'good' | 'neutral' | 'challenging';
  interpretation: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

/**
 * 傾斜宮と同会星の詳細説明
 */
export interface KeishaTokaiExplanation {
  keishakyuMeaning: string;
  keishakyuEffect: string;
  dokaiseiMeaning: string;
  dokaiseiEffect: string;
  combinedInterpretation: string;
  traditionalWisdom: string;
}

/**
 * 本命星と月命星の関係性を分析（拡張版）
 * データベースの詳細プロフィールを活用してより具体的な分析を提供
 */
export function analyzeHonmeiMonthRelationshipEnhanced(
  honmei: number,
  month: number,
  honmeiProfile: PersonalityTraits | null,
  monthProfile: PersonalityTraits | null
): StarRelationship {
  const honmeiElement = ELEMENT_MAP[honmei];
  const monthElement = ELEMENT_MAP[month];
  const honmeiName = STAR_NAMES[honmei];
  const monthName = STAR_NAMES[month];

  let harmony: StarRelationship['harmony'] = 'neutral';
  let interpretation = '';
  let strengths: string[] = [];
  let challenges: string[] = [];
  let advice = '';

  // 相生関係の判定
  const generationMap: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  // 相剋関係の判定
  const controllingMap: Record<string, string> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };

  if (generationMap[honmeiElement] === monthElement) {
    // 本命星が月命星を生じる
    harmony = 'excellent';
    interpretation = honmeiProfile?.cosmic_principle
      ? `${honmeiName}（${honmeiProfile.cosmic_principle}）が${monthName}（内面）を生み出す理想的な関係です。${honmeiProfile.elemental_reason || '外に表れる性格が、内面の才能を自然に引き出します。'}`
      : `${honmeiName}（表面）が${monthName}（内面）を生み出す、理想的な関係です。外に表れる性格が、内面の才能を自然に引き出します。`;

    // データベースから実際の強みを使用
    strengths = honmeiProfile?.strengths
      ? [...(honmeiProfile.strengths.slice(0, 3) as string[]), '表面と内面が調和している']
      : ['表面と内面が調和している', '自然体で才能を発揮できる', '外向きのエネルギーが内なる力を育む'];

    challenges = honmeiProfile?.weaknesses?.slice(0, 2) as string[] || ['才能が溢れすぎて散漫になることも', '内面のエネルギーを使いすぎる傾向'];

    advice = honmeiProfile?.career_success
      ? `${honmeiProfile.career_success}を意識しながら、内面のエネルギーを適度に休ませることも忘れずに。`
      : '自然な流れを大切にしながら、内面のエネルギーを適度に休ませることも忘れずに。';

  } else if (generationMap[monthElement] === honmeiElement) {
    // 月命星が本命星を生じる
    harmony = 'good';
    interpretation = monthProfile?.inner_nature
      ? `${monthName}（${monthProfile.inner_nature}）が${honmeiName}（表面）を支える関係です。内なる才能が、外に表れる行動を後押しします。`
      : `${monthName}（内面）が${honmeiName}（表面）を支える関係です。内なる才能が、外に表れる行動を後押しします。`;

    strengths = monthProfile?.hidden_talents
      ? [...(monthProfile.hidden_talents.slice(0, 2) as string[]), '内面の力が外面を支える', '精神的な充実が行動力につながる']
      : ['内面の力が外面を支える', '隠れた才能が表の活動を助ける', '精神的な充実が行動力につながる'];

    challenges = ['内面の豊かさが外に伝わりにくい', '本当の自分を理解されにくい'];

    advice = honmeiProfile?.life_theme
      ? `${honmeiProfile.life_theme}を表現する工夫をすると、より理解されやすくなります。`
      : '内面の豊かさを言葉や行動で表現する工夫をすると、より理解されやすくなります。';

  } else if (controllingMap[honmeiElement] === monthElement) {
    // 本命星が月命星を剋する
    harmony = 'challenging';
    interpretation = `${honmeiName}（表面）が${monthName}（内面）を抑制する関係です。表に出る姿が、本来の才能を抑え込んでしまう傾向があります。`;

    strengths = honmeiProfile?.strengths?.slice(0, 2) as string[] || ['表面と内面のギャップが個性となる', '内面を守る強さがある'];

    challenges = monthProfile?.weaknesses
      ? [...(monthProfile.weaknesses.slice(0, 2) as string[]), '本当の自分を出しにくい', '表面と内面の葛藤がストレスに']
      : ['本当の自分を出しにくい', '才能を発揮する機会が限られる', '表面と内面の葛藤がストレスに'];

    advice = monthProfile?.hidden_talents
      ? `意識的に${monthProfile.hidden_talents[0]}などの才能を表現する場を作りましょう。信頼できる人の前では素の自分を出すことが大切です。`
      : '意識的に内面の才能を表現する場を作りましょう。信頼できる人の前では素の自分を出すことが大切です。';

  } else if (controllingMap[monthElement] === honmeiElement) {
    // 月命星が本命星を剋する
    harmony = 'challenging';
    interpretation = `${monthName}（内面）が${honmeiName}（表面）を抑える関係です。内面の思いが強すぎて、外への表現を難しくします。`;

    strengths = ['深い内省力', '表面的でない深い生き方', '簡単には動じない芯の強さ'];
    challenges = ['行動に移すのに時間がかかる', '内面で悩みすぎる傾向', '思っていることを表現しにくい'];

    advice = honmeiProfile?.work_style
      ? `${honmeiProfile.work_style}を意識して、考えすぎず小さなことから行動に移す習慣を。`
      : '考えすぎず、小さなことから行動に移す習慣を。内面の豊かさは宝ですが、外に出すことで初めて他者と共有できます。';

  } else if (honmeiElement === monthElement) {
    // 同じ五行
    harmony = 'good';
    interpretation = honmeiProfile?.core_essence
      ? `${honmeiName}と${monthName}は同じ${honmeiElement}の性質を持ちます。${honmeiProfile.core_essence}という本質が、表面と内面で統一されています。`
      : `${honmeiName}と${monthName}は同じ${honmeiElement}の性質を持ちます。表面と内面が統一され、一貫性のある人格を形成します。`;

    strengths = honmeiProfile?.strengths?.slice(0, 4) as string[] || ['表裏のない性格', '一貫性のある生き方', '自分の軸がぶれない', '周囲から信頼されやすい'];
    challenges = ['同じ性質が強すぎる場合も', '柔軟性に欠ける面がある', '偏りが生じやすい'];

    advice = `${honmeiElement}の長所を活かしつつ、他の五行の要素も意識的に取り入れるとバランスが良くなります。`;

  } else {
    // その他の関係
    harmony = 'neutral';
    interpretation = honmeiProfile?.inner_nature && monthProfile?.inner_nature
      ? `${honmeiName}（${honmeiProfile.inner_nature}）と${monthName}（${monthProfile.inner_nature}）は独立した関係です。多面的な人格を形成します。`
      : `${honmeiName}と${monthName}は独立した関係です。表面と内面が異なる個性を持ち、多面的な人格を形成します。`;

    strengths = [
      ...(honmeiProfile?.hidden_talents?.slice(0, 2) as string[] || ['多様な才能を持つ']),
      '状況に応じて使い分けられる'
    ];
    challenges = ['自分自身を理解するのに時間がかかる', '周囲から複雑に見られることも'];

    advice = honmeiProfile?.spiritual_path
      ? `${honmeiProfile.spiritual_path}を意識しながら、表面と内面の両方の良さを統合していきましょう。`
      : '表面と内面の両方の良さを認め、統合していくことで、より豊かな人生を送れます。';
  }

  return {
    combination: `${honmeiName} × ${monthName}`,
    harmony,
    interpretation,
    strengths,
    challenges,
    advice
  };
}

/**
 * 本命星と月命星の関係性を分析（従来版）
 * 後方互換性のために残す
 */
export function analyzeHonmeiMonthRelationship(honmei: number, month: number): StarRelationship {
  const honmeiElement = ELEMENT_MAP[honmei];
  const monthElement = ELEMENT_MAP[month];
  const honmeiName = STAR_NAMES[honmei];
  const monthName = STAR_NAMES[month];

  let harmony: StarRelationship['harmony'] = 'neutral';
  let interpretation = '';
  let strengths: string[] = [];
  let challenges: string[] = [];
  let advice = '';

  // 相生関係の判定
  const generationMap: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  // 相剋関係の判定
  const controllingMap: Record<string, string> = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };

  if (generationMap[honmeiElement] === monthElement) {
    // 本命星が月命星を生じる
    harmony = 'excellent';
    interpretation = `${honmeiName}（表面）が${monthName}（内面）を生み出す、理想的な関係です。外に表れる性格が、内面の才能を自然に引き出します。`;
    strengths = [
      '表面と内面が調和している',
      '自然体で才能を発揮できる',
      '外向きのエネルギーが内なる力を育む',
      '周囲から見た印象と本当の自分が一致しやすい'
    ];
    challenges = [
      '才能が溢れすぎて散漫になることも',
      '内面のエネルギーを使いすぎる傾向'
    ];
    advice = '自然な流れを大切にしながら、内面のエネルギーを適度に休ませることも忘れずに。';
  } else if (generationMap[monthElement] === honmeiElement) {
    // 月命星が本命星を生じる
    harmony = 'good';
    interpretation = `${monthName}（内面）が${honmeiName}（表面）を支える関係です。内なる才能が、外に表れる行動を後押しします。`;
    strengths = [
      '内面の力が外面を支える',
      '隠れた才能が表の活動を助ける',
      '精神的な充実が行動力につながる',
      '内から湧き出る力で生きられる'
    ];
    challenges = [
      '内面の豊かさが外に伝わりにくい',
      '本当の自分を理解されにくい'
    ];
    advice = '内面の豊かさを言葉や行動で表現する工夫をすると、より理解されやすくなります。';
  } else if (controllingMap[honmeiElement] === monthElement) {
    // 本命星が月命星を剋する
    harmony = 'challenging';
    interpretation = `${honmeiName}（表面）が${monthName}（内面）を抑制する関係です。表に出る姿が、本来の才能を抑え込んでしまう傾向があります。`;
    strengths = [
      '表面と内面のギャップが個性となる',
      '内面を守る強さがある',
      '簡単には本心を見せない慎重さ'
    ];
    challenges = [
      '本当の自分を出しにくい',
      '才能を発揮する機会が限られる',
      '表面と内面の葛藤がストレスに',
      '周囲に誤解されやすい'
    ];
    advice = '意識的に内面の才能を表現する場を作りましょう。信頼できる人の前では素の自分を出すことが大切です。';
  } else if (controllingMap[monthElement] === honmeiElement) {
    // 月命星が本命星を剋する
    harmony = 'challenging';
    interpretation = `${monthName}（内面）が${honmeiName}（表面）を抑える関係です。内面の思いが強すぎて、外への表現を難しくします。`;
    strengths = [
      '深い内省力',
      '表面的でない深い生き方',
      '簡単には動じない芯の強さ'
    ];
    challenges = [
      '行動に移すのに時間がかかる',
      '内面で悩みすぎる傾向',
      '思っていることを表現しにくい',
      '周囲からは控えめに見られる'
    ];
    advice = '考えすぎず、小さなことから行動に移す習慣を。内面の豊かさは宝ですが、外に出すことで初めて他者と共有できます。';
  } else if (honmeiElement === monthElement) {
    // 同じ五行
    harmony = 'good';
    interpretation = `${honmeiName}と${monthName}は同じ${honmeiElement}の性質を持ちます。表面と内面が統一され、一貫性のある人格を形成します。`;
    strengths = [
      '表裏のない性格',
      '一貫性のある生き方',
      '自分の軸がぶれない',
      '周囲から信頼されやすい'
    ];
    challenges = [
      '同じ性質が強すぎる場合も',
      '柔軟性に欠ける面がある',
      '偏りが生じやすい'
    ];
    advice = `${honmeiElement}の長所を活かしつつ、他の五行の要素も意識的に取り入れるとバランスが良くなります。`;
  } else {
    // その他の関係
    harmony = 'neutral';
    interpretation = `${honmeiName}と${monthName}は独立した関係です。表面と内面が異なる個性を持ち、多面的な人格を形成します。`;
    strengths = [
      '多様な才能を持つ',
      '状況に応じて使い分けられる',
      '豊かな人間性'
    ];
    challenges = [
      '自分自身を理解するのに時間がかかる',
      '周囲から複雑に見られることも'
    ];
    advice = '表面と内面の両方の良さを認め、統合していくことで、より豊かな人生を送れます。';
  }

  return {
    combination: `${honmeiName} × ${monthName}`,
    harmony,
    interpretation,
    strengths,
    challenges,
    advice
  };
}

/**
 * 本命星と日命星の関係性を分析（拡張版）
 * データベースの詳細プロフィールを活用
 */
export function analyzeHonmeiDayRelationshipEnhanced(
  honmei: number,
  day: number,
  honmeiProfile: PersonalityTraits | null,
  dayProfile: PersonalityTraits | null
): StarRelationship {
  const honmeiElement = ELEMENT_MAP[honmei];
  const dayElement = ELEMENT_MAP[day];
  const honmeiName = STAR_NAMES[honmei];
  const dayName = STAR_NAMES[day];

  let harmony: StarRelationship['harmony'] = 'neutral';
  let interpretation = '';
  let strengths: string[] = [];
  let challenges: string[] = [];
  let advice = '';

  const generationMap: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  if (generationMap[honmeiElement] === dayElement) {
    harmony = 'excellent';
    interpretation = honmeiProfile?.life_direction
      ? `${honmeiName}（${honmeiProfile.life_direction}）が${dayName}（日常）を生み出す関係です。本来の性格が、日々の行動を自然に導きます。`
      : `${honmeiName}（本質）が${dayName}（日常）を生み出す関係です。本来の性格が、日々の行動を自然に導きます。`;

    strengths = honmeiProfile?.strengths
      ? [...(honmeiProfile.strengths.slice(0, 2) as string[]), '本質と行動が一致している', '無理なく実力を発揮できる']
      : ['本質と行動が一致している', '自然体で日常を過ごせる', '無理なく実力を発揮できる'];

    challenges = ((dayProfile?.remedies as { avoidances?: string[] })?.avoidances?.slice(0, 2)) || ['ワンパターンになりやすい', '新しい挑戦を避ける傾向'];

    const honmeiHabits = (honmeiProfile?.remedies as { habits?: string[] })?.habits;
    advice = honmeiHabits && honmeiHabits.length > 0
      ? `${honmeiHabits[0]}などの習慣を大切にしつつ、時には意識的に新しいことにチャレンジすると成長につながります。`
      : '自然な流れを大切にしつつ、時には意識的に新しいことにチャレンジすると成長につながります。';

  } else if (generationMap[dayElement] === honmeiElement) {
    harmony = 'good';
    interpretation = dayProfile?.work_style
      ? `${dayName}（${dayProfile.work_style}）の行動が${honmeiName}（本質）を育てる関係です。日々の行動が、本来の自分を成長させます。`
      : `${dayName}（日常）が${honmeiName}（本質）を育てる関係です。日々の行動が、本来の自分を成長させます。`;

    strengths = [
      '日常の積み重ねが成長につながる',
      '行動することで本質が磨かれる',
      '経験から学ぶ力が強い'
    ];

    challenges = ['本質を発揮するまで時間がかかる', '日常に追われて本質を見失うことも'];

    advice = honmeiProfile?.spiritual_path
      ? `${honmeiProfile.spiritual_path}を意識しながら、日々の小さな行動を大切にしましょう。`
      : '日々の小さな行動を大切にしながら、時には立ち止まって本来の自分を見つめ直す時間を持ちましょう。';

  } else if (honmeiElement === dayElement) {
    harmony = 'good';
    interpretation = honmeiProfile?.core_essence
      ? `${honmeiName}と${dayName}は同じ${honmeiElement}の性質です。${honmeiProfile.core_essence}が、そのまま日常の行動に現れます。`
      : `${honmeiName}と${dayName}は同じ${honmeiElement}の性質です。本質と日常が統一され、一貫した生き方をします。`;

    strengths = honmeiProfile?.strengths?.slice(0, 3) as string[] || ['本質がそのまま行動に現れる', '嘘のない生き方', '信頼される人柄'];

    challenges = ['変化を嫌う傾向', '同じパターンの繰り返し', '柔軟性に欠けることも'];

    advice = `${honmeiElement}の一貫性は強みですが、時には意識的に違う行動パターンを試すことで、新しい可能性が開けます。`;

  } else {
    harmony = 'neutral';
    interpretation = honmeiProfile?.inner_nature && dayProfile?.inner_nature
      ? `${honmeiName}（${honmeiProfile.inner_nature}）と${dayName}（${dayProfile.inner_nature}）は異なる性質を持ちます。理想と現実を使い分ける器用さがあります。`
      : `${honmeiName}（本質）と${dayName}（日常）は異なる性質を持ちます。理想と現実、本音と建前を使い分ける器用さがあります。`;

    strengths = honmeiProfile?.hidden_talents?.slice(0, 3) as string[] || ['状況適応力が高い', '多面的な対応ができる', '場に応じた振る舞いができる'];

    challenges = ['本当の自分がわかりにくい', '疲れやすい面がある', '本質と行動のギャップに悩むことも'];

    advice = honmeiProfile?.life_theme && dayProfile?.work_style
      ? `プライベートでは${honmeiProfile.life_theme}を大切に、仕事では${dayProfile.work_style}を活かすなど、使い分けを意識すると楽になります。`
      : 'プライベートでは本質を大切に、公の場では日常の行動パターンを活かすなど、使い分けを意識すると楽になります。';
  }

  return {
    combination: `${honmeiName} × ${dayName}`,
    harmony,
    interpretation,
    strengths,
    challenges,
    advice
  };
}

/**
 * 本命星と日命星の関係性を分析（従来版）
 * 後方互換性のために残す
 */
export function analyzeHonmeiDayRelationship(honmei: number, day: number): StarRelationship {
  const honmeiElement = ELEMENT_MAP[honmei];
  const dayElement = ELEMENT_MAP[day];
  const honmeiName = STAR_NAMES[honmei];
  const dayName = STAR_NAMES[day];

  let harmony: StarRelationship['harmony'] = 'neutral';
  let interpretation = '';
  let strengths: string[] = [];
  let challenges: string[] = [];
  let advice = '';

  const generationMap: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  if (generationMap[honmeiElement] === dayElement) {
    harmony = 'excellent';
    interpretation = `${honmeiName}（本質）が${dayName}（日常）を生み出す関係です。本来の性格が、日々の行動を自然に導きます。`;
    strengths = [
      '本質と行動が一致している',
      '自然体で日常を過ごせる',
      '無理なく実力を発揮できる',
      'ストレスの少ない生き方'
    ];
    challenges = [
      'ワンパターンになりやすい',
      '新しい挑戦を避ける傾向'
    ];
    advice = '自然な流れを大切にしつつ、時には意識的に新しいことにチャレンジすると成長につながります。';
  } else if (generationMap[dayElement] === honmeiElement) {
    harmony = 'good';
    interpretation = `${dayName}（日常）が${honmeiName}（本質）を育てる関係です。日々の行動が、本来の自分を成長させます。`;
    strengths = [
      '日常の積み重ねが成長につながる',
      '行動することで本質が磨かれる',
      '経験から学ぶ力が強い'
    ];
    challenges = [
      '本質を発揮するまで時間がかかる',
      '日常に追われて本質を見失うことも'
    ];
    advice = '日々の小さな行動を大切にしながら、時には立ち止まって本来の自分を見つめ直す時間を持ちましょう。';
  } else if (honmeiElement === dayElement) {
    harmony = 'good';
    interpretation = `${honmeiName}と${dayName}は同じ${honmeiElement}の性質です。本質と日常が統一され、一貫した生き方をします。`;
    strengths = [
      '本質がそのまま行動に現れる',
      '嘘のない生き方',
      '信頼される人柄',
      '自分に正直'
    ];
    challenges = [
      '変化を嫌う傾向',
      '同じパターンの繰り返し',
      '柔軟性に欠けることも'
    ];
    advice = `${honmeiElement}の一貫性は強みですが、時には意識的に違う行動パターンを試すことで、新しい可能性が開けます。`;
  } else {
    harmony = 'neutral';
    interpretation = `${honmeiName}（本質）と${dayName}（日常）は異なる性質を持ちます。理想と現実、本音と建前を使い分ける器用さがあります。`;
    strengths = [
      '状況適応力が高い',
      '多面的な対応ができる',
      '場に応じた振る舞いができる'
    ];
    challenges = [
      '本当の自分がわかりにくい',
      '疲れやすい面がある',
      '本質と行動のギャップに悩むことも'
    ];
    advice = 'プライベートでは本質を大切に、公の場では日常の行動パターンを活かすなど、使い分けを意識すると楽になります。';
  }

  return {
    combination: `${honmeiName} × ${dayName}`,
    harmony,
    interpretation,
    strengths,
    challenges,
    advice
  };
}

/**
 * 傾斜宮と同会星の詳細説明を生成
 */
export function generateKeishaTokaiExplanation(reading: NineStarKiReading): KeishaTokaiExplanation {
  const honmeiName = STAR_NAMES[reading.honmei];
  const keishakyuName = STAR_NAMES[reading.keishakyu];
  const dokaiseiName = STAR_NAMES[reading.dokaisei];

  const keishakyuMeaning = `傾斜宮とは、あなたの本命星（${honmeiName}）が本来属する「定位置」のことです。九星にはそれぞれ定位置があり、${honmeiName}の定位置は${keishakyuName}の位置です。`;

  const keishakyuEffect = `傾斜宮は、あなたが無意識に引き寄せられる場所や状況、自然と向かっていく方向性を示します。人生の後半になるほど、この傾斜宮の影響が強く現れるとされています。${keishakyuName}の性質が、あなたの晩年の生き方や、最終的に到達する境地を暗示しています。`;

  const dokaiseiMeaning = `同会星とは、あなたが生まれた年に、本命星の定位置（傾斜宮）に回座していた星のことです。${reading.dokaisei === reading.honmei ? `あなたの場合、同会星も${dokaiseiName}で、本命星と同じです。これは「本命星が自分の定位置にいる年」に生まれたことを意味します。` : `あなたの場合、${dokaiseiName}が同会星です。`}`;

  const dokaiseiEffect = reading.dokaisei === reading.honmei
    ? `本命星と同会星が同じということは、非常に強い個性を持って生まれたことを意味します。${honmeiName}の性質が純粋に、強く現れやすく、その星の長所も短所も顕著に表れます。自分の本質を貫く強さがある反面、柔軟性を意識的に身につける必要があります。`
    : `同会星${dokaiseiName}は、あなたの隠れた性質、潜在的な才能を示します。表面的には${honmeiName}の性質が強く出ますが、人生の重要な局面では${dokaiseiName}の性質が現れ、あなたを助けることがあります。両方の星の良さを統合することが、人生を豊かにする鍵となります。`;

  const combinedInterpretation = reading.dokaisei === reading.honmei
    ? `${honmeiName}の本質が非常に強いあなたは、その星の道を極めることで大きな成果を得られます。ただし、偏りすぎないよう、意識的に他の要素も取り入れることが大切です。`
    : `本命星${honmeiName}と同会星${dokaiseiName}の両方の性質を理解し、活かすことで、より豊かな人生を送ることができます。${honmeiName}で生き、${dokaiseiName}で支えられる、そんな生き方を目指しましょう。`;

  const traditionalWisdom = `古来より「傾斜宮を知り、同会星を識ることは、己の運命の深淵を覗くこと」と言われています。これらは単なる性格分析ではなく、あなたの魂の本質、人生の目的、最終的な到達点を示す重要な要素です。伝統的な九星気学では、この二つを理解することで、真の自己実現への道が開けるとされています。`;

  return {
    keishakyuMeaning,
    keishakyuEffect,
    dokaiseiMeaning,
    dokaiseiEffect,
    combinedInterpretation,
    traditionalWisdom
  };
}

/**
 * 総合的な人生の解釈を生成（拡張版）
 * star_profilesの詳細データを活用してより具体的な人生解釈を提供
 */
export function generateLifeInterpretationEnhanced(
  reading: NineStarKiReading,
  profile?: PersonalityTraits | null
): {
  lifeTheme: string;
  lifePath: string;
  challenges: string[];
  opportunities: string[];
  spiritualGuidance: string;
} {
  if (!profile) {
    return {
      lifeTheme: '読み込み中...',
      lifePath: '読み込み中...',
      challenges: [],
      opportunities: [],
      spiritualGuidance: '読み込み中...'
    };
  }

  // データベースの詳細データから人生の道を構築
  const lifePath = [
    profile.life_direction,
    profile.cosmic_principle && `宇宙の原理として${profile.cosmic_principle}`,
    profile.elemental_reason && `五行的には${profile.elemental_reason}`
  ].filter(Boolean).join('。');

  const remedies = profile.remedies as { habits?: string[], avoidances?: string[] } | undefined;

  return {
    lifeTheme: profile.life_theme || '自己実現への道',
    lifePath: lifePath || '読み込み中...',
    challenges: [
      ...(profile.weaknesses || []).slice(0, 3),
      ...(remedies?.avoidances || []).slice(0, 2),
      '人生の前半と後半で課題が変化していく'
    ],
    opportunities: [
      ...(profile.hidden_talents || []),
      ...(remedies?.habits?.map(h => `習慣として：${h}`) || []).slice(0, 2),
      '傾斜宮の方向に進むことで新しい可能性が開ける'
    ],
    spiritualGuidance: profile.spiritual_path || profile.life_direction || '自分の道を歩むこと'
  };
}

/**
 * 総合的な人生の解釈を生成（従来版）
 * 後方互換性のために残す
 */
export function generateLifeInterpretation(
  reading: NineStarKiReading,
  traits?: PersonalityTraits | null
): {
  lifeTheme: string;
  lifePath: string;
  challenges: string[];
  opportunities: string[];
  spiritualGuidance: string;
} {
  if (!traits) {
    return {
      lifeTheme: '読み込み中...',
      lifePath: '読み込み中...',
      challenges: [],
      opportunities: [],
      spiritualGuidance: '読み込み中...'
    };
  }

  return {
    lifeTheme: traits.life_theme,
    lifePath: traits.life_direction,
    challenges: [
      ...(traits.weaknesses || []).slice(0, 3),
      '人生の前半と後半で課題が変化していく'
    ],
    opportunities: [
      ...(traits.hidden_talents || []),
      '傾斜宮の方向に進むことで新しい可能性が開ける'
    ],
    spiritualGuidance: traits.spiritual_path
  };
}
