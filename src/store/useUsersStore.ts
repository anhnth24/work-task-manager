import { create } from 'zustand';
import type { User } from '@/types';
import { generateId } from '@/utils/misc';

interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  getUserById: (id: string) => User | undefined;
  addUser: (name: string, role?: string, avatar?: string) => void;
  updateUser: (id: string, name: string, role?: string, avatar?: string) => void;
  deleteUser: (id: string) => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  
  setUsers: (users) => set({ users }),
  
  getUserById: (id) => get().users.find((u) => u.id === id),

  addUser: (name, role, avatar) => {
    const newUser: User = {
      id: generateId(),
      name,
      role,
      avatar,
    };
    set((state) => ({ users: [...state.users, newUser] }));
  },

  updateUser: (id, name, role, avatar) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, name, role, avatar } : user
      ),
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },
}));
