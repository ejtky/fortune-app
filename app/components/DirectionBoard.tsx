'use client';

import { classifyDirection } from '@/lib/fortune/directional/calculator';
import type { DirectionKey } from '@/lib/fortune/directional/constants';
import { DIRECTIONS } from '@/lib/fortune/directional/constants';
import type { DirectionCategory } from '@/lib/fortune/directional/colors';
import {
  CATEGORY_PRIORITY,
  DIRECTION_CATEGORY_LABEL,
  DIRECTION_FILL_COLOR_HEX,
  pickTopCategory,
} from '@/lib/fortune/directional/colors';
import type { HouiShinName } from '@/lib/fortune/directional/houi-shin';
import { SAIROKU_BY_TENKAN } from '@/lib/fortune/directional/houi-shin-tables';
import type { LoshuLayout } from '@/lib/fortune/directional/loshu';
import { useDirectionMode } from '@/lib/stores/directionMode';
import { STAR_NAMES } from '@/lib/fortune/nine-star-ki/constants';

type Props = {
  board: Record<string, number>;
  honmei: number;
  getsumei: number;
  yearEto: string;
  yearTenkan: string;
  yearLabel: string;
  yearRange: string;
};

type BoardDirection = Exclude<DirectionKey, 'CENTER'>;

type CellConfig = {
  direction: DirectionKey;
  labelClass: string;
};

const BOARD_CELLS: CellConfig[] = [
  { direction: 'NW', labelClass: '-top-4 left-0.5 text-left' },
  { direction: 'N', labelClass: '-top-4 left-1/2 -translate-x-1/2 text-center' },
  { direction: 'NE', labelClass: '-top-4 right-0.5 text-right' },
  { direction: 'W', labelClass: 'left-[-1.4rem] top-1/2 -translate-y-1/2 text-right' },
  { direction: 'CENTER', labelClass: '' },
  { direction: 'E', labelClass: 'right-[-1.4rem] top-1/2 -translate-y-1/2 text-left' },
  { direction: 'SW', labelClass: '-bottom-4 left-0.5 text-left' },
  { direction: 'S', labelClass: '-bottom-4 left-1/2 -translate-x-1/2 text-center' },
  { direction: 'SE', labelClass: '-bottom-4 right-0.5 text-right' },
];

const ETO_BY_DIRECTION: Record<BoardDirection, string[]> = {
  N: ['子'],
  NE: ['丑', '寅'],
  E: ['卯'],
  SE: ['辰', '巳'],
  S: ['午'],
  SW: ['未', '申'],
  W: ['酉'],
  NW: ['戌', '亥'],
};

export default function DirectionBoard({
  board,
  honmei,
  getsumei,
  yearEto,
  yearTenkan,
  yearLabel,
  yearRange,
}: Props) {
  const mode = useDirectionMode((state) => state.mode);
  const displayMode = mode === 'all' ? 'both' : mode;
  const layout = board as unknown as LoshuLayout;

  return (
    <section className="w-full max-w-[200px] mx-auto select-none">
      <div className="overflow-hidden rounded border border-slate-300 bg-slate-50 shadow-sm">
        <div className="grid grid-cols-[40px_1fr] bg-rose-500 text-white text-center font-bold">
          <div className="border-r border-white/80 py-1 text-[10px] flex items-center justify-center">年盤</div>
          <div className="py-1 leading-tight">
            <div className="text-[11px]">{yearLabel}</div>
            <div className="text-[8px]">({yearRange})</div>
          </div>
        </div>

        <div className="px-6 pt-6 pb-6">
          <div className="grid grid-cols-3 grid-rows-3 gap-0">
            {BOARD_CELLS.map((cell) => {
              if (cell.direction === 'CENTER') {
                return (
                  <div
                    key="CENTER"
                    className="relative aspect-square min-h-[46px] sm:min-h-[50px] border border-slate-500 bg-white flex flex-col items-center justify-center"
                  >
                    <div className="text-[7px] font-bold text-slate-500">中宮</div>
                    <div className="text-lg sm:text-xl leading-none font-serif text-slate-900">{layout.CENTER}</div>
                    <div className="mt-0 text-[7px] text-slate-500">{shortStarName(layout.CENTER)}</div>
                  </div>
                );
              }

              return (
                <DirectionCell
                  key={cell.direction}
                  direction={cell.direction}
                  labelClass={cell.labelClass}
                  layout={layout}
                  honmei={honmei}
                  getsumei={getsumei}
                  yearEto={yearEto}
                  yearTenkan={yearTenkan}
                  mode={displayMode}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectionCell({
  direction,
  labelClass,
  layout,
  honmei,
  getsumei,
  yearEto,
  yearTenkan,
  mode,
}: {
  direction: BoardDirection;
  labelClass: string;
  layout: LoshuLayout;
  honmei: number;
  getsumei: number;
  yearEto: string;
  yearTenkan: string;
  mode: 'kichikyou' | 'houishin' | 'both';
}) {
  const star = layout[direction];
  const categories = classifyDirection({
    direction,
    honmei,
    getsumei,
    layout,
    boardType: 'year',
    yearEto,
    yearTenkan,
  });
  const topCategory = pickTopCategory(categories);
  const houiShinNames = categories.houiShinNames;
  const displayHouiShinNames = getDisplayHouiShinNames(houiShinNames, direction, yearTenkan);
  const fill = pickCellFill(topCategory);
  const kichikyouLabels = getKichikyouLabels(categories);
  const houiShinLabel = displayHouiShinNames.length > 0 ? displayHouiShinNames.join(' / ') : 'なし';

  return (
    <div
      className="relative aspect-square min-h-[46px] sm:min-h-[50px] border border-slate-500 flex flex-col items-center justify-center p-0.5"
      style={{ backgroundColor: fill }}
      data-direction={DIRECTIONS[direction]}
      data-kichikyou={kichikyouLabels.join('/')}
      data-houi-shin={displayHouiShinNames.join('/')}
    >
      <div className={`absolute text-[8px] font-bold text-slate-600 whitespace-nowrap ${labelClass}`}>
        {DIRECTIONS[direction]}
      </div>

      <div className="text-base sm:text-lg leading-none font-serif text-slate-900">{star}</div>
      <div className="mt-0 text-[7px] text-slate-600">{shortStarName(star)}</div>

      <div className="mt-0 w-full text-center text-[7px] leading-tight font-bold text-slate-800">
        {(mode === 'kichikyou' || mode === 'both') && (
          <div>{kichikyouLabels.join(' / ')}</div>
        )}
        {(mode === 'houishin' || mode === 'both') && (
          <div className={mode === 'both' ? 'mt-0 text-slate-600' : ''}>{houiShinLabel}</div>
        )}
      </div>
    </div>
  );
}

function getKichikyouLabels(categories: DirectionCategory[]): string[] {
  const meaningful = categories.filter((cat) => cat !== 'normal');
  if (meaningful.length === 0) return [DIRECTION_CATEGORY_LABEL.normal];

  const hasBlockingCategory = meaningful.some(
    (cat) => CATEGORY_PRIORITY[cat] >= CATEGORY_PRIORITY.teii_taichu
  );

  const visible = hasBlockingCategory
    ? meaningful.filter((cat) => CATEGORY_PRIORITY[cat] >= CATEGORY_PRIORITY.teii_taichu)
    : meaningful;

  return visible.map((cat) => DIRECTION_CATEGORY_LABEL[cat]);
}

function getDisplayHouiShinNames(
  names: HouiShinName[],
  direction: BoardDirection,
  yearTenkan: string
): string[] {
  const displayNames = [...names];
  const sairokuEto = SAIROKU_BY_TENKAN[yearTenkan];
  if (sairokuEto && ETO_BY_DIRECTION[direction].includes(sairokuEto) && !displayNames.includes('歳禄神' as HouiShinName)) {
    displayNames.push('歳禄神' as HouiShinName);
  }
  return displayNames;
}

function pickCellFill(category: DirectionCategory): string {
  // モードに関わらず色は常に方位吉凶（種別）基準で固定。モード切替は表示文字だけ変える
  return DIRECTION_FILL_COLOR_HEX[category];
}

function shortStarName(star: number): string {
  return STAR_NAMES[star]?.replace(/[水土木金火]星$/, '') ?? `${star}星`;
}
