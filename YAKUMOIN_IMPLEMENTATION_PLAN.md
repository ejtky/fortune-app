# 八雲院完全実装プラン

このドキュメントでは、yakumoin.infoの全ページを完全に再現するための実装計画を記載します。

## 🎯 実装対象ページ一覧

### 1. 九星詳細ページ
**URL例**: `/check/ninestar/day/19771206`

**内容**:
- 詳細な九星の説明
- 方位学の図（年盤・月盤・日盤）
- 本命星一覧の目次リンク
- 九星気学についての雑学コラム

### 2. 開運マップ
**URL**: `/search/map`

**内容**:
- 地図と方位盤の連動表示
- お気に入り地点登録
- メンバー管理
- 神社仏閣検索（約14万件）

### 3. 吉方位サーチ
**URL**: `/search/direction`

**内容**:
- 年盤〜日盤から吉方位を検索
- 検索条件：日付範囲、方位、吉凶種別
- 検索結果一覧と詳細ページへのリンク

### 4. 九星気学カレンダー
**URL**: `/about/kyusei_calendar`

**内容**:
- 月間カレンダー表示
- 九星、十干十二支、六曜
- 開運日、方位盤整列日の表示

### 5. 今日の吉方位
**URL**: `/daily/direction`

**内容**:
- 本命星選択（9つの星から選択）
- 月命星ごとのリスト表示
- 詳細ページへのリンク

### 6. 今月の吉方位
**URL**: `/monthly/direction`

**内容**:
- 本命星選択
- 月命星ごとのリスト表示
- 月間の吉方位カレンダー

### 7. 今年の吉方位
**URL**: `/yearly/direction`

**内容**:
- 本命星選択
- 月命星ごとのリスト表示
- 年間の吉方位一覧

### 8. 有名人検索
**URL**: `/search/famouse`

**内容**:
- キーワード検索（名前、グループ名）
- 生年月日検索
- 九星検索
- 検索結果一覧

---

## 🎨 デザインシステム

### カラーパレット

八雲院のデザインを分析した結果：

```css
/* メインカラー */
--primary: #6366F1;        /* インディゴブルー */
--primary-dark: #4F46E5;
--primary-light: #818CF8;

/* 背景 */
--bg-main: #F9FAFB;        /* 薄いグレー */
--bg-card: #FFFFFF;
--bg-accent: #EEF2FF;      /* 薄い青紫 */

/* テキスト */
--text-primary: #1F2937;
--text-secondary: #6B7280;
--text-muted: #9CA3AF;

/* 九星の色 */
--star-1: #3B82F6;  /* 一白水星 - 青 */
--star-2: #000000;  /* 二黒土星 - 黒 */
--star-3: #10B981;  /* 三碧木星 - 緑 */
--star-4: #34D399;  /* 四緑木星 - 緑 */
--star-5: #F59E0B;  /* 五黄土星 - 黄色 */
--star-6: #E5E7EB;  /* 六白金星 - 白/グレー */
--star-7: #EF4444;  /* 七赤金星 - 赤 */
--star-8: #78350F;  /* 八白土星 - 茶色 */
--star-9: #A855F7;  /* 九紫火星 - 紫 */

/* 吉凶の色 */
--fortune-excellent: #DC2626;  /* 大吉 - 赤 */
--fortune-good: #F59E0B;       /* 吉 - オレンジ */
--fortune-neutral: #6B7280;    /* 平 - グレー */
--fortune-bad: #3B82F6;        /* 凶 - 青 */
```

### レイアウトパターン

#### パターンA: 一覧ページ（今日の吉方位など）
```
┌────────────────────────────────────┐
│ ヘッダー                           │
├────────────────────────────────────┤
│ タイトル                           │
│ 説明文                             │
├────────────────────────────────────┤
│ 本命星選択（タブ形式）             │
│ [一白][二黒][三碧]...[九紫]       │
├────────────────────────────────────┤
│ 月命星リスト                       │
│ ┌──────────────────────┐         │
│ │ 一白水星                │         │
│ │ [詳細を見る]           │         │
│ └──────────────────────┘         │
│ ┌──────────────────────┐         │
│ │ 二黒土星                │         │
│ │ [詳細を見る]           │         │
│ └──────────────────────┘         │
└────────────────────────────────────┘
```

#### パターンB: 詳細ページ（九星詳細）
```
┌────────────────────────────────────┐
│ ヘッダー                           │
├────────────────────────────────────┤
│ パンくずリスト                     │
├────────────────────────────────────┤
│ ┌─────┬────────────────┐         │
│ │サイド│ メインコンテンツ  │         │
│ │バー  │                   │         │
│ │      │ 本命星・月命星    │         │
│ │目次  │ 性格の特徴        │         │
│ │      │ 方位盤（3種）     │         │
│ │      │ 吉凶方位一覧      │         │
│ │      │ 雑学コラム        │         │
│ └─────┴────────────────┘         │
└────────────────────────────────────┘
```

#### パターンC: 検索ページ（吉方位サーチ）
```
┌────────────────────────────────────┐
│ ヘッダー                           │
├────────────────────────────────────┤
│ 検索フォーム                       │
│ ┌──────────────────────┐         │
│ │ 開始日：[____]             │         │
│ │ 終了日：[____]             │         │
│ │ 方位：  [全方位 ▼]        │         │
│ │ 種類：  [吉方位のみ ▼]    │         │
│ │ [検索]                      │         │
│ └──────────────────────┘         │
├────────────────────────────────────┤
│ 検索結果                           │
│ ┌──────────────────────┐         │
│ │ 2025/1/5  東  吉  発展運 │         │
│ │ 2025/1/12 南東 大吉 恋愛運│         │
│ └──────────────────────┘         │
└────────────────────────────────────┘
```

---

## 📱 コンポーネント設計

### 共通コンポーネント

#### 1. StarSelector（九星選択）
```tsx
<StarSelector
  selected={1}
  onChange={(star) => setSelected(star)}
  layout="tabs" | "grid" | "dropdown"
/>
```

#### 2. DirectionBoard（方位盤）
```tsx
<DirectionBoard
  type="year" | "month" | "day"
  date={new Date()}
  honmeiStar={5}
  highlightDirection="東"
  showDetails={true}
/>
```

#### 3. DirectionCard（方位カード）
```tsx
<DirectionCard
  direction="東"
  fortune="吉"
  effect="発展運・成長運"
  star="三碧木星"
  color="#10B981"
/>
```

#### 4. MonthStarList（月命星リスト）
```tsx
<MonthStarList
  honmeiStar={5}
  onSelect={(monthStar) => navigate(`/detail/${monthStar}`)}
/>
```

#### 5. CalendarView（カレンダー表示）
```tsx
<CalendarView
  year={2025}
  month={1}
  honmeiStar={5}
  monthStar={1}
  showKyusei={true}
  showRokuyo={true}
/>
```

---

## 🗂️ ページ別実装詳細

### 1. 九星詳細ページ (`/check/ninestar/day/[date]`)

#### URL構造
- `/check/ninestar/day/19771206`
- パラメータ：生年月日（YYYYMMDD形式）

#### ページ構成

##### ヘッダーセクション
```tsx
<div className="header-section">
  <h1>1977年12月6日生まれの九星気学</h1>
  <div className="star-info">
    <span className="honmei">本命星：五黄土星</span>
    <span className="month">月命星：七赤金星</span>
    <span className="day">日命星：二黒土星</span>
  </div>
</div>
```

##### サイドバー（目次）
```tsx
<aside className="sidebar">
  <h3>目次</h3>
  <ul>
    <li><a href="#profile">基本プロフィール</a></li>
    <li><a href="#personality">性格の特徴</a></li>
    <li><a href="#direction-boards">方位盤</a></li>
    <li><a href="#lucky-directions">吉方位一覧</a></li>
    <li><a href="#compatibility">相性</a></li>
    <li><a href="#trivia">九星気学の雑学</a></li>
  </ul>
</aside>
```

##### メインコンテンツ

**基本プロフィール**
```tsx
<section id="profile">
  <h2>基本プロフィール</h2>
  <div className="profile-grid">
    <div className="card">
      <h3>本命星（年命）</h3>
      <div className="star-large">五黄土星</div>
      <p>五行：土</p>
      <p>定位：中央</p>
    </div>
    <div className="card">
      <h3>月命星（月生命）</h3>
      <div className="star-large">七赤金星</div>
      <p>内面の才能</p>
    </div>
    <div className="card">
      <h3>日命星</h3>
      <div className="star-large">二黒土星</div>
      <p>日常の行動パターン</p>
    </div>
  </div>
</section>
```

**性格の特徴**
```tsx
<section id="personality">
  <h2>性格の特徴</h2>

  <div className="characteristic-section">
    <h3>🌟 核心的性質</h3>
    <p>中央に位置し、全てを統べる帝王の星...</p>
  </div>

  <div className="characteristic-section">
    <h3>💪 強み</h3>
    <ul>
      <li>リーダーシップ</li>
      <li>決断力</li>
      <li>統率力</li>
    </ul>
  </div>

  <div className="characteristic-section">
    <h3>⚠️ 注意点</h3>
    <ul>
      <li>支配的になりすぎない</li>
      <li>独善に注意</li>
    </ul>
  </div>
</section>
```

**方位盤（3種表示）**
```tsx
<section id="direction-boards">
  <h2>今日の方位盤</h2>

  <div className="board-tabs">
    <button>年盤</button>
    <button>月盤</button>
    <button className="active">日盤</button>
  </div>

  <div className="loshu-board-container">
    <LoshuBoard type="day" date={new Date()} honmeiStar={5} />
  </div>

  <div className="board-explanation">
    <p>日盤は日帰り旅行や近距離の外出に使用します...</p>
  </div>
</section>
```

**吉方位一覧（テーブル形式）**
```tsx
<section id="lucky-directions">
  <h2>吉方位一覧</h2>

  <table className="direction-table">
    <thead>
      <tr>
        <th>方位</th>
        <th>種類</th>
        <th>効果</th>
        <th>推奨</th>
      </tr>
    </thead>
    <tbody>
      <tr className="excellent">
        <td>東</td>
        <td>大吉</td>
        <td>発展運・成長運</td>
        <td>⭐⭐⭐</td>
      </tr>
      <tr className="good">
        <td>南東</td>
        <td>吉</td>
        <td>人間関係・恋愛運</td>
        <td>⭐⭐</td>
      </tr>
      <tr className="bad">
        <td>南西</td>
        <td>凶</td>
        <td>五黄殺</td>
        <td>×</td>
      </tr>
    </tbody>
  </table>
</section>
```

**雑学コラム**
```tsx
<section id="trivia">
  <h2>九星気学の雑学</h2>

  <div className="trivia-card">
    <h3>📚 なぜ九星なのか？</h3>
    <p>九星気学は中国の「洛書」に由来します...</p>
  </div>

  <div className="trivia-card">
    <h3>🌍 方位学の歴史</h3>
    <p>古代中国では、皇帝が出陣する方位を...</p>
  </div>
</section>
```

---

### 2. 今日の吉方位 (`/daily/direction`)

#### ページ構成

```tsx
export default function DailyDirection() {
  const [selectedHonmei, setSelectedHonmei] = useState(1);

  return (
    <div className="daily-direction-page">
      <header>
        <h1>今日の吉方位</h1>
        <p className="date">{format(new Date(), 'yyyy年M月d日（E）', { locale: ja })}</p>
      </header>

      {/* 本命星選択タブ */}
      <div className="star-selector-tabs">
        {[1,2,3,4,5,6,7,8,9].map(star => (
          <button
            key={star}
            className={selectedHonmei === star ? 'active' : ''}
            onClick={() => setSelectedHonmei(star)}
          >
            {STAR_NAMES[star]}
          </button>
        ))}
      </div>

      {/* 月命星リスト */}
      <div className="month-star-list">
        {[1,2,3,4,5,6,7,8,9].map(monthStar => (
          <div key={monthStar} className="month-star-card">
            <h3>{STAR_NAMES[monthStar]}</h3>
            <p className="birth-month">
              {getMonthRange(selectedHonmei, monthStar)}
            </p>
            <Link
              href={`/kyusei/direction_day/id/${selectedHonmei}/${monthStar}`}
              className="detail-button"
            >
              詳細を見る →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 3. 吉方位サーチ (`/search/direction`)

#### ページ構成

```tsx
export default function DirectionSearch() {
  const [searchParams, setSearchParams] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 30),
    direction: 'all',
    fortuneType: 'auspicious',
    boardType: 'month'
  });

  return (
    <div className="direction-search-page">
      <header>
        <h1>吉方位サーチ</h1>
        <p>年盤から日盤まで、あなたの吉方位を検索できます</p>
      </header>

      {/* 検索フォーム */}
      <div className="search-form">
        <div className="form-row">
          <label>生年月日</label>
          <input type="date" />
        </div>

        <div className="form-row">
          <label>期間</label>
          <input type="date" value={searchParams.startDate} />
          <span>〜</span>
          <input type="date" value={searchParams.endDate} />
        </div>

        <div className="form-row">
          <label>方位盤</label>
          <select>
            <option value="year">年盤</option>
            <option value="month">月盤</option>
            <option value="day">日盤</option>
          </select>
        </div>

        <div className="form-row">
          <label>方位</label>
          <select>
            <option value="all">全方位</option>
            <option value="北">北</option>
            <option value="北東">北東</option>
            <option value="東">東</option>
            {/* ... */}
          </select>
        </div>

        <div className="form-row">
          <label>種類</label>
          <div className="radio-group">
            <label><input type="radio" name="type" value="auspicious" /> 吉方位のみ</label>
            <label><input type="radio" name="type" value="inauspicious" /> 凶方位のみ</label>
            <label><input type="radio" name="type" value="all" /> すべて</label>
          </div>
        </div>

        <button className="search-button">検索</button>
      </div>

      {/* 検索結果 */}
      <div className="search-results">
        <h2>検索結果</h2>

        <table className="results-table">
          <thead>
            <tr>
              <th>日付</th>
              <th>方位</th>
              <th>種類</th>
              <th>効果</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            <tr className="excellent">
              <td>2025年1月5日</td>
              <td>東</td>
              <td>大吉</td>
              <td>発展運・成長運</td>
              <td><a href="#">詳細 →</a></td>
            </tr>
            {/* ... */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### 4. 九星気学カレンダー (`/about/kyusei_calendar`)

#### ページ構成

```tsx
export default function KyuseiCalendar() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);

  return (
    <div className="kyusei-calendar-page">
      <header>
        <h1>九星気学カレンダー</h1>
        <p>九星、十干十二支、六曜、開運日を表示</p>
      </header>

      {/* 年月選択 */}
      <div className="calendar-controls">
        <button onClick={() => setMonth(month - 1)}>← 前月</button>
        <div className="month-selector">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}月</option>)}
          </select>
        </div>
        <button onClick={() => setMonth(month + 1)}>次月 →</button>
      </div>

      {/* カレンダー */}
      <div className="calendar-grid">
        <div className="calendar-header">
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div key={day} className="header-cell">{day}</div>
          ))}
        </div>

        <div className="calendar-body">
          {getDaysInMonth(year, month).map(day => (
            <div key={day} className="calendar-cell">
              <div className="date-number">{day}</div>
              <div className="kyusei">{getKyusei(year, month, day)}</div>
              <div className="rokuyo">{getRokuyo(year, month, day)}</div>
              {isLuckyDay(year, month, day) && <div className="lucky-mark">🌟</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 凡例 */}
      <div className="legend">
        <h3>凡例</h3>
        <div className="legend-items">
          <div><span className="mark">🌟</span> 開運日</div>
          <div><span className="mark">◎</span> 大吉日</div>
          <div><span className="mark">○</span> 吉日</div>
          <div><span className="mark">×</span> 凶日</div>
        </div>
      </div>
    </div>
  );
}
```

---

### 5. 有名人検索 (`/search/famouse`)

#### ページ構成

```tsx
export default function FamousSearch() {
  const [searchType, setSearchType] = useState<'keyword' | 'date' | 'star'>('keyword');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="famous-search-page">
      <header>
        <h1>有名人検索</h1>
        <p>キーワード、生年月日、九星から有名人を検索</p>
      </header>

      {/* 検索タブ */}
      <div className="search-tabs">
        <button
          className={searchType === 'keyword' ? 'active' : ''}
          onClick={() => setSearchType('keyword')}
        >
          キーワード検索
        </button>
        <button
          className={searchType === 'date' ? 'active' : ''}
          onClick={() => setSearchType('date')}
        >
          生年月日検索
        </button>
        <button
          className={searchType === 'star' ? 'active' : ''}
          onClick={() => setSearchType('star')}
        >
          九星検索
        </button>
      </div>

      {/* 検索フォーム */}
      <div className="search-form">
        {searchType === 'keyword' && (
          <input
            type="text"
            placeholder="名前、グループ名などを入力"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {searchType === 'date' && (
          <input
            type="date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {searchType === 'star' && (
          <div className="star-grid">
            {[1,2,3,4,5,6,7,8,9].map(star => (
              <button key={star} className="star-button">
                {STAR_NAMES[star]}
              </button>
            ))}
          </div>
        )}

        <button className="search-button">検索</button>
      </div>

      {/* 検索結果 */}
      <div className="search-results">
        <h2>検索結果（25件）</h2>

        <div className="famous-grid">
          {/* 例 */}
          <div className="famous-card">
            <div className="famous-name">木村拓哉</div>
            <div className="famous-date">1972年11月13日</div>
            <div className="famous-stars">
              <span className="honmei">本命：二黒土星</span>
              <span className="month">月命：一白水星</span>
            </div>
            <Link href="/check/ninestar/day/19721113" className="detail-link">
              詳細を見る →
            </Link>
          </div>
          {/* ... */}
        </div>
      </div>
    </div>
  );
}
```

---

## 🗂️ ディレクトリ構造

```
app/
├── check/
│   └── ninestar/
│       └── day/
│           └── [date]/
│               └── page.tsx          # 九星詳細ページ
├── search/
│   ├── map/
│   │   └── page.tsx                  # 開運マップ
│   ├── direction/
│   │   └── page.tsx                  # 吉方位サーチ
│   └── famouse/
│       └── page.tsx                  # 有名人検索
├── about/
│   └── kyusei_calendar/
│       └── page.tsx                  # 九星気学カレンダー
├── daily/
│   └── direction/
│       └── page.tsx                  # 今日の吉方位
├── monthly/
│   └── direction/
│       └── page.tsx                  # 今月の吉方位
├── yearly/
│   └── direction/
│       └── page.tsx                  # 今年の吉方位
└── kyusei/
    ├── direction_day/
    │   └── id/
    │       └── [honmei]/
    │           └── [month]/
    │               └── page.tsx      # 日盤詳細
    ├── direction_month/
    └── direction_year/

components/
├── StarSelector.tsx                  # 九星選択コンポーネント
├── DirectionBoard.tsx                # 方位盤コンポーネント
├── DirectionCard.tsx                 # 方位カード
├── MonthStarList.tsx                 # 月命星リスト
├── CalendarView.tsx                  # カレンダー表示
├── FamousCard.tsx                    # 有名人カード
├── SearchForm.tsx                    # 検索フォーム
└── DirectionTable.tsx                # 方位一覧テーブル

lib/
├── fortune/
│   ├── nine-star-ki/
│   │   ├── calculator.ts             # 九星計算
│   │   ├── knowledge-base.ts         # 知識ベース
│   │   └── detailed-explanations.ts  # 詳細説明
│   ├── directional/
│   │   ├── calculator.ts             # 方位計算
│   │   └── constants.ts              # 方位定数
│   └── calendar/
│       ├── kyusei-calendar.ts        # 九星カレンダー
│       ├── rokuyo.ts                 # 六曜計算
│       └── lucky-days.ts             # 開運日判定
└── data/
    └── famous-people.ts              # 有名人データ

styles/
├── globals.css                        # グローバルスタイル
└── yakumoin-theme.css                 # 八雲院テーマ
```

---

## 📊 データベース拡張

### 有名人テーブル

```sql
CREATE TABLE famous_people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 基本情報
  name TEXT NOT NULL,
  name_kana TEXT,
  birth_date DATE NOT NULL,

  -- カテゴリ
  category TEXT[], -- 俳優、歌手、スポーツ選手など
  group_name TEXT, -- グループ名（アイドル、バンドなど）

  -- 九星気学
  honmei_star INTEGER NOT NULL,
  month_star INTEGER NOT NULL,
  day_star INTEGER NOT NULL,

  -- 検索用
  search_keywords TEXT[], -- 検索用キーワード

  -- メタデータ
  image_url TEXT,
  wikipedia_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_famous_people_name ON famous_people(name);
CREATE INDEX idx_famous_people_birth_date ON famous_people(birth_date);
CREATE INDEX idx_famous_people_honmei ON famous_people(honmei_star);
CREATE INDEX idx_famous_people_category ON famous_people USING GIN(category);
CREATE INDEX idx_famous_people_keywords ON famous_people USING GIN(search_keywords);
```

---

## 🎯 実装優先順位

### Phase 1: 基本ページ（最優先）
1. ✅ 九星詳細ページ (`/check/ninestar/day/[date]`)
2. ✅ 今日の吉方位 (`/daily/direction`)
3. ✅ 今月の吉方位 (`/monthly/direction`)
4. ✅ 今年の吉方位 (`/yearly/direction`)

### Phase 2: 検索機能
5. ✅ 吉方位サーチ (`/search/direction`)
6. ✅ 有名人検索 (`/search/famouse`)

### Phase 3: 高度な機能
7. ✅ 開運マップ (`/search/map`)
8. ✅ 九星気学カレンダー (`/about/kyusei_calendar`)

---

## 🎨 UIコンポーネント詳細

### StarSelector（九星選択タブ）

```tsx
interface StarSelectorProps {
  selected: number;
  onChange: (star: number) => void;
  layout?: 'tabs' | 'grid' | 'dropdown';
}

export default function StarSelector({ selected, onChange, layout = 'tabs' }: StarSelectorProps) {
  const stars = [
    { id: 1, name: '一白水星', color: '#3B82F6' },
    { id: 2, name: '二黒土星', color: '#000000' },
    { id: 3, name: '三碧木星', color: '#10B981' },
    { id: 4, name: '四緑木星', color: '#34D399' },
    { id: 5, name: '五黄土星', color: '#F59E0B' },
    { id: 6, name: '六白金星', color: '#9CA3AF' },
    { id: 7, name: '七赤金星', color: '#EF4444' },
    { id: 8, name: '八白土星', color: '#78350F' },
    { id: 9, name: '九紫火星', color: '#A855F7' },
  ];

  if (layout === 'tabs') {
    return (
      <div className="star-selector-tabs">
        {stars.map(star => (
          <button
            key={star.id}
            className={`star-tab ${selected === star.id ? 'active' : ''}`}
            style={{
              borderBottomColor: selected === star.id ? star.color : 'transparent',
              color: selected === star.id ? star.color : '#6B7280'
            }}
            onClick={() => onChange(star.id)}
          >
            {star.name}
          </button>
        ))}
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="star-selector-grid">
        {stars.map(star => (
          <button
            key={star.id}
            className={`star-button ${selected === star.id ? 'active' : ''}`}
            style={{
              backgroundColor: selected === star.id ? star.color : '#F3F4F6',
              color: selected === star.id ? '#FFFFFF' : '#1F2937'
            }}
            onClick={() => onChange(star.id)}
          >
            {star.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={selected}
      onChange={(e) => onChange(Number(e.target.value))}
      className="star-selector-dropdown"
    >
      {stars.map(star => (
        <option key={star.id} value={star.id}>
          {star.name}
        </option>
      ))}
    </select>
  );
}
```

---

## 📝 まとめ

この実装プランに従えば、八雲院のすべての主要機能を完全に再現できます。

**次のステップ**:
1. 共通コンポーネントの作成
2. Phase 1のページから順次実装
3. デザインシステムの適用
4. 有名人データの収集と登録

各ページのコードを順次作成していきます！
