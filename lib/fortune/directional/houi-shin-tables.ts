export const TOSHITOKU_BY_TENKAN: Record<string, string> = {
  甲: '寅',
  己: '寅',
  乙: '申',
  庚: '申',
  丙: '巳',
  辛: '巳',
  丁: '亥',
  壬: '亥',
  戊: '巳',
  癸: '巳',
};

export const SAIROKU_BY_TENKAN: Record<string, string> = {
  甲: '寅',
  乙: '卯',
  丙: '巳',
  丁: '午',
  戊: '巳',
  己: '午',
  庚: '申',
  辛: '酉',
  壬: '亥',
  癸: '子',
};

export const DAISHOGUN_BY_ETO_GROUP: Record<string, '北' | '東' | '南' | '西'> = {
  寅: '北',
  卯: '北',
  辰: '北',
  巳: '東',
  午: '東',
  未: '東',
  申: '南',
  酉: '南',
  戌: '南',
  亥: '西',
  子: '西',
  丑: '西',
};

export const OUBAN_BY_ETO: Record<string, string> = {
  申: '辰',
  子: '辰',
  辰: '辰',
  寅: '戌',
  午: '戌',
  戌: '戌',
  亥: '未',
  卯: '未',
  未: '未',
  巳: '丑',
  酉: '丑',
  丑: '丑',
};

// 仕様 §6.5.6 の「太歳の反対の手前2つ」を、8方位に落とし込むための代表十二支。
export const TAIIN_BY_ETO: Record<string, string> = {
  子: '申',
  丑: '酉',
  寅: '戌',
  卯: '亥',
  辰: '子',
  巳: '丑',
  午: '寅',
  未: '卯',
  申: '辰',
  酉: '巳',
  戌: '午',
  亥: '未',
};

export const SAIKEI_BY_ETO: Record<string, string> = {
  子: '卯',
  丑: '戌',
  寅: '巳',
  卯: '子',
  辰: '辰',
  巳: '申',
  午: '午',
  未: '丑',
  申: '寅',
  酉: '酉',
  戌: '未',
  亥: '亥',
};

// §6.5 の三合の殺方位。2026年（寅午戌グループ）は丑=北東。
export const SAISATSU_BY_ETO: Record<string, string> = {
  申: '未',
  子: '未',
  辰: '未',
  寅: '丑',
  午: '丑',
  戌: '丑',
  亥: '戌',
  卯: '戌',
  未: '戌',
  巳: '辰',
  酉: '辰',
  丑: '辰',
};
