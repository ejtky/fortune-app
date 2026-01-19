import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h3 className="font-bold mb-3 border-b border-slate-600 pb-2">九星気学 八雲院について</h3>
            <p className="text-slate-300 leading-relaxed">
              伝統的な九星気学に基づき、正確な方位盤と運勢情報を提供する無料占いサイトです。
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3 border-b border-slate-600 pb-2">コンテンツ</h3>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/about/kyusei_calendar" className="hover:text-purple-300">九星カレンダー</Link></li>
              <li><Link href="/search/direction" className="hover:text-purple-300">吉方位サーチ</Link></li>
              <li><Link href="/search/map" className="hover:text-purple-300">開運マップ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 border-b border-slate-600 pb-2">サポート</h3>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/terms" className="hover:text-purple-300">利用規約</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-300">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-400 text-sm border-t border-slate-700 pt-4">
          © {new Date().getFullYear()} 九星気学 八雲院 (Fortune App Clone)
        </div>
      </div>
    </footer>
  );
}
