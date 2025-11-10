/**
 * セクション一覧コンポーネント
 * - タップで選択
 * - セクション追加/削除
 * - ドラッグ&ドロップは後日実装
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useEditorStore } from '@/stores/editorStore';
import type { Section } from '@/types/database';

export function SectionList() {
  const { sections, selectedSectionId, setSelectedSection, addSection, deleteSection } = useEditorStore();

  const renderSection = ({ item }: { item: Section }) => {
    const isSelected = item.id === selectedSectionId;

    return (
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={[styles.sectionContent, isSelected && styles.selectedSection]}
          onPress={() => setSelectedSection(item.id)}
        >
          <Text style={[styles.sectionType, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteSection(item.id)}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>セクション</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => addSection('Verse')}>
            <Text style={styles.addButtonText}>+ Verse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => addSection('Hook')}>
            <Text style={styles.addButtonText}>+ Hook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => addSection('Bridge')}>
            <Text style={styles.addButtonText}>+ Bridge</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSection}
        ListEmptyComponent={
          <Text style={styles.emptyText}>セクションがありません</Text>
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSection: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  sectionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedText: {
    color: '#4CAF50',
  },
  deleteButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFCDD2',
    borderRadius: 16,
  },
  deleteText: {
    fontSize: 20,
    color: '#C62828',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 24,
  },
});
