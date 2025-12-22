import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LogRecord } from "../types/log";

const STORAGE_KEY = "logs";

async function readAll(): Promise<LogRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LogRecord[];
  } catch {
    return [];
  }
}

async function writeAll(logs: LogRecord[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export async function loadLogs(): Promise<LogRecord[]> {
  const logs = await readAll();
  // 新しい順
  return [...logs].sort((a, b) => (a.recordedDate < b.recordedDate ? 1 : -1));
}

/**
 * recordedDate（YYYY-MM-DD）をキーに上書き保存する
 */
export async function upsertLogByDate(
  recordedDate: string,
  patch: Partial<Omit<LogRecord, "id" | "recordedDate" | "createdAt" | "updatedAt">>
): Promise<LogRecord> {
  const logs = await readAll();
  const now = new Date().toISOString();

  const idx = logs.findIndex((l) => l.recordedDate === recordedDate);

  if (idx >= 0) {
    const current = logs[idx];
    const updated: LogRecord = {
      ...current,
      ...patch,
      updatedAt: now,
    };
    logs[idx] = updated;
    await writeAll(logs);
    return updated;
  }

  // 新規（日付1件目）
  const nextId = logs.reduce((m, l) => Math.max(m, Number(l.id) || 0), 0) + 1;

  // ここで “初期値” を埋める（未入力でも保存できるようにする）
  const created: LogRecord = {
    id: nextId,
    recordedDate,
    memo: patch.memo ?? null,

    headacheLevel: patch.headacheLevel ?? 1,
    seizureLevel: patch.seizureLevel ?? 1,
    rightSideLevel: patch.rightSideLevel ?? 1,
    leftSideLevel: patch.leftSideLevel ?? 1,
    speechImpairmentLevel: patch.speechImpairmentLevel ?? 1,
    memoryImpairmentLevel: patch.memoryImpairmentLevel ?? 1,

    physicalCondition: patch.physicalCondition ?? 100,
    mentalCondition: patch.mentalCondition ?? 100,

    bloodPressureSystolic: patch.bloodPressureSystolic ?? null,
    bloodPressureDiastolic: patch.bloodPressureDiastolic ?? null,

    createdAt: now,
    updatedAt: now,
  };

  logs.push(created);
  await writeAll(logs);
  return created;
}

export async function getLogByDate(recordedDate: string): Promise<LogRecord | null> {
  const logs = await readAll();
  return logs.find((l) => l.recordedDate === recordedDate) ?? null;
}
