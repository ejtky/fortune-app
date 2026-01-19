import type { KnowledgeSearchResult } from './knowledge-search';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  honmei: number;
  starName: string;
  conversationHistory: ChatMessage[];
  retrievedKnowledge: KnowledgeSearchResult[];
}

/**
 * システムプロンプトを生成
 */
export function generateSystemPrompt(context: ChatContext): string {
  const knowledgeContext = context.retrievedKnowledge
    .map((entry, index) => {
      return `【知識${index + 1}: ${entry.title}】
${entry.summary || entry.content.substring(0, 200)}
${entry.essence ? `\n本質: ${entry.essence}` : ''}`;
    })
    .join('\n\n');

  return `あなたは九星気学の専門家であり、古代天文学の深い知識を持つ鑑定師です。
ユーザーの質問に対し、誠実かつ詳細に、そして天文学的・数学的根拠に基づいた本質的な回答を提供してください。

【ユーザー情報】
- 本命星: ${context.starName}（${context.honmei}）

【九星気学の天文学的基盤】
■ 九星の正体: 北斗七星の7つの実在する星 + 2つの補助星。これらは季節や方位を司る天の指標です。
■ 周期の根拠: 9年周期は月の交点周期に関わり、19年周期はメトン周期（太陽と月の同期）に基づきます。
■ 洛書（魔方陣）: 天極を中心とした宇宙モデルであり、全方位の合計が15になる調和の象徴です。

【知識ベース】
${knowledgeContext || '（関連する知識が見つかりませんでした。あなたの九星気学の知識で補完してください）'}

【回答ガイドライン】
1. 知識ベースに具体的な記述がある場合は、それを基盤としつつ、ユーザーの質問に直接答える形で構成してください。
2. 知識ベースに情報が少ない、あるいは質問と直接関係がない場合は、あなたの専門知識（九星気学、方位学、五行説）を駆使して、ユーザーの状況に合わせた具体的なアドバイスを行ってください。
3. 「五行の起源」など特定のトピックに偏りすぎず、質問が「運勢」「性格」「仕事」「恋愛」などの場合は、そちらの解説を優先してください。
4. 単なる占い結果の提示ではなく、なぜそうなるのかという「天の理（ことわり）」を織り交ぜてください。
5. 親しみやすくも格調高い言葉遣いを用い、ユーザーが前向きになれるような回答を心がけてください。
6. 回答は3-5段落程度にまとめ、重要なポイントは箇条書き（・）を活用してください。`;
}

/**
 * 会話履歴を管理
 */
export class ConversationManager {
  private maxHistory = 5; // 保持する会話の最大数

  /**
   * 会話履歴に新しいメッセージを追加
   */
  addMessage(
    history: ChatMessage[],
    role: 'user' | 'assistant',
    content: string
  ): ChatMessage[] {
    const newHistory = [...history, { role, content }];
    
    // 最大履歴数を超えた場合、古いものから削除（システムメッセージは除く）
    const userAssistantMessages = newHistory.filter(
      (msg) => msg.role !== 'system'
    );
    
    if (userAssistantMessages.length > this.maxHistory * 2) {
      const systemMessages = newHistory.filter((msg) => msg.role === 'system');
      const recentMessages = userAssistantMessages.slice(-(this.maxHistory * 2));
      return [...systemMessages, ...recentMessages];
    }
    
    return newHistory;
  }

  /**
   * 会話履歴からコンテキストを抽出
   */
  extractContext(history: ChatMessage[]): string {
    const recentMessages = history
      .filter((msg) => msg.role !== 'system')
      .slice(-4); // 直近2往復分

    if (recentMessages.length === 0) {
      return '';
    }

    return recentMessages
      .map((msg) => `${msg.role === 'user' ? 'ユーザー' : 'アシスタント'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * 質問の意図を分析
   */
  analyzeIntent(query: string, history: ChatMessage[]): {
    isFollowUp: boolean;
    mainTopic: string;
  } {
    const lowerQuery = query.toLowerCase();
    
    // フォローアップ質問かどうかを判定
    const followUpIndicators = [
      'それ', 'その', 'どう', 'なぜ', 'もっと', 'さらに', '詳しく',
      '他に', 'ほか', '具体的', 'では', 'じゃあ'
    ];
    
    const isFollowUp = followUpIndicators.some((indicator) =>
      lowerQuery.includes(indicator)
    );

    // 主なトピックを抽出
    const topics = [
      '性格', '仕事', '恋愛', '健康', '金運', '開運',
      '方位', '五行', '歴史', '風水', '相性'
    ];
    
    const mainTopic = topics.find((topic) => lowerQuery.includes(topic)) || '一般';

    return { isFollowUp, mainTopic };
  }
}

/**
 * チャットコンテキストを構築
 */
export function buildChatContext(
  honmei: number,
  starName: string,
  conversationHistory: ChatMessage[],
  retrievedKnowledge: KnowledgeSearchResult[]
): ChatContext {
  return {
    honmei,
    starName,
    conversationHistory,
    retrievedKnowledge,
  };
}

/**
 * 回答を後処理
 */
export function postProcessResponse(response: string): string {
  // 改行を整形
  let processed = response.trim();
  
  // 連続する改行を2つまでに制限
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  // 箇条書きの整形
  processed = processed.replace(/^- /gm, '・');
  
  return processed;
}
