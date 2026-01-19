/**
 * knowledge-base.tsのデータをSQL INSERT文に変換するスクリプト
 *
 * 使用方法:
 * npx tsx scripts/generate_seed_sql.ts > supabase/migrations/20260103000001_full_seed_data.sql
 */

import { TRADITIONAL_KNOWLEDGE } from '../lib/fortune/nine-star-ki/knowledge-base';

// SQLエスケープ関数
function escapeSql(value: string | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }
  return value.replace(/'/g, "''");
}

// JSONBデータを SQL文字列に変換
function toJsonb(obj: Record<string, unknown>): string {
  return `'${escapeSql(JSON.stringify(obj))}'::jsonb`;
}

// 配列をPostgreSQL配列に変換
function toArray(arr: string[]): string {
  const escaped = arr.map(item => `'${escapeSql(item)}'`);
  return `ARRAY[${escaped.join(', ')}]`;
}

console.log('-- 九星気学の完全なデータシード');
console.log('-- このファイルは自動生成されました');
console.log('-- 生成日時:', new Date().toISOString());
console.log('');
console.log('-- 既存データを削除（再実行時のため）');
console.log('TRUNCATE TABLE personality_traits CASCADE;');
console.log('');

// 各九星のデータを変換
for (const [starId, knowledge] of Object.entries(TRADITIONAL_KNOWLEDGE)) {
  const id = Number(starId);

  console.log(`-- ${knowledge.name}のデータ`);
  console.log(`INSERT INTO personality_traits (`);
  console.log(`  star_number,`);
  console.log(`  star_name,`);
  console.log(`  element,`);
  console.log(`  core_essence,`);
  console.log(`  cosmic_principle,`);
  console.log(`  elemental_reason,`);
  console.log(`  life_direction,`);
  console.log(`  inner_nature,`);
  console.log(`  spiritual_path,`);
  console.log(`  strengths,`);
  console.log(`  weaknesses,`);
  console.log(`  hidden_talents,`);
  console.log(`  life_theme,`);
  console.log(`  suitable_jobs,`);
  console.log(`  work_style,`);
  console.log(`  career_success,`);
  console.log(`  love_style,`);
  console.log(`  compatibility,`);
  console.log(`  family_life,`);
  console.log(`  health_vulnerabilities,`);
  console.log(`  health_recommendations,`);
  console.log(`  money_attitude,`);
  console.log(`  wealth_building,`);
  console.log(`  health_advice,`);
  console.log(`  wealth_advice,`);
  console.log(`  life_cycles,`);
  console.log(`  remedies,`);
  console.log(`  traditional_wisdom`);
  console.log(`) VALUES (`);
  console.log(`  ${id},`);
  console.log(`  '${escapeSql(knowledge.name)}',`);
  console.log(`  '${escapeSql(knowledge.element)}',`);
  console.log(`  '${escapeSql(knowledge.essence.core)}',`);
  console.log(`  '${escapeSql(knowledge.essence.cosmicPrinciple)}',`);
  console.log(`  '${escapeSql(knowledge.essence.elementalReason)}',`);
  console.log(`  '${escapeSql(knowledge.essence.lifeDirection)}',`);
  console.log(`  '${escapeSql(knowledge.essence.innerNature)}',`);
  console.log(`  '${escapeSql(knowledge.essence.spiritualPath)}',`);
  console.log(`  ${toArray(knowledge.personality.strengths)},`);
  console.log(`  ${toArray(knowledge.personality.weaknesses)},`);
  console.log(`  ${toArray(knowledge.personality.hiddenTalents)},`);
  console.log(`  '${escapeSql(knowledge.personality.lifeTheme)}',`);
  console.log(`  ${toArray(knowledge.lifeAspects.career.suitableJobs)},`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.career.workStyle)}',`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.career.success)}',`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.relationships.loveStyle)}',`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.relationships.compatibility)}',`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.relationships.family)}',`);
  console.log(`  ${toArray(knowledge.lifeAspects.health.vulnerabilities)},`);
  console.log(`  ${toArray(knowledge.lifeAspects.health.recommendations)},`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.wealth.moneyAttitude)}',`);
  console.log(`  '${escapeSql(knowledge.lifeAspects.wealth.wealthBuilding)}',`);

  // 新しいフィールド
  const healthAdvice = knowledge.lifeAspects.health.recommendations.join('\\n');
  const wealthAdvice = `${knowledge.lifeAspects.wealth.moneyAttitude}\\n${knowledge.lifeAspects.wealth.wealthBuilding}`;

  console.log(`  '${escapeSql(healthAdvice)}',`);
  console.log(`  '${escapeSql(wealthAdvice)}',`);
  console.log(`  ${toJsonb(knowledge.lifeCycles)},`);
  console.log(`  ${toJsonb(knowledge.remedies)},`);
  console.log(`  ${toArray(knowledge.traditionalWisdom)}`);
  console.log(`);`);
  console.log('');
}

console.log('-- データシード完了');
console.log('-- 検証用クエリ:');
console.log('-- SELECT star_number, star_name, element FROM personality_traits ORDER BY star_number;');
