import { keisanClient } from '../lib/external/keisan-client';

async function testSingle(type: keyof typeof import('../lib/external/keisan-client').KEISAN_URLS) {
  console.log(`\n--- ${type} RAW HTML TEST ---`);
  try {
    const url = (await import('../lib/external/keisan-client')).KEISAN_URLS[type];
    const params = new URLSearchParams({ var_year: '2026', var_month: '1', var_day: '8' });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: params.toString()
    });

    const html = await response.text();
    console.log('HTML Length:', html.length);
    
    // JS変数を探す
    const matches = html.match(/(?:exedata\d*|execdata|exeData\w*)\s*=\s*(\[\[.*?\]\]);/gs);
    if (matches) {
        console.log('Matches found:', matches.length);
        matches.forEach((m, i) => console.log(`Match ${i}:`, m.substring(0, 100)));
    } else {
        console.log('No JS array variables found.');
        // テーブルを探す
        console.log('Has result_table:', html.includes('result_table'));
        console.log('Has table:', html.includes('<table'));
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

async function run() {
    await testSingle('ROKUYO');
    await testSingle('REKICHU');
}

run();
