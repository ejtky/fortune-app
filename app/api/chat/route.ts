import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase } from '@/lib/services/knowledge-search';
import {
  generateSystemPrompt,
  buildChatContext,
  ConversationManager,
  postProcessResponse,
} from '@/lib/services/chat-context';
import { generateAIResponse, isAIServiceAvailable } from '@/lib/services/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      honmei,
      starName,
      conversationHistory = [],
    } = body;

    // バリデーション
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    if (!honmei || !starName) {
      return NextResponse.json(
        { error: '本命星情報が必要です' },
        { status: 400 }
      );
    }

    // 会話マネージャーを初期化
    const conversationManager = new ConversationManager();
    
    // 質問の意図を分析
    const { isFollowUp, mainTopic } = conversationManager.analyzeIntent(
      message,
      conversationHistory
    );

    // 知識ベースから関連情報を検索
    const retrievedKnowledge = await searchKnowledgeBase(message, {
      honmei,
      limit: 3, // 引用数を絞る
      minScore: 0.5, // 関連度が低いものは除外
    });

    // チャットコンテキストを構築
    const context = buildChatContext(
      honmei,
      starName,
      conversationHistory,
      retrievedKnowledge
    );

    // システムプロンプトを生成
    const systemPrompt = generateSystemPrompt(context);

    let response: string;
    let usedAI = false;

    // AI APIが利用可能な場合はAIで回答生成
    if (isAIServiceAvailable()) {
      try {
        response = await generateAIResponse(
          systemPrompt,
          message,
          conversationHistory
        );
        
        if (!response || response.trim().length === 0) {
          throw new Error('AI response was empty');
        }
        
        usedAI = true;
      } catch (aiError: any) {
        console.error('AI generation failed, falling back to template:', aiError);
        // AI生成に失敗した場合はテンプレート回答にフォールバック
        response = generateTemplateResponse(
          message,
          context,
          isFollowUp,
          mainTopic
        );
        usedAI = false;
      }
    } else {
      // AI APIが設定されていない場合はテンプレート回答
      console.warn('AI API key not configured, using template response');
      response = generateTemplateResponse(
        message,
        context,
        isFollowUp,
        mainTopic
      );
      usedAI = false;
    }

    // 会話履歴を更新
    const updatedHistory = conversationManager.addMessage(
      conversationManager.addMessage(conversationHistory, 'user', message),
      'assistant',
      response
    );

    return NextResponse.json({
      response: postProcessResponse(response),
      conversationHistory: updatedHistory,
      retrievedKnowledge: retrievedKnowledge.map((k) => ({
        title: k.title,
        summary: k.summary,
      })),
      usedAI, // AI使用フラグ（成功した場合のみtrue）
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * テンプレート回答を生成（AI生成失敗時のフォールバック）
 */
function generateTemplateResponse(
  message: string,
  context: any,
  isFollowUp: boolean,
  mainTopic: string
): string {
  const { retrievedKnowledge, starName, honmei } = context;
  const lowerMessage = message.toLowerCase();

  // 知識ベースから情報を取得できた場合
  if (retrievedKnowledge.length > 0) {
    const topResult = retrievedKnowledge[0];
    
    // 質問の種類に応じて回答をカスタマイズ
    if (lowerMessage.includes('性格') || lowerMessage.includes('特徴')) {
      return generatePersonalityResponse(topResult, starName);
    } else if (lowerMessage.includes('仕事') || lowerMessage.includes('適職')) {
      return generateCareerResponse(topResult, starName);
    } else if (lowerMessage.includes('恋愛') || lowerMessage.includes('結婚')) {
      return generateLoveResponse(topResult, starName);
    } else if (lowerMessage.includes('健康')) {
      return generateHealthResponse(topResult, starName);
    } else if (lowerMessage.includes('金運') || lowerMessage.includes('お金')) {
      return generateWealthResponse(topResult, starName);
    } else if (lowerMessage.includes('開運') || lowerMessage.includes('運気')) {
      return generateLuckResponse(topResult, starName);
    } else if (lowerMessage.includes('五黄殺') || lowerMessage.includes('暗剣殺') || 
               lowerMessage.includes('歳破') || lowerMessage.includes('凶方位')) {
      return generateDirectionResponse(topResult);
    } else if (lowerMessage.includes('陰陽五行') || lowerMessage.includes('五行')) {
      return generatePhilosophyResponse(topResult);
    }
    
    // デフォルト: 概要を返す
    return generateDefaultResponse(topResult, retrievedKnowledge, starName, message);
  }

  // 知識ベースに情報がない場合でも、九星の基本情報で回答
  return generateGenericStarResponse(starName, honmei, message);
}

// 性格に関する回答
function generatePersonalityResponse(entry: any, starName: string): string {
  let response = `${starName}の性格についてお答えします。\n\n`;
  
  if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  if (entry.essence) {
    response += `【本質的な特徴】\n${entry.essence}\n\n`;
  }
  
  // コンテンツから性格関連の情報を抽出
  const content = entry.content;
  const personalitySection = extractSection(content, ['基本的な性格', '性格的特徴', '特徴的な性質']);
  if (personalitySection) {
    response += `${personalitySection}\n\n`;
  }
  
  response += `他にも、仕事運、恋愛運、健康面、開運法など、詳しくお聞きになりたいことがあればお気軽にどうぞ。`;
  
  return response;
}

// 仕事に関する回答
function generateCareerResponse(entry: any, starName: string): string {
  let response = `${starName}の仕事運・適職についてお答えします。\n\n`;
  
  const content = entry.content;
  const careerSection = extractSection(content, ['適職', '仕事', 'キャリア', '働き方']);
  
  if (careerSection) {
    response += `${careerSection}\n\n`;
  } else if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  response += `${starName}の方は、その特性を活かすことで大きな成功を収めることができます。`;
  
  return response;
}

// 恋愛に関する回答
function generateLoveResponse(entry: any, starName: string): string {
  let response = `${starName}の恋愛運・人間関係についてお答えします。\n\n`;
  
  const content = entry.content;
  const loveSection = extractSection(content, ['恋愛', '人間関係', '相性', '家庭']);
  
  if (loveSection) {
    response += `${loveSection}\n\n`;
  } else if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  return response;
}

// 健康に関する回答
function generateHealthResponse(entry: any, starName: string): string {
  let response = `${starName}の健康運についてお答えします。\n\n`;
  
  const content = entry.content;
  const healthSection = extractSection(content, ['健康', '注意すべき', '病気']);
  
  if (healthSection) {
    response += `${healthSection}\n\n`;
  } else if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  response += `日頃から健康管理に気を配り、バランスの取れた生活を心がけましょう。`;
  
  return response;
}

// 金運に関する回答
function generateWealthResponse(entry: any, starName: string): string {
  let response = `${starName}の金運についてお答えします。\n\n`;
  
  const content = entry.content;
  const wealthSection = extractSection(content, ['金運', 'お金', '財運', '金銭']);
  
  if (wealthSection) {
    response += `${wealthSection}\n\n`;
  } else if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  return response;
}

// 開運に関する回答
function generateLuckResponse(entry: any, starName: string): string {
  let response = `${starName}の開運法についてお答えします。\n\n`;
  
  const content = entry.content;
  const luckSection = extractSection(content, ['開運', 'ラッキー', '運気']);
  
  if (luckSection) {
    response += `${luckSection}\n\n`;
  } else if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  response += `これらの開運法を日常生活に取り入れることで、運気の向上が期待できます。`;
  
  return response;
}

// 方位に関する回答
function generateDirectionResponse(entry: any): string {
  let response = `${entry.title}についてお答えします。\n\n`;
  
  if (entry.summary) {
    response += `【概要】\n${entry.summary}\n\n`;
  }
  
  if (entry.essence) {
    response += `【本質】\n${entry.essence}\n\n`;
  }
  
  const content = entry.content;
  const sections = ['意味と性質', '影響', '特定方法'];
  sections.forEach(section => {
    const extracted = extractSection(content, [section]);
    if (extracted) {
      response += `${extracted}\n\n`;
    }
  });
  
  return response;
}

// 哲学・理論に関する回答
function generatePhilosophyResponse(entry: any): string {
  let response = `${entry.title}についてお答えします。\n\n`;
  
  if (entry.summary) {
    response += `${entry.summary}\n\n`;
  }
  
  if (entry.essence) {
    response += `【本質】\n${entry.essence}\n\n`;
  }
  
  // コンテンツの最初の500文字を表示
  const contentPreview = entry.content.substring(0, 500);
  response += `${contentPreview}${entry.content.length > 500 ? '...' : ''}\n\n`;
  
  response += `九星気学の理解を深めることで、より良い人生の選択ができるようになります。`;
  
  return response;
}

// デフォルト回答
function generateDefaultResponse(topResult: any, allResults: any[], starName: string, query: string): string {
  let response = `「${query}」に関連する知識として「${topResult.title}」についてお伝えします。\n\n`;
  
  if (topResult.summary) {
    response += `${topResult.summary}\n\n`;
  } else if (topResult.essence) {
    response += `【詳細】\n${topResult.essence}\n\n`;
  } else {
    response += `${topResult.content.substring(0, 300)}...\n\n`;
  }
  
  // 追加の関連情報
  if (allResults.length > 1) {
    const otherResults = allResults.slice(1, 3);
    response += `他にも、以下のような関連情報があります：\n`;
    otherResults.forEach((entry) => {
      response += `・${entry.title}\n`;
    });
    response += `\nこれらの詳細や、${starName}の性格・運勢などについて具体的にお知りになりたい場合は、さらにお尋ねください。`;
  } else {
    response += `${starName}の運勢や具体的な開運法についても詳しくお話しできますので、気になることがあれば何でも聞いてくださいね。`;
  }
  
  return response;
}

// コンテンツからセクションを抽出
function extractSection(content: string, keywords: string[]): string | null {
  for (const keyword of keywords) {
    const regex = new RegExp(`【${keyword}[^】]*】([^【]+)`, 'i');
    const match = content.match(regex);
    if (match) {
      return match[0].trim();
    }
  }
  return null;
}

// 九星の基本情報データ
const STAR_INFO: Record<number, {
  element: string;
  nature: string;
  personality: string;
  career: string;
  love: string;
  health: string;
  luck: string;
}> = {
  1: {
    element: '水',
    nature: '柔軟性と適応力',
    personality: '一白水星の方は、水のように柔軟で適応力が高いのが特徴です。知性的で物静か、深い洞察力を持ち、人の心を読み取る能力に優れています。交際上手で人脈を広げる才能があり、困難な状況でも粘り強く対処できます。',
    career: '企画・研究・コンサルタント・カウンセラー・水商売・飲食業など、人との関わりや知性を活かせる仕事が向いています。',
    love: '相手の気持ちを察する能力が高く、献身的な愛情を注ぎます。ただし、優柔不断になりやすい面も。',
    health: '腎臓・膀胱・耳などの水に関連する部位に注意。冷えにも気をつけましょう。',
    luck: '北方位への旅行や引っ越しが吉。水に触れる機会を増やすと運気アップ。'
  },
  2: {
    element: '土',
    nature: '献身と包容力',
    personality: '二黒土星の方は、大地のような安定感と包容力を持っています。勤勉で忍耐強く、縁の下の力持ちタイプ。周囲への気配りができ、信頼される存在です。',
    career: '農業・不動産・介護・教育・事務職など、コツコツと積み上げる仕事や人をサポートする仕事が向いています。',
    love: '家庭的で献身的。安定した関係を望み、パートナーを支える喜びを感じます。',
    health: '胃腸・消化器系に注意。ストレスを溜めすぎないよう注意しましょう。',
    luck: '南西方位が吉。土に触れる活動や家庭での時間が運気を高めます。'
  },
  3: {
    element: '木',
    nature: '発展と活力',
    personality: '三碧木星の方は、若木のような勢いと活力があります。明るく積極的、新しいことへの挑戦を好みます。発想力豊かでコミュニケーション能力が高いのが特徴です。',
    career: '音楽・放送・IT・広告・営業など、創造性やコミュニケーションを活かせる仕事が向いています。',
    love: '情熱的で積極的なアプローチ。ただし、飽きっぽい面があるので長続きには工夫が必要。',
    health: '肝臓・神経系・のどに注意。過労やストレスに気をつけて。',
    luck: '東方位が吉。朝の活動、音楽や植物との触れ合いが運気アップ。'
  },
  4: {
    element: '木',
    nature: '成長と調和',
    personality: '四緑木星の方は、風のように自由で社交的。人間関係を大切にし、調和を重んじます。信用を築く力があり、縁を結ぶ才能があります。',
    career: '貿易・旅行・航空・ファッション・営業など、人との縁や移動に関わる仕事が向いています。',
    love: '優しく思いやりがあり、相手に合わせることができます。結婚運は良好。',
    health: '呼吸器・腸・髪に注意。風通しの良い環境を心がけましょう。',
    luck: '南東方位が吉。旅行や人との交流が運気を高めます。'
  },
  5: {
    element: '土',
    nature: '中心と統率',
    personality: '五黄土星の方は、九星の中心に位置する帝王の星。強い意志力とカリスマ性を持ち、リーダーシップを発揮します。困難を乗り越える底力があります。',
    career: '経営者・政治家・管理職・独立事業など、トップに立つポジションが向いています。',
    love: '支配的になりがちなので、相手を尊重することが大切。一度決めたら一途。',
    health: '心臓・脾臓に注意。無理をしすぎないよう心がけて。',
    luck: '中央（引っ越しは避ける年も）。自分を磨き、器を大きくすることが開運の鍵。'
  },
  6: {
    element: '金',
    nature: '完成と威厳',
    personality: '六白金星の方は、天の気を持つ高貴な星。プライドが高く、完璧を求める傾向があります。決断力があり、リーダーとしての資質を持っています。',
    career: '官公庁・大企業・金融・宝飾・高級品関連など、格式ある仕事が向いています。',
    love: '理想が高く、なかなか相手を見つけにくいことも。一度決まれば安定した関係を築きます。',
    health: '頭部・肺・骨に注意。規則正しい生活を心がけましょう。',
    luck: '北西方位が吉。神社仏閣への参拝、高級品との縁が運気を高めます。'
  },
  7: {
    element: '金',
    nature: '喜悦と魅力',
    personality: '七赤金星の方は、華やかで魅力的。話術に優れ、人を楽しませる才能があります。金銭感覚も鋭く、商才があります。',
    career: '飲食・エンターテイメント・金融・営業・接客など、人を喜ばせる仕事が向いています。',
    love: 'モテるタイプで恋愛経験は豊富。楽しい関係を好みますが、安定を求めることも大切。',
    health: '口・歯・呼吸器に注意。食べ過ぎ飲み過ぎに気をつけて。',
    luck: '西方位が吉。美味しい食事、楽しい会話が運気アップの秘訣。'
  },
  8: {
    element: '土',
    nature: '変化と継承',
    personality: '八白土星の方は、山のような安定感と変革の力を持っています。粘り強く、一度決めたら最後までやり遂げます。蓄財の才能があります。',
    career: '不動産・建築・金融・相続関連・ホテルなど、蓄積や継承に関わる仕事が向いています。',
    love: '慎重で真剣な交際を望みます。結婚後は家庭を大切にするタイプ。',
    health: '関節・鼻・背中に注意。適度な運動で体を動かしましょう。',
    luck: '北東方位が吉。貯蓄や不動産との縁が運気を高めます。'
  },
  9: {
    element: '火',
    nature: '輝きと知性',
    personality: '九紫火星の方は、太陽のように明るく華やか。知性と美的センスに優れ、注目を集める存在です。直感力が鋭く、先見の明があります。',
    career: '芸術・デザイン・美容・学術・出版など、美や知性を活かせる仕事が向いています。',
    love: '情熱的で華やかな恋愛を好みます。美しいものに惹かれ、理想も高め。',
    health: '心臓・目・血圧に注意。興奮しすぎないよう心のバランスを。',
    luck: '南方位が吉。芸術鑑賞、学びの機会が運気を高めます。'
  }
};

// 知識ベースがない場合の汎用回答を生成
function generateGenericStarResponse(starName: string, honmei: number, message: string): string {
  const info = STAR_INFO[honmei];
  if (!info) {
    return `${starName}についてお答えします。九星気学では、生年月日から導き出される本命星によって、その人の基本的な性格や運勢の傾向を読み解きます。具体的なご質問があればお聞かせください。`;
  }

  const lowerMessage = message.toLowerCase();

  // 質問内容に応じた回答
  if (lowerMessage.includes('性格') || lowerMessage.includes('特徴') || lowerMessage.includes('どんな')) {
    return `【${starName}の性格・特徴】\n\n${info.personality}\n\n五行では「${info.element}」の気を持ち、「${info.nature}」がキーワードとなります。\n\n他にも仕事運、恋愛運、健康、開運法など、何でもお聞きください。`;
  }

  if (lowerMessage.includes('仕事') || lowerMessage.includes('適職') || lowerMessage.includes('キャリア')) {
    return `【${starName}の仕事運・適職】\n\n${info.career}\n\n${starName}の「${info.nature}」という特性を活かすことで、大きな成功を収めることができます。`;
  }

  if (lowerMessage.includes('恋愛') || lowerMessage.includes('結婚') || lowerMessage.includes('相性')) {
    return `【${starName}の恋愛運】\n\n${info.love}\n\n${starName}の持つ「${info.element}」の気質が、恋愛にも影響を与えています。`;
  }

  if (lowerMessage.includes('健康')) {
    return `【${starName}の健康運】\n\n${info.health}\n\n五行の「${info.element}」に関連する部位に特に注意が必要です。`;
  }

  if (lowerMessage.includes('開運') || lowerMessage.includes('運気') || lowerMessage.includes('ラッキー')) {
    return `【${starName}の開運法】\n\n${info.luck}\n\n「${info.nature}」を意識した生活が、運気向上の鍵となります。`;
  }

  // デフォルト：総合的な情報を提供
  return `【${starName}について】\n\n${info.personality}\n\n【五行】${info.element}の気\n【キーワード】${info.nature}\n\n【適職】\n${info.career}\n\n【開運のヒント】\n${info.luck}\n\n恋愛運、健康運など、もっと詳しく知りたいことがあればお聞きください。`;
}
