export type TaskState = 'esperando' | 'en_curso' | 'hecha';

export interface Task {
  id: string;
  title: string;
  description?: string;
  state: TaskState;
  impact: number; // 1-10
  confidence: number; // 1-10
  effort: number; // 1-10
  iceScore: number; // 0-100
  aiCalculated: boolean;
  createdAt: number; // timestamp
}
