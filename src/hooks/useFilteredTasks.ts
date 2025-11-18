import { useMemo } from 'react';
import { useTasksStore } from '@/store/useTasksStore';
import { useFiltersStore } from '@/store/useFiltersStore';
import { applyFilters } from '@/utils/tasks';

export function useFilteredTasks() {
  const tasks = useTasksStore((state) => state.tasks);
  const filters = useFiltersStore((state) => state.filters);

  const filteredTasks = useMemo(() => {
    return applyFilters(tasks, filters);
  }, [tasks, filters]);

  return filteredTasks;
}
