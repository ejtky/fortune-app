import { PRECISE_SETSUIRI_DATA } from './setsuiri-precise-data';

/**
 * 九星の数値と名称の対応
 */
export const KYUSEI_NAMES: { [key: number]: string } = {
  1: '一白水星',
  2: '二黒土星',
  3: '三碧木星',
  4: '四緑木星',
  5: '五黄土星',
  6: '六白金星',
  7: '七赤金星',
  8: '八白土星',
  9: '九紫火星',
};

/**
 * 数値を1桁になるまで足し合わせる（桁和）
 * 例: 1977 -> 1+9+7+7=24 -> 2+4=6
 */
export function getDigitSum(n: number): number {
  let s = n;
  while (s >= 10) {
    s = s.toString().split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  }
  return s;
}

/**
 * 指定した日時が節入り時刻を過ぎているか判定する
 */
export function isAfterSetsuiri(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): boolean {
  const annualData = PRECISE_SETSUIRI_DATA[year];
  if (!annualData || !annualData[month]) {
    // データがない場合は毎月5日をデフォルトの節入りとする（暫定）
    return day >= 5;
  }
  const s = annualData[month];
  if (day > s.day) return true;
  if (day < s.day) return false;
  if (hour > s.hour) return true;
  if (hour < s.hour) return false;
  return minute >= s.minute;
}

/**
 * 本命星（年の九星）を算出する (大正13年説: 11引き)
 */
export function getYearStar(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): number {
  let targetYear = year;

  // 立春（2月）の節入り判定。立春前なら前年扱い。
  const afterRisshun = isAfterSetsuiri(year, 2, day, hour, minute);
  if (month < 2 || (month === 2 && !afterRisshun)) {
    targetYear -= 1;
  }

  // ステップ1: 西暦年の桁和
  const s = getDigitSum(targetYear);

  // ステップ2: 11から引く (大正13年説)
  let r = 11 - s;

  // 特例処理
  if (r > 9) r -= 9;
  if (r <= 0) r += 9;

  return r;
}

/**
 * 月命星（月の九星）を算出する (大正13年説)
 */
export function getMonthStar(
  yearStar: number,
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): number {
  // 九星気学上の「月」を決定
  let targetMonth = month;
  const afterSetsuiri = isAfterSetsuiri(year, month, day, hour, minute);

  if (!afterSetsuiri) {
    targetMonth -= 1;
    if (targetMonth === 0) targetMonth = 12;
  }

  // 年星に基づきグループを決定 (資料10P: Pythonコード準拠)
  let startStar: number;
  if ([1, 4, 7].includes(yearStar)) {
    startStar = 8; // Aグループ: 寅月(2月)=八白
  } else if ([2, 5, 8].includes(yearStar)) {
    startStar = 2; // Bグループ: 寅月(2月)=二黒 (★大正13年説特有)
  } else {
    startStar = 5; // Cグループ: 寅月(2月)=五黄 (★大正13年説特有)
  }

  /**
   * 月の進路に合わせて九星を逆算
   * 寅(2月)を0として、targetMonthとの差分を引く
   * 九星は 1->9 ではなく 9->1 の順に巡るため
   */
  let monthOffset = targetMonth - 2;
  if (monthOffset < 0) monthOffset += 12;

  let r = startStar - monthOffset;
  while (r <= 0) r += 9;
  while (r > 9) r -= 9;

  return r;
}
