/**
 * diatonicScale ユニットテスト
 */

import {
  getDiatonicNotes,
  getPianoHighlights,
  getDiatonicScale,
  isDiatonicKey,
} from '@/lib/music/diatonicScale';

describe('diatonicScale', () => {
  describe('getDiatonicNotes', () => {
    test('C Majorのダイアトニック音', () => {
      const notes = getDiatonicNotes('C', 'major');
      expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    test('A Minorのダイアトニック音', () => {
      const notes = getDiatonicNotes('A', 'minor');
      expect(notes).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    test('G Majorのダイアトニック音', () => {
      const notes = getDiatonicNotes('G', 'major');
      expect(notes).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
    });

    test('D Majorのダイアトニック音', () => {
      const notes = getDiatonicNotes('D', 'major');
      expect(notes).toEqual(['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
    });
  });

  describe('getPianoHighlights', () => {
    test('C Majorのハイライトは88要素', () => {
      const highlights = getPianoHighlights('C', 'major');
      expect(highlights).toHaveLength(88);
    });

    test('C Majorの最初の12音（A0からG#0/Ab0）', () => {
      const highlights = getPianoHighlights('C', 'major');
      // A0, A#0, B0, C1, C#1, D1, D#1, E1, F1, F#1, G1, G#1
      // A, -, B, C, -, D, -, E, F, -, G, -
      const first12 = highlights.slice(0, 12);
      expect(first12).toEqual([
        true, false, true, true, false, true, false, true, true, false, true, false
      ]);
    });

    test('A Minorのハイライトも88要素', () => {
      const highlights = getPianoHighlights('A', 'minor');
      expect(highlights).toHaveLength(88);
    });
  });

  describe('getDiatonicScale', () => {
    test('C Majorの完全な情報を取得', () => {
      const scale = getDiatonicScale('C', 'major');
      expect(scale.notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
      expect(scale.highlighted).toHaveLength(88);
    });
  });

  describe('isDiatonicKey', () => {
    test('C Majorで鍵盤0（A0）はダイアトニック音', () => {
      expect(isDiatonicKey(0, 'C', 'major')).toBe(true);
    });

    test('C Majorで鍵盤1（A#0/Bb0）はダイアトニック音でない', () => {
      expect(isDiatonicKey(1, 'C', 'major')).toBe(false);
    });

    test('範囲外の鍵盤番号はfalse', () => {
      expect(isDiatonicKey(-1, 'C', 'major')).toBe(false);
      expect(isDiatonicKey(88, 'C', 'major')).toBe(false);
    });
  });
});
