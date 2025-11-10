import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEditorStore } from '@/stores/editorStore';
import { KeyDisplay } from '@/components/editor/KeyDisplay';
import { SectionList } from '@/components/editor/SectionList';
import { LineList } from '@/components/editor/LineList';

type TabType = 'lyrics' | 'chords' | 'description';

/**
 * エディタ画面
 * タブ切り替え（歌詞/コード進行/説明文）
 */
export default function EditorScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { currentProjectId, key, loadProject } = useEditorStore();
  const [activeTab, setActiveTab] = useState<TabType>('lyrics');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (projectId) {
        await loadProject(parseInt(projectId));
        setIsLoading(false);
      }
    };
    load();
  }, [projectId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (!currentProjectId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>プロジェクトが見つかりません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* タブバー */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lyrics' && styles.activeTab]}
          onPress={() => setActiveTab('lyrics')}
        >
          <Text style={[styles.tabText, activeTab === 'lyrics' && styles.activeTabText]}>
            歌詞
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chords' && styles.activeTab]}
          onPress={() => setActiveTab('chords')}
        >
          <Text style={[styles.tabText, activeTab === 'chords' && styles.activeTabText]}>
            コード進行
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'description' && styles.activeTab]}
          onPress={() => setActiveTab('description')}
        >
          <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
            説明文
          </Text>
        </TouchableOpacity>
      </View>

      {/* コンテンツエリア */}
      <ScrollView style={styles.content}>
        {activeTab === 'lyrics' && (
          <View style={styles.tabContent}>
            <KeyDisplay root={key.root} mode={key.mode} />
            <SectionList />
            <LineList />
          </View>
        )}
        {activeTab === 'chords' && (
          <View style={styles.tabContent}>
            <Text style={styles.placeholderText}>コード進行（未実装）</Text>
          </View>
        )}
        {activeTab === 'description' && (
          <View style={styles.tabContent}>
            <Text style={styles.placeholderText}>説明文ビルダー（未実装）</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  content: { flex: 1 },
  tabContent: { padding: 16 },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
});
