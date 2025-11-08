/**
 * データベーステーブルの型定義
 * SQLiteスキーマに対応
 */

export interface Project {
  id: number;
  title: string;
  bpm: number;
  key_root: string;
  key_mode: 'major' | 'minor';
  time_signature: string;
  global_progression_digits?: string | null;
  global_progression_absolute?: string | null;
  created_at: number;
  updated_at: number;
  revision: number;
}

export interface KeySetting {
  project_id: number;
  root: string;
  mode: 'major' | 'minor';
  relative_root?: string | null;
  relative_mode?: 'major' | 'minor' | null;
  accidental_pref: 'sharp' | 'flat';
}

export interface Section {
  id: number;
  project_id: number;
  name: string;
  sort_order: number;
  archived: 0 | 1;
  created_at: number;
  updated_at: number;
  revision: number;
}

export interface Line {
  id: number;
  section_id: number;
  sort_order: number;
  active_draft_key: 'A' | 'B' | 'C';
  group_id?: number | null;
  created_at: number;
  updated_at: number;
  revision: number;
}

export interface Draft {
  id: number;
  line_id: number;
  draft_key: 'A' | 'B' | 'C';
  text: string;
  created_at: number;
  updated_at: number;
  revision: number;
}

export interface BlockDraft {
  id: number;
  section_id: number;
  start_line_id: number;
  end_line_id: number;
  label: 'A' | 'B' | 'C';
  text_blob: string;
  active: 0 | 1;
  created_at: number;
  updated_at: number;
  revision: number;
}

export interface ChordProgression {
  id: number;
  section_id: number;
  notation_type: 'degree' | 'absolute' | 'digits';
  raw: string;
  normalized?: string | null;
  display_pair?: string | null; // JSON形式
  created_at: number;
  updated_at: number;
  revision: number;
}

export interface DescriptionTemplate {
  id: number;
  project_id: number;
  name: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export interface DescriptionLink {
  id: number;
  project_id: number;
  label: string;
  url: string;
  sort_order: number;
  created_at: number;
}

export interface AudioNote {
  id: number;
  line_id?: number | null;
  section_id?: number | null;
  audio_uri?: string | null;
  duration_ms?: number | null;
  created_at: number;
  revision: number;
}
