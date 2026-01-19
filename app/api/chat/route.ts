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

  // 知識ベースに情報がない場合のフォールバック
  return `「${message}」についてお調べしましたが、現在、私の知識ベースの中に直接的な回答が見つかりませんでした。
 
${starName}の方（本命星 ${honmei}）の運勢や、性格的な特徴、適職、恋愛面のことでしたら詳しくお話しできます。
 
例えば、以下のようなことについてお答えできますので、ぜひ具体的に聞いてみてください：
・${starName}の基本的な性格や隠れた本質
・向いている仕事や才能を活かせる環境
・相性の良い相手や良い人間関係を築くコツ
・健康面で気をつけたいポイント
・今すぐ実践できる具体的な開運の秘訣`;
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
