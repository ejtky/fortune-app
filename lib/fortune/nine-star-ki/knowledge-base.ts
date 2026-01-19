/**
 * 九星気学の伝統的知識ベース
 * 古典文献と伝統的解釈に基づく
 */

export interface StarKnowledge {
  star: number;
  name: string;
  element: string;

  // 本質的な性質
  essence: {
    core: string;              // 核心的性質
    cosmicPrinciple?: string;   // 宇宙的原理（なぜその性質を持つのか）
    elementalReason?: string;   // 五行的理由（なぜその五行なのか）
    lifeDirection: string;     // 人生の方向性
    innerNature: string;       // 内面の本質
    spiritualPath: string;     // 精神的な道
  };

  // 詳細な性格解釈
  personality: {
    strengths: string[];       // 長所
    weaknesses: string[];      // 短所
    hiddenTalents: string[];   // 隠れた才能
    lifeTheme: string;         // 人生のテーマ
  };

  // 人生の各分野
  lifeAspects: {
    career: {
      suitableJobs: string[];
      workStyle: string;
      success: string;
    };
    relationships: {
      loveStyle: string;
      compatibility: string;
      family: string;
    };
    health: {
      vulnerabilities: string[];
      recommendations: string[];
    };
    wealth: {
      moneyAttitude: string;
      wealthBuilding: string;
    };
  };

  // 人生のサイクル
  lifeCycles: {
    youth: string;      // 青年期
    middle: string;     // 中年期
    elder: string;      // 晩年期
  };

  // 開運法
  remedies: {
    colors: string[];
    directions: string[];
    items: string[];
    habits: string[];
    avoidances: string[];
  };

  // 伝統的教え
  traditionalWisdom: string[];
}

export const TRADITIONAL_KNOWLEDGE: Record<number, StarKnowledge> = {
  1: {
    star: 1,
    name: '一白水星',
    element: '水',
    essence: {
      core: '水の如く柔軟にして、深淵なる知恵を持つ。静かなる力の象徴。',
      cosmicPrinciple: '一白水星は洛書の配置で「1」の位置、北方に配されます。北は陰が極まり、新たな陽が胎動する場所。冬至の後、地中では春への準備が密かに始まります。水星（惑星）は約88日という最速の公転周期を持ち、その俊敏な動きから知恵と流動性の象徴とされました。また、一白の「白」は純粋さを表し、万物の源である水の透明性を示します。',
      elementalReason: '五行において水は「潤下」の性質を持ちます。つまり、下に流れ、低いところに集まり、あらゆる隙間に浸透する特性です。水は形を持たず、器に従いますが、集まれば大海となり、凍れば岩よりも硬くなります。この柔軟性と潜在的な強大さが、一白水星の人の性格に現れます。また、水は生命の源であり、全ての生物に不可欠です。この「根源的な存在」という意味が、一白水星の深い洞察力と本質を見抜く力につながります。',
      lifeDirection: '困難を水が流れるように迂回し、最終的には海に至る如く、目標に到達する。',
      innerNature: '表面は穏やかだが、内面には深い思考と強い意志を秘めている。',
      spiritualPath: '静寂の中に真理を見出し、柔軟性をもって万物に対応する道。'
    },
    personality: {
      strengths: ['深い洞察力', '冷静な判断力', '柔軟な適応力', '秘密を守る', '粘り強さ'],
      weaknesses: ['優柔不断', '秘密主義すぎる', '孤独を好みすぎる', '感情を表に出さない'],
      hiddenTalents: ['直感力', '交渉能力', '危機管理能力', '深層心理の理解'],
      lifeTheme: '静水深流 - 表面は穏やかでも深い流れを持つ'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['研究職', 'カウンセラー', '医療関係', '水商売', '文筆業', '探偵'],
        workStyle: '単独行動を好み、深く考えて行動する。チームよりも個人プレーが得意。',
        success: '忍耐と継続が成功の鍵。急がず、水が岩を穿つように着実に進む。'
      },
      relationships: {
        loveStyle: '感情を表に出さないが、内面では深く愛する。一途で献身的。',
        compatibility: '三碧木星、四緑木星と相性良し（水生木）。六白金星、七赤金星からの援助あり（金生水）。',
        family: '家族を大切にするが、独立した空間も必要とする。'
      },
      health: {
        vulnerabilities: ['腎臓', '膀胱', '生殖器系', '耳', '冷え性', '循環器系'],
        recommendations: ['体を温める食事', '適度な運動', '十分な水分補給', '冷えから身を守る']
      },
      wealth: {
        moneyAttitude: '堅実で貯蓄を好む。投機よりも確実な資産形成を選ぶ。',
        wealthBuilding: '長期的な投資と堅実な貯蓄で財を成す。水のように少しずつ溜める。'
      }
    },
    lifeCycles: {
      youth: '内向的で思慮深い青年期。学問に励み、基礎を固める時期。',
      middle: '経験と知恵が花開く。他者からの信頼を得て、重要な役割を担う。',
      elder: '深い智慧と経験で周囲を導く。精神的な充実を得る。'
    },
    remedies: {
      colors: ['黒', '紺', '青', '白'],
      directions: ['北'],
      items: ['水晶', '真珠', '水に関するもの', '魚の置物'],
      habits: ['瞑想', '読書', '水辺の散歩', '静かな環境で過ごす'],
      avoidances: ['過度な刺激', '騒がしい場所', '無理な社交', '感情の抑圧しすぎ']
    },
    traditionalWisdom: [
      '上善若水 - 最上の善は水の如し（老子）',
      '水は方円の器に従う - 柔軟性こそが最大の強さ',
      '滴水穿石 - 小さな積み重ねが大きな成果を生む',
      '静水深流 - 表面の静けさの下に深い流れあり',
      '水清ければ魚棲まず - 完璧を求めすぎると孤立する'
    ]
  },

  2: {
    star: 2,
    name: '二黒土星',
    element: '土',
    essence: {
      core: '大地の如く全てを受け入れ、育む母なる存在。献身と奉仕の象徴。',
      lifeDirection: '他者を支え、育てることで自らも成長する。縁の下の力持ちとして価値を発揮。',
      innerNature: '誠実で真面目。責任感が強く、コツコツと努力を積み重ねる。',
      spiritualPath: '無私の奉仕を通じて、真の豊かさと満足を得る道。'
    },
    personality: {
      strengths: ['誠実', '勤勉', '責任感が強い', '世話好き', '忍耐力がある', '現実的'],
      weaknesses: ['優柔不断', '頑固', '心配性', '自己主張が弱い', '他人に尽くしすぎる'],
      hiddenTalents: ['組織運営能力', '細部への注意力', '人を育てる力', '粘り強さ'],
      lifeTheme: '厚徳載物 - 厚い徳をもって万物を載せる'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['農業', '不動産', '介護・福祉', '教育', '事務職', '経理', '公務員'],
        workStyle: '地道にコツコツと。縁の下の力持ちとして組織を支える。',
        success: '努力と忍耐が実を結ぶ。急がず、確実に基盤を固めることが成功への道。'
      },
      relationships: {
        loveStyle: '献身的で尽くすタイプ。派手さはないが、誠実で安定した愛情を提供。',
        compatibility: '六白金星、七赤金星、九紫火星と好相性。一白水星を生む（土剋水だが、相生関係も）。',
        family: '家族を第一に考え、家庭を守ることに喜びを感じる。'
      },
      health: {
        vulnerabilities: ['胃腸', '脾臓', '消化器系', '皮膚', '過労', 'ストレス性疾患'],
        recommendations: ['規則正しい食事', '適度な休息', '趣味を持つ', 'ストレス解消']
      },
      wealth: {
        moneyAttitude: '堅実な貯蓄家。無駄遣いせず、コツコツと財を築く。',
        wealthBuilding: '不動産投資や長期的な資産形成が向く。地道な努力が財を成す。'
      }
    },
    lifeCycles: {
      youth: '真面目で勤勉。早くから責任を負い、苦労を経験することも。',
      middle: '努力が実を結び、安定と信頼を得る。家庭と仕事の両立に成功。',
      elder: '蓄積された経験と信頼で、周囲から頼りにされる存在に。'
    },
    remedies: {
      colors: ['黄色', '茶色', 'ベージュ', '黒'],
      directions: ['南西'],
      items: ['陶器', '土に関するもの', '植物', '四角い物'],
      habits: ['園芸', '料理', '整理整頓', '早寝早起き'],
      avoidances: ['過労', '自己犠牲のしすぎ', '完璧主義', '心配しすぎ']
    },
    traditionalWisdom: [
      '地厚く徳を載せる - 大地のように厚い徳で万物を支える',
      '功成り名遂げて身退くは天の道なり',
      '積善の家には必ず余慶あり - 善行を積めば必ず良いことがある',
      '一歩一歩確実に - 急がば回れの精神',
      '母なる大地 - 全てを受け入れ育む心'
    ]
  },

  3: {
    star: 3,
    name: '三碧木星',
    element: '木',
    essence: {
      core: '春の若木の如く、成長と発展のエネルギーに満ちている。行動と挑戦の象徴。',
      lifeDirection: '常に前進し、新しいことに挑戦する。失敗を恐れず、経験から学ぶ。',
      innerNature: '明朗快活で正直。エネルギッシュで、じっとしていられない性格。',
      spiritualPath: '行動を通じて成長し、正直さと誠実さで道を切り開く。'
    },
    personality: {
      strengths: ['行動力がある', '明朗快活', '正直', '素直', '発展性がある', 'ポジティブ'],
      weaknesses: ['せっかち', '短気', '計画性に欠ける', '飽きっぽい', '落ち着きがない'],
      hiddenTalents: ['企画力', 'コミュニケーション能力', '新規事業開拓', '瞬発力'],
      lifeTheme: '雷声震動 - 雷のように行動し、世界を震わせる'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['営業', '広告', 'マスコミ', 'IT', 'スポーツ', '音楽', '起業家'],
        workStyle: '行動第一。フットワーク軽く、新しいことにどんどん挑戦。',
        success: '若いうちに行動し、多くの経験を積むことが成功への道。失敗を恐れない。'
      },
      relationships: {
        loveStyle: '情熱的で素直。好きになったら一直線。恋愛は派手で激しい。',
        compatibility: '九紫火星と最高の相性（木生火）。一白水星から援助を受ける（水生木）。',
        family: '明るく賑やかな家庭を作る。子供っぽい一面も。'
      },
      health: {
        vulnerabilities: ['肝臓', '神経系', '事故', '怪我', 'ストレス', '過労'],
        recommendations: ['適度な運動', '十分な睡眠', '深呼吸', 'リラックス時間の確保']
      },
      wealth: {
        moneyAttitude: '入るのも早いが出るのも早い。計画的な貯蓄が苦手。',
        wealthBuilding: '収入の一部を自動的に貯蓄する仕組みを作る。投資よりも事業で。'
      }
    },
    lifeCycles: {
      youth: 'エネルギッシュで何事にも積極的。多くの経験を積み、基礎を作る。',
      middle: '若さのエネルギーを社会で発揮。リーダーシップを発揮する時期。',
      elder: '経験を活かし、若い世代を導く。活発さは変わらない。'
    },
    remedies: {
      colors: ['青', '緑', '水色'],
      directions: ['東'],
      items: ['観葉植物', '木製品', '音を出すもの', '楽器'],
      habits: ['朝の運動', '音楽を聴く', '新しいことへの挑戦', '外出'],
      avoidances: ['じっとしていること', '過度の飲酒', '無計画な行動', '短気な対応']
    },
    traditionalWisdom: [
      '雷は速やかにして動く - 即断即決の力',
      '木は直ちに伸びる - 素直に成長する',
      '百聞は一見に如かず - 行動して確かめる',
      '失敗は成功の母 - 失敗を恐れず挑戦',
      '青春は一度きり - 若さのエネルギーを活かす'
    ]
  },

  4: {
    star: 4,
    name: '四緑木星',
    element: '木',
    essence: {
      core: '風の如く自由で柔軟。調和と人間関係を大切にする。コミュニケーションの象徴。',
      lifeDirection: '人と人を繋ぎ、調和をもたらす。風のように自由に、しかし優しく。',
      innerNature: '社交的で優しい。他者との調和を何よりも重視する。',
      spiritualPath: '他者との関わりの中で成長し、調和と平和をもたらす道。'
    },
    personality: {
      strengths: ['社交的', '優しい', '柔軟', '協調性がある', 'コミュニケーション能力が高い'],
      weaknesses: ['優柔不断', '八方美人', '流されやすい', '決断力に欠ける', '自己主張が弱い'],
      hiddenTalents: ['仲介能力', 'ネットワーク構築', '空気を読む力', '癒しの力'],
      lifeTheme: '風行天上 - 風が天上を行くように自由に'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['接客業', '人事', 'PR', 'コーディネーター', 'カウンセラー', '旅行業'],
        workStyle: 'チームワークを大切に。人間関係を活かして成果を出す。',
        success: '人脈とコミュニケーション能力を活かす。人との縁が成功を呼ぶ。'
      },
      relationships: {
        loveStyle: '優しく思いやりがある。相手に合わせすぎる傾向も。',
        compatibility: '九紫火星と相性良し（木生火）。一白水星から援助（水生木）。',
        family: '和やかで調和の取れた家庭を作る。家族の潤滑油的存在。'
      },
      health: {
        vulnerabilities: ['呼吸器系', '神経系', '腸', 'ストレス', '優柔不断による疲労'],
        recommendations: ['深呼吸', '適度な運動', '自然との触れ合い', '自己主張の練習']
      },
      wealth: {
        moneyAttitude: 'お金より人間関係を優先。計画的ではないが、困らない。',
        wealthBuilding: '人脈を活かしたビジネス。信頼関係が財を成す。'
      }
    },
    lifeCycles: {
      youth: '多くの人と出会い、様々な経験をする。人間関係の基礎を作る。',
      middle: '人脈が広がり、社会的な地位を確立。調整役として活躍。',
      elder: '豊富な人脈と経験で、人を繋ぐ役割を果たす。'
    },
    remedies: {
      colors: ['緑', '青緑', '水色'],
      directions: ['南東'],
      items: ['観葉植物', '香り物', '風鈴', '長いもの'],
      habits: ['旅行', '人との交流', '風通しの良い場所で過ごす', '香りを楽しむ'],
      avoidances: ['孤立', '優柔不断', '八方美人', '自己犠牲']
    },
    traditionalWisdom: [
      '風は万物に及ぶ - 広く影響を与える',
      '柔よく剛を制す - 柔軟性が強さ',
      '和を以て貴しとなす',
      '人の和が天の時に勝る',
      '縁は異なもの味なもの - 人との出会いを大切に'
    ]
  },

  5: {
    star: 5,
    name: '五黄土星',
    element: '土',
    essence: {
      core: '中央に位置し、全てを統べる帝王の星。強大な力と責任の象徴。',
      cosmicPrinciple: '五黄土星は洛書の中心「5」に位置し、唯一、方位を持たない星です。東西南北の全てを統べる中央は、皇帝の座を象徴します。土星（惑星）は約29年の長い公転周期を持ち、その重厚で堂々とした動きから、権威と安定の象徴とされました。また、「黄」は中国で皇帝の色であり、中央の大地（黄土）を表します。四季の変わり目（土用）を司り、全ての変化を仲介する力を持ちます。',
      elementalReason: '五行において土は「稼穡（かしょく）」の性質を持ちます。これは種を蒔き、作物を育てる大地の力です。土は万物を受け入れ、変換し、育てます。木が枯れれば土に還り、また新しい命を育む。この循環の中心にいるのが土です。五黄土星の人は、この「受容」と「変換」の力を持ちます。あらゆるものを統合し、新しい形に作り変える力。これがリーダーシップや経営能力として現れます。また、土は動かず、安定しています。この不動の中心性が、五黄土星の人の強い意志と信念につながります。',
      lifeDirection: 'リーダーとして人々を導き、中心的役割を果たす。強い意志で道を切り開く。',
      innerNature: '強い意志と決断力。支配欲と責任感を併せ持つ。',
      spiritualPath: '権力と責任を正しく使い、多くの人を導く道。'
    },
    personality: {
      strengths: ['リーダーシップ', '決断力', '責任感', '統率力', 'カリスマ性', '実行力'],
      weaknesses: ['支配的', '頑固', '独善的', '短気', 'プライドが高い'],
      hiddenTalents: ['経営能力', '危機管理能力', '人を動かす力', '直感力'],
      lifeTheme: '中央集権 - 全ての中心として君臨する'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['経営者', '政治家', '管理職', '起業家', '軍人', '警察'],
        workStyle: 'トップダウン型。強いリーダーシップで組織を率いる。',
        success: '決断力と実行力で成功を掴む。ただし独善に注意。'
      },
      relationships: {
        loveStyle: '情熱的で支配的。相手をリードしたがる。',
        compatibility: '六白金星、七赤金星と相性良し。九紫火星を生む（土剋水）。',
        family: '家庭でも中心的存在。強い父性・母性を発揮。'
      },
      health: {
        vulnerabilities: ['胃腸', '循環器', '高血圧', 'ストレス', '過労'],
        recommendations: ['ストレス管理', '適度な運動', 'バランスの取れた食事', '休息']
      },
      wealth: {
        moneyAttitude: '大きく稼ぎ、大きく使う。金銭に対する執着は強い。',
        wealthBuilding: '事業経営で大きな富を築く。投資判断は鋭い。'
      }
    },
    lifeCycles: {
      youth: '早くからリーダー資質を発揮。苦労も多いが、それが糧となる。',
      middle: '社会的地位を確立し、多くの人を率いる。最盛期。',
      elder: '経験と実績で、後進を指導。影響力は衰えない。'
    },
    remedies: {
      colors: ['黄色', 'ゴールド', '茶色'],
      directions: ['中央'],
      items: ['高級品', '金属製品', '重厚なもの', '宝石'],
      habits: ['瞑想', '権力の正しい使用', '部下への配慮', '謙虚さの維持'],
      avoidances: ['独善', '傲慢', '過労', '激怒']
    },
    traditionalWisdom: [
      '徳不孤、必有隣 - 徳ある者は孤立せず、必ず助けが来る',
      '王者は力ではなく徳で治める',
      '大権は大責任を伴う',
      '剛健中正 - 強くあれど正しくあれ',
      '高い木は風に折られやすい - 謙虚さを忘れずに'
    ]
  },

  6: {
    star: 6,
    name: '六白金星',
    element: '金',
    essence: {
      core: '天の如く高潔にして、金の如く堅固。完璧主義と高い理想の象徴。',
      lifeDirection: '高い理想を掲げ、完璧を目指す。正義と秩序を重んじる。',
      innerNature: '真面目で完璧主義。責任感が強く、妥協を許さない。',
      spiritualPath: '天の道を歩み、正義と真理を追求する道。'
    },
    personality: {
      strengths: ['完璧主義', '責任感が強い', '正義感がある', '頭脳明晰', '威厳がある'],
      weaknesses: ['融通が利かない', '頑固', 'プライドが高い', '他人に厳しい', '孤独'],
      hiddenTalents: ['分析力', '計画力', '管理能力', '問題解決能力'],
      lifeTheme: '天行健、君子以自強不息 - 天は常に動き、君子は自ら強くなる'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['法律家', '会計士', '技術者', '医師', '研究者', '官僚'],
        workStyle: '計画的で几帳面。高い基準を設定し、完璧を目指す。',
        success: '専門性と責任感で信頼を得る。長期的なキャリア形成が重要。'
      },
      relationships: {
        loveStyle: '真面目で誠実。理想が高く、相手にも高い基準を求める。',
        compatibility: '一白水星を生む（金生水）。二黒土星、八白土星から援助を受ける（土生金）。',
        family: '家族への責任を重く受け止める。厳格な父・母となる。'
      },
      health: {
        vulnerabilities: ['肺', '呼吸器系', '骨', '歯', '神経系', '完璧主義によるストレス'],
        recommendations: ['深呼吸', 'リラックス', '完璧を求めすぎない', '趣味を持つ']
      },
      wealth: {
        moneyAttitude: '計画的で堅実。無駄遣いを嫌い、確実な資産形成を好む。',
        wealthBuilding: '長期的な計画と投資で着実に富を築く。'
      }
    },
    lifeCycles: {
      youth: '真面目で優等生。高い目標に向かって努力する。',
      middle: '専門性を活かし、社会的地位を確立。リーダーとして活躍。',
      elder: '威厳と経験で尊敬を集める。後進の指導に力を注ぐ。'
    },
    remedies: {
      colors: ['白', '金', '銀', 'グレー'],
      directions: ['北西'],
      items: ['金属製品', '丸いもの', '高級品', '宝石'],
      habits: ['規則正しい生活', '瞑想', '深呼吸', '完璧を緩める練習'],
      avoidances: ['完璧主義の行き過ぎ', '他人への厳しさ', '孤立', '頑固さ']
    },
    traditionalWisdom: [
      '天は自ら助くる者を助く',
      '完璧は存在しない、だから追求する価値がある',
      '高潔なる者は孤高なり',
      '正義は我にあり - しかし柔軟性も必要',
      '金は百錬にして精となる - 試練が人を磨く'
    ]
  },

  7: {
    star: 7,
    name: '七赤金星',
    element: '金',
    essence: {
      core: '秋の実りの如く、豊かさと喜びをもたらす。社交と金運の象徴。',
      lifeDirection: '人生を楽しみ、他者にも喜びをもたらす。金銭的成功と人間関係の両立。',
      innerNature: '明るく社交的。楽しいことが好きで、人を喜ばせることに喜びを感じる。',
      spiritualPath: '喜びと豊かさを分かち合い、調和の中に幸福を見出す道。'
    },
    personality: {
      strengths: ['社交的', '明朗快活', '経済感覚に優れる', '愛嬌がある', '器用'],
      weaknesses: ['浪費家', '軽薄', '飽きっぽい', '口が軽い', '計画性に欠ける'],
      hiddenTalents: ['営業力', '交渉能力', '金銭感覚', 'エンターテイメント性'],
      lifeTheme: '金声玉振 - 金の音のように響き、玉のように輝く'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['営業', '接客業', '金融', '芸能', '飲食業', '美容'],
        workStyle: '人当たりが良く、顧客との関係構築が得意。楽しみながら働く。',
        success: '人間関係と経済感覚を活かす。楽しさの中に成功あり。'
      },
      relationships: {
        loveStyle: '明るく楽しい恋愛。モテるが、浮気性の傾向も。',
        compatibility: '一白水星を生む（金生水）。二黒土星、八白土星から援助（土生金）。',
        family: '賑やかで楽しい家庭。子供好きで良き親となる。'
      },
      health: {
        vulnerabilities: ['肺', '口', '歯', '皮膚', '過食', '飲みすぎ'],
        recommendations: ['適度な運動', 'バランスの取れた食事', '節制', '口腔ケア']
      },
      wealth: {
        moneyAttitude: '入るのも早いが出るのも早い。享楽的消費を好む。',
        wealthBuilding: '収入を増やすと同時に、支出管理も重要。貯蓄の習慣を。'
      }
    },
    lifeCycles: {
      youth: '人気者で社交的。多くの友人に囲まれる楽しい青春。',
      middle: '経済的成功と社会的地位を両立。充実した中年期。',
      elder: '豊かさと人脈に恵まれた晩年。人生を楽しむ。'
    },
    remedies: {
      colors: ['赤', 'ピンク', '金', '白'],
      directions: ['西'],
      items: ['金属製品', '丸いもの', '楽器', '装飾品'],
      habits: ['社交', '趣味を楽しむ', '貯蓄の習慣', '節制'],
      avoidances: ['浪費', '暴飲暴食', '軽薄な言動', '計画性のなさ']
    },
    traditionalWisdom: [
      '笑う門には福来る',
      '金は天下の回りもの - 惜しまず使い、正しく稼ぐ',
      '人脈は財産なり',
      '楽しみの中にも節度あり',
      '口は災いの元 - 言葉に注意'
    ]
  },

  8: {
    star: 8,
    name: '八白土星',
    element: '土',
    essence: {
      core: '山の如く動じず、堅固な意志を持つ。変革と継続の象徴。',
      lifeDirection: '困難に動じず、着実に目標に向かう。変化を恐れず、しかし基盤は守る。',
      innerNature: '真面目で保守的。しかし内には改革の意志を秘めている。',
      spiritualPath: '不動の信念を持ちながらも、必要な変化を受け入れる道。'
    },
    personality: {
      strengths: ['堅実', '継続力がある', '真面目', '誠実', '責任感が強い', '努力家'],
      weaknesses: ['頑固', '融通が利かない', '変化を嫌う', '保守的すぎる'],
      hiddenTalents: ['管理能力', '継承力', '改革の実行力', '忍耐力'],
      lifeTheme: '艮山止止 - 山のように動じず、止まるべきところで止まる'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['不動産', '建設', '相続業務', '伝統産業', '鉱業', '管理職'],
        workStyle: '着実で確実。長期的視点で仕事に取り組む。',
        success: '継続と積み重ねが成功の鍵。急がず、確実に。'
      },
      relationships: {
        loveStyle: '真面目で誠実。一途で、簡単には諦めない。',
        compatibility: '六白金星、七赤金星を生む（土生金）。九紫火星から援助（火生土）。',
        family: '家族と伝統を重んじる。堅実な家庭を築く。'
      },
      health: {
        vulnerabilities: ['関節', '腰', '背中', '胃腸', 'ストレス', '過労'],
        recommendations: ['適度な運動', 'ストレッチ', '規則正しい生活', 'リラックス']
      },
      wealth: {
        moneyAttitude: '堅実な貯蓄家。不動産などの実物資産を好む。',
        wealthBuilding: '長期的な資産形成と不動産投資。確実な方法で財を成す。'
      }
    },
    lifeCycles: {
      youth: '真面目で堅実。早くから責任を担い、苦労することも。',
      middle: '蓄積された努力が実を結ぶ。安定と信頼を得る。',
      elder: '財と経験に恵まれた晩年。後継者を育てる。'
    },
    remedies: {
      colors: ['白', '黄色', '茶色'],
      directions: ['北東'],
      items: ['山の絵', '石', '陶器', '四角いもの'],
      habits: ['登山', '整理整頓', '伝統の継承', '計画的行動'],
      avoidances: ['頑固さ', '変化への抵抗', '過度な保守性', '孤立']
    },
    traditionalWisdom: [
      '愚公移山 - 継続は力なり',
      '千里の道も一歩から',
      '山は動かず - 信念を貫く',
      '止まるべきところで止まる知恵',
      '変わらぬもの、変わるもの - 両方を見極める'
    ]
  },

  9: {
    star: 9,
    name: '九紫火星',
    element: '火',
    essence: {
      core: '太陽の如く輝き、全てを照らす。情熱と知性の象徴。',
      lifeDirection: '美と知性を追求し、人々を照らす。情熱をもって人生を生きる。',
      innerNature: '情熱的で芸術的。直感力に優れ、美しいものを愛する。',
      spiritualPath: '内なる光を輝かせ、他者の道を照らす。'
    },
    personality: {
      strengths: ['情熱的', '芸術的センス', '直感力', '華やか', 'カリスマ性', '頭脳明晰'],
      weaknesses: ['感情的', '短気', 'プライドが高い', '移り気', '派手好き'],
      hiddenTalents: ['芸術的才能', 'プレゼンテーション能力', '直感力', 'カリスマ性'],
      lifeTheme: '離火明照 - 火が明るく照らすように'
    },
    lifeAspects: {
      career: {
        suitableJobs: ['芸術家', 'デザイナー', '教育者', '医療', '美容', '出版'],
        workStyle: '情熱的に取り組む。美しさと完成度を重視。',
        success: '才能と情熱を活かす。人前に出る仕事で輝く。'
      },
      relationships: {
        loveStyle: '情熱的で華やか。理想的な恋愛を求める。',
        compatibility: '二黒土星、八白土星を生む（火生土）。三碧木星、四緑木星から援助（木生火）。',
        family: '華やかで文化的な家庭。教育熱心な親となる。'
      },
      health: {
        vulnerabilities: ['心臓', '目', '血圧', '神経系', 'ストレス'],
        recommendations: ['適度な休息', '目のケア', 'ストレス管理', '感情のコントロール']
      },
      wealth: {
        moneyAttitude: '見栄を張りやすい。美しいものや高級品に惹かれる。',
        wealthBuilding: '才能を活かした収入源。ブランド価値を高めることで成功。'
      }
    },
    lifeCycles: {
      youth: '才能が輝く。多くの注目を集め、成功も早い。',
      middle: '社会的地位と名声を得る。最も輝く時期。',
      elder: '知性と経験で後進を指導。精神的な豊かさを得る。'
    },
    remedies: {
      colors: ['紫', '赤', 'オレンジ', '緑'],
      directions: ['南'],
      items: ['照明', '芸術品', '鏡', '三角形のもの'],
      habits: ['芸術鑑賞', '学習', '瞑想', '感情のコントロール'],
      avoidances: ['短気', '見栄', '感情的な決断', '派手すぎる行動']
    },
    traditionalWisdom: [
      '火は上に昇る - 向上心を持ち続ける',
      '美は一日にして成らず',
      '知恵は経験から生まれる',
      '光あるところに影あり - 謙虚さを忘れずに',
      '情熱は人生の燃料 - ただし制御も必要'
    ]
  }
};

/**
 * 質問に対する適切な知識を検索
 */
export function searchKnowledge(star: number, query: string): string {
  const knowledge = TRADITIONAL_KNOWLEDGE[star];
  if (!knowledge) return '申し訳ございません。情報が見つかりませんでした。';

  const lowerQuery = query.toLowerCase();

  // 性格・特徴
  if (lowerQuery.includes('性格') || lowerQuery.includes('特徴') || lowerQuery.includes('どんな人')) {
    return `【${knowledge.name}の本質】\n${knowledge.essence.core}\n\n【性格的特徴】\n強み: ${knowledge.personality.strengths.join('、')}\n隠れた才能: ${knowledge.personality.hiddenTalents.join('、')}\n\n人生のテーマ: ${knowledge.personality.lifeTheme}`;
  }

  // 仕事・キャリア
  if (lowerQuery.includes('仕事') || lowerQuery.includes('職業') || lowerQuery.includes('キャリア')) {
    return `【${knowledge.name}の適職】\n${knowledge.lifeAspects.career.suitableJobs.join('、')}\n\n【働き方】\n${knowledge.lifeAspects.career.workStyle}\n\n【成功の秘訣】\n${knowledge.lifeAspects.career.success}`;
  }

  // 恋愛・人間関係
  if (lowerQuery.includes('恋愛') || lowerQuery.includes('結婚') || lowerQuery.includes('人間関係')) {
    return `【${knowledge.name}の恋愛スタイル】\n${knowledge.lifeAspects.relationships.loveStyle}\n\n【相性】\n${knowledge.lifeAspects.relationships.compatibility}\n\n【家庭】\n${knowledge.lifeAspects.relationships.family}`;
  }

  // 健康
  if (lowerQuery.includes('健康') || lowerQuery.includes('病気') || lowerQuery.includes('体調')) {
    return `【${knowledge.name}の健康】\n注意すべき部位: ${knowledge.lifeAspects.health.vulnerabilities.join('、')}\n\n【健康法】\n${knowledge.lifeAspects.health.recommendations.join('\n')}`;
  }

  // 金運・財運
  if (lowerQuery.includes('金運') || lowerQuery.includes('お金') || lowerQuery.includes('財運') || lowerQuery.includes('貯金')) {
    return `【${knowledge.name}の金銭感覚】\n${knowledge.lifeAspects.wealth.moneyAttitude}\n\n【財の築き方】\n${knowledge.lifeAspects.wealth.wealthBuilding}`;
  }

  // 開運法
  if (lowerQuery.includes('開運') || lowerQuery.includes('運気') || lowerQuery.includes('上げる')) {
    return `【${knowledge.name}の開運法】\nラッキーカラー: ${knowledge.remedies.colors.join('、')}\nラッキー方位: ${knowledge.remedies.directions.join('、')}\n\n【おすすめアイテム】\n${knowledge.remedies.items.join('、')}\n\n【開運習慣】\n${knowledge.remedies.habits.join('\n')}\n\n【避けるべきこと】\n${knowledge.remedies.avoidances.join('\n')}`;
  }

  // 人生
  if (lowerQuery.includes('人生') || lowerQuery.includes('生き方') || lowerQuery.includes('道')) {
    return `【${knowledge.name}の人生の道】\n${knowledge.essence.lifeDirection}\n\n【精神的な道】\n${knowledge.essence.spiritualPath}\n\n【人生のサイクル】\n青年期: ${knowledge.lifeCycles.youth}\n中年期: ${knowledge.lifeCycles.middle}\n晩年期: ${knowledge.lifeCycles.elder}`;
  }

  // 伝統的教え
  if (lowerQuery.includes('教え') || lowerQuery.includes('格言') || lowerQuery.includes('智慧')) {
    return `【${knowledge.name}の伝統的教え】\n${knowledge.traditionalWisdom.join('\n\n')}`;
  }

  // デフォルト（概要）
  return `【${knowledge.name}について】\n${knowledge.essence.core}\n\n${knowledge.essence.lifeDirection}\n\n詳しく知りたいことがあれば、「仕事」「恋愛」「健康」「金運」「開運法」などのキーワードで質問してください。`;
}
