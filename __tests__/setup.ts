/**
 * Jestテストセットアップ
 */

// グローバルモック設定（必要に応じて追加）
global.console = {
  ...console,
  // テスト中のログを抑制（必要に応じてコメントアウト）
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
};
