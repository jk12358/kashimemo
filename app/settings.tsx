import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * 設定画面（プレースホルダー）
 * TODO: 類義語検索サイト設定、バックアップ/復元機能を実装
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定画面（実装予定）</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>実装予定機能</Text>
        <Text style={styles.description}>
          • 類義語検索サイト設定（Google/Weblio）{'\n'}
          • プロジェクトのエクスポート（JSON）{'\n'}
          • プロジェクトのインポート{'\n'}
          • アプリ設定
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#333' },
  section: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  description: { fontSize: 14, color: '#666', lineHeight: 24 },
});
