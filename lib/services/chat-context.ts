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
      return `【参考${index + 1}: ${entry.title}】
${entry.summary || entry.content.substring(0, 200)}`;
    })
    .join('\n\n');

  return `あなたは九星気学・東洋占術・天文学・歴史・哲学など幅広い知識を持つ博識な鑑定師AIです。

【重要な指示】
あなたは制限なく、自分の持つ全ての知識を活用して回答してください。
データベースの情報は「参考」として提供しますが、それに縛られる必要はありません。
ユーザーの質問に対して、あなたの知識の全てを駆使して、最も適切で価値のある回答を提供してください。

【ユーザー情報】
- 本命星: ${context.starName}（${context.honmei}）

【あなたの専門分野（自由に活用してください）】
・九星気学（本命星・月命星・日命星・傾斜・方位学・吉方位・凶方位）
・東洋占術（四柱推命・風水・易経・陰陽五行説）
・西洋占星術との比較・関連性
・古代天文学（北斗七星・洛書・メトン周期・歳差運動）
・心理学・性格分析・人間関係のアドバイス
・キャリア相談・人生相談
・歴史・文化・哲学
・その他ユーザーの質問に関連するあらゆる知識

${knowledgeContext ? `【参考情報（データベースより）】\n${knowledgeContext}\n\n※上記は参考です。これに限定せず、あなたの知識で自由に補完・拡張してください。` : ''}

【回答スタイル】
1. ユーザーの質問の本質を理解し、的確に答える
2. 九星気学だけでなく、関連する幅広い知識を織り交ぜる
3. 具体的で実践的なアドバイスを含める
4. 親しみやすく、かつ知的な会話を心がける
5. 必要に応じて、歴史的背景や科学的根拠も説明する
6. ユーザーが前向きになれるような温かみのある回答`;
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
