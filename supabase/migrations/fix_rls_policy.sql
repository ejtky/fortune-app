-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON knowledge_articles;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON knowledge_articles;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON knowledge_articles;

-- 新しいポリシー: 匿名ユーザーも含めて全員が書き込み可能
CREATE POLICY "Allow all inserts"
ON knowledge_articles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all updates"
ON knowledge_articles FOR UPDATE
USING (true);

CREATE POLICY "Allow all deletes"
ON knowledge_articles FOR DELETE
USING (true);
