/**
 * キー変換ユーティリティ
 * - 日本語/英字併記
 * - 相対調（平行調）算出
 * - ♯/♭優先設定
 */

import { Note, Mode, KeyInfo, RelativeKey, Accidental } from '@/types/music';
import { JAPANESE_KEY_NAMES, SEMITONE_MAP } from './constants';

/**
 * キー情報を日本語・英字併記で取得
 *
 * @param root ルート音（例: "C", "C#", "Db"）
 * @param mode モード（major/minor）
 * @returns KeyInfo（日本語名・英字名を含む）
 *
 * @example
 * getKeyInfo("C", "major") // { root: "C", accidental: "", mode: "major", japanese: "ハ長調", english: "C Major" }
 * getKeyInfo("F#", "minor") // { root: "F", accidental: "#", mode: "minor", japanese: "嬰ヘ短調", english: "F# Minor" }
 */
export function getKeyInfo(root: string, mode: Mode): KeyInfo {
  const rootNote = root.charAt(0) as Note;
  const accidental = root.slice(1) as Accidental;

  // 表示用はこれまで通り（大文字M）
  const modeCapitalized = mode.charAt(0).toUpperCase() + mode.slice(1);
  const english = `${root} ${modeCapitalized}`;

  // マップ参照用は小文字で見る（constants.tsが "C major" なので）
  const lookupKey = `${root} ${mode.toLowerCase()}`;
  const japanese = JAPANESE_KEY_NAMES[lookupKey] ?? english;

  return {
    root: rootNote,
    accidental,
    mode,
    japanese,
    english,
  };
}

/**
 * 相対調（平行調）を算出
 * - Major → Minor: -3半音（例: C Major → A minor）
 * - Minor → Major: +3半音（例: A minor → C Major）
 *
 * @param root ルート音
 * @param mode モード
 * @returns RelativeKey（元のキーと相対調のキー情報）
 *
 * @example
 * getRelativeKey("C", "major")
 * // {
 * //   original: { root: "C", accidental: "", mode: "major", japanese: "ハ長調", english: "C Major" },
 * //   relative: { root: "A", accidental: "", mode: "minor", japanese: "イ短調", english: "A Minor" }
 * // }
 */
export function getRelativeKey(root: string, mode: Mode): RelativeKey {
  const original = getKeyInfo(root, mode);

  const semitones = SEMITONE_MAP[root];
  if (semitones === undefined) {
    throw new Error(`Invalid root note: ${root}`);
  }

  // Major → Minor: -3半音、Minor → Major: +3半音
  const offset = mode === 'major' ? -3 : 3;
  const relativeSemitone = (semitones + offset + 12) % 12;

  // 半音値から音名を逆引き（♯優先）
  const relativeRoot = Object.keys(SEMITONE_MAP).find(
    key => SEMITONE_MAP[key] === relativeSemitone && !key.includes('b')
  ) ?? 'C';

  const relativeMode: Mode = mode === 'major' ? 'minor' : 'major';
  const relative = getKeyInfo(relativeRoot, relativeMode);

  return { original, relative };
}

/**
 * ♯/♭優先設定に応じた異名同音変換
 *
 * @param note 音名（例: "C#", "Db"）
 * @param pref 優先設定（"sharp" or "flat"）
 * @returns 変換後の音名
 *
 * @example
 * normalizeAccidental("Db", "sharp") // "C#"
 * normalizeAccidental("C#", "flat")  // "Db"
 * normalizeAccidental("C", "sharp")  // "C"（変化なし）
 */
export function normalizeAccidental(note: string, pref: 'sharp' | 'flat'): string {
  const semitone = SEMITONE_MAP[note];
  if (semitone === undefined) {
    throw new Error(`Invalid note: ${note}`);
  }

  // 同じ半音値を持つすべての音名を取得
  const candidates = Object.keys(SEMITONE_MAP).filter(
    key => SEMITONE_MAP[key] === semitone
  );

  if (candidates.length === 1) {
    // ナチュラル音（C, D, E, F, G, A, B）はそのまま返す
    return candidates[0];
  }

  // ♯優先または♭優先で選択
  if (pref === 'sharp') {
    return candidates.find(c => c.includes('#')) ?? candidates[0];
  } else {
    return candidates.find(c => c.includes('b')) ?? candidates[0];
  }
}

/**
 * 半音数を加算してキーを移調
 *
 * @param root 元のルート音
 * @param semitones 移動する半音数（正または負）
 * @param pref ♯/♭優先設定
 * @returns 移調後のルート音
 *
 * @example
 * transposeKey("C", 2, "sharp")  // "D"
 * transposeKey("C", -2, "flat")  // "Bb"
 * transposeKey("G", 5, "sharp")  // "C"
 */
export function transposeKey(root: string, semitones: number, pref: 'sharp' | 'flat'): string {
  const originalSemitone = SEMITONE_MAP[root];
  if (originalSemitone === undefined) {
    throw new Error(`Invalid root note: ${root}`);
  }

  const newSemitone = (originalSemitone + semitones + 12) % 12;

  // 半音値から音名を逆引き
  const candidates = Object.keys(SEMITONE_MAP).filter(
    key => SEMITONE_MAP[key] === newSemitone
  );

  if (candidates.length === 1) {
    return candidates[0];
  }

  // ♯/♭優先で選択
  if (pref === 'sharp') {
    return candidates.find(c => c.includes('#')) ?? candidates[0];
  } else {
    return candidates.find(c => c.includes('b')) ?? candidates[0];
  }
}
