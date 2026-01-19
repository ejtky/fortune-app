# 八雲院機能実装計画

このドキュメントでは、yakumoin.info（八雲院）の機能を参考にした実装計画を記載します。

## 📊 参考サイト分析

**サイト**: [九星気学 八雲院](https://yakumoin.info/)

### 主要機能一覧

1. **開運マップ** - 地図連動型方位チェッカー
2. **吉方位サーチ** - 年盤〜時盤から吉方位を検索
3. **グループ占い** - 最大5人の方位盤を同時比較
4. **九星気学カレンダー** - 開運日と吉凶日の表示
5. **会員機能** - お気に入りとメンバー管理

---

## 🗺️ 機能1: 開運マップ

### 概要
地図上で自由に場所を選択し、その方位の吉凶を即座に確認できる機能。

### 主要機能

#### 1.1 地図と方位盤の同時表示
```
┌─────────────────────────────────┐
│  地図エリア      │  方位盤エリア  │
│                 │     北          │
│   [現在地]      │  九│一│八      │
│      ↓         │ 西─五─東      │
│   [目的地]      │  四│三│二      │
│                 │     南          │
└─────────────────────────────────┘
```

**実装内容**:
- Google Maps APIまたはLeaflet.jsを使用
- 中心点（現在地/自宅）を設定
- クリックした地点の方位と距離を自動計算
- 年盤・月盤・日盤・時盤を切り替え表示

#### 1.2 お気に入り地点登録
- 地点名、住所、座標を保存
- カテゴリ分類（職場、実家、旅行先など）
- ワンクリックで再表示

**データベーススキーマ**:
```sql
CREATE TABLE favorite_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.3 メンバー管理機能
- 家族や友人の生年月日を登録
- 複数人の方位盤を素早く切り替え
- グループ占いとの連携

**データベーススキーマ**:
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  relationship TEXT, -- 家族、友人、知人など
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.4 神社仏閣検索（オプション）
八雲院では約14万件の神社仏閣データを持っています。

**実装方針**:
- 初期版: Google Places APIで神社・寺院を検索
- 将来版: 独自の神社仏閣データベースを構築
- 表示情報: 名称、住所、方位、距離、吉凶

---

## 🔍 機能2: 吉方位サーチ

### 概要
指定した日付・期間で吉方位を自動検索する機能。

### 機能詳細

#### 2.1 検索パラメータ
- **日付範囲**: 開始日〜終了日
- **方位盤種類**: 年盤 / 月盤 / 日盤 / 時盤
- **方位**: 8方位または24方位
- **吉凶種類**:
  - 吉方位のみ
  - 凶方位のみ
  - すべて表示

#### 2.2 検索結果表示
```
検索結果: 2025年1月1日〜1月31日の吉方位

┌──────────────────────────────┐
│ 日付      │ 方位  │ 種類  │ 効果     │
├──────────────────────────────┤
│ 1月5日   │ 東    │ 吉    │ 発展運   │
│ 1月12日  │ 南東  │ 大吉  │ 恋愛運   │
│ 1月20日  │ 北    │ 吉    │ 財運     │
└──────────────────────────────┘
```

#### 2.3 距離と期間の関係表示
八雲院の情報によると、方位盤と距離・期間の関係は以下の通り：

| 方位盤 | 影響期間 | 推奨距離 | 用途 |
|--------|----------|----------|------|
| 時盤 | 数時間 | 非常に小 | 補助的使用 |
| 日盤 | 1日〜1週間 | 近距離 | 日帰り旅行 |
| 月盤 | 1ヶ月〜6ヶ月 | 中距離 | 旅行・出張 |
| 年盤 | 1年〜数年 | 長距離 | 引っ越し・移住 |

**実装**:
```typescript
interface DirectionSearchParams {
  startDate: Date;
  endDate: Date;
  boardType: 'year' | 'month' | 'day' | 'hour';
  direction?: DirectionKey; // 特定方位の検索
  filterType: 'auspicious' | 'inauspicious' | 'all';
  honmeiStar: number;
}

interface DirectionSearchResult {
  date: Date;
  direction: DirectionKey;
  type: '大吉' | '吉' | '凶' | '大凶';
  effect: string;
  boardType: string;
}
```

---

## 👨‍👩‍👧‍👦 機能3: グループ占い

### 概要
最大5人の方位盤を同時に比較し、全員に共通する吉方位を見つける機能。

### 機能詳細

#### 3.1 メンバー選択
- 登録済みメンバーから選択
- 最大5人まで
- 一時的な追加も可能

#### 3.2 比較表示
```
グループ方位比較 - 2025年1月15日

        │ 東  │ 南東 │ 南  │ 南西 │ 西  │ 北西 │ 北  │ 北東 │
────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
太郎    │ ○  │ ◎  │ ×  │ ○  │ ×  │ ○  │ △  │ ×  │
花子    │ ×  │ ○  │ ○  │ ×  │ ○  │ ×  │ ○  │ △  │
次郎    │ △  │ ◎  │ ×  │ ○  │ ×  │ △  │ ×  │ ○  │
────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
共通吉  │    │ ◎  │    │ ○  │    │    │    │    │

凡例: ◎=大吉  ○=吉  △=小吉  ×=凶
```

#### 3.3 おすすめ提案
- **全員吉方位**: 南東（大吉）、南西（吉）
- **最適な日程**: 1月20日〜1月25日
- **推奨場所**: 南東方面（箱根、伊豆方面）

**実装**:
```typescript
interface GroupMember {
  id: string;
  name: string;
  birthDate: Date;
  honmeiStar: number;
}

interface GroupDirectionAnalysis {
  members: GroupMember[];
  date: Date;
  directions: {
    [key in DirectionKey]: {
      memberResults: {
        [memberId: string]: 'excellent' | 'good' | 'neutral' | 'bad';
      };
      commonRating: 'excellent' | 'good' | 'neutral' | 'bad' | 'none';
    };
  };
  recommendations: {
    bestDirections: DirectionKey[];
    bestDates: Date[];
    suggestedPlaces: string[];
  };
}
```

---

## 📅 機能4: 九星気学カレンダー

### 概要
月ごとのカレンダーに吉凶日と開運日を表示する機能。

### 機能詳細

#### 4.1 月間カレンダー表示
```
2025年1月                 本命星: 五黄土星

日   月   火   水   木   金   土
                 1◎  2○  3×  4△
 5○  6×  7○  8△  9×  10◎ 11○
12×  13○ 14△ 15○ 16×  17○ 18◎
19×  20○ 21△ 22×  23○ 24○ 25△
26×  27○ 28△ 29○ 30×  31○

凡例:
◎ = 大吉日（最良の日）
○ = 吉日（良い日）
△ = 平日（普通の日）
× = 凶日（避けるべき日）
```

#### 4.2 日付詳細
クリックで詳細表示：
```
┌─────────────────────────┐
│ 2025年1月10日（金）     │
├─────────────────────────┤
│ 九星: 一白水星          │
│ 吉凶: ◎ 大吉日         │
│                        │
│ 吉方位:                │
│  東: 発展運・成長      │
│  南東: 恋愛運・人間関係│
│                        │
│ 凶方位:                │
│  南西: 五黄殺          │
│  北東: 暗剣殺          │
│                        │
│ 開運行動:              │
│  • 新しいことを始める  │
│  • 人と会う            │
│  • 東方面へ外出        │
└─────────────────────────┘
```

#### 4.3 イベント登録（オプション）
- ユーザーが予定を登録
- 吉方位の提案
- リマインダー機能

---

## ⏰ 機能5: 時盤（2時間単位）

### 概要
日盤をさらに細かく、2時間単位で区切った方位盤。

### 時盤の配当
中国の十二支時刻制に基づく：

| 時刻 | 十二支 | 時盤の星 |
|------|--------|---------|
| 23-01 | 子 | 一白水星 |
| 01-03 | 丑 | 八白土星 |
| 03-05 | 寅 | 三碧木星 |
| 05-07 | 卯 | 四緑木星 |
| 07-09 | 辰 | 五黄土星 |
| 09-11 | 巳 | 九紫火星 |
| 11-13 | 午 | 二黒土星 |
| 13-15 | 未 | 七赤金星 |
| 15-17 | 申 | 六白金星 |
| 17-19 | 酉 | 一白水星 |
| 19-21 | 戌 | 八白土星 |
| 21-23 | 亥 | 三碧木星 |

### 実装
```typescript
interface HourBoardCalculator {
  calculateHourBoard(date: Date, hour: number): LoshuLayout;
}

// 時盤は日盤の補助として使用
// 影響力は小さいため、日盤と併用推奨
```

---

## 🛠️ 技術スタック

### フロントエンド
- **地図**: Leaflet.js または Google Maps API
- **UI**: React + Tailwind CSS
- **状態管理**: Zustand
- **日付処理**: Day.js

### バックエンド
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage（画像など）

### API
- **地図**: Google Maps API / Leaflet
- **神社仏閣**: Google Places API（初期版）

---

## 📦 データベース設計

### 追加テーブル

```sql
-- お気に入り地点
CREATE TABLE favorite_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- メンバー管理
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  relationship TEXT,
  honmei_star INTEGER,
  month_star INTEGER,
  day_star INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- カレンダーイベント（オプション）
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  direction TEXT,
  place_id UUID REFERENCES favorite_places(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検索履歴
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_type TEXT, -- 'direction' | 'group' | 'calendar'
  search_params JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 UI/UXデザイン方針

### 八雲院から学ぶポイント

1. **シンプルで直感的**
   - 複雑な機能でも、ステップバイステップで案内
   - アイコンと色分けで視覚的にわかりやすく

2. **一画面完結**
   - 地図と方位盤を同時表示
   - スクロール不要で全情報確認

3. **レスポンシブ対応**
   - スマホでも快適に操作
   - タブレットでは2カラムレイアウト

4. **色の使い分け**
   ```
   大吉: 赤/ゴールド
   吉:   オレンジ/黄色
   凶:   青/グレー
   大凶: 黒/ダークグレー
   ```

---

## 📋 実装フェーズ

### Phase 1: 基本機能（優先度：高）
- [x] 既存の方位学機能の改善
- [ ] 開運マップの基本実装
- [ ] 地図連動機能
- [ ] お気に入り地点登録

### Phase 2: 検索機能（優先度：高）
- [ ] 吉方位サーチ
- [ ] 日付範囲検索
- [ ] 検索結果の表示

### Phase 3: グループ機能（優先度：中）
- [ ] メンバー管理
- [ ] グループ占い
- [ ] 比較表示

### Phase 4: カレンダー機能（優先度：中）
- [ ] 月間カレンダー表示
- [ ] 吉凶日の表示
- [ ] イベント登録（オプション）

### Phase 5: 時盤対応（優先度：低）
- [ ] 時盤計算ロジック
- [ ] 時盤表示
- [ ] 日盤との併用表示

### Phase 6: 神社仏閣（オプション）
- [ ] Google Places API連携
- [ ] 神社仏閣検索
- [ ] 独自データベース構築（将来）

---

## 🔗 参考リンク

### 八雲院の機能ページ
- [開運マップ](https://yakumoin.info/search/map)
- [開運マップの使い方](https://yakumoin.info/support/how_to_use_map)
- [開運マップの活用方法](https://yakumoin.info/support/best_use_of_map)
- [吉方位サーチ](https://yakumoin.info/search/direction)
- [グループ占い](https://yakumoin.info/search/group_input)
- [今日の吉方位](https://yakumoin.info/daily/direction)
- [方位盤について](https://yakumoin.info/about/houiban)
- [吉凶方位の種類](https://yakumoin.info/about/direction)
- [吉凶の距離と期間](https://yakumoin.info/about/distance_and_span)

---

## 📝 まとめ

八雲院の機能は非常に充実しており、ユーザーにとって実用的です。

**特に優れている点**:
1. 地図と方位盤の連動 - 直感的でわかりやすい
2. グループ占い - 家族旅行などに便利
3. お気に入り機能 - リピート使用を促進
4. 5種類の方位盤 - 用途に応じて使い分け

これらの機能を段階的に実装することで、本格的な九星気学アプリが完成します！
