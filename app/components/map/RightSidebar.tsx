'use client';
import * as React from 'react';

import type { DivisionType, LineType, MapSettings } from './MapCore';

interface RightSidebarProps {
  settings: MapSettings;
  onSettingsChange: (s: Partial<MapSettings>) => void;
}


export default function RightSidebar({
  settings,
  onSettingsChange,
}: RightSidebarProps) {

  const toggle = (key: keyof MapSettings, val?: boolean) =>
    onSettingsChange({ [key]: val ?? !settings[key] });

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pt-1">{children}</div>
  );

  const DivisionButtons = ({
    value,
    onChange,
  }: {
    value: DivisionType;
    onChange: (v: DivisionType) => void;
  }) => (
    <div className="flex gap-1">
      {(['30_60', '45', '24'] as DivisionType[]).map(d => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`flex-1 py-1 text-xs rounded border transition-colors ${
            value === d
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {d === '30_60' ? '30/60°' : d === '45' ? '45°' : '二十四山'}
        </button>
      ))}
    </div>
  );

  const CheckRow = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="rounded accent-indigo-500"
      />
      <span className="text-xs text-slate-600">{label}</span>
    </label>
  );

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col text-sm overflow-y-auto">

      {/* カラーオーバーレイ */}
      <div className="p-3 border-b border-slate-100">
        <SectionTitle>カラーオーバーレイ</SectionTitle>
        <CheckRow label="方位色をマップに表示" checked={settings.showColors} onChange={v => toggle('showColors', v)} />
      </div>

      {/* 表示切り替え */}
      <div className="p-3 border-b border-slate-100">
        <SectionTitle>表示切り替え</SectionTitle>
        <div className="space-y-0.5">
          <CheckRow label="コンパス" checked={settings.showCompass} onChange={v => toggle('showCompass', v)} />
          <CheckRow label="盤上に表示" checked={settings.showBoardOnMap} onChange={v => toggle('showBoardOnMap', v)} />
          <CheckRow label="地図コントロール" checked={settings.showControls} onChange={v => toggle('showControls', v)} />
        </div>
      </div>

      {/* 大圏方位線 */}
      <div className="p-3 border-b border-slate-100">
        <SectionTitle>大圏方位線</SectionTitle>
        <DivisionButtons
          value={settings.lineType === 'great' ? settings.division : '45'}
          onChange={v => onSettingsChange({ division: v, lineType: 'great',  })}
        />
      </div>

      {/* 等角方位線 */}
      <div className="p-3 border-b border-slate-100">
        <SectionTitle>等角方位線</SectionTitle>
        <DivisionButtons
          value={settings.lineType === 'rhumb' ? settings.division : '45'}
          onChange={v => onSettingsChange({ division: v, lineType: 'rhumb',  })}
        />
        <div className="mt-1.5 flex justify-end">
          <button
            onClick={() => onSettingsChange({ lineType: settings.lineType === 'great' ? 'rhumb' : 'great' })}
            className="text-xs text-indigo-500 hover:text-indigo-700 underline"
          >
            {settings.lineType === 'great' ? '等角に切替' : '大圏に切替'}
          </button>
        </div>
      </div>

      {/* コンパス設定 */}
      <div className="p-3 border-b border-slate-100">
        <SectionTitle>コンパス設定</SectionTitle>
        <DivisionButtons
          value={settings.compassDivision}
          onChange={v => onSettingsChange({ compassDivision: v, showCompass: true })}
        />
        <div className="mt-1.5">
          <button
            onClick={() => onSettingsChange({ compassLineType: settings.compassLineType === 'great' ? 'rhumb' : 'great' })}
            className="w-full text-xs py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
          >
            {settings.compassLineType === 'great' ? '等角コンパスに変更' : '大圏コンパスに変更'}
          </button>
        </div>
      </div>

      {/* 凡例 */}
      <div className="p-3 border-b border-slate-100">
        <SectionTitle>凡例</SectionTitle>
        <div className="space-y-1">
          {[
            { color: '#10b981', label: '大吉' },
            { color: '#3b82f6', label: '吉' },
            { color: '#6b7280', label: '平' },
            { color: '#f59e0b', label: '小凶' },
            { color: '#ef4444', label: '凶' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 偏角設定 */}
      <div className="p-3">
        <SectionTitle>偏角設定</SectionTitle>
        <div className="flex gap-3 mb-2">
          {(['west', 'east'] as const).map(dir => (
            <label key={dir} className="flex items-center gap-1 cursor-pointer text-xs">
              <input
                type="radio"
                name="decl-dir"
                checked={settings.declinationDir === dir}
                onChange={() => onSettingsChange({ declinationDir: dir })}
                className="accent-indigo-500"
              />
              {dir === 'west' ? '西偏' : '東偏'}
            </label>
          ))}
        </div>
        <div className="flex gap-1.5 items-center mb-2">
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-0.5">度</label>
            <input
              type="number"
              min={0}
              max={180}
              value={settings.declinationDeg}
              onChange={e => onSettingsChange({ declinationDeg: Number(e.target.value) })}
              className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-0.5">分</label>
            <input
              type="number"
              min={0}
              max={59}
              value={settings.declinationMin}
              onChange={e => onSettingsChange({ declinationMin: Number(e.target.value) })}
              className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onSettingsChange({ declinationDeg: 0, declinationMin: 0 })}
            className="flex-1 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-500"
          >
            リセット
          </button>
        </div>
      </div>
    </aside>
  );
}
