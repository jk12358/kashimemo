import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getDatabase } from '@/db';
import { Project } from '@/types/database';

/**
 * エディタ画面（プレースホルダー）
 * TODO: タブ切替、セクション管理、ドラフト切替などを実装
 */
export default function EditorScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync<Project>(
        'SELECT * FROM projects WHERE id = ?',
        [parseInt(projectId)]
      );
      setProject(result ?? null);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text>プロジェクトが見つかりません</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.keyInfo}>
          {project.key_root} {project.key_mode} | {project.bpm} BPM
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>
          エディタ画面（実装予定）
        </Text>
        <Text style={styles.description}>
          • タブ切替（歌詞/コード/概要欄）{'\n'}
          • セクション管理{'\n'}
          • A/B/C ドラフト切替{'\n'}
          • グローバル進行表示{'\n'}
          • ピアノ鍵盤ハイライト
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 8 },
  keyInfo: { fontSize: 16, color: '#666' },
  content: { padding: 16 },
  placeholder: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 16 },
  description: { fontSize: 14, color: '#666', lineHeight: 24 },
});
