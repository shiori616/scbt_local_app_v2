import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Button,
  View,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { addLog } from '../src/storage/logStorage';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

export default function LogEntryScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力用ステート (すべて文字列として扱い、保存時に数値変換します)
  const [form, setForm] = useState({
    recordedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    memo: '',
    headacheLevel: '1',
    seizureLevel: '1',
    rightSideLevel: '1',
    leftSideLevel: '1',
    speechImpairmentLevel: '1',
    memoryImpairmentLevel: '1',
    physicalCondition: '100',
    mentalCondition: '100',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
  });

  // 入力値を更新する関数
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 保存処理
  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 数値への変換とバリデーション
      const headache = parseInt(form.headacheLevel) || 1;
      const seizure = parseInt(form.seizureLevel) || 1;
      // ...他の必須項目も同様に変換しますが、今回は簡易的に実装します

      await addLog({
        recordedDate: form.recordedDate,
        memo: form.memo,
        headacheLevel: headache,
        seizureLevel: seizure,
        rightSideLevel: parseInt(form.rightSideLevel) || 1,
        leftSideLevel: parseInt(form.leftSideLevel) || 1,
        speechImpairmentLevel: parseInt(form.speechImpairmentLevel) || 1,
        memoryImpairmentLevel: parseInt(form.memoryImpairmentLevel) || 1,
        physicalCondition: parseInt(form.physicalCondition) || 50,
        mentalCondition: parseInt(form.mentalCondition) || 50,
        bloodPressureSystolic: form.bloodPressureSystolic ? parseInt(form.bloodPressureSystolic) : null,
        bloodPressureDiastolic: form.bloodPressureDiastolic ? parseInt(form.bloodPressureDiastolic) : null,
      });

      Alert.alert('完了', '記録を保存しました', [
        { text: 'OK', onPress: () => router.back() }, // 前の画面に戻る
      ]);
    } catch (e) {
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>新規記録</ThemedText>

          {/* 日付 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>日付 (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={form.recordedDate}
              onChangeText={(t) => handleChange('recordedDate', t)}
              placeholder="2024-01-01"
            />
          </View>

          {/* 体調・気分 (数値入力) */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>体調 (0-200)</Text>
              <TextInput
                style={styles.input}
                value={form.physicalCondition}
                keyboardType="numeric"
                onChangeText={(t) => handleChange('physicalCondition', t)}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>気分 (0-200)</Text>
              <TextInput
                style={styles.input}
                value={form.mentalCondition}
                keyboardType="numeric"
                onChangeText={(t) => handleChange('mentalCondition', t)}
              />
            </View>
          </View>

          {/* 各種レベル (1-5) */}
          <Text style={styles.sectionHeader}>状態レベル (1:良 〜 5:悪)</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>頭痛</Text>
              <TextInput
                style={styles.input}
                value={form.headacheLevel}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(t) => handleChange('headacheLevel', t)}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>発作</Text>
              <TextInput
                style={styles.input}
                value={form.seizureLevel}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(t) => handleChange('seizureLevel', t)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>右半身</Text>
              <TextInput
                style={styles.input}
                value={form.rightSideLevel}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(t) => handleChange('rightSideLevel', t)}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>左半身</Text>
              <TextInput
                style={styles.input}
                value={form.leftSideLevel}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(t) => handleChange('leftSideLevel', t)}
              />
            </View>
          </View>
          
          {/* 血圧 (任意) */}
          <Text style={styles.sectionHeader}>血圧 (任意)</Text>
          <View style={styles.row}>
             <TextInput
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                value={form.bloodPressureSystolic}
                placeholder="上 (収縮期)"
                keyboardType="numeric"
                onChangeText={(t) => handleChange('bloodPressureSystolic', t)}
              />
              <Text style={{ alignSelf: 'center' }}>/</Text>
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                value={form.bloodPressureDiastolic}
                placeholder="下 (拡張期)"
                keyboardType="numeric"
                onChangeText={(t) => handleChange('bloodPressureDiastolic', t)}
              />
          </View>

          {/* メモ */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>メモ</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.memo}
              multiline
              numberOfLines={4}
              onChangeText={(t) => handleChange('memo', t)}
            />
          </View>

          {/* 保存ボタン */}
          <View style={styles.buttonContainer}>
            <Button title="保存する" onPress={handleSave} disabled={isSubmitting} />
          </View>
          
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  formContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 24,
  },
});