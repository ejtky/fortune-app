import { getYearStar, getMonthStar, KYUSEI_NAMES } from '../lib/fortune/nine-star-ki/kyusei-calc-taisho13';

function test(year: number, month: number, day: number, hour: number, minute: number) {
  const yStart = getYearStar(year, month, day, hour, minute);
  const mStart = getMonthStar(yStart, year, month, day, hour, minute);
  console.log(`[${year}/${month}/${day} ${hour}:${minute}]`);
  console.log(`  本命星: ${yStart} (${KYUSEI_NAMES[yStart]})`);
  console.log(`  月命星: ${mStart} (${KYUSEI_NAMES[mStart]})`);
}

console.log("--- PDF検証例 1: 1977年11月 (亥月) ---");
test(1977, 11, 15, 12, 0);
// 期待値: 本命星=5(五黄), 月命星=2(二黒)
test(1977, 11, 22, 12, 0);
// 期待値: 本命星=5(五黄), 月命星=2(二黒)
test(1977, 12, 6, 12, 0);
// 期待値: 本命星=5(五黄), 月命星=2(二黒)

console.log("\n--- PDF検証例 2: 1924年 (大正13年) ---");
test(1924, 6, 15, 12, 0);
// 期待値: 本命星=4(四緑)

console.log("\n--- 2026年 立春境界テスト (2月4日 04:02) ---");
console.log("04:01 (立春前):");
test(2026, 2, 4, 4, 1); // 前年扱い: 2025年(二黒)
console.log("04:03 (立春後):");
test(2026, 2, 4, 4, 3); // 当年扱い: 2026年(一白)
