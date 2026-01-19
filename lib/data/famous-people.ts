export interface FamousPerson {
  id: string;
  name: string;
  birthDate: string;
  honmei: number;
  tags: string[];
}
export const FAMOUS_PEOPLE: FamousPerson[] = [
  { id: '1', name: '木村 拓哉', birthDate: '1972-11-13', honmei: 2, tags: ['俳優'] },
  { id: '2', name: '明石家 さんま', birthDate: '1955-07-01', honmei: 9, tags: ['芸人'] },
  { id: '3', name: '大谷 翔平', birthDate: '1994-07-05', honmei: 6, tags: ['野球'] },
  { id: '4', name: '松本人志', birthDate: '1963-09-08', honmei: 1, tags: ['芸人'] },
  { id: '5', name: '綾瀬 はるか', birthDate: '1985-03-24', honmei: 6, tags: ['女優'] }
];
