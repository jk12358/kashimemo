/**
 * 歌詞行コンポーネント
 * - A/B/Cドラフト切り替え
 * - テキスト編集（デバウンス保存）
 */

import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useEditorStore } from '@/stores/editorStore';
import type { Line, Draft } from '@/types/database';

interface LineRowProps {
  line: Line;
  drafts: Draft[];
}

export function LineRow({ line, drafts }: LineRowProps) {
  const { activeDraftKey, updateDraft } = useEditorStore();

  // 現在のドラフトを取得
  const currentDraft = drafts.find(
    (d) => d.line_id === line.id && d.draft_key === activeDraftKey
  );

  const handleTextChange = (text: string) => {
    updateDraft(line.id, activeDraftKey, text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.lineNumber}>
        <Text style={styles.lineNumberText}>{line.sort_order}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={currentDraft?.text || ''}
        onChangeText={handleTextChange}
        placeholder={`${activeDraftKey}ドラフト`}
        placeholderTextColor="#999"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lineNumber: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    marginRight: 12,
  },
  lineNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 40,
    padding: 0,
  },
});
