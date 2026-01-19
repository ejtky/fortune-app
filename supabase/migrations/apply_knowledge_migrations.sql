-- このスクリプトを使用してSupabaseダッシュボードのSQL Editorで実行してください
-- または、Supabase CLIでリモートに接続して実行してください

-- 1. 基礎理論と凶方位のデータ
\i supabase/migrations/20260108100000_authentic_kyusei_knowledge.sql

-- 2. 九星の性格（一白〜五黄）
\i supabase/migrations/20260108100001_nine_star_personalities.sql

-- 3. 九星の性格（六白〜九紫）
\i supabase/migrations/20260108100002_nine_star_personalities_part2.sql
