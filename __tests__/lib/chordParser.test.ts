/**
 * chordParser ユニットテスト
 */

import {
  degreeToAbsolute,
  absoluteToDegree,
  digitsToDegree,
  degreeToDigits,
  parseChordProgression,
  transposeChords,
} from '@/lib/music/chordParser';

describe('chordParser', () => {
  describe('degreeToAbsolute', () => {
    test('I-V-vi-IV in C Major → C-G-Am-F', () => {
      expect(degreeToAbsolute('I-V-vi-IV', 'C', 'major')).toBe('C-G-A-F');
    });

    test('i-VII-VI-V in A Minor → Am-G-F-E', () => {
      expect(degreeToAbsolute('i-VII-VI-V', 'A', 'minor')).toBe('A-G-F-E');
    });

    test('ii-V-I in C Major → Dm-G-C', () => {
      expect(degreeToAbsolute('ii-V-I', 'C', 'major')).toBe('D-G-C');
    });
  });

  describe('absoluteToDegree', () => {
    test('C-G-Am-F in C Major → I-V-vi-IV', () => {
      const result = absoluteToDegree('C-G-Am-F', 'C', 'major');
      expect(result).toContain('I');
      expect(result).toContain('V');
      expect(result).toContain('vi');
      expect(result).toContain('IV');
    });

    test('Dm-G-C in C Major → ii-V-I', () => {
      const result = absoluteToDegree('Dm-G-C', 'C', 'major');
      expect(result).toContain('ii');
      expect(result).toContain('V');
      expect(result).toContain('I');
    });
  });

  describe('digitsToDegree', () => {
    test('4536 in Major → IV-V-iii-vi', () => {
      expect(digitsToDegree('4536', 'major')).toBe('IV-V-iii-vi');
    });

    test('1564 in Major → I-V-vi-IV', () => {
      expect(digitsToDegree('1564', 'major')).toBe('I-V-vi-IV');
    });

    test('1451 in Minor → i-iv-v-i', () => {
      expect(digitsToDegree('1451', 'minor')).toBe('i-iv-v-i');
    });
  });

  describe('degreeToDigits', () => {
    test('IV-V-iii-vi → 4536', () => {
      expect(degreeToDigits('IV-V-iii-vi', 'major')).toBe('4536');
    });

    test('I-V-vi-IV → 1564', () => {
      expect(degreeToDigits('I-V-vi-IV', 'major')).toBe('1564');
    });

    test('i-iv-v-i → 1451', () => {
      expect(degreeToDigits('i-iv-v-i', 'minor')).toBe('1451');
    });
  });

  describe('parseChordProgression', () => {
    test('digitsからの変換: 1564 in C Major', () => {
      const result = parseChordProgression('1564', 'digits', 'C', 'major');
      expect(result.digits).toBe('1564');
      expect(result.degree).toBe('I-V-vi-IV');
      expect(result.absolute).toContain('C');
      expect(result.absolute).toContain('G');
      expect(result.absolute).toContain('A');
      expect(result.absolute).toContain('F');
    });

    test('absoluteからの変換: C-G-Am-F in C Major', () => {
      const result = parseChordProgression('C-G-Am-F', 'absolute', 'C', 'major');
      expect(result.absolute).toBe('C-G-Am-F');
      expect(result.degree).toContain('I');
      expect(result.degree).toContain('V');
    });

    test('degreeからの変換: I-V-vi-IV in G Major', () => {
      const result = parseChordProgression('I-V-vi-IV', 'degree', 'G', 'major');
      expect(result.degree).toBe('I-V-vi-IV');
      expect(result.absolute).toContain('G');
      expect(result.absolute).toContain('D');
    });
  });

  describe('transposeChords', () => {
    test('C-G-Am-F を C → D に移調', () => {
      const result = transposeChords('C-G-Am-F', 'C', 'D');
      expect(result).toContain('D');
      expect(result).toContain('A');
    });

    test('C-G-Am-F を C → G に移調', () => {
      const result = transposeChords('C-G-Am-F', 'C', 'G');
      expect(result).toContain('G');
      expect(result).toContain('D');
    });

    test('同じキーへの移調は変化なし', () => {
      const result = transposeChords('C-G-Am-F', 'C', 'C');
      expect(result).toBe('C-G-A-F');
    });
  });
});
