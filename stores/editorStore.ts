/**
 * エディタストア
 * - プロジェクト編集中のデータ管理
 * - デバウンス付き自動保存（500ms）
 */

import { create } from 'zustand';
import { getDatabase } from '@/db';
import { debounce } from '@/utils/debounce';
import type { Mode } from '@/types/music';
import type { Section, Line, Draft } from '@/types/database';

interface KeySettings {
  root: string;
  mode: Mode;
}

interface EditorState {
  // 基本状態
  currentProjectId: number | null;
  key: KeySettings;
  sections: Section[];
  lines: Line[];
  drafts: Draft[];
  selectedSectionId: number | null;
  selectedLineId: number | null;
  activeDraftKey: 'A' | 'B' | 'C';

  // プロジェクト読み込み
  loadProject: (projectId: number) => Promise<void>;

  // キー設定
  setKey: (root: string, mode: Mode) => Promise<void>;

  // ドラフト操作
  setActiveDraft: (key: 'A' | 'B' | 'C') => void;
  updateDraft: (lineId: number, draftKey: 'A' | 'B' | 'C', text: string) => void;

  // 選択状態
  setSelectedSection: (sectionId: number | null) => void;
  setSelectedLine: (lineId: number | null) => void;

  // セクション操作
  addSection: (type: string) => Promise<void>;
  deleteSection: (sectionId: number) => Promise<void>;

  // 行操作
  addLine: (sectionId: number) => Promise<void>;
  deleteLine: (lineId: number) => Promise<void>;
}

// デバウンス付きDB保存関数（500ms）
const saveDraftToDb = debounce(async (lineId: number, draftKey: string, text: string) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE drafts SET text = ?, updated_at = ? WHERE line_id = ? AND draft_key = ?`,
      [text, Date.now(), lineId, draftKey]
    );
  } catch (err) {
    console.error('Failed to save draft', err);
  }
}, 500);

export const useEditorStore = create<EditorState>((set, get) => ({
  currentProjectId: null,
  key: { root: 'C', mode: 'major' },
  sections: [],
  lines: [],
  drafts: [],
  selectedSectionId: null,
  selectedLineId: null,
  activeDraftKey: 'A',

  loadProject: async (projectId: number) => {
    try {
      const db = await getDatabase();

      // キー設定読み込み
      const keySettings = await db.getFirstAsync<{ key_root: string; key_mode: Mode }>(
        'SELECT key_root, key_mode FROM projects WHERE id = ?',
        [projectId]
      );

      // セクション読み込み
      const sections = await db.getAllAsync<Section>(
        'SELECT * FROM sections WHERE project_id = ? ORDER BY sort_order',
        [projectId]
      );

      // 行読み込み
      const lines = await db.getAllAsync<Line>(
        'SELECT * FROM lines WHERE section_id IN (SELECT id FROM sections WHERE project_id = ?) ORDER BY sort_order',
        [projectId]
      );

      // ドラフト読み込み
      const drafts = await db.getAllAsync<Draft>(
        'SELECT * FROM drafts WHERE line_id IN (SELECT id FROM lines WHERE section_id IN (SELECT id FROM sections WHERE project_id = ?))',
        [projectId]
      );

      set({
        currentProjectId: projectId,
        key: keySettings ? { root: keySettings.key_root, mode: keySettings.key_mode } : { root: 'C', mode: 'major' },
        sections,
        lines,
        drafts,
      });
    } catch (err) {
      console.error('Failed to load project', err);
    }
  },

  setKey: async (root: string, mode: Mode) => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    set({ key: { root, mode } });

    try {
      const db = await getDatabase();
      await db.runAsync(
        'UPDATE projects SET key_root = ?, key_mode = ?, updated_at = ? WHERE id = ?',
        [root, mode, Date.now(), currentProjectId]
      );
    } catch (err) {
      console.error('Failed to update key', err);
    }
  },

  setActiveDraft: (key) => {
    set({ activeDraftKey: key });
  },

  updateDraft: (lineId, draftKey, text) => {
    // メモリ上の状態を即座に更新
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.line_id === lineId && d.draft_key === draftKey
          ? { ...d, text, updated_at: Date.now() }
          : d
      ),
    }));

    // DB保存はデバウンス
    saveDraftToDb(lineId, draftKey, text);
  },

  setSelectedSection: (sectionId) => {
    set({ selectedSectionId: sectionId });
  },

  setSelectedLine: (lineId) => {
    set({ selectedLineId: lineId });
  },

  addSection: async (type) => {
    const { currentProjectId, sections } = get();
    if (!currentProjectId) return;

    try {
      const db = await getDatabase();
      const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sort_order)) : 0;

      await db.runAsync(
        `INSERT INTO sections (project_id, name, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [currentProjectId, type, maxOrder + 1, Date.now(), Date.now()]
      );

      // リロード
      await get().loadProject(currentProjectId);
    } catch (err) {
      console.error('Failed to add section', err);
    }
  },

  deleteSection: async (sectionId) => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM sections WHERE id = ?', [sectionId]);

      // リロード
      await get().loadProject(currentProjectId);
    } catch (err) {
      console.error('Failed to delete section', err);
    }
  },

  addLine: async (sectionId) => {
    const { currentProjectId, lines } = get();
    if (!currentProjectId) return;

    try {
      const db = await getDatabase();
      const sectionLines = lines.filter(l => l.section_id === sectionId);
      const maxSortOrder = sectionLines.length > 0 ? Math.max(...sectionLines.map(l => l.sort_order)) : 0;

      const result = await db.runAsync(
        `INSERT INTO lines (section_id, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?)`,
        [sectionId, maxSortOrder + 1, Date.now(), Date.now()]
      );

      const lineId = result.lastInsertRowId;

      // A/B/Cドラフトを自動作成
      await db.runAsync(
        `INSERT INTO drafts (line_id, draft_key, text, created_at, updated_at)
         VALUES (?, 'A', '', ?, ?), (?, 'B', '', ?, ?), (?, 'C', '', ?, ?)`,
        [lineId, Date.now(), Date.now(), lineId, Date.now(), Date.now(), lineId, Date.now(), Date.now()]
      );

      // リロード
      await get().loadProject(currentProjectId);
    } catch (err) {
      console.error('Failed to add line', err);
    }
  },

  deleteLine: async (lineId) => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM lines WHERE id = ?', [lineId]);

      // リロード
      await get().loadProject(currentProjectId);
    } catch (err) {
      console.error('Failed to delete line', err);
    }
  },
}));
