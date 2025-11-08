import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

/**
 * ルートレイアウト
 * - GestureHandlerRootViewでラップ（ドラッグ&ドロップ用）
 * - 将来的にDB初期化・ストア初期化を追加
 */
export default function RootLayout() {
  useEffect(() => {
    // TODO: データベース初期化
    // TODO: ストア初期化
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'プロジェクト一覧' }}
        />
        <Stack.Screen
          name="editor/[projectId]"
          options={{ title: 'エディタ', headerBackTitle: '戻る' }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: '設定' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
