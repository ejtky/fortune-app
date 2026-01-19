# Supabase セットアップガイド

このドキュメントでは、占いアプリのデータベースとして Supabase をセットアップする手順を説明します。

## 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHub アカウントでサインイン
4. 「New project」をクリック
5. 以下の情報を入力:
   - **Organization**: 既存の組織を選択 or 新規作成
   - **Name**: `fortune-app` (任意)
   - **Database Password**: 強力なパスワードを設定（必ず保存してください）
   - **Region**: `Northeast Asia (Tokyo)` を推奨
   - **Pricing Plan**: Free プラン（開発・テスト用）

6. 「Create new project」をクリック
7. プロジェクトの準備が完了するまで数分待機

## 2. データベーススキーマの適用

1. Supabase ダッシュボードの左メニューから **SQL Editor** を選択
2. 「New query」をクリック
3. `supabase/migrations/20240101000000_initial_schema.sql` の内容をコピー&ペースト
4. 「Run」ボタンをクリックしてスキーマを実行
5. 成功メッセージが表示されることを確認

## 3. 環境変数の設定

1. Supabase ダッシュボードの左メニューから **Project Settings** (歯車アイコン) を選択
2. 左メニューから **API** を選択
3. 以下の値をコピー:
   - **Project URL**: `https://xxxxx.supabase.co` の形式
   - **anon public key**: `eyJhbG...` で始まる長い文字列

4. プロジェクトルートに `.env.local` ファイルを作成:

```bash
# .env.local.example をコピー
cp .env.local.example .env.local
```

5. `.env.local` を編集して、コピーした値を設定:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

## 4. 認証設定（オプション）

### Email 認証を有効化

1. Supabase ダッシュボードの **Authentication** > **Providers** を選択
2. **Email** が有効になっていることを確認
3. 必要に応じて Email テンプレートをカスタマイズ

### ソーシャルログイン（オプション）

Google、GitHub などのソーシャルログインを追加する場合:

1. **Authentication** > **Providers** を選択
2. 使用したいプロバイダーを選択
3. プロバイダーの設定に従って OAuth アプリを作成
4. Client ID と Client Secret を設定

## 5. Row Level Security (RLS) の確認

スキーマ適用時に RLS ポリシーが自動的に設定されます。確認方法:

1. **Authentication** > **Policies** を選択
2. 各テーブルに以下のポリシーが設定されていることを確認:
   - `user_profiles`: ユーザーは自分のプロフィールのみアクセス可能
   - `daily_fortunes`: ユーザーは自分の運勢のみアクセス可能
   - `chat_conversations`: ユーザーは自分の会話のみアクセス可能
   - `chat_messages`: ユーザーは自分の会話内のメッセージのみアクセス可能

## 6. 動作確認

1. 開発サーバーを起動:

```bash
npm run dev
```

2. ブラウザで http://localhost:3000 にアクセス
3. エラーが表示されないことを確認

## データベース構造

### テーブル一覧

1. **user_profiles** - ユーザープロフィールと九星気学の計算結果
   - 本命星、月命星、日命星、傾斜宮、同会星を保存

2. **daily_fortunes** - 毎日の運勢のキャッシュ
   - 計算済みの運勢を保存してパフォーマンスを向上

3. **chat_conversations** - チャットの会話
   - ユーザーごとの会話スレッドを管理

4. **chat_messages** - チャットメッセージ
   - 会話内の各メッセージを保存

### リレーション

```
auth.users (Supabase Auth)
    ├── user_profiles (1:1)
    ├── daily_fortunes (1:N)
    └── chat_conversations (1:N)
            └── chat_messages (1:N)
```

## トラブルシューティング

### エラー: "Supabase の環境変数が設定されていません"

- `.env.local` ファイルが存在することを確認
- 環境変数名が正しいことを確認（`NEXT_PUBLIC_` プレフィックスが必要）
- 開発サーバーを再起動

### エラー: "Invalid API key"

- Supabase ダッシュボードで **anon public** キーを使用していることを確認
- **service_role** キーは使用しないでください（セキュリティリスク）

### データが表示されない

- RLS ポリシーが正しく設定されているか確認
- ユーザーがログインしているか確認
- ブラウザの開発者ツールでネットワークエラーを確認

## 次のステップ

1. ユーザー認証機能の実装（Phase 2）
2. プロフィール登録フローの実装
3. 運勢データの保存と取得
4. チャット履歴の保存

## 参考リンク

- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [Next.js と Supabase の統合](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
