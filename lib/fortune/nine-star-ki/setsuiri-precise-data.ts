/**
 * 九星気学 精密節入りデータ (2020-2027年)
 * 資料: 「九星気学 日時計算データ集（大正13年説準拠）」より
 * 全ての時刻は日本標準時 (JST)
 */

export interface Setsuiri {
  month: number; // 節月の開始月 (2=2月/立春, 3=啓蟄, ...)
  day: number;
  hour: number;
  minute: number;
}

export type AnnualSetsuiri = { [month: number]: Setsuiri };

export const PRECISE_SETSUIRI_DATA: { [year: number]: AnnualSetsuiri } = {
  2020: {
    2: { month: 2, day: 4, hour: 17, minute: 3 },  // 立春
    3: { month: 3, day: 5, hour: 11, minute: 57 }, // 啓蟄
    4: { month: 4, day: 4, hour: 16, minute: 38 }, // 清明
    5: { month: 5, day: 5, hour: 10, minute: 51 }, // 立夏
    6: { month: 6, day: 5, hour: 14, minute: 58 }, // 芒種
    7: { month: 7, day: 7, hour: 1, minute: 14 },  // 小暑
    8: { month: 8, day: 7, hour: 10, minute: 6 },  // 立秋
    9: { month: 9, day: 7, hour: 12, minute: 8 },  // 白露
    10: { month: 10, day: 8, hour: 3, minute: 55 }, // 寒露
    11: { month: 11, day: 7, hour: 6, minute: 14 }, // 立冬
    12: { month: 12, day: 7, hour: 6, minute: 9 },  // 大雪
    1: { month: 1, day: 6, hour: 12, minute: 17 }, // 小寒 (翌年1月)
  },
  2021: {
    2: { month: 2, day: 3, hour: 23, minute: 59 },
    3: { month: 3, day: 5, hour: 17, minute: 54 },
    4: { month: 4, day: 4, hour: 22, minute: 35 },
    5: { month: 5, day: 5, hour: 16, minute: 47 },
    6: { month: 6, day: 5, hour: 20, minute: 52 },
    7: { month: 7, day: 7, hour: 7, minute: 5 },
    8: { month: 8, day: 7, hour: 15, minute: 54 },
    9: { month: 9, day: 7, hour: 17, minute: 53 },
    10: { month: 10, day: 8, hour: 9, minute: 39 },
    11: { month: 11, day: 7, hour: 12, minute: 0 },
    12: { month: 12, day: 7, hour: 11, minute: 57 },
    1: { month: 1, day: 5, hour: 17, minute: 23 },
  },
  2022: {
    2: { month: 2, day: 4, hour: 5, minute: 51 },
    3: { month: 3, day: 5, hour: 23, minute: 44 },
    4: { month: 4, day: 5, hour: 4, minute: 20 },
    5: { month: 5, day: 5, hour: 22, minute: 26 },
    6: { month: 6, day: 6, hour: 2, minute: 26 },
    7: { month: 7, day: 7, hour: 12, minute: 38 },
    8: { month: 8, day: 7, hour: 21, minute: 29 },
    9: { month: 9, day: 8, hour: 0, minute: 32 },
    10: { month: 10, day: 8, hour: 15, minute: 23 },
    11: { month: 11, day: 7, hour: 17, minute: 45 },
    12: { month: 12, day: 7, hour: 17, minute: 46 },
    1: { month: 1, day: 5, hour: 23, minute: 5 },
  },
  2023: {
    2: { month: 2, day: 4, hour: 11, minute: 43 },
    3: { month: 3, day: 6, hour: 5, minute: 36 },
    4: { month: 4, day: 5, hour: 10, minute: 13 },
    5: { month: 5, day: 6, hour: 4, minute: 19 },
    6: { month: 6, day: 6, hour: 8, minute: 18 },
    7: { month: 7, day: 7, hour: 18, minute: 31 },
    8: { month: 8, day: 8, hour: 3, minute: 23 },
    9: { month: 9, day: 8, hour: 6, minute: 27 },
    10: { month: 10, day: 8, hour: 21, minute: 16 },
    11: { month: 11, day: 8, hour: 0, minute: 36 },
    12: { month: 12, day: 7, hour: 23, minute: 33 },
    1: { month: 1, day: 6, hour: 5, minute: 49 },
  },
  2024: {
    2: { month: 2, day: 4, hour: 17, minute: 27 },
    3: { month: 3, day: 5, hour: 11, minute: 23 },
    4: { month: 4, day: 4, hour: 16, minute: 2 },
    5: { month: 5, day: 5, hour: 10, minute: 10 },
    6: { month: 6, day: 5, hour: 14, minute: 10 },
    7: { month: 7, day: 6, hour: 23, minute: 20 },
    8: { month: 8, day: 7, hour: 9, minute: 9 },
    9: { month: 9, day: 7, hour: 11, minute: 11 },
    10: { month: 10, day: 8, hour: 2, minute: 0 },
    11: { month: 11, day: 7, hour: 4, minute: 20 },
    12: { month: 12, day: 7, hour: 4, minute: 17 },
    1: { month: 1, day: 5, hour: 11, minute: 33 },
  },
  2025: {
    2: { month: 2, day: 3, hour: 22, minute: 10 },
    3: { month: 3, day: 5, hour: 17, minute: 7 },
    4: { month: 4, day: 4, hour: 21, minute: 48 },
    5: { month: 5, day: 5, hour: 16, minute: 1 },
    6: { month: 6, day: 5, hour: 20, minute: 5 },
    7: { month: 7, day: 7, hour: 6, minute: 17 },
    8: { month: 8, day: 7, hour: 15, minute: 9 },
    9: { month: 9, day: 7, hour: 17, minute: 11 },
    10: { month: 10, day: 8, hour: 7, minute: 59 },
    11: { month: 11, day: 7, hour: 10, minute: 3 },
    12: { month: 12, day: 7, hour: 10, minute: 4 },
    1: { month: 1, day: 5, hour: 16, minute: 16 },
  },
  2026: {
    2: { month: 2, day: 4, hour: 4, minute: 2 },
    3: { month: 3, day: 5, hour: 22, minute: 57 },
    4: { month: 4, day: 5, hour: 3, minute: 40 },
    5: { month: 5, day: 5, hour: 21, minute: 48 },
    6: { month: 6, day: 6, hour: 1, minute: 50 },
    7: { month: 7, day: 7, hour: 12, minute: 2 },
    8: { month: 8, day: 7, hour: 20, minute: 54 },
    9: { month: 9, day: 7, hour: 23, minute: 0 },
    10: { month: 10, day: 8, hour: 13, minute: 49 },
    11: { month: 11, day: 7, hour: 16, minute: 5 },
    12: { month: 12, day: 7, hour: 16, minute: 3 },
    1: { month: 1, day: 5, hour: 22, minute: 2 },
  },
  2027: {
    2: { month: 2, day: 3, hour: 9, minute: 45 },
    3: { month: 3, day: 5, hour: 4, minute: 35 },
    4: { month: 4, day: 4, hour: 9, minute: 17 },
    5: { month: 5, day: 5, hour: 3, minute: 22 },
    6: { month: 6, day: 5, hour: 7, minute: 22 },
    7: { month: 7, day: 6, hour: 17, minute: 35 },
    8: { month: 8, day: 7, hour: 2, minute: 26 },
    9: { month: 9, day: 7, hour: 4, minute: 29 },
    10: { month: 10, day: 7, hour: 19, minute: 21 },
    11: { month: 11, day: 6, hour: 21, minute: 36 },
    12: { month: 12, day: 6, hour: 21, minute: 33 },
    1: { month: 1, day: 5, hour: 3, minute: 41 },
  },
};