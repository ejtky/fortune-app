-- 最小限のマイグレーション: knowledge_articlesテーブルのみ作成

CREATE TABLE IF NOT EXISTS knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS設定（公開読み取り、認証ユーザーは書き込み可能）
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON knowledge_articles FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert"
ON knowledge_articles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update"
ON knowledge_articles FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete"
ON knowledge_articles FOR DELETE
TO authenticated
USING (true);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_slug ON knowledge_articles(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON knowledge_articles(category);
