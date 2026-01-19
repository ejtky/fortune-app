'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

// マップコンポーネントを動的インポート（SSR無効化）
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">地図読み込み中...</div>
});

function MapSearchContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">基準日</label>
          <div className="font-bold text-xl text-slate-800">{date}</div>
        </div>
        <Link href="/search/direction" className="text-sm text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors">
          日付を変更 →
        </Link>
      </div>

      <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
        <MapComponent center={[35.6812, 139.7671]} zoom={9} />
      </div>
      
      <p className="text-center text-xs text-slate-400">
        ※ 地図上の線は偏角を考慮した方位境界線です
      </p>
    </div>
  );
}

export default function MapSearchPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-800 mb-2">開運マップ</h1>
        <p className="text-slate-500">地図上で正確な吉方位を確認しましょう</p>
      </div>

      <Suspense fallback={<div className="text-center py-20">読み込み中...</div>}>
         <MapSearchContent />
      </Suspense>
    </div>
  );
}
