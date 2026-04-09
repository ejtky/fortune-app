import { getPersonalityTraits } from '@/lib/fortune/database';
import { getRelatedArticles } from '@/lib/fortune/knowledge-api';
import Link from 'next/link';
import NineStarDetailedProfile from '@/app/components/NineStarDetailedProfile';
import { STAR_NAMES, ELEMENT_MAP, LUCKY_COLORS, LUCKY_DIRECTIONS, CHARACTERISTICS, KEISHAKYU_MAP } from '@/lib/fortune/nine-star-ki/constants';
import type { NineStarKiReading } from '@/types/fortune';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 星IDから表示用の簡易的なreadingを生成
 * キャラクター紹介ページ用（個人の生年月日なし）
 */
function createStarReading(starId: number): NineStarKiReading {
  return {
    honmei: starId,
    getsumesei: starId, // 同じ星を仮設定
    keishakyu: KEISHAKYU_MAP[starId],
    dokaisei: starId,   // 同じ星を仮設定
    starName: STAR_NAMES[starId],
    element: ELEMENT_MAP[starId],
    characteristics: CHARACTERISTICS[starId],
    luckyColors: LUCKY_COLORS[starId],
    luckyDirections: LUCKY_DIRECTIONS[starId],
    monthStarName: STAR_NAMES[starId],
    interpretation: {
      personality: `${STAR_NAMES[starId]}の基本的な性質`,
      talents: `${ELEMENT_MAP[starId]}の才能`,
      tendencies: `${ELEMENT_MAP[starId]}の傾向`
    }
  };
}

export default async function KyuseiCharacterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id) || id < 1 || id > 9) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>該当する九星が見つかりません</p>
      </div>
    );
  }

  // Fetch data directly from DB
  const knowledge = await getPersonalityTraits(id);

  if (!knowledge) {
    return (
       <div className="min-h-screen flex items-center justify-center">
        <p>データの取得に失敗しました。時間をおいて再度お試しください。</p>
      </div>
    );
  }

  // 関連記事を取得
  const relatedArticles = await getRelatedArticles(knowledge.star_name);

  // 表示用のreadingを生成
  const reading = createStarReading(id);

  return (
    <main className="min-h-screen p-0 bg-[#FCFAF2]">
      {/* 共通ヘッダー */}
      <header className="bg-[#533D5B] py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {knowledge.star_name}
          </h1>
          <p className="text-purple-100 text-lg md:text-xl">
             {knowledge.element}の性：基本性格と運勢の詳解
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">TOP</Link>
          <span className="mx-2">/</span>
          <span>九星性格診断</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{knowledge.star_name}</span>
        </nav>

        {/* 詳細プロフィールコンポーネント */}
        <div className="mb-12">
          <NineStarDetailedProfile reading={reading} />
        </div>

        <div className="space-y-12">
          {/* 詳しい解説セクション */}
          {relatedArticles.length > 0 && (
            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-purple-50">
              <h2 className="text-3xl font-bold text-[#4A225D] mb-8 border-b-2 border-purple-100 pb-2 flex items-center">
                <span className="mr-3 text-3xl">📚</span> 詳しい解説
              </h2>
              <div className="space-y-6">
                {relatedArticles.map((article) => (
                  <div key={article.id} className="border-l-4 border-purple-200 pl-6 py-4 hover:bg-purple-50/30 transition-colors rounded-r-lg">
                    <h3 className="text-xl font-bold text-[#4A225D] mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {article.summary || article.content.substring(0, 200) + '...'}
                    </p>
                    <Link
                      href={`/knowledge/${article.slug}`}
                      className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center transition-colors"
                    >
                      続きを読む →
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-purple-100 text-center">
                <Link
                  href="/knowledge/search"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <span className="mr-2">🔍</span> すべての解説を検索する
                </Link>
              </div>
            </section>
          )}

          {/* ナビゲーション */}
          <div className="mt-12 pt-8 border-t border-purple-100 flex justify-between items-center text-sm">
            <Link href="/" className="text-[#4A225D] font-bold hover:underline transition-all">← TOPに戻る</Link>
            <p className="text-gray-400">© 2026 Antigravity Fortune App</p>
          </div>
        </div>
      </div>
    </main>
  );
}
