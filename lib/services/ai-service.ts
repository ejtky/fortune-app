import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "./chat-context";

// Google Gemini APIクライアントの初期化
/**
 * Google Gemini APIを使用してAI回答を生成
 */
export async function generateAIResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY || "";
    if (!apiKey) {
      throw new Error("環境変数 GOOGLE_AI_API_KEY が設定されていません");
    }

    // Google Gemini APIクライアントの初期化（関数内で初期化することで環境変数の読み込みを確実にする）
    const genAI = new GoogleGenerativeAI(apiKey);

    // Gemini 2.0 Flashモデルを使用（2025年1月リリースの安定版）
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // 会話履歴を構築
    // Geminiは最初のメッセージが 'user' である必要があるため、履歴を調整
    let history = conversationHistory.slice(-6).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // 先頭がモデルの回答から始まっている場合、それを削除してユーザー発言から始める
    if (history.length > 0 && history[0].role === "model") {
      history = history.slice(1);
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40,
      },
    });

    // メッセージを送信して回答を取得
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error("Google Gemini API Error:", error);

    // エラーメッセージを詳細に記録
    if (error.message === "環境変数 GOOGLE_AI_API_KEY が設定されていません") {
      throw error; // そのまま再送出
    } else if (error.message?.includes("API key")) {
      throw new Error(`Google AI APIキーが無効です: ${error.message}`);
    } else if (error.message?.includes("quota")) {
      throw new Error(`API利用制限に達しました: ${error.message}`);
    } else {
      // 生のエラーメッセージを含めてスローする（デバッグ用）
      throw new Error(`AI回答の生成に失敗しました (Raw Error: ${error.message})`);
    }
  }
}

/**
 * APIキーが設定されているかチェック
 */
export function isAIServiceAvailable(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY;
}
