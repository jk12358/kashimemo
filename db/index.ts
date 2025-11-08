/**
 * SQLiteデータベースアクセスポイント
 */

import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from './migrations';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * データベースインスタンスを取得
 * シングルトンパターンで管理
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}

// SQLite型を再エクスポート
export { SQLite };
