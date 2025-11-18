/**
 * Task status types
 */
export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';

/**
 * Task priority levels
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Available tags for categorizing tasks
 */
export type Tag =
  | 'frontend'
  | 'backend'
  | 'bug'
  | 'feature'
  | 'design'
  | 'testing'
  | 'devops'
  | 'database'
  | 'api'
  | 'ui/ux'
  | 'document';

/**
 * User interface representing team members
 */
export interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

/**
 * Task interface representing a single task/card
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  status: Status;
  priority: Priority;
  tags: Tag[];
  dueDate?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  order: number; // Position within the column
}

/**
 * Activity types for tracking task changes
 */
export type ActivityType = 'create' | 'update' | 'status_change' | 'delete' | 'comment';

/**
 * Activity interface for tracking task history
 */
export interface Activity {
  id: string;
  type: ActivityType;
  taskId: string;
  userId?: string;
  timestamp: string; // ISO date string
  message: string;
}

/**
 * Note interface for sticky notes
 */
export interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Filters interface for filtering tasks
 */
export interface Filters {
  assignees: string[]; // User IDs
  tags: Tag[];
  priorities: Priority[];
  query: string; // Search query
}

/**
 * View mode for the board
 */
export type ViewMode = 'kanban' | 'list';

/**
 * Modal mode for task editing
 */
export type ModalMode = 'create' | 'edit';

/**
 * Modal state interface
 */
export interface ModalState {
  taskId?: string;
  open: boolean;
  mode: ModalMode;
}

/**
 * Timeframe for analytics
 */
export type Timeframe = 7 | 30 | 90;

/**
 * KPI (Key Performance Indicator) interface
 */
export interface KPI {
  label: string;
  value: number | string;
  trend?: number; // Percentage change
  format?: 'number' | 'percentage' | 'count';
}

/**
 * Chart dataset for status and priority matrix
 */
export interface StatusPriorityData {
  status: string;
  low: number;
  medium: number;
  high: number;
}

/**
 * Chart dataset for tag distribution
 */
export interface TagDistributionData {
  name: string;
  value: number;
  fill: string;
}

/**
 * Chart dataset for velocity/time series
 */
export interface VelocityData {
  date: string;
  created: number;
  completed: number;
}

/**
 * Workload data per user
 */
export interface WorkloadData {
  userId: string;
  userName: string;
  taskCount: number;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  completedCount: number;
}

/**
 * Grouped tasks by status
 */
export interface GroupedTasks {
  todo: Task[];
  in_progress: Task[];
  in_review: Task[];
  done: Task[];
}

/**
 * Status configuration with display properties
 */
export interface StatusConfig {
  id: Status;
  label: string;
  color: string;
}

/**
 * Priority configuration with display properties
 */
export interface PriorityConfig {
  id: Priority;
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Status configurations for display
 */
export const STATUS_CONFIG: StatusConfig[] = [
  { id: 'todo', label: 'To Do', color: 'text-gray-600 dark:text-gray-400' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-600 dark:text-blue-400' },
  { id: 'in_review', label: 'In Review', color: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'done', label: 'Done', color: 'text-green-600 dark:text-green-400' },
];

/**
 * Priority configurations for display
 */
export const PRIORITY_CONFIG: PriorityConfig[] = [
  {
    id: 'low',
    label: 'Low',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    id: 'medium',
    label: 'Medium',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    id: 'high',
    label: 'High',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
];

/**
 * All available tags
 */
export const ALL_TAGS: Tag[] = [
  'frontend',
  'backend',
  'bug',
  'feature',
  'design',
  'testing',
  'devops',
  'database',
  'api',
  'ui/ux',
  'document',
];

/**
 * Tag colors for visualization
 */
export const TAG_COLORS: Record<Tag, string> = {
  frontend: '#3b82f6', // blue
  backend: '#8b5cf6', // purple
  bug: '#ef4444', // red
  feature: '#10b981', // green
  design: '#ec4899', // pink
  testing: '#f59e0b', // amber
  devops: '#06b6d4', // cyan
  database: '#6366f1', // indigo
  api: '#14b8a6', // teal
  'ui/ux': '#f97316', // orange
  'document': '#64748b', // slate
};
