import { keisanClient } from '../lib/external/keisan-client';

async function test() {
  console.log('--- RAW RESP TEST ---');
  try {
    const url = 'https://keisan.site/exec/system/1207304031';
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
    console.log('Includes exedata:', html.includes('exedata'));
    console.log('Includes 2026:', html.includes('2026'));
    
    if (html.length < 5000) {
        console.log('Full content:', html);
    } else {
        console.log('Snippet:', html.substring(0, 500));
        // JS変数のあたりを探す
        const idx = html.indexOf('exedata');
        if (idx !== -1) {
            console.log('Exedata section:', html.substring(idx, idx + 200));
        }
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
