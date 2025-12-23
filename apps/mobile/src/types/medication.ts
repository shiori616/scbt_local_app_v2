// src/types/medication.ts

export const MedicationNames = ["フィコンパ", "レベチラセタム", "テモゾロミド"] as const;
export type MedicationName = (typeof MedicationNames)[number];

export const DosageUnits = ["mg", "g", "mL", "錠", "カプセル"] as const;
export type DosageUnit = (typeof DosageUnits)[number];

export const MedicationTimings = [
  "朝食前",
  "朝食後",
  "昼食前",
  "昼食後",
  "夕食前",
  "夕食後",
  "就寝前",
  "食間",
] as const;
export type MedicationTiming = (typeof MedicationTimings)[number];

/**
 * 服用薬レコード
 * - startAt / endAt は ISO 文字列で保存（例: "2025-12-23" または "2025-12-23T08:00:00.000Z"）
 * - endAt は未設定可（服用中の場合）
 */
export type MedicationRecord = {
  id: number; // ローカル採番
  medicationName: MedicationName;

  dosageValue: number;
  dosageUnit: DosageUnit;

  timing: MedicationTiming;

  startAt: string;
  endAt: string | null;

  createdAt: string;
  updatedAt: string;
};
