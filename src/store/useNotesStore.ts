import { create } from 'zustand';
import type { Note } from '@/types';
import { generateId } from '@/utils/misc';

interface NotesState {
  notes: Note[];
  addNote: (content: string, color: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  loadNotes: () => void;
}

const STORAGE_KEY = 'taskflow-notes';

// Load notes from localStorage
const loadFromStorage = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save notes to localStorage
const saveToStorage = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes:', error);
  }
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: loadFromStorage(),

  addNote: (content: string, color: string) => {
    const newNote: Note = {
      id: generateId(),
      content,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const newNotes = [...state.notes, newNote];
      saveToStorage(newNotes);
      return { notes: newNotes };
    });
  },

  updateNote: (id: string, content: string) => {
    set((state) => {
      const newNotes = state.notes.map((note) =>
        note.id === id
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      );
      saveToStorage(newNotes);
      return { notes: newNotes };
    });
  },

  deleteNote: (id: string) => {
    set((state) => {
      const newNotes = state.notes.filter((note) => note.id !== id);
      saveToStorage(newNotes);
      return { notes: newNotes };
    });
  },

  loadNotes: () => {
    set({ notes: loadFromStorage() });
  },
}));
