'use client';

import React from 'react';

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedText = encodeURIComponent(`${title}\n${text}\n${shareUrl}`);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${text}\n`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
      alert('リンクをクリップボードにコピーしました');
    }
  };

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  const shareOnLine = () => {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodedText}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">結果を共有する</span>
      <div className="flex gap-4">
        {/* X (Twitter) */}
        <button
          onClick={shareOnX}
          className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:scale-110 transition-transform shadow-md"
          aria-label="Xでシェア"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* LINE */}
        <button
          onClick={shareOnLine}
          className="w-12 h-12 flex items-center justify-center bg-[#06C755] text-white rounded-full hover:scale-110 transition-transform shadow-md"
          aria-label="LINEでシェア"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M24 10.304c0-4.369-4.805-7.911-10.708-7.911-5.903 0-10.708 3.542-10.708 7.911 0 3.917 3.805 7.206 8.941 7.828.348.075.822.23.943.527.108.263.07.675.035.941l-.151.916c-.045.285-.219 1.116.942.608 1.161-.508 6.264-3.69 8.542-6.319C23.23 13.562 24 12.029 24 10.304z" />
          </svg>
        </button>

        {/* ネイティブシェア / コピー */}
        <button
          onClick={handleNativeShare}
          className="w-12 h-12 flex items-center justify-center bg-stone-700 text-stone-100 rounded-full hover:scale-110 transition-transform shadow-md"
          aria-label="その他でシェア"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
