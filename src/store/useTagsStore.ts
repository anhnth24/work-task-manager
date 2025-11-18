import { create } from 'zustand';
import { generateId } from '@/utils/misc';

export interface CustomTag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface TagsState {
  tags: CustomTag[];
  addTag: (name: string, color: string) => void;
  updateTag: (id: string, name: string, color: string) => void;
  deleteTag: (id: string) => void;
  getTagByName: (name: string) => CustomTag | undefined;
  loadTags: () => void;
}

const STORAGE_KEY = 'taskflow-tags';

// Default tags
const DEFAULT_TAGS: CustomTag[] = [
  { id: generateId(), name: 'frontend', color: '#3b82f6', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'backend', color: '#8b5cf6', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'bug', color: '#ef4444', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'feature', color: '#10b981', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'design', color: '#ec4899', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'testing', color: '#f59e0b', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'devops', color: '#06b6d4', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'database', color: '#6366f1', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'api', color: '#14b8a6', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'ui/ux', color: '#f97316', createdAt: new Date().toISOString() },
  { id: generateId(), name: 'document', color: '#64748b', createdAt: new Date().toISOString() },
];

// Load tags from localStorage
const loadFromStorage = (): CustomTag[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // If no tags stored, save and return defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TAGS));
    return DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
};

// Save tags to localStorage
const saveToStorage = (tags: CustomTag[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch (error) {
    console.error('Failed to save tags:', error);
  }
};

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: loadFromStorage(),

  addTag: (name: string, color: string) => {
    const newTag: CustomTag = {
      id: generateId(),
      name: name.toLowerCase(),
      color,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const newTags = [...state.tags, newTag];
      saveToStorage(newTags);
      return { tags: newTags };
    });
  },

  updateTag: (id: string, name: string, color: string) => {
    set((state) => {
      const newTags = state.tags.map((tag) =>
        tag.id === id
          ? { ...tag, name: name.toLowerCase(), color }
          : tag
      );
      saveToStorage(newTags);
      return { tags: newTags };
    });
  },

  deleteTag: (id: string) => {
    set((state) => {
      const newTags = state.tags.filter((tag) => tag.id !== id);
      saveToStorage(newTags);
      return { tags: newTags };
    });
  },

  getTagByName: (name: string) => {
    return get().tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
  },

  loadTags: () => {
    set({ tags: loadFromStorage() });
  },
}));
