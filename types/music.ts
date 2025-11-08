/**
 * 音楽理論関連の型定義
 */

export type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '' | '#' | 'b';
export type Mode = 'major' | 'minor';

export interface KeyInfo {
  root: Note;
  accidental: Accidental;
  mode: Mode;
  japanese: string;      // "ハ長調"
  english: string;       // "C Major"
}

export interface RelativeKey {
  original: KeyInfo;
  relative: KeyInfo;
}

export interface DiatonicScale {
  notes: string[];       // ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  highlighted: boolean[]; // 鍵盤用
}

export interface ChordNotation {
  degree?: string;   // "I-V-vi-IV"
  absolute?: string; // "C-G-Am-F"
  digits?: string;   // "1564"
}

export interface GlobalProgression {
  digits: string;
  absolute: string;
}
