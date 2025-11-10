/**
 * プロジェクトストア
 * - プロジェクト一覧の管理
 * - CRUD操作（作成・読み込み・削除）
 */

import { create } from 'zustand';
import { getDatabase } from '@/db';
import type { Project } from '@/types/database';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  loadProjects: () => Promise<void>;
  createProject: () => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,

  loadProjects: async () => {
    set({ loading: true });
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<Project>(
        'SELECT * FROM projects ORDER BY updated_at DESC'
      );
      set({ projects: rows, loading: false });
    } catch (err) {
      console.error('Failed to load projects', err);
      set({ loading: false });
    }
  },

  createProject: async () => {
    try {
      const db = await getDatabase();
      const now = Date.now();
      await db.runAsync(
        `INSERT INTO projects (title, bpm, key_root, key_mode, time_signature, created_at, updated_at, revision)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['新しい曲', 120, 'C', 'major', '4/4', now, now, 1]
      );
      await get().loadProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  },

  deleteProject: async (id: number) => {
    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM projects WHERE id = ?', [id]);
      await get().loadProjects();
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  },
}));
