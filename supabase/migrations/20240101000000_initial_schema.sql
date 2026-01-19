-- 占いアプリ用データベーススキーマ
-- Nine Star Ki Fortune App Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ユーザープロフィールテーブル
-- User profiles with Nine Star Ki calculations
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  zodiac_sign TEXT,

  -- 九星気学の計算結果
  honmei_star INTEGER NOT NULL CHECK (honmei_star BETWEEN 1 AND 9),
  getsumesei_star INTEGER NOT NULL CHECK (getsumesei_star BETWEEN 1 AND 9),
  nichisei_star INTEGER NOT NULL CHECK (nichisei_star BETWEEN 1 AND 9),
  keishakyu INTEGER NOT NULL CHECK (keishakyu BETWEEN 1 AND 9),
  dokaisei INTEGER NOT NULL CHECK (dokaisei BETWEEN 1 AND 9),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- 毎日の運勢キャッシュテーブル
-- Daily fortune cache for performance
CREATE TABLE daily_fortunes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fortune_date DATE NOT NULL,

  -- 九星気学の運勢
  nine_star_reading JSONB NOT NULL,

  -- 方位学の運勢（Phase 3で実装）
  directional_reading JSONB,

  -- 風水の運勢（Phase 4で実装）
  feng_shui_reading JSONB,

  -- 統合スコア
  combined_score INTEGER CHECK (combined_score BETWEEN 0 AND 100),
  lucky_direction TEXT,
  lucky_color TEXT,
  advice TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, fortune_date)
);

-- チャット会話テーブル
-- Chat conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '新しい会話',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- チャットメッセージテーブル
-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,

  -- メタデータ（使用した知識ベースのキーワードなど）
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_daily_fortunes_user_date ON daily_fortunes(user_id, fortune_date DESC);
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id, created_at DESC);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id, created_at ASC);

-- Row Level Security (RLS) の有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fortunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー: ユーザーは自分のデータのみアクセス可能

-- user_profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- daily_fortunes policies
CREATE POLICY "Users can view their own fortunes"
  ON daily_fortunes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fortunes"
  ON daily_fortunes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- chat_conversations policies
CREATE POLICY "Users can view their own conversations"
  ON chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON chat_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- chat_messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- トリガー: updated_at の自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
