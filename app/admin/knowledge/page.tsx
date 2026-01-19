'use client';

import { useState, useEffect } from 'react';
import {
  getCategories,
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  getTags,
  searchEntries,
  type KnowledgeCategory,
  type KnowledgeEntry,
  type KnowledgeEntryInsert,
  type KnowledgeTag
} from '@/lib/fortune/admin-api';

export default function KnowledgeAdmin() {
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [tags, setTags] = useState<KnowledgeTag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // フォーム状態
  const [formData, setFormData] = useState<Partial<KnowledgeEntryInsert>>({
    title: '',
    content: '',
    importance_level: 3,
    is_published: true
  });

  // データ取得
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [cats, ents, tgs] = await Promise.all([
        getCategories(),
        getEntries(),
        getTags()
      ]);
      setCategories(cats);
      setEntries(ents);
      setTags(tgs);
    } catch (error) {
      console.error('Failed to load data', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }

  // イベントハンドラ
  const handleAddNew = () => {
    setFormData({
      title: '',
      content: '',
      category_id: selectedCategory || (categories[0]?.id),
      importance_level: 3,
      is_published: true
    });
    setSelectedEntry(null);
    setIsAddingNew(true);
    setIsEditing(false);
  };

  const handleEdit = (entry: KnowledgeEntry) => {
    setFormData({
      ...entry
    });
    setSelectedEntry(entry);
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.content) {
        alert('タイトルと本文は必須です');
        return;
      }

      if (isAddingNew) {
        const newEntry = await createEntry(formData as KnowledgeEntryInsert);
        setEntries([newEntry, ...entries]);
        setIsAddingNew(false);
        setSelectedEntry(newEntry);
        alert('作成しました');
      } else if (isEditing && selectedEntry) {
        const updatedEntry = await updateEntry(selectedEntry.id, formData);
        setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        setIsEditing(false);
        setSelectedEntry(updatedEntry);
        alert('更新しました');
      }
    } catch (error) {
      console.error('Failed to save', error);
      alert('保存に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？この操作は取り消せません。')) return;
    
    try {
      await deleteEntry(id);
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
        setIsEditing(false);
      }
      alert('削除しました');
    } catch (error) {
      console.error('Failed to delete', error);
      alert('削除に失敗しました');
    }
  };

  // 検索ハンドラー
  const handleSearch = async () => {
    if (searchKeyword.trim()) {
      try {
        const results = await searchEntries(searchKeyword);
        setEntries(results);
      } catch (error) {
        console.error('Search failed', error);
      }
    } else {
      loadData();
    }
  };

  // タグフィルタリング
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  // フィルタリング
  const filteredEntries = entries.filter(entry => {
    // カテゴリフィルタ
    if (selectedCategory && entry.category_id !== selectedCategory) {
      return false;
    }

    // タグフィルタ（キーワード配列に含まれているかチェック）
    if (selectedTags.length > 0) {
      const entryKeywords = entry.keywords || [];
      const hasMatchingTag = selectedTags.some(tag =>
        entryKeywords.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">🔮 真実の知識データベース管理</h1>
          <p className="text-gray-600">本質的な知識を収集・管理するための管理画面</p>
        </div>

        {/* 検索バー */}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="🔍 キーワードで検索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              検索
            </button>
            {searchKeyword && (
              <button
                onClick={() => {
                  setSearchKeyword('');
                  loadData();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                クリア
              </button>
            )}
          </div>

          {/* タグフィルタ */}
          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">タグでフィルタ:</div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag.name)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.name) ? tag.color || '#9333EA' : undefined
                  }}
                >
                  {tag.name}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
                >
                  ✕ クリア
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* カテゴリ一覧 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">カテゴリ</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === ''
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  すべて ({entries.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* エントリ一覧と詳細/編集 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isAddingNew ? '新規作成' : isEditing ? '編集' : selectedEntry ? '詳細' : '一覧'}
                </h2>
                {!isAddingNew && !isEditing && (
                  <button
                    onClick={handleAddNew}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ➕ 新規追加
                  </button>
                )}
              </div>

              {(isAddingNew || isEditing) ? (
                /* 編集フォーム */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">タイトル *</label>
                      <input 
                        className="w-full border p-2 rounded"
                        value={formData.title || ''}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">カテゴリ</label>
                      <select 
                        className="w-full border p-2 rounded"
                        value={formData.category_id || ''}
                        onChange={e => setFormData({...formData, category_id: e.target.value})}
                      >
                         <option value="">選択してください</option>
                         {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">概要 (Summary)</label>
                    <textarea 
                      className="w-full border p-2 rounded h-20"
                      value={formData.summary || ''}
                      onChange={e => setFormData({...formData, summary: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">本文 (Content) *</label>
                    <textarea 
                      className="w-full border p-2 rounded h-40"
                      value={formData.content || ''}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold mb-1">本質 (Essence)</label>
                        <textarea 
                          className="w-full border p-2 rounded h-20"
                          value={formData.essence || ''}
                          onChange={e => setFormData({...formData, essence: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold mb-1">歴史的背景</label>
                        <textarea 
                          className="w-full border p-2 rounded h-20"
                          value={formData.historical_context || ''}
                          onChange={e => setFormData({...formData, historical_context: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold mb-1">伝統的教え</label>
                        <textarea 
                          className="w-full border p-2 rounded h-20"
                          value={formData.traditional_wisdom || ''}
                          onChange={e => setFormData({...formData, traditional_wisdom: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold mb-1">失われた知識</label>
                        <textarea 
                          className="w-full border p-2 rounded h-20"
                          value={formData.lost_knowledge || ''}
                          onChange={e => setFormData({...formData, lost_knowledge: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => {
                        setIsAddingNew(false);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      キャンセル
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : selectedEntry ? (
                /* 詳細表示 */
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedEntry(null)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      ← 一覧に戻る
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(selectedEntry)}
                        className="px-4 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(selectedEntry.id)}
                        className="px-4 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-purple-900 mb-2">{selectedEntry.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>重要度: {'⭐'.repeat(selectedEntry.importance_level)}</span>
                      <span>作成日: {new Date(selectedEntry.created_at).toLocaleDateString('ja-JP')}</span>
                    </div>

                    {/* キーワード表示 */}
                    {selectedEntry.keywords && selectedEntry.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm font-semibold text-gray-700">キーワード:</span>
                        {selectedEntry.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* コンテンツ表示エリア...既存のデザインを維持しつつデータバインディング */}
                   <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                      {selectedEntry.content}
                   </div>
                   
                   {/* 他のフィールドも表示 */}
                   {selectedEntry.essence && (
                     <div className="bg-purple-50 p-4 rounded mt-4">
                       <h4 className="font-bold text-purple-800">本質</h4>
                       <p>{selectedEntry.essence}</p>
                     </div>
                   )}
                </div>
              ) : (
                /* 一覧表示 */
                <div className="space-y-4">
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>データがありません</p>
                    </div>
                  ) : (
                    filteredEntries.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 flex-1">{entry.title}</h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {'⭐'.repeat(entry.importance_level)}
                          </span>
                        </div>
                        {entry.summary && <p className="text-sm text-gray-600 mt-1">{entry.summary}</p>}
                        {entry.keywords && entry.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.keywords.slice(0, 3).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                            {entry.keywords.length > 3 && (
                              <span className="text-xs text-gray-500">+{entry.keywords.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
