import { create } from 'zustand';
import type { Filters, ViewMode, Tag, Priority } from '@/types';

interface FiltersState {
  filters: Filters;
  viewMode: ViewMode;
  
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTag: (tag: Tag) => void;
  togglePriority: (priority: Priority) => void;
  toggleAssignee: (userId: string) => void;
}

const initialFilters: Filters = {
  assignees: [],
  tags: [],
  priorities: [],
  query: '',
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: initialFilters,
  viewMode: 'kanban',

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  setViewMode: (mode) => {
    set({ viewMode: mode });
    localStorage.setItem('tm_viewMode', mode);
  },

  toggleTag: (tag) =>
    set((state) => {
      const tags = state.filters.tags.includes(tag)
        ? state.filters.tags.filter((t) => t !== tag)
        : [...state.filters.tags, tag];
      return { filters: { ...state.filters, tags } };
    }),

  togglePriority: (priority) =>
    set((state) => {
      const priorities = state.filters.priorities.includes(priority)
        ? state.filters.priorities.filter((p) => p !== priority)
        : [...state.filters.priorities, priority];
      return { filters: { ...state.filters, priorities } };
    }),

  toggleAssignee: (userId) =>
    set((state) => {
      const assignees = state.filters.assignees.includes(userId)
        ? state.filters.assignees.filter((id) => id !== userId)
        : [...state.filters.assignees, userId];
      return { filters: { ...state.filters, assignees } };
    }),
}));
