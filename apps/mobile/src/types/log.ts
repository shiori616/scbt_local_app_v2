// apps/mobile/src/types/log.ts

export type LogRecord = {
    id: number; // INTEGER AUTOINCREMENT
  
    recordedDate: string; // YYYY-MM-DD
    memo?: string | null;
  
    headacheLevel: number; // 1-5
    seizureLevel: number; // 1-5
    rightSideLevel: number; // 1-5
    leftSideLevel: number; // 1-5
    speechImpairmentLevel: number; // 1-5
    memoryImpairmentLevel: number; // 1-5
  
    physicalCondition: number; // 1-200
    mentalCondition: number; // 1-200
  
    bloodPressureSystolic?: number | null;
    bloodPressureDiastolic?: number | null;
  
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  };
  