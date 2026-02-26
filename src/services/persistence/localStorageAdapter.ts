import type { IPersistenceAdapter } from './adapter';
import type { Task } from '../../types/task';

const TASKS_KEY = 'tasks';
const APIKEY_KEY = 'gemini_api_key';

function safeParseTasks(raw: string | null): Task[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Task[];
    return [];
  } catch {
    return [];
  }
}

export const localStorageAdapter: IPersistenceAdapter = {
  async getTasks() {
    const raw = localStorage.getItem(TASKS_KEY);
    return safeParseTasks(raw);
  },

  async saveTasks(tasks: Task[]) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  async addTask(task: Task) {
    const tasks = safeParseTasks(localStorage.getItem(TASKS_KEY));
    tasks.push(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  async updateTask(task: Task) {
    const tasks = safeParseTasks(localStorage.getItem(TASKS_KEY));
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = task;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  async deleteTask(id: string) {
    const tasks = safeParseTasks(localStorage.getItem(TASKS_KEY));
    const next = tasks.filter((t) => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(next));
  },

  async getApiKey() {
    return localStorage.getItem(APIKEY_KEY) ?? null;
  },

  async saveApiKey(key: string) {
    localStorage.setItem(APIKEY_KEY, key);
  },
};

export default localStorageAdapter;
