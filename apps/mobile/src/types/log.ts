export type Level1to5 = 1 | 2 | 3 | 4 | 5;

export type LogRecord = {
  id: number; // 端末内での連番（AsyncStorage用）
  recordedDate: string; // YYYY-MM-DD（ユニークキー扱い）

  headacheLevel: Level1to5; // default 5
  seizureLevel: Level1to5; // default 5
  rightSideLevel: Level1to5; // default 5
  leftSideLevel: Level1to5; // default 5
  speechImpairmentLevel: Level1to5; // default 5
  memoryImpairmentLevel: Level1to5; // default 5

  physicalCondition: number; // 0-200 default 100
  mentalCondition: number; // 0-200 default 100

  bloodPressureSystolic: number | null; // 未入力可
  bloodPressureDiastolic: number | null; // 未入力可

  memo: string | null; // 未入力可（長文OK）

  createdAt: string; // ISO
  updatedAt: string; // ISO
};
