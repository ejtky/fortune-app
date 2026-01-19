# Google Gemini API セットアップガイド

## APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. 「Get API key」をクリック
4. 「Create API key」を選択
5. APIキーをコピー

## 環境変数の設定

### `.env.local`ファイルを作成

プロジェクトのルートディレクトリ（`fortune-app`）に`.env.local`ファイルを作成し、以下を追加：

```env
# Google AI API Key
GOOGLE_AI_API_KEY=your_api_key_here

# 既存の環境変数
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

**重要:** `your_api_key_here`を実際のAPIキーに置き換えてください。

## 開発サーバーの再起動

環境変数を追加したら、開発サーバーを再起動してください：

```bash
# 現在のサーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

## 動作確認

1. `http://localhost:3000`にアクセス
2. 生年月日を入力して鑑定
3. チャットで質問（例: 「性格について教えて」）
4. AI生成の自然な回答が返ってくることを確認

## トラブルシューティング

### APIキーエラー
```
Error: Google AI APIキーが設定されていません
```
→ `.env.local`ファイルが正しく作成されているか確認
→ 開発サーバーを再起動

### API利用制限エラー
```
Error: API利用制限に達しました
```
→ 無料枠: 1日1,500リクエスト
→ 時間を置いてから再試行

### フォールバック動作
APIキーが設定されていない場合、自動的にテンプレート回答にフォールバックします。
コンソールに以下のメッセージが表示されます：
```
AI API key not configured, using template response
```

## 無料枠の制限

- **1日あたり**: 1,500リクエスト
- **1分あたり**: 15リクエスト
- **トークン制限**: なし（Gemini 1.5 Flash）

通常の使用では無料枠で十分です。

## セキュリティ注意事項

- `.env.local`は`.gitignore`に含まれています
- APIキーを公開リポジトリにコミットしないでください
- 本番環境では環境変数を適切に設定してください
