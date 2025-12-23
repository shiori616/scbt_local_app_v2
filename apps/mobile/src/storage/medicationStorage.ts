// src/storage/medicationStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MedicationRecord } from "../types/medication";

const STORAGE_KEY = "medications";

async function readAll(): Promise<MedicationRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MedicationRecord[];
  } catch {
    return [];
  }
}

async function writeAll(items: MedicationRecord[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function loadMedications(): Promise<MedicationRecord[]> {
  const items = await readAll();
  // 新しい順
  return [...items].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function addMedication(
  input: Omit<MedicationRecord, "id" | "createdAt" | "updatedAt">
): Promise<MedicationRecord> {
  const items = await readAll();
  const now = new Date().toISOString();
  const nextId = items.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;

  const created: MedicationRecord = {
    id: nextId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  items.push(created);
  await writeAll(items);
  return created;
}

export async function updateMedication(
  id: number,
  patch: Partial<Omit<MedicationRecord, "id" | "createdAt">>
): Promise<MedicationRecord | null> {
  const items = await readAll();
  const idx = items.findIndex((x) => x.id === id);
  if (idx < 0) return null;

  const now = new Date().toISOString();
  const updated: MedicationRecord = {
    ...items[idx],
    ...patch,
    updatedAt: now,
  };

  items[idx] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteMedication(id: number): Promise<void> {
  const items = await readAll();
  const filtered = items.filter((x) => x.id !== id);
  await writeAll(filtered);
}

export async function getMedicationById(id: number): Promise<MedicationRecord | null> {
  const items = await readAll();
  return items.find((x) => x.id === id) ?? null;
}
