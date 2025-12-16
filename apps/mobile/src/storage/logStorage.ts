import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LogRecord } from "../types/log";

const STORAGE_KEY = "seizelog.logs.v1";

/** 全ログ取得 */
export async function loadLogs(): Promise<LogRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LogRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 全ログ保存（上書き） */
export async function saveLogs(logs: LogRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/** 1件追加（新規作成用） */
export async function addLog(
  input: Omit<LogRecord, "id" | "createdAt" | "updatedAt">
): Promise<LogRecord> {
  const now = new Date().toISOString();
  const logs = await loadLogs();

  const nextId =
    logs.length === 0 ? 1 : Math.max(...logs.map((l) => l.id)) + 1;

  const newLog: LogRecord = {
    ...input,
    id: nextId,
    createdAt: now,
    updatedAt: now,
  };

  await saveLogs([newLog, ...logs]);
  return newLog;
}
