import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useProjectStore } from '@/stores/projectStore';

/**
 * プロジェクト一覧画面
 */
export default function ProjectListScreen() {
  const router = useRouter();
  const { projects, loading, loadProjects, createProject, deleteProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = (id: number, title: string) => {
    Alert.alert(
      '削除確認',
      `「${title}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteProject(id),
        },
      ]
    );
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="プロジェクトを検索..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectCard}>
            <TouchableOpacity
              style={styles.projectInfo}
              onPress={() => router.push(`/editor/${item.id}`)}
            >
              <Text style={styles.projectTitle}>{item.title}</Text>
              <Text style={styles.projectMeta}>
                {item.key_root} {item.key_mode} | {item.bpm} BPM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProject(item.id, item.title)}
            >
              <Text style={styles.deleteText}>削除</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>プロジェクトがありません</Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={createProject}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  searchInput: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  projectCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  projectInfo: { flex: 1 },
  projectTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 },
  projectMeta: { fontSize: 14, color: '#666' },
  deleteButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, backgroundColor: '#FFCDD2' },
  deleteText: { color: '#C62828', fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 32, fontSize: 16, color: '#999' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: { fontSize: 32, color: '#FFF', fontWeight: '300' },
});
