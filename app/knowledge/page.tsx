'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { NINE_STARS, type NineStarNumber } from '@/lib/fortune/nine-star-calculator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  related_stars?: number[] | null;
  category_id?: string | null;
  keywords?: string[] | null;
  created_at: string;
}

function KnowledgeContent() {
  const searchParams = useSearchParams();
  const starParam = searchParams?.get('star');

  const [selectedStar, setSelectedStar] = useState<NineStarNumber | null>(
    starParam ? (parseInt(starParam) as NineStarNumber) : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'character', label: '性格' },
    { value: 'fortune', label: '運勢' },
    { value: 'compatibility', label: '相性' },
    { value: 'direction', label: '方位' },
    { value: 'advice', label: 'アドバイス' },
  ];

  const starOptions: { value: NineStarNumber; label: string }[] = [
    { value: 1, label: '一白水星' },
    { value: 2, label: '二黒土星' },
    { value: 3, label: '三碧木星' },
    { value: 4, label: '四緑木星' },
    { value: 5, label: '五黄土星' },
    { value: 6, label: '六白金星' },
    { value: 7, label: '七赤金星' },
    { value: 8, label: '八白土星' },
    { value: 9, label: '九紫火星' },
  ];

  // 知識エントリを取得
  useEffect(() => {
    fetchEntries();
  }, [selectedStar, category]);

  // 検索フィルター
  useEffect(() => {
    filterEntries();
  }, [searchQuery, entries]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('knowledge_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedStar) {
        query = query.contains('related_stars', [selectedStar]);
      }

      const { data, error } = await query;

      if (error) {
        console.error('知識エントリの取得エラー:', error);
        return;
      }

      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    if (!searchQuery.trim()) {
      setFilteredEntries(entries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.keywords?.some((tag) => tag.toLowerCase().includes(query))
    );

    setFilteredEntries(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterEntries();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            九星気学 知識ベース
          </h1>
          <p className="text-gray-600 text-lg">
            九星の詳細情報・性格分析・運勢アドバイスを検索できます
          </p>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* 検索バー */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                キーワード検索
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="キーワードを入力..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  検索
                </button>
              </div>
            </div>

            {/* 九星選択 */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                九星で絞り込み
              </label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStar(null)}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    selectedStar === null
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  全て
                </button>
                {starOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedStar(option.value)}
                    className={`py-2 px-3 rounded-lg border-2 transition-all text-xs ${
                      selectedStar === option.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            </div>

            {/* カテゴリ選択 */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                カテゴリで絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`py-2 px-4 rounded-lg border-2 transition-all ${
                      category === cat.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* 検索結果 */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">該当する知識エントリが見つかりませんでした。</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{entry.title}</h3>
                  {entry.related_stars && entry.related_stars.length > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {NINE_STARS[entry.related_stars[0] as NineStarNumber]}
                    </span>
                  )}
                </div>

                {entry.category_id && (
                  <div className="mb-3">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      知識
                    </span>
                  </div>
                )}

                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {entry.content.substring(0, 150)}...
                </p>

                {entry.keywords && entry.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.keywords.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 詳細表示モーダル */}
        {selectedEntry && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEntry(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{selectedEntry.title}</h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEntry.related_stars && selectedEntry.related_stars.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {selectedEntry.related_stars.map(s => NINE_STARS[s as NineStarNumber]).join(', ')}
                  </span>
                )}
              </div>

              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEntry.content}
                </div>
              </div>

              {selectedEntry.keywords && selectedEntry.keywords.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.keywords.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-600">読み込み中...</div>
      </div>
    }>
      <KnowledgeContent />
    </Suspense>
  );
}
