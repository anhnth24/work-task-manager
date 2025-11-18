import Dexie, { type EntityTable } from 'dexie';
import type { User, Task, Activity } from '@/types';

/**
 * Database class extending Dexie
 */
export class TaskManagerDB extends Dexie {
  users!: EntityTable<User, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  activities!: EntityTable<Activity, 'id'>;

  constructor() {
    super('TaskManagerDB');
    
    // Define database schema
    this.version(1).stores({
      users: 'id, name, role',
      tasks: 'id, status, priority, assigneeId, dueDate, createdAt, updatedAt, *tags',
      activities: 'id, taskId, userId, timestamp, type',
    });
  }
}

// Create database instance
export const db = new TaskManagerDB();

/**
 * Initialize database with seed data if empty
 */
export async function initializeDB(): Promise<void> {
  const userCount = await db.users.count();
  
  if (userCount === 0) {
    console.log('📊 Initializing database with seed data...');
    // Import seed data dynamically to avoid circular dependencies
    const { seedDatabase } = await import('./seed');
    await seedDatabase();
    console.log('✅ Database initialized successfully');
  } else {
    console.log('📊 Database already initialized');
  }
}

/**
 * Clear all data from database (useful for development/testing)
 */
export async function clearDatabase(): Promise<void> {
  await db.users.clear();
  await db.tasks.clear();
  await db.activities.clear();
  console.log('🗑️  Database cleared');
}

/**
 * Export database statistics
 */
export async function getDatabaseStats() {
  const [userCount, taskCount, activityCount] = await Promise.all([
    db.users.count(),
    db.tasks.count(),
    db.activities.count(),
  ]);

  return {
    users: userCount,
    tasks: taskCount,
    activities: activityCount,
  };
}
