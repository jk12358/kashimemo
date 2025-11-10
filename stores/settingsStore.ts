/**
 * 設定ストア
 * - ♯/♭優先設定
 * - その他のグローバル設定
 */

import { create } from 'zustand';

type AccidentalPref = 'sharp' | 'flat';

interface SettingsState {
  accidentalPref: AccidentalPref;
  setAccidentalPref: (pref: AccidentalPref) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  accidentalPref: 'sharp',
  setAccidentalPref: (pref) => set({ accidentalPref: pref }),
}));
