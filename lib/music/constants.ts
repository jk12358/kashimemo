/**
 * 音楽理論の定数定義
 */

export const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

/**
 * 半音マップ（C=0から始まる）
 */
export const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11,
};

/**
 * 日本語キー名マッピング
 */
export const JAPANESE_KEY_NAMES: Record<string, string> = {
  'C major': 'ハ長調',
  'C minor': 'ハ短調',
  'C# major': '嬰ハ長調',
  'C# minor': '嬰ハ短調',
  'Db major': '変ニ長調',
  'Db minor': '変ニ短調',
  'D major': 'ニ長調',
  'D minor': 'ニ短調',
  'Eb major': '変ホ長調',
  'Eb minor': '変ホ短調',
  'E major': 'ホ長調',
  'E minor': 'ホ短調',
  'F major': 'ヘ長調',
  'F minor': 'ヘ短調',
  'F# major': '嬰ヘ長調',
  'F# minor': '嬰ヘ短調',
  'Gb major': '変ト長調',
  'Gb minor': '変ト短調',
  'G major': 'ト長調',
  'G minor': 'ト短調',
  'Ab major': '変イ長調',
  'Ab minor': '変イ短調',
  'A major': 'イ長調',
  'A minor': 'イ短調',
  'Bb major': '変ロ長調',
  'Bb minor': '変ロ短調',
  'B major': 'ロ長調',
  'B minor': 'ロ短調',
};

/**
 * メジャースケールの音程パターン（半音単位）
 * W-W-H-W-W-W-H
 */
export const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

/**
 * マイナースケールの音程パターン（半音単位）
 * W-H-W-W-H-W-W
 */
export const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
