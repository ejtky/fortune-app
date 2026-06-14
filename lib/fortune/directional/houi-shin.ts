import {
  DAISHOGUN_BY_ETO_GROUP,
  OUBAN_BY_ETO,
  SAIKEI_BY_ETO,
  SAISATSU_BY_ETO,
  TAIIN_BY_ETO,
  TOSHITOKU_BY_TENKAN,
} from './houi-shin-tables';
import { oppositeEto } from './eto-tables';

export type HouiShinName =
  | '太歳神'
  | '歳破神'
  | '大将軍'
  | '歳徳神'
  | '黄幡神'
  | '豹尾神'
  | '歳殺神'
  | '歳刑神'
  | '大陰神';

const ETO_BY_DIRECTION: Record<string, string[]> = {
  北: ['子'],
  北東: ['丑', '寅'],
  東: ['卯'],
  南東: ['辰', '巳'],
  南: ['午'],
  南西: ['未', '申'],
  西: ['酉'],
  北西: ['戌', '亥'],
};

function containsEto(directionLabel: string, eto: string | undefined): boolean {
  if (!eto) return false;
  return ETO_BY_DIRECTION[directionLabel]?.includes(eto) ?? false;
}

export function classifyHouiShin(
  yearEto: string,
  yearTenkan: string,
  directionLabel: string
): HouiShinName[] {
  const result: HouiShinName[] = [];

  if (containsEto(directionLabel, yearEto)) result.push('太歳神');
  if (containsEto(directionLabel, oppositeEto(yearEto))) result.push('歳破神');

  if (directionLabel === DAISHOGUN_BY_ETO_GROUP[yearEto]) result.push('大将軍');
  if (containsEto(directionLabel, TOSHITOKU_BY_TENKAN[yearTenkan])) result.push('歳徳神');

  const ouban = OUBAN_BY_ETO[yearEto];
  if (containsEto(directionLabel, ouban)) result.push('黄幡神');
  if (containsEto(directionLabel, oppositeEto(ouban))) result.push('豹尾神');
  if (containsEto(directionLabel, TAIIN_BY_ETO[yearEto])) result.push('大陰神');
  if (containsEto(directionLabel, SAIKEI_BY_ETO[yearEto])) result.push('歳刑神');
  if (containsEto(directionLabel, SAISATSU_BY_ETO[yearEto])) result.push('歳殺神');

  return result;
}
