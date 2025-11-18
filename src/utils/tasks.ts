import type { Task, Filters, GroupedTasks, Status } from '@/types';

/**
 * Apply filters to tasks
 */
export function applyFilters(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter((task) => {
    // Filter by assignees
    if (filters.assignees.length > 0 && task.assigneeId) {
      if (!filters.assignees.includes(task.assigneeId)) {
        return false;
      }
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      const hasMatchingTag = task.tags.some((tag) => filters.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Filter by priorities
    if (filters.priorities.length > 0) {
      if (!filters.priorities.includes(task.priority)) {
        return false;
      }
    }

    // Filter by search query
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description.toLowerCase().includes(query);
      const tagsMatch = task.tags.some((tag) => tag.toLowerCase().includes(query));
      
      if (!titleMatch && !descMatch && !tagsMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Group tasks by their status
 */
export function groupByStatus(tasks: Task[]): GroupedTasks {
  const grouped: GroupedTasks = {
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  };

  tasks.forEach((task) => {
    grouped[task.status].push(task);
  });

  // Sort each group by order
  Object.keys(grouped).forEach((status) => {
    grouped[status as Status] = sortByOrder(grouped[status as Status]);
  });

  return grouped;
}

/**
 * Sort tasks by their order property
 */
export function sortByOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

/**
 * Compute the next order value when inserting a task at a specific index
 * This ensures proper ordering when drag-and-dropping
 */
export function computeNextOrder(tasks: Task[], targetIndex: number): number {
  if (tasks.length === 0) {
    return 1000; // Default starting order
  }

  if (targetIndex === 0) {
    // Insert at the beginning
    return tasks[0].order - 1000;
  }

  if (targetIndex >= tasks.length) {
    // Insert at the end
    return tasks[tasks.length - 1].order + 1000;
  }

  // Insert between two tasks
  const prevOrder = tasks[targetIndex - 1].order;
  const nextOrder = tasks[targetIndex].order;
  return (prevOrder + nextOrder) / 2;
}

/**
 * Reorder tasks after a drag-and-drop operation
 * Returns updated tasks with new order values
 */
export function reorderTasks(
  tasks: Task[],
  sourceIndex: number,
  destinationIndex: number
): Task[] {
  const result = [...tasks];
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);

  // Recalculate orders
  return result.map((task, index) => ({
    ...task,
    order: (index + 1) * 1000,
  }));
}

/**
 * Get task count by status
 */
export function getTaskCountsByStatus(tasks: Task[]): Record<Status, number> {
  return {
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    in_review: tasks.filter((t) => t.status === 'in_review').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };
}
