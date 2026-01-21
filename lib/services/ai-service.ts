import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "./chat-context";

// Google Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

/**
 * Google Gemini APIを使用してAI回答を生成
 */
export async function generateAIResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Gemini 2.0 Flashモデルを使用（2025年最新版）
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // 会話履歴を構築
    const chat = model.startChat({
      history: conversationHistory.slice(-5).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
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
    if (error.message?.includes("API key")) {
      throw new Error("Google AI APIキーが設定されていません");
    } else if (error.message?.includes("quota")) {
      throw new Error("API利用制限に達しました");
    } else {
      throw new Error("AI回答の生成に失敗しました");
    }
  }
}

/**
 * APIキーが設定されているかチェック
 */
export function isAIServiceAvailable(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY;
}
