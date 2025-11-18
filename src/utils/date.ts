import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  parseISO,
  startOfDay,
  sub,
  addDays,
} from 'date-fns';

/**
 * Format a date string or Date object to a readable format
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Check if a task is overdue
 */
export function isOverdue(dueDate: string | undefined | null): boolean {
  if (!dueDate) return false;
  const due = parseISO(dueDate);
  const now = startOfDay(new Date());
  return isBefore(due, now);
}

/**
 * Check if a task is due soon (within the next 3 days)
 */
export function isDueSoon(dueDate: string | undefined | null): boolean {
  if (!dueDate) return false;
  const due = parseISO(dueDate);
  const threeDaysFromNow = addDays(startOfDay(new Date()), 3);
  const now = startOfDay(new Date());
  return isAfter(due, now) && isBefore(due, threeDaysFromNow);
}

/**
 * Check if date is today
 */
export function isDateToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
}

/**
 * Check if date is tomorrow
 */
export function isDateTomorrow(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isTomorrow(dateObj);
}

/**
 * Convert Date to ISO date string (YYYY-MM-DD)
 */
export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get date range from X days ago to now
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = sub(end, { days });
  return { start, end };
}

/**
 * Group dates by relative time periods
 */
export function groupDateByPeriod(date: string): 'overdue' | 'today' | 'tomorrow' | 'next_7_days' | 'later' {
  const dateObj = parseISO(date);
  const now = startOfDay(new Date());

  if (isBefore(dateObj, now)) {
    return 'overdue';
  }

  if (isToday(dateObj)) {
    return 'today';
  }

  if (isTomorrow(dateObj)) {
    return 'tomorrow';
  }

  const sevenDaysFromNow = addDays(now, 7);
  if (isBefore(dateObj, sevenDaysFromNow)) {
    return 'next_7_days';
  }

  return 'later';
}
