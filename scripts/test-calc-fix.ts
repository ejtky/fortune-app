import { calculateHonmeiStar, calculateMonthStar } from '../lib/fortune/nine-star-ki/calculator';
import { STAR_NAMES } from '../lib/fortune/nine-star-ki/constants';

function test(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const honmei = calculateHonmeiStar(date);
  const getsumei = calculateMonthStar(date, honmei);
  console.log(`${year}年${month}月${day}日:`);
  console.log(`  本命星: ${honmei} (${STAR_NAMES[honmei]})`);
  console.log(`  月命星: ${getsumei} (${STAR_NAMES[getsumei]})`);
}

console.log("--- ユーザー指摘ケース ---");
test(1977, 12, 6);
test(1977, 11, 22);

console.log("\n--- 他のケース (1977年2月 節入り付近) ---");
test(1977, 2, 3); // 前年扱い: 1976年(六白)
test(1977, 2, 4); // 当年扱い: 1977年(五黄)
