import { create } from 'zustand';
import type { User } from '@/types';

interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  getUserById: (id: string) => User | undefined;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  
  setUsers: (users) => set({ users }),
  
  getUserById: (id) => get().users.find((u) => u.id === id),
}));
