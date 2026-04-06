import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl pt-1 group-hover:opacity-80 transition-opacity">
              🕉️
            </span>
            <span className="text-xl font-bold text-gray-800 font-serif tracking-wide group-hover:text-purple-700 transition-colors">
              九星気学 八雲院
            </span>
          </Link>
        </div>
        
        <nav className="hidden lg:flex gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <Link href="/daily/direction" className="hover:text-purple-600 transition-colors">今日</Link>
          <Link href="/monthly/direction" className="hover:text-purple-600 transition-colors">今月</Link>
          <Link href="/yearly/direction" className="hover:text-purple-600 transition-colors">今年</Link>
          <Link href="/search/direction" className="hover:text-purple-600 transition-colors">吉方位サーチ</Link>
          <Link href="/about/kyusei_calendar" className="hover:text-purple-600 transition-colors">カレンダー</Link>
          <Link href="/search/map" className="hover:text-purple-600 transition-colors">開運マップ</Link>
        </nav>

        <div className="md:hidden">
          <button className="text-gray-500 hover:text-gray-700 p-2">
            <span className="sr-only">メニュー</span>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
