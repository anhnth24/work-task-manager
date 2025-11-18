import { create } from 'zustand';
import type { Task, Activity, Status } from '@/types';
import { db } from '@/data/db';

interface TasksState {
  tasks: Task[];
  activities: Activity[];
  
  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Status, newOrder: number) => void;
  
  // Activity actions
  setActivities: (activities: Activity[]) => void;
  recordActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Getters
  getTaskById: (id: string) => Task | undefined;
}

// Database save functions (async)
const saveTasks = async (tasks: Task[]) => {
  await db.tasks.clear();
  await db.tasks.bulkAdd(tasks);
};

const saveActivities = async (activities: Activity[]) => {
  await db.activities.clear();
  await db.activities.bulkAdd(activities);
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  activities: [],

  setTasks: (tasks) => set({ tasks }),

  addTask: (taskData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      order: Date.now(),
    };

    set((state) => {
      const newTasks = [...state.tasks, newTask];
      saveTasks(newTasks); // async save
      return { tasks: newTasks };
    });

    // Record activity
    get().recordActivity({
      type: 'create',
      taskId: newTask.id,
      userId: taskData.assigneeId,
      message: `created task "${newTask.title}"`,
    });
  },

  updateTask: (id, updates) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      saveTasks(newTasks); // async save
      return { tasks: newTasks };
    });

    // Record activity
    const task = get().getTaskById(id);
    if (task) {
      get().recordActivity({
        type: 'update',
        taskId: id,
        userId: task.assigneeId,
        message: `updated task "${task.title}"`,
      });
    }
  },

  deleteTask: (id) => {
    const task = get().getTaskById(id);
    
    set((state) => {
      const newTasks = state.tasks.filter((t) => t.id !== id);
      saveTasks(newTasks); // async save
      return { tasks: newTasks };
    });

    // Record activity
    if (task) {
      get().recordActivity({
        type: 'delete',
        taskId: id,
        userId: task.assigneeId,
        message: `deleted task "${task.title}"`,
      });
    }
  },

  moveTask: (id, newStatus, newOrder) => {
    const task = get().getTaskById(id);
    const statusChanged = task && task.status !== newStatus;

    set((state) => {
      const newTasks = state.tasks.map((t) =>
        t.id === id
          ? { ...t, status: newStatus, order: newOrder, updatedAt: new Date().toISOString() }
          : t
      );
      saveTasks(newTasks); // async save
      return { tasks: newTasks };
    });

    // Record status change activity
    if (statusChanged && task) {
      get().recordActivity({
        type: 'status_change',
        taskId: id,
        userId: task.assigneeId,
        message: `moved task to ${newStatus.replace('_', ' ')}`,
      });
    }
  },

  setActivities: (activities) => set({ activities }),

  recordActivity: (activityData) => {
    const newActivity: Activity = {
      ...activityData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const newActivities = [newActivity, ...state.activities].slice(0, 100); // Keep last 100
      saveActivities(newActivities); // async save
      return { activities: newActivities };
    });
  },

  getTaskById: (id) => get().tasks.find((t) => t.id === id),
}));
