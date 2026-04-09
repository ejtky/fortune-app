'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/daily/direction',       label: '今日' },
  { href: '/monthly/direction',     label: '今月' },
  { href: '/yearly/direction',      label: '今年' },
  { href: '/search/direction',      label: '吉方位サーチ' },
  { href: '/about/kyusei_calendar', label: 'カレンダー' },
  { href: '/direction-map',         label: '開運マップ' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setOpen(false)}>
          <span className="text-xl pt-0.5">🕉️</span>
          <span className="text-base sm:text-lg font-bold text-gray-800 font-serif tracking-wide group-hover:text-purple-700 transition-colors">
            九星気学・方位学鑑定
          </span>
        </Link>

        {/* PC ナビ */}
        <nav className="hidden lg:flex gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-purple-600 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ハンバーガーボタン（lg未満で表示） */}
        <button
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="メニュー"
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="flex flex-col py-2">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
