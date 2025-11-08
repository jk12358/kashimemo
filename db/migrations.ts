/**
 * SQLiteマイグレーション管理
 * Expo SDK 54のexpo-sqliteを使用
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'kashimemo.db';

export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // スキーマバージョン管理テーブルを作成
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL
    );
  `);

  // 現在のバージョンを取得
  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version ORDER BY version DESC LIMIT 1'
  );

  const currentVersion = result?.version ?? 0;

  // マイグレーション適用
  if (currentVersion < 1) {
    await applyMigration1(db);
  }

  return db;
}

/**
 * マイグレーション1: 初期スキーマ
 */
async function applyMigration1(db: SQLite.SQLiteDatabase) {
  console.log('🔧 Applying migration 1: Initial schema');

  await db.execAsync(`
    -- プロジェクト管理
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      bpm INTEGER DEFAULT 120,
      key_root TEXT NOT NULL DEFAULT 'C',
      key_mode TEXT NOT NULL DEFAULT 'major',
      time_signature TEXT DEFAULT '4/4',
      global_progression_digits TEXT,
      global_progression_absolute TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1
    );

    -- キー設定
    CREATE TABLE IF NOT EXISTS key_settings (
      project_id INTEGER PRIMARY KEY,
      root TEXT NOT NULL,
      mode TEXT NOT NULL,
      relative_root TEXT,
      relative_mode TEXT,
      accidental_pref TEXT DEFAULT 'sharp',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- セクション
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      archived INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sections_project ON sections(project_id, sort_order);

    -- 歌詞行
    CREATE TABLE IF NOT EXISTS lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active_draft_key TEXT DEFAULT 'A',
      group_id INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_lines_section ON lines(section_id, sort_order);

    -- ドラフト
    CREATE TABLE IF NOT EXISTS drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      line_id INTEGER NOT NULL,
      draft_key TEXT NOT NULL,
      text TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1,
      FOREIGN KEY (line_id) REFERENCES lines(id) ON DELETE CASCADE,
      UNIQUE(line_id, draft_key)
    );

    CREATE INDEX IF NOT EXISTS idx_drafts_line ON drafts(line_id, draft_key);

    -- ブロックドラフト
    CREATE TABLE IF NOT EXISTS block_drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL,
      start_line_id INTEGER NOT NULL,
      end_line_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      text_blob TEXT NOT NULL,
      active INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );

    -- コード進行
    CREATE TABLE IF NOT EXISTS chord_progressions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL,
      notation_type TEXT NOT NULL,
      raw TEXT NOT NULL,
      normalized TEXT,
      display_pair TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_chord_progressions_section ON chord_progressions(section_id);

    -- 概要欄テンプレート
    CREATE TABLE IF NOT EXISTS description_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 概要欄リンク集
    CREATE TABLE IF NOT EXISTS description_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 将来用：音声ノート
    CREATE TABLE IF NOT EXISTS audio_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      line_id INTEGER,
      section_id INTEGER,
      audio_uri TEXT,
      duration_ms INTEGER,
      created_at INTEGER NOT NULL,
      revision INTEGER DEFAULT 1,
      FOREIGN KEY (line_id) REFERENCES lines(id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );

    -- インデックス最適化
    CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
  `);

  // バージョン記録
  const now = Date.now();
  await db.runAsync(
    'INSERT INTO schema_version (version, applied_at) VALUES (?, ?)',
    [1, now]
  );

  console.log('✅ Migration 1 applied successfully');
}
