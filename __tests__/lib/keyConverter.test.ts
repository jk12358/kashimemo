/**
 * keyConverter ユニットテスト
 */

import {
  getKeyInfo,
  getRelativeKey,
  normalizeAccidental,
  transposeKey,
} from '@/lib/music/keyConverter';

describe('keyConverter', () => {
  describe('getKeyInfo', () => {
    test('C Majorの情報を取得', () => {
      const info = getKeyInfo('C', 'major');
      expect(info.root).toBe('C');
      expect(info.accidental).toBe('');
      expect(info.mode).toBe('major');
      expect(info.japanese).toBe('ハ長調');
      expect(info.english).toBe('C Major');
    });

    test('F# Minorの情報を取得', () => {
      const info = getKeyInfo('F#', 'minor');
      expect(info.root).toBe('F');
      expect(info.accidental).toBe('#');
      expect(info.mode).toBe('minor');
      expect(info.japanese).toBe('嬰ヘ短調');
      expect(info.english).toBe('F# Minor');
    });
  });

  describe('getRelativeKey', () => {
    test('C Major → A minor', () => {
      const { original, relative } = getRelativeKey('C', 'major');
      expect(original.english).toBe('C Major');
      expect(relative.root).toBe('A');
      expect(relative.mode).toBe('minor');
      expect(relative.japanese).toBe('イ短調');
    });

    test('A minor → C Major', () => {
      const { original, relative } = getRelativeKey('A', 'minor');
      expect(original.english).toBe('A Minor');
      expect(relative.root).toBe('C');
      expect(relative.mode).toBe('major');
      expect(relative.japanese).toBe('ハ長調');
    });

    test('G Major → E minor', () => {
      const { relative } = getRelativeKey('G', 'major');
      expect(relative.root).toBe('E');
      expect(relative.mode).toBe('minor');
    });
  });

  describe('normalizeAccidental', () => {
    test('Db → C# (sharp優先)', () => {
      expect(normalizeAccidental('Db', 'sharp')).toBe('C#');
    });

    test('C# → Db (flat優先)', () => {
      expect(normalizeAccidental('C#', 'flat')).toBe('Db');
    });

    test('C → C (ナチュラル音は変化なし)', () => {
      expect(normalizeAccidental('C', 'sharp')).toBe('C');
      expect(normalizeAccidental('C', 'flat')).toBe('C');
    });

    test('F# → Gb (flat優先)', () => {
      expect(normalizeAccidental('F#', 'flat')).toBe('Gb');
    });
  });

  describe('transposeKey', () => {
    test('C + 2半音 = D', () => {
      expect(transposeKey('C', 2, 'sharp')).toBe('D');
    });

    test('C - 2半音 = Bb (flat優先)', () => {
      expect(transposeKey('C', -2, 'flat')).toBe('Bb');
    });

    test('C - 2半音 = A# (sharp優先)', () => {
      expect(transposeKey('C', -2, 'sharp')).toBe('A#');
    });

    test('G + 5半音 = C', () => {
      expect(transposeKey('G', 5, 'sharp')).toBe('C');
    });

    test('C + 12半音 = C (1オクターブ上)', () => {
      expect(transposeKey('C', 12, 'sharp')).toBe('C');
    });
  });
});
