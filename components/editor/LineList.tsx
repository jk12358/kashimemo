/**
 * 歌詞行一覧コンポーネント
 * - 選択されたセクションの行を表示
 * - A/B/Cドラフト切り替え
 * - 行の追加/削除
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useEditorStore } from '@/stores/editorStore';
import { LineRow } from './LineRow';

export function LineList() {
  const {
    lines,
    drafts,
    selectedSectionId,
    activeDraftKey,
    setActiveDraft,
    addLine,
    deleteLine,
  } = useEditorStore();

  // 選択されたセクションの行のみフィルタ
  const sectionLines = lines.filter((line) => line.section_id === selectedSectionId);

  // 各行のドラフトを取得
  const getLineDrafts = (lineId: number) => {
    return drafts.filter((d) => d.line_id === lineId);
  };

  if (!selectedSectionId) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>セクションを選択してください</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ドラフト切り替え */}
      <View style={styles.draftSwitcher}>
        <Text style={styles.label}>ドラフト:</Text>
        {(['A', 'B', 'C'] as const).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.draftButton,
              activeDraftKey === key && styles.activeDraftButton,
            ]}
            onPress={() => setActiveDraft(key)}
          >
            <Text
              style={[
                styles.draftButtonText,
                activeDraftKey === key && styles.activeDraftButtonText,
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 行一覧 */}
      <FlatList
        data={sectionLines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LineRow line={item} drafts={getLineDrafts(item.id)} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>行がありません</Text>
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      {/* 行追加ボタン */}
      <TouchableOpacity
        style={styles.addLineButton}
        onPress={() => addLine(selectedSectionId)}
      >
        <Text style={styles.addLineText}>+ 行を追加</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  draftSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  draftButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeDraftButton: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  draftButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeDraftButtonText: {
    color: '#4CAF50',
  },
  listContent: {
    padding: 12,
  },
  addLineButton: {
    margin: 12,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  addLineText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
