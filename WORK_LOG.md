# 作業ログ

## プロジェクト構造

このリポジトリ（`Antigravity/fortune-app`）が**本番プロジェクト**です。
Vercel にデプロイ済み: https://fortune-app-eta-sable.vercel.app

```
fortune-app/
├── app/                        本番ページ（Next.js App Router）
│   ├── page.tsx                    TOPページ
│   ├── fortune/                    運勢鑑定
│   ├── diagnosis/                  診断
│   ├── direction-map/              方位図
│   ├── calendar/                   カレンダー
│   ├── kyusei/                     九星関連
│   │   ├── character/[id]/             キャラクター図鑑
│   │   ├── compatibility/              相性
│   │   └── year-fortune/              年運
│   ├── check/ninestar/day/[date]/  日別九星チェック
│   ├── test/calculation/           計算テスト
│   ├── search/                     検索
│   ├── map/                        地図
│   ├── travel-optimizer/           旅行最適化
│   ├── knowledge/                  ナレッジベース
│   ├── admin/                      管理画面
│   ├── api/                        APIエンドポイント
│   │   ├── fortune/calculate/          運勢計算API
│   │   └── chat/                       チャットAPI
│   └── about/                      説明ページ
│
├── lib/                        計算・データロジック
│   ├── fortune/
│   │   ├── nine-star-ki/           九星気学（★メイン計算）
│   │   │   ├── calculator.ts           本命星・月命星計算
│   │   │   ├── constants.ts            定数（MONTH_STAR_TABLES等）
│   │   │   ├── compatibility.ts        相性計算
│   │   │   ├── year-month-fortune.ts   年・月運
│   │   │   └── ...
│   │   ├── directional/            方位計算
│   │   │   ├── calculator.ts
│   │   │   ├── flying-star-calculator.ts
│   │   │   └── ...
│   │   ├── fortune-prediction.ts   運勢予測
│   │   └── ...
│   ├── db/supabase.ts             Supabase接続
│   └── services/                  外部サービス
│
├── supabase/migrations/        DBスキーマ
├── scripts/                    データ投入スクリプト
├── docs/reference/             参考資料
├── kyusei_kigaku_taisho13_3.pdf  大正13年説PDF資料
└── types/fortune.ts            型定義
```

---

## 既知のバグ・課題

### 月命星の計算精度
- **現状**: `constants.ts` の `SETSUIRI_DATES` は年別の時刻を考慮しない固定日付
- **影響**: 節入り当日の時刻によっては月命星が1つずれる可能性がある
- **参考**: `Obsidian/app/lib/utils/kyusei-data.ts` に 2020-2027年の精密な節入り時刻データあり
- **確認済み正解例**:
  - 1977/11/22 → 本命星: 五黄土星(5), 月命星: 二黒土星(2)
  - 1977/12/06 → 本命星: 五黄土星(5), 月命星: 二黒土星(2)

### 年命星の立春判定
- **現状**: `calculator.ts` の `adjustYearForRisshun` は 2/4 固定で判定（時刻未考慮）
- **影響**: 2/4 の場合、立春前か後かで本命星が変わる可能性がある

---

## 統合予定: Obsidian/app → Antigravity/fortune-app

### 移行対象ファイル
| Obsidian/app | 移行先 | 内容 |
|---|---|---|
| `lib/utils/kyusei-calc.ts` | `lib/fortune/nine-star-ki/` | 大正13年説の精密計算ロジック |
| `lib/utils/kyusei-data.ts` | `lib/fortune/nine-star-ki/` | 年別精密節入りデータ(2020-2027) |
| `lib/utils/kyusei-test.ts` | `scripts/` または `lib/fortune/nine-star-ki/` | テストケース |
| `kyusei/check/page.tsx` | `app/test/calculation/` と統合 | デモUI |
| CLAUDE.md 群 | `docs/` | 設計ドキュメント |

---

## 作業履歴

### 2026-04-09
- `Obsidian/Antigravity/fortune-app` が本番プロジェクトと判明
- `Obsidian/app` は設計書 + 試作計算ロジックのみ
- 月命星バグを調査: `Antigravity` の `MONTH_STAR_TABLES` は正しい値を持つ
- Vercel デプロイ済みサイトで月命星のバグを確認中

