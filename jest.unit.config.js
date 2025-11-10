/**
 * ロジックテスト専用Jest設定
 * - Expoランタイムなし
 * - 純粋なTypeScript/JavaScriptのユニットテスト用
 * - 音楽理論ユーティリティなどのロジックテストに使用
 */

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__/lib'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'babel-jest',
      {
        presets: ['babel-preset-expo'],
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/lib/**/*.test.ts'],
};
