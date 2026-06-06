import { calculateHonmeiStar } from '@/lib/fortune/nine-star-ki/calculator';

/**
 * 有名人データ
 *
 * honmei（本命星）は手打ちせず、birthDate から自動計算する。
 * → 入力ミス（手打ちで誤った本命星を登録してしまう事故）を構造的に防ぐ。
 *
 * 新しい有名人を追加するときは FAMOUS_PEOPLE_INPUT に
 * { id, name, birthDate, tags } を足すだけでよい。本命星は自動で付与される。
 */

export interface FamousPerson {
  id: string;
  name: string;
  /** YYYY-MM-DD 形式 */
  birthDate: string;
  /** birthDate から自動計算される本命星（1-9） */
  honmei: number;
  tags: string[];
}

/** 手打ちで管理する生データ（honmei は持たない） */
type FamousPersonInput = Omit<FamousPerson, 'honmei'>;

const FAMOUS_PEOPLE_INPUT: FamousPersonInput[] = [
  { id: '1', name: '木村 拓哉', birthDate: '1972-11-13', tags: ['俳優'] },
  { id: '2', name: '明石家 さんま', birthDate: '1955-07-01', tags: ['芸人'] },
  { id: '3', name: '大谷 翔平', birthDate: '1994-07-05', tags: ['野球'] },
  { id: '4', name: '松本人志', birthDate: '1963-09-08', tags: ['芸人'] },
  { id: '5', name: '綾瀬 はるか', birthDate: '1985-03-24', tags: ['女優'] }
];

/**
 * 'YYYY-MM-DD' をローカルタイムの Date に変換する。
 * new Date('YYYY-MM-DD') は UTC 解釈になり日付がずれる場合があるため、
 * 年月日を分解してローカル Date を生成する。
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** 本命星を自動計算して付与した有名人データ */
export const FAMOUS_PEOPLE: FamousPerson[] = FAMOUS_PEOPLE_INPUT.map((person) => ({
  ...person,
  honmei: calculateHonmeiStar(parseLocalDate(person.birthDate))
}));
