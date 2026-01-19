import { keisanClient } from '../lib/external/keisan-client';

async function test() {
  console.log('--- 暦計算 連携テスト ---');
  
  const testCases: (keyof typeof import('../lib/external/keisan-client').KEISAN_URLS)[] = [
    'KYUSEI_BOARD',
    'ROKUYO',
    'REKICHU'
  ];

  for (const type of testCases) {
    console.log(`\nTesting: ${type}...`);
    try {
      const result = await keisanClient.calculate(type, {
        year: 2026,
        month: 1,
        day: 8
      });
      console.log('Title:', result.title);
      console.log('Data:', JSON.stringify(result.data, null, 2));
    } catch (err) {
      console.error(`${type} failed:`, err);
    }
  }
}

test();
