'use client';

import type { DirectionMode } from '@/lib/stores/directionMode';
import { useDirectionMode } from '@/lib/stores/directionMode';

const MODES: Array<{ mode: DirectionMode; label: string }> = [
  { mode: 'kichikyou', label: '吉凶' },
  { mode: 'houishin', label: '方位神' },
  { mode: 'both', label: 'すべて' },
];

export default function DirectionBoardModeToggle() {
  const mode = useDirectionMode((state) => state.mode);
  const setMode = useDirectionMode((state) => state.setMode);

  return (
    <div className="flex gap-1 mt-3 justify-center text-xs" aria-label="方位盤の表示モード">
      {MODES.map((item) => (
        <button
          key={item.mode}
          type="button"
          onClick={() => setMode(item.mode)}
          className={
            mode === item.mode
              ? 'bg-slate-800 text-white px-3 py-1.5 rounded font-bold'
              : 'bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold hover:bg-slate-300'
          }
          aria-pressed={mode === item.mode}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
