import type { Task } from '../../types/task';

export interface IPersistenceAdapter {
  getTasks(): Promise<Task[]>;
  saveTasks(tasks: Task[]): Promise<void>;
  addTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
  getApiKey(): Promise<string | null>;
  saveApiKey(key: string): Promise<void>;
}

export default IPersistenceAdapter;
