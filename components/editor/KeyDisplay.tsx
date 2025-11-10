/**
 * キー情報表示コンポーネント
 * - 日本語/英字表記
 * - 相対調（平行調）表示
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getKeyInfo, getRelativeKey } from '@/lib/music/keyConverter';
import type { Mode } from '@/types/music';

interface KeyDisplayProps {
  root: string;
  mode: Mode;
}

export function KeyDisplay({ root, mode }: KeyDisplayProps) {
  const keyInfo = getKeyInfo(root, mode);
  const { relative } = getRelativeKey(root, mode);

  return (
    <View style={styles.container}>
      {/* メインキー */}
      <View style={styles.mainKey}>
        <Text style={styles.japaneseKey}>{keyInfo.japanese}</Text>
        <Text style={styles.englishKey}>{keyInfo.english}</Text>
      </View>

      {/* 相対調 */}
      <View style={styles.relativeKey}>
        <Text style={styles.relativeLabel}>相対調:</Text>
        <Text style={styles.relativeValue}>
          {relative.japanese} ({relative.english})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mainKey: {
    marginBottom: 8,
  },
  japaneseKey: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  englishKey: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  relativeKey: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  relativeLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  relativeValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
