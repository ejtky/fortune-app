import { calculateHonmeiStar, calculateMonthStar } from '../lib/fortune/nine-star-ki/calculator';
import { STAR_NAMES } from '../lib/fortune/nine-star-ki/constants';
import { calculateMainStar, calculateMonthlyStar, NINE_STARS } from '../lib/fortune/nine-star-calculator';

const dates = ['1977-11-22', '1977-12-06', '1977-11-15'];
const expected = '二黒土星';

console.log('=== TOPページ: nine-star-ki/calculator.ts ===');
for (const ds of dates) {
  const d = new Date(ds);
  const h = calculateHonmeiStar(d);
  const m = calculateMonthStar(d, h);
  const ok = STAR_NAMES[m] === expected ? '✓' : '❌';
  console.log(`${ds}: 本命星=${STAR_NAMES[h]}, 月命星=${STAR_NAMES[m]} ${ok}`);
}

console.log('\n=== diagnosisページ: nine-star-calculator.ts ===');
for (const ds of dates) {
  const d = new Date(ds);
  const h = calculateMainStar(d);
  const m = calculateMonthlyStar(d, h);
  const ok = NINE_STARS[m] === expected ? '✓' : '❌';
  console.log(`${ds}: 本命星=${NINE_STARS[h]}, 月命星=${NINE_STARS[m]} ${ok}`);
}
