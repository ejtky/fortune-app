-- 八雲院風の機能を追加するためのデータベーススキーマ
-- Yakumoin-style Features Database Schema

-- お気に入り地点テーブル
CREATE TABLE favorite_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 地点情報
  name TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  -- 分類
  category TEXT, -- 職場、実家、旅行先など
  color TEXT DEFAULT '#9333EA', -- 表示色

  -- メモ
  notes TEXT,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- メンバー管理テーブル（家族・友人の九星情報）
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基本情報
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,

  -- 関係性
  relationship TEXT, -- 家族、友人、知人、その他

  -- 九星気学の計算結果
  honmei_star INTEGER NOT NULL CHECK (honmei_star BETWEEN 1 AND 9),
  month_star INTEGER NOT NULL CHECK (month_star BETWEEN 1 AND 9),
  day_star INTEGER NOT NULL CHECK (day_star BETWEEN 1 AND 9),
  keishakyu INTEGER NOT NULL CHECK (keishakyu BETWEEN 1 AND 9),
  dokaisei INTEGER NOT NULL CHECK (dokaisei BETWEEN 1 AND 9),

  -- 表示設定
  avatar_color TEXT DEFAULT '#3B82F6',

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- カレンダーイベントテーブル
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- イベント情報
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,

  -- 方位関連
  direction TEXT, -- 行く方位
  place_id UUID REFERENCES favorite_places(id),

  -- メモ
  notes TEXT,
  event_type TEXT, -- 旅行、引っ越し、その他

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検索履歴テーブル
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 検索タイプ
  search_type TEXT NOT NULL, -- 'direction' | 'group' | 'calendar' | 'map'

  -- 検索パラメータ（JSON形式）
  search_params JSONB,

  -- 検索結果のサマリー
  result_summary TEXT,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- グループ占いセッションテーブル（オプション）
CREATE TABLE group_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- セッション情報
  session_name TEXT,
  session_date DATE NOT NULL,

  -- 参加メンバー（IDの配列）
  member_ids UUID[],

  -- 結果のキャッシュ
  result_data JSONB,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_favorite_places_user ON favorite_places(user_id);
CREATE INDEX idx_favorite_places_category ON favorite_places(category);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_members_relationship ON members(relationship);
CREATE INDEX idx_calendar_events_user_date ON calendar_events(user_id, event_date DESC);
CREATE INDEX idx_search_history_user_type ON search_history(user_id, search_type);
CREATE INDEX idx_group_sessions_user ON group_sessions(user_id);

-- Row Level Security (RLS) の有効化
ALTER TABLE favorite_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー: ユーザーは自分のデータのみアクセス可能

-- favorite_places policies
CREATE POLICY "Users can view their own favorite places"
  ON favorite_places FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite places"
  ON favorite_places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorite places"
  ON favorite_places FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite places"
  ON favorite_places FOR DELETE
  USING (auth.uid() = user_id);

-- members policies
CREATE POLICY "Users can view their own members"
  ON members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own members"
  ON members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own members"
  ON members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own members"
  ON members FOR DELETE
  USING (auth.uid() = user_id);

-- calendar_events policies
CREATE POLICY "Users can view their own calendar events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events FOR DELETE
  USING (auth.uid() = user_id);

-- search_history policies
CREATE POLICY "Users can view their own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- group_sessions policies
CREATE POLICY "Users can view their own group sessions"
  ON group_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own group sessions"
  ON group_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own group sessions"
  ON group_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own group sessions"
  ON group_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- トリガー: updated_at の自動更新
CREATE TRIGGER update_favorite_places_updated_at
  BEFORE UPDATE ON favorite_places
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_sessions_updated_at
  BEFORE UPDATE ON group_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
