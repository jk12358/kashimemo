/**
 * ダイアトニックスケールユーティリティ
 * - ダイアトニック音の取得
 * - ピアノ鍵盤ハイライト配列生成
 */

import { Mode, DiatonicScale } from '@/types/music';
import { SEMITONE_MAP, MAJOR_INTERVALS, MINOR_INTERVALS } from './constants';

/**
 * ダイアトニックスケールの音名を取得
 *
 * @param root ルート音（例: "C", "G", "F#"）
 * @param mode モード（major/minor）
 * @returns ダイアトニックスケールの音名配列（7音）
 *
 * @example
 * getDiatonicNotes("C", "major")  // ["C", "D", "E", "F", "G", "A", "B"]
 * getDiatonicNotes("A", "minor")  // ["A", "B", "C", "D", "E", "F", "G"]
 * getDiatonicNotes("G", "major")  // ["G", "A", "B", "C", "D", "E", "F#"]
 */
export function getDiatonicNotes(root: string, mode: Mode): string[] {
  const rootSemitone = SEMITONE_MAP[root];
  if (rootSemitone === undefined) {
    throw new Error(`Invalid root note: ${root}`);
  }

  const intervals = mode === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;

  return intervals.map(interval => {
    const semitone = (rootSemitone + interval) % 12;

    // 半音値から音名を逆引き（♯優先）
    const note = Object.keys(SEMITONE_MAP).find(
      key => SEMITONE_MAP[key] === semitone && !key.includes('b')
    );

    return note ?? 'C';
  });
}

/**
 * ピアノ鍵盤用のハイライト配列を生成
 * 88鍵のピアノで、ダイアトニック音をハイライトするためのboolean配列を返す
 *
 * @param root ルート音
 * @param mode モード
 * @returns boolean配列（88要素、ダイアトニック音がtrueになる）
 *
 * @example
 * getPianoHighlights("C", "major")
 * // [true, false, true, false, true, true, false, true, false, true, false, true, ...]
 * // C(true), C#(false), D(true), D#(false), E(true), F(true), F#(false), ...
 */
export function getPianoHighlights(root: string, mode: Mode): boolean[] {
  const diatonicNotes = getDiatonicNotes(root, mode);
  const diatonicSemitones = diatonicNotes
    .map(note => SEMITONE_MAP[note])
    .filter((s): s is number => s !== undefined);

  // 88鍵ピアノ: A0 (MIDI 21, semitone 9) から C8 (MIDI 108) まで
  const highlights: boolean[] = [];

  for (let i = 0; i < 88; i++) {
    // A0を起点（半音値9）として、各鍵の半音値を計算
    const semitone = (9 + i) % 12;
    highlights.push(diatonicSemitones.includes(semitone));
  }

  return highlights;
}

/**
 * ダイアトニックスケール情報を取得
 *
 * @param root ルート音
 * @param mode モード
 * @returns DiatonicScale（音名配列とハイライト配列）
 *
 * @example
 * getDiatonicScale("C", "major")
 * // {
 * //   notes: ["C", "D", "E", "F", "G", "A", "B"],
 * //   highlighted: [true, false, true, false, true, true, false, ...]
 * // }
 */
export function getDiatonicScale(root: string, mode: Mode): DiatonicScale {
  return {
    notes: getDiatonicNotes(root, mode),
    highlighted: getPianoHighlights(root, mode),
  };
}

/**
 * 指定された鍵盤番号がダイアトニック音かどうかを判定
 *
 * @param keyIndex 鍵盤番号（0〜87）
 * @param root ルート音
 * @param mode モード
 * @returns ダイアトニック音ならtrue
 *
 * @example
 * isDiatonicKey(0, "C", "major")  // true（A0はCメジャースケールに含まれる）
 * isDiatonicKey(1, "C", "major")  // false（A#0/Bb0は含まれない）
 */
export function isDiatonicKey(keyIndex: number, root: string, mode: Mode): boolean {
  if (keyIndex < 0 || keyIndex >= 88) {
    return false;
  }

  const highlights = getPianoHighlights(root, mode);
  return highlights[keyIndex];
}
