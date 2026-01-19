import * as cheerio from 'cheerio';

/**
 * 暦計算サイト (keisan.site) 連携クライアント
 */

export interface KeisanParams {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
}

export interface KeisanResult {
  title: string;
  data: any[][];
}

const KEISAN_BASE_URL = 'https://keisan.site/exec/system';

export const KEISAN_URLS = {
  KYUSEI_BOARD: `${KEISAN_BASE_URL}/1207304031`, // 九星盤計算
  ROKUYO: `${KEISAN_BASE_URL}/1186108192`,       // 六曜計算
  ETO: `${KEISAN_BASE_URL}/1161228718`,          // 干支計算
  NINE_STAR_CALENDAR: `${KEISAN_BASE_URL}/1189947646`, // 九星カレンダー
  TIME_KYUSEI: `${KEISAN_BASE_URL}/1298015429`,  // 時の九星
  REKICHU: `${KEISAN_BASE_URL}/1189929076`,      // 暦注計算
} as const;

export class KeisanClient {
  /**
   * 外部計算サイトからデータを取得する
   */
  async calculate(urlKey: keyof typeof KEISAN_URLS, params: KeisanParams): Promise<KeisanResult> {
    const url = KEISAN_URLS[urlKey];
    
    // パラメータ名の調整 (ページによって大文字小文字が異なる場合があるため)
    const query = new URLSearchParams();
    if (urlKey === 'ROKUYO') {
        if (params.year) query.append('var_Y', params.year.toString());
        if (params.month) query.append('var_M', params.month.toString());
        if (params.day) query.append('var_D', params.day.toString());
    } else {
        if (params.year) query.append('var_year', params.year.toString());
        if (params.month) query.append('var_month', params.month.toString());
        if (params.day) query.append('var_day', params.day.toString());
    }
    
    if (params.hour !== undefined) query.append('var_hour', params.hour.toString());
    if (params.minute !== undefined) query.append('var_minute', params.minute.toString());

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: query.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const html = await response.text();
      return this.parseHtml(html);
    } catch (error) {
      console.error('KeisanClient Error:', error);
      throw error;
    }
  }

  private parseHtml(html: string): KeisanResult {
    const $ = cheerio.load(html);
    const title = $('title').text().replace(' - 高精度計算サイト', '').trim() || '計算結果';

    // 1. JS 変数からの抽出 (九星盤等)
    const scriptContent = $('script').map((_, s) => $(s).html()).get().join('\n');
    // 配列の抽出をより柔軟に (1次元・2次元、変数名バリエーションに対応)
    const arrayMatch = scriptContent.match(/(?:exedata\d*|execdata|exeData\w*|exe_data)\s*=\s*(\[.*?\]);/s);

    if (arrayMatch) {
      try {
        let rawData = arrayMatch[1].trim();
        
        // 末尾のカンマを除去
        rawData = rawData.replace(/,\s*\]/g, ']').replace(/,\s*\}/g, '}');

        // JSリテラルをJSONに変換するための簡易的な正規表現処理
        // すでにダブルクォートで囲まれている場合はそのまま、シングルクォートの場合は変換
        // ただし、完全に正確なJSパーサーではないため、失敗した場合はフォールバック
        let jsonStr = rawData;
        if (jsonStr.includes("'")) {
            // 文字列中の一重引用符を保護しつつ、デリミタとしての一重引用符を二重引用符に置換するのは困難なため、
            // 非常に単純な置換を試みる (HTMLタグ内の属性としての一重引用符は壊れる可能性があるが、JSON.parseが通ることを優先)
            // 理想的には vm.runInNewContext(rawData) を使うべきだが、環境依存を避ける
            try {
                // 文字列が " で囲まれている場合はそのまま通る可能性が高いので、まずはそのまま試行
                const data = JSON.parse(jsonStr);
                return this.formatData(title, data);
            } catch (_e) {
                // 失敗した場合は、デリミタと思われる ' を " に置換
                // 文字列開始・終了、カンマ前後、ブラケット前後の ' を置換
                jsonStr = jsonStr
                    .replace(/(^|[,\[])\s*'/g, '$1 "')
                    .replace(/'\s*([,\]]|$)/g, '" $1');
            }
        }

        const data = JSON.parse(jsonStr);
        return this.formatData(title, data);
      } catch (e) {
        console.warn('JS Array Parse Error:', e, arrayMatch[1].substring(0, 100));
      }
    }


    // 2. 個別ページの特定構造 (六曜、暦注等)
    const specialData: any[][] = [];
    
    // answaku / ansnowaku クラスの抽出
    $('.answaku, .ansnowaku').each((_, el) => {
        const text = $(el).text().trim();
        if (text) specialData.push([text]);
    });

    // 画像 (六曜画像等) の抽出
    $('img.ansimg, #answer img, .ans img').each((_, img) => {
        const src = $(img).attr('src');
        if (src) specialData.push([this.completeUrl(src)]);
    });

    if (specialData.length > 0) return { title, data: specialData };

    // 3. 一般的なテーブルフォールバック
    const tableData: any[][] = [];
    $('.result_table tr, #result table tr, table.htCore tr').each((_, tr) => {
        const row: any[] = [];
        $(tr).find('td, th').each((_, td) => {
            const $td = $(td);
            const img = $td.find('img');
            if (img.length > 0) {
                row.push(this.completeUrl(img.attr('src') || ''));
            } else {
                row.push($td.text().trim());
            }
        });
        if (row.length > 0) tableData.push(row);
    });

    return { title, data: tableData };
  }

  private formatData(title: string, data: any): KeisanResult {
    if (!Array.isArray(data) || data.length === 0) {
        return { title, data: [] };
    }
    
    return { 
        title, 
        data: data.map(row => {
          const items = Array.isArray(row) ? row : [row];
          return items.map(item => this.completeUrl(item)).filter(i => i !== null && i !== '');
        }).filter(row => row.length > 0)
    };
  }

  private completeUrl(url: any): any {
    if (typeof url !== 'string') return url;
    if (url.startsWith('/')) return `https://keisan.site${url}`;
    if (url.includes('src=/')) return url.replace('src=/', 'src=https://keisan.site/');
    return url;
  }
}

export const keisanClient = new KeisanClient();
