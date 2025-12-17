import { StyleSheet, View, Text, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useState, useCallback } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import { loadLogs } from '../../src/storage/logStorage';
import type { LogRecord } from '../../src/types/log';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// 表示するカラムの定義
const COLUMNS = [
  { key: 'id', title: 'ID', width: 40 },
  { key: 'recordedDate', title: '日付', width: 100 },
  { key: 'headacheLevel', title: '頭痛', width: 60 },
  { key: 'seizureLevel', title: '発作', width: 60 },
  { key: 'rightSideLevel', title: '右半身', width: 70 },
  { key: 'leftSideLevel', title: '左半身', width: 70 },
  { key: 'speechImpairmentLevel', title: '言語', width: 60 },
  { key: 'memoryImpairmentLevel', title: '記憶', width: 60 },
  { key: 'physicalCondition', title: '体調', width: 60 },
  { key: 'mentalCondition', title: '気分', width: 60 },
  { key: 'bloodPressureSystolic', title: '血圧(上)', width: 70 },
  { key: 'bloodPressureDiastolic', title: '血圧(下)', width: 70 },
  { key: 'memo', title: 'メモ', width: 200 },
];

export default function HomeScreen() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 画面が表示されるたびにデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const data = await loadLogs();
        setLogs(data);
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ここにボタンとタイトルを表示しています */}
      <View style={styles.headerContainer}>
        <ThemedText type="title">記録一覧</ThemedText>
        <Link href="/_test" style={styles.linkButton}>
          <Text style={styles.linkText}>テスト画面へ（データ追加）</Text>
        </Link>
      </View>

      {logs.length === 0 ? (
        <View style={styles.centerContainer}>
          <ThemedText>データがありません</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.verticalScroll}>
          <ScrollView horizontal style={styles.horizontalScroll}>
            <View>
              {/* テーブルヘッダー */}
              <View style={styles.tableHeader}>
                {COLUMNS.map((col) => (
                  <View key={col.key} style={[styles.cell, { width: col.width }]}>
                    <Text style={styles.headerText}>{col.title}</Text>
                  </View>
                ))}
              </View>

              {/* データ行 */}
              {logs.map((log) => (
                <View key={log.id} style={styles.tableRow}>
                  {COLUMNS.map((col) => (
                    <View key={col.key} style={[styles.cell, { width: col.width }]}>
                      <Text style={styles.cellText}>
                        {/* データの値を取り出して表示（nullの場合はハイフン） */}
                        {/* @ts-ignore: インデックスアクセス用 */}
                        {log[col.key] ?? '-'}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalScroll: {
    flex: 1,
  },
  horizontalScroll: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  linkButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});