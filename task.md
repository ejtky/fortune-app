# fortune-app 進捗・タスク管理

> ここが唯一の進捗管理ファイル。新しいタスク・バグ・学習済みルールはすべてここに追記する。
> 旧ファイル: `YAKUMOIN_IMPLEMENTATION_PLAN.md`（完了・参照用）、`WORK_LOG.md`（空につき廃止）、`implementation_plan.md`（月命星バグ計画、下記に統合）

---

## 現在の状態（2026-04-15）

**本番URL**: https://fortune-app-eta-sable.vercel.app

---

## 実装済みページ

| ページ | URL | 状態 |
|-------|-----|------|
| トップ | `/` | ✅ |
| 九星診断 | `/diagnosis` | ✅ |
| 九星詳細 | `/check/ninestar/day/[date]` | ✅ |
| 運勢予測 | `/fortune` | ✅ |
| 九星カレンダー | `/calendar` | ✅ |
| 今日の吉方位 | `/daily/direction` | ✅ |
| 今月の吉方位 | `/monthly/direction` | ✅ |
| 今年の吉方位 | `/yearly/direction` | ✅ |
| 吉方位サーチ | `/search/direction` | ✅ |
| 有名人検索 | `/search/famouse` | ✅ |
| 開運マップ | `/search/map` | ✅ |
| **吉方位マップ** | `/direction-map` | ✅ スマホ対応済み（2026-04-15） |
| 九星気学カレンダー | `/about/kyusei_calendar` | ✅ |
| 知識ベース | `/knowledge` | ✅ |
| 旅行日程最適化 | `/travel-optimizer` | ✅ |
| キャラクター詳細 | `/kyusei/character/[id]` | ✅ |
| 相性診断 | `/kyusei/compatibility` | ✅ |
| 年運 | `/kyusei/year-fortune` | ✅ |

---

## 積み残しタスク

### 🔴 優先度高

#### [x] 月命星テーブルのバグ修正（✅ 2026-06-06 完了確認）
- **現象**: 1977/12/6 と 1977/11/22 が異なる月命星を返す（正解は両方「二黒土星」）
- **原因**: `lib/fortune/nine-star-ki/constants.ts` の `MONTH_STAR_TABLES` が誤り
- **修正内容**（constants.ts に反映済み・commit 299ebf6）:
  - 一・四・七グループ: `[6, 8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7]`
  - 二・五・八グループ: `[9, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1]`
  - 三・六・九グループ: `[3, 5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4]`
- **検証ケース**: 1977/12/6(五黄) → adjustedMonth=11 → index10 → 2(二黒) ✓

### 🟡 優先度中

#### [x] 有名人データ（✅ 2026-06-06 完了）
- **実態**: データは Supabase ではなく静的配列 `lib/data/famous-people.ts` で管理。`/search/famouse` はこの配列を参照（旧記述「Supabase famous_people テーブル」は誤り）
- **品質堅牢化**: `honmei`（本命星）の手打ちを廃止し `birthDate` から自動計算する方式に変更。手打ちミス（木村拓哉が二黒→正しくは一白）も是正。新規追加は `{ id, name, birthDate, tags }` を足すだけでよい
- **人選拡充は完了扱い**（必要になったら ejtky が `FAMOUS_PEOPLE_INPUT` に追記すれば本命星は自動付与される）

---

## 学習済みルール（ミスから追加）

- **月命星計算**: 節入り日で月を区切る。大雪(12/7頃)前なら前月扱い。インデックスは `adjustedMonth - 1`
- **`npm` を使う**: このプロジェクトは pnpm/bun 不可、`npm` 固定
- **デプロイ**: `npx vercel --prod` で本番反映

---

## 直近の作業ログ

### 2026-04-15: 吉方位マップ スマホ完全対応
- `LeftSidebar`/`RightSidebar` の `w-52`/`w-56` → `w-full` に修正（幅競合バグ）
- ドロワー幅 `w-64` → `w-[85vw] sm:w-72`、閉じるボタン追加
- ボトムナビバー（🎯現在地 / 🔍場所 / ⚙️設定 / 🏠起点へ）追加
- グローバルヘッダー(h-14)によるボトムナビ画面外バグを `fixed bottom-0 z-[800]` で解決
- `viewport-fit: 'cover'` 追加（iOS Safe Area 対応）
- Leafletコントロールをナビ上に退避: `globals.css` に `@media(max-width:1023px){ .leaflet-bottom { bottom:68px } }`
- 色パネル: `bottom-4` → `bottom-20 lg:bottom-4`
- `attributionControl: false` で "Leaflet | © OpenStreetMap" 削除
- 起点・目的地両方設定済み時は地図タップで地点設定ポップアップを出さない（`destinationRef`）
