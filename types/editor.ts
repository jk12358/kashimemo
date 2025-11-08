/**
 * エディタ状態管理の型定義
 */

import { Section, Line, Draft } from './database';

export interface EditorState {
  projectId: number;
  currentTab: 'lyrics' | 'chords' | 'description';
  selectedSectionId?: number;
  selectedLineId?: number;
  isEditingGlobalProgression: boolean;
}

export interface SectionWithLines extends Section {
  lines: LineWithDrafts[];
}

export interface LineWithDrafts extends Line {
  drafts: Draft[];
  activeDraft?: Draft;
}

export type DraftKey = 'A' | 'B' | 'C';
