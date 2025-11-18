import type {
  Task,
  User,
  StatusPriorityData,
  TagDistributionData,
  VelocityData,
  WorkloadData,
  LeaderboardEntry,
  Timeframe,
} from '@/types';
import { TAG_COLORS } from '@/types';
import { isAfter, isBefore, parseISO, startOfDay, format } from 'date-fns';
import { getDateRange } from './date';

/**
 * Compute task completion rate within a timeframe
 */
export function computeCompletionRate(tasks: Task[], timeframe: Timeframe): number {
  const { start } = getDateRange(timeframe);
  
  const tasksInRange = tasks.filter((task) => {
    const createdDate = parseISO(task.createdAt);
    return isAfter(createdDate, start);
  });

  if (tasksInRange.length === 0) return 0;

  const completedTasks = tasksInRange.filter((task) => task.status === 'done');
  return Math.round((completedTasks.length / tasksInRange.length) * 100);
}

/**
 * Compute on-time completion percentage
 * (Tasks completed before or on their due date)
 */
export function computeOnTimePercentage(tasks: Task[], timeframe: Timeframe): number {
  const { start } = getDateRange(timeframe);
  
  const completedTasksWithDueDate = tasks.filter((task) => {
    if (task.status !== 'done' || !task.dueDate) return false;
    const createdDate = parseISO(task.createdAt);
    return isAfter(createdDate, start);
  });

  if (completedTasksWithDueDate.length === 0) return 0;

  const onTimeTasks = completedTasksWithDueDate.filter((task) => {
    const completedDate = parseISO(task.updatedAt);
    const dueDate = parseISO(task.dueDate!);
    return isBefore(completedDate, dueDate) || startOfDay(completedDate).getTime() === startOfDay(dueDate).getTime();
  });

  return Math.round((onTimeTasks.length / completedTasksWithDueDate.length) * 100);
}

/**
 * Count overdue tasks
 */
export function countOverdue(tasks: Task[]): number {
  const now = startOfDay(new Date());
  
  return tasks.filter((task) => {
    if (task.status === 'done' || !task.dueDate) return false;
    const dueDate = parseISO(task.dueDate);
    return isBefore(dueDate, now);
  }).length;
}

/**
 * Build status and priority matrix for stacked bar chart
 */
export function buildStatusPriorityMatrix(tasks: Task[]): StatusPriorityData[] {
  const statuses = ['todo', 'in_progress', 'in_review', 'done'] as const;
  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
  };

  return statuses.map((status) => {
    const statusTasks = tasks.filter((task) => task.status === status);
    
    return {
      status: statusLabels[status],
      low: statusTasks.filter((task) => task.priority === 'low').length,
      medium: statusTasks.filter((task) => task.priority === 'medium').length,
      high: statusTasks.filter((task) => task.priority === 'high').length,
    };
  });
}

/**
 * Build tag distribution for donut/pie chart
 */
export function buildTagDistribution(tasks: Task[]): TagDistributionData[] {
  const tagCounts: Record<string, number> = {};

  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({
      name: tag,
      value: count,
      fill: TAG_COLORS[tag as keyof typeof TAG_COLORS] || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Build velocity series (created vs completed over time)
 */
export function buildVelocitySeries(tasks: Task[], timeframe: Timeframe): VelocityData[] {
  const { start, end } = getDateRange(timeframe);
  const days: Record<string, { created: number; completed: number }> = {};

  // Initialize all days in the range
  let currentDate = new Date(start);
  while (currentDate <= end) {
    const dateKey = format(currentDate, 'MMM d');
    days[dateKey] = { created: 0, completed: 0 };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Count created tasks
  tasks.forEach((task) => {
    const createdDate = parseISO(task.createdAt);
    if (isAfter(createdDate, start) && isBefore(createdDate, end)) {
      const dateKey = format(createdDate, 'MMM d');
      if (days[dateKey]) {
        days[dateKey].created += 1;
      }
    }

    // Count completed tasks
    if (task.status === 'done') {
      const updatedDate = parseISO(task.updatedAt);
      if (isAfter(updatedDate, start) && isBefore(updatedDate, end)) {
        const dateKey = format(updatedDate, 'MMM d');
        if (days[dateKey]) {
          days[dateKey].completed += 1;
        }
      }
    }
  });

  return Object.entries(days).map(([date, counts]) => ({
    date,
    created: counts.created,
    completed: counts.completed,
  }));
}

/**
 * Build workload distribution by user
 */
export function workloadByUser(tasks: Task[], users: User[]): WorkloadData[] {
  const workload: Record<string, number> = {};

  tasks.forEach((task) => {
    if (task.assigneeId && task.status !== 'done') {
      workload[task.assigneeId] = (workload[task.assigneeId] || 0) + 1;
    }
  });

  return users
    .map((user) => ({
      userId: user.id,
      userName: user.name,
      taskCount: workload[user.id] || 0,
    }))
    .sort((a, b) => b.taskCount - a.taskCount);
}

/**
 * Build leaderboard of completed tasks by user
 */
export function leaderboardCompleted(tasks: Task[], users: User[], timeframe: Timeframe): LeaderboardEntry[] {
  const { start } = getDateRange(timeframe);
  const completedCounts: Record<string, number> = {};

  tasks.forEach((task) => {
    if (task.status === 'done' && task.assigneeId) {
      const updatedDate = parseISO(task.updatedAt);
      if (isAfter(updatedDate, start)) {
        completedCounts[task.assigneeId] = (completedCounts[task.assigneeId] || 0) + 1;
      }
    }
  });

  return users
    .map((user) => ({
      userId: user.id,
      userName: user.name,
      avatar: user.avatar,
      completedCount: completedCounts[user.id] || 0,
    }))
    .sort((a, b) => b.completedCount - a.completedCount);
}

/**
 * Calculate sprint/project progress
 */
export function calculateProgress(tasks: Task[]): { completed: number; total: number; percentage: number } {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'done').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
