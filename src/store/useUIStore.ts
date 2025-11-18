import { create } from 'zustand';
import type { ModalState } from '@/types';

interface UIState {
  darkMode: boolean;
  taskModal: ModalState;
  deleteConfirm: { open: boolean; taskId?: string };
  
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  openTaskModal: (mode: 'create' | 'edit', taskId?: string) => void;
  closeTaskModal: () => void;
  openDeleteConfirm: (taskId: string) => void;
  closeDeleteConfirm: () => void;
}

// Initialize dark mode from localStorage or default to true
const getInitialDarkMode = (): boolean => {
  const stored = localStorage.getItem('tm_darkMode');
  return stored ? stored === 'true' : true; // Default to dark mode
};

export const useUIStore = create<UIState>((set) => ({
  darkMode: getInitialDarkMode(),
  taskModal: { open: false, mode: 'create' },
  deleteConfirm: { open: false },

  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.darkMode;
      localStorage.setItem('tm_darkMode', String(newMode));
      
      // Apply dark mode class to html element
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { darkMode: newMode };
    }),

  setDarkMode: (dark) => {
    set({ darkMode: dark });
    localStorage.setItem('tm_darkMode', String(dark));
    
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  openTaskModal: (mode, taskId) =>
    set({ taskModal: { open: true, mode, taskId } }),

  closeTaskModal: () =>
    set({ taskModal: { open: false, mode: 'create', taskId: undefined } }),

  openDeleteConfirm: (taskId) =>
    set({ deleteConfirm: { open: true, taskId } }),

  closeDeleteConfirm: () =>
    set({ deleteConfirm: { open: false, taskId: undefined } }),
}));
