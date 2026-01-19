-- 真実の知識データベーススキーマ
-- Knowledge Database for Essential Wisdom

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 知識カテゴリテーブル
CREATE TABLE knowledge_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES knowledge_categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 知識エントリテーブル
CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES knowledge_categories(id) ON DELETE CASCADE,

  -- 基本情報
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,

  -- 本質的情報
  essence TEXT, -- なぜそうなのか、本質的な理由
  historical_context TEXT, -- 歴史的背景
  traditional_wisdom TEXT, -- 伝統的な教え
  lost_knowledge TEXT, -- 失われた/歪められた知識

  -- 関連九星
  related_stars INTEGER[], -- 関連する九星の配列 [1,2,3...]

  -- メタデータ
  keywords TEXT[], -- 検索用キーワード
  reference_sources TEXT[], -- 参考文献・出典
  importance_level INTEGER CHECK (importance_level BETWEEN 1 AND 5), -- 重要度（1-5）

  -- 管理
  is_verified BOOLEAN DEFAULT false, -- 検証済みフラグ
  is_published BOOLEAN DEFAULT true, -- 公開フラグ
  author TEXT, -- 作成者

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 知識タグテーブル
CREATE TABLE knowledge_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT, -- 表示用カラーコード
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 知識とタグの中間テーブル
CREATE TABLE knowledge_entry_tags (
  knowledge_entry_id UUID REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES knowledge_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (knowledge_entry_id, tag_id)
);

-- 五行思想の基本データテーブル
CREATE TABLE five_elements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  element TEXT NOT NULL UNIQUE CHECK (element IN ('木', '火', '土', '金', '水')),

  -- 本質的性質
  essence TEXT NOT NULL,
  cosmic_principle TEXT, -- 宇宙的原理
  natural_manifestation TEXT, -- 自然界での現れ
  human_manifestation TEXT, -- 人間界での現れ
  spiritual_meaning TEXT, -- 精神的意味

  -- 五行の関係性
  generates TEXT, -- 相生（生み出す元素）
  controls TEXT, -- 相剋（制御する元素）

  -- 対応関係
  direction TEXT, -- 方位
  season TEXT, -- 季節
  color TEXT[], -- 対応色
  organs TEXT[], -- 対応臓器
  emotions TEXT[], -- 対応感情

  -- 伝統的知識
  ancient_wisdom TEXT,
  modern_interpretation TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_knowledge_entries_category ON knowledge_entries(category_id);
CREATE INDEX idx_knowledge_entries_stars ON knowledge_entries USING GIN(related_stars);
CREATE INDEX idx_knowledge_entries_keywords ON knowledge_entries USING GIN(keywords);
CREATE INDEX idx_knowledge_entry_tags_entry ON knowledge_entry_tags(knowledge_entry_id);
CREATE INDEX idx_knowledge_entry_tags_tag ON knowledge_entry_tags(tag_id);

-- フルテキスト検索用のインデックス
CREATE INDEX idx_knowledge_entries_content_search ON knowledge_entries USING GIN(to_tsvector('simple', content));
CREATE INDEX idx_knowledge_entries_title_search ON knowledge_entries USING GIN(to_tsvector('simple', title));

-- Row Level Security (RLS) の設定
-- 知識データベースは全ユーザーが読み取り可能、管理者のみ編集可能
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE five_elements ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが読み取り可能
CREATE POLICY "Anyone can view published knowledge categories"
  ON knowledge_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view published knowledge entries"
  ON knowledge_entries FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view knowledge tags"
  ON knowledge_tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view knowledge entry tags"
  ON knowledge_entry_tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view five elements"
  ON five_elements FOR SELECT
  USING (true);

-- トリガー: updated_at の自動更新
CREATE TRIGGER update_knowledge_categories_updated_at
  BEFORE UPDATE ON knowledge_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_entries_updated_at
  BEFORE UPDATE ON knowledge_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_five_elements_updated_at
  BEFORE UPDATE ON five_elements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 初期カテゴリの挿入
INSERT INTO knowledge_categories (name, description, sort_order) VALUES
  ('陰陽五行思想', '万物の根源となる陰陽五行の本質的教え', 1),
  ('九星気学の原理', '九星気学の根本原理と歴史的背景', 2),
  ('日本の伝統的暦', '本来の日本の暦と時間観念', 3),
  ('失われた知識', 'GHQや権力者により歪められた真実の知識', 4),
  ('宇宙と人間の関係', '天体の運行と人間の運命の関連性', 5),
  ('方位学の本質', '方位が持つ本質的な力とその理由', 6),
  ('風水の真理', '本来の風水の教えと現代の誤解', 7),
  ('歴史的背景', '占術の発展と権力による改変の歴史', 8);

-- 初期タグの挿入
INSERT INTO knowledge_tags (name, description, color) VALUES
  ('本質', '物事の本質的な理由を説明', '#9333EA'),
  ('歴史', '歴史的背景と変遷', '#3B82F6'),
  ('真実', '隠された真実の知識', '#DC2626'),
  ('宇宙原理', '宇宙の法則と原理', '#8B5CF6'),
  ('陰陽五行', '陰陽五行思想に関連', '#10B981'),
  ('失われた知識', 'GHQ以前の本来の知識', '#F59E0B'),
  ('伝統', '古来からの伝統的教え', '#6366F1'),
  ('科学的根拠', '現代科学との関連', '#06B6D4');
