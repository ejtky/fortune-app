# yakumoin.info 全URLリスト（3階層まで）

## 1階層目（トップレベル）

### トップページ
- `https://yakumoin.info/`

## 2階層目（メインカテゴリ）

### アカウント関連
- `/account/regist_input` - 新規会員登録
- `/account/login` - ログイン

### 九星詳細（日盤）
- `/kyusei/direction_day/id/1` - 一白水星
- `/kyusei/direction_day/id/2` - 二黒土星
- `/kyusei/direction_day/id/3` - 三碧木星
- `/kyusei/direction_day/id/4` - 四緑木星
- `/kyusei/direction_day/id/5` - 五黄土星
- `/kyusei/direction_day/id/6` - 六白金星
- `/kyusei/direction_day/id/7` - 七赤金星
- `/kyusei/direction_day/id/8` - 八白土星
- `/kyusei/direction_day/id/9` - 九紫火星

### 検索・ツール機能
- `/search/map` - 開運マップ
- `/search/direction` - 吉方位サーチ
- `/search/famouse` - 有名人占い
- `/search/group_input` - グループ占い
- `/search/famouse_calendar` - 誕生日カレンダー
- `/search/angle_and_distance` - 地点間の距離と方位
- `/search/doyou` - 土用と間日

### 情報・解説ページ
- `/about/kyusei_kigaku` - 九星気学について
- `/about/houiban` - 方位盤について
- `/about/direction` - 吉凶方位の種類
- `/about/distance_and_span` - 吉凶の距離と期間
- `/about/direction_effect` - 方位取りの効果
- `/about/direction_effect#effect_list` - 方位取りの効果リスト（アンカー）
- `/about/gogyou_and_kyusei` - 五行と九星
- `/about/unsei` - 運勢について
- `/about/keisha` - 傾斜について
- `/about/kyusei_calendar` - 九星気学カレンダー

### 吉方位情報
- `/daily/direction` - 今日の吉方位
- `/daily/direction/date/{YYYYMMDD}` - 特定日の吉方位（パターン）
- `/monthly/direction` - 今月の吉方位
- `/yearly/direction` - 今年の吉方位

### サポート・ヘルプ
- `/support/beginner` - 初めての方へ
- `/support/site` - 八雲院について
- `/support/how_to_use` - 八雲院の使い方
- `/support/member_feature` - 会員機能について
- `/support/how_to_use_map` - 開運マップの使い方
- `/support/best_use_of_map` - 開運マップの活用方法
- `/support/add_to_home_screen` - ホーム画面に登録する
- `/support/system_requirements` - 推奨環境
- `/support/terms` - 利用規約
- `/support/personal` - 個人情報の取扱い
- `/support/inquiry_input` - お問い合わせ
- `/support/inquiry_input/famouse/` - 有名人向けお問い合わせ

### ニュース
- `/news/news_list` - ニュース一覧
- `/news/detail/page/{id}/{YYYYMMDD}` - ニュース詳細（パターン）

### その他
- `/service-worker.js` - Service Worker

## 3階層目（詳細ページ）

### 九星の性格・特徴
- `/kyusei/character/id/1` から `/id/9` - 各九星の性格
- `/kyusei/detail/id/1` から `/id/9` - 各九星の特徴

### 日盤（本命星 × 月命星 × 日付）
- `/kyusei/direction_day/id/{star_id}/{month_star_id}/{YYYYMMDD}`
  - `star_id`: 1-9（本命星）
  - `month_star_id`: 1-9（月命星）
  - `YYYYMMDD`: 日付

例:
- `/kyusei/direction_day/id/1/1/20260104` - 一白水星（本命）× 一白水星（月命）× 2026年1月4日
- `/kyusei/direction_day/id/1/2/20260104` - 一白水星（本命）× 二黒土星（月命）× 2026年1月4日

### 月盤（本命星 × 月命星 × 年月）
- `/kyusei/direction_month/id/{star_id}/{month_star_id}/{YYYYMM}`
  - `star_id`: 1-9（本命星）
  - `month_star_id`: 1-9（月命星）
  - `YYYYMM`: 年月

例:
- `/kyusei/direction_month/id/1/1/202512` - 一白水星 × 一白水星 × 2025年12月
- `/kyusei/direction_month/id/1/2/202512` - 一白水星 × 二黒土星 × 2025年12月

### 年盤（本命星 × 月命星 × 年）
- `/kyusei/direction_year/id/{star_id}/{month_star_id}/{YYYY}`
  - `star_id`: 1-9（本命星）
  - `month_star_id`: 1-9（月命星）
  - `YYYY`: 年

例:
- `/kyusei/direction_year/id/1/1/2025` - 一白水星 × 一白水星 × 2025年
- `/kyusei/direction_year/id/1/2/2025` - 一白水星 × 二黒土星 × 2025年

## 外部リンク

- `https://ameblo.jp/uranai-yakumoin` - 八雲院の開運ブログ
- `https://twitter.com/yakumoin` - 八雲院のX（旧Twitter）
- `https://omairi-navi.com/` - 開運おまいりナビ（姉妹サイト）
- `https://yakumoin.net` - 宿曜占星術八雲院（姉妹サイト）

## URLパターンのまとめ

### 動的URLのパターン

1. **日盤（81パターン × 日付数）**
   - `/kyusei/direction_day/id/{1-9}/{1-9}/{YYYYMMDD}`

2. **月盤（81パターン × 月数）**
   - `/kyusei/direction_month/id/{1-9}/{1-9}/{YYYYMM}`

3. **年盤（81パターン × 年数）**
   - `/kyusei/direction_year/id/{1-9}/{1-9}/{YYYY}`

4. **日付別吉方位**
   - `/daily/direction/date/{YYYYMMDD}`

5. **ニュース記事**
   - `/news/detail/page/{id}/{YYYYMMDD}`

### 静的URL数

合計: 約50ページ

### 総URL数（概算）

- 静的ページ: 50
- 九星性格・特徴: 18（9星 × 2）
- 日盤（1年分・81組み合わせ）: 約29,565
- 月盤（1年分・81組み合わせ）: 972
- 年盤（81組み合わせ）: 81
- カレンダー日付（1年分）: 365
- ニュース記事: 変動

**総計: 約31,000以上のURL**（動的ページを含む）
